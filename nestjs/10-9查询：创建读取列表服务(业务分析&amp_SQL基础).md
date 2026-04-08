# NestJS 查询服务：创建读取列表服务（业务分析与SQL基础）

## 一、DTO 设计与使用

### 1. DTO 定义

创建并导出 `GetUserDto` 接口，确保查询参数的一致性和可复用性：

```typescript
// get-user.dto.ts
export interface GetUserDto {
  page?: string;
  pageSize?: string;
  roleId?: string;
  username?: string;
}
```

### 2. DTO 应用

在 Controller 和 Service 中导入并使用该接口：

```typescript
// user.controller.ts
import { Get, Query } from '@nestjs/common';
import { GetUserDto } from './dto/get-user.dto';

@Get()
getUsers(@Query() query: GetUserDto) {
  return this.userService.getUsers(query);
}
```

## 二、联合查询实现

### 1. 业务需求

实现基于用户表、角色表和 profile 表的联合查询，获取完整的用户信息。

### 2. SQL 联合查询写法

#### 写法一：WHERE 条件关联

```sql
SELECT u.*, r.name as role_name, p.*
FROM user u, role r, profile p
WHERE u.role_id = r.id AND u.id = p.user_id;
```

#### 写法二：LEFT JOIN 语法（推荐）

```sql
SELECT u.*, r.name as role_name, p.*
FROM user u
LEFT JOIN role r ON u.role_id = r.id
LEFT JOIN profile p ON u.id = p.user_id;
```

### 3. 最佳实践

- **优先使用 LEFT JOIN**：更清晰地表达表之间的关联关系
- **明确查询目标**：以用户表为主表，关联角色表和 profile 表
- **确保数据完整性**：通过外键约束保证关联数据的准确性

## 三、分页功能实现

### 1. SQL 分页基础

使用 `LIMIT` 和 `OFFSET` 实现分页：

```sql
SELECT * FROM user
LIMIT 10 OFFSET 0; -- 第一页，每页10条
```

### 2. TypeORM 分页优势

- 无需手动编写复杂的 SQL 分页语句
- 自动处理参数类型转换
- 提供更安全的查询方式

### 3. 参数类型转换

- 当前 query 参数默认全部为 string 类型
- 需要将 page 和 pageSize 转换为 number 类型
- 可以使用 NestJS 管道（Pipe）自动转换

## 四、TypeORM 核心概念

### 1. Entity Manager 与 Repository

- **Entity Manager**：通用的实体管理器，适用于所有实体
- **Repository**：特定实体的管理器，提供更便捷的操作方法

### 2. Find Options 详解

TypeORM 的 `find` 方法支持丰富的查询选项：

```typescript
const users = await this.userRepository.find({
  where: { roleId: 1 },
  relations: ['role', 'profile'],
  skip: 0,
  take: 10,
  order: { createdAt: 'DESC' }
});
```

### 3. SQL Log 功能

通过配置 TypeORM 的日志功能，可以对比原生 SQL 与 ORM 生成的 SQL：

```typescript
// ormconfig.json
{
  "logging": true
}
```

## 五、学习资源与实践

### 1. 官方文档

- **TypeORM 官网**：https://typeorm.io/
- **中文文档**：https://typeorm.biunav.com/zh/

### 2. 重点学习内容

1. **Find Options**：掌握各种查询条件的使用
2. **Relations**：学习如何实现表关联查询
3. **Pagination**：理解分页功能的实现原理

### 3. 实践任务

1. 实现用户列表的联合查询（包含角色和 profile 信息）
2. 实现分页功能（支持 page 和 pageSize 参数）
3. 使用 TypeORM 日志功能验证生成的 SQL 语句

## 六、常见陷阱与最佳实践

### 常见陷阱

1. **N+1 查询问题**：未正确配置 relations 导致多次查询
2. **参数类型错误**：未将 string 类型的分页参数转换为 number
3. **过度使用原生 SQL**：忽略 ORM 提供的安全查询方式

### 最佳实践

1. **使用 Relations**：通过 TypeORM 自动处理表关联
2. **使用管道转换参数**：确保参数类型正确
3. **优先使用 ORM 查询**：提高代码可读性和安全性

## 七、自我测试

1. DTO 的作用是什么？如何在 NestJS 中使用？
2. 联合查询的两种写法是什么？推荐使用哪种？
3. 如何使用 TypeORM 实现分页查询？
4. TypeORM 的 Entity Manager 和 Repository 有什么区别？

---

**（内容由 AI 生成，经校准优化）**
