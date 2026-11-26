# 38 · OAuth2 基于 JWT 的 Bearer 令牌（OAuth2 with JWT）

> 官方文档：<https://fastapi.tiangolo.com/zh/tutorial/security/oauth2-jwt/>
> 前置依赖：第 37 章「简单 Password 和 Bearer 验证」 · 难度：⭐⭐⭐

---

## 一、章节笔记

### 1. 本章目标

在上一章完整安全流的基础上，用 **JWT 令牌**和**安全密码哈希**让应用真正安全。代码可直接用于生产（把哈希保存到数据库等）。本章从上一章结束处继续逐步完善。

### 2. 关于 JWT

**JWT = JSON Web Tokens**：一种把 JSON 对象编码成密集、无空格长字符串的标准，形如：

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIi...
```

- **不是加密**：任何人都能从内容恢复信息；
- **但被签名**：收到自己签发的令牌时可验证它确实由自己签发；
- 可设有效期（如 1 周）：用户带令牌回来可确认仍在登录态；过期需重新登录；
- 若有人篡改令牌（如改过期时间），签名会不匹配而被发现。

可在 <https://jwt.io> 动手体验。

### 3. 安装依赖

| 包 | 命令 | 用途 |
|---|---|---|
| PyJWT | `uv add pyjwt` | 生成与校验 JWT；若用 RSA/ECDSA 签名需 `pyjwt[crypto]` |
| pwdlib | `uv add "pwdlib[argon2]"` | 密码哈希，推荐算法 **Argon2** |

> pwdlib 还能配置为读取 Django / Flask 等工具生成的密码，便于共享数据库或渐进迁移；也支持 bcrypt，但不含遗留算法（遗留哈希建议用 passlib）。

### 4. 密码哈希

「哈希」把密码转换成看似乱码的字节串：相同密码总得到相同哈希，但**无法反向还原**密码。数据库被盗时窃贼拿不到明文密码，无法拿去登录其他系统（很多人各处用同一密码，非常危险）。

### 5. 核心配置与模型

```python
from datetime import UTC, datetime, timedelta
from typing import Annotated
import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from pydantic import BaseModel

# openssl rand -hex 32 生成，切勿用示例值
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None

class UserInDB(User):
    hashed_password: str
```

- `SECRET_KEY`：用 `openssl rand -hex 32` 生成并替换示例值；
- `ALGORITHM`：签名算法 `"HS256"`；
- `ACCESS_TOKEN_EXPIRE_MINUTES`：令牌过期时间（30 分钟）。

### 6. 哈希工具与用户认证

```python
password_hash = PasswordHash.recommended()
DUMMY_HASH = password_hash.hash("dummypassword")

def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)

def get_password_hash(password):
    return password_hash.hash(password)

def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        verify_password(password, DUMMY_HASH)  # 抗时序攻击
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user
```

> 用户不存在时也校验一个 `DUMMY_HASH`，让两种失败路径耗时相近，缓解**时序攻击**（timing attack）。

### 7. 创建 JWT 访问令牌

```python
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
```

`exp`（过期时间）由 JWT 标准规定，PyJWT 解码时会自动校验它。

### 8. 更新依赖：`get_current_user` 解码 JWT

```python
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user(fake_users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user
```

要点：`jwt.decode` 校验签名与过期时间；`sub` 是 JWT 标准中的「subject」，这里放用户名；任何无效令牌（`InvalidTokenError`）或找不到用户都返回 401 并带 `WWW-Authenticate: Bearer` 头。

### 9. 更新 `/token` 与受保护端点

```python
@app.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

@app.get("/users/me/")
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
) -> User:
    return current_user
```

依赖链：`oauth2_scheme → get_current_user → get_current_active_user → 端点`。

### 10. 验证与观察

- 在 `/docs` 用 `johndoe` / `secret` 授权，调用 `/users/me/` 得到用户信息；
- **代码中没有任何明文 `secret`，只有它的哈希版本**；
- 打开开发者工具可见后续请求只发送令牌（`Authorization: Bearer ...`），密码只在第一次换令牌时发送。

### 11. `scopes` 高级用法

OAuth2 的 scopes 可为 JWT 令牌附加一组权限，把令牌交给用户/第三方，在限制条件下访问 API。具体用法见高级用户指南。

### 12. 小结

FastAPI 用标准（OAuth2、JWT）搭建安全应用，**不在数据库、数据模型或工具上做妥协**，给予完全灵活性；可直接使用 `pwdlib`、`PyJWT` 等维护良好的包，在简化流程的同时不牺牲灵活性、健壮性与安全性。

### 13. 易错点清单

- ✅ `SECRET_KEY` 必须用 `openssl rand -hex 32` 自己生成，不要用示例值。
- ✅ JWT 是**签名而非加密**——不要把敏感信息放令牌里。
- ✅ 密码存 Argon2 哈希，绝不存明文；用户不存在时也校验 DUMMY_HASH 抗时序攻击。
- ✅ `exp` 用 UTC 时间（`datetime.now(UTC)`），PyJWT 自动校验过期。
- ✅ 401 响应带 `WWW-Authenticate: Bearer` 头。
- ✅ `sub` 放用户名，解码后仍需查库确认用户存在。

---

## 二、NestJS 对比

| 维度 | FastAPI（Python） | NestJS（TypeScript） |
|---|---|---|
| JWT 签发/校验 | PyJWT：`jwt.encode` / `jwt.decode` 手写工具函数 | `@nestjs/jwt` 的 `JwtService.signAsync` / `verifyAsync` |
| 密钥配置 | `SECRET_KEY` + `ALGORITHM = "HS256"` 常量 | `JwtModule.register({ secret, signOptions })` 配置 |
| 密码哈希 | `pwdlib` 的 `PasswordHash.recommended()`（Argon2） | `bcrypt` / `argon2` 包，或 `pwdlib` 类似的 `@node-rs/argon2` |
| 认证守卫 | 依赖链 `get_current_user` / `get_current_active_user` | `AuthGuard('jwt')` + Passport JWT Strategy 的 `validate()` |
| 当前用户 | `Annotated[User, Depends(get_current_user)]` 注入 | `@CurrentUser()` 自定义装饰器从 `request.user` 取 |
| 过期校验 | PyJWT 依据 `exp` 自动校验 | `JwtService.verify` / Strategy 校验 `exp` |
| 时序攻击防护 | 手动对 `DUMMY_HASH` 校验 | 需自行实现（如 bcrypt 对比 dummy hash） |
| 灵活性 | 无框架绑定，任意数据库/模型/包直接用 | 同样灵活，但需按 Nest 模块/Passport 约定接线 |

**核心差异一句话**：FastAPI 把 JWT 的签发、解码、密码哈希当作普通函数写，用依赖链串起认证逻辑，不绑定任何包或 ORM；NestJS 用 `@nestjs/jwt` + Passport Strategy/Guard 的约定式分层，配置更结构化，但自定义细节（如抗时序攻击）仍需手写。

---

## 三、针对性练习题

### 题 1（基础）
写出 `create_access_token` 函数：接收 `data` 字典和可选 `expires_delta`，加入 UTC 的 `exp` 声明并用 PyJWT 以 HS256 签名。

<details>
<summary>参考答案</summary>

```python
from datetime import UTC, datetime, timedelta
import jwt

SECRET_KEY = "your-own-generated-secret"
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.now(UTC) + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
```

`exp` 用 UTC，PyJWT 解码时会自动校验过期。
</details>

### 题 2（理解）
JWT 是「加密」的吗？为什么篡改令牌（如改过期时间）会被发现？

<details>
<summary>参考答案</summary>

不是加密，是签名。JWT 只是把 JSON 编码成密集字符串，任何人都能读出内容，所以不能放敏感信息。但令牌由 `SECRET_KEY` 签名，接收时用同一密钥与算法校验签名；若有人修改载荷（如 `exp`），签名将不匹配，`jwt.decode` 抛 `InvalidTokenError`，从而被发现并拒绝。
</details>

### 题 3（辨析 / 代码）
下面的 `authenticate_user` 里，为什么用户不存在时还要 `verify_password(password, DUMMY_HASH)`？

```python
def authenticate_user(fake_db, username, password):
    user = get_user(fake_db, username)
    if not user:
        verify_password(password, DUMMY_HASH)
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user
```

<details>
<summary>参考答案</summary>

为了缓解**时序攻击**。若用户不存在就立即返回，攻击者可通过响应时间差异判断用户名是否存在。对不存在的用户也执行一次（耗时的）哈希校验，使「用户不存在」与「密码错误」两条失败路径耗时相近，避免泄露用户信息。
</details>

### 题 4（进阶 · NestJS 迁移视角）
NestJS 里用 `JwtService.signAsync` + `AuthGuard('jwt')` 实现认证。请用 FastAPI 写出等价的「签发 + 解码校验」核心逻辑，并说明配置差异。

<details>
<summary>参考答案</summary>

```python
from datetime import UTC, datetime, timedelta
from typing import Annotated
import jwt
from jwt.exceptions import InvalidTokenError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

SECRET_KEY = "your-secret"
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict):
    return jwt.encode({**data, "exp": datetime.now(UTC) + timedelta(minutes=30)},
                      SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    exc = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Could not validate credentials",
                        headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise exc
    except InvalidTokenError:
        raise exc
    return {"username": username}
```

差异：FastAPI 把签发/解码写成普通函数，靠 `Depends` 串成依赖链，密钥与算法是模块常量；NestJS 通过 `JwtModule.register({ secret, signOptions })` 注入 `JwtService`，认证由 Passport Strategy + Guard 分层处理，需按框架约定装配。
</details>

### 题 5（思考）
为什么说 FastAPI「不在数据库、数据模型或工具上做妥协」？结合本章使用的包说明其意义。

<details>
<summary>参考答案</summary>

许多安全框架为了简化流程会强制绑定特定 ORM、数据模型或用户结构，甚至底层有隐患。FastAPI 只规定标准（OAuth2/JWT）与依赖接口，密码哈希用独立的 `pwdlib`（Argon2）、令牌用独立的 `PyJWT`，你可自由换数据库、自定义 `User` 模型（用 `id`/`email` 代替 `username`）、甚至让机器人作为主体。因为依赖注入不要求复杂集成机制，这些维护良好、广泛使用的包能直接拿来用，既简化流程又不牺牲灵活性、健壮性与安全性。
</details>
