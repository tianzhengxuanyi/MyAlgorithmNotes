# 40 · CORS（跨域资源共享）（CORS）

> 官方文档：<https://fastapi.tiangolo.com/zh/tutorial/cors/>
> 前置依赖：第 39 章「中间件」 · 难度：⭐⭐

---

## 一、章节笔记

### 1. 什么是 CORS

CORS（跨域资源共享）指：浏览器中运行的前端 JS 与**不同「源」**的后端通信的场景。

**源（Origin）**是协议、域、端口的组合。以下都是不同的源：

- `http://localhost`
- `https://localhost`
- `http://localhost:8080`

即便都在 `localhost`，协议或端口不同就是不同的源。

### 2. 浏览器中的作用机制

假设前端在 `http://localhost:8080`，JS 想请求 `http://localhost`（默认端口 80）的后端：

1. 浏览器先向 `:80` 后端发送一个 **`OPTIONS`** 请求（预检）；
2. 若后端返回适当的 CORS 头，授权来自 `http://localhost:8080` 的通信，浏览器才允许 `:8080` 前端向 `:80` 发真实请求；
3. 因此后端必须维护一个「允许的源」列表，且其中包含 `http://localhost:8080`。

### 3. 通配符的局限

可用 `"*"` 通配符表示允许所有源，但它**只覆盖部分通信类型**，不包括涉及**凭据**的内容：

- Cookies；
- 使用 Bearer 令牌的 `Authorization` 头等。

因此要让一切正常工作，最好**显式指定允许的源**。

### 4. 使用 `CORSMiddleware`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def main():
    return {"message": "Hello World"}
```

步骤：导入 `CORSMiddleware` → 创建允许源列表 → 作为中间件用 `app.add_middleware(...)` 加入。还可指定是否允许凭证、哪些方法、哪些请求头。

### 5. 参数一览

| 参数 | 说明 | 默认 |
|---|---|---|
| `allow_origins` | 允许的跨域源列表，如 `['https://example.org']`；`['*']` 允许任何源 | — |
| `allow_origin_regex` | 正则字符串，匹配的源被允许，如 `'https://.*\.example\.org'` | — |
| `allow_methods` | 允许的 HTTP 方法列表；`['*']` 允许所有标准方法 | `['GET']` |
| `allow_headers` | 允许的 HTTP 请求头列表；`['*']` 允许所有。`Accept`、`Accept-Language`、`Content-Language`、`Content-Type` 在简单请求中总是被允许 | `[]` |
| `allow_credentials` | 是否支持 cookies（凭据）；设为 `True` 时，`allow_origins`/`allow_methods`/`allow_headers` **都不能**为 `['*']`，必须显式指定 | `False` |
| `expose_headers` | 可被浏览器访问的响应头（中间件章提到的自定义头需放这里） | `[]` |
| `max_age` | 浏览器缓存 CORS 响应的最长时间（秒） | `600` |

> `CORSMiddleware` 的默认参数较为保守，必须显式启用所需的源、方法或头，浏览器才能在跨域上下文中使用它们。

### 6. 两种请求的处理

| 类型 | 说明 | 中间件行为 |
|---|---|---|
| **CORS 预检请求** | 带 `Origin` 和 `Access-Control-Request-Method` 头的 `OPTIONS` 请求 | 拦截并直接响应，返回带适当 CORS 头的 `200` 或 `400` |
| **简单请求** | 任何带 `Origin` 头的请求 | 照常传递给应用，但在响应中加入适当的 CORS 头 |

### 7. 易错点

- ✅ `allow_credentials=True` 时不能用通配符 `['*']`，三项都需显式列出。
- ✅ 涉及 Cookie / Bearer 令牌时通配符无效，必须显式源。
- ✅ 浏览器端要读的自定义响应头放进 `expose_headers`。
- ✅ 允许方法默认是 `['GET']`，POST/PUT 需显式加或用 `['*']`。
- ✅ `CORSMiddleware` 来自 Starlette，FastAPI 在 `fastapi.middleware.cors` 重导出以便使用。

---

## 二、NestJS 对比

| 维度 | FastAPI（Python） | NestJS（TypeScript） |
|---|---|---|
| 启用方式 | `app.add_middleware(CORSMiddleware, allow_origins=..., ...)` | `app.enableCors({ origin, methods, ... })` 或 `new NestApplication(...{ cors })` |
| 允许源 | `allow_origins` / `allow_origin_regex` | `origin`（字符串、数组、正则、函数） |
| 方法/头 | `allow_methods` / `allow_headers`（默认 GET / 空） | `methods` / `allowedHeaders` |
| 凭证 | `allow_credentials=True`（此时不能用 `*`） | `credentials: true`（与 `origin: '*'` 不兼容） |
| 暴露响应头 | `expose_headers` | `exposedHeaders` |
| 缓存时长 | `max_age`（默认 600 秒） | `maxAge` |
| 底层 | Starlette 的 `CORSMiddleware` | Express 的 `cors` 包（或 Fastify cors 插件） |

**核心差异一句话**：两者 CORS 配置本质相同（都是对底层 CORS 中间件的封装，参数一一对应），差异主要在启用入口——FastAPI 用 `app.add_middleware(CORSMiddleware, ...)` 添加 Starlette 中间件，NestJS 用 `app.enableCors(...)` 在应用启动层面开启。

---

## 三、针对性练习题

### 题 1（基础）
配置 FastAPI：只允许 `http://localhost:8080` 跨域，允许 GET/POST 方法和 `Authorization` 头，支持凭证。

<details>
<summary>参考答案</summary>

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization"],
    allow_credentials=True,
)
```

注意 `allow_credentials=True` 时，源/方法/头都必须是显式列表，不能用 `*`。
</details>

### 题 2（理解）
为什么 `http://localhost`、`https://localhost`、`http://localhost:8080` 是不同的源？

<details>
<summary>参考答案</summary>

「源」由协议、域、端口三者共同决定。这三个地址虽然域都是 `localhost`，但协议（http/https）或端口（80/8080）不同，因此是不同的源。浏览器据此判断请求是否跨域，并决定是否触发 CORS 校验。
</details>

### 题 3（辨析 / 代码）
某配置写成 `allow_origins=["*"], allow_credentials=True`，能正常支持前端携带 Cookie 和 Bearer 令牌吗？

<details>
<summary>参考答案</summary>

不能。文档明确：通配符 `*` 只覆盖部分通信类型，不包括涉及凭据的内容（Cookies、Bearer 令牌的 `Authorization` 头）。而且当 `allow_credentials=True` 时，`allow_origins`/`allow_methods`/`allow_headers` 都**不能**设为 `['*']`，必须显式指定。应改为列出具体源，如 `allow_origins=["http://localhost:8080"]`。
</details>

### 题 4（进阶 · NestJS 迁移视角）
NestJS 中你用 `app.enableCors({ origin: [...], credentials: true })`。请写出 FastAPI 等价配置，并说明两者关系。

<details>
<summary>参考答案</summary>

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://example.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT"],
    allow_headers=["*"],
)
```

关系：两者参数几乎一一对应——Nest 的 `origin/credentials/methods/allowedHeaders/exposedHeaders/maxAge` 对应 FastAPI 的 `allow_origins/allow_credentials/allow_methods/allow_headers/expose_headers/max_age`，底层都是 CORS 中间件。差异在启用方式：Nest 用 `app.enableCors()` 在启动层开启，FastAPI 用 `app.add_middleware(CORSMiddleware, ...)` 显式添加中间件。
</details>

### 题 5（思考）
预检（OPTIONS）请求与简单请求在 `CORSMiddleware` 中的处理有何不同？

<details>
<summary>参考答案</summary>

预检请求是带 `Origin` 和 `Access-Control-Request-Method` 头的 `OPTIONS` 请求，中间件会**直接拦截并响应**，返回带适当 CORS 头的 `200` 或 `400`，不再交给路由。简单请求是任何带 `Origin` 头的请求，中间件**照常传递给应用**，仅在最终响应里加入适当的 CORS 头。这样浏览器先通过预检确认允许，再发送真实请求。
</details>
