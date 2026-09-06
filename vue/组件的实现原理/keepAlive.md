# 《Vue.js设计与实现》第14章 内建组件和模块｜精简面试笔记
> 仅面试重点，剔除冗长源码实现细节；分为 Keep‑Alive、Teleport、Transition；附带面试问答 + KeepAlive LRU简易可运行代码。

## 📖精简面试笔记
### 14.1 KeepAlive 内置组件（面试最高频）
KeepAlive 是**抽象组件，不会渲染真实DOM元素**。
1. **作用**：缓存组件vnode与组件实例，避免重复执行挂载/卸载；组件切换时只做激活、失活。
2. 核心缓存数据结构
    - `cache: Map`：`cache.set(key, vnode)`，key由组件name + vnode.key生成，存储组件虚拟节点。
    - `keys: Set`：**利用ES6 Set插入顺序实现简易LRU时序维护**，不是双向链表。
3. KeepAlive 隐藏容器 storageContainer, KeepAlive内部创建一个普通div作为隐藏容器 storageContainer。
    - 组件失活：通过渲染器move函数，将组件DOM树从页面原容器移动至 storageContainer；DOM节点本身不删除，组件实例、状态保留；触发 onDeactivated。
    - 组件激活：move将DOM从storageContainer搬回页面原容器；触发 onActivated，不执行onMounted。
    > 注意：不是CSS display隐藏DOM，是DOM节点整体迁移；多个缓存组件共用同一个storageContainer。
4. 配置属性
    - `include`：数组/字符串/正则，**匹配组件name**，只有匹配才缓存。
    - `exclude`：匹配name，匹配的组件不缓存。
    - `max`：最大缓存实例数量，超出执行LRU淘汰。
5. 生命周期区别（高频）
    | 场景 | 执行钩子 |
    |------|--------|
    | 组件**首次进入缓存** | `onMounted` + `onActivated` |
    | 切走缓存组件（失活） | 只执行`onDeactivated`，**不会onUnmounted，组件不真实卸载** |
    | 再次切回缓存组件 | 只执行`onActivated`，**不会再次执行onMounted** |
    | LRU淘汰缓存 / KeepAlive父组件卸载 | `onDeactivated` + `onUnmounted`，真实销毁组件 |
> 关键点：**失活 ≠ 卸载**；失活只是组件隐藏，DOM被移动到内存容器，实例保留。
1. LRU简易实现：
    - Set的插入顺序：**Set末尾 = 最近访问；迭代器第一个元素 = 最久未使用**。
    - 命中缓存：先delete(key)再add(key)，移动到Set末尾更新时序。
    - 超过max：取出Set第一个key，调用`pruneCacheEntry`做真实销毁，清理cache、keys，触发onUnmounted。
2. pruneCacheEntry：销毁被淘汰组件，卸载真实DOM，清理缓存Map和Set。

### 14.2 Teleport 传送组件（中频）
1. 核心思想：**虚拟DOM逻辑位置不变，真实DOM移动到目标容器**。
    - 在vnode树中逻辑子节点仍然属于Teleport组件；
    - DOM渲染时，把DOM节点插入`to`指定的外部DOM容器。
2. 关键要点
    - `to`：CSS选择器或者真实DOM元素；若目标DOM不存在，开发环境警告，不渲染内容。
    - 更新：diff仍然按照原vnode树做diff，只是DOM插入位置改变。
    - 卸载：虽然DOM移到外部容器，组件卸载时依旧会把Teleport的DOM节点移除。
3. 坑点：模板ref获取，vnode引用还在原逻辑树，真实DOM已经被移走。
4. 抽象组件，本身不产出DOM。

### 14.3 Transition 过渡组件（低频，基本不问底层源码）
1. Transition**不做动画，只管理CSS类名与过渡钩子**。
2. 内置过渡class：`v‑enter‑from / v‑enter‑active / v‑enter‑to`；leave系列同理。
3. 流程：节点插入前添加enter类；插入DOM；下一帧切换active类；过渡结束移除全部class；离开逻辑类似。
4. 监听`transitionend / animationend`事件做类名清理；支持手动钩子`@before‑enter @enter @after‑enter`等。
5. 仅针对单个根节点；多节点用TransitionGroup。

---

## 📝本章面试题问答（直接背诵）
### Q1：KeepAlive缓存的是什么？缓存组件实例还是vnode？
> 缓存**组件VNode对象**，vnode上持有`.component`组件实例；cache Map保存vnode。命中缓存直接复用vnode，不再走mountComponent挂载流程。

### Q2：include / exclude 的匹配规则？
> 根据**组件的name选项**进行匹配，支持字符串、数组、正则表达式。

### Q3：max属性的作用，Vue3 KeepAlive的LRU是双向链表吗？
> max控制最大缓存组件数量。
> **KeepAlive并不是双向链表实现LRU**，使用`Map + ES6 Set`，依靠Set的插入顺序实现简易LRU；Set delete是O(n)，业务max一般很小，工程上可以接受。

### Q4：activated、deactivated 和 mounted / unmounted区别？
> 1. 首次进入缓存组件：执行`onMounted + onActivated`；
> 2. 切走缓存页面：仅触发`onDeactivated`，组件只是**失活，不会卸载，不会执行onUnmounted**；
> 3. 再次切回缓存页面：只执行`onActivated`，不会再次执行mounted；
> 4. LRU淘汰缓存、KeepAlive父组件销毁：先deactivated，再执行onUnmounted，组件真正销毁。

### Q5：KeepAlive中失活和卸载有什么区别？
> 失活(deactivated)：组件实例保留，DOM脱离页面保存在内存，只是不显示，不销毁；
> 卸载(unmounted)：组件实例销毁，DOM完全移除，清理副作用。
> 只有LRU淘汰、父组件卸载，缓存组件才会走到真实卸载onUnmounted。

### Q6：Teleport实现原理，逻辑vnode和真实DOM关系？
> Teleport是抽象组件；虚拟DOM节点在组件树中的逻辑位置不变；渲染阶段把真实DOM移动到to指定容器；diff更新依旧按照原始vnode树；组件卸载依旧会把传送出去的DOM删除。

### Q7：Teleport的to指向DOM不存在会发生什么？ref会有什么坑？
> 开发环境输出警告，不会渲染子节点；ref拿到的是逻辑vnode，真实DOM已经移动到外部容器。

### Q8：Transition组件原理？它会实现动画吗？
> Transition不实现动画，只是管理CSS过渡类名，在节点插入、移除的时机增删class；监听transitionend事件清理class；真正动画由CSS完成。

---

## 💻 KeepAlive 简易LRU 可运行代码（对齐原书14章伪代码）
> 只实现LRU缓存淘汰逻辑，不是完整KeepAlive组件，面试手写版本。
```js
/**
 * Vue3 KeepAlive简易LRU实现（Map + Set，非双向链表）
 */
// cache: key -> 组件vnode
const cache = new Map()
// keys 维护访问时序，利用ES6 Set插入顺序
const keys = new Set()
// 最大缓存数量
const max = 3

// 销毁被淘汰的缓存条目
function pruneCacheEntry(cache, key) {
  const vnode = cache.get(key)
  if(vnode && vnode.component) {
    // 执行组件unmounted生命周期，销毁DOM
    if(vnode.component.onUnmounted) {
      vnode.component.onUnmounted.forEach(fn => fn())
    }
  }
  cache.delete(key)
  keys.delete(key)
}

// 缓存读取
function getCache(key) {
  if(cache.has(key)) {
    // 命中缓存：删除旧位置，重新add，移动到Set末尾(最近使用)
    keys.delete(key)
    keys.add(key)
    return cache.get(key)
  }
  return null
}

// 设置缓存
function setCache(key, vnode) {
  if(cache.has(key)) {
    // 已经存在，更新时序
    keys.delete(key)
  }
  cache.set(key, vnode)
  keys.add(key)
  // 超过最大缓存，淘汰最久未使用（Set迭代器第一个）
  if(max && keys.size > max) {
    const oldestKey = keys.values().next().value
    pruneCacheEntry(cache, oldestKey)
  }
}

// --------测试--------
// setCache('A', {component:{}})
// setCache('B', {component:{}})
// setCache('C', {component:{}})
// getCache('A') // A移动到末尾，最久未使用变为B
// setCache('D', {component:{}}) // max=3，淘汰B
```

> 重点记忆：`keys.values().next().value` 获取Set第一个元素即最久未访问key。