# Vue‑Router面试题（Vue2 Router3 \+ Vue3 Router4 对比，简洁版）

> 原文来源：掘金 [https://juejin\.cn/post/6844903961745440775](https://juejin.cn/post/6844903961745440775)
> 说明：同时标注 Vue Router3 \(Vue2\) 与 Router4 \(Vue3\) 关键差异，答案精简可直接面试背诵

## 1、怎么重定向页面？

**Router3**

1. 字符串路径：`{path:'/a',redirect:'/b'}`

2. 命名路由：`{path:'/a',redirect:{name:'foo'}}`

3. 函数返回：`redirect:to=>{ /*逻辑，返回路径/对象*/ }`

**Router4**：API 保持不变。

## 2、怎么配置 404 页面？

- Router3：`{path:'*',component:NotFound}`，放路由数组最后；也可重定向。

- Router4：移除`*`通配符，写法：`{path:'/:pathMatch(.*)*',component:NotFound}`。

## 3、切换路由保存草稿如何实现？

使用`<keep‑alive>`包裹`<router‑view>`；通过`include`指定组件 name，被缓存组件表单草稿保留。

```vue
<keep‑alive :include="['CompName']">
  <router‑view/>
</keep‑alive>
```

## 4、路由有几种模式？区别？

1. **hash**：URL 带`#`；监听`hashchange`；不请求后端；兼容性最好。Router4：`createWebHashHistory()`

2. **history**：URL 无 \#；基于 HTML5 History API；刷新会请求后端，后端必须配置返回 index\.html，否则 404。Router4：`createWebHistory()`

3. **abstract**：JS 环境（Node），无浏览器 API 自动进入该模式。Router4：`createMemoryHistory()`。

## 5、完整导航守卫流程

1. 导航触发

2. 失活组件执行`beforeRouteLeave`

3. 全局`beforeEach`

4. 复用组件执行`beforeRouteUpdate`

5. 路由独享`beforeEnter`

6. 解析异步路由组件

7. 目标组件`beforeRouteEnter`

8. 全局`beforeResolve`

9. 导航确认

10. 全局`afterEach`

11. DOM 更新

12. 执行`beforeRouteEnter(next(vm=>{}))`回调，vm 为组件实例。

## 6、导航守卫和 Vue 生命周期钩子执行顺序

**导航守卫全部在组件生命周期钩子之前执行**。

## 7、导航守卫 to、from、next 参数含义

- `to`：目标路由对象

- `from`：离开的路由对象

- `next`：放行函数（Router3 必须调用；Router4 可 return 代替 next）
  - `next()`放行；`next(false)`中断；`next('/xxx')`跳转到新路由。

## 8、afterEach 可以使用 next 吗？

不可以，`afterEach`没有 next 参数，仅做后置逻辑（埋点、修改页面标题）。

## 9、全局导航守卫有哪些？

1. `beforeEach`全局前置；

2. `beforeResolve`全局解析（组件异步解析完成后，导航确认前）；

3. `afterEach`全局后置。

> Router4：守卫支持 return 路径 / 对象，不必强制调用 next \(\)。

## 10、路由独享守卫是什么？

`beforeEnter`，写在 routes 某一项配置中，**仅进入该路由触发**。

```js
{path:'/foo',component:Foo,beforeEnter:(to,from,next)=>{}}
```

## 11、组件内导航守卫有哪些？

1. `beforeRouteLeave`：离开当前组件；

2. `beforeRouteUpdate`：路由参数变化，组件被复用；

3. `beforeRouteEnter`：进入组件，组件实例未创建。

> Router4 组合式 API 提供：`onBeforeRouteLeave`、`onBeforeRouteUpdate`。`beforeRouteEnter`仅选项式 API 可用。

## 12、beforeRouteEnter 能否访问 this？

不能；组件实例尚未创建。
通过`next(vm=>{})`回调拿到组件实例 vm。

```js
beforeRouteEnter(to,from,next){
  next(vm=>{console.log(vm)})
}
```

## 13、说说 router‑link

内置声明式导航组件。

- `to`：目标路由，字符串 / 对象；path 与 params 不能同时生效。

- `replace`：不新增 history 记录；
  Router3 支持：`append、tag、exact、event`；**Router4 删除以上属性**。

- `active‑class`：匹配激活 class；`exact‑active‑class`精确匹配 class。

## 14、监听路由参数变化

两种方案（组件复用场景）

1. watch 监听`$route`；setup 中用`watch(route,()=>{})`

2. 组件守卫`beforeRouteUpdate`。

## 15、切换路由滚动到顶部 / 保存滚动位置

配置`scrollBehavior(to,from,savedPosition)`

```js
scrollBehavior(to,from,savedPosition){
  if(savedPosition) return savedPosition //回退保存位置
  return {x:0,y:0} //新页面滚到顶部
}
```

## 16、嵌套路由使用场景

布局页面：layout 包含头部、侧边栏，主内容区放子`<router‑view>`；子路由渲染到 layout 内部视图，公共布局复用。配置`children`数组。

## 17、命名视图

同一路由、同级渲染多个组件；多个`<router‑view name="xxx">`；路由配置使用`components`（复数），key 对应 name，default 对应不带 name 的 router‑view。

## 18、路由传参与获取参数

1. `meta`路由元：路由配置 meta，`$route.meta.xxx`获取；权限、页面标题常用。

2. query：url 拼接`?a=1`；`push({path:'xxx',query:{a:1}})`；`$route.query`获取。

3. params 动态路由：路由配置`/user/:id`；push 必须使用 name；`$route.params`获取。

> Router4 setup 中用`useRoute()`拿到 route 对象。

## 19、路由组件解耦（props）

直接`$route`会组件与路由强耦合，使用`props`解耦。

- `props:true`：将`route.params`注入组件 props；

- props 对象：静态传参；

- props 函数：从 route 对象计算属性，支持 query。

## 20、route 与 router 区别

- `$route`（useRoute\(\)）**路由信息对象**：path、query、params、meta 等只读信息。

- `$router`（useRouter\(\)）**路由实例对象**：push、replace、addRoute，导航方法。

## 21、动态加载路由（权限菜单）

- Router3：`addRoutes`已废弃，推荐循环调用`addRoute`；404 路由要动态追加。

- Router4：**删除 addRoutes，仅保留 addRoute \(单条添加\)**，支持添加子路由；添加完路由可能需要手动触发跳转刷新匹配。

```js
router.addRoute(routeRecord);
```

## 22、路由懒加载

分割代码，访问时才加载组件。

```js
component: () => import("@/views/home.vue");
```

## 23、路由跳转方式

1. 声明式：`<router‑link to="xxx"/>`

2. 编程式：`$router.push()`新增历史；`$router.replace()`替换历史；`go(n)`前进后退。

## 24、history 模式部署 Nginx 注意事项

history 模式刷新 404；nginx 配置将所有请求重定向到 index\.html，由前端路由接管匹配。

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 25、新窗口打开路由

```js
// Router3
const { href } = this.$router.resolve({ path: "xxx", query: {} });
window.open(href, "_blank");
```

> Router4：`const {href}=router.resolve({path:'xxx'})`

---

### 复制全部内容，保存为 `vue‑router‑interview.md`，即可本地打开查看。

需要我把这份 md 导出为可以直接下载的文件链接吗？或者需要我再把这份题做成填空 / 自测版本？

> （注：部分内容可能由 AI 生成）
