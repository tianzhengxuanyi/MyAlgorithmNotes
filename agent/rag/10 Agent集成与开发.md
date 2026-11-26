# 10. Agent 集成与开发（需求 + 技术方案）

> 本文基于当前仓库实现，不假设重写 RAG。  
> 现状笔记：[`9 在线Chat Pipeline与RAG检索.md`](./9%20在线Chat%20Pipeline与RAG检索.md)  
> 相关代码：`modules/ai/agent/`（已废弃转发）、`chat/pipeline/stream-chat.pipeline.ts`、`rag/retrieve/`、`mcp/`、`core/infra-ai/llm/`、前端 `useStreamResponse.ts`

---

## 1. 背景与目标

### 1.1 现在叫 Agent、实际是什么

`POST /ai/agent/chat` **已废弃**，`AgentController` 只把请求转给 `ChatService`。产品对话入口是 **`POST /ai/chat`**。

当前「智能」全部在 `StreamChatPipeline` 的固定 8 段：

记忆 → 改写 → 意图 → 歧义/闲聊短路 → **多通道检索（含 MCP 一次调用）** → 空结果短路 → 拼 Prompt → 流式生成。

MCP 不是多步 tool loop：意图命中工具后，LLM 抽参 → `executor.execute` → 文本塞进 Prompt，**模型没有第二轮根据工具结果再决定调不调别的工具**。

`ChatMessage` 只有 `role + content`，`ChatRequest` 没有 `tools`。`callType` 虽预留了 `agent_reasoning`，管道里生成走的是 `rag_generation`。

### 1.2 要解决什么

用户问题经常是「先查知识库，不够再调工具，再根据结果决定要不要追问或再搜」。现有管道一次检索 + 一次生成，做不到：

- 检索结果不够时主动再搜 / 换问法
- 先 MCP 再 KB，或先 KB 再 MCP
- 多步工具（查天气 → 再查日程）
- 前端展示「正在检索 / 正在调用 xxx」

### 1.3 明确不做什么（至少 P0/P1）

- **不**用 LangChain / LangGraph **替换** `StreamChatPipeline`、`LlmGateway`、意图树、多通道检索。
- **不**把 `/ai/chat` 默认改成 Agent 循环（闲聊和单跳 RAG 会变慢、变贵、变难取消）。
- **不**做多 Agent 协作、长期规划、人机审批工作流（P2 以后）。

---

## 2. 产品需求

### 2.1 定位

Agent = **有上限的编排循环**。RAG 检索、MCP 工具、会话记忆都是 **工具**，由循环决定何时调用。  
`/ai/chat` 继续作为默认 RAG 问答；Agent 是可选模式或独立入口。

### 2.2 用户可见行为

| 场景 | 期望 |
| --- | --- |
| 普通知识问答 | 与现在一致：检索 → 带引用生成（可仍走 `/ai/chat`） |
| 需要工具 | 展示步骤：思考/选工具 → 调用中 → 观察结果 → 最终回答 |
| 工具失败 | 单步失败不中断整轮；最终回答说明失败，禁止静默编造 |
| 知识库为空 | 走 Agent 时不得直接 `streamChitchat` 用训练知识填；应明确「未检索到」或改调工具 |
| 停止 | 与现网一致：用 `taskId` 取消，已产出的步骤和部分回答要能落库 |
| 权限 | MCP 继续走 `McpPermissionChecker.executeForUser`；无权限工具不得出现在可选列表里 |

### 2.3 非功能

- 单轮最多 **N 步工具**（建议默认 4，可配置），超时整轮上限（建议 60s 不含首包探测）。
- 每步工具超时单独限制（建议 15s）。
- 与现网共用：SSE 先于 await、排队限流、注入守卫、Token 日上限、`StreamTaskManager`。
- 日志 `callType=agent_reasoning`，便于和 `rag_generation` 分开看用量。

### 2.4 分期

**P0（可演示的最小 Agent）**

- 新入口 `POST /ai/agent/run`（或 `/ai/chat` 增加 `mode: 'rag' | 'agent'`，默认 `rag`）。
- 内置 2 个工具：`kb_search`、已注册且有权限的 MCP 工具。
- 最多 4 步；SSE 增加步骤事件；前端气泡展示工具名。
- 取消能停循环和下一次 LLM。

**P1**

- `kb_search` 复用 `MultiChannelRetrievalEngine`（含改写/意图，或提供「只向量检索」轻量模式）。
- 引用与现网 `SourceReferenceDto` 对齐。
- 空检索强制走 empty 策略（模板或固定话术），禁止无约束闲聊。
- 步骤写入 `ConversationMessage` metadata / `toolCalls`。

**P2**

- 按意图裁剪工具白名单；HITL（高风险工具需确认）。
- 可选：LangGraph **仅作编排器**，节点调用本仓库 Service，不替换 `LlmGateway`。

---

## 3. 与现有架构的关系

```text
                    ┌─────────────────────────────────────┐
                    │           现有能力（保持）            │
                    │  LlmGateway / 熔断 / 首包探测         │
                    │  Intent + MultiChannelRetrieval      │
                    │  McpToolRegistry + Permission        │
                    │  Memory / SSE / TaskManager          │
                    └──────────────┬──────────────────────┘
                                   │ 封装为 Tool
                                   ▼
┌──────────────┐    ┌──────────────────────────────────────┐
│ POST /ai/chat│    │         AgentLoopPipeline            │
│  RAG 管道    │    │  think → act → observe → … → answer  │
│  默认入口    │    │  最多 N 步，失败降级                  │
└──────────────┘    └──────────────────────────────────────┘
```

| 现有模块 | Agent 中的角色 |
| --- | --- |
| `StreamChatPipeline` | **不动**。默认问答继续走它 |
| `MultiChannelRetrievalEngine` | 工具 `kb_search` 的实现 |
| `McpToolRegistry` + `executeForUser` | MCP 工具实现，禁止绕过权限 |
| `LlmGateway` | 循环里的推理与最终流式回答 |
| `MemoryService` | 首轮加载 history；最终 assistant 落库 |
| `StreamChatEventHandler` | 扩展事件类型，不另起一套 SSE |
| `modules/ai/agent` | 从「废弃转发」改为真正的 Agent 模块 |

### 3.1 为什么不能直接上 LangChain / LangGraph 替换

| 本仓库 | 框架默认假设 |
| --- | --- |
| 自研 `LlmGateway`（候选、熔断、首包 60s） | `ChatOpenAI` 直连 |
| 意图树 + 三通道检索 + 后处理链 | VectorStore retriever |
| MCP 一次抽参执行再进 Prompt | Native tool-calling 循环 |
| SSE 事件状态机 + `taskManager.bindHandle` | 回调/generator 各异 |
| `ChatMessage` 无 tool 角色 | OpenAI tool 消息格式 |

硬接等于两套模型客户端、两套取消、两套 Prompt。  
LangGraph 若用，只允许：**StateGraph 的 node 里 `inject` 现有 Nest Service**，流式仍进现在的 `StreamCallback`。P0 不引入。

---

## 4. 技术方案

### 4.1 循环（P0 建议：JSON 协议，不绑供应商 tool_calls）

当前 `ChatClient` 没有 tools 参数，P0 用 **受限 JSON** 做决策，最终回答再 `streamChat`。

每步非流式 `llmGateway.chat`（`callType: agent_reasoning`），模型只输出：

```json
{ "type": "tool", "name": "kb_search", "args": { "query": "..." } }
```

或

```json
{ "type": "final" }
```

伪代码：

```text
history = memory.load(...)
tools = registry.listForUser(user)  // kb_search + 有权限 MCP
observations = []

for step in 1..maxSteps:
  if cancelled: break
  decision = llm.chat(system=agent.st, messages=history+observations)
  if decision.type == final: break
  assert tool in tools and permission
  push SSE tool_start
  result = await tools[name].execute(args, user)  // 超时 15s
  push SSE tool_end
  observations += (name, args, resultText)
  单步失败则 observation 记 error，继续循环

streamChat(最终回答 Prompt：含 observations + 引用规则)
bindHandle(taskId)
```

P1 再考虑：`ChatRequest.tools` + OpenAI compatible `tool_calls`（Qwen compatible-mode 可走）。那是网关升级，不是业务循环推翻。

### 4.2 工具适配层

统一接口（新建，不要让 RAG/MCP 实现去依赖 Agent）：

```ts
interface AgentTool {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  execute(args: Record<string, unknown>, user: IAuthUser): Promise<AgentToolResult>
}
```

**`kb_search`**

- 入参：`query`（必填），可选 `topK`。
- 内部：构造 `SearchContext` + `IntentResolver.resolve` + `retrievalEngine.retrieve`。
- 出参：截断后的 chunk 摘要（id / documentName / section / score / 原文前 N 字），供后续生成引用。
- 注意：不要在工具内再 `streamChitchat`。空结果返回 `chunks: []`，由循环决定 final 还是换工具。

**MCP 工具**

- `name` 与 MCP `getToolName()` 一致。
- `execute` **必须** `executeForUser`，禁止 `execute`。
- 结果收敛为 text（沿用 `McpClientToolExecutor.convertResult`）。

**不要**把「抽参 LLM」和 Agent 决策 LLM 叠两层：Agent 已经产出 `args`，MCP 路径跳过 `LLMMcpParameterExtractor`。

### 4.3 Prompt

新增 `resources/prompt/agent-loop.st`：

- 只能从工具列表里选 name。
- 知识类问题先 `kb_search`；实时/系统类走对应 MCP。
- 工具已返回空，禁止用训练知识补事实，应 `type=final` 并让最终模板说未找到。
- 输出必须是单行 JSON，不要 Markdown 围栏。

最终回答复用现有 `answer-chat-kb.st` / `answer-chat-mcp.st` / `answer-chat-mcp-kb-mixed.st` / `answer-chat-empty.st`：按本轮是否真的有 KB chunk / MCP evidence 选 scene。  
这与笔记第 9 节缺口对齐：**空检索要能走到 empty 模板，而不是闲聊。**

### 4.4 入口与模块

复活 `modules/ai/agent`（不再只做转发）：

| 职责 | 建议类 |
| --- | --- |
| HTTP | `AgentController`：`POST /ai/agent/run`、`POST /ai/agent/cancel`（cancel 可复用 `ChatService.cancel`） |
| 编排 | `AgentLoopPipeline` |
| 工具注册 | `AgentToolRegistry`（包装 `kb_search` + MCP） |
| JSON 解析 | `AgentDecisionParser`（去 fence、校验 schema、非法则当 final） |

SSE 创建顺序 **复制 `ChatService.streamChat` 约束**：`sseSender.create` 之前禁止 await。排队、meta、`StreamChatEventHandler.init` 可抽共享方法，避免两套分叉。

`ChatDto` 增加可选 `mode` 也可以，但会让默认路径变复杂。更干净的是独立 URL，前端用技能开关「Agent」决定打哪个接口。

### 4.5 SSE 扩展（前端要一起改）

现有 7 事件不要破坏。新增：

| event | 时机 | data（建议） |
| --- | --- | --- |
| `tool_start` | 即将 execute | `{ step, name, args }` |
| `tool_end` | execute 结束 | `{ step, name, success, latencyMs, preview? }` |

状态机合法路径：

```text
meta → (queue*) → (tool_start → tool_end)* → message* → finish → done
meta → (tool_*)* → cancel → done
```

`frontend/src/composables/ai/useStreamResponse.ts` 增加对应枚举与回调。  
`MessageItem` 已有 `toolCalls` 展示位，把 `tool_end` 累积进当前 assistant 消息即可。

### 4.6 取消与并发

- 循环每步前检查 `taskManager` / handle `isCancelled()`。
- 工具 `execute` 用 `AbortSignal`（MCP SDK 若暂不支持，至少 `Promise.race` 超时）。
- 最终 `streamChat` 仍 `bindHandle`，与现网停止按钮兼容。
- 全局排队槽：Agent 一回合可能多次 LLM，**整轮占用一个 chat 槽**，不要每步 acquire 一次。

### 4.7 网关（P1）

若要 native function calling，扩展而非分叉：

- `ChatRequest.tools?: { name, description, inputSchema }[]`
- `ChatResponse.toolCalls?: { name, args }[]`
- `ChatMessage.role` 增加 `'tool'`，或用 `name` 字段区分
- `AbstractOpenAIStyleChatClient` 映射 `tools` / `tool_calls`
- 不支持的 provider 降级回 JSON 协议

熔断、首包探测、候选路由保持只走 `LlmGateway`。

---

## 5. 与 RAG 管道的冲突点（必须规避）

1. **空检索闲聊**：Agent 的 `kb_search` 为空时禁止调用 `streamChitchat`。  
2. **MCP 双抽参**：Agent 已给 args 时禁止再跑 `LLMMcpParameterExtractor`。  
3. **意图短路**：Agent 模式不要在进循环前被 `handleSystemOnly` 切走；闲聊可由模型直接 `type=final` 且不调工具。  
4. **Rerank Noop**：`kb_search` 仍走后处理链，精度受 Noop 影响；不在 Agent 里再造一套 rerank。  
5. **Prompt 意图分组**：生成仍用 `RagPromptService`；`intentNodeId` 分组问题属 RAG 修复，不在 Agent 范围单独 hack。  
6. **消息结构**：history 不要把 tool JSON 原样当 user 消息无限膨胀；observations 用独立 system/tool 块，并截断长度。

---

## 6. 前端

- ChatInput 技能区增加「Agent / 自动工具」（P0 可先管理员可见）。
- 开启后请求 `/ai/agent/run`，关闭走 `/ai/chat`。
- 流式中展示步骤条：工具名 + 成功/失败；最终 Markdown 与引用不变。
- 取消仍用 meta 的 `taskId` → 现有 cancel 接口（Agent cancel 与 chat cancel 可共用 task 表）。

---

## 7. 验收

**P0**

- [ ] `/ai/chat` 行为与现网一致（回归闲聊、RAG、取消、排队）。
- [ ] `/ai/agent/run` 能：知识问题调用 `kb_search` 后作答；MCP 意图调用对应工具。
- [ ] 工具步骤有 SSE，前端看得到。
- [ ] 超过 `maxSteps` 停止并给出基于已有 observation 的回答。
- [ ] 取消后不再发起下一步 LLM/工具。
- [ ] 无权限 MCP 不出现在 prompt 工具列表，直接 call 返回 403 类 observation。

**P1**

- [ ] 空检索最终回答使用 empty 约束，抽测不再用百科知识编造制度条款。
- [ ] `toolCalls` 落库，刷新会话仍能看到步骤。
- [ ] 引用点击与 RAG 模式一致。

---

## 8. 实施顺序（建议）

1. 抽出 `ChatService` 里「建 SSE + meta + 排队」的共享方法。  
2. `AgentTool` + `kb_search` + MCP 包装。  
3. `agent-loop.st` + JSON parser + `AgentLoopPipeline`。  
4. SSE `tool_start/tool_end` + 前端。  
5. 空检索与最终 scene 接到现有 `.st`。  
6. （可选）网关 native tools；LangGraph 仅作为 P2 编排实验，默认关闭。

---

## 9. 文档与代码入口清单

| 用途 | 路径 |
| --- | --- |
| 废弃 Agent HTTP | `backend/src/modules/ai/agent/` |
| RAG 管道 | `backend/src/modules/ai/chat/pipeline/stream-chat.pipeline.ts` |
| 检索 + MCP 一次调用 | `backend/src/modules/ai/rag/retrieve/multi-channel-retrieval.engine.ts` |
| MCP 执行/权限 | `backend/src/modules/ai/mcp/` |
| LLM 抽象 | `backend/src/core/infra-ai/llm/chat-client.interface.ts` |
| SSE 事件 | `backend/src/modules/ai/rag/enums/sse-event-type.ts` |
| 前端流 | `frontend/src/composables/ai/useStreamResponse.ts` |
| 工具 UI | `frontend/src/components/ai/chat/MessageItem.vue` |
