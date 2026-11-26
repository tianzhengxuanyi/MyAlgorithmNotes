# 46 · 元数据和文档 URL（Metadata and Docs URLs）

> 官方文档：<https://fastapi.tiangolo.com/zh/tutorial/metadata/>
> 前置依赖：FastAPI 实例、tags 标签 · 难度：⭐

---

## 一、章节笔记

### 1. API 元数据

创建 `FastAPI(...)` 时可设置用于 OpenAPI 规范和自动文档 UI 的字段：

| 参数 | 类型 | 说明 |
|---|---|---|
| `title` | `str` | API 标题 |
| `summary` | `str` | 简短摘要（OpenAPI 3.1.0 / FastAPI 0.99.0 起） |
| `description` | `str` | 描述，**支持 Markdown**，会在文档中渲染 |
| `version` | `str` | 你自己的应用版本（如 `2.5.0`），不是 OpenAPI 版本 |
| `terms_of_service` | `str` | 服务条款 URL，若提供必须是 URL |
| `contact` | `dict` | 联系信息：`name`、`url`（URL 格式）、`email`（邮箱格式） |
| `license_info` | `dict` | 许可证信息：`name`（必填）、`url` 或 `identifier`（二者互斥） |

```python
from fastapi import FastAPI

description = """
ChimichangApp API helps you do awesome stuff. 🚀

## Items

You can **read items**.

## Users

You will be able to:

* **Create users** (_not implemented_).
* **Read users** (_not implemented_).
"""

app = FastAPI(
    title="ChimichangApp",
    description=description,
    summary="Deadpool's favorite app. Nuff said.",
    version="0.0.1",
    terms_of_service="http://example.com/terms/",
    contact={
        "name": "Deadpoolio the Amazing",
        "url": "http://x-force.example.com/contact/",
        "email": "dp@x-force.example.com",
    },
    license_info={
        "name": "Apache 2.0",
        "url": "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
)

@app.get("/items/")
async def read_items():
    return [{"name": "Katana"}]
```

`description` 中的 Markdown（标题、粗体、斜体、列表）会在文档 UI 中渲染。

### 2. 许可证标识符 `identifier`

OpenAPI 3.1.0 / FastAPI 0.99.0 起，可在 `license_info` 中用 `identifier`（SPDX 许可证表达式）代替 `url`，二者互斥：

```python
app = FastAPI(
    title="ChimichangApp",
    license_info={
        "name": "Apache 2.0",
        "identifier": "Apache-2.0",
    },
)
```

### 3. 标签元数据 `openapi_tags`

用 `openapi_tags` 给标签附加元数据。它接收一个列表，每个字典可包含：

| 键 | 是否必填 | 说明 |
|---|---|---|
| `name` | 必填 | 与路径操作/`APIRouter` 的 `tags` 参数中的标签名一致 |
| `description` | 可选 | 标签描述，**支持 Markdown** |
| `externalDocs` | 可选 | 外部文档：`description` + `url`（必填） |

```python
from fastapi import FastAPI

tags_metadata = [
    {
        "name": "users",
        "description": "Operations with users. The **login** logic is also here.",
    },
    {
        "name": "items",
        "description": "Manage items. So _fancy_ they have their own docs.",
        "externalDocs": {
            "description": "Items external docs",
            "url": "https://fastapi.tiangolo.com/",
        },
    },
]

app = FastAPI(openapi_tags=tags_metadata)

@app.get("/users/", tags=["users"])
async def get_users():
    return [{"name": "Harry"}, {"name": "Ron"}]

@app.get("/items/", tags=["items"])
async def get_items():
    return [{"name": "wand"}, {"name": "flying broom"}]
```

要点：

- 不必为所有用过的标签都添加元数据。
- 标签通过路径操作（或 `APIRouter`）的 `tags=["users"]` 使用。
- **标签元数据字典的顺序决定文档 UI 中的显示顺序**（即使按字母序 users 在 items 之后，只要 users 的元数据排在列表第一位，它就显示在前）。

### 4. OpenAPI URL：`openapi_url`

默认 OpenAPI 模式在 `/openapi.json`。用 `openapi_url` 修改：

```python
app = FastAPI(openapi_url="/api/v1/openapi.json")
```

设为 `openapi_url=None` 会**完全禁用** OpenAPI 模式，同时也会禁用依赖它的文档 UI。

### 5. 文档 URLs：`docs_url` / `redoc_url`

| 文档 | 默认路径 | 修改参数 | 禁用 |
|---|---|---|---|
| Swagger UI | `/docs` | `docs_url="/documentation"` | `docs_url=None` |
| ReDoc | `/redoc` | `redoc_url="/redoc2"` | `redoc_url=None` |

```python
app = FastAPI(docs_url="/documentation", redoc_url=None)
```

上例把 Swagger UI 改到 `/documentation`，并禁用 ReDoc。

### 6. 易错点

| 易错点 | 正确做法 |
|---|---|
| `version` 当成 OpenAPI 版本 | 它是**你的应用**版本 |
| `license_info` 同时写 `url` 和 `identifier` | 二者互斥，只能选一个 |
| 想隐藏文档却只设 `docs_url=None` | ReDoc 仍在；两个都要设。彻底关闭用 `openapi_url=None`（同时禁用两者） |
| 标签显示顺序不对 | 调整 `openapi_tags` 列表中字典的顺序 |
| `description` 里写纯文本没用 Markdown | 它支持 Markdown，会渲染 |

---

## 二、NestJS 对比

| 维度 | FastAPI（Python） | NestJS（TypeScript） |
|---|---|---|
| 元数据配置位置 | 创建应用时 `FastAPI(title=..., version=..., description=...)` | `DocumentBuilder` 的 `.setTitle()/.setVersion()/.setDescription()/.addTag()` |
| 文档生成 | 内置，默认挂载 `/docs` `/redoc`，零依赖 | 需安装 `@nestjs/swagger`，`SwaggerModule.createDocument()` + `setup()` 手动挂载 |
| 标签描述 | `openapi_tags=[{"name":..., "description":..., "externalDocs":...}]` | `@ApiTags()` + `DocumentBuilder.addTag()` / `@ApiExcludeEndpoint()` 等 |
| 标签顺序 | 由 `openapi_tags` 列表顺序决定 | 由 `addTag()` 调用顺序决定 |
| 文档 URL 配置 | `docs_url` / `redoc_url` 参数，设 `None` 禁用 | `SwaggerModule.setup('docs', app, document)` 第一个参数指定路径；无内置开关需自己不调用 |
| OpenAPI 模式 URL | `openapi_url` 参数；`None` 彻底禁用（含文档） | 默认由 `setup()` 路由提供 `/docs-json`，需自行改路径或禁用 |
| 描述中的 Markdown | `description` 字符串直接渲染 Markdown | `@ApiProperty({ description: '...' })`，需自己留意渲染支持 |

**核心差异一句话**：FastAPI 把元数据、标签与文档 URL 都收敛到 `FastAPI(...)` 构造函数的几个参数里，默认就有 `/docs` 和 `/redoc`；NestJS 的 Swagger 是独立模块，要通过 `DocumentBuilder` 与 `SwaggerModule.setup()` 显式构建和挂载，所有的开关都藏在调用链里。

---

## 三、针对性练习题

### 题 1（基础）
`FastAPI()` 构造函数中 `title`、`version`、`description`、`summary` 分别是什么含义？`description` 有什么特别之处？

<details>
<summary>参考答案</summary>

- `title`：API 标题。
- `version`：你自己的应用版本（如 `2.5.0`），不是 OpenAPI 规范版本。
- `description`：API 描述，**支持 Markdown**，会在自动文档 UI 中渲染。
- `summary`：API 简短摘要（OpenAPI 3.1.0 / FastAPI 0.99.0 起可用）。
</details>

### 题 2（理解）
`license_info` 中的 `url` 与 `identifier` 能否同时设置？如何指定 SPDX 许可证？

<details>
<summary>参考答案</summary>

不能，二者互斥。`identifier` 是 SPDX 许可证表达式（OpenAPI 3.1.0 / FastAPI 0.99.0 起支持），例如：

```python
app = FastAPI(license_info={"name": "Apache 2.0", "identifier": "Apache-2.0"})
```

若用 `url` 则填许可证 URL，如 Apache 2.0 的官方地址。
</details>

### 题 3（辨析/代码）
如何用 `openapi_tags` 让文档先显示 `users` 标签、再显示 `items`，并在 `items` 下加外部文档链接？写出代码并说明顺序由什么决定。

<details>
<summary>参考答案</summary>

```python
tags_metadata = [
    {"name": "users", "description": "Operations with users."},
    {
        "name": "items",
        "description": "Manage items.",
        "externalDocs": {
            "description": "Items external docs",
            "url": "https://fastapi.tiangolo.com/",
        },
    },
]
app = FastAPI(openapi_tags=tags_metadata)
```

顺序由 `openapi_tags` 列表中字典的排列顺序决定，与标签名字母序无关。每个标签通过路径操作的 `tags=["users"]` 关联；`externalDocs.url` 必填，`description` 可选。
</details>

### 题 4（进阶 · NestJS 迁移视角）
NestJS 中用 `SwaggerModule.setup('docs', ...)` 挂载文档。写出 FastAPI 中等价配置：Swagger UI 改到 `/documentation`，禁用 ReDoc。若还想彻底关闭 OpenAPI 模式（含文档），该怎么写？

<details>
<summary>参考答案</summary>

```python
from fastapi import FastAPI

app = FastAPI(docs_url="/documentation", redoc_url=None)
```

彻底关闭：

```python
app = FastAPI(openapi_url=None)
```

`openapi_url=None` 禁用 OpenAPI 模式，由于两套文档 UI 都依赖它，它们也一并不可用，无需再分别设置 `docs_url`/`redoc_url`。仅设 `docs_url=None` 只会关掉 Swagger UI，ReDoc 仍存在。
</details>

### 题 5（思考）
为什么把 `openapi_url` 设为 `None` 会同时让 `/docs` 和 `/redoc` 失效？

<details>
<summary>参考答案</summary>

因为 Swagger UI 和 ReDoc 都是基于同一份 OpenAPI 模式工作的，它们要向 `openapi_url` 指向的地址请求模式数据（`openapi.json`）才能渲染。禁用该模式后，文档 UI 没有数据来源，因此 FastAPI 直接把它们一并禁用，避免挂载出无法工作的空文档页面。
</details>
