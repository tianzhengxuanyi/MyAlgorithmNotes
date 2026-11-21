# 13. Chat SSE 流式推送方案

> 对应代码：`core/framework/sse/sse-sender.provider.ts`、`chat/chat.controller.ts`、`chat/chat.service.ts`、`chat/handler/stream-chat-event.handler.ts`、`chat/handler/stream-task.manager.ts`、`chat/ratelimit/chat-queue.limiter.ts`、`rag/enums/sse-event-type.ts`、`rag/dto/sse-payload.dto.ts`、前端 `frontend/src/composables/ai/useStreamResponse.ts`  
> 管道业务阶段见 [`9`](./9%20在线Chat%20Pipeline与RAG检索.md)；引用分片契约见 [`11`](./11%20Chat引用分片回传.md)

产品对话入口 `POST /api/ai/chat`（默认 `stream !== false`）走 **自管 Fastify raw SSE**，不用 Nest `@Sse()`。调试用的 `POST /ai/rag/query/stream` 仍是 RxJS Observable + `@Sse`，已标 deprecated。

---

## 0. 一句话

在任何 `await` 之前 hijack 响应、flush 头、写一帧注释心跳，再用 `SseConnection` 按约定事件往 `reply.raw` 写；Handler 把 LLM token 编成 `message`，排队/取消/结束走独立事件，最后 `done` + `close`，`waitUntilClosed` 才让 Nest handler 返回。

---

## 1. 为何不用 Nest `@Sse`

对话流同时要：POST + Bearer、排队、取消、跨节点、长连接心跳。Nest `@Sse` 适合 GET Observable 推 MessageEvent，和这条链路不合。

本仓库踩过的具体坑：

| 问题 | 后果 |
| --- | --- |
| handler 里先 `await` 落库再建 SSE | 客户端在「零响应头」阶段断开，`create` 时 `reply.raw.destroyed === true` |
| `@Res({ passthrough: true })` 或 handler 提前 `return` 对象 | Nest finalize 响应 → `writableEnded`，LLM 首包写失败（`stream-ended`） |
| `TransformInterceptor` 把结果包成 `ResOp` | Fastify 对已写出的 SSE 再 `send(object)` → 500 |
| 默认 10s `TimeoutInterceptor` | 长生成被掐 |
| 等 LLM 首包期间无数据 | Vite http2-proxy / 浏览器 idle 掐连接，「第一次 chat 失败、重试才成功」 |

所以流式入口是：

```ts
@Post()
@Bypass()        // 不走 ResOp 包装
@SkipTimeout()   // 跳过 10s 超时
@Res()           // 无 passthrough，手动接管
async chat(..., @Res() reply: FastifyReply)
```

Controller 在流式路径里 `await streamChat` 后直接 `return`，**不再** `reply.send(...)`。非流式才 `reply.status(200).send(ResOp.success(data))`。

---

## 2. 分层：谁写字节、谁发业务事件

```text
ChatController @Res()
  └─ ChatService.streamChat
        ├─ SseSenderProvider.create(reply)     // 连接层：头、心跳、serialize、CAS close
        ├─ 立刻 sender.send(meta)
        ├─ await 落库 / 会话
        ├─ StreamChatEventHandler              // 业务层：token 缓冲、finish/done、sources
        ├─ ChatQueueLimiter                    // 排队层：queue / reject
        ├─ StreamTaskManager                   // 取消层：cancel / done
        └─ StreamChatPipeline.execute          // 生成层：callback → handler
```

`SseSenderProvider` 在全局 `FrameworkModule` 注册，业务模块直接注入。`create(reply)` 返回 **`SseConnection` 实例**（不是 OS 进程、也不是 Nest Worker）。一次 HTTP 请求对应一条连接。

---

## 3. 连接建立：`create(reply)` 必须同步、且先于任何 await

`ChatService.streamChat` 的硬约束写在类注释和实现里：

```text
① 雪花 taskId（同步）
② sseSender.create(reply)     ← 禁止在此之前 await
③ 立刻推 meta
④ 此后才允许 await（会话、落库、排队）
⑤ void pipeline.execute       ← 不等管道 Promise
⑥ await sender.waitUntilClosed()
```

`create` 内部（`SseConnection` 构造函数）按顺序做：

1. **判活**：只看 `reply.raw.destroyed / writableEnded`。Nest 读完 POST body 后 `req.destroyed` 经常是 true，**不能**当断开。
2. **`reply.hijack()`**：Fastify 不再自动收尾这次响应。
3. **状态码 200**（POST 默认 201，SSE 客户端/代理更稳）。
4. **头**：

   | Header | 作用 |
   | --- | --- |
   | `Content-Type: text/event-stream; charset=utf-8` | SSE |
   | `Cache-Control: no-cache, no-transform` | 禁止缓存/中间层改写 |
   | `Connection: keep-alive` | 长连接 |
   | `X-Accel-Buffering: no` | 关 Nginx 缓冲，否则事件攒着不往下推 |

5. **socket**：`setTimeout(0)` + `keepAlive(10s)`，避免 Node 空闲超时。
6. **`flushHeaders()`**：头立刻出去，客户端结束「等响应头」。
7. **立刻写 `: connected\n\n`**：注释帧。部分代理把「只有头、没有 body」当空响应掐掉。
8. **2s 心跳**：`setInterval` 写 `:ping\n\n`，`unref()` 不挡进程退出。覆盖 Vite http2-proxy 短 idle。
9. **`raw.on('error')`**：标记关闭，不抛进业务。

写失败或创建时已销毁 → `isClosed=true`，`reason` 如 `already-destroyed-at-create` / `connect-write-error`。Service 发现 closed 就打错误日志并返回，不再跑管道。

### 3.1 为何「先 SSE、后 await」

典型错误顺序：

```text
await 建会话 / append 用户消息   // 几百 ms～数秒
  → 客户端还没收到任何头，认为失败并断开
  → create() 时 raw 已 destroyed
```

正确顺序：头和第一帧（注释 + meta）在同步阶段就出去；落库可以慢，心跳顶住代理。

会话若是服务端新建的，落库后再补推一次 **最终 meta**（带真实 `conversationId`）。第一次 meta 里 `conversationId` 可能是空串，但 **`taskId` 已经可用**，前端能立刻拿去取消。

---

## 4. 帧格式与心跳

`send()` 按 SSE 规范拼字符串，末尾空行分隔：

```text
id: <可选>
event: <meta|message|...>
retry: <可选>
data: <JSON 或字符串，多行则每行一个 data:>

```

`data` 非 string 则 `JSON.stringify`。心跳和连通探测用 **注释行**（`:` 开头），浏览器 EventSource / fetch-event-source **不会**当成业务事件：

```text
: connected

:ping
```

`ping()` 也可手动再写一帧。心跳发现 `destroyed/writableEnded` 会 `markClosed`，不再写。

关闭是 **CAS**：`closed` 只从 false→true 一次。`close(reason)` 会 `raw.end()`；错误路径只标 closed、不一定 end。`waitUntilClosed()` 把 Nest handler 挂住，直到连接真正关掉，避免框架过早收尾。

---

## 5. 事件契约（状态机）

枚举：`SSEEventType`。合法路径：

```text
meta → message* → finish → done                         正常完成（闲聊/无检索）
meta → sources → message* → finish → done               RAG：生成前带分片
meta → queue* → message* → finish → done                先排队再生成
meta → queue* → reject → finish → done                  排队超时拒绝
meta → message* → cancel → done                         用户取消
```

非法（前端/契约上应避免）：`meta → done`（缺 finish）、`finish` 重复。

`done` 的 data 固定字符串 `'[DONE]'`（不是 JSON）。前端解析时对 `[DONE]` 跳过 `JSON.parse`。

### 5.1 各事件载荷

| event | 谁推 | data | 前端做什么 |
| --- | --- | --- | --- |
| `meta` | ChatService（立刻 + 可能补推） | `{ conversationId, taskId }` | 存 taskId 供 cancel |
| `queue` | ChatQueueLimiter，约 2s 一次 | `{ requestId, rank, estimatedWaitSeconds }` | 「前面还有 N 人」 |
| `reject` | Limiter 超时 | `{ type, delta, reason, waitedMs }` | 「系统繁忙」 |
| `sources` | Handler.onSources | `{ items: SourceReference[] }` | 生成前画引用栏 |
| `message` | Handler 缓冲后 | `{ type: 'response'\|'think', delta }` | 追加正文 / 思考区 |
| `finish` | Handler 完成 / Limiter 拒绝 / 错误收尾 | `{ messageId, title, sources? }` | 结束 loading，绑 messageId |
| `cancel` | StreamTaskManager | 同 CompletionPayload | 取消态 + 已生成内容 id |
| `done` | 各收尾路径 | `'[DONE]'` | 关流、停重连 |

`messageId === null`：拒绝、错误、取消时尚未生成正文、或落库失败。

### 5.2 `message` 不是每个 token 一发

Handler 按 **5 个 Unicode codepoint**（`Array.from`，避免半个 emoji）攒一批再 `send`。结束时 `flushRemaining` 把尾巴打出去。`think` 与 `response` 两套缓冲。

检索完成后 `onSources`：落库用完整分片，SSE 用 `toSourcePreview` 截短；`finish` / `cancel` 再带一份 preview 兜底（见笔记 11）。

完成/取消/错误用 `AtomicBoolean` CAS，只走一次收尾，避免 `finish` 双发。

---

## 6. ChatService 把连接交给谁

```text
create → meta
  → resolveConversation / create + append user
  → 必要时补 meta
  → new StreamChatEventHandler(sender, ...)
  → handler.init({ skipMeta: true })     // 只注册 TaskManager，不再推 meta
  → queueLimiter.acquireChatFlow({ sender, taskId, isCancelled, onRejected })
       成功 → pipeline.execute(ctx)  （void，catch 里 handler.onError）
       失败 → 已推 reject/finish/done 并 close，await waitUntilClosed 返回
  → await waitUntilClosed
```

`pipeline.execute` **不** await 在 handler 返回路径上：生成是后台跑的；Service 只等 SSE 关。`finally` 里 `handle.release()` 还并发槽。

管道失败：`handler.onError` → `message`（失败文案）→ `finish` → `done` → `close('error')`。

Service 自己 catch：再推一条 `event: message`（data 为 `{ type, delta }`），`close('error')`。这条路径的 event 名是字面量 `'message'`，与枚举一致。

---

## 7. 排队与取消如何复用同一条 SSE

### 7.1 排队

`ChatQueueLimiter.acquireChatFlow` 在 **meta 已发出、连接已活着** 的前提下：

1. 每 2s 查 Redis ZSET 排名，推 `queue`。
2. `limiter.acquire` 带 `isCancelled`。
3. 超时：`reject → finish(messageId=null) → done → close('reject')`，并 `onRejected` 注销任务。
4. 用户取消：不在这里推 `cancel`（由 TaskManager 推），Limiter 只 release permit（若已拿到）。

### 7.2 取消

`POST /ai/chat/cancel { taskId }` → `StreamTaskManager.cancel`：

```text
Redis SET ragent:stream:cancel:{taskId}（30min TTL）
  → Pub/Sub ragent:stream:cancel
  → 各节点 cancelLocal（CAS）
       → LLM handle.cancel()
       → onCancelSupplier：尽量 append 已生成正文 + sources
       → cancel + done → close('user-cancel')
```

本地 Map 持有 `sender` / 取消回调；Pub/Sub 不可用则单节点 `cancelLocal`。前端是 **两步**：`AbortController.abort()` 断 SSE + 调 cancel API 停 LLM（否则只断连接、模型还在烧）。

注册前就被取消：`register` 时查 Redis，走 `pre-cancel` 路径。

---

## 8. 前端怎么收

`useStreamResponse` 用 **`@microsoft/fetch-event-source`**，不用浏览器原生 `EventSource`（后者只有 GET、不能带 Authorization）。

```text
POST /api/ai/chat
Accept: text/event-stream
Authorization: Bearer ...
body: { ..., stream: true }
```

按 `ev.event` 分发到 `onMeta` / `onMessage` / `onSources` / `onQueue` / `onReject` / `onFinish` / `onCancel` / `onDone`。非 `[DONE]` 的 data 做 `JSON.parse`。

`onclose` 且非主动结束时最多重连 3 次（间隔 1s）。用户 `cancel()` 设 `manualClosed`，不再重连。

---

## 9. 和 RAG `@Sse('query/stream')` 的差别

| | 对话 `/ai/chat` | 调试 `/ai/rag/query/stream` |
| --- | --- | --- |
| 机制 | Fastify hijack + `SseConnection` | Nest `@Sse` + RxJS Observable |
| 方法 | POST 自管 raw | Nest SSE 约定 |
| 事件 | 完整 8 种 + 心跳/排队/取消 | 主要 message / finish / done |
| 状态 | 产品入口 | deprecated，请改 chat |

不要把两套客户端混用：chat 必须认 `event:` 字段和 JSON data；注释心跳要忽略。

---

## 10. 时序总览

```text
客户端 POST /api/ai/chat (stream)
        │
        ▼ 同步，无 await
  hijack + 200 + SSE 头 + flushHeaders
  : connected
  event: meta   { conversationId?, taskId }
  :ping 每 2s
        │
        ▼ 允许 await
  建/校验会话，append user
  （可选）再推 meta（最终 conversationId）
  注册 TaskManager
        │
        ├─ 排队中 → event: queue  （2s）
        ├─ 超时   → reject → finish → done → end
        └─ 拿到槽
              │
              ├─ 检索完成 → event: sources
              ├─ LLM token → event: message  （每 ≥5 codepoint）
              ├─ 完成 → append assistant → finish → done → end
              ├─ 用户 cancel API → cancel → done → end
              └─ 异常 → message(失败文案) → finish → done → end
        │
        ▼
  waitUntilClosed 返回，Nest handler 结束
```

---

## 11. 实现约束（改这段时不要破坏）

1. **`create` 之前禁止 await**（含看似无害的 `conversationService` / Redis）。
2. 流式 **`@Res()` 无 passthrough**，handler 不要 `return` 业务对象给拦截器去 send。
3. 必须 **`@Bypass` + `@SkipTimeout`**。
4. 等首包期间必须有 **注释心跳**；只 flush 头不够。
5. 正常结束顺序是 **`finish`（或 `cancel`/`reject`）再 `done` 再 `close`**。
6. `waitUntilClosed` 必须等到关连接，否则 Fastify/Nest 会提前收尾。
7. 拿到排队 permit 后 **一定 `release`**（pipeline `finally`）。
8. 前端取消要 **abort + cancel API** 两步。

---

## 12. 排查

| 现象 | 先看 |
| --- | --- |
| 第一次对话失败、重试成功 | 心跳是否写出；Vite 代理 idle；create 是否被 await 推迟 |
| `stream-ended` / `writable-ended` | passthrough、拦截器 ResOp、handler 提前返回 |
| `already-destroyed-at-create` | create 前有 await，或客户端已断开 |
| 排队后前端一直转圈 | 有没有 `reject/finish/done`；permit 是否 release |
| 取消后模型仍在跑 | 是否调了 `/ai/chat/cancel`，Pub/Sub 是否就绪 |
| 有正文无引用 | 笔记 11：`sources` 事件与 `finish.sources` |
