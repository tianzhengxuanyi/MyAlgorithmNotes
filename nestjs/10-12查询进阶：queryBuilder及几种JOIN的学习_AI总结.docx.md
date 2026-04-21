# NestJS 查询进阶：Query Builder 条件优化与工具封装

## 一、问题引入：if-else 过多导致代码冗余

### 1. 代码可读性问题

当存在多个查询条件时，使用大量 `if-else` 语句会导致代码冗长、难以维护：

```typescript
// 传统写法：大量 if-else
const qb = this.userRepository.createQueryBuilder('user');

if (query.username) {
  qb.where('user.username = :username', { username: query.username });
} else {
  qb.where('1=1');
}

if (query.gender) {
  qb.andWhere('profile.gender = :gender', { gender: query.gender });
}

if (query.roleId) {
  qb.andWhere('role.id = :roleId', { roleId: query.roleId });
}
```

### 2. 极端情况复杂度

若有数十甚至上百个查询条件，直接使用 `if-else` 将极大增加出错概率和开发成本。

## 二、解决方案：WHERE 1=1 + 动态参数拼接

### 1. 核心思路

利用 `WHERE 1=1` 作为恒真条件，后续所有查询条件以 `AND` 连接，实现动态拼接：

```typescript
// 优化写法：WHERE 1=1 + 动态条件
const qb = this.userRepository.createQueryBuilder('user')
  .leftJoinAndSelect('user.profile', 'profile')
  .leftJoinAndSelect('user.roles', 'role')
  .where('1=1');

// 动态添加条件
if (query.username) {
  qb.andWhere('user.username = :username', { username: query.username });
}

if (query.gender) {
  qb.andWhere('profile.gender = :gender', { gender: query.gender });
}

if (query.roleId) {
  qb.andWhere('role.id = :roleId', { roleId: query.roleId });
}
```

### 2. 优势说明

- **避免复杂判断**：无需处理第一个条件的特殊情况
- **统一模板结构**：SQL 模板结构一致，易于扩展
- **降低维护成本**：新增条件只需添加一行代码

## 三、动态查询条件对象构建

### 1. 映射对象结构

创建一个对象，其 key 为数据库字段路径，value 为前端传入的查询值：

```typescript
const queryConditions = {
  'user.username': query.username,
  'profile.gender': query.gender,
  'role.id': query.roleId
};
```

### 2. 遍历生成动态条件

使用 `Object.keys()` 遍历映射对象，逐个判断字段是否存在有效值：

```typescript
for (const key of Object.keys(queryConditions)) {
  const value = queryConditions[key];
  if (value) {
    qb.andWhere(`${key} = :${key}`, { [key]: value });
  }
}
```

### 3. 参数绑定一致性

冒号后的参数名必须与对象中的 key 名称一致，才能完成正确替换。

## 四、封装可复用工具函数

### 1. 创建 DB Helper 模块

在 `src/utils/db-helper.ts` 中封装工具函数：

```typescript
import { SelectQueryBuilder } from 'typeorm';

export const conditionUtils = <T>(
  queryBuilder: SelectQueryBuilder<T>,
  conditions: Record<string, unknown>
) => {
  for (const key of Object.keys(conditions)) {
    const value = conditions[key];
    if (value !== undefined && value !== null && value !== '') {
      queryBuilder.andWhere(`${key} = :${key}`, { [key]: value });
    }
  }
  return queryBuilder;
};
```

### 2. 泛型支持增强类型安全

使用泛型 `T` 指定实体类型，确保查询构建器类型正确：

```typescript
export const conditionUtils = <T>(
  queryBuilder: SelectQueryBuilder<T>,
  conditions: Record<string, unknown>
) => {
  // ... 实现代码
};
```

## 五、工具函数使用示例

### 1. 在 Service 中调用

```typescript
// user.service.ts
import { conditionUtils } from '../utils/db-helper';

async getUsers(query: GetUserDto) {
  const { page = 1, limit = 10, ...filters } = query;
  
  const qb = this.userRepository.createQueryBuilder('user')
    .leftJoinAndSelect('user.profile', 'profile')
    .leftJoinAndSelect('user.roles', 'role')
    .where('1=1');
  
  // 构建查询条件映射
  const queryConditions = {
    'user.username': filters.username,
    'profile.gender': filters.gender,
    'role.id': filters.roleId
  };
  
  // 使用工具函数添加条件
  conditionUtils(qb, queryConditions);
  
  // 添加分页
  const take = parseInt(limit as string);
  const skip = (parseInt(page as string) - 1) * take;
  qb.take(take).skip(skip);
  
  return qb.getMany();
}
```

### 2. 功能测试

#### 单条件测试

```http
GET /users?gender=male
```

**结果**：返回所有性别为男性的用户

#### 多条件联合测试

```http
GET /users?username=test&gender=male&roleId=1
```

**结果**：返回用户名包含 test、性别为男性且角色为管理员的用户

## 六、扩展功能：分页支持

### 1. 分页参数处理

```typescript
// 添加分页逻辑
const take = parseInt(limit as string);
const skip = (parseInt(page as string) - 1) * take;
qb.take(take).skip(skip);
```

### 2. 与条件查询无缝集成

分页操作应在所有动态条件拼接完成后执行，确保分页基于过滤后的结果。

## 七、常见陷阱与最佳实践

### 常见陷阱

1. **空值处理不当**：未对空值参数进行判断，导致 SQL 语法错误
2. **参数名不一致**：冒号后的参数名与对象 key 不匹配，导致参数绑定失败
3. **顺序错误**：分页操作应在条件拼接完成后执行

### 最佳实践

1. **使用 WHERE 1=1**：避免 WHERE 子句为空的情况
2. **统一参数命名**：确保参数名与数据库字段路径一致
3. **封装工具函数**：将重复的条件拼接逻辑抽离，提高代码复用性
4. **添加类型检查**：使用泛型增强类型安全

## 八、进一步优化方向

1. **支持 OR 条件**：扩展工具函数支持 OR 逻辑
2. **模糊查询**：添加 LIKE 查询支持
3. **范围查询**：支持大于、小于等范围条件
4. **排序支持**：动态添加排序条件

## 九、自我测试

1. 使用 WHERE 1=1 的优势是什么？
2. 如何避免参数绑定失败？
3. 工具函数封装的好处是什么？
4. 分页操作应在何时执行？

---

**（内容由 AI 生成，经校准优化）**