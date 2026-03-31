## NestJS 配置模块官方方案使用详解

[原片 @ 00:00](https://www.bilibili.com/video/BV14dh7zoEuk_p41?t=0)*

### 1. 配置模块引入与安装

- **目标**：学习如何使用官方 `@nestjs/config` 模块为项目添加配置管理能力。
- **前提**：建议使用视频配套的 `Start` 示例项目进行实操练习，便于对照最终代码结构。
- **安装命令**：
  ```bash
  npm i --save @nestjs/config
  ```
  > ⚠️ 注意：若当前 `@nestjs/config` 版本为 v2.x，需显式指定版本安装以避免兼容性问题：
  > ```bash
  > npm i --save @nestjs/config@2
  > ```

*![](/static/screenshots/screenshot_000_bf12d82b-df16-40cf-95c8-e507866f5bc0.jpg)*

[原片 @ 00:54](https://www.bilibili.com/video/BV14dh7zoEuk_p41?t=54)*

### 2. 配置文件格式与加载机制

- **配置文件位置**：通常放置于项目根目录下，如 `.env`、`config.json` 或 `config.yml`。
- **支持格式**：`dotenv`（`.env`）、`JSON`、`YAML`、`TS` 等多种格式，底层依赖 `dotenv` 和 `joi`。
- **核心原理**：`@nestjs/config` 内部封装了 `dotenv` 库，通过 `ConfigModule.forRoot()` 加载并解析环境变量及配置文件。

*![](/static/screenshots/screenshot_001_c70a13a4-5d5a-4037-8d55-8832dd3c839f.jpg)*

[原片 @ 01:50](https://www.bilibili.com/video/BV14dh7zoEuk_p41?t=110)*

### 3. 在 AppModule 中配置 ConfigModule

- **导入方式**：
  ```typescript
  import { ConfigModule } from '@nestjs/config';
  ```
- **注册方式**（在 `AppModule` 中）：
  ```typescript
  @Module({
    imports: [
      ConfigModule.forRoot(), // 默认加载根目录下的 .env 文件
    ],
    controllers: [],
    providers: [],
  })
  export class AppModule {}
  ```
- **关键点**：
  - `forRoot()` 方法会读取 `process.env` 及 `./.env` 文件中的配置。
  - 配置对象可全局注入，所有子模块（如 `UserModule`）无需重复导入即可访问。

*![](/static/screenshots/screenshot_002_950e223d-ee7a-466c-8632-9bb85445bc72.jpg)*

[原片 @ 02:40](https://www.bilibili.com/video/BV14dh7zoEuk_p41?t=160)*

### 4. 全局配置使用与作用域限制

- **全局使用**：通过 `isGlobal: true` 设置，使 `ConfigModule` 成为全局模块：
  ```typescript
  ConfigModule.forRoot({
    isGlobal: true,
  })
  ```
  - ✅ 优势：无需在每个子模块中重复 `import { ConfigModule }`。
  - ❌ 限制：若未设置 `isGlobal: true`，则仅在当前模块及其子模块中可用（如 `UserModule` 需单独导入）。

*![](/static/screenshots/screenshot_003_5ef47a0b-c103-4bf9-9e4c-0176d7292b04.jpg)*

[原片 @ 04:50](https://www.bilibili.com/video/BV14dh7zoEuk_p41?t=290)*

### 5. 在 Controller/Service 中读取配置

- **注入方式**：
  ```typescript
  constructor(
    private readonly configService: ConfigService,
  ) {}
  ```
- **读取值**：
  ```typescript
  const db = this.configService.get('DB');
  const host = this.configService.get('DB_HOST');
  console.log(db, host);
  ```
- **返回类型**：`ConfigService.get<T>(key: string)` 返回 `T` 类型，支持泛型推断。

*![](/static/screenshots/screenshot_004_1fa369f3-8439-4c6d-81e5-f823d354bb2c.jpg)*

[原片 @ 07:10](https://www.bilibili.com/video/BV14dh7zoEuk_p41?t=430)*

### 6. 使用环境变量文件（.env）

- **创建 `.env` 文件**（位于项目根目录）：
  ```env
  DATABASE_USER=test
  DATABASE_PASSWORD=test123
  DB=mysql
  DB_HOST=127.0.0.1
  ```
- **自动加载**：`ConfigModule.forRoot()` 默认读取 `.env` 文件，也可自定义路径：
  ```typescript
  ConfigModule.forRoot({
    envFilePath: '.env.local',
  })
  ```

*![](/static/screenshots/screenshot_005_4a5a191f-0197-4255-9f5a-1faefdff1df7.jpg)*

[原片 @ 08:10](https://www.bilibili.com/video/BV14dh7zoEuk_p41?t=490)*

### 7. 使用枚举增强类型安全

- **场景**：当配置项存在固定值集合时（如数据库类型），推荐使用 TypeScript 枚举。
- **实现步骤**：
  1. 创建 `config.enum.ts`：
     ```typescript
     export enum ConfigEnum {
       DB = 'DB',
       DB_HOST = 'DB_HOST',
     }
     ```
  2. 在 Controller 中使用：
     ```typescript
     const db = this.configService.get(ConfigEnum.DB);
     const host = this.configService.get(ConfigEnum.DB_HOST);
     ```
  - ✅ 优点：编译期检查、防止拼写错误、提升可维护性。

*![](/static/screenshots/screenshot_006_64b7565d-7e52-4cd4-861e-c9fb57c6e1cf.jpg)*

[原片 @ 09:10](https://www.bilibili.com/video/BV14dh7zoEuk_p41?t=550)*

### 8. 常见问题与调试技巧

- **问题**：`Error: Nest can't resolve dependencies...`
  - **原因**：`ConfigService` 未正确注入或模块作用域不匹配。
  - **解决**：
    - 确保 `ConfigModule.forRoot()` 已在 `AppModule` 中注册；
    - 若在子模块中使用，需确保该模块已导入 `ConfigModule`（或设为全局）；
    - 检查 `@Inject()` 是否正确绑定服务。

- **调试验证**：
  ```typescript
  @Get()
  getUsers() {
    const db = this.configService.get('DB');
    console.log({ db });
    return this.userService.getUsers();
  }
  ```
  - 打开终端日志观察是否打印出预期配置值。

*![](/static/screenshots/screenshot_007_898e5e6d-9378-4aae-9152-57628f751ba8.jpg)*

[原片 @ 09:25](https://www.bilibili.com/video/BV14dh7zoEuk_p41?t=565)*

### 9. 推荐实践与最佳实践

- **推荐做法**：
  - 将敏感信息（如密码）放入 `.env` 并加入 `.gitignore`；
  - 使用 `ConfigService.getOrThrow()` 强制校验必要配置是否存在；
  - 结合 `Joi` 进行配置校验（后续章节将介绍）；
  - 对于复杂配置，可使用 `ConfigModule.forFeature()` 注册特定服务。

- **示例：强制获取配置**
  ```typescript
  const dbHost = this.configService.getOrThrow('DB_HOST');
  ```

*![](/static/screenshots/screenshot_008_ec1fa470-461d-4704-869e-658c6ee848b4.jpg)*

## AI 总结

## AI 总结  
本节系统讲解了 NestJS 官方 `@nestjs/config` 模块的配置管理核心流程：从安装模块、配置 `.env` 文件、全局注册 `ConfigModule`，到在控制器和服务中安全读取配置；重点强调了 `isGlobal: true` 的作用域控制机制，并通过枚举提升了配置类型的健壮性与可维护性。整体思路清晰、实操性强，是构建企业级 Node.js 应用不可或缺的基础环节。