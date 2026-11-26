# 44 · 服务器发送事件（SSE）（Server-Sent Events）

> 官方文档：<https://fastapi.tiangolo.com/zh/tutorial/server-sent-events/>
> 前置依赖：JSON Lines 流式传输、Pydantic 模型、Header 参数 · 难度：⭐⭐

---

## 一、章节笔记

### 1. 什么是 SSE

服务器发送事件（Server-Sent Events）是通过 HTTP 从服务器向客户端**单向流式**推送数据的标准，响应格式为 `text/event-stream`，浏览器原生通过 `EventSource` API 支持。

每个事件是一个小文本块，以空行分隔，可含 `data`、`event`、`id`、`retry` 等字段：

```text
data: {"name": "Portal Gun", "price": 999.99}

data: {"name": "Plumbus", "price": 32.99}
```

常用于：AI 聊天流式输出、实时通知、日志与可观测性。二进制流（视频/音频）仍应看进阶"流式传输数据"章节。

> 版本要求：FastAPI 0.135.0 新增。

### 2. 基础写法：`response_class=EventSourceResponse` + `yield`

与 JSON Lines 几乎一样，只是多了一个响应类：

```python
from collections.abc import AsyncIterable, Iterable

from fastapi import FastAPI
from fastapi.sse import EventSourceResponse
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str | None

items = [
    Item(name="Plumbus", description="A multi-purpose household device."),
    Item(name="Portal Gun", description="A portal opening device."),
    Item(name="Meeseeks Box", description="A box that summons a Meeseeks."),
]

@app.get("/items/stream", response_class=EventSourceResponse)
async def sse_items() -> AsyncIterable[Item]:
    for item in items:
        yield item
```

| 要点 | 说明 |
|---|---|
| `from fastapi.sse import EventSourceResponse` | SSE 响应类 |
| `response_class=EventSourceResponse` | 必须设置，把生成器的产出编码为 SSE 事件 |
| 每个 `yield` 的项 | 被编码为 JSON，放入事件的 `data:` 字段 |
| `AsyncIterable[Item]` 注解 | 用于 Pydantic 校验、OpenAPI 文档、序列化；Rust 侧序列化性能更高 |
| 普通 `def` 版本 | 用 `yield`，返回类型改 `Iterable[Item]`，FastAPI 保证不阻塞事件循环 |
| 无返回类型注解 | 用 `jsonable_encoder` 转换后发送 |

四种函数形式（异步/同步 × 有/无注解）与 JSON Lines 章一致，区别仅在于都要加 `response_class=EventSourceResponse`。

### 3. `ServerSentEvent`：设置 event / id / retry / comment

需要自定义 SSE 字段时，`yield` 一个 `ServerSentEvent` 对象：

```python
from collections.abc import AsyncIterable
from fastapi import FastAPI
from fastapi.sse import EventSourceResponse, ServerSentEvent
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

items = [
    Item(name="Plumbus", price=32.99),
    Item(name="Portal Gun", price=999.99),
    Item(name="Meeseeks Box", price=49.99),
]

@app.get("/items/stream", response_class=EventSourceResponse)
async def stream_items() -> AsyncIterable[ServerSentEvent]:
    yield ServerSentEvent(comment="stream of item updates")
    for i, item in enumerate(items):
        yield ServerSentEvent(data=item, event="item_update", id=str(i + 1), retry=5000)
```

| 字段 | 含义 |
|---|---|
| `data` | 事件数据，**始终被 JSON 编码**，可传任何可序列化值（含 Pydantic 模型） |
| `event` | 事件类型名，浏览器可用 `addEventListener("item_update", ...)` 监听 |
| `id` | 事件 ID，用于断线重连 |
| `retry` | 建议浏览器重连等待毫秒数 |
| `comment` | 注释行（以 `:` 开头），常用于保活 |

### 4. `raw_data`：发送未经 JSON 编码的原文

```python
@app.get("/logs/stream", response_class=EventSourceResponse)
async def stream_logs() -> AsyncIterable[ServerSentEvent]:
    logs = [
        "2025-01-01 INFO  Application started",
        "2025-01-01 DEBUG Connected to database",
        "2025-01-01 WARN  High memory usage detected",
    ]
    for log_line in logs:
        yield ServerSentEvent(raw_data=log_line)
```

适合预格式化文本、日志行或哨兵值（如 `[DONE]`）。**`data` 与 `raw_data` 互斥**，每个事件只能设其中一个。

### 5. 使用 `Last-Event-ID` 断线恢复

连接中断后浏览器重连时，会在 `Last-Event-ID` 请求头中带上上次收到的 id。把它读为 Header 参数即可从断点续传：

```python
from typing import Annotated
from fastapi import FastAPI, Header
from fastapi.sse import EventSourceResponse, ServerSentEvent

app = FastAPI()

@app.get("/items/stream", response_class=EventSourceResponse)
async def stream_items(
    last_event_id: Annotated[int | None, Header()] = None,
) -> AsyncIterable[ServerSentEvent]:
    start = last_event_id + 1 if last_event_id is not None else 0
    for i, item in enumerate(items):
        if i < start:
            continue
        yield ServerSentEvent(data=item, id=str(i + 1))
```

### 6. SSE 不限于 GET：POST 也能用

SSE 适用于任意 HTTP 方法，这对通过 POST 传输 SSE 的协议（如 MCP）很有用：

```python
from collections.abc import AsyncIterable
from fastapi import FastAPI
from fastapi.sse import EventSourceResponse, ServerSentEvent
from pydantic import BaseModel

app = FastAPI()

class Prompt(BaseModel):
    text: str

@app.post("/chat/stream", response_class=EventSourceResponse)
async def stream_chat(prompt: Prompt) -> AsyncIterable[ServerSentEvent]:
    words = prompt.text.split()
    for word in words:
        yield ServerSentEvent(data=word, event="token")
    yield ServerSentEvent(raw_data="[DONE]", event="done")
```

### 7. 开箱即用的最佳实践（无需手动处理）

- 15 秒无消息时发送保活 `ping` 注释，避免代理关闭连接（HTML 规范 SSE 章节建议）。
- 设置 `Cache-Control: no-cache`，防止流被缓存。
- 设置 `X-Accel-Buffering: no`，防止 Nginx 等代理缓冲。

### 8. 易错点

| 易错点 | 正确做法 |
|---|---|
| 忘记 `response_class=EventSourceResponse` | 仅 `yield` 会走 JSON Lines，不是 SSE |
| 同时设置 `data` 和 `raw_data` | 二者互斥，只能设一个 |
| 想发预格式化文本却用 `data` | `data` 会 JSON 编码，原文用 `raw_data` |
| 异步函数标注 `Iterable` | 异步用 `AsyncIterable[ServerSentEvent]`，同步用 `Iterable[...]` |
| 以为 SSE 只能 GET | 任意方法均可，POST 常用于 MCP、AI chat |

---

## 二、NestJS 对比

| 维度 | FastAPI（Python） | NestJS（TypeScript） |
|---|---|---|
| SSE 支持 | 框架一等支持：`EventSourceResponse` + `yield` | 无内置专门抽象，需 `@Res()` 手写头信息并 `res.write()`，或引入第三方 SSE 库 |
| 响应类/头信息 | `response_class=EventSourceResponse` 自动设置 `text/event-stream`、`no-cache` 等 | 手动 `res.header('Content-Type', 'text/event-stream')`、`Connection: keep-alive` 等 |
| 事件结构 | `ServerSentEvent(data=..., event=..., id=..., retry=..., comment=...)` | 手动拼接 `data: ...\n\n` 字符串 |
| 保活与防缓冲 | 内置 15 秒 ping 注释、`X-Accel-Buffering: no` | 需自己实现定时器发送 `: ping\n\n` |
| 断线恢复 | `Last-Event-ID` 作为 Header 参数直接读取 | `@Headers('last-event-id')` 读取，逻辑自行实现 |
| 数据校验 | 返回 `AsyncIterable[Item]` 由 Pydantic 校验/序列化 | 需自行 `plainToInstance` + `class-validator`，流中逐项处理 |
| 方法支持 | GET/POST 均可，写 `@app.post` 即可 | `@Post()` + 原生响应同样可行，无专门封装 |

**核心差异一句话**：FastAPI 把 SSE 的协议细节（事件编码、保活 ping、缓存与代理头、断线恢复字段）都封装进 `EventSourceResponse` 与 `ServerSentEvent`，你只需 `yield`；NestJS 把这些都留给你用 `@Res()` 逐项手写，灵活性高但样板代码明显更多。

---

## 三、针对性练习题

### 题 1（基础）
SSE 使用什么 Content-Type？浏览器用什么原生 API 接收？一个 SSE 事件可包含哪些字段？

<details>
<summary>参考答案</summary>

Content-Type 是 `text/event-stream`，浏览器通过 `EventSource` API 原生接收。事件字段包括 `data`、`event`、`id`、`retry`（还有以 `:` 开头的注释行，可作保活）。事件之间以空行分隔。
</details>

### 题 2（理解）
比较 JSON Lines 与 SSE：写出 SSE 接口的两个必要要素，并说明 `yield` 的普通对象与 `ServerSentEvent` 的区别。

<details>
<summary>参考答案</summary>

要素：① 路径操作设置 `response_class=EventSourceResponse`；② 函数中用 `yield` 逐项产出。直接 `yield` 普通对象（如 Pydantic 模型）时，该项被 JSON 编码后放进事件的 `data:` 字段，`event/id/retry` 等均为默认；`yield ServerSentEvent(...)` 可显式设置 `data`、`event`、`id`、`retry`、`comment` 等字段，`data` 仍自动 JSON 编码。
</details>

### 题 3（辨析/代码）
要发送一行预格式化的日志文本 `2025-01-01 INFO started`，并发送哨兵 `[DONE]`，为什么不能用 `data=...`？写出正确代码。

<details>
<summary>参考答案</summary>

`data` 字段会被 JSON 编码（字符串会带引号并转义），预格式化文本会变形。应改用 `raw_data` 发送未经编码的原文，且 `data` 与 `raw_data` 互斥：

```python
@app.get("/logs/stream", response_class=EventSourceResponse)
async def stream_logs() -> AsyncIterable[ServerSentEvent]:
    yield ServerSentEvent(raw_data="2025-01-01 INFO started")
    yield ServerSentEvent(raw_data="[DONE]", event="done")
```
</details>

### 题 4（进阶 · NestJS 迁移视角）
用 FastAPI 实现一个 POST 的流式聊天接口：请求体为 `Prompt(text: str)`，按空格切词，每个词作为 `token` 事件发送，最后发送 `done` 事件的 `[DONE]` 哨兵。并简述 NestJS 实现要多做什么。

<details>
<summary>参考答案</summary>

```python
from collections.abc import AsyncIterable
from fastapi import FastAPI
from fastapi.sse import EventSourceResponse, ServerSentEvent
from pydantic import BaseModel

app = FastAPI()

class Prompt(BaseModel):
    text: str

@app.post("/chat/stream", response_class=EventSourceResponse)
async def stream_chat(prompt: Prompt) -> AsyncIterable[ServerSentEvent]:
    for word in prompt.text.split():
        yield ServerSentEvent(data=word, event="token")
    yield ServerSentEvent(raw_data="[DONE]", event="done")
```

NestJS 中需注入 `@Res()`，手动设置 `Content-Type: text/event-stream`、`Cache-Control: no-cache`、`X-Accel-Buffering: no`，逐条 `res.write("event: token\ndata: ...\n\n")`，自行实现保活 ping 与连接关闭处理；请求体校验靠 DTO + ValidationPipe。
</details>

### 题 5（思考）
SSE 的 `id` 字段配合 `Last-Event-ID` 头如何实现断线续传？请描述服务端逻辑。

<details>
<summary>参考答案</summary>

服务端为每个事件设置递增的 `id`（如 `str(i+1)`）。浏览器断线重连时会把上次收到的 id 放进 `Last-Event-ID` 请求头。服务端把它声明为 Header 参数（如 `last_event_id: Annotated[int | None, Header()] = None`），计算起始位置 `start = last_event_id + 1`，遍历时跳过 `i < start` 的项，从断点继续发送。这样客户端能无缝恢复流而不重复处理旧事件。
</details>
