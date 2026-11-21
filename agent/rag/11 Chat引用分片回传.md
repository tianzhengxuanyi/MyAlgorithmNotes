# 11. Chat 引用分片回传（需求 + 技术方案）

> 问题：`POST /ai/chat` 流式回答和 `GET /ai/conversations/messages` 都不带 RAG 命中分片。模型只在正文里写 `[文档名#章节]`，前端 `CitationPopover` 无法绑定 `chunkId` / 原文。  
> 相关：`MessageEntity`、`ChatService.streamChat`、`StreamChatEventHandler`、`StreamChatPipeline`、`RagService.extractSources`（调试链路已有 sources，对话链路未接）。

---

## 1. 现状

| 环节 | 实际行为 |
| --- | --- |
| 检索 | `StreamChatPipeline.retrieve` 已得到 `RetrievalContext.kbChunks`（含 chunkId / documentId / content / score / section） |
| 生成 | chunks 只进 Prompt XML；SSE 只推 `message` delta |
| 落库 | `ai_message` 只有 `content` / token / model，**没有 sources 列** |
| 历史 | `ConversationMessageDto` 只有 id / role / content / createdAt |
| 非流式 `chat()` | DTO 预留了 `sources`，写死 `[]` |
| 调试 `RagService` | `onComplete(answer, sources)` 已抽取 sources，**对话管道没用这套** |
| 前端 | `MessageItem` / `CitationPopover` 已按 `message.sources[]` 画引用，流式和历史都没数据 |

`RetrievedChunk` 注释写着「写入 MessageEntity.sources」，实体未落地。

检索发生在 **LLM 流式开始之前**，分片集合在首 token 前就已确定，不必等生成结束才「算出来」。

---

## 2. 两种做法对比

### 方案 A：流结束后再 `GET messages` 取分片

```text
SSE message* → finish(messageId) → done
前端再 GET /ai/conversations/messages
```

优点：SSE 契约几乎不动。  
缺点：

1. 必须先落库 sources，否则 GET 仍然没有。
2. 多一次 RTT；`finish` 已带 `messageId`，再拉整页消息浪费。
3. 与 `finish` 竞态：handler 是先 `append` 再推 finish，理论上可读，但前端还要处理失败重试。
4. 流式过程中无法展示「依据 N 条资料」，引用按钮只能等结束。
5. 取消路径若只落了部分正文、没 sources，体验更差。

**结论：GET messages 只作为历史/刷新的读取面，不能当本轮流式的唯一来源。**

### 方案 B：streamChat 的 SSE 直接带分片（推荐）

检索完成后（或 `finish` 时）推一条结构化 `sources`，与 token 流分离。

优点：本轮零额外 HTTP；和 debug RAG 的 `finish 含 sources` 一致；前端 `CitationPopover` 可立刻绑定。  
代价：扩展 SSE；消息表要能持久化，否则刷新丢失。

### 推荐组合：**SSE 推送 + 落库 + 历史接口带回**

| 时机 | 做什么 |
| --- | --- |
| 检索完成、开始生成前 | SSE `sources`（可先画引用栏 / 「正在基于 N 条资料回答」） |
| `finish` | 再带一份 `sources` + `messageId`（漏收 `sources` 事件时的兜底；与落库一致） |
| `append` assistant | `ai_message.sources` JSONB 写入完整或预览分片 |
| `GET messages` | DTO 增加 `sources`，刷新会话可点引用 |

**不要**把分片塞进每个 `message` delta。**不要**等 done 后再专门为引用打一枪 GET。

---

## 3. 为何「检索后立刻推」优于「只在 finish 推」

- 分片与生成并行：用户先看到来源，再看正文，接近常见 RAG UI。
- 长回答时不必等到结束才出现脚注。
- 若只在 finish 推：实现更简单（和落库同一时刻），也能接受。P0 可以 **只挂 finish**；P1 再提前到检索完成。

建议 P0：**finish 带 sources**（改动面最小，且一定发生在落库之后，ID 和分片对齐）。  
P1：检索完成后额外 `sources` 事件。

---

## 4. 数据与契约

### 4.1 落库

`ai_message` 增加：

```ts
@Column({ type: 'jsonb', nullable: true })
sources: SourceReference[] | null
```

结构与现有 `SourceReferenceDto` / `RagService.extractSources` 对齐：

```ts
{
  documentId: number
  documentName: string
  chunkId: number
  content: string      // 建议落库全文或前 2k；SSE 可再截 200
  score: number
  section: string | null
}
```

`MemoryService.append` 增加可选 `sources`。user 消息为 null。

### 4.2 SSE

`CompletionPayload` 增加 `sources?: SourceReferenceDto[]`（P0）。

可选新事件（P1）：

```text
event: sources
data: { items: SourceReferenceDto[] }
```

路径：

```text
meta → message* → finish(messageId, sources) → done
meta → sources → message* → finish(messageId, sources) → done   // P1
```

闲聊 / 空检索 / 澄清：`sources: []` 或不带字段。

### 4.3 历史

`ConversationMessageDto.sources` 可选数组。`toMessageDto` 映射 jsonb。

非流式 `ChatService.chat()` 填真实 `sources`，不要再写死 `[]`。

### 4.4 正文标记要能点上分片

仅有 sources 列表不够：模型写的 `[文档名#章节]` 对不齐 index。

P0 改 Prompt：引用必须用 **`[n]`**，n 为 `<kb_context>` 里 chunk 的 `index`（从 1）。  
前端 Markdown 把 `[n]` 换成 `CitationPopover`，`source = sources[n-1]`。对不上的 n 降级为纯文本。

P1 可用 `documentId+chunkId` 或规范化标题做模糊匹配，作 `[n]` 的兜底。

---

## 5. 代码改动要点

1. **Pipeline**：`streamRagResponse` 在 `streamChat` 前把 `extractSources(kbChunks)` 交给 handler（扩展 callback 或 ctx）。闲聊短路不传。
2. **Handler**：持有 `sources`；`onCompleteInternal` / 取消落库时写入；`finish` 带上。
3. **ChatService**：不用等 `waitUntilClosed` 之后再查库；SSE 结束时前端已经有数据。`waitUntilClosed` 仍只保证连接收尾。
4. **前端**：`useStreamResponse` 解析 `finish.sources`；`useChat` 写入当前 assistant 的 `sources`；历史 `conversationMessages` 同样赋值。`MarkdownRenderer` 识别 `[n]`。

`RagService.extractSources` 抽到 `core` 或 `rag/sources.util.ts`，对话与 `/ai/rag/query` 共用。

---

## 6. 体积与安全

- topK 默认 5，单条 content 截断后 SSE 一般数 KB，可接受。
- 落库可存更长原文，SSE 只发 preview（200～500 字）+ id，点「查看原文」用已有文档页 `documentId+chunkId`。
- sources 只返回当前用户会话命中的 chunk，不跨会话。

---

## 7. 验收

- 流式：结束（P0）或生成中（P1）出现可点击 `[n]`，popover 有原文片段和文档名。
- 刷新 / 切历史：引用仍在。
- 闲聊、空检索：无假引用。
- 取消：有部分正文则尽量带当时已确定的 sources（检索已完成则应有）。
- `/ai/chat` 非流式 `sources` 非空（有 KB 时）。
- 回归：SSE 仍先于 await；finish → done 顺序不变。

---

## 8. 明确不采用

- 流结束后仅为引用再 GET 一次 messages（本轮展示）。
- 把整段 XML / 全量 chunk 打进 assistant `content`。
- 用正则从正文标题碰库「猜」chunk，而不落库 sources。

---

## 9. 相对 28e21be 的落地

P0+P1 已接上：检索后 SSE `sources`、finish/cancel 带 preview、`ai_message.sources`（MySQL `json`）、历史 DTO、非流式 `chat()`、Prompt `[n]`、前端解析与 Markdown 角标。需要跑迁移 `AddMessageSources1757731200000`。
