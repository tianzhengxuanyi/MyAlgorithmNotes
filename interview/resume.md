### 专业技能

#### 熟悉常见的数据结构和算法，熟悉常见的设计模式
  - javascript设计模式及实现（工厂模式、单例模式、策略模式等）
  - [《JavaScript设计模式与开发实践》最全知识点汇总大全](https://juejin.cn/post/6844903751870840839)


- 熟悉各种 web 前端技术，包括 HTML(5)/CSS(3)/JS(ES6)等，能快速、准确还原设计稿
- 熟练使用 Vue、Typescript 以及相关库(Vue Router、Pinia、Element Plus 等) ，了解 React 框架
- 熟悉浏览器渲染机制和前端性能优化
- 熟悉node 和nestjs开发
- 熟悉数据结构与算法、设计模式，具备良好的代码质量和可维护性。
- 熟悉微前端架构，具备微前端项目（模块联邦）开发经验。
- 熟悉langchain rag检索 langgraph多智能体搭建

### 工作经历

江苏金恒信息科技股份有限公司（南京）2023 年 7 月-至今

JH4J-CODE（2023 年 10 月-2024 年 2 月）
项目描述：JH4J-CODE 是一款高效开发、灵活扩展、安全性高的企业级低代码开发平台， 旨在通过简化开发流程和减少编码工作量，快速创建和部署应用程序，为 B/S 架构产品研发和项目实施提供平台支撑。与传统的软件开发方式相比，JH4J-CODE 平台可以大大减少编码的工作量，并提供了可视化的界面和预先构建的组件，使非专业开发人员通过拖放和配置来创建应用程序就能够轻松创建和定制应用程序。
技术栈：Vue3，TypeScript，Vue-Router，Pinia， Element Plus，TanStack table，module-federation 等
主要工作：
<!-- new -->
1. 负责 JH4J-CODE 平台的前端微前端改造，使用 module-federation 实现微前端架构，将平台拆分成多个子应用，每个子应用负责不同的功能模块，实现模块之间的通信和数据共享(??如何实现)，提升平台首屏加载速度，实现页面秒开（??如何实现？）。并采用pnpm + workspace + nx 管理monorepo仓库。
2. 参与平台低代码组件的封装和修改，包括部门挑选框、横向柱状图、可编辑表格等。
3. 参与平台性能优化，包括内存泄漏问题排查、组件性能、角色授权性能优化、首屏秒开、表格高性能等。
4. 负责AI助手的前端开发，包括模型调用、用户交互、结果展示等功能。
5. 负责平台的运维支撑，包括监控、日志、异常处理等。

## 一、可视化低代码组件库开发
- 基于 Vue 3 + TypeScript + Pinia 搭建低代码组件库，采用 JSON Schema 驱动的声明式渲染方案，实现页面可视化搭建与实时预览
- 集成 Monaco Editor，支持 SFC 实时编译与代码智能提示，提供所见即所得的开发体验
- 组件库按功能域划分（表单、表格、图表等），支持按需加载与版本独立发布
## 二、高级表格组件封装（advance-table）
- 基于 TanStack Table 二次封装，采用 Engine + Feature 插件架构，通过 TableFeature 机制扩展单元格编辑、行列合并等能力，实现关注点分离
- 单元格编辑支持 AsyncValidator 校验规则、自定义 validator 及 trigger 触发时机，编辑态与展示态无缝切换
- 实现行列合并（span），支持动态计算合并区域；列拖拽排序支持固定列区域内/跨区域重排
- 集成行级 + 列级虚拟滚动，保障大数据量渲染性能
- DataSource 层统一管理后端数据请求、分页排序筛选及树形数据转换，支持编辑态数据裁剪与状态持久化
## 三、微前端 + 模块联邦架构升级
- 基于 Module Federation 实现微前端架构改造，主应用与子应用独立开发、独立部署，运行时动态加载远程模块
- 开发自定义 Vite 插件
  - 实现增量构建优化，仅重新编译变更模块，显著降低构建耗时
  - 本地开发环境替将远程模块引用替换为monorepo仓库中的模块，实现本地的多模块开发
- 支持共享依赖抽取与版本协商，避免重复打包，减小产物体积
- 使用pnpm + workspace + nx 管理monorepo仓库，实现模块之间的依赖隔离与版本管理
## 四、页面渲染与菜单权限性能专项优化
- 基于 RBAC 权限模型实现菜单、按钮级别的细粒度权限控制，路由动态注册与权限指令双轨方案
- 大数据列表场景引入虚拟滚动（行 + 列双向），首屏渲染时间降低显著
- 菜单树懒加载与路由组件按需加载，减少首屏资源体积
## 五、内置 AI 智能开发助手
- 集成 AI 对话能力，基于 SSE 实现流式输出，支持实时代码生成与页面搭建
- 对接 LangGraph 工作流，实现自然语言 → 页面 Schema → 渲染产物的端到端生成链路
- 支持上下文感知的代码补全与智能推荐，提升开发效率

<!-- old -->
封装、修改低代码组件。1、表格。添加 toolbar 实现表格字段的显示隐藏和排序；2、部门挑选框。采用树形结构进行部门挑选，支持数据结构配置和单、多选切换；3、横向柱状图。对 echarts 进行二次封装，并改造数据项配置，通过拖拽实现模型的数据组合，快速构建数据模型；4、可编辑表格。使用 TanStack table 实现编辑、行列固定、过滤、分组、列宽拖动、树形表格、虚拟滚动等功能，并拓展添加行列合并、表单校验等功能；
修改、添加低代码组件属性配置器。1、图标、图片选择。添加图标和图片选择，并支持快捷上传，对 svg 和图片进行预览，针对高亮度 svg 添加透明背景；2、JSON、代码配置器。右侧属性面板添加预览的代码编辑器，通过 resize 样式和 ResizeObserve 实现预览代码编辑器的高度拖动；
参与平台优化。1、添加平铺的菜单布局，并支持用户通过系统字典配置菜单布局为树形/平铺；2、用户授权功能优化，当菜单权限较多时，树形选择用户使用体验感差，且页面加载缓慢。对树形菜单中间层级进行合并，采用平铺的方式展示菜单权限，并使用虚拟滚动提升页面性能；3、系统样式优化；


#### 前端性能优化

#### 内存泄漏问题排查  ---> text 和el版本问题 popover
#### 首屏秒开  ----> 打包优化
#### 表格高性能 ----> 虚拟滚动


### 专业技能
- 精通 HTML5/CSS3/JavaScript(ES6+)，熟练使用 TypeScript，掌握泛型、高级类型，搭建项目类型约束体系
- 熟练运用 Vue3 生态（Vue Router、Pinia、Element Plus、VueUse），深入理解响应式原理与编译时优化
- 熟练使用 Vite/Webpack 进行构建配置与优化，具备自定义 Vite 插件开发能力
- 熟练使用 pnpm workspace管理 Monorepo，熟悉ESLint/Prettier/Husky　+ Github Actions代码规范体系
- 熟悉 Module Federation 微前端架构，参与 Module Federation 微前端架构落地
- 熟悉虚拟滚动、Tree Shaking、Code Splitting 等性能优化手段，具备首屏 LCP/FCP 优化实战
- 熟悉 Node.js + NestJS 后端开发，了解 RESTful API 与数据库交互      
**基础语言**
- 精通 HTML5/CSS3/JavaScript(ES6+)，熟练使用 TypeScript 进行类型安全开发
- 熟悉浏览器渲染管线（解析→布局→绘制→合成），具备系统性性能优化实战经验

**框架 & 生态**
- 精通 Vue3 生态（Vue Router、Pinia、Element Plus、VueUse），深入理解响应式原理与编译时优化
<!-- - 熟练使用 React 及其生态（Hooks、Zustand/Redux Toolkit、React Router），了解 Next.js SSR 方案 -->
- 熟悉 JSON Schema 驱动的低代码/可视化搭建方案，具备组件库设计与封装经验

**工程化工具**
- 熟练使用 Vite/Webpack 进行构建配置与优化，具备自定义 Vite 插件开发能力
- 熟练使用 pnpm workspace + Nx 管理 Monorepo，熟悉 CI/CD 流程与 ESLint/Prettier/Husky 代码规范体系
- 了解 Vitest 单元测试、Playwright E2E 测试

**性能 & 进阶工程**
- 熟悉 Module Federation 微前端架构，具备从 0 到 1 的微前端改造与落地经验
- 熟悉虚拟滚动、Tree Shaking、Code Splitting 等性能优化手段，具备首屏 LCP/FCP 优化实战
<!-- - 了解 Storybook 组件文档化、Lighthouse 自动化性能审计 -->

**全栈 & AI**
- 熟悉 Node.js + NestJS 后端开发，了解 RESTful API 与数据库交互
- 熟悉 LLM 应用集成（SSE 流式输出、LangChain RAG 检索、LangGraph 多智能体工作流搭建）

---

### 工作经历

**江苏金恒信息科技股份有限公司（南京）**　2023.07 - 至今

### **JH4J-CODE 企业级低代码开发平台**　2023.10 - 至今

项目描述：面向 B/S 架构的企业级低代码平台，通过 JSON Schema 驱动的可视化搭建与预构建组件，实现应用快速创建与部署，支撑公司核心产品研发与项目交付。

技术栈：Vue3、TypeScript、Pinia、Vue Router、Element Plus、TanStack Table、Module Federation、Vite、NestJS、LangGraph

#### 一、微前端 + 模块联邦架构升级
- 主导平台微前端架构改造，基于 Module Federation 拆分为 1 个主应用 + 5 个子应用，各子应用独立开发部署，运行时动态加载远程模块；通过共享依赖抽取与版本协商，产物体积减少约 35%
- 开发自定义 Vite 插件实现增量构建，仅重新编译变更模块，构建耗时降低约 40%；本地开发自动将远程模块引用替换为 Monorepo 仓库内模块，实现多模块联调
- 采用 pnpm workspace + Nx 管理 Monorepo 仓库，实现模块依赖隔离与版本统一管理，CI 构建效率提升约 50%

#### 低代码功能
- 参与属性配置体系（JSON / Icon / List 等 Setter）及组件数据源配置面板建设，支持动态绑定、默认值与自定义属性扩展；熟悉物料面板 → 画布 → 大纲树 → 属性面板的协作链路与 Schema 驱动渲染机制；
- 深度参与基于 TanStack Table 的 AdvanceTable 建设与演进，面向大数据量列表与可编辑场景，实现虚拟滚动（含横向）、单元格编辑、范围选择、填充手柄、复制粘贴、编辑操作栈、树形懒加载、数据透视、右键菜单与列冻结等类 Excel 能力；针对滚动不同步、固定列闪烁、大数据卡顿等问题持续性性能优化与缺陷治理，沉淀为平台核心表格物料。
- 建设并维护用户 / 部门 / 通用挑选等平台级组件，支持多部门、跨页多选、自定义查询、可输可选及大数据分页回显，解决半选状态丢失、回显不一致、选择卡顿等复杂交互问题；

#### 二、可视化低代码组件库开发
- 基于 Vue3 + TS + Pinia 搭建低代码组件库，采用 JSON Schema 声明式渲染方案，支持 20+ 组件的可视化拖拽搭建与实时预览
- 集成 Monaco Editor 实现 SFC 实时编译与智能提示；组件库按功能域划分（表单/表格/图表），支持按需加载与版本独立发布
- 封装部门挑选框（树形结构+单/多选）、横向柱状图（ECharts 二次封装+拖拽建模）等业务组件，支撑 3 条产品线复用

#### 三、高级表格组件封装（advance-table）
- 基于 TanStack Table 二次封装，采用 Engine + Feature 插件架构，通过 TableFeature 机制扩展单元格编辑、行列合并等能力，实现关注点分离
- 单元格编辑支持 AsyncValidator 校验、自定义 validator 及 trigger 触发时机，编辑态/展示态无缝切换
- 集成行级 + 列级虚拟滚动，万级数据渲染帧率稳定 60fps；DataSource 层统一管理后端请求、分页排序筛选及树形数据转换

#### 四、性能专项优化
- 排查并修复 Vue3 组件库版本兼容导致的内存泄漏问题（Popover 组件未正确销毁引用），页面内存占用降低约 60%
- 基于 RBAC 权限模型实现菜单/按钮级细粒度权限控制，采用路由动态注册 + 自定义权限指令双轨方案；权限树平铺 + 虚拟滚动，菜单授权页面 FCP 从 3.2s 降至 0.8s
- 菜单树懒加载 + 路由组件按需加载 + Tree Shaking，首屏 LCP 从 2.8s 降至 1.2s

#### 五、内置 AI 智能开发助手
- 基于 SSE 实现流式对话输出，对接 LangGraph 工作流，构建自然语言 → 页面 Schema → 渲染产物的端到端生成链路
- 支持上下文感知的代码补全与智能推荐，开发效率提升约 30%
- 后端基于 NestJS + LangChain RAG 实现知识库检索，提升 AI 回复准确率


### JH4J-CODE 企业级低代码开发平台 v2
技术栈：Vue3、TypeScript、Pinia、Vue Router、Element Plus、TanStack Table、Module Federation、Vite、NestJS、LangGraph



一、微前端 + 模块联邦架构升级

- 参与平台微前端架构改造，基于 Module Federation 拆分为主、子应用，各子应用独立开发部署，运行时动态加载远程模块；通过共享依赖抽取与版本协商，产物体积减少约 35%

- 开发自定义 Vite 插件适配微前端多应用场景，实现本地开发环境远程模块自动切换为 Monorepo 本地源码，提升多子应用联调效率；针对多模块构建做定制优化，构建耗时降低约 40%

- 采用 pnpm workspace 管理 Monorepo 仓库，实现模块依赖隔离与版本统一管理



二、可视化低代码组件库开发

- 基于 Vue3 + TS + Pinia 搭建低代码组件库，采用 JSON Schema 声明式渲染方案，支持 20+ 组件的可视化拖拽搭建与实时预览

- 集成 Monaco Editor 实现 SFC 实时编译与智能提示；组件库按功能域划分（表单/表格/图表），支持按需加载与版本独立发布

- 封装部门挑选框（树形结构+单/多选）、横向柱状图（ECharts 二次封装+拖拽建模）等业务组件，支撑 3 条产品线复用



三、高级表格组件封装（advance-table）

- 基于 TanStack Table 二次封装，采用 Engine + Feature 插件架构，通过 TableFeature 机制扩展单元格编辑、行列合并等能力，实现关注点分离

- 单元格编辑支持 AsyncValidator 校验、自定义 validator 及 trigger 触发时机，编辑态/展示态无缝切换

- 集成行级 + 列级虚拟滚动，万级数据渲染帧率稳定 60fps；DataSource 层统一管理后端请求、分页排序筛选及树形数据转换



四、性能专项优化

- 排查并修复 Vue3 组件库版本兼容导致的内存泄漏问题（Popover 组件未正确销毁引用），页面内存占用降低约 60%

- 基于 RBAC 权限模型实现菜单/按钮级细粒度权限控制，采用路由动态注册 + 自定义权限指令双轨方案；权限树平铺 + 虚拟滚动，菜单授权页面 FCP 从 3.2s 降至 0.8s

- 菜单树懒加载 + 路由组件按需加载 + Tree Shaking，首屏 LCP 从 2.8s 降至 1.2s



五、内置 AI 智能开发助手

- 基于 SSE 实现流式对话输出，对接 LangGraph 工作流，构建自然语言 → 页面 Schema → 渲染产物的端到端生成链路

- 支持上下文感知的代码补全与智能推荐，开发效率提升约 30%

- 后端基于 NestJS + LangChain RAG 实现知识库检索，提升 AI 回复准确率


### v3

技术栈：Vue3、TypeScript、Pinia、Vue Router、Element Plus、TanStack Table、Module Federation、Vite、LangGraph

项目描述：JH4J企业业务平台前端底座项目，基于 Module Federation 搭建微前端 Monorepo 架构；配套自研可视化低代码组件库、插件化高级表格组件，并完成全平台前端性能专项治理；内置 AI 开发助手，依托 LangGraph + RAG 实现自然语言转页面 Schema、代码智能生成能力，支撑多条业务线页面快速搭建。

核心工作与成果：

- **主导平台微前端架构改造**，基于 Module Federation 拆分为主应用 + 多子应用，子应用独立开发、独立部署，运行时动态加载远程模块；设计共享依赖抽取与版本协商策略，规避依赖冲突，整体产物体积减少约 35%。
- **开发自定义 Vite 插件适配微前端多应用场景**：本地开发环境自动将远程模块替换为 Monorepo 本地源码，实现多模块并行联调；针对多模块打包做构建优化，构建耗时降低约 40%；基于 pnpm workspace 维护 Monorepo 仓库，完成模块依赖隔离、版本统一管控。
- 基于 Vue3 + TS + Pinia 搭建可视化低代码组件库，采用 JSON Schema 声明式渲染方案，内置 20 + 业务组件，支持可视化拖拽编排、实时预览；集成 Monaco Editor，实现 SFC 代码实时编译与代码智能提示；组件按表单 / 表格 / 图表功能域拆分，支持按需加载、独立版本发布。
- **封装业务组件**：自研树形单选 / 多选部门选择器；基于 ECharts 二次封装横向柱状图，支持拖拽建模；组件物料在 3 条业务产品线复用，减少重复开发。
- **开发 AdvanceTable 高级表格组件**：基于 TanStack Table 二次封装，采用 Engine + Feature 插件架构，通过 TableFeature 机制扩展单元格编辑、行列合并能力，实现逻辑关注点分离；单元格编辑支持 AsyncValidator 异步校验、自定义校验器与自定义触发时机，编辑态 / 展示态无缝切换；集成行、列双维度虚拟滚动，万级大数据渲染稳定维持 60fps；封装 DataSource 数据层，统一处理后端请求、分页、排序、筛选、树形数据转换。
- **前端性能专项治理**：定位并修复 Vue3 Popover 组件引用未销毁造成的内存泄漏问题，页面内存占用下降约 60%；基于 RBAC 模型实现菜单、按钮细粒度权限，采用动态路由注册 + 自定义权限指令双方案；权限树做数据平铺 + 虚拟滚动优化，菜单授权页面 FCP 由 3.2s 优化至 0.8s；菜单树懒加载、路由组件按需加载 + Tree Shaking，首屏 LCP 从 2.8s 降至 1.2s。
- **平台内置 AI 智能开发助手**：基于 SSE 流式输出对接 LangGraph 工作流，搭建自然语言转页面 Schema、再到页面渲染产物的端到端生成链路；支持上下文感知代码补全、组件智能推荐，页面搭建开发效率提升约 30%；后端基于 NestJS + LangChain RAG 构建知识库检索，优化 AI 生成内容准确率。

**技术难点：**

1. Module Federation 多子应用依赖版本冲突治理，共享依赖粒度权衡，兼顾打包体积与运行时依赖一致性；
2. Monorepo 本地源码联调与线上远程模块两套环境无缝切换，解决开发环境模块缓存问题；
3. 低代码 JSON Schema 渲染与 Monaco SFC 实时编译共存，拖拽状态、代码编辑状态双向同步；
4. 高级表格插件架构设计，保证插件扩展能力同时维持大数据场景渲染性能；
5. RBAC 权限树海量节点渲染优化，解决权限树加载卡顿、节点切换性能开销大的问题。


### RAG智能问答

技术栈：NestJS 11 + Fastify + TypeORM + MySQL + PostgreSQL(pgvector) + Redis + BullMQ + MCP ｜ Vue3 + Ant Design Vue + Vite



项目描述：面向企业知识库场景的 RAG 智能问答系统。支持多格式文档（Markdown / PDF / Word / Excel）上传、异步摄取、向量化检索与大模型流式问答；通过「意图树 + 多通道检索 + MCP 工具调用」实现问题路由，配套完整的运营管理后台（知识库管理、切片预览、意图树编排、摄取 Pipeline 配置、调用链 Trace 观测）。

核心工作与成果：

- 设计并实现 DB 驱动的文档摄取 Pipeline 编排引擎：Fetcher → Parser → Enhancer → Chunker → Enricher → Indexer 六类节点注册表化管理，节点间以 `nextNodeId` 链式编排、支持 `conditionJson` 条件跳过；每次执行落 Task/TaskNode 双表，单节点失败可定位、可重试；Indexer 在单事务内完成「删旧 chunk → 落库 → 向量写入 → 状态机流转」，避免半向量化不一致。

-  实现结构感知分块（Structure-Aware Chunking）：自研 Parser 层将文档解析为 Block 模型（heading / paragraph / table / code / list），Chunker 按块语义贪心合并、表格与代码块原子保留，并用 HeadingBlock 累积 outlinePath 形成章节层级路径，显著提升切片语义完整度与召回准确率。

-  实现意图树驱动的多通道并行检索引擎：三级意图树（域 / 类目 / 主题）整树 JSON 缓存于 Redis（7 天 TTL + 主动失效）；对话侧一次 LLM 调用完成全候选打分（temperature=0.1 强确定性 + JSON 输出防幻觉 ID 校验）；检索侧 IntentDirected（意图定向过滤）/ VectorGlobal（全局向量）/ Keyword（关键词）多通道并行召回、按优先级融合。意图定向通道通过向量元数据 `intentNodeId` SQL 过滤实现「写侧打标、读侧过滤」，并设计空结果自动降级避免高置信意图零召回。

-  基于 MCP（Model Context Protocol）实现工具调用体系：独立 mcp-server 子进程（HTTP Streamable Transport）对外提供天气 / 工单 / 销售等工具；后端启动时自动发现注册工具，LLM 从口语化问题中提取结构化参数；实现工具发现层 / 意图分类层 / 运行时执行层的三层权限校验，无权工具对 LLM 不可见。

-  实现多模型 LLM 网关与稳定性体系：统一封装 OpenAI / Claude / DeepSeek / Qwen / Ollama 等多家模型，模型路由 + 三态熔断器 + 降级链兜底；SSE 流式输出支持首包探测超时、任务取消（Redis 广播）、限流队列；修复全局超时拦截器与 SSE 长连接冲突导致的 408 问题。

-  摄取期 chunk 意图离线打标：Enricher 节点用意图叶子的名称 / 路径 / 示例与 chunk 文本做加权关键词打分（零 LLM 成本、可解释），Top-1 写入 chunk 元数据，供检索定向过滤。

- 全链路可观测：每次问答生成 Trace 树（改写 → 意图识别 → 各通道检索 → 生成），记录节点耗时与产出，管理后台可视化排查「召回为空」「意图误判」等问题。

- 管理后台（Vue3）：知识库 / 文档 / 切片三级管理，切片页实现「原文预览与切片双向定位」（Markdown 用 marked 渲染 + offset 高亮，PDF 用 pdf.js 分页渲染 + 文本匹配定位页码）；意图树 CRUD、摄取 Pipeline 可视化配置、OpenAPI 自动生成类型安全的前端 API 层。

技术难点：

1. 向量库（PostgreSQL）与业务库（MySQL）双数据源下的一致性设计——摄取事务边界、文档删除时两库级联清理；

2. 意图体系「树变更后存量数据元数据过期」问题——通过检索侧空结果降级兜底，并规划只更新元数据、不重算向量的重打标任务；

3. SSE 流式响应与全局拦截器 / 异常过滤器的冲突——手动接管 Fastify 响应流、按 headersSent 状态分流处理。