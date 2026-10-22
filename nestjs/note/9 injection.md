# NestJS 依赖注入（DI）学习笔记
> 文档来源：[https://docs.nestjs.cn/fundamentals/dependency-injection](https://docs.nestjs.cn/fundamentals/dependency-injection)

## 1. 核心概念
- **依赖注入 DI**：控制反转（IoC）的实现方式，由容器负责实例化类并注入依赖，而非手动 `new`。
- Nest 内置 IoC 容器，自动管理提供者生命周期、依赖解析。
- **@Injectable()**：标记类为**提供者（provider）**，可被容器注入。
- 依赖关系：**提供者注入到控制器 / 其他提供者**。

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {}
```

控制器注入（构造器注入，推荐）：
```typescript
@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}
}
```
> TS 自动元反射：需要 `tsconfig` 开启 `emitDecoratorMetadata: true`

## 2. 依赖注入基础规则
1. 依赖必须在**同一模块 providers 注册**，或者来自**导入模块的 exports**；
2. 注入的类必须加 `@Injectable()`；
3. 构造注入是首选，简洁且支持类型推断；
4. 循环依赖需要特殊处理（forwardRef）。

## 3. 提供者多种注册方式（自定义 Provider）
> 标准 `useClass` 只是其中一种

### 3.1 useClass（最常用）
```typescript
providers: [
  {
    provide: CatsService,
    useClass: CatsService
  }
]
```
简写：`providers: [CatsService]`

### 3.2 useValue：注入常量、对象、外部实例
```typescript
providers: [
  {
    provide: 'CONFIG',
    useValue: { host: 'localhost', port: 3306 }
  }
]
```
注入时使用 `@Inject(token)`
```typescript
constructor(@Inject('CONFIG') config: Config) {}
```

### 3.3 useFactory：工厂函数，动态生成实例
适合：动态配置、依赖其他 provider、异步初始化
```typescript
providers: [
  {
    provide: 'CONNECTION',
    useFactory: async (config: ConfigService) => {
      return await createDbConnection(config.dbUrl);
    },
    inject: [ConfigService] // 工厂依赖列表
  }
]
```
> 工厂支持 async，返回 Promise，容器等待 resolve 再注入

### 3.4 useExisting：别名，复用已有 provider
```typescript
{ provide: 'OldCatsService', useExisting: CatsService }
```

## 4. 注入令牌（Token）
- 类型令牌：直接用类（推荐，TS 类型友好）
- 字符串 / Symbol 令牌：用于常量、第三方、无类型类
- 字符串令牌必须配合 `@Inject('token')`

## 5. 可选依赖 @Optional()
依赖不一定存在，找不到不抛异常，值为 `undefined`
```typescript
constructor(@Optional() @Inject('LOGGER') logger?: Logger) {}
```

## 6. 基于属性的注入（@Inject() 写在属性上）
适合：基类继承场景，不推荐优先使用
```typescript
@Injectable()
export class BaseService {
  @Inject(ConfigService)
  private config: ConfigService;
}
```

## 7. 作用域 Scope（重要）
提供者三种作用域：
- **DEFAULT（默认）**：单例，整个应用只实例一次，全局复用
- **REQUEST**：每个请求单独实例，请求结束销毁；有性能开销
- **TRANSIENT**：每次被注入都新建实例

```typescript
@Injectable({ scope: Scope.REQUEST })
export class CatsService {}
```
> 注意：REQUEST 作用域提供者不能注入到全局守卫/拦截器（全局在应用启动时实例化）

## 8. 循环依赖（Circular dependency）
A 依赖 B，B 依赖 A，分两种：
### 8.1 同模块类互相依赖：`forwardRef()`
```typescript
// AService
constructor(@Inject(forwardRef(() => BService)) private b: BService) {}
// BService
constructor(@Inject(forwardRef(() => AService)) private a: AService) {}
```

### 8.2 模块之间循环导入（Module A import B，B import A）
模块 imports 同样使用 `forwardRef(() => OtherModule)`
```typescript
@Module({
  imports: [forwardRef(() => BModule)]
})
export class AModule {}
```
> 循环依赖尽量避免，优先重构代码拆分

## 9. 模块导出 & 共享模块回顾
- provider 默认模块内私有；需要对外暴露，放到 `exports:[]`
- 其他模块 `imports` 该模块，即可使用导出的 provider
- 共享模块：通用工具服务（日志、配置）封装，多处导入

## ✨ 重点总结
1. `@Injectable()` 标记可注入类，构造注入是标准写法；
2. 四种 provider：`useClass / useValue / useFactory / useExisting`；
3. Token 支持类、字符串、Symbol；字符串 token 需要 `@Inject()`；
4. `@Optional()` 标记依赖可选，不存在不报错；
5. Scope：DEFAULT单例 / REQUEST 请求级 / TRANSIENT 瞬时；REQUEST 有性能代价；
6. 循环依赖使用 `forwardRef`，优先规避；
7. 工厂 `useFactory` 支持异步，适合数据库连接、动态配置。

### 链路关联
Provider（提供者） + DI（依赖注入） + Module（模块） = Nest 核心组织模型
前面笔记：Controller 注入 Service，本质就是 DI

> 下一章：可以继续学习【自定义提供者 / 异步提供者】或者【生命周期】
