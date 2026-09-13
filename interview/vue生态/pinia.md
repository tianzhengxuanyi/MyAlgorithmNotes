# Pinia 高频面试题（Markdown，可直接保存为 pinia‑interview.md）
> 整合掘金两篇博客，补充：**基础用法、底层实现原理（ref / computed / Proxy / effectScope）**；答案精简，面试背诵版。

## 目录
1. 基础概念
2. Pinia 基础用法
3. Pinia 与 Vuex 对比高频题
4. 原理与源码相关（重点：底层借用 Vue 的哪些 API）
5. 实战问题

---

## 一、基础概念
### 1、Pinia 是什么？
> 答案：Vue 官方新一代状态管理库，是 Vuex5 的实现思路产物，用于跨组件、跨页面共享全局状态；支持 Vue2 / Vue3，原生适配组合式 API，TypeScript 类型推导友好。

### 2、什么时候需要状态管理？
> 答案：多个组件**共享同一份状态**；多层组件透传 props 繁琐；多处视图需要修改同一数据，适合抽离全局状态。简单场景也可以直接用 `reactive/ref` 裸写全局对象，但缺少 devtools、插件、SSR 支持。

### 3、Vue3 为什么推荐 Pinia，而不是 Vuex？
> 答案：
1. 移除冗余 `mutations`，同步异步全部放到 actions；
2. 原生 TypeScript 类型推导，不需要额外类型封装；
3. 模块化扁平化，每个 defineStore 就是独立模块，不需要 `namespaced:true`；
4. 支持 setup 写法，可以在 store 内部使用组合式函数；
5. DevTools、模块热更新 HMR、SSR 支持更好。

---

## 二、Pinia 基础用法
### 4、Pinia 的核心概念有哪些？
> 答案：
- `state`：响应式状态，相当于组件 `data`；必须写成**函数**，避免 SSR 下状态污染；
- `getters`：派生状态，相当于 `computed`，自带缓存；
- `actions`：业务方法，支持同步+异步，相当于组件 `methods`；
- `defineStore(id, options)`：定义仓库，id 全局唯一；
- `createPinia()`：创建 pinia 实例，`app.use(pinia)` 注册插件。

### 5、两种 defineStore 写法（Options / Setup）
1）Options‑Store（选项式）
```js
import { defineStore } from 'pinia'
export const useCounterStore = defineStore('counter', {
  state: () => ({ count:0 }),
  getters: { double:(state)=>state.count*2 },
  actions: { increment(){ this.count++ } }
})
```

2）Setup‑Store（组合式写法），内部可以直接用 ref / computed
```js
export const useCounterStore = defineStore('counter', ()=>{
  const count = ref(0)
  const double = computed(()=>count.value*2)
  function increment(){ count.value++ }
  return { count, double, increment }
})
```
> 简答：`ref` → state；`computed` → getters；普通 function → actions。

### 6、读取、修改 state 的几种方式
> 答案：
1. 直接修改：`store.count++`（Pinia允许，不需要mutation）
2. 通过 action 修改：`store.increment()`
3. 批量替换：`store.$patch({ count:10 })`
4. 重置state：`store.$reset()`（仅 Options‑store 支持）

### 7、getters 特点
> 答案：基于 computed 实现，具备**缓存特性**；依赖变化才重新计算；getter 内部可以通过 `this` 访问其他 getter。

### 8、异步怎么处理？
> 答案：直接在 `actions` 写 `async/await`，不再区分 mutation，同步异步统一放在 actions。

### 9、pinia 状态持久化怎么做？
> 答案：使用插件 `pinia‑plugin‑persistedstate`，安装后 `pinia.use(插件)`，store 配置 `persist:true`，自动把 state 保存到 localStorage。也可以手写 `$subscribe` 监听状态变化手动存储。

### 10、组件外部（js/ts普通文件）如何使用 store？
> 答案：直接导入 `useXxxStore()` 函数执行拿到实例；**必须在pinia已经被app.use注册之后调用**。
```js
import { useCounterStore } from '@/stores/counter'
const store = useCounterStore()
```

### 11、监听 pinia state 的变化？
> 答案：
1. 组件内：`watch(()=>store.count, (val)=>{})`
2. store实例方法：`store.$subscribe((mutation, state)=>{})` 监听state变更；
3. `store.$onAction()` 监听 actions 调用。

### 12、Pinia 是否支持 SSR / Nuxt3？
> 答案：支持；state必须写成函数，防止多个请求之间全局状态交叉污染。

### 13、store之间如何互相调用？
> 答案：直接在一个 store 的 action / getter 里面 `import useOtherStore`，调用拿到实例即可，不需要模块导入配置。

---

## 三、Pinia vs Vuex 对比题
### 14、Pinia 为什么去掉 mutations？
> 答案：mutation 的初衷是强制同步变更，方便 devtools 追踪；但是增加大量样板代码。Pinia 无论同步、异步全部放到 actions，devtools 依然可以追踪 actions 调用，mutation 就不再必要。

|对比项|Pinia|Vuex|
|---|---|---|
|核心成员|state / getters / actions|state / getters / mutations / actions|
|mutations|无，直接改state|强制同步修改|
|模块化|每个defineStore天然模块，扁平化|需要modules + namespaced:true|
|TS支持|原生自动推导|需要手动定义类型|
|写法|选项式 + setup组合式|只能选项式|
|异步处理|actions直接async await|actions异步，mutation只能同步|

### 15、Vuex 的缺点是什么？
> 答案：模板代码多；mutation 强制同步，心智负担；modules嵌套、命名空间繁琐；TS支持不够友好。

---

## 四、原理&源码高频（面试重点：借用Vue哪些API）
### 16、Pinia底层依赖Vue的哪些API？是直接用Proxy吗？ref、computed、effectScope分别做了什么？
> 简答（面试口述版）：
1. **底层基于 Vue3 reactivity：`reactive / ref / computed / effectScope`，底层响应式依然是 `Proxy`**（reactive内部基于Proxy实现）。
2. `createPinia()`：
   - 创建 `pinia` 对象，带 `install(app)` 插件方法；
   - 通过 `provide/inject` 将 pinia 实例注入全局组件树；
   - `pinia._s` 是一个 `Map`，缓存已经创建过的 store，避免重复实例化；
   - 外层有一个独立 `effectScope(true)` 隔离store全部响应式副作用，store销毁可以统一stop所有effect。
3. `defineStore()`：
   - Options模式：把state执行得到对象，包装成 `reactive`（Proxy代理）；
   - getters全部封装为 `computed()`，实现缓存；
   - actions绑定this指向store实例；
   - setup模式：在 `effectScope.run()` 执行setup函数，ref自动变成state属性，computed自动变成getters；
4. **不是Pinia自己手写Proxy，复用Vue3内部的reactive（Proxy）响应式系统**。

> 伪代码极简示意（便于口述）
```js
// createPinia 核心简化
function createPinia(){
  const scope = effectScope(true)
  const state = scope.run(()=> ref({}))
  return {
    _s: new Map(), //缓存store
    install(app){ app.provide(piniaSymbol,this) }
  }
}
```

### 17、为什么 state 必须写成函数，不能直接写对象字面量？
> 答案：如果直接写对象，SSR多请求、多次实例化store时，会共享同一个引用对象，造成状态污染；写成函数每次执行返回全新对象。

### 18、多次调用 `useCounterStore()` 返回同一个对象吗？
> 答案：是的；内部读取 `pinia._s` Map缓存，同一个id只创建一次store实例。

### 19、Pinia 中 $state 是什么？
> 答案：`store.$state` 是原始响应式state对象；`store`本身是reactive代理对象，`store.$state`可以整体赋值替换全部状态。

---

## 五、实战面试题
### 20、Pinia插件机制是什么？如何写一个简单插件？
> 答案：`pinia.use(({store})=>{ ... })`；可以给store增加属性、监听$subscribe、做持久化、埋点。

### 21、什么时候不建议用Pinia？
> 答案：只有极少量跨组件状态，直接用 `reactive` 全局对象即可，不需要引入状态管理库；但是裸写reactive没有devtools、SSR隔离、插件能力。

### 22、setupStore模式有什么优势？
> 答案：store内部可以直接使用任意组合式函数，逻辑拆分更灵活，类似组件的setup。

---

### ✅保存操作
复制全部文本 → 新建文本文档粘贴 → 另存为 `pinia‑interview.md`，编码 UTF‑8。

如果你需要，我可以把「vue‑router面试题 + pinia面试题」合并成一份完整Vue面试markdown。