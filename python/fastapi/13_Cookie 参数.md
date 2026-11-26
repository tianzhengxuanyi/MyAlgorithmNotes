# 13 · Cookie 参数（Cookie Params）

> 官方文档：<https://fastapi.tiangolo.com/zh/tutorial/cookie-params/>
> 前置依赖：03 查询参数、05 查询参数和字符串校验 · 难度：⭐

---

## 一、章节笔记

### 1. 什么是 Cookie 参数

Cookie 参数是从请求携带的 Cookie 中读取的数据。声明方式与 `Query`、`Path` **完全相同**。

### 2. 导入并声明 `Cookie`

```python
from typing import Annotated
from fastapi import Cookie, FastAPI

app = FastAPI()

@app.get("/items/")
async def read_items(ads_id: Annotated[str | None, Cookie()] = None):
    return {"ads_id": ads_id}
```

旧式写法（把 `Cookie` 当默认值）：

```python
from fastapi import Cookie, FastAPI

app = FastAPI()

@app.get("/items/")
async def read_items(ads_id: str | None = Cookie(default=None)):
    return {"ads_id": ads_id}
```

本例中 `ads_id` 是可选 Cookie，缺省时为 `None`。

### 3. 默认值与额外校验

声明 `Cookie` 参数时，可以定义默认值，以及**所有额外的校验或注解参数**（与 `Query`/`Path` 一致，如 `min_length`、`alias`、`title` 等）：

```python
from typing import Annotated
from fastapi import Cookie, FastAPI

app = FastAPI()

@app.get("/items/")
async def read_items(ads_id: Annotated[str | None, Cookie()] = None):
    return {"ads_id": ads_id}
```

### 4. 底层机制（技术细节）

- `Cookie`、`Path`、`Query` 是**兄弟类**，都继承自共用的 `Param` 类——所以三者共享同一套校验/元数据参数。
- 从 `fastapi` 导入的 `Query`、`Path`、`Cookie` 等对象，实际上是**函数**，调用时返回特殊类的实例（目的是避免编辑器误报类型错误）。

### 5. 两个重要注意点

**① 必须用 `Cookie` 声明，否则会被当作查询参数**

FastAPI 的参数识别规则中，单一类型且无特殊标注的参数默认是查询参数。不写 `Cookie()`，`ads_id` 就会从 `?ads_id=...` 读取，而不是从 Cookie 中读取。

**② 文档 UI 中无法真正发送 Cookie**

由于浏览器以特殊方式在幕后处理 Cookie，JavaScript 不会轻易访问它们。因此在 `/docs` 文档中：

- 可以看到路径操作里关于 Cookie 的说明；
- 但即使填写了值并点击 "Execute"，由于文档界面依赖 JavaScript，**Cookie 不会被发送**，你会看到一个仿佛没填任何值的错误消息。

要测试 Cookie 参数，需使用能设置请求头的 HTTP 客户端（如 curl、httpx 或带 Cookie 功能的 API 工具）。

### 6. 易错点小结

- ✅ Cookie 参数必须显式用 `Cookie()` 标注，否则被当作查询参数。
- ✅ 声明方式、校验参数与 `Query`/`Path` 一致。
- ✅ `/docs` 里能看到 Cookie 文档，但无法实际发送 Cookie（JS 限制），测试要用其他客户端。
- ✅ `Cookie` 与 `Query`/`Path` 同继承 `Param`，是兄弟类。

---

## 二、NestJS 对比

| 维度 | FastAPI（Python） | NestJS（TypeScript） |
|---|---|---|
| Cookie 取值 | 参数标注 `Cookie()`：`ads_id: Annotated[str | None, Cookie()] = None` | 参数装饰器 `@Cookies() cookie: any` 或 `@Cookie('ads_id') adsId: string` |
| 底层来源 | Starlette 解析请求 `Cookie` 头 | Express/Fastify 的 `req.headers.cookie`（或 `cookie-parser`） |
| 必填/可选 | 看默认值：`= None` 可选，无默认值必填 | DTO 字段 `@IsOptional()` 或 handler 默认值 |
| 校验元数据 | `Cookie(min_length=..., alias=...)` 与 `Query`/`Path` 共享参数 | 需先取出值，再用 `class-validator`/自定义 Pipe 校验 |
| 类继承关系 | `Cookie`/`Query`/`Path` 同为 `Param` 子类 | `@Cookie()` 是参数装饰器，无统一"参数类"继承体系 |
| 文档显示 | 自动进入 OpenAPI，`/docs` 可见 | 需 `@ApiCookie()`（`@nestjs/swagger`）声明 |
| 测试限制 | `/docs` 依赖 JS，无法发送 Cookie | Swagger UI 同样受浏览器 Cookie 限制 |

**核心差异一句话**：FastAPI 用 `Cookie()` 标注把 Cookie 参数纳入与 `Query`/`Path` 同一套 `Param` 体系，一处声明即完成取值、校验与文档；NestJS 用 `@Cookie()`/`@Cookies()` 装饰器显式取参，校验需另接 DTO/Pipe，二者在 `/docs` 中都遇到"浏览器 JS 无法发送 Cookie"的相同测试限制。

---

## 三、针对性练习题

### 题 1（基础）

写 `GET /items/`，从 Cookie 中读取可选参数 `ads_id: str`，缺省返回 `None`。

<details>
<summary>参考答案</summary>

```python
from typing import Annotated
from fastapi import Cookie, FastAPI

app = FastAPI()

@app.get("/items/")
async def read_items(ads_id: Annotated[str | None, Cookie()] = None):
    return {"ads_id": ads_id}
```

`= None` 使其可选；`Cookie()` 标明来源是请求 Cookie 而非查询字符串。
</details>

### 题 2（理解）

`ads_id: str | None = None` 与 `ads_id: Annotated[str | None, Cookie()] = None` 有什么本质区别？

<details>
<summary>参考答案</summary>

本质区别在于**参数来源**。前者没有任何来源标注，单一类型参数会被 FastAPI 当作**查询参数**，从 `?ads_id=...` 读取；后者用 `Cookie()` 显式标注，FastAPI 从请求携带的 Cookie 中读取 `ads_id`。两者都因 `= None` 而可选，但取值位置完全不同。
</details>

### 题 3（辨析/代码）

在 `/docs` 中填写 Cookie 值并点击 Execute，为什么拿不到 Cookie？这是 FastAPI 的 bug 吗？

<details>
<summary>参考答案</summary>

不是 bug。浏览器以特殊方式在幕后处理 Cookie，JavaScript 不会轻易访问它们；而 Swagger UI 文档界面依赖 JavaScript 工作，因此即使填写了 Cookie 值并点击 Execute，Cookie 也不会被发送，服务端看到的是"没有提供值"。要测试 Cookie 参数，应使用 curl、httpx 等能直接设置 Cookie 头的 HTTP 客户端。
</details>

### 题 4（进阶 · NestJS 迁移视角）

NestJS 中你这样读 Cookie：

```ts
@Get('items')
read(@Cookie('ads_id') adsId?: string) {
  return { ads_id: adsId };
}
```

请写出等价的 FastAPI 代码，并说明 NestJS 的 `@Cookie('ads_id')` 对应 FastAPI 的什么机制。

<details>
<summary>参考答案</summary>

```python
from typing import Annotated
from fastapi import Cookie, FastAPI

app = FastAPI()

@app.get("/items/")
async def read_items(ads_id: Annotated[str | None, Cookie()] = None):
    return {"ads_id": ads_id}
```

对应关系：NestJS 的 `@Cookie('ads_id')` 用装饰器显式指定"从 Cookie 中取名为 ads_id 的值"；FastAPI 用 `Annotated[..., Cookie()]` 标注参数来源，参数名 `ads_id` 即为 Cookie 键名。两者都支持可选性（NestJS 用 `?`，FastAPI 用 `= None`），但 FastAPI 的校验直接复用 `Param` 体系的参数。
</details>

### 题 5（思考）

为什么说 `Cookie` 与 `Query`、`Path` 是"兄弟类"？这一关系带来了什么实际好处？

<details>
<summary>参考答案</summary>

因为 `Cookie`、`Path`、`Query` 都继承自共用的 `Param` 类，处于同一继承层级，因此是兄弟类。实际好处是：三者共享同一批校验与元数据参数（如 `min_length`、`alias`、`title` 等），声明方式完全一致——学会 `Query` 的用法就能直接用到 `Cookie` 和 `Path` 上，无需为每种参数来源重新学习一套 API。另外，从 `fastapi` 导入的这些名字实际上是函数，调用时返回对应特殊类的实例，以避免编辑器误报类型错误。
</details>
