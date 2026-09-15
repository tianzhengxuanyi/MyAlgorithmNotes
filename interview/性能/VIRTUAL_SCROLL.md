# @tanstack/virtual-core 虚拟滚动实现梳理

本文基于 `@tanstack/virtual-core` **3.17.11** 源码，说明它如何把「只渲染可视区域附近的少量 DOM」这件事做成无 UI 的核心引擎，并给出可对照源码的最小实现。

源码目录：

| 文件 | 职责 |
| --- | --- |
| `packages/virtual-core/src/index.ts` | 全部核心逻辑：`Virtualizer`、观测、测量、范围、滚动 |
| `packages/virtual-core/src/lazy-measurements.ts` | 单列路径的惰性 `VirtualItem` 物化 |
| `packages/virtual-core/src/utils.ts` | `memo` / `approxEqual` / `debounce` |

框架适配器（React / Vue / Solid / Svelte）不实现虚拟滚动算法，只负责：构造 `Virtualizer`、注入观测与 `scrollTo`、在 `onChange` 时触发重渲染。

---

## 1. 一句话原理

虚拟列表不创建 N 个真实节点，而是：

1. 用估计高度（或已测高度）算出每项的 `start / size / end`，得到一条「虚拟尺子」。
2. 用当前 `scrollOffset` 和视口高度，在尺子上二分出可见区间 `[startIndex, endIndex]`。
3. 再向外扩 `overscan` 行，只渲染这些项。
4. 用一个撑开滚动条的容器（sizer）高度 = 全部项累计高度。
5. 可见项 `position: absolute`，用 `transform: translateY(item.start)` 放到正确位置。

固定高度时，第 1 步就是 `start = index * itemSize`。本库的难点在于：**高度可变、滚动中途测量、前置插入、贴底聊天、多列瀑布流**，测量变化后仍要保住视口锚点。

```
scrollElement (overflow: auto)
  └── sizer (height = getTotalSize())
        └── item_i (absolute, translateY(item.start))
        └── item_j
        └── ... 仅可视 + overscan
```

---

## 2. 核心类型

定义位置：`packages/virtual-core/src/index.ts`。

```54:70:packages/virtual-core/src/index.ts
export interface Range {
  startIndex: number
  endIndex: number
  overscan: number
  count: number
}

type Key = number | string | bigint

export interface VirtualItem {
  key: Key
  index: number
  start: number
  end: number
  size: number
  lane: number
}
```

`VirtualItem` 是渲染层真正消费的数据：

- `start` / `end`：该项在虚拟内容轴上的区间（像素）
- `size`：`end - start`
- `lane`：列号，单列恒为 `0`；`lanes > 1` 时用于瀑布流 / 网格
- `key`：由 `getItemKey(index)` 得到，测量缓存按 key 存，避免列表重排后尺寸错位

用户必须提供的选项（`VirtualizerOptions`，约 320–379 行）：

| 选项 | 含义 |
| --- | --- |
| `count` | 列表总条数 |
| `getScrollElement` | 滚动容器（或 `window`） |
| `estimateSize(index)` | 尚未实测时的高度/宽度估计 |
| `scrollToFn` | 写 `scrollTop` / `scrollLeft`（适配器注入） |
| `observeElementRect` | 观测视口尺寸 |
| `observeElementOffset` | 观测滚动偏移 |

常用可选：`overscan`、`horizontal`、`gap`、`lanes`、`getItemKey`、`paddingStart/End`、`anchorTo`、`followOnAppend`。

---

## 3. 运行时主循环

`Virtualizer` 本身不渲染。适配器按这个生命周期驱动它：

```
new Virtualizer(options)
        │
        ▼
   _didMount()          注册卸载清理
        │
        ▼
   _willUpdate()        绑定 scrollElement，挂上 Resize / scroll 监听
        │
        ├─ observeElementRect  → scrollRect（视口宽高）
        ├─ observeElementOffset → scrollOffset + isScrolling
        └─ 项上的 ResizeObserver → resizeItem()
                │
                ▼
          maybeNotify()
                │
                ├─ calculateRange()
                └─ onChange(instance, sync)  → 框架重渲染
                        │
                        ▼
              getVirtualItems()
                = rangeExtractor(range) 映射到 measurements[i]
```

关键入口：

| 步骤 | 方法 | 源码位置 |
| --- | --- | --- |
| 合并默认配置 | `setOptions` | `index.ts` 574–735 |
| 挂载清理 | `_didMount` | 860–864 |
| 绑定滚动容器 | `_willUpdate` | 866–1079 |
| 视口尺寸 | `observeElementRect` / `observeWindowRect` | 98–170 |
| 滚动偏移 | `observeOffset` → `observeElementOffset` | 180–245 |
| 构建尺子 | `getMeasurements` | 1315–1535 |
| 可见区间 | `calculateRange` → `calculateRangeImpl` | 1537–1566, 2173–2246 |
| 加上 overscan | `getVirtualIndexes` + `defaultRangeExtractor` | 86–96, 1568–1600 |
| 给 UI 的数组 | `getVirtualItems` | 1787–1805 |
| 总高度 | `getTotalSize` | 2021–2060 |
| 实测一项 | `measureElement` / `resizeItem` | 1648–1785 |
| 滚动补偿 | `applyScrollAdjustment` | 745–800 |
| 通知 UI | `notify` / `maybeNotify` | 737–739, 802–824 |

Vue 适配器把这件事写得很直白（`packages/vue-virtual/src/index.ts` 25–70 行）：`new Virtualizer` → `_didMount` → `watch` 里 `setOptions` + `_willUpdate` → `onChange` 时 `triggerRef`。

---

## 4. 测量：从估计高度到真实高度

### 4.1 先铺一条虚拟尺子

`getMeasurements`（1315 行起）按 index 从左到右铺开：

```
start[0] = paddingStart + scrollMargin
size[i]  = itemSizeCache.get(key) ?? estimateSize(i)
end[i]   = start[i] + size[i]
start[i+1] = end[i] + gap
```

`itemSizeCache` 是 `Map<Key, number>`。没测过的项永远走 `estimateSize`，测过的项用真实像素。某项尺寸变了，只从 `pendingMin` 起向后重算，前面的 `start` 可以复用。

### 4.2 单列快路径（默认 `lanes === 1`）

不给每一项立刻分配 `{ start, size, end, ... }` 对象。而是写入 `Float64Array`，步长 2：`[start0, size0, start1, size1, ...]`。

`createLazyMeasurementsView`（`lazy-measurements.ts` 14–47 行）用 `Proxy` 在第一次按下标读取时才物化 `VirtualItem`。万级列表里，真正可见的通常只有几十项，其余只占 16 字节 × 2 的 typed array。

二分查找可见范围时也会直接读 typed array，避开 Proxy（`findNearestBinarySearchFlat`，2152–2171 行）。

### 4.3 何时真正量 DOM

两条路径都会进 `resizeItem`：

1. **同步**：`measureElement(node)`（1648 行）。渲染后把节点当 ref 交给虚拟器。空闲或程序化滚动时立刻读尺寸，好让 `scrollToIndex` 当帧对准。
2. **异步**：内部 `ResizeObserver`（505–567 行）。节点后续变高（图片加载、聊天流式输出）时再量。

默认 `measureElement` 函数（247–290 行）优先级：

1. `useCachedMeasurements` 开启 → 只信缓存 / 估计，不再读 DOM
2. 有 `ResizeObserverEntry.borderBoxSize` → 用 `blockSize` / `inlineSize`
3. 无 entry（同步路径）且缓存已有 → 直接返回缓存，避免同步 layout
4. 否则读 `offsetHeight` / `offsetWidth`

节点必须带 `data-index`（可用 `indexAttribute` 改）。`indexFromElement`（1602–1614 行）靠这个属性反查 index。

### 4.4 尺寸变化后如何保住视口

`resizeItem`（1684–1785 行）算出 `delta = newSize - oldSize`，然后决定要不要把 `scrollTop` 也加上 `delta`。

默认策略（1719–1733 行）：

- **第一次测量**（估计 → 真实）：只要该项顶部在视口上方（`itemStart < scrollOffset`），就补偿。否则视口内容会跳。
- **再次测量**：仅当该项**完全**在视口上方（`itemStart + itemSize <= scrollOffset`）才补偿。横跨视口、在底部往下长的项（流式聊天气泡）不补偿，否则会把视口一点点拖下去（#1218）。
- 正在向上滚时（`scrollDirection === 'backward'`）也不补偿，避免「往上滑时条目乱跳」。

`anchorTo: 'end'` 且当前贴底时，补偿量改为「总高度差」，而不是单项 `delta`，这样底部锚点聊天列表才能跟着新消息走。

补偿最终走 `applyScrollAdjustment`（745 行）：调用 `scrollToFn` 写滚动位置，并立刻把 `scrollOffset` 加上 delta，不必等下一次 `scroll` 事件。iOS WebKit 在惯性滚动中写 `scrollTop` 会取消动量，所以触摸 / 惯性期间把 delta 攒到 `_iosDeferredAdjustment`，停稳后再刷。

---

## 5. 可见范围：二分 + 线性扫描

这是虚拟滚动的几何核心，`calculateRangeImpl`（2173–2246 行）。

视口在内容轴上的区间是 `[scrollOffset, scrollOffset + outerSize)`。

**单列：**

1. 在 `measurements[i].start` 上二分，找到最后一个 `start <= scrollOffset` 的 index → `startIndex`
2. 从 `startIndex` 往前走，直到 `end >= scrollOffset + outerSize` → `endIndex`

```2173:2202:packages/virtual-core/src/index.ts
function calculateRangeImpl(
  measurements: Array<VirtualItem>,
  outerSize: number,
  scrollOffset: number,
  lanes: number,
  flat: Float64Array | null,
) {
  const lastIndex = measurements.length - 1
  // ...
  if (lanes === 1 && flat !== null) {
    const startIndex = findNearestBinarySearchFlat(
      flat,
      lastIndex,
      scrollOffset,
    )
    let endIndex = startIndex
    const limit = scrollOffset + outerSize
    while (
      endIndex < lastIndex &&
      flat[endIndex * 2]! + flat[endIndex * 2 + 1]! < limit
    ) {
      endIndex++
    }
    return { startIndex, endIndex }
  }
}
```

`findNearestBinarySearch`（2123–2147 行）是标准二分：找 `getCurrentValue(i)` 最接近且不超过 `value` 的下标。

**多列（`lanes > 1`）：** 不能只看一条轴。向前扩到每一列都覆盖到视口底；向后扩到每一列都覆盖到视口顶；再把起止 index 对齐到列边界（2239–2242 行）。

算出的 `{ startIndex, endIndex }` 再交给 `rangeExtractor`。默认实现（86–96 行）：

```
renderStart = max(0, startIndex - overscan)
renderEnd   = min(count - 1, endIndex + overscan)
```

`overscan` 默认 `1`。加大能减少快速滚动时的白屏，代价是多渲染几项。

`getVirtualItems` 只是把这些 index 映到 `measurements[i]`。UI 用 `item.start` 做位移，用 `item.size` 做该项高度。

---

## 6. 滚动容器如何被「骗」出完整滚动条

`getTotalSize`（2021–2060 行）：

- 单列：最后一项的 `end - scrollMargin + paddingEnd`
- 多列：各 lane 最大 `end`，再加 padding

内层 sizer 设成这个高度后，浏览器以为内容有那么高，滚动条和 `scrollTop` 量级才是对的。可见项并不参与文档流，只绝对定位在 sizer 里。

程序化滚动：

| API | 作用 | 位置 |
| --- | --- | --- |
| `scrollToOffset(px)` | 滚到内容轴偏移 | 1923–1950 |
| `scrollToIndex(i)` | 滚到某项，支持 `start/center/end/auto` | 1952–1984 |
| `scrollBy(delta)` | 相对滚动 | 1986–2005 |
| `scrollToEnd()` | 滚到最后一项 | 2007–2019 |

`scrollToIndex` 不会只 `scrollTo` 一次。动态高度下，滚到目标的过程中会测到新项、整条尺子会变，目标像素会漂。所以它写入 `scrollState`，用 rAF 跑 `reconcileScroll`（1158–1236 行）：目标变了就再滚；靠近时从 `smooth` 切到 `auto`；稳定一帧后再精确落地。

---

## 7. 多列 / 瀑布流

`lanes > 1` 时（1451–1525 行）：

1. 尚未填满各列：按 `i % lanes` 铺第一行（和网格一致）
2. 之后每次放到**当前最短**的那一列（O(lanes) 取 argmin）
3. `laneAssignmentMode: 'estimate'`（默认）会缓存 index → lane，避免重测后列跳动；`'measured'` 则等该项有真实尺寸才锁列

这就是 masonry 的核心：不是二维虚拟网格（行列各自虚拟化），而是一维列表按最短列堆叠。二维表格通常是两个 `Virtualizer`（横 + 纵），见 `examples/react` 下的 grid 示例。

---

## 8. 数据变化时的锚点（prepend / 贴底）

`setOptions`（620–734 行）在 `anchorTo: 'end'` 且列表两端 key 变化时：

1. 记下当前视口里那一项的 `key` 和「该项 start 到 scrollOffset 的距离」
2. 强制从 0 重建 measurements（`pendingMin = 0`）
3. 在新尺子上找到同一 key，把 `scrollOffset` 改成 `newStart + 旧距离`

这样在列表头部插入历史消息时，眼睛看到的那一条不会被顶走。若用户本来就贴底，且 `followOnAppend` 开启，则改为 `scrollToEnd`。

`isAppendWithTrim`（404–432 行）识别「尾部追加的同时头部裁掉旧消息、count 可能不变」的滑动窗口，避免聊天列表截断后丢掉贴底。

---

## 9. 源码地图（按阅读顺序）

建议按下面顺序读 `index.ts`，比从头到尾扫 2200 行快。

| 顺序 | 主题 | 符号 | 行号 |
| --- | --- | --- | --- |
| 1 | 可见项数据结构 | `VirtualItem` / `Range` | 54–70 |
| 2 | 配置 | `VirtualizerOptions` | 320–379 |
| 3 | overscan 展开 | `defaultRangeExtractor` | 86–96 |
| 4 | 视口观测 | `observeElementRect` | 98–145 |
| 5 | 滚动观测 | `observeOffset` | 180–228 |
| 6 | 读 DOM 尺寸 | `measureElement`（函数） | 247–290 |
| 7 | 写滚动位置 | `elementScroll` / `windowScroll` | 292–316 |
| 8 | 实例状态 | `class Virtualizer` 字段 | 434–568 |
| 9 | 选项与 prepend 锚点 | `setOptions` | 574–735 |
| 10 | 尺寸变化补偿 | `applyScrollAdjustment` | 745–800 |
| 11 | 绑定容器 | `_willUpdate` | 866–1079 |
| 12 | 铺尺子 | `getMeasurements` | 1315–1535 |
| 13 | 可见区间 | `calculateRange` / `calculateRangeImpl` | 1537–1566, 2173–2246 |
| 14 | 二分 | `findNearestBinarySearch` | 2123–2171 |
| 15 | 渲染索引 | `getVirtualIndexes` / `getVirtualItems` | 1568–1600, 1787–1805 |
| 16 | 测一项 | `measureElement` / `resizeItem` | 1648–1785 |
| 17 | 总高度 | `getTotalSize` | 2021–2060 |
| 18 | 滚到 index | `getOffsetForIndex` / `scrollToIndex` / `reconcileScroll` | 1887–1984, 1158–1236 |
| 19 | 惰性物化 | `createLazyMeasurementsView` | `lazy-measurements.ts` 全文 |
| 20 | 依赖缓存 | `memo` | `utils.ts` 5–87 |

滚动事件路径（`_willUpdate` 里注册的 callback，899–966 行）还处理了几件「能跑但会抖」的细节：自身 `scrollTo` 的回读与亚像素取整（`_intendedScrollOffset`）、Safari 无位移的假 scroll 事件、补偿写入被 `scrollHeight` 钳位后的重试（`_clampedAdjustment`）。这些不是最小实现所必需，但是这个库能在动态高度下稳定的原因。

---

## 10. 最小实现示例

### 10.1 固定高度：算法内核（约 40 行）

这是本库在 `estimateSize` 恒定、且从不调用 `measureElement` 时的数学本质。理解它之后，再看 `getMeasurements` + `calculateRangeImpl` 只是把 `index * size` 换成了前缀和 + 二分。

```ts
type VirtualItem = {
  index: number
  start: number
  size: number
  end: number
}

function getVirtualRange(opts: {
  count: number
  itemSize: number
  scrollOffset: number
  viewportSize: number
  overscan?: number
}) {
  const { count, itemSize, scrollOffset, viewportSize, overscan = 1 } = opts

  const startIndex = Math.max(0, Math.floor(scrollOffset / itemSize) - overscan)
  const endIndex = Math.min(
    count - 1,
    Math.ceil((scrollOffset + viewportSize) / itemSize) + overscan,
  )

  const items: VirtualItem[] = []
  for (let i = startIndex; i <= endIndex; i++) {
    const start = i * itemSize
    items.push({ index: i, start, size: itemSize, end: start + itemSize })
  }

  return { totalSize: count * itemSize, items }
}

function render(parent: HTMLElement, state: ReturnType<typeof getVirtualRange>) {
  parent.innerHTML = ''
  const sizer = document.createElement('div')
  sizer.style.position = 'relative'
  sizer.style.height = `${state.totalSize}px`

  for (const item of state.items) {
    const el = document.createElement('div')
    el.style.position = 'absolute'
    el.style.top = '0'
    el.style.left = '0'
    el.style.width = '100%'
    el.style.height = `${item.size}px`
    el.style.transform = `translateY(${item.start}px)`
    el.textContent = `Row ${item.index}`
    sizer.appendChild(el)
  }
  parent.appendChild(sizer)
}

const parent = document.getElementById('list')!
parent.style.overflow = 'auto'
parent.style.height = '400px'

const redraw = () => {
  render(
    parent,
    getVirtualRange({
      count: 10000,
      itemSize: 35,
      scrollOffset: parent.scrollTop,
      viewportSize: parent.clientHeight,
      overscan: 5,
    }),
  )
}

parent.addEventListener('scroll', redraw, { passive: true })
redraw()
```

可变高度时，把 `start = i * itemSize` 换成前缀和，把 `floor(scrollTop / itemSize)` 换成二分，就是 `getMeasurements` + `calculateRangeImpl`：

```ts
function buildOffsets(sizes: number[], gap = 0) {
  const start: number[] = new Array(sizes.length)
  let acc = 0
  for (let i = 0; i < sizes.length; i++) {
    start[i] = acc
    acc += sizes[i] + gap
  }
  return { start, totalSize: acc - gap }
}

function findStartIndex(starts: number[], scrollOffset: number) {
  let low = 0
  let high = starts.length - 1
  while (low <= high) {
    const mid = (low + high) >> 1
    if (starts[mid]! < scrollOffset) low = mid + 1
    else if (starts[mid]! > scrollOffset) high = mid - 1
    else return mid
  }
  return low > 0 ? low - 1 : 0
}
```

对应源码：`getMeasurements` 单列循环（1408–1419 行）、`findNearestBinarySearchFlat`（2152–2171 行）。

---

### 10.2 直接使用 Virtualizer（无框架，动态高度）

适配器注入三件套：`observeElementRect`、`observeElementOffset`、`elementScroll`。动态高度时把节点交给 `measureElement`，并设置 `data-index`。

```html
<div id="parent" style="height:400px;overflow:auto;"></div>
```

```ts
import {
  Virtualizer,
  elementScroll,
  observeElementOffset,
  observeElementRect,
} from '@tanstack/virtual-core'

const parent = document.querySelector<HTMLElement>('#parent')!

const virtualizer = new Virtualizer<HTMLElement, HTMLElement>({
  count: 10000,
  getScrollElement: () => parent,
  estimateSize: () => 40,
  overscan: 5,
  getItemKey: (index) => index,
  scrollToFn: elementScroll,
  observeElementRect,
  observeElementOffset,
  onChange: (instance) => {
    paint(instance)
  },
})

function paint(instance: Virtualizer<HTMLElement, HTMLElement>) {
  parent.replaceChildren()

  const sizer = document.createElement('div')
  sizer.style.position = 'relative'
  sizer.style.width = '100%'
  sizer.style.height = `${instance.getTotalSize()}px`

  for (const item of instance.getVirtualItems()) {
    const el = document.createElement('div')
    el.setAttribute('data-index', String(item.index))
    el.style.position = 'absolute'
    el.style.top = '0'
    el.style.left = '0'
    el.style.width = '100%'
    el.style.transform = `translateY(${item.start}px)`
    el.textContent = `Row ${item.index}`
    sizer.appendChild(el)
    instance.measureElement(el)
  }

  parent.appendChild(sizer)
}

const unmount = virtualizer._didMount()
virtualizer._willUpdate()
paint(virtualizer)

// 卸载时：
// unmount()
```

和源码的对应关系：

| 你写的代码 | 库内部发生的事 |
| --- | --- |
| `new Virtualizer` | `setOptions` 填默认值（overscan=1 等） |
| `_willUpdate()` | 监听 parent 的 resize / scroll |
| `scroll` 事件 | 更新 `scrollOffset` → `maybeNotify` → `onChange` |
| `getVirtualItems()` | `getMeasurements` → `calculateRange` → `rangeExtractor` |
| `getTotalSize()` | 最后一项 `end + paddingEnd` |
| `measureElement(el)` | 读高度写入 `itemSizeCache`，必要时补偿 `scrollTop` |
| `_didMount()` 返回值 | 卸掉监听与 ResizeObserver |

---

### 10.3 React 最小接入（对照官方 fixed 示例）

框架层只是把上一节包进 hook。官方固定高度示例如下，摘自 `examples/react/fixed/src/main.tsx`：

```tsx
const parentRef = React.useRef<HTMLDivElement>(null)

const rowVirtualizer = useVirtualizer({
  count: 10000,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 35,
  overscan: 5,
})

return (
  <div ref={parentRef} style={{ height: 200, overflow: 'auto' }}>
    <div
      style={{
        height: rowVirtualizer.getTotalSize(),
        position: 'relative',
        width: '100%',
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => (
        <div
          key={virtualRow.index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: virtualRow.size,
            transform: `translateY(${virtualRow.start}px)`,
          }}
        >
          Row {virtualRow.index}
        </div>
      ))}
    </div>
  </div>
)
```

动态高度只需两处改动：

1. `estimateSize` 仍给一个近似值
2. 项节点：`ref={rowVirtualizer.measureElement}` 且 `data-index={virtualRow.index}`

`useVirtualizer`（`packages/react-virtual/src/index.tsx`）会自动补上 `observeElementRect`、`observeElementOffset`、`elementScroll`，并在 `onChange` 里 `useReducer` 强制刷新。

---

## 11. 把整条链路收成一张图

```
count, estimateSize, getItemKey
              │
              ▼
     itemSizeCache (实测覆盖估计)
              │
              ▼
        getMeasurements()          前缀和 / 多列最短 lane
              │
              ▼
 scrollOffset + viewportSize
              │
              ▼
      calculateRangeImpl()         二分 start + 扫描 end
              │
              ▼
     defaultRangeExtractor()       ± overscan
              │
              ▼
       getVirtualItems()           只把可见项交给 UI
              │
              ▼
   sizer.height = getTotalSize()
   item.transform = translateY(start)
              │
              ▼
     measureElement / ResizeObserver
              │
              ▼
          resizeItem(delta)
              │
              ├─ 更新 cache，从 pendingMin 重算尺子
              └─ applyScrollAdjustment 保住视口锚点
```

最小可用实现只需要图中的「前缀和 → 二分范围 → sizer + absolute」。`virtual-core` 多出来的代码，几乎都在服务：**动态测量不跳、惯性滚动不中断、prepend 不丢位置、贴底聊天能跟上、多列不错位**。
