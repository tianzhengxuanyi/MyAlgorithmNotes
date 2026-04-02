# 8-10 TypeORM 关联查询：一对一、一对多关系

## 概述

本节学习 TypeORM 中的关联查询，重点掌握一对一（OneToOne）和一对多（OneToMany）关系的定义与查询方式。

![8-10TypeORM关联查询：一对一、一对多关系_img21.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img21.png)

![8-10TypeORM关联查询：一对一、一对多关系_img27.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img27.png)

![8-10TypeORM关联查询：一对一、一对多关系_img28.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img28.png)

---

## 一对一关系（OneToOne）

### 场景

User ↔ Profile：一个用户对应一份详细资料。

![8-10TypeORM关联查询：一对一、一对多关系_img29.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img29.png)

![8-10TypeORM关联查询：一对一、一对多关系_img30.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img30.png)

### Entity 定义

一对一关系需要**双方都声明** `@OneToOne`，否则 TypeORM 会出现警告（波浪线提示）。

```typescript
// user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  // 一对一关联 Profile，JoinColumn 表示外键在 User 表
  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile;
}
```

```typescript
// profile.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gender: string;

  @Column()
  avatar: string;

  // 反向关联，不需要 @JoinColumn
  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
```

> ⚠️ `@JoinColumn()` 只需要在关系的**拥有方**（owner side）添加，它决定了外键列在哪张表。

![8-10TypeORM关联查询：一对一、一对多关系_img31.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img31.png)

![8-10TypeORM关联查询：一对一、一对多关系_img32.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img32.png)

### 关联查询

```typescript
// user.service.ts
async findProfile(id: number): Promise<User> {
  return this.userRepository.findOne({
    where: { id },
    relations: {
      profile: true,  // 加载关联的 profile 数据
    },
  });
}
```

`relations: { profile: true }` 的作用：查询 User 时自动 LEFT JOIN Profile 表，一次查询返回完整数据，避免多次查库。

![8-10TypeORM关联查询：一对一、一对多关系_img1.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img1.png)

![8-10TypeORM关联查询：一对一、一对多关系_img2.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img2.png)

### Controller 中添加路由

```typescript
// user.controller.ts
@Get('profile/:id')
getUserProfile(@Param('id') id: number) {
  return this.userService.findProfile(id);
}
```

![8-10TypeORM关联查询：一对一、一对多关系_img3.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img3.png)

![8-10TypeORM关联查询：一对一、一对多关系_img4.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img4.png)

![8-10TypeORM关联查询：一对一、一对多关系_img5.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img5.png)

### 返回结果示例

```json
{
  "id": 1,
  "username": "admin",
  "password": "123456",
  "profile": {
    "id": 1,
    "gender": "male",
    "avatar": "https://example.com/avatar.png"
  }
}
```

![8-10TypeORM关联查询：一对一、一对多关系_img6.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img6.png)

![8-10TypeORM关联查询：一对一、一对多关系_img7.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img7.png)

---

## 一对多关系（OneToMany / ManyToOne）

### 场景

User → Logs：一个用户有多条操作日志。

![8-10TypeORM关联查询：一对一、一对多关系_img8.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img8.png)

![8-10TypeORM关联查询：一对一、一对多关系_img9.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img9.png)

### Entity 定义

```typescript
// user.entity.ts（补充 logs 关联）
import { OneToMany } from 'typeorm';
import { Log } from './log.entity';

@Entity()
export class User {
  // ...其他字段

  @OneToMany(() => Log, (log) => log.user)
  logs: Log[];
}
```

```typescript
// log.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  method: string;

  @Column()
  result: number;  // HTTP 状态码

  // 多对一：多条日志属于一个用户
  @ManyToOne(() => User, (user) => user.logs)
  user: User;
}
```

> `@OneToMany` 和 `@ManyToOne` 必须成对出现。`@ManyToOne` 一侧自动生成外键列（`userId`）。

![8-10TypeORM关联查询：一对一、一对多关系_img10.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img10.png)

![8-10TypeORM关联查询：一对一、一对多关系_img11.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img11.png)

![8-10TypeORM关联查询：一对一、一对多关系_img12.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img12.png)

### 查询用户的日志

```typescript
// user.service.ts

// 方式一：通过 User 的 relations 加载
async findUserWithLogs(id: number): Promise<User> {
  return this.userRepository.findOne({
    where: { id },
    relations: {
      logs: true,  // 加载关联的 logs
    },
  });
}

// 方式二：通过 LogRepository 直接查询
async findUserLogs(id: number): Promise<Log[]> {
  return this.logRepository.find({
    where: {
      user: { id },  // 条件指向 user 的 id
    },
  });
}
```

![8-10TypeORM关联查询：一对一、一对多关系_img13.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img13.png)

![8-10TypeORM关联查询：一对一、一对多关系_img14.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img14.png)

![8-10TypeORM关联查询：一对一、一对多关系_img15.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img15.png)

![8-10TypeORM关联查询：一对一、一对多关系_img16.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img16.png)

![8-10TypeORM关联查询：一对一、一对多关系_img17.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img17.png)

### Controller 路由

```typescript
@Get('logs/:id')
getUserLogs(@Param('id') id: number) {
  return this.userService.findUserLogs(id);
}
```

![8-10TypeORM关联查询：一对一、一对多关系_img18.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img18.png)

![8-10TypeORM关联查询：一对一、一对多关系_img19.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img19.png)

![8-10TypeORM关联查询：一对一、一对多关系_img20.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img20.png)

---

## relations 选项详解

`relations` 支持嵌套加载：

```typescript
// 同时加载 profile 和 logs
this.userRepository.findOne({
  where: { id },
  relations: {
    profile: true,
    logs: true,
  },
});

// 嵌套关联（如果 Log 还关联了其他实体）
this.userRepository.findOne({
  where: { id },
  relations: {
    logs: {
      category: true,  // 加载 log 关联的 category
    },
  },
});
```

![8-10TypeORM关联查询：一对一、一对多关系_img22.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img22.png)

![8-10TypeORM关联查询：一对一、一对多关系_img23.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img23.png)

---

## 总结

![8-10TypeORM关联查询：一对一、一对多关系_img24.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img24.png)

![8-10TypeORM关联查询：一对一、一对多关系_img25.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img25.png)

![8-10TypeORM关联查询：一对一、一对多关系_img26.png](./images/8-10TypeORM关联查询：一对一、一对多关系_img26.png)

| 关系类型 | 装饰器 | 外键位置 | 说明 |
|----------|--------|----------|------|
| 一对一 | `@OneToOne` + `@JoinColumn` | 有 `@JoinColumn` 的一方 | 双方都要声明 `@OneToOne` |
| 一对多 | `@OneToMany` / `@ManyToOne` | `@ManyToOne` 一方（自动生成） | 必须成对出现 |

查询关联数据的两种方式：
- `relations: { profile: true }` — 通过主表 Repository 加载关联
- 直接用关联表的 Repository 查询，`where: { user: { id } }` — 更灵活

> 使用 `relations` 时 TypeORM 会自动生成 LEFT JOIN 语句，一次查询获取所有关联数据。
