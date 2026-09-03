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

## 补充面试延伸追问
1. Q：setup为什么不能访问`this`？
> 书中实现，setup调用没有绑定调用上下文，render才有代理的renderCtx；setup内部`this`为undefined。

2. Q：组件实例的effect和普通effect有什么区别？
> 组件effect执行后拿到subTree虚拟节点；区分挂载/更新，执行对应生命周期钩子。

3. Q：插槽为什么数据来自父组件，渲染输出在子组件？
> 插槽本质是父编译生成的函数；函数捕获父作用域变量；函数在子组件mountComponent过程执行产出vnode，插入子组件DOM位置。