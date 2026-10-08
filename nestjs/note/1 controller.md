# NestJS 控制器学习笔记

## 一、控制器的作用

控制器负责处理传入的**请求**并向客户端返回**响应**。控制器的目的是处理应用程序的特定请求，路由机制决定了哪个控制器将处理每个请求。通常一个控制器具有多个路由，每个路由可以执行不同的操作。

要创建基本控制器，使用**类**和**装饰器**。装饰器将类与必要的元数据关联起来，使 Nest 能够创建将请求连接到相应控制器的路由映射。

**快速创建 CRUD 控制器**：使用 CLI 的 CRUD 生成器 `nest g resource [name]`，可自动生成带内置验证功能的控制器。

## 二、路由

### 2.1 基本路由定义

使用 `@Controller()` 装饰器声明控制器，可指定可选的路径前缀。路径前缀有助于将相关路由分组，减少重复代码。

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

**路由路径组合规则**：最终路由 = 控制器前缀 + 方法装饰器中的路径。例如控制器前缀为 `cats`，方法装饰器为 `@Get('breed')`，最终路由是 `GET /cats/breed`。

### 2.2 HTTP 方法装饰器

Nest 为所有标准 HTTP 方法提供了装饰器：

| 装饰器 | HTTP 方法 |
|---|---|
| `@Get()` | GET |
| `@Post()` | POST |
| `@Put()` | PUT |
| `@Delete()` | DELETE |
| `@Patch()` | PATCH |
| `@Options()` | OPTIONS |
| `@Head()` | HEAD |
| `@All()` | 所有方法 |

方法名称完全是任意的，Nest 不会对方法名称赋予任何特定含义。

### 2.3 响应处理方式

Nest 采用两种响应处理方式：

| 方式 | 说明 |
|---|---|
| **标准方式（推荐）** | 返回 JavaScript 对象或数组时自动序列化为 JSON；返回基本类型（string、number、boolean）时直接发送该值。默认状态码始终为 200，POST 请求除外（201）。 |
| **特定库实现** | 使用 `@Res()` 装饰器注入响应对象（如 Express 的 `response`），可使用原生响应处理方法，如 `response.status(200).send()`。 |

⚠️ 当检测到处理程序使用了 `@Res()` 或 `@Next()` 时，标准方式将自动禁用。若要同时使用两种方式，需要在方法中显式调用 `response.send()`。

## 三、请求对象与参数装饰器

Nest 提供了一组参数装饰器，用于从请求对象中提取数据：

| 装饰器 | 对应对象 | 说明 |
|---|---|---|
| `@Request()` / `@Req()` | `req` | 完整请求对象 |
| `@Response()` / `@Res()` | `res` | 响应对象（慎用，会禁用标准方式） |
| `@Next()` | `next` | 下一个中间件函数 |
| `@Session()` | `req.session` | 会话对象 |
| `@Param(param?)` | `req.params` | 路径参数 |
| `@Body(param?)` | `req.body` | 请求体 |
| `@Query(param?)` | `req.query` | 查询参数 |
| `@Headers(param?)` | `req.headers` | 请求头 |
| `@Ip()` | `req.ip` | 客户端 IP |
| `@HostParam()` | `req.hosts` | 子域路由的 host 参数 |

**路径参数示例**：

```typescript
@Get(':id')
findOne(@Param('id') id: string): Cat {
  return this.catsService.findOne(id);
}
```

**查询参数示例**：

```typescript
@Get()
async findAll(@Query('age') age: number, @Query('breed') breed: string) {
  return `过滤条件：age=${age}, breed=${breed}`;
}
```

### 自定义参数装饰器

当认证层将用户实体附加到 request 对象上时，可以创建自定义 `@User()` 装饰器，提高代码可读性：

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
```

使用时：

```typescript
@Get()
async findOne(@User() user: UserEntity) {
  console.log(user);
}

@Get()
async findOne(@User('firstName') firstName: string) {
  console.log(`Hello ${firstName}`);
}
```

管道同样会作用于自定义参数装饰器，也可以直接将管道应用于自定义装饰器。

## 四、状态码

默认情况下，响应的状态码为 200（POST 请求为 201）。使用 `@HttpCode()` 装饰器可以更改：

```typescript
@Post()
@HttpCode(201)
create() {
  return 'Created successfully';
}

@Get('not-found')
@HttpCode(404)
notFound() {
  return 'Resource not found';
}
```

## 五、请求负载与 DTO

对于 POST 请求，使用 `@Body()` 装饰器接收客户端参数。建议使用 **class** 而非 **interface** 定义 DTO，因为 TypeScript 接口在编译时会被移除，Nest 无法在运行时引用它们，而 Pipes 等特性依赖运行时元数据。

```typescript
// create-cat.dto.ts
export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}

// cats.controller.ts
@Post()
async create(@Body() createCatDto: CreateCatDto) {
  return 'This action adds a new cat';
}
```

`ValidationPipe` 可以过滤掉白名单之外的属性，自动剔除不需要的字段。

## 六、子域路由

`@Controller` 装饰器可以通过 `host` 参数指定子域路由：

```typescript
@Controller({ host: 'admin.example.com' })
export class AdminController {
  @Get()
  index(): string {
    return 'Admin page';
  }
}
```

host 也支持动态参数，通过 `@HostParam()` 装饰器获取值：

```typescript
@Controller({ host: ':account.example.com' })
export class AccountController {
  @Get()
  getInfo(@HostParam('account') account: string) {
    return account;  // 请求 alice.example.com 时返回 "alice"
  }
}
```

## 七、异步处理

Nest 完全支持 `async` 函数，每个 `async` 函数必须返回 `Promise`，Nest 会自动解析。

```typescript
@Get()
async findAll(): Promise<any[]> {
  return [];
}
```

Nest 还支持返回 RxJS Observable 流，Nest 会在内部处理订阅并在流完成时解析最终值：

```typescript
import { Observable, of } from 'rxjs';

@Get()
findAll(): Observable<any[]> {
  return of([]);
}
```

**选择建议**：数据库查询等一次性请求-响应场景推荐使用 `async + Promise`；已有 RxJS 基础或需要流式处理、返回多个事件时使用 `Observable`。

## 八、关键要点总结

1. **路由组合**：`@Controller('前缀')` + `@Get('路径')` = 完整路由路径
2. **参数获取**：优先使用 `@Param()`、`@Query()`、`@Body()` 等参数装饰器，而非直接操作 `@Req()`
3. **DTO 用 class**：确保运行时元数据可用，以便 Pipes 验证和转换
4. **标准响应方式**：直接返回值，Nest 自动处理序列化和状态码；慎用 `@Res()`，它会禁用标准方式
5. **异步支持**：既支持 `Promise`（async/await），也支持 `Observable`（RxJS）
6. **子域路由**：通过 `@Controller({ host: '...' })` 实现多租户等场景，用 `@HostParam()` 获取动态 host 值
7. **状态码**：用 `@HttpCode()` 装饰器覆盖默认状态码