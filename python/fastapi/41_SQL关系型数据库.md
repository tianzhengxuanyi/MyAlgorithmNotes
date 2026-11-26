# 41 · SQL（关系型）数据库（SQL Databases）

> 官方文档：<https://fastapi.tiangolo.com/zh/tutorial/sql-databases/>
> 前置依赖：Pydantic 模型、Depends 依赖注入 · 难度：⭐⭐⭐

---

## 一、章节笔记

### 1. 本章定位：FastAPI 不绑定任何数据库

FastAPI **不要求**使用 SQL（关系型）数据库，你可以用任意 SQL 或 NoSQL 数据库类库（ORM）。本章以 **SQLModel** 为例，它基于 **SQLAlchemy + Pydantic**，由 FastAPI 同一作者制作，专为 FastAPI 应用设计。

由于 SQLModel 基于 SQLAlchemy，它支持 SQLAlchemy 支持的所有数据库：

| 数据库 | 说明 |
|---|---|
| SQLite | 单文件、Python 内置支持，本章示例直接可跑 |
| PostgreSQL | 生产环境推荐，可用官方全栈模板 `fastapi/full-stack-fastapi-template` |
| MySQL / Oracle / Microsoft SQL Server | 均由 SQLAlchemy 支持 |

安装：`uv add sqlmodel`。

### 2. 版本一：单一表模型

#### 2.1 定义表模型

```python
from sqlmodel import Field, SQLModel

class Hero(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    age: int | None = Field(default=None, index=True)
    secret_name: str
```

`Hero` 与 Pydantic 模型几乎一样（底层本身就是 Pydantic 模型），关键差异：

| 写法 | 含义 |
|---|---|
| `table=True` | 声明为**表模型**，对应数据库中真实的表；不加则是纯数据模型 |
| `Field(primary_key=True)` | 声明主键；用 `int \| None` 让代码里可以先 `id=None`，由数据库生成 id |
| `Field(index=True)` | 为该列创建 SQL 索引，加速按此列过滤的查询 |
| `str` 类型 | SQLModel 自动映射为 SQL 的 `TEXT`/`VARCHAR` 列 |

#### 2.2 创建引擎（Engine）

```python
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)
```

- `engine`（实际是 SQLAlchemy 的 engine）负责维护数据库连接，整个应用**共用一个**。
- `check_same_thread=False` 允许在不同线程使用同一个 SQLite 连接，因为单个请求可能跨多个线程（如依赖项中）。

#### 2.3 建表、会话依赖、启动事件

```python
from typing import Annotated
from fastapi import Depends
from sqlmodel import Session

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
```

| 组件 | 作用 |
|---|---|
| `SQLModel.metadata.create_all(engine)` | 按所有表模型创建表 |
| `get_session()` + `yield` | 依赖生成器，**每个请求一个独立 Session**，请求结束自动关闭 |
| `SessionDep` | `Annotated[Session, Depends(get_session)]` 别名，避免重复写 Depends |
| `@app.on_event("startup")` | 应用启动时建表；生产环境应改用 Alembic 迁移脚本 |

#### 2.4 四个 CRUD 路径操作

```python
from fastapi import FastAPI, HTTPException, Query
from sqlmodel import Session, select

@app.post("/heroes/")
def create_hero(hero: Hero, session: SessionDep) -> Hero:
    session.add(hero)
    session.commit()
    session.refresh(hero)   # 取回数据库生成的 id
    return hero

@app.get("/heroes/")
def read_heroes(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[Hero]:
    heroes = session.exec(select(Hero).offset(offset).limit(limit)).all()
    return heroes

@app.get("/heroes/{hero_id}")
def read_hero(hero_id: int, session: SessionDep) -> Hero:
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    return hero

@app.delete("/heroes/{hero_id}")
def delete_hero(hero_id: int, session: SessionDep):
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    session.delete(hero)
    session.commit()
    return {"ok": True}
```

要点：`select()` + `offset()/limit()` 做分页（limit 用 `Query(le=100)` 限制上限）；`session.get()` 按主键查；查不到抛 `404`；写操作三步曲 `add → commit → refresh`。

### 3. 版本二：多模型重构（安全与灵活）

单模型的两个问题：① 客户端可以自己传 `id`，可能覆盖数据库分配的主键；② `secret_name` 被原样返回，根本不"秘密"。

解决方案：**用继承拆出多个模型**。规则：带 `table=True` 的是表模型，不带的是数据模型（本质 Pydantic 模型）。

| 模型 | 定义 | 字段 | 用途 |
|---|---|---|---|
| `HeroBase` | `class HeroBase(SQLModel)` | `name`、`age` | 公共基类，避免重复声明 |
| `Hero` | `class Hero(HeroBase, table=True)` | `id`、`name`、`age`、`secret_name` | 真实表模型 |
| `HeroPublic` | `class HeroPublic(HeroBase)` | `id: int` + `name`、`age` | **返回给客户端**：不含 `secret_name`，`id` 保证是 int |
| `HeroCreate` | `class HeroCreate(HeroBase)` | `name`、`age`、`secret_name` | **创建入参**：接收 secret，但不含 id |
| `HeroUpdate` | `class HeroUpdate(HeroBase)` | 三个字段全部可选（默认 `None`） | **更新入参**：只发要改的字段 |

```python
class HeroBase(SQLModel):
    name: str = Field(index=True)
    age: int | None = Field(default=None, index=True)

class Hero(HeroBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    secret_name: str

class HeroPublic(HeroBase):
    id: int

class HeroCreate(HeroBase):
    secret_name: str

class HeroUpdate(HeroBase):
    name: str | None = None
    age: int | None = None
    secret_name: str | None = None
```

`HeroPublic` 把 `id` 重新声明为 `int`（而非 `int | None`），是与客户端的约定：id 永远存在且是整数，客户端和自动生成的客户端代码都能写得更简单。

#### 3.1 创建：`HeroCreate` 进，`HeroPublic` 出

```python
@app.post("/heroes/", response_model=HeroPublic)
def create_hero(hero: HeroCreate, session: SessionDep):
    db_hero = Hero.model_validate(hero)   # 数据模型 → 表模型
    session.add(db_hero)
    session.commit()
    session.refresh(db_hero)
    return db_hero
```

- `Hero.model_validate(hero)` 把 `HeroCreate` 转成 `Hero` 表模型。
- 返回值其实是 `Hero`，但用 **`response_model=HeroPublic`**（而不是返回类型注解 `-> HeroPublic`）声明，让 FastAPI 负责验证/序列化并过滤掉 `secret_name`。若写 `-> HeroPublic`，编辑器和类型检查器会正确报错"返回了 Hero"。
- 密码类字段的正确处理方式：接收但不通过 API 返回，且存储前必须哈希，绝不存明文。

#### 3.2 读取与删除

```python
@app.get("/heroes/", response_model=list[HeroPublic])
def read_heroes(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
):
    heroes = session.exec(select(Hero).offset(offset).limit(limit)).all()
    return heroes

@app.get("/heroes/{hero_id}", response_model=HeroPublic)
def read_hero(hero_id: int, session: SessionDep):
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    return hero

@app.delete("/heroes/{hero_id}")
def delete_hero(hero_id: int, session: SessionDep):
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    session.delete(hero)
    session.commit()
    return {"ok": True}
```

#### 3.3 局部更新：PATCH + `exclude_unset`

```python
@app.patch("/heroes/{hero_id}", response_model=HeroPublic)
def update_hero(hero_id: int, hero: HeroUpdate, session: SessionDep):
    hero_db = session.get(Hero, hero_id)
    if not hero_db:
        raise HTTPException(status_code=404, detail="Hero not found")
    hero_data = hero.model_dump(exclude_unset=True)   # 只包含客户端显式发送的字段
    hero_db.sqlmodel_update(hero_data)
    session.add(hero_db)
    session.commit()
    session.refresh(hero_db)
    return hero_db
```

`exclude_unset=True` 是核心技巧：只取出客户端真正传来的字段，未传的保持数据库原值，从而实现 PATCH 的部分更新语义。

### 4. 易错点汇总

| 易错点 | 正确做法 |
|---|---|
| 把 `table=True` 加在数据模型上 | 只有真实表模型才加；入参/出参模型不加 |
| 让客户端传 id | 用独立 `HeroCreate` 模型，不含 id |
| 直接返回表模型导致 `secret_name` 泄露 | `response_model=HeroPublic` 过滤 |
| 返回值类型写成 `-> HeroPublic` 却返回 `Hero` | 改用 `response_model=` 参数，避免类型检查冲突 |
| PATCH 时用 `model_dump()` 不带参数 | 必须 `exclude_unset=True`，否则会把未传字段覆盖成 None |
| 每个请求共用一个 Session | 用 `yield` 的依赖为每个请求创建独立 Session |
| 生产环境用 `create_all` 建表 | 改用 Alembic 等迁移工具 |

### 5. 小结

SQLModel 让 SQLModel 模型同时充当 Pydantic 模型：既能映射数据库表，又能被 FastAPI 用于请求校验、响应序列化与 OpenAPI 文档。通过 `HeroBase` + 多个派生模型（表模型 / Public / Create / Update）实现职责分离与安全控制。

---

## 二、NestJS 对比

| 维度 | FastAPI（Python） | NestJS（TypeScript） |
|---|---|---|
| ORM 选型 | SQLModel（基于 SQLAlchemy + Pydantic），框架不强制 | 常用 TypeORM、Prisma、Sequelize，通过 `@nestjs/typeorm` 等集成 |
| 实体定义 | `class Hero(SQLModel, table=True)` + `Field(primary_key=True/index=True)`，类型注解即列定义 | `@Entity()` 类 + `@PrimaryGeneratedColumn()` / `@Column()` 装饰器声明列 |
| 模型分层 | 靠继承拆 `HeroBase / Hero / HeroPublic / HeroCreate / HeroUpdate` | 靠 Entity + 多个 DTO 类（CreateDto / UpdateDto / ResponseDto） |
| 请求校验 | SQLModel 模型本身是 Pydantic 模型，直接作请求体 | DTO + `class-validator` / `class-transformer` 装饰器，配 `ValidationPipe` |
| 响应过滤 | `response_model=HeroPublic` 自动验证、序列化、过滤敏感字段 | `@SerializeOptions`/`ClassSerializerInterceptor` + `@Exclude()`，或手动映射返回 DTO |
| 依赖注入获取会话 | `SessionDep = Annotated[Session, Depends(get_session)]`，生成器 `yield` 每请求一个会话 | 仓储 `@InjectRepository(Hero)` 注入，或 PrismaService 注入；Provider 由 Module 管理 |
| 模块装配 | 无需模块，单文件即可；`@app.on_event("startup")` 建表 | `TypeOrmModule.forRoot(...)` + `forFeature([Hero])` 在 Module 中注册 |
| 分页查询 | `session.exec(select(Hero).offset(offset).limit(limit)).all()` | `repository.find({ skip: offset, take: limit })` |
| 局部更新 | `model_dump(exclude_unset=True)` + `sqlmodel_update()` | `patch` 手动合并 + `repository.save()`；`PartialType(UpdateDto)` 让字段可选 |
| 文档生成 | 模型直接出现在 OpenAPI，零额外配置 | 需 `@nestjs/swagger` 的 `@ApiProperty()` 标注 DTO 字段 |

**核心差异一句话**：FastAPI 用"一个模型类既能建表又能当 DTO"的复用思路，靠 Pydantic 类型注解和 `response_model` 自动完成校验、序列化与敏感字段过滤；NestJS 把 Entity 与 DTO 严格分成两类，靠装饰器、Module 注册和 Provider 注入显式接线，分层更重但边界更清晰。

---

## 三、针对性练习题

### 题 1（基础）
`table=True` 在 SQLModel 中起什么作用？为什么主键声明为 `id: int | None = Field(default=None, primary_key=True)`？

<details>
<summary>参考答案</summary>

- `table=True` 表示该模型是**表模型**，对应数据库中的一张真实表，会被 `SQLModel.metadata.create_all(engine)` 建表；不加则是纯数据模型（Pydantic 模型），只用于数据校验/传输。
- 主键用 `int | None` 且默认 `None`，是为了在 Python 代码中创建对象时不传 id，把生成 id 的职责交给数据库；SQLModel 会把该列在数据库中定义为非空的 `INTEGER`。
</details>

### 题 2（理解）
为什么要用 `yield` 定义 `get_session()` 依赖，并声明 `SessionDep = Annotated[Session, Depends(get_session)]`？

<details>
<summary>参考答案</summary>

`yield` 的依赖生成器保证**每个请求获得一个独立的 Session**，请求处理完后 `with` 块退出，Session 自动关闭/释放，避免跨请求共享连接带来的状态污染。`Annotated` 别名把 `Session` 与 `Depends(get_session)` 绑定成一个可复用类型，路径操作只需写 `session: SessionDep`，减少重复并让类型提示更清晰。
</details>

### 题 3（辨析/代码）
客户端创建 Hero 时传了 `{"id": 999, "name": "X", "secret_name": "s"}`，为什么不应直接用表模型 `Hero` 作请求体？写出改进后的创建接口，确保 id 不被客户端控制且响应不含 `secret_name`。

<details>
<summary>参考答案</summary>

直接用 `Hero` 作请求体，客户端就能覆盖数据库分配的主键，且 `secret_name` 会被原样返回。改进：

```python
class HeroCreate(HeroBase):
    secret_name: str

class HeroPublic(HeroBase):
    id: int

@app.post("/heroes/", response_model=HeroPublic)
def create_hero(hero: HeroCreate, session: SessionDep):
    db_hero = Hero.model_validate(hero)
    session.add(db_hero)
    session.commit()
    session.refresh(db_hero)
    return db_hero
```

`HeroCreate` 无 id 字段，客户端传 id 会被忽略/校验拒绝；`response_model=HeroPublic` 过滤掉 `secret_name`；`refresh` 取回数据库生成的 id。
</details>

### 题 4（进阶 · NestJS 迁移视角）
在 NestJS 中用 `PATCH /heroes/:id` 做局部更新，DTO 由 `PartialType(CreateHeroDto)` 生成。请写出功能等价的 FastAPI 代码，并说明 `exclude_unset=True` 的作用。

<details>
<summary>参考答案</summary>

```python
class HeroUpdate(HeroBase):
    name: str | None = None
    age: int | None = None
    secret_name: str | None = None

@app.patch("/heroes/{hero_id}", response_model=HeroPublic)
def update_hero(hero_id: int, hero: HeroUpdate, session: SessionDep):
    hero_db = session.get(Hero, hero_id)
    if not hero_db:
        raise HTTPException(status_code=404, detail="Hero not found")
    hero_data = hero.model_dump(exclude_unset=True)
    hero_db.sqlmodel_update(hero_data)
    session.add(hero_db)
    session.commit()
    session.refresh(hero_db)
    return hero_db
```

`model_dump()` 默认会包含所有字段（含默认值 None），直接 update 会把未传的字段清成 None；`exclude_unset=True` 只保留客户端**显式发送**的字段，从而实现 PATCH 局部更新。NestJS 的 `PartialType` 只把字段变为可选，真正"只更新传入字段"仍需手动判断，FastAPI 靠这一参数直接完成。
</details>

### 题 5（思考）
本章为什么强调"返回模型用 `response_model=HeroPublic`，而不要用返回类型注解 `-> HeroPublic`"？结合类型检查工具说明。

<details>
<summary>参考答案</summary>

因为函数实际返回的是 `Hero` 表模型（含 id、secret_name），而不是 `HeroPublic` 实例。若写 `-> HeroPublic`，编辑器/mypy 等类型检查器会按注解检查，合理地报"返回了 Hero，与 HeroPublic 不兼容"。改用 `response_model=HeroPublic` 后，类型注解与实际返回值保持一致（`-> Hero` 或省略），FastAPI 在运行时按 `HeroPublic` 验证、序列化并过滤字段，文档也按它生成——既通过类型检查，又实现响应控制。
</details>
