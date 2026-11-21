# typyorm集成pgvector

## 安装pgvector依赖插件

```bash
pnpm i pg pgvector
```

## 配置pgvector数据库连接

### 方案：独立数据源（不混用 MySQL 连接）

PGVector 需要 PostgreSQL 数据库，与现有 MySQL 数据库分离。采用独立数据源配置：

### 1. 添加 PostgreSQL 配置文件

```typescript
// backend/src/config/vector.database.config.ts

// ...

/**
 * 加载对应环境的 .env 文件（如 .env.development 或 .env.production）
 * 通过 cross-env NODE_ENV=xxx 设置当前环境
 */
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

// 当前通过 npm scripts 执行的命令（用于判断是否为 typeorm CLI 调用）
const currentScript = process.env.npm_lifecycle_event

/**
 * TypeORM 数据源配置
 *
 * 以下环境变量需要在 .env.development 或 .env.production 中配置：
 *
 * DB_HOST          - 数据库主机地址（默认: 127.0.0.1）
 * DB_PORT          - 数据库端口号（默认: 3306）
 * DB_USERNAME      - 数据库用户名（必填）
 * DB_PASSWORD      - 数据库密码（必填）
 * DB_DATABASE      - 数据库名称（必填）
 * DB_SYNCHRONIZE   - 是否自动同步实体到数据库表结构（默认: false）
 *                    开发环境可设为 true，生产环境务必设为 false
 * DB_LOGGING       - TypeORM 日志级别，如 ["error"]（可选）
 */
const dataSourceOptions: DataSourceOptions = {
  // 数据库类型，当前使用 postgres
  type: 'postgres',
  // ...
  // 实体文件路径（编译后的 dist 目录）
  entities: ['dist/modules/**/*.vector.entity{.ts,.js}'],
  // 额外配置，确保 pgvector 扩展已安装
  // 关键，不能漏
  // 否则会报错：无法使用 vector 类型
  extra: {
    extensions: ['pgvector'], // 关键，不能漏
  }
}

export const vectorDbRegToken = 'vectorDatabase'

export const VectorDatabaseConfig = registerAs(
  vectorDbRegToken,
  (): DataSourceOptions => dataSourceOptions,
)

export type IVectorDatabaseConfig = ConfigType<typeof VectorDatabaseConfig>

/**
 * TypeORM CLI 数据源实例
 *
 * 此默认导出供 TypeORM CLI 使用（package.json 中的 typeorm 脚本）
 * 命令示例：
 *   pnpm typeorm migration:run     - 执行迁移
 *   pnpm typeorm migration:revert  - 回滚迁移
 *   pnpm migration:generate        - 生成迁移文件
 *
 * 注意：运行 typeorm CLI 前需要先执行 pnpm build 编译项目，
 * 因为脚本指向的是 dist/config/database.config.js
 */
const dataSource = new DataSource(dataSourceOptions)

export default dataSource

```


### 2. 修改 mysql 数据库连接配置

修改实体文件路径，排除 vector 实体
```typescript
  // 实体文件路径（编译后的 dist 目录）
  entities: ['dist/modules/**/!(*.vector).entity{.ts,.js}'],
```

### 3. 添加环境变量

```bash
# .env.development 或 .env.production
PG_HOST=127.0.0.1
PG_PORT=5432
PG_USERNAME=postgres
PG_PASSWORD=your_password
PG_DATABASE=ai_rag
```

### 4. 更新 config/index.ts 类型导出

```typescript
// backend/src/config/index.ts
export { PostgresConfig, pgRegToken, IPostgresConfig } from './database.config'

export interface AllConfigType {
  [dbRegToken]: IDatabaseConfig
  [pgRegToken]: IPostgresConfig  // 新增
  // ...
}
```

### 5. 注册 PGVector 数据源模块

```typescript
// backend/src/shared/database/database.module.ts
@Module({
  imports: [
    // MySQL 数据源不用配置name，默认是default
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
        // ....
      },
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize()
        return dataSource
      },
    }),
    // PostgreSQL 数据源（PGVector）
    // 注意：不能使用 autoLoadEntities，否则 forFeature 注册的 MySQL 实体会被加载到 PostgreSQL 数据源
    TypeOrmModule.forRootAsync({
      // 数据源名称，后续injectRepository时使用,作为第二个参数传入用于指定数据源
      name: 'pgVector',
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
        let loggerOptions: LoggerOptions = env('DB_LOGGING') as 'all'

        try {
          loggerOptions = JSON.parse(loggerOptions)
        }
        catch {
          // ignore
        }

        return {
          ...configService.get<IVectorDatabaseConfig>('vectorDatabase'),
          // 禁用 autoLoadEntities，仅通过 entities glob 匹配向量实体
          autoLoadEntities: false,
          logging: loggerOptions,
          logger: new TypeORMLogger(loggerOptions),
        }
      },
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize()
        return dataSource
      },
    }),
  ],
  providers,
  exports: providers,
})
export class DatabaseModule { }
```

