【姓名】          | 求职意向：Agent / AI应用开发工程师
【电话/邮箱/GitHub/城市】
【工作年限】3年前端开发，深度实践RAG、MCP、LLM应用，具备完整AI Agent系统原型落地能力

━━━ 技能特长 ━━━
- 熟练掌握 HTML5/CSS3、JavaScript(ES6+)；精通TypeScript，熟练运用泛型、高级类型、类型体操完成复杂类型定义
- 熟练掌握Vue3完整生态，深入理解响应式底层、编译时优化（PatchFlags、静态提升）；熟练Pinia、Vue Router、VueUse
- 熟练Vite/Webpack构建调优，可独立开发复杂自定义Vite/Rollup插件；精通pnpm workspace Monorepo完整工程实践
- 熟练落地ESLint/Prettier/Husky + GitHub Actions完整代码流水线；精通Module Federation微前端，深入共享依赖、版本冲突底层机制
- 精通前端性能优化体系：虚拟滚动、Tree‑Shaking、Code‑Splitting，实战LCP/FCP等核心指标调优；熟练排查内存泄漏、渲染卡顿
- 熟练常用数据结构与算法，能够在业务、AI场景落地算法优化；熟练NestJS/Fastify后端开发
- 精通RAG全链路：文档解析、结构感知分块、向量库调优、多通道检索融合；熟练MCP协议工具调用、LLM网关熔断降级、SSE流式、全链路Trace观测；熟练pgvector、Redis、BullMQ异步任务队列

━━━ 项目经历 ━━━
### 项目一：JH4J 企业业务平台前端底座
技术栈：Vue3、TypeScript、Pinia、Vue Router、Element Plus、TanStack Table、Module Federation、Vite

项目描述：企业级业务平台前端底座，基于Module Federation搭建Monorepo微前端架构；自研低代码组件库、插件化高级表格组件，完成大规模平台性能专项治理，支撑多条业务线快速交付。

核心工作与成果：
- 主导平台微前端架构改造，基于Module Federation完成主+多子应用拆分，子应用独立开发部署，运行时动态加载远程模块；设计共享依赖抽取与版本协商策略，解决多应用版本冲突问题。
- 设计开发自定义Vite插件，实现本地远程模块自动映射Monorepo源码，解决多子应用联调痛点；针对多模块构建做专项优化；基于pnpm workspace搭建Monorepo仓库，完成依赖隔离与版本统一管控。
- 主导低代码组件库建设，负责AdvanceTable、UserPicker等核心业务组件；定位万级数据选中卡顿，使用Map哈希查找把复杂度O(n²)优化至O(n)；深度参与JSON‑Schema声明式渲染、拖拽‑代码双向同步核心逻辑开发。
- 主导AdvanceTable高级表格组件设计，基于TanStack Table设计Engine+Feature插件架构；完整实现行列合并、单元格AsyncValidator异步校验、行列双向虚拟滚动；封装DataSource层统一处理请求、分页、筛选、树形转换。
- 主导平台全量性能专项治理：首屏体积23.1MB→3.5MB，LCP 10.8s→2.3s，Lighthouse评分52提升至98；落地远程模块懒加载、WebP图片压缩、字体子集脚本等多项优化手段，解决内存泄漏问题。

技术难点：
1. Module Federation共享依赖粒度权衡，复杂多子应用版本冲突治理
2. Monorepo本地源码与线上远程模块环境切换，模块缓存问题根治
3. 低代码拖拽‑代码编辑双向状态同步；表格插件架构扩展性与大数据渲染性能平衡

### 项目二：RAG智能问答平台
技术栈：NestJS + Fastify + TypeORM + MySQL + PostgreSQL(pgvector) + Redis + BullMQ + MCP｜Vue3 + Ant Design Vue + Vite

项目描述：企业级RAG智能问答原型系统，完整实现文档摄取流水线、结构感知分块、意图树多通道检索、MCP工具调用、LLM网关熔断降级、全链路Trace可观测，配套完整运营后台。

核心工作与成果：
- 设计并实现DB驱动文档摄取Pipeline编排引擎，完成节点注册表化、链式编排、条件跳转、失败重试机制；Indexer事务保证业务库与向量库强一致性，避免半向量化异常。
- 自研Structure‑Aware分块算法，文档解析Block模型，保留表格代码块原子完整性，构建章节outline路径，提升切片语义完整性与召回准确率。
- 设计意图树驱动多通道并行检索引擎；Redis实现意图树缓存与主动失效；实现意图定向、全局向量、关键词多通道并行召回融合；设计空结果降级策略，规避高置信意图零召回。
- 基于MCP Model Context Protocol完整实现工具调用体系；独立MCP‑Server子进程，HTTP Streamable Transport通信；实现工具自动注册、参数解析、三层权限校验。
- 实现多模型LLM网关，模型路由、三态熔断器、降级链路；完整实现SSE流式输出、任务Redis广播取消、限流队列；修复Fastify SSE长连接与全局拦截器冲突。
- 实现摄取阶段chunk离线意图打标，基于加权关键词打分，零LLM成本完成元数据打标；构建问答全链路Trace树，可可视化定位召回为空、意图误判问题。
- 开发完整管理后台；知识库、文档、切片全量管理；Markdown/PDF原文切片双向定位；基于OpenAPI自动生成类型安全前端API层。

技术难点：
1. MySQL与pgvector双数据源一致性，文档删除场景级联清理
2. 意图树变更存量chunk元数据过期，设计增量重打标任务方案
3. Fastify SSE流式响应和全局异常拦截器冲突，基于headersSent完成响应流接管处理

━━━ 教育背景 ━━━
（自行填写）


__ TODO __

# TODO 学习清单

> 
> 分为三部分：①原有 B 类复习项（面试必看）；②Agent 岗位额外扩展学习；③理想化全掌握版本还需要补齐（版本 3 目标）

## 🔴 P0｜原有 B 类复习项（投递前端 / Agent 岗位都要复习）

- Vue 响应式原理与编译时优化：Proxy /track/trigger、diff 算法、PatchFlags、静态提升
- Module Federation 微前端：共享依赖、版本协商、运行时加载链路、冲突场景
- 自定义 Vite 插件开发：rollup 钩子、插件执行顺序，远程模块替换实现原理
- AdvanceTable Engine+Feature 插件架构，TableFeature 如何做能力解耦
- JSON‑Schema 声明式渲染，拖拽状态与代码编辑双向同步实现思路
- 前端性能体系：LCP/FCP 指标、Tree‑Shaking、Code‑Splitting、虚拟滚动、字体子集
- pnpm workspace Monorepo：workspace 协议、依赖隔离、版本管理
- UserPicker 优化原理：Map 哈希查找对比数组遍历时间复杂度
- DataSource 层设计：分页 / 筛选 / 树形数据统一封装逻辑
- ESLint / Prettier / Husky + GitHub Actions 完整流水线流程
- 业务场景下数据结构算法应用案例

## 🟡 P1｜Agent 岗位额外扩展学习（投递 Agent 岗必掌握）

- RAG 摄取 Pipeline 完整链路：Fetcher/Parser/Chunker/Indexer 各个节点职责，任务状态机、失败重试策略
- Structure‑Aware‑Chunking 实现细节：Block 模型，表格、代码块特殊处理逻辑
- 意图树 + 多通道检索：Redis 缓存策略、多路召回结果融合算法、空结果降级逻辑
- MCP 协议：Streamable Transport 通信流程，服务发现，三层权限校验完整流程
- LLM 网关：熔断器原理、降级链策略、SSE 流式处理、任务取消 Redis 广播实现
- pgvector 向量库基础：向量索引选型、向量查询、双库事务边界、级联删除方案
- BullMQ 异步任务队列：任务定义、失败重试、任务状态管理
- Fastify SSE 长连接问题复现原因、headersSent 分流处理底层逻辑
- Trace 链路埋点设计思路，如何记录各个阶段输入输出、耗时

## 🟢 P2｜理想化全掌握版本（版本 3 简历目标，后续长期学习目标）

> 
> 达到这个等级，就可以使用版本 3 简历，能够应对深度源码级面试

- Vue3 核心源码阅读：reactivity、runtime‑core 编译渲染模块核心片段
- Vite 插件底层原理，能够从零开发复杂业务插件
- Module Federation 源码关键模块阅读，理解共享依赖运行时解析逻辑
- 完整吃透 TanStack Table 源码，理解插件设计思想
- NestJS + Fastify 深度掌握，熟练编写拦截器、过滤器、任务队列；不依赖 AI 完成后端开发
- pgvector 索引调优、向量检索性能调优；BullMQ 生产级实践（死信队列、任务优先级）
- MCP 完整源码阅读，理解 MCP Server/Client 交互全流程
- 能够独立定位 RAG 链路各类疑难问题（召回差、幻觉、工具调用异常）
