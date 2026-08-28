# 《Vue.js设计与实现》第9‑11章 Diff算法｜精简面试笔记 + 完整可运行源码
> 原书第三篇渲染器；9简单Diff、10双端Diff、11快速Diff（Vue3真实使用的算法）
> 前置依赖：第7、8章渲染器基础；笔记只保留面试高频重点；代码对齐书中最终实现。

## 第9章 简单Diff算法
### 📖精简面试笔记
**核心场景：新旧两组子节点都是数组，对比更新子节点。简单Diff：****key + 索引遍历，寻找可复用节点，移动DOM**。

1. **DOM复用前提**
    - vnode的`key`必须相同；key本质是节点唯一标识；key相同代表可以复用DOM元素，只需要更新节点的props/children，**不要销毁重建DOM**。
    - ❗不能用数组index做key：数组删除、插入会造成index错乱，导致错误复用DOM。

2. **简单Diff整体流程**
    1. 遍历新子节点，在旧子节点数组中查找key相同的vnode；
    2. 找到可复用节点：执行`patch`更新节点；记录旧节点最大索引`maxIndex`；
        - 如果当前旧节点索引 < `maxIndex`：说明DOM需要**移动**，把该节点移动到旧节点之后；
        - 如果大于maxIndex：不需要移动，更新maxIndex；
    3. 新节点在旧数组找不到key：代表是**新增节点**，挂载；
    4. 遍历旧节点，在新节点找不到对应key：代表节点**要删除**，执行unmount卸载。

3. **简单Diff缺陷（面试必问）**
    - 只能做**向后查找**；只处理“节点向后移动”场景；
    - 遇到节点**向前移动**（头部插入）会产生很多不必要DOM移动操作；性能差。
    - 所以Vue2没有用简单Diff，Vue2使用**双端Diff**。

> 一句话：简单Diff通过key找可复用节点，依靠`maxIndex`判断是否移动DOM；适合简单场景，向前移动场景性能不佳。

### 💻第9章｜简单Diff完整源码（基于书中实现）
```js
/**
 * 简单Diff算法 —— 处理两组数组子节点
 * @param {*} n1 旧vnode
 * @param {*} n2 新vnode
 * @param {*} container 容器
 */
function patchSimpleDiff(n1, n2, container) {
  const oldChildren = n1.children
  const newChildren = n2.children

  // 建立key -> index 旧节点索引map
  const keyToOldIndex = new Map()
  oldChildren.forEach((oldVnode, idx) => {
    keyToOldIndex.set(oldVnode.key, idx)
  })

  let maxIndex = 0 // 记录已经处理过的旧节点最大下标

  for (let i = 0; i < newChildren.length; i++) {
    const newVnode = newChildren[i]
    // 在旧数组查找key对应的节点
    const oldIdx = keyToOldIndex.get(newVnode.key)

    if (oldIdx !== undefined) {
      // 可复用节点，执行patch更新
      const oldVnode = oldChildren[oldIdx]
      patch(oldVnode, newVnode, container)

      if (oldIdx < maxIndex) {
        // 需要移动DOM：移动到上一个处理完节点的后面
        const anchor = newChildren[i - 1].el.nextSibling
        insert(newVnode.el, container, anchor)
      } else {
        maxIndex = oldIdx
      }
      // 标记旧节点已经被复用
      oldChildren[oldIdx] = null
    } else {
      // 全新节点，挂载
      patch(null, newVnode, container)
    }
  }

  // 旧数组中不为null，代表新数组没有这个key，需要删除
  for (let i = 0; i < oldChildren.length; i++) {
    const oldVnode = oldChildren[i]
    if (oldVnode) {
      remove(oldVnode.el)
    }
  }
}
```

---

## 第10章 双端Diff算法（Vue2使用）
### 📖精简面试笔记
> Vue2真实使用双端Diff；**四个指针：旧头、旧尾；新头、新尾**，从两端向中间对比。

1. 四个指针
- `oldStartIdx`：旧子数组头指针；`oldEndIdx`：旧子数组尾指针
- `newStartIdx`：新子数组头指针；`newEndIdx`：新子数组尾指针

2. 双端比较四步顺序（固定顺序）
1. 新头 vs 旧头：key相等，直接patch，两个头指针同时++；无需移动DOM
2. 新尾 vs 旧尾：key相等，直接patch，两个尾指针同时--；无需移动DOM
3. 新头 vs 旧尾：key相等 → patch；**把旧尾节点移动到旧头前面**；`oldEndIdx--`，`newStartIdx++`
4. 新尾 vs 旧头：key相等 → patch；**把旧头节点移动到旧尾后面**；`oldStartIdx++`，`newEndIdx--`

> 以上4步都不命中：去旧数组中查找`newStartVnode.key`
> - 找到：取出对应节点，移动到旧头前面；
> - 找不到：说明是新增节点，挂载到旧头前面。

3. **循环终止条件**：`oldStartIdx > oldEndIdx` 或者 `newStartIdx > newEndIdx`
    - 循环结束，如果新数组还有剩余节点：批量挂载新增节点；
    - 如果旧数组还有剩余节点：批量卸载删除节点。

4. **优缺点**
✅ 对比简单Diff：节点头部插入、头部移动场景性能大幅优化，减少DOM移动次数。
❌ 缺点：**对于乱序超长数组依然有性能瓶颈**；所以Vue3升级到快速Diff。

> 面试一句话：双端Diff从数组两头向中间对比，优先处理头尾四种命中场景，减少DOM移动操作，是Vue2使用的算法。

### 💻第10章｜双端Diff完整源码（原书实现）
```js
/**
 * 双端Diff（Vue2使用）
 * @param {*} n1
 * @param {*} n2
 * @param {*} container
 */
function patchTwoEndDiff(n1, n2, container) {
  const oldChildren = n1.children
  const newChildren = n2.children

  let oldStartIdx = 0
  let oldEndIdx = oldChildren.length - 1
  let newStartIdx = 0
  let newEndIdx = newChildren.length - 1

  let oldStartVnode = oldChildren[oldStartIdx]
  let oldEndVnode = oldChildren[oldEndIdx]
  let newStartVnode = newChildren[newStartIdx]
  let newEndVnode = newChildren[newEndIdx]

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIdx]
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIdx]
    } else if (oldStartVnode.key === newStartVnode.key) {
      // ①旧头 === 新头
      patch(oldStartVnode, newStartVnode, container)
      oldStartVnode = oldChildren[++oldStartIdx]
      newStartVnode = newChildren[++newStartIdx]
    } else if (oldEndVnode.key === newEndVnode.key) {
      // ②旧尾 === 新尾
      patch(oldEndVnode, newEndVnode, container)
      oldEndVnode = oldChildren[--oldEndIdx]
      newEndVnode = newChildren[--newEndIdx]
    } else if (oldStartVnode.key === newEndVnode.key) {
      // ③旧头 === 新尾；节点移动到旧尾后面
      patch(oldStartVnode, newEndVnode, container)
      insert(oldStartVnode.el, container, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIdx]
      newEndVnode = newChildren[--newEndIdx]
    } else if (oldEndVnode.key === newStartVnode.key) {
      // ④旧尾 === 新头；节点移动到旧头前面
      patch(oldEndVnode, newStartVnode, container)
      insert(oldEndVnode.el, container, oldStartVnode.el)
      oldEndVnode = oldChildren[--oldEndIdx]
      newStartVnode = newChildren[++newStartIdx]
    } else {
      // 四个都不匹配，去旧数组找新头key
      const idxInOld = oldChildren.findIndex(item => item && item.key === newStartVnode.key)
      if (idxInOld >= 0) {
        const moveVnode = oldChildren[idxInOld]
        patch(moveVnode, newStartVnode, container)
        insert(moveVnode.el, container, oldStartVnode.el)
        oldChildren[idxInOld] = null
      } else {
        // 全新节点，挂载
        patch(null, newStartVnode, container, oldStartVnode.el)
      }
      newStartVnode = newChildren[++newStartIdx]
    }
  }

  // 处理新增节点：新数组还有剩余
  if (newStartIdx <= newEndIdx) {
    const anchor = newChildren[newEndIdx + 1] ? newChildren[newEndIdx + 1].el : null
    while (newStartIdx <= newEndIdx) {
      patch(null, newChildren[newStartIdx], container, anchor)
      newStartIdx++
    }
  }
  // 删除节点：旧数组还有剩余
  if (oldStartIdx <= oldEndIdx) {
    while (oldStartIdx <= oldEndIdx) {
      const vnode = oldChildren[oldStartIdx]
      if (vnode) remove(vnode.el)
      oldStartIdx++
    }
  }
}
```

---

## 第11章 快速Diff算法（**Vue3实际使用**｜面试重中之重）
### 📖精简面试笔记
> 快速Diff核心思路：**预处理 —— 前置相同节点、后置相同节点直接跳过；剩下中间乱序部分使用最长递增子序列求解最小移动DOM。**

### 步骤拆解
1. **预处理：跳过相同前置节点**
    从头部开始循环，新旧子节点key相等，直接patch更新；直到key不相等，停止。
2. **预处理：跳过相同后置节点**
    从尾部开始循环，新旧子节点key相等，直接patch更新；直到key不相等，停止。
> 经过1、2处理后，剩下**中间一段乱序的新旧子数组**，只需要处理这部分。

3. **判断是否仅有新增节点**
旧数组已经遍历完毕：剩下新中间节点全部新增挂载，流程结束。

4. **处理中间乱序片段（核心）**
    ① 构建`key -> newIndex`映射表；
    ② 遍历旧中间子节点：
        - key在新映射表存在：可复用，patch；记录`source`数组（旧节点在新数组中的下标）；
        - key不存在：直接删除旧节点。
        - 注意：过滤掉不在中间区间的下标。
    ③ **求source数组的最长递增子序列**；得到不需要移动的元素下标序列。
    > 💡核心原理：最长递增子序列代表：**相对顺序没有改变，DOM不需要移动；剩下其余节点都需要移动**。
    ④ **倒序遍历新中间子节点**：
        - 如果下标存在于最长递增子序列，跳过（不移动）；
        - 其余节点调用`insert`移动DOM到对应锚点位置。

### 面试高频考点
1. 快速Diff三大步骤：**预处理前后缀 → 建立映射得到source数组 → 最长递增子序列最小移动DOM**
2. 为什么用**最长递增子序列**？👉 在一堆乱序下标中，找到**最多数量不需要移动的节点**；移动剩下节点，DOM移动次数最小，性能最优。
3. 和双端Diff对比：
    - 双端Diff：靠4个指针做4次两端比对；乱序长数组DOM移动次数较多。
    - 快速Diff：预处理剥离前后稳定片段；中间乱序部分用最长递增子序列计算最小移动，**大数据乱序场景性能优于Vue2双端Diff**。

> 一句话背诵：Vue3快速Diff，先跳过前后相同节点；中间乱序片段构建source数组，通过最长递增子序列算出最少需要移动的节点，倒序执行DOM移动，实现最小DOM操作。

### 💻第11章｜快速Diff完整源码（书中实现，含最长递增子序列）
```js
/**
 * 求最长递增子序列下标 —— Vue3源码工具函数
 * @param {number[]} arr source数组
 * @returns number[] 保存元素下标
 */
function getSequence(arr) {
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      while (u < v) {
        c = ((u + v) >> 1)
        if (arr[result[c]] < arrI) {
          u = c + 1
        } else {
          v = c
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) p[i] = result[u - 1]
        result[u] = i
      }
    }
  }
  u = result.length
  v = result[result.length - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}

/**
 * 快速Diff （Vue3真实使用）
 * @param {*} n1 旧vnode
 * @param {*} n2 新vnode
 * @param {*} container
 */
function patchFastDiff(n1, n2, container) {
  const oldChildren = n1.children
  const newChildren = n2.children

  let j = 0
  let oldEnd = oldChildren.length - 1
  let newEnd = newChildren.length - 1

  // 1. 处理前置相同节点
  while (j <= oldEnd && j <= newEnd) {
    const oldV = oldChildren[j]
    const newV = newChildren[j]
    if (oldV.key !== newV.key) break
    patch(oldV, newV, container)
    j++
  }

  // 2. 处理后置相同节点
  while (j <= oldEnd && j <= newEnd) {
    const oldV = oldChildren[oldEnd]
    const newV = newChildren[newEnd]
    if (oldV.key !== newV.key) break
    patch(oldV, newV, container)
    oldEnd--
    newEnd--
  }

  // 3. 旧数组遍历完，剩余新节点全部新增
  if (j > oldEnd && j <= newEnd) {
    const anchorIdx = newEnd + 1
    const anchor = anchorIdx < newChildren.length ? newChildren[anchorIdx].el : null
    while (j <= newEnd) {
      patch(null, newChildren[j], container, anchor)
      j++
    }
  } else {
    // 中间乱序片段处理
    const countNew = newEnd - j + 1
    const source = new Array(countNew).fill(-1)

    // key -> newIndex
    const keyIndex = new Map()
    for (let i = j; i <= newEnd; i++) {
      keyIndex.set(newChildren[i].key, i - j)
    }

    // 遍历旧中间节点
    for (let i = j; i <= oldEnd; i++) {
      const oldV = oldChildren[i]
      const newIdx = keyIndex.get(oldV.key)
      if (newIdx !== undefined) {
        patch(oldV, newChildren[j + newIdx], container)
        source[newIdx] = i
      } else {
        remove(oldV.el)
      }
    }

    // 获取最长递增子序列下标
    const seq = getSequence(source)
    let seqIdx = seq.length - 1
    // 倒序遍历新中间节点，执行移动
    for (let i = countNew - 1; i >= 0; i--) {
      const posInNew = j + i
      const newVnode = newChildren[posInNew]
      const anchor = newChildren[posInNew + 1] ? newChildren[posInNew + 1].el : null
      if (source[i] === -1) {
        // 全新节点，挂载
        patch(null, newVnode, container, anchor)
      } else {
        if (seqIdx >= 0 && seq[seqIdx] === i) {
          // 在最长递增子序列内，不需要移动
          seqIdx--
        } else {
          // 需要移动DOM
          insert(newVnode.el, container, anchor)
        }
      }
    }
  }
}
```

## 📚 Diff算法面试对比总表（背诵）
| 算法 | 使用版本 | 核心思路 | 优点 | 缺点 |
|---|---|---|---|---|
| 简单Diff | 教学示例 | key+maxIndex，单向向后查找 | 实现简单 | 头部插入移动开销大 |
| 双端Diff | Vue2 | 新旧头尾四指针双向比对 | 头尾场景性能好 | 超长乱序数组DOM移动多 |
| 快速Diff | Vue3 | 预处理前后缀 + source数组 + 最长递增子序列 | **最小化DOM移动次数，乱序大数组性能最好** | 算法逻辑复杂度更高 |

## 高频面试追问
### Q：最长递增子序列的作用？
> 在source数组中，找出下标相对顺序不变的一批节点，这批节点DOM位置不需要动；剩下节点执行移动；保证移动DOM次数最少。

### Q：为什么快速Diff要倒序遍历子节点执行移动？
> DOM的`insert`是插入到锚点**前面**；倒序可以保证锚点一直有效，不会因为前面节点移动把锚点元素挪走。

### Q：key用index会发生什么？
> 数组删除/插入元素，index会发生偏移，key错误匹配，DOM发生错误复用，渲染错乱，表单状态异常。

---