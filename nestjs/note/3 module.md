# NestJS Modules（模块）学习笔记
> 文档来源：[https://docs.nestjs.cn/overview/modules](https://docs.nestjs.cn/overview/modules)

## 1. 模块基础概念
- 模块由 `@Module()` 装饰器修饰，提供元数据，用于组织、管理应用结构。
- **根模块**：每个Nest应用至少存在一个，是构建应用依赖关系图的起点。小型项目可只有根模块；大型项目建议拆分为多个模块，每个模块封装一组相关业务能力，遵循SOLID原则。

### @Module() 四大核心属性
| 属性 | 作用 |
|---|---|
| `providers` | 提供者，由Nest实例化，**默认仅本模块内部可用** |
| `controllers` | 当前模块需要实例化的控制器数组 |
| `imports` | 导入其他模块；使用对方`exports`导出的提供者 |
| `exports` | 向外暴露本模块的提供者；作为模块对外的公共API，供导入自己的模块使用 |

> 模块默认具备**封装性**：外部不能直接使用本模块的provider，必须通过`exports`导出后，其他模块`imports`导入才可以使用。

## 2. 功能模块 Feature Module
- 用途：把同一业务域的 Controller、Service 封装在一起，做业务拆分，隔离边界。
- CLI快速创建模块：`nest g module cats`

示例 cats.module.ts
```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```
根模块 app.module.ts 通过 `imports` 引入功能模块
```typescript
@Module({
  imports: [CatsModule]
})
export class AppModule {}
```

## 3. 共享模块 Shared Module
1. Nest中模块默认是**单例**，多个模块导入同一个模块，会复用同一套提供者实例，不会重复创建对象。
2. 如果要让别的模块使用自己内部的Service，需要把Service放到本模块的`exports`数组。
```typescript
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService] //导出，外部导入CatsModule即可使用CatsService
})
export class CatsModule {}
```
> 注意：不要在多个模块重复注册同一个Service，会生成多个实例，造成状态错乱、内存浪费。

### 模块再导出
可以导入模块同时再把它导出，相当于做中转：
```typescript
@Module({
  imports: [CommonModule],
  exports: [CommonModule] //再导出CommonModule
})
export class CoreModule {}
```

## 4. 模块类的依赖注入
模块本身的类构造函数也可以注入提供者，常用于配置读取。
```typescript
@Module({
  providers: [CatsService]
})
export class CatsModule {
  constructor(private catsService: CatsService) {}
}
```
⚠️ 限制：**模块类不能作为提供者被注入**，会引发循环依赖问题。

## 5. 全局模块 @Global()
- 使用 `@Global()` 装饰器标记模块，模块内`exports`的提供者变成**全局可用**；其他模块不需要在`imports`导入该模块，就可以直接注入使用。
```typescript
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  providers: [CatsService],
  exports: [CatsService]
})
export class CatsModule {}
```
> 最佳实践：**不建议大量使用全局模块**。会增加隐式耦合，降低代码可读性；一般只用于核心、工具类模块，并且只在根模块注册一次。可控的imports导入是优先方案。

## 6. 动态模块 DynamicModule
- 作用：运行时根据传入参数动态生成模块与提供者，实现可配置模块（数据库、配置模块典型场景）。
- 约定使用静态方法如 `forRoot()` 返回 `DynamicModule` 对象；返回的配置**扩展**而不是覆盖原有`@Module()`元数据。
```typescript
@Module({
  providers: [Connection],
  exports: [Connection]
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
      // global:true //可设置全局
    }
  }
}
```
导入使用：
```typescript
@Module({
  imports: [DatabaseModule.forRoot([User])]
})
export class AppModule {}
```
> 再导出动态模块，不需要重复调用`forRoot()`，直接写模块类即可。

## 7. 核心总结与最佳实践
1. 业务拆分使用**功能模块**，把同一业务的controller、service收拢；
2. 需要跨模块复用服务：模块中用`exports`导出，消费方`imports`导入；利用模块单例特性共享实例；
3. 少用`@Global()`，避免隐式依赖，优先显式import；
4. 动态模块用于需要运行时传参配置的场景（数据库、第三方SDK）；
5. 模块类可以注入Provider，但模块本身不能被当作Provider注入，防止循环依赖。

### 模块间流转流程图记忆
> Service(providers) → 宿主模块exports导出 → 其他模块imports导入 → 导入模块内的Controller/Service就可以注入使用。

---

### 和上一节【提供者Provider】关联回顾
1. Provider写在模块`providers`数组；
2. 本模块内部直接构造函数注入；
3. 跨模块必须`exports` + `imports`；
4. @Global可以跳过imports直接全局使用。