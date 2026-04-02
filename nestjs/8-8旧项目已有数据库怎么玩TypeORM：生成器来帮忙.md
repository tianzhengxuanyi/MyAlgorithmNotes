# 8-8 旧项目已有数据库怎么玩 TypeORM：生成器来帮忙

## 背景与场景

在实际生产中，我们经常遇到这样的场景：旧项目已经有了一套完整的数据库，现在需要迁移到新系统（比如用 NestJS + TypeORM 重构）。这时候不可能从零手写所有 Entity，而是需要**逆向工程**——从已有数据库自动生成 TypeORM 实体类。

> 核心区别：正向是先写 Entity 再同步到数据库；逆向是从已有数据库反推出 Entity 代码。

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img21.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img21.png)

---

## 工具介绍：typeorm-model-generator

[typeorm-model-generator](https://www.npmjs.com/package/typeorm-model-generator) 是一个从已有数据库逆向生成 TypeORM Entity 的 CLI 工具。

支持的数据库：
- MySQL / MariaDB
- PostgreSQL
- Oracle
- SQL Server
- SQLite

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img22.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img22.png)

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img23.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img23.png)

---

## 安装与使用

### 1. 安装（推荐作为开发依赖）

```bash
# 局部安装，仅用于开发阶段
pnpm add -D typeorm-model-generator
```

> 不建议全局安装，避免污染全局环境，保持项目依赖的独立性。

### 2. 运行生成命令

```bash
npx typeorm-model-generator \
  -h 127.0.0.1 \       # 数据库主机地址
  -d your_database \    # 数据库名 (-D)
  -u root \             # 用户名 (-U)
  -x your_password \    # 密码 (-X)
  -p 3306 \             # 端口 (-P)
  -e mysql \            # 数据库引擎 (-e)
  -o ./src/entities     # 输出目录 (-o)
```

参数说明：

| 参数 | 说明 | 示例 |
|------|------|------|
| `-h` | 数据库主机地址 | `127.0.0.1` |
| `-d` | 数据库名 | `nestjs_db` |
| `-u` | 用户名 | `root` |
| `-x` | 密码 | `123456` |
| `-p` | 端口号 | `3306` |
| `-e` | 数据库引擎 | `mysql` / `postgres` / `oracle` / `mssql` / `sqlite` |
| `-o` | 输出路径 | `./src/entities` |

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img24.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img24.png)


### 3. 注意事项

- 运行前确认数据库连接信息（主机、端口、用户名、密码）
- 如果使用 Docker，确认容器暴露的端口号，不要随意修改 `docker-compose.yml`
- 修改 Docker 配置后需要重新构建：`docker compose up -d`

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img25.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img25.png)

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img26.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img26.png)

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img27.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img27.png)

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img1.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img1.png)

---

## 生成结果分析

生成器会输出以下内容：
- **Entity 文件**：每张表对应一个 `.ts` 实体类
- **ormconfig.json**：TypeORM 配置文件（可保留用于后续 migration）

### 关联关系自动识别

生成器会根据数据库外键自动识别并生成关联关系装饰器：

| 关系类型 | 装饰器 | 说明 |
|----------|--------|------|
| 一对一 | `@OneToOne` | 如 user ↔ profile |
| 一对多 | `@OneToMany` | 如 user → logs |
| 多对一 | `@ManyToOne` | 如 logs → user |
| 多对多 | `@ManyToMany` + `@JoinTable` | 如 users ↔ roles |

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img2.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img2.png)

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img3.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img3.png)

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img4.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img4.png)

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img5.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img5.png)

### 关联关系示例

```typescript
// user.entity.ts（生成器自动生成）
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  // 一对一：用户 ↔ 资料
  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  // 一对多：用户 → 日志
  @OneToMany(() => Log, (log) => log.user)
  logs: Log[];

  // 多对多：用户 ↔ 角色
  @ManyToMany(() => Role)
  @JoinTable({ name: 'users_roles' }) // 中间表
  roles: Role[];
}
```

### 多对多关系的 JoinTable

多对多关系会生成一张中间表（如 `users_roles`），`@JoinTable` 装饰器定义了：
- `joinColumns`：当前实体（User）的 ID
- `inverseJoinColumns`：关联实体（Role）的 ID

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img6.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img6.png)

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img7.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img7.png)

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img8.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img8.png)

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img9.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img9.png)

---

## 集成到 NestJS 项目

### 1. 整理生成的 Entity 文件

两种文件组织策略：

- **旧项目迁移**：所有 Entity 放在同一个 `entities/` 文件夹，统一管理
- **新项目开发**：每个 Entity 放在对应模块文件夹下（如 `user/user.entity.ts`），便于模块化迁移

> 推荐新项目按模块组织，迁移时直接拷贝整个模块文件夹即可。

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img10.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img10.png)

### 2. 清理无关数据

生成器可能会生成一些不需要的实体，需要手动清理：
- 删除不相关的 Entity 文件
- 检查关联关系是否正确
- 移除不需要的字段

### 3. 在 AppModule 中注册

```typescript
// app.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { Log } from './entities/log.entity';
import { Role } from './entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'your_password',
      database: 'your_database',
      entities: [User, Profile, Log, Role],
      synchronize: false, // 旧项目切记关闭，避免覆盖已有表结构
    }),
  ],
})
export class AppModule {}
```

> ⚠️ 旧项目务必将 `synchronize` 设为 `false`，防止 TypeORM 自动修改已有的表结构。

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img11.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img11.png)

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img12.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img12.png)

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img13.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img13.png)

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img14.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img14.png)

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img15.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img15.png)

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img16.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img16.png)

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img17.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img17.png)

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img18.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img18.png)

### 4. 配置环境变量（推荐）

生产环境中，数据库配置应通过环境变量管理：

```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'test',
  entities: [User, Profile, Log, Role],
  synchronize: process.env.NODE_ENV === 'development', // 仅开发环境开启
  logging: process.env.NODE_ENV === 'development',     // 仅开发环境打印 SQL
})
```

### 5. 验证

启动项目，确认没有报错：

```bash
pnpm start:dev
```

如果连接成功且没有实体映射错误，说明逆向生成的 Entity 与数据库结构匹配。

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img19.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img19.png)

![8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img20.png](./images/8-8旧项目已有数据库怎么玩TypeORM：生成器来帮忙_img20.png)

---

## 总结

| 步骤 | 操作 |
|------|------|
| 1 | 安装 `typeorm-model-generator` 作为开发依赖 |
| 2 | 配置数据库连接参数，运行生成命令 |
| 3 | 检查生成的 Entity，确认关联关系（一对一、一对多、多对多）正确 |
| 4 | 清理无关实体，按项目结构组织文件 |
| 5 | 在 `AppModule` 中注册实体，`synchronize` 设为 `false` |
| 6 | 启动项目验证，确保无报错 |

> 生成器输出的 `ormconfig.json` 可以保留，后续做 migration 时会用到。
