# 26 · JSON 兼容编码器（JSON Compatible Encoder）

> 官方文档：<https://fastapi.tiangolo.com/zh/tutorial/encoder/>
> 前置依赖：Pydantic 模型、datetime 基础 · 难度：⭐

---

## 一、章节笔记

### 1. 本章要解决什么问题

有时要把 Pydantic 模型等对象转换为**与 JSON 兼容的数据类型**（`dict`、`list` 等），例如存入只接受 JSON 数据的数据库。FastAPI 提供 `jsonable_encoder()` 完成这件事。

### 2. 为什么需要它

假设数据库 `fake_db` 只接收 JSON 兼容数据：

- 不接收 `datetime` 对象 —— 必须转换成 **ISO 格式的 `str`**。
- 不接收 Pydantic 模型（带属性的对象）—— 只接收 `dict`。

`jsonable_encoder()` 接收一个对象（如 Pydantic 模型），返回其 JSON 兼容版本。

### 3. 基本用法

```python
from datetime import datetime

from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

fake_db = {}

class Item(BaseModel):
    title: str
    timestamp: datetime
    description: str | None = None

app = FastAPI()

@app.put("/items/{id}")
def update_item(id: str, item: Item):
    json_compatible_item_data = jsonable_encoder(item)
    fake_db[id] = json_compatible_item_data
```

本例中它做了两件事：

1. Pydantic 模型 → `dict`
2. `datetime` → ISO 格式 `str`

之后可直接使用 Python 标准库的 `json.dumps()`。

### 4. 关键理解

- 返回的是**Python 标准数据结构**（如 `dict`），其值和子值都与 JSON 兼容 —— **不是** JSON 格式的字符串。
- 所以不要误以为它返回「一大串 `str`」；它只是把数据整理成「可被 JSON 编码」的形态。
- `jsonable_encoder` 实际上是 **FastAPI 内部用来转换数据的函数**，但在许多其它场景（如存入数据库、构造响应载荷）也很有用。

### 5. 转换效果速查

| 输入 | 输出 | 说明 |
|---|---|---|
| Pydantic 模型 | `dict` | 按字段导出数据 |
| `datetime` | ISO 格式 `str` | 如 `2026-11-26T10:00:00` |
| 普通 `dict` / `list` | 同结构，递归确保子值可 JSON 化 | 支持嵌套结构 |
| 结果交给 `json.dumps()` | JSON 字符串 | 两步分工：先兼容化，再序列化 |

### 6. 易错点

- ✅ `jsonable_encoder()` 返回的是 `dict` 等 Python 数据结构，**不是** JSON 字符串。
- ✅ 直接 `return` 模型时 FastAPI 会自动编码，通常无需手动调用；手动调用多用于**存数据库**或构造自定义响应内容。
- ✅ 它和 `model_dump()` 的区别：`model_dump()` 只导出模型为 dict（可能仍含 `datetime` 对象），`jsonable_encoder()` 进一步保证所有值 JSON 兼容。

---

## 二、NestJS 对比

| 维度 | FastAPI（Python） | NestJS（TypeScript） |
|---|---|---|
| 对象转 JSON 兼容数据 | `jsonable_encoder(model)` → `dict`，`datetime` 转 ISO 字符串 | 用 `class-transformer` 的 `instanceToPlain()` / `plainToInstance()`，或 `JSON.stringify()` + `JSON.parse()` |
| 日期处理 | `datetime` 自动转 ISO 格式 `str` | `Date` 经 `JSON.stringify()` 自动转 ISO 字符串；`class-transformer` 可用 `@Transform` 定制 |
| 返回值形态 | Python `dict`/`list`（可继续 `json.dumps`） | JS 对象或 JSON 字符串，取决于所用方法 |
| 框架内建程度 | `jsonable_encoder` 是 FastAPI **内部数据转换函数**，直接公开可用 | 无同名内建函数；序列化常由 `ClassSerializerInterceptor` + DTO 装饰器承担 |
| 响应自动序列化 | 直接 `return` 模型即可，FastAPI 自动编码 | 返回对象由 Express/Fastify 的 `res.json()` 序列化，无 Pydantic 式模型校验 |
| 存入数据库 | `jsonable_encoder(item)` 后可存入只接受 JSON 的存储 | 用 DTO 映射 / `instanceToPlain` 转成普通对象后交给 ORM/驱动 |
| 嵌套结构 | 递归处理子值，保证整体 JSON 兼容 | `class-transformer` 递归转换（需 `@Type()` 标注嵌套类型） |

**核心差异一句话**：FastAPI 提供 `jsonable_encoder()` 作为**公开的、内建使用的**转换函数，把 Pydantic 模型（含 `datetime`）一次性变成真正 JSON 兼容的 Python 数据结构；NestJS 没有对等的内建函数，通常组合 `class-transformer`（`instanceToPlain` + `@Transform`/`@Type`）或原生 `JSON.stringify` 完成类似工作，且控制转换细节需要更多装饰器配置。

---

## 三、针对性练习题

### 题 1（基础）

有一个 `Item` 模型（`title: str`、`timestamp: datetime`），写 `PUT /items/{id}` 把它转换成 JSON 兼容数据后存入 `fake_db` 字典。

<details>
<summary>参考答案</summary>

```python
from datetime import datetime
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

fake_db = {}
app = FastAPI()

class Item(BaseModel):
    title: str
    timestamp: datetime

@app.put("/items/{id}")
def update_item(id: str, item: Item):
    fake_db[id] = jsonable_encoder(item)
    return fake_db[id]
```

`jsonable_encoder` 把模型转成 `dict`，并把 `datetime` 转成 ISO 字符串。
</details>

### 题 2（理解）

`jsonable_encoder(item)` 的返回值是 JSON 字符串吗？得到它之后如何使用 Python 标准库产生真正的 JSON 字符串？

<details>
<summary>参考答案</summary>

不是。它返回的是 Python 标准数据结构（如 `dict`），其值和子值都与 JSON 兼容，本身不是字符串。要得到 JSON 字符串，再调用标准库：

```python
import json
json_str = json.dumps(jsonable_encoder(item))
```

两步分工：`jsonable_encoder` 负责「兼容化」，`json.dumps` 负责「序列化」。
</details>

### 题 3（辨析/代码）

`item.model_dump()` 与 `jsonable_encoder(item)` 都能把模型变成 `dict`。当模型含 `datetime` 字段时，两者结果有何关键差异？

<details>
<summary>参考答案</summary>

`model_dump()` 只按字段导出 dict，`datetime` 字段仍可能是 `datetime` 对象，未必能直接 JSON 序列化；`jsonable_encoder(item)` 会递归确保所有值 JSON 兼容，把 `datetime` 转成 ISO 格式 `str`。因此要存入只接受 JSON 的数据库或对结果调用 `json.dumps()` 时，应使用后者。
</details>

### 题 4（进阶 · NestJS 迁移视角）

NestJS 中用 `class-transformer` 的 `instanceToPlain(user)` 把 DTO 转成普通对象。写出 FastAPI 中等价写法（含日期字段的处理），并说明差异。

<details>
<summary>参考答案</summary>

```python
from datetime import datetime
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

class User(BaseModel):
    name: str
    created_at: datetime

user = User(name="Rick", created_at=datetime.now())
plain = jsonable_encoder(user)
# {'name': 'Rick', 'created_at': '2026-11-26T10:00:00.000000'}
```

差异：FastAPI 的 `jsonable_encoder` 是框架内建且公开的单一函数，自动处理 datetime 等类型；NestJS 的 `instanceToPlain` 来自 `class-transformer`，对嵌套类型/日期格式的控制通常要配合 `@Type()`、`@Transform()` 装饰器，且无 Pydantic 那样的字段类型校验。
</details>

### 题 5（思考）

正文说 `jsonable_encoder` 实际上是 FastAPI 内部用来转换数据的函数。既然直接 `return` Pydantic 模型时 FastAPI 会自动编码，为什么还要手动调用它？举出正文中的场景。

<details>
<summary>参考答案</summary>

手动调用主要用于**非「直接返回」的场景**：正文的例子是把模型数据存入只接受 JSON 兼容数据的 `fake_db` 数据库（不接受 `datetime` 对象或 Pydantic 模型），需要先转成 `dict` + ISO 字符串。此外，构造自定义响应内容（如异常处理器里用 `jsonable_encoder({"detail": ..., "body": exc.body})`）也需要手动确保可 JSON 化。直接返回模型时确实无需手动调用，FastAPI 会自动用同一机制编码。
</details>
