# 《Vue.js 设计与实现》第12章 组件的实现原理
> 📖精简面试笔记 + 💻书中最终版可运行代码
> 核心：组件本质、组件实例、自更新、props被动更新、setup、emit、插槽、生命周期注册

## 📖精简面试笔记
### 12.1 渲染组件
1. **组件的本质**
组件是一组DOM的封装，在vnode中`type`不再是字符串标签，而是组件对象：
```js
const vnode = {
  type: { render(){/*...*/} } // type为组件选项对象
}
```
渲染器`patch`判断`typeof vnode.type === 'object'`，执行`mountComponent`挂载组件。

2. **组件实例 instance（核心）**
组件实例用来维护组件全部状态：
- `state`：组件自身响应式状态
- `props`：外部传入props
- `slots`：插槽
- `subTree`：组件渲染产出vnode树
- `effect`：组件副作用effect，负责组件自更新
- `isMounted`：标记是否已经挂载，区分挂载 / 更新

`mountComponent`流程：
1. 创建组件实例`instance`
2. 设置实例的props、slots
3. 创建组件effect（组件自更新副作用）
    - effect内部执行组件render，得到subTree
    - 第一次：`isMounted=false`，执行`patch(null, subTree, container)`挂载
    - 更新：`isMounted=true`，执行`patch(instance.subTree, subTree, container)`做diff更新
4. **组件级更新粒度**：组件状态变化只会触发当前组件effect重新执行，不会跨组件。

### 12.2 组件状态与自更新
- 组件自身`data()`返回对象，被`reactive`处理成为响应式state。
- 渲染函数包裹在组件effect中；state变更触发effect执行，重新调用render得到新subTree，执行patch更新DOM → **组件自更新**。

> 重点：Vue组件更新粒度是**组件级别**，不是DOM元素级别；一个组件状态变化，整个组件render重新执行得到新vnode，再走patch diff。

### 12.3 props与被动更新
1. props是父组件传递给子组件的数据；子组件props是**浅只读**（不能在子组件修改props）。
2. 被动更新：父组件重新渲染，生成新的子组件vnode的props；对比新旧props。
    - props发生变化，触发子组件的effect执行，子组件被动更新。
3. props处理流程
    1. normalizeProps：解析vnode.props，区分`props`和`attrs`；组件选项`props`配置声明的属性作为props，其余归为attrs。
    2. props使用`shallowReactive`包装，变成响应式；**只读**。
    3. 父组件更新，`patchComponent`对比新旧vnode的props，更新实例props，props是响应式，自动触发子组件effect更新。

> 关键区分：
> - props：组件选项显示声明，会做类型校验，浅只读
> - attrs：没有声明的属性，透传至组件根元素

### 12.4 setup函数实现原理（Composition API）
1. `setup(props, context)`；context包含`{emit, slots, attrs, expose}`
2. setup执行时机：**在组件实例创建完成，render执行之前**。
3. setup返回值：
    - 返回对象：对象属性合并到组件实例state，render函数可以直接访问
    - 返回函数：当作渲染函数使用，优先级高于组件options中的render
4. `this`：setup内部`this`为`undefined`。

### 12.5 emit 组件事件实现
`context.emit('click', arg1, arg2)`
1. 在子组件vnode的`props`找`onXxx`格式属性（如`onClick`）
2. 取出对应的事件处理函数执行，传递参数。
3. 支持多事件数组`onClick: [fn1, fn2]`，全部依次调用。

### 12.6 插槽slots的工作原理
1. **编译阶段**：父组件模板的插槽内容编译为函数（插槽函数），存储在vnode.children。
2. **执行时机：在子组件内部执行插槽函数**，生成插槽对应的vnode。
    - 默认插槽、具名插槽、作用域插槽：插槽函数可以接收子组件传递数据（作用域插槽）。
> 重点：插槽vnode的**作用域是父组件，数据使用父组件作用域；但渲染位置是子组件内部**。

### 12.7 注册生命周期
生命周期本质就是组件实例上的数组钩子集合：`instance.onMounted = []`、`instance.onUpdated = []`。
- `onMounted(fn)`：把fn推入实例`onMounted`数组。
- 组件挂载完成之后，遍历执行`onMounted`内全部回调。
同理：`onUpdated / onUnmounted`。
> 生命周期注册API依赖当前运行的组件实例，内部维护`currentInstance`全局变量；执行setup时把`currentInstance`指向当前组件实例。

### ✨面试高频问题
1. 组件实例instance保存哪些内容？
> state、props、slots、subTree、effect、isMounted标记。

2. 组件为什么是组件级更新？
> render运行在组件专属effect副作用中；状态改变触发该effect，重新执行render获取subTree，patch做更新；只触发当前组件。

3. props为什么是浅只读？被动更新原理？
> 父组件渲染产生新props；对比更新子组件响应式props，props改变触发子组件effect，实现被动更新；子组件不允许修改props。

4. setup执行时机？setup返回值两种情况？this为什么是undefined？
> 实例创建完成，render之前执行；返回对象混入state；返回函数作为render；setup不绑定this，this为undefined。

5. emit实现原理？
> 去子组件vnode.props找`on+事件名`的处理函数，支持数组多个处理函数，调用传入参数。

6. 插槽作用域？
> **插槽函数在父组件作用域捕获数据，但是在子组件中执行渲染vnode；作用域属于父组件。**

7. 生命周期`onMounted`怎么知道属于哪个组件？
> 全局`currentInstance`，setup执行时指向当前组件实例；`onMounted`将回调添加到当前实例对应的钩子数组。

---

## 💻第12章 书中最终简化可运行代码
> 依赖第7‑8章渲染器基础；实现核心逻辑：mountComponent、props处理、setup、emit、简单插槽、生命周期钩子。
> 删减部分边界，对齐书中思路。

```js
// --------------------------
// 前置基础：工具、effect、reactive（来自前面章节）
// --------------------------
const targetMap = new WeakMap()
let activeEffect
const effectStack = []
let shouldTrack = true

function track(target, key) {
  if (!activeEffect || !shouldTrack) return
  let depsMap = targetMap.get(target)
  if (!depsMap) targetMap.set(target, (depsMap = new Map()))
  let deps = depsMap.get(key)
  if (!deps) depsMap.set(key, (deps = new Set()))
  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}

function trigger(target, key, type) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  const effectsToRun = new Set()
  effects && effects.forEach(effectFn => {
    if (effectFn !== activeEffect) effectsToRun.add(effectFn)
  })
  effectsToRun.forEach(fn => fn.options?.scheduler ? fn.options.scheduler(fn) : fn())
}

function cleanup(effectFn) {
  for(let i = 0; i < effectFn.deps.length; i++){
    const deps = effectFn.deps[i]
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}

function effect(fn, options={}) {
  const effectFn = ()=>{
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
  if(!options.lazy) effectFn()
  return effectFn
}

const reactiveMap = new WeakMap()
const rawMap = new WeakMap()
function toRaw(o) { return rawMap.get(o) }

function createReactive(target, isShallow=false, isReadonly=false) {
  const exist = reactiveMap.get(target)
  if(exist) return exist
  const proxy = new Proxy(target, {
    get(target, key, receiver){
      const res = Reflect.get(target, key, receiver)
      if(!isReadonly) track(target, key)
      if(isShallow) return res
      if(res && typeof res === 'object') return createReactive(res, false, isReadonly)
      return res
    },
    set(target, key, newVal, receiver){
      if(isReadonly){ console.warn('readonly'); return true }
      const oldVal = Reflect.get(target, key, receiver)
      if(oldVal === newVal) return true
      const hadKey = Object.prototype.hasOwnProperty.call(target, key)
      const ok = Reflect.set(target, key, newVal, receiver)
      if(ok) trigger(target, key, hadKey ? 'SET':'ADD')
      return ok
    }
  })
  reactiveMap.set(target, proxy)
  rawMap.set(proxy, target)
  return proxy
}
function reactive(t){ return createReactive(t,false,false) }
function shallowReactive(t){ return createReactive(t,true,false) }
function shallowReadonly(t){ return createReactive(t,true,true) }

// --------------------------
// 全局组件上下文 currentInstance
// --------------------------
let currentInstance = null

// 生命周期钩子
function onMounted(hook){
  if(currentInstance){
    currentInstance.onMounted.push(hook)
  }
}
function onUpdated(hook){
  if(currentInstance){
    currentInstance.onUpdated.push(hook)
  }
}

// --------------------------
// 组件核心逻辑
// --------------------------

/**
 * 创建组件实例
 * @param {*} vnode 组件vnode
 */
function createComponentInstance(vnode) {
  const componentOptions = vnode.type
  const instance = {
    vnode,
    type: componentOptions,
    props: null,
    propsOptions: componentOptions.props || {},
    slots: vnode.children,
    data: null,
    setupState: {},
    subTree: null,
    effect: null,
    isMounted: false,
    // 生命周期钩子数组
    onMounted: [],
    onUpdated: []
  }
  return instance
}

/**
 * 解析props，区分props和attrs，返回props对象
 */
function resolveProps(instance, vnodeProps) {
  const propsOptions = instance.propsOptions
  const props = {}
  const attrs = {}
  if(vnodeProps){
    for(const key in vnodeProps){
      if(key in propsOptions){
        props[key] = vnodeProps[key]
      }else{
        attrs[key] = vnodeProps[key]
      }
    }
  }
  instance.attrs = attrs
  // props 使用浅只读响应式
  instance.props = shallowReadonly(props)
}

/**
 * emit 实现
 * @param {*} instance
 * @param {string} eventName
 * @param  {...any} args
 */
function emit(instance, eventName, ...args) {
  // onClick 事件名转换
  const handlerName = `on${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`
  const props = instance.vnode.props || {}
  const handler = props[handlerName]
  if(!handler) return
  if(Array.isArray(handler)){
    handler.forEach(h=> h(...args))
  }else{
    handler(...args)
  }
}

/**
 * 执行 setup
 */
function setupComponent(instance) {
  const componentOptions = instance.type
  resolveProps(instance, instance.vnode.props)

  // data
  if(componentOptions.data){
    const dataObj = componentOptions.data()
    instance.data = reactive(dataObj)
  }

  // setup
  if(componentOptions.setup){
    // setup的context
    const setupContext = {
      emit: (e,...args)=>emit(instance,e,...args),
      slots: instance.slots,
      attrs: instance.attrs
    }
    // 保存当前组件实例，供生命周期钩子使用
    currentInstance = instance
    const setupResult = componentOptions.setup(instance.props, setupContext)
    currentInstance = null

    if(typeof setupResult === 'function'){
      // setup返回渲染函数
      instance.render = setupResult
    }else if(setupResult && typeof setupResult === 'object'){
      // 返回对象，作为setupState
      instance.setupState = setupResult
    }
  }else{
    instance.render = componentOptions.render
  }
}

/**
 * 挂载组件
 * @param {*} vnode
 * @param {*} container
 */
function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode)
  setupComponent(instance)

  // 组件自更新effect
  const componentEffect = effect(()=>{
    // render函数的this代理，访问state / setupState
    const renderCtx = new Proxy({}, {
      get(_,key){
        if(key in instance.setupState) return instance.setupState[key]
        if(key in instance.data) return instance.data[key]
        return undefined
      }
    })
    // 执行render，产出subTree
    const subTree = instance.render.call(renderCtx)
    instance.subTree = subTree

    if(!instance.isMounted){
      // 初次挂载
      patch(null, subTree, container)
      instance.isMounted = true
      // 执行onMounted钩子
      instance.onMounted.forEach(hook=> hook())
    }else{
      // 更新
      patch(instance.subTree, subTree, container)
      // 更新完成执行onUpdated
      instance.onUpdated.forEach(hook=> hook())
    }
  }, { scheduler: ()=> componentEffect() })

  instance.effect = componentEffect
}

/**
 * 更新组件（父组件更新，子组件被动更新）
 */
function updateComponent(n1, n2, container) {
  const instance = n2.component = n1.component
  n2.component = instance
  // 简单对比props
  const oldProps = { ...instance.props }
  resolveProps(instance, n2.props)
  // props发生变化，触发组件effect执行
  if(JSON.stringify(oldProps) !== JSON.stringify(instance.props)){
    instance.effect()
  }
}

// --------------------------
// 渲染器基础简化（patch，区分元素vnode / 组件vnode）
// --------------------------
const browserOps = {
  createElement(tag){ return document.createElement(tag) },
  createTextNode(text){ return document.createTextNode(text) },
  insert(el, parent, anchor=null){ parent.insertBefore(el, anchor) },
  remove(el){ el.parentNode?.removeChild(el) },
  setElementText(el, text){ el.textContent = text }
}

function createRenderer(options) {
  const { createElement, createTextNode, insert, remove, setElementText } = options

  function mountElement(vnode, container) {
    const el = createElement(vnode.type)
    if(vnode.props){
      for(let k in vnode.props){
        const val = vnode.props[k]
        if(/^on/.test(k)){
          el.addEventListener(k.slice(2).toLowerCase(), val)
        }else{
          el.setAttribute(k, val)
        }
      }
    }
    if(typeof vnode.children === 'string'){
      setElementText(el, vnode.children)
    }else if(Array.isArray(vnode.children)){
      vnode.children.forEach(child=> patch(null, child, el))
    }
    insert(el, container)
    vnode.el = el
  }

  function patch(n1, n2, container) {
    if(n1 && n1.type !== n2.type){
      remove(n1.el)
      n1 = null
    }
    const { type } = n2
    if(typeof type === 'string'){
      // 普通DOM元素
      if(!n1) mountElement(n2, container)
      else {
        n2.el = n1.el
        // 简化，省略完整props和diff
      }
    }else if(typeof type === 'object'){
      // 组件vnode
      if(!n1){
        mountComponent(n2, container)
      }else{
        updateComponent(n1, n2, container)
      }
    }
  }

  function render(vnode, container) {
    if(vnode){
      patch(container._vnode || null, vnode, container)
    }else{
      if(container._vnode) remove(container._vnode.el)
    }
    container._vnode = vnode
  }
  return { render }
}

const { render } = createRenderer(browserOps)

/*
// ============测试示例============
const MyComp = {
  props: ['msg'],
  setup(props, {emit}){
    const count = reactive({n:1})
    onMounted(()=>{ console.log('组件mounted') })
    return { count }
  },
  render(){
    return {
      type:'div',
      children:`${this.count.n} --- ${this.msg}`
    }
  }
}

// 渲染组件vnode
render({
  type: MyComp,
  props:{ msg:'hello component' }
}, document.body)
*/
```

## 补充面试延伸追问
1. Q：setup为什么不能访问`this`？
> 书中实现，setup调用没有绑定调用上下文，render才有代理的renderCtx；setup内部`this`为undefined。

2. Q：组件实例的effect和普通effect有什么区别？
> 组件effect执行后拿到subTree虚拟节点；区分挂载/更新，执行对应生命周期钩子。

3. Q：插槽为什么数据来自父组件，渲染输出在子组件？
> 插槽本质是父编译生成的函数；函数捕获父作用域变量；函数在子组件mountComponent过程执行产出vnode，插入子组件DOM位置。