# Vue 面试题梳理

> 已有成文的标「已答」；其余给简要回答。

## 一、响应式系统与双向绑定

1. Vue 2.x 响应式数据原理 → [已答](./1.%20vue响应式数据原理.md)
2. Vue 3.0 响应式数据原理 → [已答](./1.%20vue响应式数据原理.md)
3. Vue 2 与 Vue 3 响应式原理的区别 → [已答](./1.%20vue响应式数据原理.md)
4. 对象新增属性具备响应式能力 → [已答](./2.%20vue对象新增属性和数组操作的响应式是如何实现的.md)
5. 数组变化检测与触发更新 → [已答](./2.%20vue对象新增属性和数组操作的响应式是如何实现的.md)
6. 双向绑定 / `v-model` → [已答](./3.%20vue双向数据绑定的实现原理（v-model的作用和实现细节）.md)
7. **`v-model` 在自定义组件上的实现原理**  
   Vue2：默认约定 prop `value` + 事件 `input`；可用 `model` 选项改名字。Vue3：默认 `modelValue` + `update:modelValue`；可用 `v-model:xxx` 多个；编译成绑定 prop + 更新事件，子组件改值必须 `$emit`，不能直接改 prop。
8. `data` 必须是函数 → [已答](./4.%20为什么vue中data必须是一个函数？.md)
9. **`Object.defineProperty` 能否监听 DOM 属性变化**  
   一般不能可靠监听。许多 DOM 属性是浏览器内部更新的，不是普通数据属性的赋值路径；且跨浏览器、只读属性、布局相关属性都不适合劫持。DOM 变化用 MutationObserver / 事件，数据层用响应式。
10. **手写基于依赖收集的 `reactive`（Vue3 风格）要点**  
    `WeakMap(target → Map(key → Set(effect)))`；`Proxy` 的 get 里 `track`，set/delete/ownKeys 等里 `trigger`；嵌套对象递归代理；`effect` 支持 cleanup；数组 / 集合按语义补拦截。细节见第 1、2 题成文。

## 二、虚拟 DOM 与 Diff 算法

1. 什么是虚拟 DOM → [已答](./5.%20什么是虚拟DOM，它解决了哪些问题.md)
2. 虚拟 DOM 实现思路 → [已答](./6.%20虚拟%20DOM%20的实现思路.md)
3. diff 算法原理 → [已答](./7.%20Vue中的diff算法原理.md) / [block & patchFlag](./8.%20Vue3%20block%20tree、patchFlag%20原理.md)
4. **为何还能精准探测数据还要 vdom diff**  
   响应式只知道「哪些状态变了」，不知道 DOM 哪一块怎么改。组件是树，一次更新可能影响多节点、列表重排、条件分支。vdom 把「新 UI 描述」和旧树对比，算出最小补丁；还能跨平台、配合编译优化（patchFlag）。不是因为「不知道数据变了」，而是因为「还要知道 DOM 怎么变」。
5. **虚拟 DOM 一定更快吗**  
   不一定。多了一层创建/对比开销；节点极少、更新极简时，直接操作 DOM 可能更快。vdom 胜在批量更新、跨平台、可推断优化，以及复杂 UI 下避免手写 DOM 操作出错，不是绝对性能银弹。

## 三、组件核心机制

1. 计算属性原理 → [已答](./9.%20computed计算属性的原理.md)
2. `computed` 和 `watch` 区别 → [已答](./9.%20computed计算属性的原理.md) / [watch](./10.%20watch的原理.md)
3. `watch` 与 `computed` 底层区别 → [已答](./10.%20watch的原理.md)
4. `nextTick` → [已答](./11.%20Vue%20nextTick的作用、实现原理及其与异步更新队列的关系.md)
5. **数据频繁变化为何通常只更新一次视图**  
   同一事件循环里多次改数据，只把 watcher/`effect` 丢进队列并去重，等微任务（`nextTick`）再刷。所以连续赋值合并成一次渲染。详见 nextTick 成文。
6. **组件中 `key` 的作用与原理**  
   Diff 用 `key` 做同一层级的节点身份。有稳定唯一 `key` 才能正确复用/移动，避免「按位置复用」导致状态错乱（输入框、动画、子组件内部状态）。列表尽量不用 index 当 key（会插入删除时）。
7. **`v-if` 与 `v-show`**  
   `v-if` 条件为假时不渲染（销毁/创建），切换成本高、适合低频。`v-show` 始终渲染，用 CSS `display` 切换，适合频繁显隐。`v-if` 为假时内部指令/组件不初始化。
8. **为何不建议 `v-if` 和 `v-for` 同节点**  
   Vue2：`v-for` 优先，先循环再过滤，浪费。Vue3：`v-if` 优先，且拿不到 `v-for` 的作用域变量，易出 bug。应拆 `<template v-for>`，或 computed 先过滤再 `v-for`。
9. **自定义指令**  
   封装对「纯 DOM」的底层操作（聚焦、埋点、权限隐藏、懒加载）。钩子：Vue2 的 bind/inserted/update…；Vue3 的 created/mounted/updated/unmounted。能用组件表达的优先组件，指令侧重 DOM。
10. **常用修饰符**  
    事件：`.stop` / `.prevent` / `.capture` / `.self` / `.once` / `.passive`。按键：`.enter` 等。表单：`.lazy` / `.number` / `.trim`。Vue2 `.sync` 已由 Vue3 `v-model:prop` 替代。

## 四、生命周期与实例挂载

1. 生命周期整体 → [已答](./12.%20Vue生命周期的整体理解(钩子函数、执行顺序).md)
2. `new Vue` 挂载过程 → [已答](./13.%20Vue%20实例挂载（`new%20Vue`）过程中发生了什么.md)
3. **各钩子适合场景**  
   `created`：初始化数据、发请求（不依赖 DOM）。`mounted`：依赖 DOM 的操作（量尺寸、第三方库挂载）。`updated`：少用，易循环，优先 `watch`/`nextTick`。`beforeUnmount`/`unmounted`：清定时器、解绑、销毁实例。
4. **DOM 渲染完成在哪个钩子之后**  
   首次：`mounted` 时挂载完成，可访问 `$el`。更新后 DOM：在 `updated`；若在改数据后立刻读 DOM，用 `$nextTick`。
5. **父子组件生命周期顺序**  
   挂载：父 `beforeCreate→created→beforeMount` → 子完整挂载 → 父 `mounted`。更新：父 `beforeUpdate` → 子更新 → 父 `updated`。销毁：父 `beforeUnmount` → 子销毁 → 父 `unmounted`。
6. **常用钩子**  
   `beforeCreate` / `created` / `beforeMount` / `mounted` / `beforeUpdate` / `updated` / `beforeUnmount` / `unmounted`（Vue2 对应 `beforeDestroy` / `destroyed`）。keep-alive 另有 `activated` / `deactivated`。

## 五、组件通信与传值

1. 组件通信方式 → [已答](./14.%20Vue%20组件间通信方式有哪些.md)
2. **EventBus**  
   Vue2 常用空 Vue 实例 `$on`/`$emit`/`$off`；组件销毁必须 `$off`，否则泄漏。Vue3 移除实例事件 API，改用 `mitt`/`tiny-emitter`，或优先 provide/inject、Pinia。
3. **`$attrs` / `$listeners`**  
   `$attrs`：未声明为 props 的特性（Vue3 含 class/style 与事件）。`$listeners`：Vue2 父监听集合；Vue3 合并进 `$attrs`。用于包装组件透传：`v-bind="$attrs"`。
4. **`$refs`**  
   拿到子组件实例或原生 DOM。挂载后才有；`v-for` 上是数组。别在模板渲染路径里靠 ref 驱动主逻辑，优先数据驱动。
5. **`$parent` / `$children` / `$root`**  
   强耦合、难维护，生产少用。跨层用 provide/inject 或状态库。Vue3 已弱化 `$children`。

## 六、路由（Vue Router）

1. **hash vs history**  
   hash：`#/path`，靠 `hashchange`，不需服务端改写，丑、SEO 弱。history：干净 URL，靠 `pushState`/`popstate`，刷新需服务端 fallback 到 `index.html`，否则 404。
2. **如何监听 history 变化**  
   路由库监听 `popstate`；编程式导航 `pushState`/`replaceState` 后自行同步路由状态（原生 pushState 不触发 popstate）。
3. **路由懒加载**  
   `component: () => import('./Foo.vue')`，打成异步 chunk，进入路由再加载，减首包。
4. **导航守卫**  
   全局 `beforeEach`/`beforeResolve`/`afterEach`；路由 `beforeEnter`；组件 `beforeRouteEnter`/`Update`/`Leave`。登录：在 `beforeEach` 查 token，未登录 `next('/login')`。
5. **`$route` vs `$router`**  
   `$route` 当前路由信息（path、params、query）。`$router` 路由器实例（`push`/`replace`/`go`）。
6. **钩子职能简述**  
   `beforeEach`：最常用，权限/登录。`beforeResolve`：组件守卫之后、确认之前。`afterEach`：无 `next`，埋点、改标题。

## 七、状态管理（Vuex / Pinia）

1. **Vuex 核心**  
   `state` 唯一状态树；`getters` 派生；`mutations` 同步改 state；`actions` 异步再 commit；`modules` 拆模块。
2. **mutation vs action**  
   mutation 必须同步，便于 devtools 追踪；异步放 action，action 里 `commit` mutation。
3. **实现要点**  
   store.state 做成响应式；组件通过 store 读取收集依赖；`commit` 改 state 触发更新；严格模式禁止组件外直接改 state。
4. **辅助函数**  
   `mapState`/`mapGetters`/`mapMutations`/`mapActions` 把 store 映射到组件 computed/methods，少写 `this.$store`。
5. **`Vue.observable`**  
   Vue2.6+ 把对象做成响应式，可做轻量跨组件状态；无时间旅行、模块、规范约束。复杂应用仍用 Vuex/Pinia。Vue3 用 `reactive`/`ref`。

## 八、Vue 3 新特性与优化

1. **设计目标与新增**  
   更小可 tree-shake、更快（编译+运行时）、更好 TS、Composition API 组织逻辑、Fragment/Teleport/Suspense 等。详见性能成文。
2. 性能提升方面 → [已答](./16.%20Vue%203%20的性能提升主要体现在哪些方面.md)
3. **为何用 Proxy 替代 defineProperty**  
   可拦截新增/删除属性、数组下标与 `length`、`in`/`ownKeys` 等；不必递归一次性定义所有 key；能力完整，代码更简。代价是不兼容 IE、Proxy 对象身份与原对象不同（用 `reactive`/`toRaw` 体系处理）。
4. Composition vs Options → [已答](./15.%20Composition%20API%20与%20Options%20API%20的区别及优势.md)
5. **Tree-shaking**  
   Vue3 函数式导出，打包器可去掉未用的 `v-model`、Transition、keep-alive 等。模板编译只引入用到的 runtime helper，产物更小。
6. **用 Vue3 设计 Modal**  
   `Teleport` 挂到 `body`；`modelValue` 控制显隐；插槽分 title/body/footer；锁滚动、Esc 关闭、焦点陷阱；可封装 `useModal` 或命令式 `open()` 返回 Promise。

## 九、SSR 与首屏性能

1. SSR → [已答](./17.%20SSR（服务端渲染）解决了什么问题，Vue%20中如何实现.md)
2. **首屏白屏原因与解决**  
   原因：大 JS 下载/解析、路由/组件同步过大、接口慢、无骨架。解决：路由懒加载、关键请求并行与 SSR/流式、骨架屏、CDN/HTTP2、压缩与缓存、减少阻塞脚本。
3. **系统优化首屏**  
   测 LCP/FCP；拆包 + 预加载；图片懒加载/合适尺寸；关键 CSS 内联；接口合并/缓存；SSR/SSG；CDN；避免巨型同步状态库初始化。

## 十、工程化与项目实践

1. **大型项目目录**  
   按业务域分 `modules/views`，公共 `components`/`composables`/`utils`/`api`；路由、store 按模块拆；禁止巨型 `components` 无分层。
2. **封装 axios**  
   实例化 baseURL/timeout；请求/响应拦截（token、错误码、刷新）；统一错误提示；按业务再包 `get/post`；取消重复请求可用 AbortController。
3. **跨域**  
   开发：vite/webpack `proxy`。生产：网关/Nginx 反代同域，或后端 CORS；cookie 跨域要 `credentials` + 服务端白名单。
4. **部署后刷新 404**  
   history 模式深链刷新被服务器当真实路径。Nginx `try_files $uri /index.html`；或改 hash 模式。
5. **错误处理**  
   `app.config.errorHandler`；`window.onerror`/`unhandledrejection`；路由/请求层统一；生产上报 Sentry；组件 `onErrorCaptured`。
6. **按钮级权限**  
   路由 `meta.roles` + 全局守卫；按钮自定义指令或组件根据权限表 `v-if`；权限数据登录后拉取；切勿只藏按钮，接口也要鉴权。
7. **`Vue.extend` vs `Vue.component`**  
   `extend` 造子类构造器，可手动 `new` 挂载（旧式弹窗）。`component` 全局/局部注册，给模板用。Vue3 以 `createApp` + SFC 为主，`extend` 少用。
8. **scoped 与穿透**  
   scoped 加唯一属性选择器，样式隔离。改子根用 `:deep()`（Vue3）/ `::v-deep`；第三方库偶尔用。
9. **作用域插槽**  
   子向父插槽传数据，父决定怎么渲染（表格列、列表项）。`v-slot="{ row }"`。默认插槽、具名插槽、作用域插槽可组合。
10. **mixin**  
    复用选项，但来源不清、命名冲突、和组件数据合并难追。Vue3 优先 composable（`useXxx`）。
11. **`keep-alive`**  
    缓存动态组件实例，切走不销毁。`include`/`exclude`/`max`；额外 `activated`/`deactivated`。适合 tab、列表回退保留状态。
12. **常用指令**  
    `v-text`/`v-html`/`v-show`/`v-if`/`v-for`/`v-bind`/`v-on`/`v-model`/`v-slot`/`v-pre`/`v-once`/`v-memo`（Vue3）。
13. **`v-on` 多个方法**  
    可写数组：`@click="[fn1, fn2]"`，或一个方法里调多个；对象语法用于组件自定义事件较少见。
14. **`delete` vs `Vue.delete`**  
    普通 `delete obj.key` 在 Vue2 不能触发视图更新；`Vue.delete`/`$delete` 会触发依赖通知。数组同理优先 `splice` 或 `$set`。Vue3 Proxy 下直接 `delete` 即可。
15. **性能优化手段**  
    路由/组件懒加载、`v-once`/`v-memo`、列表 key、虚拟列表、合理 computed、减负 watch、KeepAlive、CDN、压缩、分析包体积。
16. **定位慢组件**  
    Vue DevTools performance；Chrome Performance；标记 `app.config.performance`；看组件更新次数与耗时。
17. **Vue vs React vs Angular**  
    Vue：渐进、模板+可选 JSX、响应式自动追踪。React：UI=f(state)、JSX、单向、生态强。Angular：完整框架、DI、强 TS、模板指令多。选型看团队与场景。
18. **Vue 特点**  
    渐进式、易上手、性能好、生态（Router/Vuex/Pinia）、优秀文档与 SFC 开发体验。
19. **脚手架**  
    Vue CLI（webpack）偏传统；现多用 `create-vue` + Vite：冷启动快、ESM、配置薄。
20. `Vue.use` 插件 → [已答](./18.%20在%20Vue%20中使用插件（`Vue.use()`）的步骤和原理.md)
21. SFC 到页面渲染 → [已答](./19.%20单文件组件（`.vue`）到页面渲染的全过程（编译、虚拟%20DOM、挂载）.md)
22. 模板编译原理 → [已答](./20.%20Vue%20模板编译原理.md)
23. **可配置动态表格**  
    列配置（field/title/slot/formatter）；远程分页排序；查询表单由 schema 生成；单元格用作用域插槽扩展；配置与请求参数分离，表格只吃「标准化数据 + 列描述」。
24. LRU → [已答](./21.%20如何使用%20Map%20实现%20LRU%20缓存淘汰算法.md)

## 十一、SPA 与 MVVM

1. **MVVM**  
   Model 数据，View 视图，ViewModel 连接：视图变化经绑定到数据，数据变化经响应式更新视图。Vue 的 VM 即组件实例，模板 + 响应式是 MVVM 落地。
2. **SPA**  
   单页：首屏拉应用壳，之后路由在前端切换、局部更新。优点：体验流畅、组件化。缺点：首屏重、SEO 需 SSR、路由与权限更复杂。
3. **SPA vs 多页**  
   多页每次导航整页刷新、SEO 自然、实现简单。SPA 局部更新、状态可保留，工程化要求更高。

## 十二、其他

1. **Vue 与 uni-app**  
   uni-app 用类 Vue 语法，编译到多端（H5/小程序/App）。不是完整 Vue 运行时生态；组件、API、生命周期有平台差异，条件编译常见。
2. **`template` 与 `block`**  
   都不生成多余真实节点，用于包 `v-if`/`v-for`。小程序里 `block` 更常见；H5/Vue 侧多用 `template`。按端规范选用，避免无意义多层包裹。

## 附录：已剔除（与 Vue 无关）

1. 前端常见正则  
2. 两文件 diff 算法  
3. ES5 近似 `const`  
4. 已废弃的 `v-el`
