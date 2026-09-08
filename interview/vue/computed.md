## Vue 计算属性的实现原理是什么

### 30 秒口播（优先背这段）

computed 本质是一个**带缓存的懒执行 effect**。创建时用 `lazy: true` 包住 getter，**不立刻计算**。首次读取 `computed.value` 时才执行 getter，内部访问响应式数据完成依赖收集，结果写入缓存，并把 `dirty` 置为 false。之后只要依赖没变，再读就直接返回缓存。依赖变了也不会立刻重算，只是走 scheduler 把 `dirty` 标成 true，并手动 `trigger` 通知外层 effect。外层（比如渲染函数）再次读取时，发现脏了才真正重新计算。为了让外层能订阅 computed 本身，读取时还要手动 `track(obj, 'value')`，否则只标脏、视图不会更新。

---

### 三个关键词（卡住就说这三个）

1. **lazy**：创建 effect 时不立即执行，第一次读 `value` 才算。
2. **dirty + 缓存**：`dirty` 表示要不要重算，`value` 存上次结果；依赖不变直接拿缓存。
3. **手动 track / trigger**：内部 effect 只收集 getter 里的依赖；外层读的是 `computed.value`，必须手动把外层 effect 挂到 computed 的 `value` 上，依赖变化时再手动 trigger 外层。

---

### 执行流程（按时间线背）

以 `sum = computed(() => obj.foo + obj.bar)`，外层渲染 effect 读取 `sum.value` 为例。

**1. 创建阶段**

调用 `computed(getter)`，内部 `effect(getter, { lazy: true, scheduler })`。因为 lazy，**getter 此时不执行**。初始 `dirty = true`，缓存 `value` 为空。

**2. 首次读取**

读 `sum.value`：`dirty` 为 true，执行 `effectFn()`，getter 里访问 `obj.foo`、`obj.bar`，走 Proxy get → `track`，把**内部 effect** 收集进这两个 key。算出结果写入 `value`，`dirty = false`。同时 `track(obj, 'value')`，把**外层渲染 effect** 收集到 computed 自己的 `value` 上。

**3. 再次读取（依赖没变）**

`dirty` 为 false，**不执行 getter**，直接返回缓存。这就是 computed 比 methods 快的原因。

**4. 依赖变化**

改 `obj.foo` → `trigger`。内部 effect 配了 scheduler，**不立刻重跑 getter**，只做两件事：`dirty = true`；`trigger(obj, 'value')` 通知外层。

**5. 外层更新后再读**

渲染 effect 被触发，再次读 `sum.value`。发现 dirty，才真正执行 getter 重算，更新缓存，再把 dirty 置回 false。

一句话串起来：**创建不算，读了才算；没脏用缓存，脏了只标脏，下次读取才重算。**

---

### 为什么必须手动 track / trigger（高频追问）

内部 effect 收集的是 getter 里读到的 `foo`、`bar`。外层渲染 effect 读的是 `sum.value`，**根本没读 foo/bar**，所以收集不到这些依赖。

如果不手动桥接：

- 依赖变了：scheduler 只把 dirty 设为 true
- 外层不知道 computed 变了，渲染函数不跑
- 页面还显示旧值

所以：

- **get value**：`track(obj, 'value')`，让外层订阅 computed
- **scheduler**：`trigger(obj, 'value')`，依赖变了通知外层

computed 同时扮演两种角色：**对内是订阅者**（订阅 foo/bar），**对外是依赖源**（被渲染 effect 订阅）。

---

### 对应自己的实现（reactive.js）

```js
function computed(getter) {
  let value
  let dirty = true

  const effectFn = effect(getter, {
    lazy: true,              // 创建不算
    scheduler() {
      if (!dirty) {
        dirty = true         // 依赖变了只标脏
        trigger(obj, 'value') // 通知外层
      }
    }
  })

  const obj = {
    get value() {
      if (dirty) {
        value = effectFn()   // 脏了才重算
        dirty = false
      }
      track(obj, 'value')    // 收集外层 effect
      return value           // 没脏走缓存
    }
  }
  return obj
}
```

scheduler 里先判断 `if (!dirty)`：已经是脏的就不用反复 trigger，避免无意义通知。

---

### Vue3 源码怎么对应

核心模型和上面完全一致，只是类名、API 不同。

**Vue 3.4（更常被问，和笔记一一对应）**

源码在 `ComputedRefImpl`：

- 内部 `new ReactiveEffect(getter, scheduler)`，等价于 `lazy effect`
- `_dirty` 就是脏标记，`_value` 就是缓存
- `get value`：先 `trackRefValue(this)`（手动 track），若 dirty 则 `effect.run()` 重算
- scheduler：`_dirty = true`，再 `triggerRef(this)`（手动 trigger）

**Vue 3.5+（说出来是加分项）**

不再单独创建 `ReactiveEffect`。`ComputedRefImpl` 自己实现 `Subscriber`：

- 读取 `value`：`this.dep.track()` 收集外层，再 `refreshComputed(this)` 按需计算
- 依赖变化：走 `notify()`，打上 `EffectFlags.DIRTY`，**仍然不立刻重算**
- `refreshComputed` 里用 `globalVersion`、依赖 `version` 判断要不要真算，值没变则不递增 version，减少无效更新

3.5 优化了实现，**面试先把 lazy + dirty + 桥接讲清楚**，再补一句 3.5 不再包一层 effect、自己当订阅者即可。

---

### 和 methods、watch 的区别（必背）

| | computed | methods | watch |
|---|---|---|---|
| 定位 | 派生状态，给模板用 | 事件/命令式逻辑 | 侦听变化，做副作用 |
| 缓存 | 有，依赖不变不重算 | 无，每次调用都执行 | 无缓存概念 |
| 时机 | 懒：读了才算 | 调用就执行 | 依赖变了就跑回调 |
| 返回值 | 有计算结果 | 看函数本身 | 回调无返回给模板 |

模板里 `{{ fullName }}` 用 computed；点按钮改数据用 methods；请求、打日志用 watch。

---

### 可能被追问

**Q：computed 是同步算还是异步算？**

同步。依赖变了只标脏，真正计算发生在下一次读取 `value` 时，仍是同步执行 getter。scheduler 只负责标脏和通知外层，不把计算丢进微任务。

**Q：computed 能写吗？**

默认只读。传 `{ get, set }` 才能写。源码里没有 setter 时，`__v_isReadonly` 为 true，赋值会警告。

**Q：computed 里改自己依赖的数据会怎样？**

读的时候 track、写的时候 trigger，可能递归。Vue 会跳过「正在执行的就是当前这个订阅者」的情况，避免死循环；开发环境还会警告 recursive computed。

**Q：SSR 为什么几乎不缓存？**

SSR 没有组件渲染 effect 长期订阅 computed，依赖追踪不完整，不能靠 dirty 判断。3.5 里 SSR 主要靠 `globalVersion` 做一次请求内的快速路径，不能当成客户端那种稳定缓存。

**Q：没有人读的 computed，依赖变了会算吗？**

不会。没人读就没有外层订阅者，依赖变化只可能标脏，getter 不会跑。3.5 在没有订阅者后还会断开和依赖的连接，便于 GC。
