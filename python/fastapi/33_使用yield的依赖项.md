# 33 · 使用 yield 的依赖项（Dependencies with yield）

> 官方文档：<https://fastapi.tiangolo.com/zh/tutorial/dependencies/dependencies-with-yield/>
> 前置依赖：第 28～32 章依赖注入体系 · 难度：⭐⭐⭐

---

## 一、章节笔记

### 1. 核心思想

FastAPI 支持在依赖完成后执行**额外步骤**（退出/清理逻辑）。做法是用 `yield` 代替 `return`，并把清理代码写在 `yield` 之后。

> 技术细节：任何能配合 `@contextlib.contextmanager` 或 `@contextlib.asynccontextmanager` 的函数都能作为 FastAPI 依赖——FastAPI 内部正是用这两个装饰器实现的。

> 硬性要求：**每个依赖里只使用一次 `yield`**。

### 2. 典型模式：数据库会话

```python
async def get_db():
    db = DBSession()
    try:
        yield db
    finally:
        db.close()
```

三段时机：

| 阶段 | 代码位置 | 时机 |
|---|---|---|
| 设置 | `db = DBSession()` | 创建资源 |
| 注入 | `yield db` | 值注入到路径操作/其他依赖；**响应创建前**只执行到 `yield` |
| 清理 | `finally: db.close()` | `yield` 之后的代码在**响应之后**执行 |

`yield` 产生的值像普通依赖返回值一样被注入。可用 `async` 或普通 `def`，FastAPI 都会正确处理。

### 3. 配合 `try` 接收异常

在带 `yield` 的依赖里用 `try`，可收到**使用该依赖期间**抛出的任何异常（可能来自其他依赖或路径操作，如事务回滚）。于是可用 `except SomeException` 捕获，用 `finally` 保证退出步骤一定执行：

```python
async def get_db():
    db = DBSession()
    try:
        yield db
    finally:
        db.close()
```

### 4. 带 `yield` 的子依赖与清理顺序

可声明任意大小/形状的依赖树，其中任意或全部依赖都能用 `yield`。FastAPI 保证每个 `yield` 依赖的**退出代码按正确顺序**运行。

```python
from typing import Annotated
from fastapi import Depends

async def dependency_a():
    dep_a = generate_dep_a()
    try:
        yield dep_a
    finally:
        dep_a.close()

async def dependency_b(dep_a: Annotated[DepA, Depends(dependency_a)]):
    dep_b = generate_dep_b()
    try:
        yield dep_b
    finally:
        dep_b.close(dep_a)

async def dependency_c(dep_b: Annotated[DepB, Depends(dependency_b)]):
    dep_c = generate_dep_c()
    try:
        yield dep_c
    finally:
        dep_c.close(dep_b)
```

`dependency_c` 执行退出代码时需要 `dep_b` 仍可用，`dependency_b` 又需要 `dep_a`——FastAPI 保证依赖先于其子依赖完成退出，值的生命周期覆盖需求。可混用 `yield` 与 `return`、任意组合，框架保证顺序（底层靠 Python 上下文管理器）。

### 5. `yield` 与 `HTTPException`

可在带 `yield` 的依赖中用 `except` 捕获异常并转成不同的异常，例如 `HTTPException`：

```python
from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException

app = FastAPI()

data = {
    "plumbus": {"description": "Freshly pickled plumbus", "owner": "Morty"},
    "portal-gun": {"description": "Gun to create portals", "owner": "Rick"},
}

class OwnerError(Exception):
    pass

def get_username():
    try:
        yield "Rick"
    except OwnerError as e:
        raise HTTPException(status_code=400, detail=f"Owner error: {e}")

@app.get("/items/{item_id}")
def get_item(item_id: str, username: Annotated[str, Depends(get_username)]):
    if item_id not in data:
        raise HTTPException(status_code=404, detail="Item not found")
    item = data[item_id]
    if item["owner"] != username:
        raise OwnerError(username)
    return item
```

> 这是较高级技巧，多数情况只需在路径操作函数里抛异常即可。若要自定义响应，可创建自定义异常处理器。

### 6. 捕获异常后务必 `raise`

若 `except` 捕获了异常却**不重新抛出**，FastAPI 觉察不到异常（如同普通 Python 代码），客户端会收到 500，但服务端没有任何日志提示——异常被「吞掉」了：

```python
def get_username():
    try:
        yield "Rick"
    except InternalError:
        print("Oops, we didn't raise again 😱")  # 吞掉异常，危险
```

正确做法：重新抛出原异常或新异常。`raise` 单独使用可重抛当前异常：

```python
def get_username():
    try:
        yield "Rick"
    except InternalError:
        print("We don't swallow the internal error, we raise again 😎")
        raise
```

这样客户端仍是 500，但服务器日志会保留自定义 `InternalError`。

### 7. 执行时序

关键点：**只向客户端发送一次响应**（错误响应或路径操作响应二选一），响应发出后不能再改。带 `yield` 依赖的退出代码通常在响应发送**之后**执行。

```
client → dep(执行到 yield) → 路径操作 → 返回响应 → 后台任务 → dep 退出代码
```

路径操作函数里抛的异常（含 `HTTPException`）会传给带 `yield` 的依赖，多数情况下应重抛同一异常或新异常以确保正确处理。

### 8. 提前退出与 `scope`

带 `yield` 依赖的退出代码默认在响应发送后执行。若路径操作返回后不再需要该依赖，可用 `Depends(scope="function")` 让它在**路径操作函数返回后、响应发送前**关闭：

```python
from typing import Annotated
from fastapi import Depends, FastAPI

app = FastAPI()

def get_username():
    try:
        yield "Rick"
    finally:
        print("Cleanup before response is sent")

@app.get("/users/me")
def get_user_me(username: Annotated[str, Depends(get_username, scope="function")]):
    return username
```

`scope` 取值：

| 值 | 语义 |
|---|---|
| `"function"` | 依赖在路径操作函数前启动、函数结束后结束（**响应发送前**），围绕路径操作函数执行 |
| `"request"` | 依赖在路径操作函数前启动，在**响应发送给客户端之后**结束，围绕整个请求/响应周期 |

含 `yield` 的依赖若不指定，`scope` 默认为 `"request"`。

**子依赖的 scope 约束**：

- `scope="request"` 的依赖，其子依赖也必须是 `"request"`；
- `scope="function"` 的依赖，子依赖可为 `"function"` 或 `"request"`。

原因：依赖的退出代码可能需用到子依赖的值，必须在子依赖之前能访问它们（`function` 依赖在 `request` 依赖之前结束）。

### 9. 上下文管理器

「上下文管理器」是可在 `with` 语句中使用的对象，保证代码块结束时关闭资源（即使发生异常）：

```python
with open("./somefile.txt") as f:
    contents = f.read()
```

创建方式：① 实现 `__enter__()` / `__exit__()` 的类；② 用 `@contextlib.contextmanager` / `@contextlib.asynccontextmanager` 装饰含单个 `yield` 的函数（FastAPI 内部即用此法）。

在带 `yield` 的依赖中也可直接使用上下文管理器：

```python
class MySuperContextManager:
    def __init__(self):
        self.db = DBSession()

    def __enter__(self):
        return self.db

    def __exit__(self, exc_type, exc_value, traceback):
        self.db.close()

async def get_db():
    with MySuperContextManager() as db:
        yield db
```

> 但不必（也不应）为 FastAPI 依赖手动加 `@contextlib` 装饰器——FastAPI 会自动处理。

### 10. 易错点清单

- ✅ 每个依赖只 `yield` 一次。
- ✅ 清理代码放 `yield` 之后，通常用 `try/finally` 保证执行。
- ✅ `except` 后不 `raise` 会吞掉异常 → 500 且无日志；应重抛。
- ✅ 默认 `scope="request"`（清理在响应后）；用 `scope="function"` 提前到响应前清理。
- ✅ `request` 依赖的子依赖必须也是 `request`。
- ✅ 响应只发送一次，发送后不可更改。

---

## 二、NestJS 对比

| 维度 | FastAPI（Python） | NestJS（TypeScript） |
|---|---|---|
| 清理逻辑载体 | 依赖中用 `yield` + `try/finally`，值前后即生命周期 | Provider 实现 `OnModuleDestroy` / `OnApplicationShutdown`；请求级清理靠 `onModuleDestroy`/手动 |
| 请求级资源 | 依赖每次请求执行，`yield` 后清理（如 DB 会话） | `Scope.REQUEST` provider + `AsyncLocalStorage`，无内建「请求结束钩子」的等价简单语法 |
| 异常传递 | 路径操作异常可传回 `yield` 依赖，用 `except` 处理/重抛 | 异常经 Exception Filter 统一处理，Provider 一般不「接收」调用方异常 |
| 作用域控制 | `Depends(scope="function"|"request")` 显式控制清理时机 | Provider 作用域 `DEFAULT/REQUEST/TRANSIENT`，时机由生命周期钩子决定 |
| 上下文管理器 | 基于 Python `with` / `contextlib`，`yield` 依赖被转成上下文管理器 | 无原生对应；用 `try/finally` 或 RxJS `finalize`/`tap` 管理资源 |
| 清理顺序 | 框架保证依赖树退出代码逆序正确执行 | 由模块销毁顺序/RxJS 订阅释放决定，需自行设计 |
| 吞异常风险 | `except` 不 `raise` 会吞异常导致无日志 500 | 未捕获异常由 Nest 异常层处理，通常有日志 |

**核心差异一句话**：FastAPI 用「一个 `yield` 依赖 = 一段带进入/退出的上下文管理逻辑」把资源生命周期与请求精确绑定，异常可回流处理且能选 `function/request` 清理时机；NestJS 把资源释放交给 Provider 生命周期钩子或 RxJS 操作符，异常走 Exception Filter，没有「依赖函数内 `yield` 前后分界」这样直接的语法。

---

## 三、针对性练习题

### 题 1（基础）
写一个带 `yield` 的依赖 `get_conn()`，创建假连接对象（含 `close()` 方法），在 `yield` 后打印并关闭，并在 `GET /ping/` 中使用它。

<details>
<summary>参考答案</summary>

```python
from typing import Annotated
from fastapi import Depends, FastAPI

app = FastAPI()

class Conn:
    def close(self): print("connection closed")

async def get_conn():
    conn = Conn()
    try:
        yield conn
    finally:
        print("cleanup after yield")
        conn.close()

@app.get("/ping/")
async def ping(conn: Annotated[Conn, Depends(get_conn)]):
    return {"ok": True}
```

`yield` 前的代码与路径操作在响应前执行；`finally` 中的清理在响应发送后执行。
</details>

### 题 2（理解）
为什么说「在带 `yield` 的依赖中 `except` 捕获异常后必须 `raise`」？直接吞掉会发生什么？

<details>
<summary>参考答案</summary>

若 `except` 捕获后不重新抛出，异常就像被普通 Python 代码吞掉一样，FastAPI 无法觉察。客户端会收到 HTTP 500，但服务器日志里没有任何关于该错误的提示，难以排查。应 `raise`（重抛原异常）或抛出一个新的 `HTTPException`，确保框架能正确处理并记录。
</details>

### 题 3（辨析 / 代码）
以下依赖的清理时机是什么？如何让它在响应发送前就执行清理？

```python
def dep():
    try:
        yield "x"
    finally:
        print("cleanup")
```

<details>
<summary>参考答案</summary>

未指定 `scope` 且含 `yield`，默认 `scope="request"`，清理代码在响应发送给客户端之后执行。若要提前到「路径操作函数返回后、响应发送前」，使用 `Depends(dep, scope="function")`，例如：`v: Annotated[str, Depends(dep, scope="function")]`。此时依赖围绕路径操作函数执行。
</details>

### 题 4（进阶 · NestJS 迁移视角）
NestJS 中你会用请求作用域 Provider 管理 DB 连接并在销毁时释放。请用 FastAPI 的 `yield` 依赖写出等价示例，并说明清理顺序保证。

<details>
<summary>参考答案</summary>

```python
from typing import Annotated
from fastapi import Depends, FastAPI

app = FastAPI()

async def get_db():
    db = DBSession()
    try:
        yield db
    finally:
        db.close()

@app.get("/items/")
async def read_items(db: Annotated[DBSession, Depends(get_db)]):
    return {"using": db}
```

差异：FastAPI 每次请求调用依赖、`yield` 前后即资源的建立与释放，框架保证依赖树的退出代码按正确顺序执行（依赖先于其子依赖完成清理，值仍可用）。NestJS 靠 `Scope.REQUEST` provider 加生命周期钩子或 RxJS `finalize` 释放，没有「`yield` 前后分界」这样内建的精确语法。
</details>

### 题 5（思考）
文档说「只会向客户端发送一次响应，响应发出后不能再更改」。结合 `yield` 依赖的执行时序，说明为什么在路径操作中抛异常与在 `yield` 依赖中抛异常最终只能产生一个响应。

<details>
<summary>参考答案</summary>

HTTP 请求-响应模型规定一次请求只能有一个响应。执行流程：请求到达 → 依赖执行到 `yield` → 路径操作执行；若路径操作抛异常，异常被传回带 `yield` 的依赖（可被捕获/重抛），最终交给异常处理器产生一个错误响应；若一切正常则产生正常响应。两条路径只会选其一发送给客户端。响应一旦发出（错误或正常），`yield` 之后的清理代码仍会运行，但那已属于请求收尾，无法再改变已发送的响应。
</details>
