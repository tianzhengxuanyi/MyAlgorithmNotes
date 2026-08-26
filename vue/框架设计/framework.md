# Vue.js 设计与实现 · 第一章 + Vapor 模式精简笔记

## 一、第一章：权衡的艺术

### 1. 命令式 vs 声明式

- **命令式**：关注过程，一步步告诉机器怎么做（原生 JS、jQuery）。性能上限高，维护成本高。
- **声明式**：关注结果，描述目标，框架内部实现（Vue 模板）。可读性好、可维护性强，牺牲一点极致性能。
- **Vue 对外暴露声明式，底层内部实现是命令式。**

### 2. 性能与可维护性的权衡

- 命令式：性能好，维护差；声明式：维护简单，性能略低。
- Vue 选择：优先可维护性与开发效率，同时用虚拟 DOM、编译优化抹平性能差距。

### 3. 运行时 vs 编译时框架

| 类型 | 特点 | 代表 |
| --- | --- | --- |
| 运行时 | 不编译，直接执行渲染，灵活但运行时开销大 | React JSX、Vue runtime-only |
| 编译时 | 提前编译模板产出优化代码，性能高但灵活性差 | 早期模板引擎、Svelte |
| 编译+运行时 | 构建期编译优化 + 保留运行时动态能力 | **Vue3（VDOM 模式）** |

### 4. 虚拟 DOM 与 Diff

- 虚拟 DOM 本质：用 JS 对象描述 DOM 结构（VNode）。
- 价值：解决声明式下精准更新 DOM 的问题；通过 Diff 最小量更新；天然支持跨平台（DOM / Native / SSR）。
- **虚拟 DOM 不一定更快**：简单场景原生更快；复杂 DOM 更新场景收益明显。

### 5. Vue3 编译优化（铺垫）

- **PatchFlags**：标记动态节点，Diff 时跳过静态节点。
- **静态提升**：不变节点提到渲染函数外，避免每次重建 VNode。
- **Block Tree**：以动态 block 为单位组织树，缩小 Diff 范围。

### 6. 框架设计通用权衡

性能 ↔ 可维护性；运行时灵活性 ↔ 编译期性能；体积 ↔ 功能完备；通用性 ↔ 特定场景极致优化。

> 
> **一句话**：框架是权衡的艺术。Vue 选声明式提升开发效率，用编译+运行时结合、虚拟 DOM + Diff、编译期优化来平衡性能与灵活性。

---

## 二、Vapor Mode（Vue3.6 蒸汽模式）

### 1. Vapor 是纯编译时框架吗？

**不是。属于「编译时驱动 + 极简轻量运行时」结合。**

- 编译时（compiler-vapor）：静态分析模板，直接生成原生 DOM 操作代码，建立「响应式变量 ↔ DOM 更新 effect」绑定关系。
- 运行时（runtime-vapor）：仍需响应式 Proxy、组件生命周期、事件系统、少量 v-if/列表锚点处理。
- 与 Svelte 区别：Svelte 更接近纯编译时，几乎无运行时；Vapor 复用 Vue 响应式体系，保留轻量运行时。

### 2. VDOM vs Vapor 渲染链路

**传统 VDOM**：

```
数据变更 → 组件级 effect 执行 → 生成全新 VNode 树 → diff 新旧 VNode → patch 更新 DOM
```

**Vapor**：

```
数据变更 → 直接触发订阅该变量的细粒度 effect → 执行原生 DOM 操作（textContent / setAttribute）
```

- 更新粒度：VDOM 是**组件级**；Vapor 是**绑定细粒度**。
- Vapor 无 VNode、无整树 diff、无通用 patch；v-for 仅保留轻量节点复用 diff（非传统组件级 VDOM diff）。

### 3. 性能对比

| 维度 | 虚拟 DOM | Vapor |
| --- | --- | --- |
| 更新流程 | VNode → diff → patch → DOM | 直接 effect 更新 DOM |
| VNode | 有 | 无 |
| 全树 diff | 有（PatchFlags 缩小范围） | 无 |
| 通用 patch | 有 | 无 |
| 更新粒度 | 组件级 | 绑定细粒度 |
| 内存/GC | 更高（大量临时 VNode） | 更低 |
| 包体积 | runtime 更大 | runtime-vapor 更轻 |
| 优势场景 | 动态组件、高阶抽象、SSR、跨平台 | 高频局部更新、长列表、实时看板 |

### 4. 为什么 Vue3 初期不直接用 Vapor？

**不是当时没想到，而是权衡后 VDOM 更稳妥。**

1. **保留手写 render / JSX 灵活性**：库作者、高阶组件、动态抽象刚需，Vapor 要求结构静态可分析。
2. **跨平台与 SSR**：VNode 是普通对象，可对接 DOM / Native / SSR；Vapor 直接绑定浏览器 DOM，跨平台适配难。
3. **兼容 Vue2 生态**：平滑迁移成本可控，一刀切无 VDOM 会导致存量组件、第三方库无法迁移。
4. **2020 年编译器静态分析能力不足**：Svelte/Solid 尚未出圈，实现 Vapor 所需的全量静态分析编译器复杂度极高；当时优先落地 Composition API、TS、基础性能。
5. **当时策略**：先做**增强型 VDOM（PatchFlags + BlockTree + 静态提升）**，性价比最高，已大幅削弱 diff 开销。

> 
> 等到 3.6 推出 Vapor：编译器架构成熟、社区接受细粒度范式、性能需求升级，且定位为**组件级可选模式**（`<script setup vapor>`），不替代 VDOM。

### 5. 为什么 Vapor 对 JSX / h() / 动态组件 / SSR 适配差？

**根本原因：Vapor 前置约束是「编译期能完整确定 DOM 结构、节点数量、绑定位置」。运行时才能决定结构的，静态分析失效。**

- **h() / 手写 render**：运行时动态创建 VNode，编译期根本不知道最终 DOM 结构，无法预生成 DOM effect。
- **JSX / TSX**：语法本身可被静态解析（官方实验分支已支持纯静态 JSX），但业务 JSX 常含动态标签 `<{tag}>`、运行时分支，结构不可预知，降级回 VDOM。
- **动态组件 `<component :is="xxx">`**：运行时才知道渲染哪个组件，DOM 结构不确定；静态导入的固定组件可有限兼容。
- **SSR & Hydration**：Vapor 产物是直接 DOM 操作而非 VNode，水合需额外输出节点锚点信息，复杂度高，成熟度不足。

### 6. 关键澄清：SFC 的 v-if / v-for 为什么不会让 Vapor 失效？

- **v-if / v-for 的模板 AST 在编译期是完整确定的**：编译器能提前知道所有分支、循环单条 item 的 DOM 结构，预生成多套 DOM 片段 + 锚点，数据变化直接切换/增删。
- **v-for**：为 key 复用节点、保留表单状态，内置**轻量列表 diff**，但不是传统组件级 VDOM 整树 diff，整体仍属 Vapor 管线。
- 与动态标签的本质区别：
  - v-if：**分支集合编译期全部可知**；
  - 动态 tag / h()：**节点类型运行时无限可变，编译期无法预判**。

### 7. Vapor 受限/不支持的 SFC 特性

- `<component :is="动态变量">`（需 interop 桥接 VDOM）
- `v-html`（内部结构无法静态分析）
- Teleport / Suspense / KeepAlive / Transition（强依赖 VNode 抽象）
- 极动态的 slot 抽象、高阶组件封装

> 
> 不会整个组件降级，**仅局部走 VDOM 桥接（vaporInteropPlugin）**，其余普通模板部分仍走 Vapor。

---

## 三、面试一句话总结

> 
> 第一章核心是框架即权衡：Vue 选声明式 + 编译运行时结合 + 虚拟 DOM，用 PatchFlags/静态提升平衡性能与灵活性。Vapor 是 Vue3.6 推出的可选高性能模式，编译期直接生成 DOM 操作与细粒度 effect，去掉 VNode 和整树 diff；但因依赖编译期静态结构确定，对 h/动态 JSX/动态组件/SSR 适配差，且初期为兼顾生态、跨平台、灵活性而选择增强型 VDOM，待编译器与生态成熟后才作为可选模式推出。

# 《Vue.js 设计与实现》第二章（框架设计的核心要素）Vue 相关精简笔记

> 
> 剔除通用框架设计理论，**只记录和Vue3直接相关、面试能用的知识点**

## 2.1 开发体验（Vue相关）

- Vue 在开发环境提供精准的友好警告（模板语法错误、props校验、响应式陷阱等），帮助快速定位问题
- 生产环境直接移除全部警告代码，不增加线上包体积（依靠 `__DEV__` 环境常量控制）

## 2.2 体积控制 & Tree-Shaking（Vue3重点）

1. Vue3 基于 ESM 模块化，**原生支持 Tree-Shaking**，未使用的模块（如内置组件、某些API）会被打包工具剔除
2. `/*#__PURE__*/` 注释：Vue源码大量使用，辅助打包工具识别纯函数，安全剔除无副作用代码
3. 特性开关（`__FEATURES__`）：编译期开关，可关闭某些不使用的内置能力进一步减包（如可选关闭 `v-model`、`Transition`）

## 2.3 Vue3 的多构建产物（面试高频）

Vue3 会输出多种格式包，适配不同场景：

- **ESM（esm-bundler）**：给webpack/vite等打包工具使用，支持tree-shaking，**业务项目默认选用**
- **ESM（esm-browser）**：直接浏览器 `<script type="module">` 引入，不支持tree-shaking
- **IIFE（global）**：script直接引入，挂载全局 `Vue` 对象（CDN直接用）
- **CJS**：Node环境使用

> 
> 区分 runtime-only / full 包：
> 
> 
> - runtime-only：**不含编译器**，模板必须预编译成render函数（生产推荐，体积更小）
> - full：包含编译器，可以运行时编译template（仅动态模板场景使用）

## 2.4 统一错误处理（Vue内部机制）

Vue3 内部封装 `callWithErrorHandling` 统一捕获各类回调异常：生命周期、watch、渲染函数、事件回调

- 异常统一交给 `app.config.errorHandler` 处理，用户可全局自定义兜底
- 避免单个组件异常直接导致整个应用崩溃

## 2.5 TypeScript 类型支持

- Vue3 源码由TS编写，天然提供完善类型定义
- Composition API（ref/reactive/computed等）类型推导友好，优于Vue2的Option API
- 内置组件、全局API、SFC都有配套类型支持

## ✅ 一句话总结（口述）

Vue3 通过 `__DEV__`、特性开关、ESM+Tree-Shaking、多产物分发控制包体积；内部统一错误捕获，原生完善TS支持；同时区分full包和runtime-only包，是否携带编译器是核心差异。

## 📌 面试高频追问（本章衍生）

### Q：Vite项目默认用哪个版本的Vue包？

esm-bundler + runtime-only，不包含编译器，SFC模板在vite插件预编译。

### Q：runtime-only包什么时候不能用？

运行时动态传入字符串template的场景，必须引入full完整版。

### Q：Tree-Shaking为什么Vue2不行，Vue3可以？

Vue2 是对象式导出，大量副作用；Vue3 ESM分模块导出，纯函数+`#__PURE__`，支持tree-shaking。