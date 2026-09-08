# Vue 面试题梳理

## 一、响应式系统与双向绑定

1. Vue 2.x 响应式数据原理（基于 `Object.defineProperty`）
2. Vue 3.0 响应式数据原理（基于 `Proxy`）
3. Vue 2 与 Vue 3 响应式原理的区别
4. Vue 如何让对象新增属性具备响应式能力（及 `$set` 等解决方案）
5. Vue 中如何检测数组变化，以及修改数组元素时如何触发视图更新
6. Vue 双向数据绑定的整体实现原理（含 `v-model` 的作用与实现细节）
7. `v-model` 在自定义组件上的实现原理
8. 为什么 Vue 中的 `data` 必须是一个函数而不是对象
9. `Object.defineProperty` 能否监听 DOM 属性变化
10. 如何实现一个基于依赖收集的 `reactive` 响应式系统（Vue 3 风格）

## 二、虚拟 DOM 与 Diff 算法

1. 什么是虚拟 DOM，它解决了哪些问题
2. 虚拟 DOM 的实现思路（如何创建、比较、更新）
3. Vue 中的 diff 算法原理（含 Vue 2 与 Vue 3 的差异）
4. 既然 Vue 能精准探测数据变化，为何还需要虚拟 DOM 进行 diff 比较
5. 虚拟 DOM 一定比真实 DOM 更快吗

## 三、组件核心机制

1. Vue 计算属性的实现原理
2. `computed` 和 `watch` 的区别及适用场景
3. `watch` 与 `computed` 的底层区别（含深度监听、立即执行等）
4. `Vue.nextTick` 的作用、实现原理及其与异步更新队列的关系
5. 数据频繁变化时为何通常只触发一次视图更新（结合 `nextTick`）
6. Vue 组件中 `key` 的作用与原理
7. `v-if` 与 `v-show` 的区别及使用场景
8. 为什么 `v-if` 和 `v-for` 不建议一起使用
9. 自定义指令的定义、生命周期及应用场景
10. Vue 常用的修饰符（`.stop`、`.prevent`、`.sync` 等）及使用场景

## 四、生命周期与实例挂载

1. Vue 生命周期的整体理解（钩子函数、执行顺序）
2. Vue 实例挂载（`new Vue`）过程中发生了什么
3. 各生命周期钩子适合哪些具体场景（如异步请求放在 `created` 还是 `mounted`）
4. DOM 渲染完成在哪个生命周期钩子之后
5. 组件生命周期调用顺序（父/子组件嵌套时）
6. 列举几个常用的生命周期钩子（如 `mounted`、`updated`、`destroyed`）

## 五、组件通信与传值

1. Vue 组件间通信方式有哪些（`props`/`$emit`、事件总线、`$attrs`/`$listeners`、`provide`/`inject`、Vuex 等）
2. 事件总线（EventBus）如何使用
3. `$attrs` 与 `$listeners` 的作用及使用场景
4. `$refs` 的作用与用法
5. `$parent` / `$children` 或 `$root` 的通信方式

## 六、路由（Vue Router）

1. Vue Router 的路由模式（hash 与 history）的实现原理与区别
2. 如何监听 history 模式下的路由变化
3. 路由懒加载的实现方式及原理
4. Vue Router 的导航守卫（全局、路由独享、组件内）及使用场景（如登录判断）
5. `$route` 和 `$router` 的区别
6. 路由钩子函数（`beforeEach`、`beforeResolve`、`afterEach` 等）

## 七、状态管理（Vuex / Pinia）

1. Vuex 是什么，包含哪些核心属性（`state`、`getters`、`mutations`、`actions`、`modules`）
2. Vuex 中 `mutation` 和 `action` 的区别
3. Vuex 的实现原理（如何响应式管理状态）
4. Vuex 辅助函数（`mapState`、`mapGetters`、`mapMutations`、`mapActions`）的使用
5. Vue 3 中 `Vue.observable` 的作用（与 Vuex 的对比）

## 八、Vue 3 新特性与优化

1. Vue 3 的设计目标、新增能力及整体优化（性能、Tree-shaking、Composition API 等）
2. Vue 3 的性能提升主要体现在哪些方面
3. 为什么 Vue 3 用 `Proxy` 替代 `Object.defineProperty`
4. Composition API 与 Options API 的区别及优势
5. Vue 3 中的 Tree-shaking 特性是什么，举例说明
6. 如何利用 Vue 3 设计一个 Modal 组件

## 九、SSR 与首屏性能

1. SSR（服务端渲染）解决了什么问题，Vue 中如何实现
2. Vue 项目首屏白屏的原因及解决方案
3. 如何系统优化 Vue 项目的首屏加载性能（含 SPA 加载速度优化）

## 十、工程化与项目实践

1. Vue CLI 项目的目录结构划分（大型项目如何合理划分组件和模块）
2. 如何封装 axios 及 axios 的原理
3. Vue 项目中如何解决跨域问题（开发环境与生产环境）
4. Vue 项目部署后刷新页面出现 404 的原因及解决办法
5. Vue 项目中的错误处理策略（全局捕获、组件级）
6. 如何实现按钮级别的权限管理（路由权限 + 指令控制）
7. `Vue.extend` 与 `Vue.component` 的区别
8. 如何让 CSS 只在当前组件中生效（`scoped` 及样式穿透）
9. 作用域插槽（`slot`）的理解及使用场景
10. `mixin` 的理解、应用场景及潜在问题
11. `keep-alive` 的作用、生命周期钩子（`activated` / `deactivated`）及应用
12. Vue 常用指令（`v-text`、`v-html`、`v-bind`、`v-on`、`v-for` 等）
13. `v-on` 是否可以监听多个方法（写法及示例）
14. `delete` 与 `Vue.delete` 删除数组/对象的区别
15. Vue 项目中的性能优化手段（代码分割、懒加载、缓存、`v-once` 等）
16. 如何快速定位哪个组件出现性能问题（使用性能分析工具）
17. Vue 与 React 的核心区别，以及与 Angular 的对比
18. Vue 的特点与优点
19. vue-cli 工程化工具集介绍（webpack、vite 等）
20. 在 Vue 中使用插件（`Vue.use()`）的步骤和原理
21. 单文件组件（`.vue`）到页面渲染的全过程（编译、虚拟 DOM、挂载）
22. Vue 模板编译原理（`template` → `render` 函数）
23. 如何设计可配置的动态表格组件（配置驱动的动态查询表格）
24. 如何使用 Map 实现 LRU 缓存淘汰算法

## 十一、SPA 与 MVVM

1. 谈谈对 MVVM 模式的理解
2. 什么是 SPA（单页面应用），其优缺点及实现方式
3. SPA 与多页面应用的区别

## 十二、其他

1. Vue 与 uni-app 的关系和区别
2. uni-app 页面中 `template` 与 `block` 的规范使用

## 附录：已剔除（与 Vue 无关）

1. 前端开发中常见的正则表达式有哪些
2. 如何实现两个文本文件的差异比较算法
3. 如何在 ES5 环境中近似实现 `const`
4. 指令 `v-el`（已废弃，可忽略）
