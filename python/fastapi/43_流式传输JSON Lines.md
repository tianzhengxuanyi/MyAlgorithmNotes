# 43 · 流式传输 JSON Lines（Stream JSON Lines）

> 官方文档：<https://fastapi.tiangolo.com/zh/tutorial/stream-json-lines/>
> 前置依赖：Pydantic 模型、async/await 基础 · 难度：⭐⭐

---

## 一、章节笔记

### 1. 什么是"流式传输"

流式传输指应用在数据全部准备好**之前**就开始逐项发送给客户端：先发第一项，客户端边接收边处理，而服务端继续生成下一项；甚至可以是无限流。

适用场景：AI LLM 服务的 token 输出、日志、遥测数据，以及其他可用 JSON 项结构化的数据。若要流式传输**二进制**数据（视频/音频），需用进阶指南中的"流式传输数据"。

> 版本要求：FastAPI 0.134.0 新增。

### 2. JSON Lines 格式

JSON Lines 每行一个 JSON 对象， Content-Type 为 `application/jsonl`（不是 `application/json`）：

```text
{"name": "Plumbus", "description": "A multi-purpose household device."}
{"name": "Portal Gun", "description": "A portal opening device."}
{"name": "Meeseeks Box", "description": "A box that summons a Meeseeks."}
```

与 JSON 数组（Python list）的区别：不用 `[]` 包裹、不用逗号分隔，而是换行分隔，**可以逐行生成、逐行消费**。

技术细节：因为每个对象以换行分隔，内容中不能含字面量换行符，但可以含转义的 `\n`（JSON 标准的一部分），框架会自动处理。

### 3. 核心写法：用 `yield` 代替 `return`

```python
from collections.abc import AsyncIterable, Iterable

from fastapi import FastAPI
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

@app.get("/items/stream")
async def stream_items() -> AsyncIterable[Item]:
    for item in items:
        yield item
```

一旦路径操作函数里用了 `yield`（生成器），FastAPI 就会以 JSON Lines 流式响应。

### 4. 四种写法对照

| 函数形式 | 返回类型注解 | 效果 |
|---|---|---|
| `async def` + 注解 | `AsyncIterable[Item]` | 推荐；Pydantic 校验/文档化/序列化，Rust 侧序列化性能更高 |
| 普通 `def` + 注解 | `Iterable[Item]` | FastAPI 保证不阻塞事件循环（放线程池） |
| `async def` 无注解 | 省略 | 用 `jsonable_encoder` 转换后发送 |
| 普通 `def` 无注解 | 省略 | 同上 |

```python
@app.get("/items/stream-no-async")
def stream_items_no_async() -> Iterable[Item]:
    for item in items:
        yield item

@app.get("/items/stream-no-annotation")
async def stream_items_no_annotation():
    for item in items:
        yield item

@app.get("/items/stream-no-async-no-annotation")
def stream_items_no_async_no_annotation():
    for item in items:
        yield item
```

声明返回类型的好处：FastAPI 会用它校验数据、在 OpenAPI 生成文档、过滤字段，并用 Pydantic 序列化；Pydantic 在 Rust 侧序列化带来更高性能。省略注解时则退化为 `jsonable_encoder`。

### 5. 易错点

| 易错点 | 正确做法 |
|---|---|
| 用 `return [item1, item2]` 想要流式 | 必须用 `yield` 逐个产出，返回整个 list 不是流 |
| `async def` 却标注 `Iterable[Item]` | 异步函数应标 `AsyncIterable[Item]`，普通 `def` 才用 `Iterable[Item]` |
| 以为 JSON Lines 是 JSON 数组 | 每行独立 JSON 对象，无 `[]` 与逗号；Content-Type 是 `application/jsonl` |
| 数据里带真实换行符 | JSON Lines 不允许字面量换行，需用 `\n` 转义（框架自动处理） |
| 把本特性当二进制流用 | 二进制流（视频/音频）看进阶"流式传输数据"章节 |

### 6. 与 SSE 的关系

FastAPI 对 Server-Sent Events（SSE）也提供一等支持，与 JSON Lines 类似但使用 `text/event-stream` 格式，下一章详述。

---

## 二、NestJS 对比

| 维度 | FastAPI（Python） | NestJS（TypeScript） |
|---|---|---|
| 流式响应写法 | 路径操作函数用 `yield`，返回 `AsyncIterable[Item]` / `Iterable[Item]` | handler 返回 RxJS `Observable<...>` 或使用 `@Res()` 手动写流 |
| 响应类型 | 由生成器自动识别为 JSON Lines，`application/jsonl` | 需手动 `res.setHeader('Content-Type', ...)`，或使用 SSE 相关库 |
| 数据校验/序列化 | 返回类型注解让 Pydantic 校验并在 Rust 侧序列化 | 依赖 `ClassSerializerInterceptor` 与 DTO，流中逐项需自行处理 |
| OpenAPI 文档 | 返回类型自动写入文档，零配置 | `@nestjs/swagger` 需显式标注，流式响应文档支持有限 |
| 底层 | ASGI（Starlette）原生支持流式响应 | Express/Fastify 的 Node 流或 RxJS 订阅推送 |
| 同步函数 | 普通 `def` + `yield` 由 FastAPI 放线程池，不阻塞事件循环 | 需自行避免在 async handler 中做阻塞操作 |

**核心差异一句话**：FastAPI 把"流式"抽象成最简单的 `yield`，框架自动识别为 JSON Lines 并接管校验、序列化与文档；NestJS 没有同等的开箱约定，要自己选择 Observable 或原生 Response 流，并手动设置 Content-Type 与处理逐项序列化。

---

## 三、针对性练习题

### 题 1（基础）
什么是 JSON Lines？它与 JSON 数组有何区别？其响应 Content-Type 是什么？

<details>
<summary>参考答案</summary>

JSON Lines 是每行一个 JSON 对象的文本格式，行与行用换行符分隔。与 JSON 数组相比，它不用 `[]` 包裹、项间不用逗号分隔，因此可以逐行生成、客户端逐行消费，适合流式场景。Content-Type 为 `application/jsonl`（不是 `application/json`）。
</details>

### 题 2（理解）
在 FastAPI 中如何实现 JSON Lines 流式响应？为什么说声明返回类型注解更好？

<details>
<summary>参考答案</summary>

在路径操作函数中用 `yield` 逐个产出数据项（而不是 `return` 整个列表）。声明返回类型（异步函数用 `AsyncIterable[Item]`，普通函数用 `Iterable[Item]`）后，FastAPI 会用该类型校验数据、生成 OpenAPI 文档、过滤字段，并由 Pydantic 在 Rust 侧序列化，性能更高；不声明时只能用 `jsonable_encoder` 转换。
</details>

### 题 3（辨析/代码）
下面两段代码都能"返回数据"，但只有一段是流式。指出并解释：

```python
@app.get("/a")
async def a() -> list[Item]:
    return items

@app.get("/b")
async def b() -> AsyncIterable[Item]:
    for item in items:
        yield item
```

<details>
<summary>参考答案</summary>

`/b` 是流式：用了 `yield`，FastAPI 识别为生成器，逐项以 JSON Lines 发送，客户端可在服务端生成后续项时就开始处理。`/a` 是一次性返回整个列表，必须先生成完所有数据并整体序列化后才响应，不是流式。
</details>

### 题 4（进阶 · NestJS 迁移视角）
你在 NestJS 中通常返回 `Observable<Item[]>` 或手动 `res.write()`。请写出功能等价的 FastAPI 异步流式接口（Pydantic 模型 `Item`，路径 `/items/stream`），并说明普通 `def` 版本需要改什么。

<details>
<summary>参考答案</summary>

```python
from collections.abc import AsyncIterable
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str | None

@app.get("/items/stream")
async def stream_items() -> AsyncIterable[Item]:
    for item in items:
        yield item
```

若改为普通 `def`（非 async），仍用 `yield`，但返回类型注解要改成 `Iterable[Item]`；FastAPI 会把它放进线程池执行，不会阻塞事件循环。
</details>

### 题 5（思考）
为什么说 JSON Lines 适合 AI LLM、日志、遥测这类场景？如果用 JSON 数组会有什么问题？

<details>
<summary>参考答案</summary>

这类场景的数据是持续产生、单项结构化（每条日志/每个 token/每个事件都是一个对象）的。JSON Lines 允许服务端产出一项就发一项，客户端立即处理，降低首字节延迟，也支持无限流；数组形式必须等全部数据生成完毕后才能整体序列化发送，无法边生成边消费，长/无限流会造成高延迟甚至不可行。
</details>
