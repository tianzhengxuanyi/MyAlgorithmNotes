# NestJS 参数解析：@Param、@Body 及核心注解详解

## 一、HTTP 请求参数类型概述

### 四大参数类型

1. **Query 参数**
   - 传递方式：`URL?key=value` 格式拼接
   - 前端示例：`axios.get('/user', { params: { id: 123, name: 'test' } })`
   - 适用场景：分页、筛选、搜索等非核心参数传递

2. **Body 参数**
   - 传递方式：POST/PUT/PATCH 请求体中以 JSON 格式提交
   - 前端示例：`axios.post('/user', { username: 'test', password: '123456' })`
   - 适用场景：提交表单数据、创建/更新资源等核心数据传递

3. **Path 参数**
   - 传递方式：嵌入 URL 路径中的动态段，如 `/user/:id`
   - 前端示例：`axios.get('/user/123')`
   - 适用场景：删除、更新、获取特定资源等精准操作

4. **Headers 参数**
   - 传递方式：置于请求头中
   - 典型示例：`Authorization: Bearer <token>` 用于身份认证
   - 适用场景：身份验证、内容协商、跨域配置等

## 二、NestJS 核心注解机制

### 注解与参数类型映射

| 注解          | 用途                                  | 示例                                  |
|---------------|---------------------------------------|---------------------------------------|
| `@Body()`     | 获取请求体数据                        | `@Body() createUserDto: CreateUserDto` |
| `@Param()`    | 获取路径参数                          | `@Param('id') id: string`             |
| `@Query()`    | 获取查询字符串参数                    | `@Query('page') page: string`         |
| `@Request()`  | 获取完整请求对象（不推荐常规使用）    | `@Request() req: Request`             |
| `@Req()`      | `@Request()` 的简写形式               | `@Req() req: Request`                  |
| `@Headers()`  | 获取请求头参数                        | `@Headers('Authorization') token: string` |
| `@Ip()`       | 获取客户端 IP 地址                    | `@Ip() ip: string`                    |

### @Request() 使用注意事项

- **不推荐常规使用**：绕过 NestJS 封装的 HTTP 抽象层，需手动解析参数
- **适用场景**：调试、处理特殊 headers、复杂自定义逻辑
- **包含内容**：`req.query`、`req.params`、`req.body`、`req.headers`、`req.method`、`req.url` 等

## 三、各注解实操详解

### 1. @Body()：请求体参数解析

#### 开发流程

1. **临时占位符**：先使用 `dto: any` 快速验证接口功能
2. **DTO 替换**：后续替换为具体的 DTO（Data Transfer Object）类型，实现类型安全

#### DTO 详解

**什么是 DTO？**
- Data Transfer Object（数据传输对象）
- 用于定义 API 接口的请求/响应数据结构
- 实现类型安全，避免运行时错误
- 自动生成 API 文档（配合 Swagger）

**创建 DTO 示例**：
```typescript
// create-user.dto.ts
export class CreateUserDto {
  username: string;
  password: string;
  email?: string;
}
```

**使用 DTO**：
```typescript
@Post()
createUser(@Body() createUserDto: CreateUserDto) {
  // 自动获得类型提示和编译时检查
  return this.userService.create(createUserDto);
}
```

#### Postman 测试

- 请求路径：`POST /api/v1/user`（由 controller prefix 决定）
- 请求体（raw JSON）：
  ```json
  { "username": "test", "password": "123456" }
  ```
- 控制台输出：成功打印 `username` 和 `password` 字段值

### 2. @Param()：路径参数解析

#### 核心语法

- 基本用法：`@Param('id') id: string`（参数名必须与路径中 `:` 后标识符严格一致）
- 多参数支持：路径 `/user/:id/:name` 需分别使用 `@Param('id')` 和 `@Param('name')` 解析

#### 路由冲突解决方案

**问题根源**：`GET /user/:id` 会贪婪匹配所有以 `/user/` 开头的路径，导致 `/user/profile` 被误解析为 `id='profile'`

**推荐方案**：调整路由声明顺序
- 将静态路径（如 `/user/profile`）声明在动态路径（如 `/user/:id`）之前
- 实现“先匹配后兜底”的路由策略

**备选方案**：增加路径层级区分
- 如将动态路径改为 `/user/detail/:id`，与静态路径 `/user/profile` 明确区分

### 3. @Query()：查询参数解析

#### 两种使用方式

1. **获取全部查询参数**：`@Query() query: any`
   - 示例：`?id=123&name=tomark` → `{ id: '123', name: 'tomark' }`

2. **精确提取特定键**：`@Query('id') id: string`
   - 直接获取 query 中 `id` 字段的值，跳过整个对象解析

#### 测试验证

- 请求路径：`GET /user/profile?id=123&name=tomark`
- 控制台输出：正确打印 `id='123'` 和 `name='tomark'`

## 四、课程总结

### 核心知识点回顾

1. 掌握四类 HTTP 请求参数的传递方式与适用场景
2. 熟悉 NestJS 核心注解的使用方法与映射关系
3. 理解路由匹配优先级及冲突解决方案
4. 明确 `@Request()` 注解的使用约束
5. 掌握 DTO 的设计与使用方法

### 能力检验标准

1. 能够正确使用 `@Body()`、`@Param()`、`@Query()` 注解解析不同类型的请求参数
2. 能够解决路由匹配冲突问题
3. 能够选择合适的参数传递方式实现业务需求
4. 能够设计并使用 DTO 实现类型安全

### 常见陷阱与最佳实践

#### 常见陷阱

1. **路由顺序问题**：动态路由声明在静态路由之前导致匹配错误
2. **参数类型错误**：默认获取的参数均为字符串类型，需手动转换
3. **过度使用 `@Request()`**：绕过 NestJS 封装，增加代码复杂度
4. **DTO 滥用**：将业务逻辑放入 DTO 中，导致职责不清

#### 最佳实践

1. **路由声明顺序**：静态路由在前，动态路由在后
2. **参数类型转换**：使用管道（Pipe）自动转换参数类型
3. **注解选择**：优先使用特定注解（`@Body()`、`@Param()`、`@Query()`）而非 `@Request()`
4. **DTO 职责**：仅用于数据传输，不包含业务逻辑

### 自我测试

1. 如何获取请求头中的 Authorization 信息？
2. 当路由 `/user/:id` 与 `/user/profile` 冲突时，如何解决？
3. DTO 的作用是什么？如何在 NestJS 中使用？
4. `@Request()` 注解的使用场景是什么？为什么不推荐常规使用？

---

**（内容由 AI 生成，经校准优化）**
