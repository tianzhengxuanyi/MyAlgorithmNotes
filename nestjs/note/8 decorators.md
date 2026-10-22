# NestJS 自定义装饰器学习笔记
> 文档来源：[https://docs.nestjs.cn/overview/custom-decorators](https://docs.nestjs.cn/overview/custom-decorators)

## 1. 内置参数装饰器
Nest内置参数装饰器，直接从请求对象提取数据：

| 装饰器 | 等价原生对象 |
|---|---|
| `@Request() / @Req()` | `req` |
| `@Response() / @Res()` | `res` |
| `@Next()` | `next` |
| `@Session()` | `req.session` |
| `@Param(param?)` | `req.params / req.params[param]` |
| `@Body(param?)` | `req.body / req.body[param]` |
| `@Query(param?)` | `req.query / req.query[param]` |
| `@Headers(param?)` | `req.headers / req.headers[param]` |
| `@Ip()` | `req.ip` |
| `@HostParam()` | `req.hosts` |

## 2. 自定义参数装饰器 `createParamDecorator`
- 使用 `createParamDecorator` 创建**参数装饰器**，作用于控制器方法参数，从执行上下文读取请求数据。
- 回调接收两个参数：
  1. `data`：调用装饰器传入的参数；
  2. `ctx: ExecutionContext`：执行上下文，可以拿到 request / response。

### 基础示例 @User()
```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// 不传参数，直接返回整个user对象
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  }
);
```
控制器使用：
```typescript
@Get()
async findOne(@User() user: UserEntity) {}
```

### 接收参数的自定义装饰器
`data`接收传入的key，可以提取user对象指定字段：
```typescript
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    return data ? user?.[data] : user;
  }
);
```
控制器使用：
```typescript
// 只取 user.firstName
@Get()
async findOne(@User('firstName') firstName: string) {}
```

## 3. 自定义参数装饰器配合管道
- Nest把自定义参数装饰器和`@Body/@Param`同等对待，可以附加管道。
- ⚠️ `ValidationPipe` 默认**不会校验自定义装饰器参数**，需要开启 `validateCustomDecorators: true`。

```typescript
@Get()
async findOne(
  @User(new ValidationPipe({ validateCustomDecorators: true }))
  user: UserEntity
) {}
```

## 4. 装饰器组合 `applyDecorators`
`applyDecorators()` 可以把多个装饰器合并成一个，简化代码，常用于权限、接口文档。

```typescript
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function Auth(...roles: string[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: '未授权' })
  );
}
```

控制器直接使用合并后的装饰器：
```typescript
@Get('users')
@Auth('admin')
findAllUsers() {}
```
> 注意：`@nestjs/swagger` 的 `@ApiHideProperty()` **不能被组合**，无法在`applyDecorators`内生效。

## ✨重点总结
1. `createParamDecorator`：创建**参数装饰器**，写在控制器参数上，读取请求上下文数据；回调参数 `data` 接收调用时传入的值，`ctx`拿到执行上下文。
2. 自定义参数装饰器搭配校验管道，必须开启`validateCustomDecorators:true`。
3. `applyDecorators()`：**合并多个类/方法装饰器**，封装权限、接口文档等重复注解。
4. 区分：
    - `createParamDecorator` → **参数装饰器**（写在函数参数）
    - `Reflector.createDecorator` / `SetMetadata` → **给方法/类打元数据标记**，配合守卫读取元数据。

### 相关回顾
守卫章节：`Reflector.createDecorator` 生成**方法/类装饰器**用于设置元数据；
本章节：`createParamDecorator`生成**参数装饰器**用于提取请求参数。

> 下一章：自定义提供程序