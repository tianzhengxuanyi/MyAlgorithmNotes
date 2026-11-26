# 37 · OAuth2 实现简单的 Password 和 Bearer 验证（OAuth2 with Password and Bearer）

> 官方文档：<https://fastapi.tiangolo.com/zh/tutorial/security/simple-oauth2/>
> 前置依赖：第 36 章「获取当前用户」、Pydantic、表单 · 难度：⭐⭐⭐

---

## 一、章节笔记

### 1. 本章目标

补上上一章缺失的部分——真正实现 `/token` 端点，让客户端用 `username` + `password` 换取令牌，从而构成**完整的安全流**。本章先用「假哈希、假令牌」演示流程，安全性留到下一章（JWT）实现。

### 2. 获取 `username` 和 `password` 的规范约束

OAuth2 规范要求 password 流程中：

- 客户端必须以**表单数据**（不是 JSON）发送 `username` 和 `password`；
- 字段名必须是 `username` 和 `password`，不能是 `user-name` / `email` 等；
- 前端展示名、数据库字段名可自定，但登录端点必须用规范名（以便与 API 文档集成）。

### 3. `scope` 字段

OAuth2 支持可选的 `scope` 表单字段：

- 名为 `scope`（单数），值实际是**空格分隔的长字符串**，每个 scope 是不含空格的字符串；
- 用于声明权限，如 `users:read`、`users:write`、`instagram_basic`、`https://www.googleapis.com/auth/drive`；
- 对 OAuth2 而言冒号、URL 等形式都只是字符串，具体含义是实现细节；
- `OAuth2PasswordRequestForm` 实例没有原样的 `scope` 字符串属性，但有 **`scopes` 属性**（已发送 scope 的字符串列表）。

### 4. `OAuth2PasswordRequestForm`

用 `Depends()` 把它作为类依赖注入 `/token`：

```python
from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel

fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "fakehashedsecret",
        "disabled": False,
    },
    "alice": {
        "username": "alice",
        "full_name": "Alice Wonderson",
        "email": "alice@example.com",
        "hashed_password": "fakehashedsecret2",
        "disabled": True,
    },
}

app = FastAPI()

def fake_hash_password(password: str):
    return "fakehashed" + password

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None

class UserInDB(User):
    hashed_password: str

def get_user(db, username: str):
    if username in db:
        return UserInDB(**db[username])

def fake_decode_token(token):
    # 不提供任何安全性 —— 仅演示
    return get_user(fake_users_db, token)

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    user = fake_decode_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

@app.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user_dict = fake_users_db.get(form_data.username)
    if not user_dict:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    user = UserInDB(**user_dict)
    hashed_password = fake_hash_password(form_data.password)
    if not hashed_password == user.hashed_password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    return {"access_token": user.username, "token_type": "bearer"}

@app.get("/users/me")
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user
```

它声明的表单字段：`username`、`password`、可选 `scope`（空格分隔长字符串）、可选 `grant_type`、可选 `client_id` / `client_secret`（本例未用）。

| 要点 | 说明 |
|---|---|
| `grant_type` | OAuth2 规范要求固定为 `password`，但 `OAuth2PasswordRequestForm` **不强制**；要强制则用 `OAuth2PasswordRequestFormStrict` |
| 类性质 | 它**不是**像 `OAuth2PasswordBearer` 那样的特殊安全类；只是方便起见提供的类依赖，也可自己用 `Form` 参数声明 |

### 5. 返回 Token

`/token` 响应必须是 JSON 对象，包含：

| 字段 | 说明 |
|---|---|
| `access_token` | 包含权限令牌的字符串（本例就是 `username`，**极不安全**） |
| `token_type` | Bearer 令牌应为 `bearer` |

> 文档强调：按规范返回带 `access_token` 和 `token_type` 的 JSON 是**开发者必须自己做**的事，且要确保键名正确——这几乎是唯一需要牢记并按规范执行的点。

### 6. 更新依赖项：激活用户检查

新增 `get_current_active_user`，基于 `get_current_user`：

- `get_current_user`：令牌解码失败/用户不存在 → 401 `Not authenticated`（带 `WWW-Authenticate: Bearer` 头）；
- `get_current_active_user`：`current_user.disabled` 为真 → 400 `Inactive user`；
- 端点注入 `get_current_active_user`，因此**只有用户存在、已认证、且激活**时才能拿到用户。

形成依赖链：`oauth2_scheme → get_current_user → get_current_active_user → read_users_me`。

### 7. 实际效果验证

| 操作 | 结果 |
|---|---|
| Authorize：`johndoe` / `secret` → `GET /users/me` | 返回用户数据（含 `hashed_password`） |
| 点小锁注销后 `GET /users/me` | 401 `{"detail": "Not authenticated"}` |
| Authorize：`alice` / `secret2`（disabled） → `GET /users/me` | 400 `{"detail": "Inactive user"}` |

### 8. 小结与局限

本章工具可搭建基于用户名密码的完整安全系统，兼容任何数据库/用户/数据模型。**唯一欠缺：仍不是真的安全**——`fake_hash_password` 只是字符串拼接，`fake_decode_token` 把令牌当作用户名，毫无防护。下一章用安全的密码哈希库与 JWT 令牌解决。

### 9. 易错点

- ✅ 登录表单必须用 `username`/`password` 字段名，且是 **form 数据**而非 JSON → 需 `python-multipart`。
- ✅ 用 `Depends()`（无参数）注入 `OAuth2PasswordRequestForm`。
- ✅ 想强制 `grant_type=password` 用 `OAuth2PasswordRequestFormStrict`。
- ✅ 令牌字段必须叫 `access_token` 和 `token_type=bearer`。
- ✅ 401 响应带 `WWW-Authenticate: Bearer` 头才规范。

---

## 二、NestJS 对比

| 维度 | FastAPI（Python） | NestJS（TypeScript） |
|---|---|---|
| 登录表单提取 | `OAuth2PasswordRequestForm` 类依赖，`Depends()` 注入 | DTO 类 + `@Body()` + `class-validator`，或 `passport-local` 策略 |
| 表单字段名 | 规范强制 `username`/`password`（`grant_type` 不强制，Strict 版强制） | 字段名自定义，无 OAuth2 命名约束 |
| tokenUrl 声明 | `OAuth2PasswordBearer(tokenUrl="token")` 自动写入 OpenAPI | 需 `@ApiBearerAuth()` + Swagger 手动配置 |
| 令牌响应格式 | 手写 `{"access_token", "token_type": "bearer"}` | `signAsync()` 后自行 `res.send({ access_token })` |
| 401 / 激活检查 | `HTTPException(401, headers=WWW-Authenticate)` + 依赖链 | `UnauthorizedException` / `ForbiddenException` + Guard |
| 文档集成 | 表单结构自动进 OpenAPI | 需 `@ApiBody()` / DTO 装饰器补充 |
| 密码哈希 | 本章用假哈希，下一章用 passlib | 用 `bcrypt` / `argon2` |

**核心差异一句话**：FastAPI 用 `OAuth2PasswordRequestForm` 把 OAuth2 表单规范（含命名、scope、tokenUrl、Bearer 响应格式）内建进依赖系统并自动写入文档；NestJS 把这些拆成 DTO + class-validator + Passport 策略 + Swagger 装饰器，灵活性更高但要手工接线。

---

## 三、针对性练习题

### 题 1（基础）
写出 `/token` 端点：用 `OAuth2PasswordRequestForm` 接收表单，校验 `username`/`password` 后返回符合规范的 token JSON。

<details>
<summary>参考答案</summary>

```python
from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
fake_users_db = {"johndoe": {"username": "johndoe", "hashed_password": "fakehashedsecret"}}

@app.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user_dict = fake_users_db.get(form_data.username)
    if not user_dict:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    if "fakehashed" + form_data.password != user_dict["hashed_password"]:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    return {"access_token": form_data.username, "token_type": "bearer"}
```

必须返回 `access_token` 与 `token_type=bearer` 的 JSON。
</details>

### 题 2（理解）
为什么登录端点必须用 `username`/`password` 这样的字段名并用表单数据，而不是 JSON？

<details>
<summary>参考答案</summary>

这是 OAuth2 规范对 password 流程的要求，用固定字段名与表单数据（非 JSON）能让客户端与 API 文档/工具按标准自动对接。前端展示名和数据库字段名可自定，但登录端点需兼容规范。FastAPI 提供 `OAuth2PasswordRequestForm` 让这一切与 OpenAPI 文档自动集成。
</details>

### 题 3（辨析 / 代码）
`OAuth2PasswordBearer` 与 `OAuth2PasswordRequestForm` 都是安全工具吗？有何区别？

<details>
<summary>参考答案</summary>

不同。`OAuth2PasswordBearer` 是 FastAPI 识别的**安全方案**，会被写入 OpenAPI、提供 Bearer 令牌提取并在缺失时返回 401；`OAuth2PasswordRequestForm` **不是**特殊安全类，只是一个方便的类依赖，用于声明 `username`/`password`/`scope`/`grant_type` 等表单字段，也可自己用 `Form` 参数实现。FastAPI 只是为这个常见用例提供了现成支持。
</details>

### 题 4（进阶 · NestJS 迁移视角）
NestJS 中你用 DTO + class-validator 接收登录表单并用 Passport local 策略校验。请写出 FastAPI 等价实现，并说明 `grant_type` 强制方式的差异。

<details>
<summary>参考答案</summary>

```python
from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import OAuth2PasswordRequestFormStrict

app = FastAPI()

@app.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestFormStrict, Depends()]):
    # form_data.grant_type 已被强制为 "password"
    return {"access_token": form_data.username, "token_type": "bearer"}
```

差异：`OAuth2PasswordRequestForm` 不强制 `grant_type=password`，要强制需换 `OAuth2PasswordRequestFormStrict`；NestJS 的 DTO 用 `@IsIn(['password'])` 等装饰器自行约束，没有这两者之分。
</details>

### 题 5（思考）
文档说本章「仍不是真的安全」，具体有哪些不安全之处？应如何改进？

<details>
<summary>参考答案</summary>

两处：① `fake_hash_password` 只是 `"fakehashed" + password` 的字符串拼接，不是真正的密码哈希，且未加盐；② `fake_decode_token` 直接把令牌当用户名，任何人都能伪造任意用户的令牌。改进：用 `passlib[bcrypt]` 等安全哈希库存储/校验密码，用带签名和过期时间的 JWT 令牌（下一章用 `python-jose` 实现），并校验令牌签名与有效期。
</details>
