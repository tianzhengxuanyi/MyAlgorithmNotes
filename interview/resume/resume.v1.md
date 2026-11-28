## 基本信息

姓名：谢飞
性别：男
年龄：27岁
民族：汉族
工作年限：3年经验
联系电话：18355362032
邮箱：1145986889@qq.com
籍贯：安徽省芜湖市

## 求职意向

求职意向：前端开发
意向城市：合肥
期望薪资：14-16k

## 教育背景

安徽财经大学 2016.09-2020.06 本科 管理科学与工程
南京信息工程大学 2020.09-2023.06 硕士 管理科学与工程

## 工作经历

江苏金恒信息科技股份有限公司（南京）2023 年 7 月-至今

## 技能特长

- 语言基础：熟练掌握 HTML5/CSS3/JavaScript（ES6+），熟练使用 TypeScript，掌握泛型与高级类型在实际工程中的应用
- 框架与生态：熟练掌握 Vue3 全家桶（Vue Router、Pinia、Element Plus、VueUse），深入理解响应式原理与编译时优化
- 工程化能力：熟练使用 Vite/Webpack 进行构建配置与优化，具备自定义 Vite 插件开发能力；熟练使用 pnpm workspace 管理 Monorepo，熟悉 ESLint/Prettier/Husky/Lint-Staged 工程规范体系
- 架构与性能：具备 Module Federation 微前端架构从设计到落地经验；熟悉虚拟滚动、Tree Shaking、Code Splitting 等优化手段，有首屏 LCP/FCP 专项治理实战
- AI 应用开发：具备 RAG/LLM 应用全栈工程经验，熟悉 Prompt 工程、SSE 流式交互、向量检索（pgvector）、MCP 工具调用与 LangGraph Agent 编排；有大模型 API 统一封装、模型路由、熔断降级的落地实践
- 服务端能力：了解 Node.js + NestJS 服务端开发，实践过完整后端项目（企业知识库 RAG 问答系统），熟悉常用数据结构与算法

## 项目经历

### JH4J 企业业务平台前端底座 2023.07-至今

技术栈：Vue3、TypeScript、Pinia、Vue Router、Element Plus、TanStack Table、Module Federation、Vite、LangGraph

项目描述：基于 Module Federation 搭建的微前端 Monorepo 架构底座，配套自研可视化低代码组件库与插件化高级表格组件，完成全平台前端性能专项治理；内置 AI 开发助手，依托 LangGraph + RAG 实现自然语言转页面 Schema 与代码智能生成，支撑多条业务线页面快速搭建。

核心工作与成果：

- 微前端架构改造：主导基于 Module Federation 的主应用/多业务子应用架构拆分，实现子应用独立开发、独立部署与运行时动态加载远程模块；针对多应用共存场景设计共享依赖抽取与版本协商策略，规避跨子应用依赖版本冲突；实现开发环境「本地 Monorepo 源码优先、远程联邦兜底」的联调方案，显著提升多应用联调效率
- 工程化体系建设：采用 pnpm workspace 搭建 Monorepo，完成多包依赖隔离与版本统一管控；开发自定义 Vite 插件，修复 unplugin-vue-components 自动导入 Element Plus 引发的模块联邦共享 scope 失效问题；落地 husky + lint-staged + commitlint，统一代码校验与 Git 提交规范
- 低代码组件库建设：负责 AdvanceTable、UserPicker 等核心组件开发与性能优化，参与 JSON Schema 声明式渲染与可视化编排迭代。AdvanceTable 基于 TanStack Table 二次封装，采用 Engine + Feature 插件架构扩展单元格编辑、行列合并能力，集成行列双维度虚拟滚动支撑万级数据渲染与编辑，封装 DataSource 统一请求、分页、排序、筛选与树形转换；UserPicker 通过 Chrome Performance 定位万级数据选中卡顿，以 Map 哈希查找替代数组遍历，整体复杂度 O(n²)→O(n)
- 首屏性能专项治理：主导平台首屏加载性能专项——基于 Module Federation 将组件拆分为独立远程模块按需懒加载、首页图片统一转 WebP 压缩、编写脚本扫描源码提取中文字符集并配合 subset-font 生成字体子集（未收录字符回退全量字体，首屏加载完成后 link prefetch 异步加载）；首屏资源体积 23.1MB→3.5MB，LCP 10.8s→2.3s，Lighthouse 性能评分 52→98
- AI 开发助手：参与内置 AI 助手能力建设，基于 LangGraph + RAG 实现自然语言转页面 Schema 与代码智能生成，将页面搭建从手写代码升级为对话式生成，支撑多条业务线低代码页面快速产出

### RAG 智能问答 2026.05-至今

技术栈：NestJS 11 + Fastify + TypeORM + MySQL + PostgreSQL(pgvector) + Redis + BullMQ + MCP ｜ Vue3 + Ant Design Vue + Vite

项目描述：面向企业知识库的 RAG 问答系统，覆盖多格式文档异步摄取、结构感知分块、多通道检索与大模型流式问答全链路，支持 MCP 工具调用与多模型路由降级，配套运营管理后台。

核心工作与成果：

- 摄取编排引擎：设计 DB 驱动的六类节点注册表编排引擎，节点以 nextNodeId 链式编排并支持条件跳过；Task/TaskNode 双表记录执行链路，单节点失败可定位、可重试，重试按幂等设计避免重复写入
- 结构感知分块：自研 Parser 将文档解析为 Block 模型（heading/paragraph/table/code/list），Chunker 按块语义贪心合并、表格与代码块原子保留，并通过 HeadingBlock 累积 outlinePath 形成章节层级路径，保留检索所需的语义结构
- 意图树 + 多通道检索：三级意图树缓存于 Redis，对话侧单次 LLM 调用完成候选打分，JSON 输出 + ID 校验防幻觉，校验失败自动 fallback；检索侧意图定向 / 全局向量 / 关键词三通道并行召回、按优先级融合，意图定向空结果自动降级，兼顾准确率与召回率
- MCP 工具调用：独立 mcp-server 提供工具，后端启动自动发现注册；LLM 从口语化问题提取结构化参数并做参数校验；工具发现、意图分类、运行时执行三层权限校验，无权工具对 LLM 不可见
- LLM 网关与流式问答：统一封装多模型接入，实现模型路由 + 三态熔断 + 降级链；基于 SSE 实现流式输出，支持首包超时、Redis 广播取消与上游请求真正终止；
