# 《Vue.js 设计与实现》第4章 响应系统的作用与实现（完整精简笔记，包含 computed、watch、onInvalidate）
> 适配面试，剔除源码大段代码，保留原理、问题、解决方案、高频面试题

## 4.1 基础概念：副作用函数、响应式数据
1. **副作用函数**：执行后会对外部产生影响的函数。渲染函数就是典型副作用。
2. **响应式目标**：修改数据，自动重新执行依赖该数据的副作用函数。
3. 核心流程：
    - **track（依赖收集）**：读取响应式数据，把当前正在执行的副作用函数收集保存；
    - **trigger（触发响应）**：修改响应式数据，取出对应的副作用函数执行。
4. 存储依赖的数据结构 `targetMap`
    - `WeakMap<原始对象 target, Map<key, Set<effectFn>>>`
    - WeakMap key 是原始对象，**弱引用，对象销毁自动释放依赖，防止内存泄漏**。
    - 层级：`targetMap → target → key → 多个effect副作用`。

> 全局变量 `activeEffect`：保存当前正在执行的副作用函数，供 track 收集。

### 副作用函数

**副作用** 是指函数内部与外部互动（例如修改全局变量、函数外部定义的变量、DOM 操作等），函数的执行会直接或间接影响其他函数的执行，即导致**外部状态的变化**。

**副作用函数** 是指那些会产生副作用的函数。

**响应式系统** 是指当响应式数据发生变化时，会自动执行副作用函数。

**响应式数据** 是指当数据变化时，会自动执行副作用函数。

```js
// 响应式数据
const data = { text: 'hello world' };
// 副作用函数
function effect() {
    document.body.innerText = data.text;
}
```

当data.text变化时，如果能自动执行effect副作用函数更新innerText，那么data就是响应式数据。

## 4.2 分支切换与 cleanup（清理遗留依赖）
### 问题现象
```js
effect(() => {
  document.body.innerText = obj.ok ? obj.text : 'no'
})
```
当 `ok=false`，代码分支不再读取 `obj.text`，但旧依赖还保留；修改 `text` 依旧会无谓执行 effect，造成多余更新。

### 解决思路 cleanup
1. 每个副作用函数 `effectFn` 增加 `deps` 数组，记录自己被收集到了哪些依赖集合（Set）。
2. **每次 effectFn 重新执行前，先把自己从所有 deps 依赖集合中删除，清除旧依赖**。
3. 执行函数，重新走 track，建立全新的依赖关系。

### 细节坑
`Set.forEach` 遍历过程中，如果元素被删除又立刻重新 add，会无限循环。
✅ 解决方案：拷贝一份新 Set `const effectsToRun = new Set(effects)`，遍历副本执行副作用。

## 4.3 嵌套 effect & effectStack 副作用栈
### 场景
组件嵌套渲染：外层组件effect内部执行子组件effect。
### 问题
只用单个全局`activeEffect`，内层effect执行会覆盖外层，外层响应式数据收集到错误的内层effect。

✅ 解决方案：**effectStack 栈结构**
1. 执行effectFn，压入栈，`activeEffect = 栈顶`
2. effect执行完毕弹出栈，`activeEffect`恢复为栈上一层。
保证嵌套场景，收集依赖时永远取栈顶的当前副作用。

## 4.4 避免无限递归循环
### 复现
```js
effect(()=>{ obj.foo++ })
```
读取foo触发track，赋值foo触发trigger，又再次执行当前effect，递归爆栈。

✅ 判断：trigger触发执行时，如果待执行effect === 当前`activeEffect`，跳过不执行。

## 4.5 scheduler 调度执行（核心）
> scheduler：当trigger触发副作用，**不直接执行fn，交给调度函数接管，可以控制执行时机、执行次数**。
1. effect第二个参数传入`{ scheduler: fn }`，trigger优先调用scheduler，不直接执行原始副作用。
2. 两大用途：
    - 控制执行顺序（放到微/宏任务）
    - **任务去重，多次修改只执行一次（Vue更新队列原理）**
> 实现jobQueue任务Set队列 + flushJob微任务刷新，多次修改只执行一次effect。
> Vue的nextTick底层就是基于scheduler调度。

## 4.6 computed 计算属性（lazy effect）
### 关键点
1. computed底层基于 **`lazy:true` 的effect**：创建effect的时候**不立即执行**，手动调用才执行getter。
2. 两个关键标记变量：
    - `dirty`：脏标记，true代表依赖变化，需要重新计算；false直接读取缓存值。
    - `value`：缓存上一次计算结果。
3. 执行流程
    1. 读取`computed.value` → 发现dirty=true，执行effectFn（getter），得到结果缓存，置dirty=false。
    2. 响应式依赖发生变化 → scheduler调度触发，把`dirty = true`。
4. ❗缺陷：把computed放到另外一个effect里面读取，外层effect收集不到computed内部的依赖。
✅ 修复：
- 在computed的getter里手动调用`track(obj, 'value')`收集外层effect；
- scheduler变化时手动调用`trigger(obj, 'value')`触发外层effect更新。

> computed是**懒执行+缓存**，只有被读取才计算；依赖不变多次读取直接拿缓存。

## 4.7 watch 的实现原理
watch本质：对effect + scheduler的二次封装。
1. 接收来源source，递归traverse遍历对象所有属性触发读取，完成依赖收集。
2. 支持两种source：响应式对象 / getter函数。
3. lazy effect拿到旧值；scheduler作为watch回调。
4. 核心选项：
- `immediate`：初始化立刻执行一次回调；
- `flush`：`pre / post / sync`，控制回调执行时机；post代表DOM更新完成后执行。

### 如何拿到newValue / oldValue
利用lazy effect：
1. 初始化手动执行一次effectFn，得到旧值oldValue；
2. 数据变更scheduler触发，再次执行effectFn得到newValue，传给回调；
3. 更新oldValue = newValue保存。

## 4.8 过期副作用 onInvalidate（竞态问题）
### 业务场景：watch内部发送异步请求，快速多次触发，旧的慢请求覆盖新请求结果（竞态）。
```js
watch(source, async (newVal, oldVal, onInvalidate)=>{
  onInvalidate(()=>{ /* 过期执行 */ })
  const res = await fetch('/api')
})
```
1. `onInvalidate(fn)`：用户注册过期清理回调。
2. **每次watch回调执行之前，优先执行上一轮注册的cleanup过期回调**。
3. 实现思路：watch内部保存cleanup变量，onInvalidate把用户回调存入cleanup；下一轮job执行优先调用cleanup。
4. 业务用法：标记expired过期布尔值，过期直接丢弃旧请求返回结果；也可用于取消axios请求。

---

# 📝 本章高频面试题（含参考答案）
### Q1：WeakMap为什么用来做targetMap？为什么不用Map？
> WeakMap的key是**弱引用**，原始对象没有被业务代码引用时，GC可以自动回收，不会造成内存泄漏；Map是强引用，即使业务不再使用对象，Map还持有引用，内存无法释放。

### Q2：cleanup是做什么？不做会发生什么？
> 分支切换场景，清除effect旧的依赖。如果不做，已经不再使用的响应式属性变更依然会触发副作用执行，产生多余更新，损耗性能。

### Q3：effect嵌套会出现什么问题？如何解决？
> 只用单个activeEffect，内层effect执行覆盖activeEffect，外层读取的属性错误收集到内层effect。使用`effectStack`栈，执行effect压栈，执行完毕出栈，activeEffect永远指向栈顶。

### Q4：scheduler调度器有什么用？和nextTick的关系？
> scheduler可以控制副作用执行时机，支持放到微任务，实现任务去重；Vue组件更新队列、nextTick底层依赖scheduler。多次修改同一个响应式数据，只最终执行一次更新。

### Q5：computed的dirty、lazy的含义，computed为什么需要手动track/trigger？
> lazy代表effect不会自动执行；dirty标记是否需要重新计算。computed内部的effect只收集getter内部的依赖；当在另外一个effect读取computed.value，外层effect无法收集依赖，需要手动track/trigger，让外部effect可以响应computed的变化。

### Q6：watch的immediate、flush:post分别是什么效果？
> immediate：watch创建的时候立刻执行一次回调，此时oldValue为undefined；
> flush:'post'：回调放到微任务，DOM更新完成之后再执行回调。

### Q7：onInvalidate 解决什么问题？原理？
> 解决watch异步请求竞态问题。每次watch回调执行前，执行上一轮注册的清理函数；可以标记请求过期、取消请求，丢弃旧请求的返回结果。

### Q8：obj.foo++为什么会触发无限递归，框架如何规避？
> 读取foo收集依赖，设置foo又触发同一个effect执行。trigger的时候判断，如果待执行effect等于当前activeEffect，则跳过执行，避免递归。


```ts
// --------------------------
// 桶：存储副作用
// targetMap: WeakMap<target, Map<key, Set<effectFn>>>
// --------------------------
const targetMap = new WeakMap()
let activeEffect
const effectStack = []
// 调度执行标记，用于scheduler
let shouldTrack = true

/**
 * 收集依赖
 * @param {object} target 原始对象
 * @param {string|symbol} key 属性key
 */
function track(target, key) {
  if (!activeEffect || !shouldTrack) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  deps.add(activeEffect)
  // effect保存自己关联的依赖集合，供cleanup使用
  activeEffect.deps.push(deps)
}

/**
 * 触发副作用执行
 * @param {object} target
 * @param {string|symbol} key
 */
function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  const effectsToRun = new Set()
  // 拷贝Set，防止forEach删除又添加导致死循环
  effects && effects.forEach(effectFn => {
    // 避免无限递归：当前触发的effect不能等于正在执行的activeEffect
    if (effectFn !== activeEffect) {
      effectsToRun.add(effectFn)
    }
  })
  effectsToRun.forEach(effectFn => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn)
    } else {
      effectFn()
    }
  })
}

// 清除遗留依赖 cleanup
function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}

/**
 * 注册副作用函数
 * @param {Function} fn 副作用逻辑
 * @param {object} options {lazy,scheduler}
 */
function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(effectFn)
    const res = fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
    return res
  }
  effectFn.options = options
  effectFn.deps = []
  // lazy为true，不立刻执行
  if (!options.lazy) {
    effectFn()
  }
  return effectFn
}

// --------------------------
// computed 实现 lazy + dirty
// --------------------------
function computed(getter) {
  let value
  let dirty = true

  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      if (!dirty) {
        dirty = true
        // 依赖变化，手动触发computed.value关联的外层effect
        trigger(obj, 'value')
      }
    }
  })

  const obj = {
    get value() {
      if (dirty) {
        value = effectFn()
        dirty = false
      }
      // 手动track，收集外层effect
      track(obj, 'value')
      return value
    }
  }
  return obj
}

// --------------------------
// watch实现，包含immediate、flush、onInvalidate过期副作用
// --------------------------

// 递归读取对象所有属性，用于收集全部依赖
function traverse(value, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has(value)) return
  seen.add(value)
  for (const k in value) {
    traverse(value[k], seen)
  }
  return value
}

/**
 *
 * @param {object|Function} source 响应式对象 或者 getter函数
 * @param {Function} cb 回调
 * @param {object} options {immediate, flush}
 */
function watch(source, cb, options = {}) {
  let getter
  if (typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }

  let oldValue, newValue
  let cleanup // 保存onInvalidate注册的清理函数

  // 用户注册过期回调
  function onInvalidate(fn) {
    cleanup = fn
  }

  const job = () => {
    newValue = effectFn()
    // 执行上一轮过期副作用
    if (cleanup) {
      cleanup()
    }
    cb(newValue, oldValue, onInvalidate)
    oldValue = newValue
  }

  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      if (options.flush === 'post') {
        const p = Promise.resolve()
        p.then(job)
      } else {
        job()
      }
    }
  })

  if (options.immediate) {
    job()
  } else {
    oldValue = effectFn()
  }
}

// ==========================================
// 【测试示例】
// 注意！！本代码只是第四章逻辑层，**没有Proxy代理**！
// track、trigger需要手动调用；第五章才会封装Proxy做reactive。
// ==========================================
/*
// 模拟原始数据
const data = { foo: 1, bar: 2, ok: true, text: 'hello' }

// 测试effect
effect(() => {
  console.log('effect执行', data.foo)
  track(data, 'foo')
})
// 修改，手动trigger（因为没有Proxy拦截set）
data.foo = 10
trigger(data, 'foo')

// 测试computed
const sum = computed(() => {
  track(data, 'foo')
  track(data, 'bar')
  return data.foo + data.bar
})
console.log(sum.value)

// 测试watch
watch(
  () => {
    track(data, 'foo')
    return data.foo
  },
  (nv, ov) => {
    console.log('watch触发', nv, ov)
  },
  { immediate: false }
)
*/
```