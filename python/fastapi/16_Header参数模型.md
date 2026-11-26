# 16 · Header 参数模型（Header Parameter Models）

> 官方文档：<https://fastapi.tiangolo.com/zh/tutorial/header-param-models/>
> 前置依赖：Header 参数、Pydantic 基础模型 · 难度：⭐⭐

---

## 一、章节笔记

### 1. 本章要解决什么问题

一组相关请求头（如 `host`、`save-data`、`traceparent`、`x-tag`）需要在多个端点复用时，用 **Pydantic 模型**统一声明它们的字段、类型、校验与元数据，一次定义、处处复用。

- 自 FastAPI **0.115.0** 起支持。
- 机制与上一章的 Cookie 参数模型一致，只是把 `Cookie()` 换成 `Header()`。

### 2. 用 Pydantic 模型声明 Header

```python
from typing import Annotated

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class CommonHeaders(BaseModel):
    host: str
    save_data: bool
    if_modified_since: str | None = None
    traceparent: str | None = None
    x_tag: list[str] = []

@app.get("/items/")
async def read_items(headers: Annotated[CommonHeaders, Header()]):
    return headers
```

非 `Annotated` 等价写法：`headers: CommonHeaders = Header()`。

要点：

- FastAPI 从请求头中按字段名提取数据，组装为 `CommonHeaders` 实例。
- 字段名中的下划线会按 Header 规则转成连字符：`save_data` → `save-data`，`if_modified_since` → `if-modified-since`。
- `x_tag: list[str] = []` 可接收重复的 `X-Tag` 头（与上一章 list 参数同理）。
- 类型会真正参与校验：`save_data: bool` 要求请求头值能被解析为布尔值。

### 3. 禁止额外的 Header

```python
from typing import Annotated

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class CommonHeaders(BaseModel):
    model_config = {"extra": "forbid"}

    host: str
    save_data: bool
    if_modified_since: str | None = None
    traceparent: str | None = None
    x_tag: list[str] = []

@app.get("/items/")
async def read_items(headers: Annotated[CommonHeaders, Header()]):
    return headers
```

客户端发送额外头 `tool: plumbus` 时的错误响应：

```json
{
    "detail": [
        {
            "type": "extra_forbidden",
            "loc": ["header", "tool"],
            "msg": "Extra inputs are not permitted",
            "input": "plumbus"
        }
    ]
}
```

### 4. 在模型中禁用下划线转换

与单个 Header 参数一样，模型级别也支持 `convert_underscores=False`：

```python
from typing import Annotated

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class CommonHeaders(BaseModel):
    host: str
    save_data: bool
    if_modified_since: str | None = None
    traceparent: str | None = None
    x_tag: list[str] = []

@app.get("/items/")
async def read_items(
    headers: Annotated[CommonHeaders, Header(convert_underscores=False)],
):
    return headers
```

- 默认：`save_data` 对应请求头 `save-data`，文档也显示为 `save-data`。
- 禁用后：`save_data` 原样对应请求头 `save_data`（含下划线）。
- ⚠️ 某些 HTTP 代理和服务器**不允许带下划线的 Header**，设置前请确认环境支持。

### 5. 组合参数模型

可将多个 Header 模型与单独 Header 参数、依赖项组合使用，规则如下：

- 每个模型**独立提取和验证**。
- 每个模型的 `extra` 配置适用于**所有** Header 参数（含其他模型/依赖项中声明的）：
  - `extra="forbid"` → 不属于该模型的 Header 全部拒绝。
  - `extra="allow"` → 这些 Header 作为模型的额外字段包含。
- 每个模型读取请求与生成 OpenAPI 时，使用**各自的** `Header(convert_underscores=...)` 设置。
- 显式指定的**字段别名**会原样用作 Header 名称。

### 6. 可选的 Header 参数模型

```python
from typing import Annotated

from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class ClientHeaders(BaseModel):
    x_client_name: str
    x_client_version: str

@app.get("/items/")
async def read_items(client: Annotated[ClientHeaders | None, Header()] = None):
    return client
```

规则：

- `x-client-name`、`x-client-version` **都不发** → `client` 为 `None`。
- **发任意一个** → 触发完整模型校验，要求两个字段都存在。
- `Host` 等 Header 也遵循模型的 `extra` 配置；用 `extra="allow"` 时，即使未声明字段一个都没发，这些 Header 也会让模型被视为「已提供」。

### 7. 关键规则对照表

| 场景 | 写法 | 行为 |
|---|---|---|
| 必填模型 | `headers: Annotated[CommonHeaders, Header()]` | 缺必填字段 → 422 |
| 下划线转连字符 | 默认开启 | `save_data` ↔ `save-data` |
| 禁用转换 | `Header(convert_underscores=False)` | `save_data` 原样匹配，可能被代理拒绝 |
| 禁止额外字段 | `model_config = {"extra": "forbid"}` | 多出未声明头 → 422 `extra_forbidden` |
| 重复头 | `x_tag: list[str] = []` | 收集多个 `X-Tag` 值 |
| 整组可选 | `Annotated[ClientHeaders \| None, Header()] = None` | 全不发 → `None`；发一个 → 要求全部字段 |

### 8. 易错点

- ✅ 字段名用 snake_case 即可，文档会显示为连字符形式，无需手动改成 `X-Tag` 这类写法。
- ✅ 模型里改下划线转换要在 `Header(convert_underscores=False)` 上设置，而不是改字段名。
- ✅ `extra` 是全局性的，多模型组合时一个模型的 `forbid` 会拒绝其它模型想要的头，别混用冲突策略。

---

## 二、NestJS 对比

| 维度 | FastAPI（Python） | NestJS（TypeScript） |
|---|---|---|
| 读取一组 Header | Pydantic 模型 + `Annotated[Headers, Header()]`，按字段逐个提取 | `@Headers()` 注入整个头对象，或 `@Headers('name')` 注入单个 |
| 下划线→连字符 | 内置自动转换；`Header(convert_underscores=False)` 可关闭 | 无转换；头名在 Node 层统一小写，需开发者自己映射 |
| 一组头的类型校验 | Pydantic 字段类型自动校验（如 `save_data: bool`） | DTO + `class-validator`（如 `@IsBoolean()`）+ `ValidationPipe` |
| 禁止额外头 | `model_config = {"extra": "forbid"}` | `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })` |
| 重复头处理 | 字段声明 `list[str]` 收集全部值 | `req.headers[...]` 可能是 `string | string[]`，需手动归一化 |
| 字段别名 | Pydantic `Field(alias=...)` 显式别名原样作头名 | `@Headers('x-client-name')` 直接声明头名 |
| 错误定位 | 422，`loc: ["header", 字段名]` | `BadRequestException`，默认 `message` 数组 |
| 组合与作用域 | 多模型各自 `convert_underscores` 设置，`extra` 对所有头生效 | 通过自定义 Pipe/中间件复用；头对象共享，需显式拆分 |
| 文档生成 | OpenAPI 自动包含模型字段（连字符形式） | 需 `@nestjs/swagger` 手动加 `@ApiHeader()` 描述 |

**核心差异一句话**：FastAPI 把一组 Header 当作一个 Pydantic 模型参数，连字符映射、类型转换、禁止额外字段都由模型与 `Header()` 一次声明完成；NestJS 用 `@Headers()` 拿到原始头对象后，字段映射、类型转换、白名单校验都要靠 DTO + `class-validator` + `ValidationPipe` 显式搭建，控制力更强但样板代码更多。

---

## 三、针对性练习题

### 题 1（基础）

用 Pydantic 模型声明一组 Header：`host`（必填 str）、`save_data`（必填 bool）、`x_tag`（可选 list[str]），并写出端点返回该模型。

<details>
<summary>参考答案</summary>

```python
from typing import Annotated
from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class CommonHeaders(BaseModel):
    host: str
    save_data: bool
    x_tag: list[str] = []

@app.get("/items/")
async def read_items(headers: Annotated[CommonHeaders, Header()]):
    return headers
```

`save_data` 默认对应请求头 `save-data`；`x_tag` 可接收重复的 `X-Tag` 头。
</details>

### 题 2（理解）

模型字段 `save_data` 默认对应哪个请求头？想让它原样匹配 `save_data`（含下划线）该怎么做？这样做的风险是什么？

<details>
<summary>参考答案</summary>

- 默认下划线转连字符：`save_data` → `save-data`，文档中也显示为 `save-data`。
- 想原样匹配需写 `Header(convert_underscores=False)`，此时期望请求头名为 `save_data`。
- 风险：某些 HTTP 代理和服务器不允许带下划线的请求头，可能在中途被丢弃或拒绝。
</details>

### 题 3（辨析/代码）

客户端发送 `tool: plumbus` 时，下面模型返回 422。请说明实现这一效果的关键配置，并写出错误响应的 `loc`。

```python
class CommonHeaders(BaseModel):
    model_config = {"extra": "forbid"}
    host: str
```

<details>
<summary>参考答案</summary>

关键是 `model_config = {"extra": "forbid"}`：Pydantic 禁止任何未声明的额外字段。错误响应中 `loc` 为：

```json
"loc": ["header", "tool"]
```

类型为 `extra_forbidden`，`msg` 为 `Extra inputs are not permitted`。
</details>

### 题 4（进阶 · NestJS 迁移视角）

NestJS 中你用 `@Headers()` + DTO + `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })` 校验请求头。请写出等价的 FastAPI 写法，实现「`host` 必填、拒绝额外头」。

<details>
<summary>参考答案</summary>

```python
from typing import Annotated
from fastapi import FastAPI, Header
from pydantic import BaseModel

app = FastAPI()

class CommonHeaders(BaseModel):
    model_config = {"extra": "forbid"}
    host: str

@app.get("/items/")
async def read_items(headers: Annotated[CommonHeaders, Header()]):
    return headers
```

差异：FastAPI 的 Pydantic 模型同时承担提取、类型转换与白名单校验，`extra="forbid"` 一行即等价于 NestJS 的 whitelist + forbidNonWhitelisted 配置，无需额外 Pipe；错误响应自带 `loc: ["header", ...]`。
</details>

### 题 5（思考）

两个 Header 模型组合使用时，模型 A 设了 `extra="forbid"`，模型 B 设了 `extra="allow"`。客户端发送一个只属于模型 B 的头，模型 A 会接受吗？为什么？

<details>
<summary>参考答案</summary>

不会，会触发 `extra_forbidden` 错误。因为每个模型的 `extra` 配置适用于**所有** Header 参数，包括其它模型或依赖项中声明的字段。模型 A 的 `forbid` 会拒绝任何不属于模型 A 的头 —— 即使该头属于模型 B。这正是文档强调组合使用时要留意 `extra` 冲突的原因；若需并存，应统一策略（如都用 `allow`）。
</details>
