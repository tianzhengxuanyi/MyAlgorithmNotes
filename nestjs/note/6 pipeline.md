# NestJS 管道（Pipes）学习笔记

> 
> 文档来源：[https://docs.nestjs.cn/overview/pipes](https://docs.nestjs.cn/overview/pipes)

## 1. 管道基础概念

- 管道是被 `@Injectable()` 装饰、实现 `PipeTransform` 接口的类。
- **两大核心用途**
  1. **转换**：把输入数据转为目标格式（字符串转数字等）；
  2. **验证**：校验输入数据，合法直接放行，不合法抛出异常。
- 执行时机：**控制器方法调用之前**，处理路由方法的入参；`transform` 返回值会完全覆盖原参数。
- 异常机制：管道抛出的异常会直接交给**异常过滤器层**处理；一旦抛异常，控制器方法不会执行。

## 2. Nest 内置管道（`@nestjs/common`）

| 管道 | 作用 |
| --- | --- |
| `ValidationPipe` | DTO 对象验证（class‑validator） |
| `ParseIntPipe` | 字符串转数字，失败抛400 |
| `ParseFloatPipe` | 解析浮点数 |
| `ParseBoolPipe` | 解析布尔值 |
| `ParseArrayPipe` | 解析数组 |
| `ParseUUIDPipe` | 校验/解析UUID，可指定版本 |
| `ParseEnumPipe` | 校验枚举 |
| `DefaultValuePipe` | 参数缺失时设置默认值 |
| `ParseDatePipe` | 解析日期 |
| `ParseFilePipe` | 文件校验 |

### 内置管道绑定示例

**参数级别绑定（写在 @Param / @Query / @Body 第二个参数）**

```
// 将id参数转为数字，转换失败直接抛异常
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {}

// 自定义错误状态码，传入实例
@Get(':id')
async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: 406 })) id: number) {}

// 默认值 + 类型解析组合
@Get()
async findAll(
  @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number
) {}
```

> 
> 优先传**类名**，交给框架实例化，支持依赖注入；需要配置选项时才 new 实例。

## 3. 自定义管道

### 接口定义

必须实现 `PipeTransform<T,R>`，实现 `transform(value, metadata)` 方法：

```
interface PipeTransform<T, R> {
  transform(value: T, metadata: ArgumentMetadata): R;
}
```

- `value`：待处理的入参原始值
- `metadata` 参数元数据对象

```
interface ArgumentMetadata {
  type: 'body' | 'query' | 'param' | 'custom'; // 参数来源
  metatype?: Type<unknown>; // DTO/类型类，JS/interface时为Object
  data?: string; // @Body('name')中的name，无则undefined
}
```

简单自定义管道模板：

```
import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class MyPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
```

> 
> 注意：TS接口编译后被擦除，如果DTO使用interface，`metatype` 是 `Object`，验证会失效，**验证必须用class类**。

### 两种自定义验证方案

#### 方案1：Zod 模式验证

1. 安装 zod；定义 schema；管道接收schema做 `.parse()`；失败抛 `BadRequestException`。
2. 使用 `@UsePipes(管道实例)` 绑定到方法。

```
@Post()
@UsePipes(new ZodValidationPipe(createCatSchema))
async create(@Body() dto: CreateCatDto) {}
```

#### 方案2：class‑validator + class‑transformer（主流）

1. 安装依赖：`npm i class‑validator class‑transformer`
2. DTO类上加校验装饰器 `@IsString()`、`@IsInt()`；
3. 管道内部用 `plainToInstance` 将普通js对象转为DTO类实例；
4. `validate()` 校验对象，校验失败抛出异常。

> 
> ⚠️ Nest已经内置`ValidationPipe`，生产环境直接使用，示例代码仅用于理解原理。

## 4. 管道四种绑定作用域

1. **参数级别**：写在`@Body/@Param/@Query`第二个参数，仅作用该单个参数。

```
async create(@Body(new ValidationPipe()) dto: CreateCatDto) {}
```

2. **方法级别**：`@UsePipes()` 装饰器，作用整个路由方法所有参数。

```
@Post()
@UsePipes(ValidationPipe)
async create(){}
```

3. **控制器级别**：`@UsePipes()`写在控制器类上，控制器全部接口生效。

```
@Controller()
@UsePipes(ValidationPipe)
export class CatsController {}
```

4. **全局级别**
① main.ts，缺点：**无法依赖注入**

```
app.useGlobalPipes(new ValidationPipe());
```

② Module注册令牌 `APP_PIPE`，**支持DI注入（推荐）**

```
@Module({
  providers: [
    { provide: APP_PIPE, useClass: ValidationPipe }
  ]
})
export class AppModule {}
```

> 
> 提示：`useGlobalPipes()` 不会对网关生效；微服务标准应用可以生效。

## 5. 转换管道示例（ParseInt简易实现）

`transform` 返回值会覆盖入参，完成数据转换；校验失败抛异常阻断流程。

```
@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string) {
    const num = parseInt(value,10);
    if(isNaN(num)) throw new BadRequestException();
    return num;
  }
}
```

## ✨ 重点总结

1. 管道两个能力：**转换数据、校验入参**，运行在控制器方法执行前；抛异常直接交给异常过滤器。
2. 绑定：参数/@UsePipes(方法/控制器)/全局；全局需要DI用`APP_PIPE`。
3. 验证DTO必须是class，不能用interface，否则metatype丢失校验失效。
4. 绑定管道优先传**类名**，不要手动new，方便依赖注入；需要配置参数时再实例化。
5. 内置`ValidationPipe`已经封装class‑validator，业务开发直接使用，不必重复造轮子。

### 请求链路回顾

中间件 → 守卫 → 拦截器 → **管道** → 控制器；管道抛出异常直接跳转到异常过滤器。

> 
> 上一章：异常过滤器；下一章：守卫(Guard)