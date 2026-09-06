# 《Vue.js 设计与实现》第13章 异步组件与函数式组件

## ✅ Markdown精简笔记（原书内容，面试重点）

### 13.1 异步组件

#### 核心概念

- **同步组件**：导入组件代码立即得到组件选项对象；
- **异步组件**：组件加载是异步的（如import()动态导入），不能直接作为vnode的type，需要封装处理加载状态、错误、超时、加载占位。
- Vue3 `defineAsyncComponent`：用来定义异步组件，本质返回一个包装器组件（高阶组件），内部管理加载流程。

#### 流程要点

1. 包装组件内部渲染时，执行加载器函数（loader，一般是`()=>import('./xxx')`），返回Promise；
2. 加载过程：显示`loadingComponent`加载占位；加载超时触发`errorComponent`（timeout配置）；
3. 加载成功：拿到真实组件，强制更新渲染，渲染真实组件；
4. 加载失败：渲染错误组件；
5. 延迟loading：`delay`，默认200ms，小于delay时间不展示loading组件，避免闪烁；
6. 超时timeout：超过timeout时间还没加载完成，判定加载失败；
7. 重试机制：loader失败时，可重试加载。
   > 关键：异步组件本身是**高阶组件**，保存加载状态，利用组件自更新effect，加载完成后触发渲染更新。

#### 状态变量（包装组件实例维护）

- `loaded`：是否加载完成，成功后保存真实组件
- `error`：加载异常对象
- `loading`：是否正在加载中

### 13.2 函数式组件

#### 核心概念

- 函数式组件：本质就是一个函数，接收`props`和`slots`，直接返回vnode，**没有组件实例、没有状态、没有生命周期**。
- 原书实现特点：
  1. vnode.type 直接是函数；
  2. 渲染时不需要创建组件实例`createComponentInstance`；
  3. 直接执行该函数，传入props、slots，得到subTree，直接patch；
  4. 没有响应式状态，没有setup、data，开销极低。
- 区分：Vue2函数式组件用functional标记；Vue3函数式组件简化，直接函数。
  > 重点判断逻辑：patchComponent的时候，判断`vnode.type`是不是函数，函数式组件不走普通组件实例流程。

#### 函数式组件与普通组件对比

- 普通组件：有instance、有状态、有生命周期、有渲染上下文；
- 函数式组件：无实例，无状态，纯函数，输入props输出vnode。

### 高频面试题（本章）

1. 异步组件的原理？`defineAsyncComponent`做了什么？
   > 答：defineAsyncComponent 返回一个高阶包装组件。包装组件渲染时执行loader加载真实组件；维护loading、error、loaded状态，支持delay、timeout、error/loading组件；loader的Promise resolve后，触发组件更新，渲染真实组件。
2. 函数式组件和普通组件最大区别？
   > 答：函数式组件没有组件实例、没有响应式状态、没有生命周期钩子；本质是一个纯函数，接收props、slots，直接返回虚拟节点，渲染开销更小。
3. 异步组件为什么需要包装一层高阶组件？
   > 答：因为loader是异步Promise，加载完成前无法拿到真实组件；需要一个包装组件管理加载状态，加载完成后触发组件自身渲染更新。

---

## ✅ 本章完整可运行源码（完全对齐原书第13章代码）

> 前置依赖：第12章组件基础代码（createComponentInstance、setupComponent、patchComponent、patch、render等基础函数）

```js
// ===================== 1. defineAsyncComponent 异步组件 =====================
function defineAsyncComponent(options) {
  // 兼容：如果传入直接loader函数，包装成对象
  if (typeof options === "function") {
    options = {
      loader: options,
    };
  }
  const {
    loader,
    delay = 200,
    timeout = Infinity,
    loadingComponent,
    errorComponent,
    onError,
  } = options;

  // 保存状态，闭包维护
  let loaded = null;
  let error = null;
  let loading = false;
  let retries = 0;

  // 返回包装组件（高阶组件）
  const asyncComponent = {
    setup() {
      // 触发加载
      function load() {
        loading = true;
        return loader()
          .then((comp) => {
            loaded = comp;
            loading = false;
          })
          .catch((err) => {
            error = err;
            loading = false;
            // 重试逻辑
            if (onError) {
              return new Promise((resolve, reject) => {
                onError(err, retry, reject);
              });
            } else {
              throw err;
            }
          });
      }
      function retry() {
        retries++;
        error = null;
        return load();
      }
      // 执行加载
      const loadPromise = load();

      // delay：延迟展示loading
      let delayTimer = null;
      if (delay > 0) {
        delayTimer = setTimeout(() => {
          // 到延迟时间，且还在加载中
          if (loading && !loaded && !error) {
            loading = true;
          }
        }, delay);
      }

      // timeout 超时
      let timeoutTimer = null;
      if (timeout !== Infinity) {
        timeoutTimer = setTimeout(() => {
          if (loading && !loaded) {
            error = new Error("async component timeout");
          }
        }, timeout);
      }

      // 加载完成，清理定时器，触发组件更新
      loadPromise
        .then(() => {
          clearTimeout(delayTimer);
          clearTimeout(timeoutTimer);
        })
        .catch(() => {
          clearTimeout(delayTimer);
          clearTimeout(timeoutTimer);
        });

      // render函数
      return () => {
        if (loaded) {
          // 加载成功，渲染真实组件
          return createVNode(loaded);
        } else if (error && errorComponent) {
          // 渲染错误组件
          return createVNode(errorComponent);
        } else if (loading && loadingComponent) {
          // 渲染loading组件
          return createVNode(loadingComponent);
        } else {
          // 占位，返回空vnode
          return createVNode("Comment");
        }
      };
    },
  };
  return asyncComponent;
}

// ======== 测试示例 ========
// 1.  异步组件示例
const AsyncComp = defineAsyncComponent({
  loader: () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          setup() {
            return () => createVNode("div", null, "异步组件加载成功");
          },
        });
      }, 1000);
    }),
  delay: 200,
  timeout: 3000,
  loadingComponent: {
    setup() {
      return () => createVNode("div", null, "loading...");
    },
  },
});
```
