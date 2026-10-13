## Module Federation Bridge 面试笔记

### 一、Bridge 是什么

Bridge 是 Module Federation 提供的**跨框架应用级集成方案**，解决“在 React 中渲染 Vue 应用”或“在 Vue 中渲染 React 应用”的问题。它通过标准化契约，让不同框架的应用能在运行时无缝加载和渲染。

### 二、核心原理：DOM 挂载 + 生命周期契约

Bridge 不依赖框架间直接通信，而是采用**“宿主提供 DOM 容器，远程应用负责渲染”**的模式：

1. **导出端（Remote）**：用 `createBridgeComponent` 将应用包装成一个**普通 JS 对象**，暴露 `render` 和 `destroy` 两个生命周期方法。
2. **消费端（Host）**：用 `createRemoteAppComponent` 加载该对象，渲染时创建 `div` 容器，调用远程模块的 `render` 方法并传入该容器。
3. **隔离渲染**：远程应用收到 `div` 后，**创建自己独立的框架实例**（如 `Vue.createApp`），挂载到宿主提供的 DOM 上。

### 三、组件级 Bridge vs 应用级 Bridge

| 维度 | 组件级 Bridge | 应用级 Bridge |
|---|---|---|
| **渲染对象** | 单个远程组件 | 完整远程应用（含路由、Store） |
| **实例归属** | 宿主创建组件实例 | 远程自己 `createApp` 独立实例 |
| **路由** | 无独立路由 | 有独立路由，需处理 basename |
| **生命周期** | 随宿主组件 mount/unmount | 独立 `render`/`destroy` |
| **状态隔离** | 共享宿主响应式系统 | 独立响应式系统、Store 实例 |
| **典型 API** | `import('remote/Button')` | `createRemoteAppComponent` + `createBridgeComponent` |

### 四、关键 API

| API | 端 | 作用 |
|---|---|---|
| `createBridgeComponent` | Remote | 包装应用为带生命周期的 JS 对象 |
| `createRemoteAppComponent` | Host | 加载并渲染远程 Bridge 模块 |

### 五、Vue 依赖如何解决

- **通过 Module Federation 的 `shared` 协商**，Host 和 Remote 都配置 `shared: { vue: { singleton: true } }`。
- Remote 打包时**不打包完整 Vue**，运行时从共享作用域获取。
- **必须 `singleton: true`**，否则会出现多个 Vue 实例，导致响应式、provide/inject 跨边界失效。

### 六、状态共享问题

每个 Remote 都 `createApp` 独立实例，`provide/inject` 和 Pinia/Vuex 实例**天然无法直接共享**。解决方案：

- **方案一（推荐）**：创建独立的 `shared-store` 模块，通过 MF 的 `singleton: true` 确保所有应用拿到同一个 Pinia 实例，在 `appOptions` 中挂载。
- **方案二**：Host 托管全局 Store，挂载到全局变量或通过 MF 暴露，Remote 检测并复用，独立运行时走 fallback。

**注意**：Bridge 不负责状态共享，这是应用层设计的职责。

### 七、应用级 Bridge 与 qiankun/wujie 的关系

| 维度 | 应用级 Bridge | qiankun/wujie |
|---|---|---|
| **技术栈** | 跨框架（React ↔ Vue） | 任意技术栈 |
| **隔离方式** | 独立框架实例，无沙箱 | JS 沙箱 / iframe |
| **路由** | 通过 basename 协同 | 通过路由分发协同 |
| **适用场景** | 跨框架应用集成 | 多应用集成、强隔离需求 |

应用级 Bridge 更轻量，适合**框架不同但需深度协同**的场景；qiankun/wujie 更重，适合**强隔离或技术栈完全无关**的场景。

### 八、一句话总结

**Bridge = 远程应用自己创建框架实例，宿主只提供 DOM 容器和生命周期调度。** 它的本质是把“应用级集成”做成了框架无关的标准契约，让 React 和 Vue 能互相嵌入完整应用，而非只能复用组件。