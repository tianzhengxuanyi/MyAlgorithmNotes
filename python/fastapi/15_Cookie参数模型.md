# 15 · Cookie 参数模型（Cookie Parameter Models）

> 官方文档：<https://fastapi.tiangolo.com/zh/tutorial/cookie-param-models/>
> 前置依赖：Cookie 参数、Pydantic 基础模型 · 难度：⭐⭐

---

## 一、章节笔记

### 1. 本章要解决什么问题

当一组 Cookie 逻辑上相关、需要在多处复用时，逐个声明既啰嗦又难维护。本章用 **Pydantic 模型**统一声明一组 Cookie：一次定义字段、类型、校验与元数据，然后在多个路径操作中复用。

- 自 FastAPI **0.115.0** 起支持此功能。
- 该技术同样适用于 `Query`、`Cookie` 和 `Header`（即同一套参数模型机制）。

### 2. 用 Pydantic 模型声明 Cookie

在模型中声明所需 Cookie 字段，再把函数参数标注为该模型类型并用 `Cookie()` 标记：

```python
from typing import Annotated

from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()

class Cookies(BaseModel):
    session_id: str
    fatebook_tracker: str | None = None
    googall_tracker: str | None = None

@app.get("/items/")
async def read_items(cookies: Annotated[Cookies, Cookie()]):
    return cookies
```

非 `Annotated` 等价写法：`cookies: Cookies = Cookie()`。

工作原理：FastAPI 从请求的 Cookie 中**按字段名提取数据**，组装成你定义的 Pydantic 模型实例；类型不匹配、缺少必填字段都会触发 422 校验错误。

### 3. 查看文档的一个注意点

在 `/docs` 中能看到定义的 Cookie 文档。但有个浏览器层面的限制：

- 浏览器以特殊方式处理 Cookie，后台自动管理，**不允许 JavaScript 轻易访问**。
- 因此文档 UI 使用 JavaScript「执行」请求时，Cookie **不会被发送**，表现为「好像没填值」并报错。

> 这是文档 UI 的行为，不是 API 本身的问题；用curl/测试客户端可正常发送 Cookie。

### 4. 禁止额外的 Cookie（extra="forbid"）

用 Pydantic 模型配置 `model_config = {"extra": "forbid"}` 可拒绝未声明的 Cookie —— API 可以掌控自己的「Cookie 同意策略」：

```python
from typing import Annotated

from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()

class Cookies(BaseModel):
    model_config = {"extra": "forbid"}

    session_id: str
    fatebook_tracker: str | None = None
    googall_tracker: str | None = None

@app.get("/items/")
async def read_items(cookies: Annotated[Cookies, Cookie()]):
    return cookies
```

客户端若额外发送 `santa_tracker: good-list-please`，将收到错误响应：

```json
{
    "detail": [
        {
            "type": "extra_forbidden",
            "loc": ["cookie", "santa_tracker"],
            "msg": "Extra inputs are not permitted",
            "input": "good-list-please"
        }
    ]
}
```

注意 `loc` 是 `["cookie", "santa_tracker"]`，能精确定位错误来自 Cookie。

### 5. 组合参数模型

多个 Cookie 参数模型可与**单个 Cookie 参数**、**依赖项**组合使用：

- 每个模型**独立提取和验证**（规则与「查询参数模型」相同）。
- 每个模型的 `extra` 配置适用于**所有** Cookie 参数，包括其他模型或依赖项中声明的：
  - `extra="forbid"` → 不属于该模型的任何 Cookie 都被拒绝。
  - `extra="allow"` → 这些 Cookie 会作为模型的额外字段包含进来。

### 6. 可选的 Cookie 参数模型

用 `| None` + 默认值 `None` 让整组 Cookie 可选：

```python
from typing import Annotated

from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()

class Preferences(BaseModel):
    theme: str
    locale: str

@app.get("/items/")
async def read_items(preferences: Annotated[Preferences | None, Cookie()] = None):
    return preferences
```

规则：

- 若 `theme`、`locale` **都未发送** → `preferences` 为 `None`。
- 若**发送了任意一个** → FastAPI 验证模型，并要求**两个字段都存在**。
- 默认值、额外字段、OpenAPI 的规则与可选查询参数模型相同。

### 7. 关键规则对照表

| 场景 | 写法 | 行为 |
|---|---|---|
| 必填模型 | `cookies: Annotated[Cookies, Cookie()]` | 缺必填字段 → 422 |
| 禁止额外字段 | `model_config = {"extra": "forbid"}` | 多出未声明 Cookie → 422 `extra_forbidden` |
| 允许额外字段 | `extra="allow"` | 额外 Cookie 成为模型额外字段 |
| 整组可选 | `Annotated[Preferences \| None, Cookie()] = None` | 一个都不发 → `None`；发一个 → 要求全部字段 |
| 多模型组合 | 多个模型参数 + 依赖项 | 各自独立提取、验证，`extra` 作用于所有 Cookie |

### 8. 易错点

- ✅ 忘了 `Cookie()` 标记 → 模型会被当作**请求体**解析，而非 Cookie。
- ✅ 文档 UI 里「执行」不发送 Cookie 是浏览器限制，别误判成代码 bug。
- ✅ `extra="forbid"` 作用于全局所有 Cookie，包括依赖项里声明的，组合使用时需留意冲突。

---

## 二、NestJS 对比

| 维度 | FastAPI（Python） | NestJS（TypeScript） |
|---|---|---|
| 读取单个 Cookie | `Annotated[str, Cookie()]` 按名提取 | `@Req() req` 读 `req.cookies`，或 `@Cookies('session_id')` |
| 一组 Cookie 建模 | Pydantic `BaseModel` + `Annotated[Cookies, Cookie()]` | DTO 类 + `@Cookies()` 注入对象，再手动映射/校验 |
| 中间件依赖 | 无，框架内置解析 | 需安装并启用 `cookie-parser`（`app.use(cookieParser())`） |
| 校验方式 | Pydantic 模型字段类型自动校验（必填/可选/类型） | DTO + `class-validator` 装饰器 + `ValidationPipe` 全局启用 |
| 禁止额外字段 | `model_config = {"extra": "forbid"}` 内建 | `class-validator` 的 `@Allow()` / whitelist 配置，需 `whitelist: true, forbidNonWhitelisted: true` |
| 错误定位 | 422 响应，`loc: ["cookie", 字段名]` | ValidationPipe 抛出 `BadRequestException`，默认格式为 `message` 数组 |
| 可选模型 | `Model \| None = None` 原生表达 | DTO 属性标 `@IsOptional()` + `?` 可选属性 |
| 文档呈现 | OpenAPI 自动生成 Cookie 参数说明 | 需 `@nestjs/swagger` + `@ApiCookie` 等手动补充 |
| 组合与复用 | 多个模型/依赖项各自独立提取，`extra` 全局生效 | 通过自定义 Pipe/Guard 或拦截器复用逻辑，需显式接线 |

**核心差异一句话**：FastAPI 用「Pydantic 模型 + `Cookie()` 标记」把一组 Cookie 的提取、类型校验、禁止额外字段全部声明式地一次搞定，校验错误自带 `loc: ["cookie", ...]` 精确定位；NestJS 则依赖 `cookie-parser` 底层解析，把 Cookie 对象注入控制器后，需 DTO + `class-validator` + `ValidationPipe` 显式配置才能达到同等校验强度。

---

## 三、针对性练习题

### 题 1（基础）

用 Pydantic 模型声明一组 Cookie：`session_id`（必填 str）、`theme`（可选 str，默认 `"light"`），并写出端点 `GET /items/` 返回该模型。

<details>
<summary>参考答案</summary>

```python
from typing import Annotated
from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()

class Cookies(BaseModel):
    session_id: str
    theme: str | None = "light"

@app.get("/items/")
async def read_items(cookies: Annotated[Cookies, Cookie()]):
    return cookies
```

FastAPI 从请求 Cookie 中按字段名提取数据，组装成 `Cookies` 实例；缺 `session_id` 会返回 422。
</details>

### 题 2（理解）

为什么在 `/docs` 中填写 Cookie 并点击「Execute」经常报「好像没填 Cookie」的错误？这是 FastAPI 的 bug 吗？

<details>
<summary>参考答案</summary>

不是 bug。浏览器以特殊方式在后台管理 Cookie，不允许 JavaScript 轻易访问；而 Swagger UI 文档界面通过 JavaScript 发起请求，无法携带这些 Cookie，于是服务端收到的请求没有 Cookie，表现为字段缺失。用 curl 或 HTTP 客户端直接发送 Cookie 不受影响。
</details>

### 题 3（辨析/代码）

下面模型想拒绝所有未声明的 Cookie。请补全配置，并写出客户端发送 `santa_tracker: yes` 时错误响应中 `loc` 的值。

```python
class Cookies(BaseModel):
    # 补全此处
    session_id: str
```

<details>
<summary>参考答案</summary>

```python
class Cookies(BaseModel):
    model_config = {"extra": "forbid"}
    session_id: str
```

发送额外 Cookie `santa_tracker: yes` 时，422 错误中 `loc` 为：

```json
"loc": ["cookie", "santa_tracker"]
```

类型为 `extra_forbidden`，`msg` 为 `Extra inputs are not permitted`。
</details>

### 题 4（进阶 · NestJS 迁移视角）

NestJS 中你用 `cookie-parser` + DTO + `ValidationPipe` 校验 Cookie。请写出功能等价的 FastAPI 写法，实现「`session_id` 必填、拒绝额外 Cookie」。

<details>
<summary>参考答案</summary>

```python
from typing import Annotated
from fastapi import Cookie, FastAPI
from pydantic import BaseModel

app = FastAPI()

class Cookies(BaseModel):
    model_config = {"extra": "forbid"}
    session_id: str

@app.get("/items/")
async def read_items(cookies: Annotated[Cookies, Cookie()]):
    return cookies
```

差异：FastAPI 无需中间件/DTO/Pipe 三件套，模型本身即校验规则；`extra="forbid"` 直接拒绝额外 Cookie，错误响应带 `loc: ["cookie", ...]`。NestJS 则需 `app.use(cookieParser())`、`@Cookies()` 注入，以及 `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })` 配合 DTO 装饰器。
</details>

### 题 5（思考）

对于可选 Cookie 模型 `Preferences | None = None`（字段 `theme`、`locale`），客户端只发送 `theme=dark` 而不发 `locale` 时会怎样？为什么这样设计？

<details>
<summary>参考答案</summary>

会触发 422 校验错误。因为「可选」指的是**整组参数**可选：两个字段都不发 → `preferences` 为 `None`；但只要发送了其中任意一个，FastAPI 就会按完整模型校验，要求 `theme` 和 `locale` 都存在，缺少 `locale` 即报错。这样设计的意图是避免「半组配置」这种模糊状态：要么不提供偏好（用默认值），要么提供一套完整、经过校验的偏好。
</details>
