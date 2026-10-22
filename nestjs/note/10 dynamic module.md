# NestJS 动态模块（精简版，只记用法）

> 
> 适用：封装带配置的模块（db、sdk、工具模块）

## 1. 静态模块 vs 动态模块

静态：配置写死；动态：导入时传参数，运行时配置。

## 2. 手写动态模块最简模板

1. 模块里写静态方法 `register / forRoot`，返回 `DynamicModule`
2. 把配置注册成 provider，内部 service 通过 token 注入

```
export const OPTIONS_TOKEN = 'MY_OPTIONS';

@Module({})
export class MyModule {
  static register(options: MyOptions): DynamicModule {
    return {
      module: MyModule,
      providers: [
        { provide: OPTIONS_TOKEN, useValue: options },
        MyService
      ],
      exports: [MyService]
    };
  }
}
```

service 获取配置：

```
constructor(@Inject(OPTIONS_TOKEN) private opts: MyOptions) {}
```

导入使用：

```
imports: [MyModule.register({ xxx: 1 })]
```

## 3. 命名约定（记住）

- `register`：可多次导入，各自配置独立
- `forRoot`：根模块全局一次性配置
- `forFeature`：基于 forRoot，子模块追加配置
- `registerAsync / forRootAsync`：异步获取配置

## 4. 推荐简化方案：ConfigurableModuleBuilder（少写样板）

```
const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<MyOptions>().build();

@Module({ providers: [MyService], exports: [MyService] })
export class MyModule extends ConfigurableModuleClass {}
```

自动支持：

```
MyModule.register({...})
MyModule.registerAsync({ useFactory: () => ({...}), inject: [] })
```

## 5. async 三选一

- useFactory：工厂函数（最常用）
- useClass：用一个类提供配置
- useExisting：复用已有 provider

## ✅ 一句话重点

动态模块 = 模块静态方法，接收配置，返回模块定义；优先用 `ConfigurableModuleBuilder`。

要不要我继续下一节精简版笔记？