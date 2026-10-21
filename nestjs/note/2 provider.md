# NestJS Providers（提供者）学习笔记
> 文档来源：[https://docs.nestjs.cn/overview/providers](https://docs.nestjs.cn/overview/providers)

## 1. 什么是提供者 Provider
- Provider 是 Nest 核心概念，**服务、仓库、工厂、工具类**都属于提供者。
- 核心能力：**可作为依赖被注入到其他类**，对象之间的依赖装配由 Nest IoC 容器自动完成。
- 职责分工：**Controller 处理HTTP请求，把业务逻辑委托给 Provider（Service）执行**。
- 提示：开发建议遵循 **SOLID** 设计原则。

## 2. @Injectable() 装饰器
- `@Injectable()`：标记类交给 Nest IoC 容器管理，使其可以被依赖注入。
- 示例：
```typescript
import { Injectable } from '@nestjs/common';
@Injectable()
export class CatsService {}
```
- CLI快速生成服务：`nest g service cats`

## 3. 依赖注入（DI）
- Nest 基于**依赖注入模式**，依靠 TypeScript 类型解析依赖。
- **构造函数注入（推荐）**：控制器通过构造函数接收服务实例，`private` 简写可以同时声明+初始化成员变量。
```typescript
@Controller('cats')
export class CatsController {
  // 构造函数注入
  constructor(private catsService: CatsService) {}
}
```

### 注入两种方式
1. **构造函数注入（优先使用）**：依赖项一目了然，可读性好。
2. **属性注入 @Inject()**：适合继承场景，子类`super()`传递依赖很麻烦时使用；非继承场景不推荐。
```typescript
@Injectable()
export class HttpService {
  @Inject('HTTP_OPTIONS')
  private readonly httpClient;
}
```

### 可选依赖 @Optional()
依赖不是必须存在，缺失时不抛出异常，使用默认值。
```typescript
constructor(@Optional() @Inject('HTTP_OPTIONS') private httpClient) {}
```

## 4. 提供者作用域 Scope
1. **默认（单例）**：应用启动实例化一次；整个应用共享同一个实例，应用关闭销毁。
2. **请求作用域 request‑scoped**：每个HTTP请求新建实例，请求结束销毁实例。

> 更多细节参考「注入作用域」章节。

## 5. 注册提供者（模块中声明）
定义完 Service 后，必须在模块 `@Module()` 的 `providers` 数组注册，IoC容器才能够识别。
```typescript
@Module({
  controllers: [CatsController],
  providers: [CatsService] //注册提供者
})
export class AppModule {}
```

## 6. 目录参考示例
```
src
└─ cats
   ├─ dto
   │  └─ create‑cat.dto.ts
   ├─ interfaces
   │  └─ cat.interface.ts
   ├─ cats.controller.ts
   └─ cats.service.ts
app.module.ts
main.ts
```

## 7. 其他要点
1. **自定义提供者**：支持普通值、类、同步/异步工厂等多种形式，参考「自定义提供者」章节。
2. **手动获取实例**：脱离IoC自动注入，可以使用**模块引用**、**独立应用**方式手动实例化提供者。

## 8. 最佳实践
✅ 优先使用**构造函数注入**；
✅ 业务逻辑写在 Service(Provider)，Controller 只做请求转发；
✅ Service 必须加 `@Injectable()`，模块中 `providers` 数组注册；
⚠️ 属性注入仅用于继承特殊场景。

---

### 简单业务流程总结
1. 写Service，加`@Injectable()`实现业务；
2. Module的`providers`注册该Service；
3. Controller构造函数注入Service；
4. Controller接收http请求，调用Service完成业务。