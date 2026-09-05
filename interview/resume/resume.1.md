【姓名】          |  求职意向：前端工程师 / AI 应用开发工程师
【电话/邮箱/GitHub/城市】  （请填写）
【工作年限】3 年前端开发经验

━━━ 技能特长 ━━━
- 熟练掌握 HTML5/CSS3、JavaScript(ES6+)；熟练使用 TypeScript，掌握泛型与高级类型
- 熟练掌握 Vue3 生态（Vue Router、Pinia、Element Plus、VueUse），理解响应式原理与编译优化思路
- 熟悉 Vite/Webpack 构建配置与性能优化，了解自定义 Vite 插件开发
- 使用 pnpm workspace 维护 Monorepo，熟悉 ESLint/Prettier/Husky 与 GitHub Actions 代码规范体系
- 熟悉 Module Federation 微前端架构，参与微前端落地实践
- 熟悉虚拟滚动、Tree Shaking、Code Splitting 等性能优化手段，具备首屏 LCP/FCP 优化实践
- 熟悉常用数据结构与算法，能解决业务复杂数据处理逻辑

━━━ 项目经历 ━━━

### 项目一：JH4J 企业业务平台前端底座
技术栈：Vue3、TypeScript、Pinia、Vue Router、Element Plus、TanStack Table、Module Federation、Vite

项目描述：企业业务平台前端底座，基于 Module Federation 搭建微前端 Monorepo 架构；配套自研可视化低代码组件库、插件化高级表格组件，并完成全平台前端性能专项治理，支撑多条业务线页面快速搭建。

核心工作与成果：
- 参与平台微前端架构改造，基于 Module Federation 拆分主应用与多业务子应用，实现子应用独立开发、独立部署、运行时动态加载远程模块；参与共享依赖抽取与版本协商策略设计，规避多应用依赖冲突。
- 开发自定义 Vite 插件适配微前端多应用场景：本地开发环境自动将远程模块替换为 Monorepo 本地源码，提升多模块并行联调效率；针对多模块打包做构建优化，降低整体构建耗时；使用 pnpm workspace 维护 Monorepo 仓库，完成模块依赖隔离与版本统一管控。
- 参与可视化低代码组件库建设，负责数据表格（AdvanceTable）、用户挑选框（UserPicker）等核心组件的开发与维护；熟悉基于 JSON Schema 的声明式渲染架构，参与可视化拖拽编排、实时预览等能力迭代。
- 开发 AdvanceTable 高级表格组件：基于 TanStack Table 二次封装，采用 Engine + Feature 插件架构，通过 TableFeature 机制扩展单元格编辑、行列合并能力，实现关注点分离；单元格编辑支持异步校验、自定义校验器与触发时机，编辑态/展示态无缝切换；集成行列双维度虚拟滚动，支持万级数据量下的流畅渲染；封装 DataSource 数据层，统一处理后端请求、分页、排序、筛选、树形数据转换。
- 主导平台首屏加载性能专项：首屏资源体积由 23.1MB 降至 3.5MB，LCP 由 10.8s 优化至 2.3s，Lighthouse 性能评分由 52 提升至 98；基于 Module Federation 将组件拆分为独立远程模块，首屏按需懒加载；首页图片统一转 WebP 并压缩；编写脚本提取中文字符集生成字体子集，首屏加载后通过 prefetch 异步加载剩余字体。

技术难点：
1. Module Federation 多子应用依赖版本冲突治理与共享依赖粒度权衡；
2. Monorepo 本地源码联调与线上远程模块两套环境无缝切换、模块缓存问题处理；
3. 高级表格插件架构设计，在插件扩展能力与大数据渲染性能间取得平衡。

### 项目二：RAG 智能问答平台（AI 应用实践）
技术栈：NestJS + Fastify + TypeORM + MySQL + PostgreSQL(pgvector) + Redis + Vue3 + Ant Design Vue

项目描述：面向企业知识库场景的 RAG 智能问答系统，支持多格式文档上传、异步摄取、向量检索与大模型流式问答；通过意图树、多通道检索与 MCP 工具调用实现问题路由，配套运营管理后台。

核心工作与成果：
- 设计 DB 驱动的文档摄取 Pipeline 编排引擎，实现多种处理节点注册表化管理、链式编排、条件跳过与失败重试，通过事务设计保障业务库与向量库数据一致性。
- 实现结构感知分块，将文档解析为结构化 Block 模型，保留表格、代码块完整性并提取章节层级，提升切片语义完整性与检索召回质量。
- 搭建意图树驱动的多通道并行检索引擎，融合意图定向过滤、向量检索、关键词检索多路召回，通过 Redis 缓存意图树并设计空结果降级策略。
- 基于 MCP 协议实现工具调用体系，独立 MCP 服务进程对外提供业务工具能力，实现工具注册、参数解析与多层权限校验。
- 封装多模型 LLM 网关，对接多家大模型，实现模型路由、熔断降级与 SSE 流式输出，处理长连接超时、任务取消等稳定性问题。
- 实现问答全链路 Trace 观测，记录各阶段耗时与产出，后台可视化定位召回异常、意图误判等问题。
- 使用 Vue3 开发管理后台，完成知识库、文档、切片管理，实现原文-切片双向定位预览。

技术难点：
1. MySQL 业务库与 pgvector 向量库双数据源一致性设计与级联清理；
2. 意图树结构变更后存量数据元数据失效问题，通过检索侧降级兜底；
3. Fastify 下 SSE 流式长连接与全局异常拦截器冲突，手动接管响应流处理。


____ TODO ___

# 短期复习 / 掌握 TODO 清单

> 
> 全部来自你自评 **B 类**（懂概念、能讲流程，细节需复习）。A 类可跳过。按目标岗位「前端为主、RAG 为辅」排了优先级。

## 🔴 P0・前端核心（面试高频，必复习）

- **Vue 响应式原理与编译时优化**：Proxy /track/trigger、diff 算法、PatchFlags、静态提升
- **Module Federation 微前端**：共享依赖、版本协商、运行时隔离、主 / 子应用加载链路
- **自定义 Vite 插件开发**：rollup 插件机制、hook 执行顺序、本地远程模块替换原理
- **AdvanceTable 插件架构**：Engine + Feature / TableFeature 如何做能力解耦
- **JSON Schema 声明式渲染**：拖拽状态与代码编辑双向同步的实现思路
- **首屏性能优化体系**：LCP/FCP 指标、Tree Shaking、Code Splitting、虚拟滚动、字体子集化
- **pnpm workspace + Monorepo**：依赖隔离、版本统一、workspace 协议

## 🟡 P1・工程化与项目细节（能讲清流程）

- UserPicker 卡顿优化：为什么 Map 哈希查找比数组遍历快（O (n²)→O (n)），如何表述
- DataSource 数据层设计：分页 / 排序 / 筛选 / 树形数据转换统一封装
- ESLint / Prettier / Husky + GitHub Actions：提交前校验、流水线 lint 流程
- 常用数据结构与算法：能举出业务应用场景（树遍历、筛选去重、列表处理）

## 🟢 P2・RAG / AI 应用（辅助加分，能讲清即可）

- 摄取 Pipeline 编排：节点注册表、任务状态机、失败重试、事务控制
- Structure-Aware Chunking：Block 模型、表格 / 代码块原子保留、章节层级
- 意图树 + 多通道检索：Redis 缓存、结果融合、空结果降级
- MCP 工具调用：Streamable Transport、三层权限校验
- LLM 网关：多模型路由、熔断器、降级链、SSE 流式
- 双数据源一致性（MySQL + pgvector）：事务边界、级联清理
- Fastify SSE 长连接与拦截器冲突：headersSent 分流处理
- 全链路 Trace 观测：各阶段耗时与产出记录