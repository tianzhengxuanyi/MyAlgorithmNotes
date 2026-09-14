# VueUse 高频面试题（Markdown，简答版）

> 
> 说明：**中小厂初级/中级前端会问到 VueUse；大厂一般不会直接考API默写，更多考察「组合式函数composable思想、原理、自己封装composable的能力」**。
> 简历写「熟悉 VueUse」意味着：要知道它是什么、底层依赖什么、常用API、composable最佳实践；不需要背全部API，但要能说出业务实际用过哪些。

## 1、VueUse 是什么？

> 
> 简答：VueUse 是基于 Vue3 Composition API 的工具集合库，由大量**组合式函数(composable)**组成，封装浏览器、DOM、网络、存储、异步、设备相关通用有状态逻辑，避免项目重复手写工具逻辑，分为核心包`@vueuse/core`和扩展包。

## 2、VueUse底层是基于什么实现？是自己实现响应式吗？

> 
> 简答：**不自己实现响应式，完全复用 Vue3 原生组合式API（ref / reactive / computed / watch / watchEffect / onUnmounted）**，底层响应式依旧是 Vue 的 Proxy。
> 核心特点：内部会自动处理副作用销毁，组件卸载自动清除定时器、事件监听、请求，避免内存泄漏。

## 补充：Composable（组合式函数）概念

> 
> 简答：就是一套封装了**有状态逻辑**的普通函数，使用 Vue 的组合API，区别于普通工具函数；会产生ref响应式状态，内部可以注册onUnmounted做资源清理；解决 mixin 的命名冲突、来源不明问题。

## 3、你项目实际用过哪些 VueUse API？（高频必问）

> 
> 面试口述参考（挑选你真实用过的讲）

1. `useStorage / useLocalStorage`：把ref和localStorage双向绑定，自动持久化状态。
2. `useDebounce / useThrottle`：防抖、节流ref，搜索输入框防抖。
3. `useFetch`：封装网络请求，自带 loading、error、abort取消请求、refetch重新请求。
4. `useMouse`：获取鼠标坐标。
5. `useElementSize`：获取DOM元素宽高。
6. `useAsyncState`：处理异步状态。
7. `whenever`：简化watch，条件为true执行回调。

## 4、`useStorage`原理简单讲一下？

> 
> 简答：内部创建ref，通过watch监听ref值变化，变化就写入localStorage；组件初始化读取storage回填ref；监听storage事件做多tab页同步。

## 5、`useFetch`做了哪些封装，解决什么痛点？

> 
> 简答：封装fetch请求，返回`data、loading、error、abort、refetch`；内部使用`AbortController`，组件卸载自动取消请求，防止组件销毁后还修改响应式状态造成警告，支持响应式url自动重请求。

## 6、VueUse的composable和自己手写composable有什么区别？手写要注意什么？

> 
> 简答：

1. VueUse：边界场景完备，SSR兼容，自动处理副作用销毁，处理ref/maybeRef（可以传ref也可以传普通值），类型完善。
2. 手写composable注意点：

- 返回尽量返回ref，解构不会丢失响应式；
- 一定要在`onUnmounted`清除定时器、事件监听、取消请求，防止内存泄漏；
- 参数兼容ref普通值，使用`unref()`取值；
- 单一职责，一个composable只做一件事。

## 7、composable 和 mixin 的对比？

> 
> 简答：

1. mixin：选项式API，命名冲突，数据来源不清晰；多个mixin变量混在一起；
2. composable：普通函数，导入来源清晰；没有命名冲突；可以传参，灵活组合；类型推导友好。

## 8、什么是`MaybeRef`？VueUse大量使用MaybeRef，作用？

> 
> 简答：`MaybeRef<T> = T | Ref<T>`；参数既可以传普通原始值，也可以传ref响应式对象；内部统一使用`unref()`获取真实值，提高API灵活性。

## 9、VueUse composable会自动清理副作用吗？什么场景不会自动清理？

> 
> 简答：

1. **在组件setup内部调用：自动绑定当前组件effectScope，组件卸载自动清除watch、事件、定时器**。
2. 在**组件外部（普通ts/js文件）直接调用不会自动销毁**，需要手动停止，或者使用`createSharedComposable`。

## 10、`createSharedComposable`作用？

> 
> 简答：让一个composable全局单例，多处调用只执行一次，共享同一份状态，跨组件复用同一份composable状态。

## 11、说说防抖节流：`useDebounceRef`实现思路？

> 
> 简答：内部维护一个原始ref，watch监听源值变化，setTimeout延迟赋值；依赖清除，组件卸载清除定时器。

## 12、VueUse支持SSR吗？

> 
> 简答：大部分API支持SSR；DOM/BOM相关API（useMouse等）内部会做环境判断，服务端环境做降级处理，不会访问window。

## 13、面试延伸题：手写简易的useDebounceRef（常考）

```
import { ref, watch, unref } from 'vue'
export function useDebounceRef<T>(value: T, delay = 300) {
  const debounced = ref<T>(unref(value)) as Ref<T>
  let timer: number | undefined
  watch(() => value, (val) => {
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      debounced.value = val
    }, delay)
  }, { flush:'post' })
  return debounced
}
```

## 面试回答小提示（简历写熟悉VueUse必背）

> 
> 面试官问：讲讲VueUse你怎么用的？
> 参考口述：
> “VueUse是一套Vue3组合式函数工具库，项目中主要用来处理存储、防抖节流、网络请求、DOM相关逻辑，减少重复手写副作用处理；它底层完全基于Vue3的ref、watch等原生API；在组件setup内部调用会自动在组件销毁清除定时器、事件监听，避免内存泄漏。业务中用过useLocalStorage做状态持久化，useDebounceRef做搜索框防抖，useFetch封装请求。同时我也会手写简单的composable封装业务复用逻辑，手写时会注意onUnmounted清理副作用。”

---

### 补充简历技能行优化（你原来）

> 
> 原来：`熟练掌握 Vue3 生态（Vue Router、Pinia、Element Plus、VueUse）`
> 微调版本（更严谨）：
> `熟练掌握 Vue3 生态（Vue Router、Pinia、Element‑Plus；熟悉VueUse组合式工具库，会封装composable业务逻辑）`

如果你需要，我把：vue‑router、pinia、vueuse三份面试题合并成一个完整markdown文档，方便你本地保存复习。