# NestJS 中间件（Middleware）学习笔记
> 文档来源：[https://docs.nestjs.cn/overview/middlewares](https://docs.nestjs.cn/overview/middlewares)

## 1. 中间件概念
- 中间件是**路由处理程序执行之前**运行的函数，默认等价于 Express 中间件。
- 可以访问：`req` 请求对象、`res` 响应对象、`next()` 下一个中间件函数。
- 可完成工作：
  1. 执行任意业务代码
  2. 修改 request / response 对象
  3. 直接结束请求‑响应周期
  4. 调用 `next()` 移交控制权给下一个中间件
> ⚠️ 如果没有结束响应，**必须调用 `next()`**，否则请求会挂起无响应。

> 注意：Express 和 Fastify 的中间件签名存在差异。

## 2. 两种实现方式
### ① 类中间件（支持依赖注入）
需要 `@Injectable()`，实现 `NestMiddleware` 接口，实现 `use()` 方法。
```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}
```
- 支持构造函数注入模块内的 Provider 依赖。

### ② 函数式中间件（无DI，简单轻量）
普通 JS 函数，不需要装饰器与接口；适合没有依赖的简单逻辑。
```typescript
import { Request, Response, NextFunction } from 'express';
export function logger(req: Request, res: Response, next: NextFunction) {
  console.log('Request...');
  next();
}
```

## 3. 模块内注册中间件
`@Module()` 没有中间件配置项；
模块需要实现 **`NestModule`** 接口，重写 `configure(consumer: MiddlewareConsumer)` 方法。

`MiddlewareConsumer` 常用链式API：
- `.apply(中间件)`：传入一个或多个中间件，逗号分隔代表顺序执行
- `.forRoutes()`：指定哪些路由/控制器应用中间件
- `.exclude()`：排除部分路由，不执行该中间件

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';
import { CatsController } from './cats/cats.controller';

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path:'cats', method: RequestMethod.GET })
      .forRoutes(CatsController);
  }
}
```

### forRoutes 支持多种入参
1. 字符串路由路径：`forRoutes('cats')`
2. 带方法的路由对象：`forRoutes({path:'cats', method: RequestMethod.GET})`
3. 控制器类：`forRoutes(CatsController)`，作用于该控制器全部接口
4. 支持路由通配符 `*splat` 匹配任意路径

### 多个中间件顺序执行
```typescript
consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
```

## 4. 全局中间件
在 `main.ts` 通过 `app.use()` 注册，作用全部路由。
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(logger);
  await app.listen(3000);
}
```
> 重要限制：`app.use()` 注册的全局中间件**无法使用依赖注入DI**；
> 如果需要DI能力，不要用`app.use`，改用模块中 `forRoutes('*')` 的方式注册类中间件。

## 5. 重要提示
1. `configure()` 可以是 `async configure()`，支持内部 `await` 异步操作。
2. Nest 默认开启 `body‑parser`；如需自定义body解析中间件，创建app时设置 `NestFactory.create(AppModule, {bodyParser:false})`。
3. 执行顺序：先全局中间件，再模块绑定的中间件。

## 6. 核心总结
1. **类中间件**：`@Injectable()` + `NestMiddleware`，可DI；在模块`configure()`注册。
2. **函数中间件**：简单函数，无DI，适合全局`app.use()`。
3. `MiddlewareConsumer`：`apply()` → `exclude()`（可选） → `forRoutes()`。
4. 不调用`next()`又不结束响应，请求会卡死。
5. `app.use()`全局中间件不能注入服务；需要DI请用模块 + `forRoutes('*')`。

> 与前面知识关联：类中间件本质也是Provider，可以注入同模块下的服务。