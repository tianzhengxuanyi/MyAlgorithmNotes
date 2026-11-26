# 14 · Header 参数（Header Params）

> 官方文档：<https://fastapi.tiangolo.com/zh/tutorial/header-params/>
> 前置依赖：路径参数 / 查询参数 / Cookie 参数基础 · 难度：⭐

---

## 一、章节笔记

### 1. 本章要解决什么问题

HTTP 请求头（Header）是携带元数据（如 `User-Agent`、`X-Token`、`Authorization`）的标准位置。本章学习如何用 `Header` 从请求头中读取参数 —— 声明方式与 `Query`、`Path`、`Cookie` **完全一致**，只是换了一个函数。

### 2. 导入并声明 Header 参数

```python
from typing import Annotated

from fastapi import FastAPI, Header

app = FastAPI()

@app.get("/items/")
async def read_items(user_agent: Annotated[str | None, Header()] = None):
    return {"User-Agent": user_agent}
```

要点：

- 必须从 `fastapi` 导入 `Header`，并在类型注解中用 `Annotated[..., Header()]` 标记。
- 第一个值是**默认值**（此处为 `None`），还可以传入所有校验参数/注释参数（如 `min_length`、`description` 等）。
- 推荐 `Annotated` 写法；非 `Annotated` 写法等价：`user_agent: str | None = Header(default=None)`。

> ⚠️ **必须用 `Header` 声明**，否则该参数会被解释为**查询参数**（Query）。
>
> 技术细节：`Header` 是 `Path`、`Query`、`Cookie` 的兄弟类，都继承自共用的 `Param` 类；从 `fastapi` 导入的 `Query`、`Path`、`Header` 等实际上是**返回特殊类的函数**。

### 3. 自动转换：下划线 → 连字符

`Header` 比其它参数类多了一层智能转换：

- 标准请求头多用**连字符**分隔，如 `user-agent`，但 `user-agent` 在 Python 中不是合法变量名。
- 默认地，`Header` 会把参数名中的**下划线 `_` 自动转换为连字符 `-`** 去提取请求头。
- HTTP 请求头**不区分大小写**，因此可直接用 Python 的 `snake_case` 风格声明，无需写成 `User_Agent` 这种形式。

因此 `user_agent` 能正确匹配 `User-Agent` 请求头。

如需**禁用**该转换，把 `convert_underscores` 设为 `False`：

```python
from typing import Annotated

from fastapi import FastAPI, Header

app = FastAPI()

@app.get("/items/")
async def read_items(
    strange_header: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    return {"strange_header": strange_header}
```

> ⚠️ 谨慎使用 `convert_underscores=False`：某些 HTTP 代理和服务器**不支持带下划线的请求头**。

### 4. 重复的请求头（list）

同一个请求头出现多次时，用 `list` 类型声明即可接收**所有值**：

```python
from typing import Annotated

from fastapi import FastAPI, Header

app = FastAPI()

@app.get("/items/")
async def read_items(x_token: Annotated[list[str] | None, Header()] = None):
    return {"X-Token values": x_token}
```

客户端发送两个请求头：

```
X-Token: foo
X-Token: bar
```

响应结果：

```json
{
    "X-Token values": [
        "bar",
        "foo"
    ]
}
```

### 5. 参数声明方式对照表

| 场景 | 推荐写法（Annotated） | 非 Annotated 写法 |
|---|---|---|
| 读取 Header | `h: Annotated[str | None, Header()] = None` | `h: str | None = Header(default=None)` |
| 禁用下划线转换 | `h: Annotated[str | None, Header(convert_underscores=False)] = None` | `h: str | None = Header(default=None, convert_underscores=False)` |
| 重复请求头 | `h: Annotated[list[str] | None, Header()] = None` | `h: list[str] | None = Header(default=None)` |

### 6. 易错点小结

- ✅ 忘记写 `Header()` → 参数被当作 Query，从 URL 查询串取值而非请求头。
- ✅ 直接写 `user-agent` 会语法错误 → 用 `user_agent`，FastAPI 自动转连字符。
- ✅ 大小写无需关心 → HTTP 头不区分大小写，`user_agent` 即可匹配 `User-Agent`。
- ✅ 多个同名头必须用 `list[...]`，否则只能取到其中一个。

---

## 二、NestJS 对比

| 维度 | FastAPI（Python） | NestJS（TypeScript） |
|---|---|---|
| 读取全部请求头 | 参数注解 `Annotated[..., Header()]`，框架按名逐个提取 | 参数装饰器 `@Headers()` 注入 `req.headers` 对象；`@Headers('x-token')` 取单个 |
| 单个请求头指定 | 参数名即头名，`user_agent` 自动匹配 `User-Agent` | `@Headers('user-agent') userAgent: string` 显式给出头名 |
| 下划线/连字符转换 | 内置：下划线 `_` 自动转连字符 `-`，可用 `convert_underscores=False` 关闭 | 无自动转换，头名按原样（小写）从 `req.headers` 取值 |
| 下划线转换代价 | HTTP 层仍用连字符，`convert_underscores=False` 可能被代理拒绝 | 不涉及转换，但 TS 变量命名与头名需手动映射 |
| 重复请求头 | `list[str]` 类型声明即可收集所有值 | `req.headers['x-token']` 返回 `string | string[]`，需手动归一化 |
| 大小写处理 | HTTP 头不区分大小写，框架内部统一处理 | Node/Express 将头名规范化为小写，需按小写键访问 |
| 校验与元数据 | 直接复用 Pydantic/函数参数校验（`Annotated[..., Header(min_length=...)]`） | 需自定义 Pipe 或结合 DTO + `class-validator` 对 `@Headers()` 值校验 |
| 设置响应头 | 通过 `Response` 对象 `response.headers["X-Token"] = ...` | `@Header('X-Token', 'value')` 装饰器，或 `@Res()` 直接操作 |
| 声明位置 | 单个函数参数，无额外类 | 控制器方法参数，属于类结构的一部分 |

**核心差异一句话**：FastAPI 把每个请求头当作普通函数参数，靠 `Annotated[..., Header()]` 标记并自动完成「下划线→连字符」的映射；NestJS 用 `@Headers()` 把整个头对象（或某个键）注入到方法参数，头名与 TS 变量名的映射完全由开发者显式书写，校验则要额外借助 Pipe/DTO。

---

## 三、针对性练习题

### 题 1（基础）

写出一个 FastAPI 端点 `GET /items/`，读取 `User-Agent` 请求头并以 `{"user-agent": ...}` 返回；当请求头缺失时返回 `None`。

<details>
<summary>参考答案</summary>

```python
from typing import Annotated
from fastapi import FastAPI, Header

app = FastAPI()

@app.get("/items/")
async def read_items(user_agent: Annotated[str | None, Header()] = None):
    return {"user-agent": user_agent}
```

`user_agent` 用 `str | None` + 默认值 `None` 表示可选；FastAPI 自动把 Python 变量名 `user_agent` 映射为请求头 `User-Agent`。
</details>

### 题 2（理解）

为什么 `user_agent` 能读到 `User-Agent` 请求头？如果把参数写成 `user-agent` 会怎样？HTTP 头大小写需要担心吗？

<details>
<summary>参考答案</summary>

- `Header` 默认把参数名中的下划线 `_` 转成连字符 `-`，因此 `user_agent` → `user-agent` 去匹配请求头。
- `user-agent` 含连字符，不是合法的 Python 标识符，会直接导致语法错误。
- 不需要担心大小写：HTTP 请求头不区分大小写，`user_agent`、`User_Agent` 都能匹配 `User-Agent`；推荐用 Python 标准的 `snake_case`。
</details>

### 题 3（辨析/代码）

下面代码想读取一个名为 `strange_header` 的请求头（含下划线，不做转换）。请指出关键参数，并说明客户端应如何发送该头。

```python
@app.get("/items/")
async def read_items(strange_header: str | None = Header(default=None, convert_underscores=False)):
    return {"strange_header": strange_header}
```

<details>
<summary>参考答案</summary>

关键是 `convert_underscores=False`：禁用下划线自动转连字符，因此 FastAPI 期望的请求头名**就是** `strange_header`（含下划线），客户端应发送：

```
strange_header: some-value
```

若不加该参数，FastAPI 会去找 `strange-header`。注意：带下划线的请求头可能被某些 HTTP 代理/服务器拒绝，生产环境应谨慎使用。
</details>

### 题 4（进阶 · NestJS 迁移视角）

你在 NestJS 中这样读取请求头：

```ts
@Get('items')
readItems(@Headers('x-token') token: string) {
  return { token };
}
```

请写出功能等价的 FastAPI 代码，并说明两者在「头名映射」上的差异。

<details>
<summary>参考答案</summary>

```python
from typing import Annotated
from fastapi import FastAPI, Header

app = FastAPI()

@app.get("/items/")
async def read_items(x_token: Annotated[str | None, Header()] = None):
    return {"token": x_token}
```

映射差异：FastAPI 用 Python 变量名 `x_token`，靠 `Header` 把下划线自动转成连字符，隐式映射到 `X-Token`；NestJS 则在 `@Headers('x-token')` 里**显式写出**头名，变量名与头名无关，需要开发者自己保证一致。
</details>

### 题 5（思考）

客户端发送了两个 `X-Token` 头（`foo`、`bar`）。若端点把参数声明为 `x_token: str | None = Header(default=None)` 而非 `list[str]`，会发生什么？如何正确接收全部值？

<details>
<summary>参考答案</summary>

声明为 `str` 时 FastAPI 只取其中一个值（通常最后一个），另一个丢失。要接收全部值，须用列表类型：

```python
@app.get("/items/")
async def read_items(x_token: Annotated[list[str] | None, Header()] = None):
    return {"X-Token values": x_token}
```

此时两个头会被收集为 `["bar", "foo"]`（顺序依客户端发送而定）。这体现了类型注解在 FastAPI 中不只是文档，而是真正决定参数解析行为。
</details>
