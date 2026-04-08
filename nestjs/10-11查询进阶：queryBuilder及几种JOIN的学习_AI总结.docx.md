# NestJS 查询进阶：Query Builder 与 JOIN 语义详解

## 一、Query Builder 核心概念

### 1. 什么是 Query Builder

TypeORM 的 Query Builder 是一种链式查询语法工具，具有以下特点：

- **语义化强**：类似前端 jQuery 风格的链式调用
- **灵活度高**：支持构建复杂的 SQL 查询
- **类型安全**：自动处理参数绑定，防止 SQL 注入
- **可读性好**：代码结构清晰，易于维护

### 2. 基本用法

#### 创建实例

```typescript
// 方式一：通过 Repository 创建
const qb = this.userRepository.createQueryBuilder('user');

// 方式二：通过 Entity Manager 创建
const qb = this.entityManager.createQueryBuilder(User, 'user');
```

#### 链式调用示例

```typescript
const users = await qb
  .leftJoinAndSelect('user.profile', 'profile')
  .leftJoinAndSelect('user.roles', 'role')
  .where('user.username = :username', { username: 'test' })
  .andWhere('profile.gender = :gender', { gender: 'male' })
  .getMany();
```

## 二、JOIN 类型语义辨析

### 1. JOIN 类型对比

| JOIN 类型       | 语义说明                                  | 适用场景                                  |
|-----------------|-------------------------------------------|-------------------------------------------|
| **INNER JOIN**  | 取两张表的交集，仅返回匹配记录            | 需要确保关联表存在对应数据的场景          |
| **LEFT JOIN**   | 返回左表全部记录，右表无匹配时填充 NULL   | 需要保留左表全部数据的场景（如用户列表）  |
| **RIGHT JOIN**  | 返回右表全部记录，左表无匹配时填充 NULL   | 较少使用，可通过交换表顺序用 LEFT JOIN 替代 |
| **FULL OUTER JOIN** | 返回两张表的全部记录，无匹配时填充 NULL | MySQL 不原生支持，需用 UNION 模拟          |

### 2. 实际应用示例

#### INNER JOIN 示例

```typescript
const usersWithRoles = await qb
  .innerJoinAndSelect('user.roles', 'role')
  .getMany();
```

**结果**：仅返回拥有角色的用户

#### LEFT JOIN 示例

```typescript
const allUsers = await qb
  .leftJoinAndSelect('user.roles', 'role')
  .getMany();
```

**结果**：返回所有用户，无角色者 `roles` 字段为 `[]`

## 三、联合查询实现

### 1. 关联 Profile 表

```typescript
qb.leftJoinAndSelect('user.profile', 'profile');
```

### 2. 关联 Role 表

```typescript
qb.leftJoinAndSelect('user.roles', 'role'); // 注意：视频中口误为 'rose'
```

### 3. getMany() vs getRawMany()

| 方法名         | 返回结果特点                                  | 适用场景                                  |
|----------------|-------------------------------------------|-------------------------------------------|
| `getMany()`    | 返回结构化实体对象，含嵌套 relation        | 需要直接使用实体对象的场景                |
| `getRawMany()` | 返回扁平化结果，字段名以下划线拼接（如 `profile_gender`） | 需要自定义结果结构的场景                  |

## 四、动态 WHERE 条件构建

### 1. 多条件并联逻辑

```typescript
const { username, gender, roleId } = query;

// 初始化查询
const qb = this.userRepository.createQueryBuilder('user');

// 动态添加条件
if (username) {
  qb.where('user.username = :username', { username });
} else {
  qb.where('1=1'); // 占位条件，避免 WHERE 子句为空
}

if (gender) {
  qb.andWhere('profile.gender = :gender', { gender });
}

if (roleId) {
  qb.andWhere('role.id = :roleId', { roleId });
}
```

### 2. 避免 WHERE 被覆盖

- **`where()`**：重置已有条件，仅保留当前条件
- **`andWhere()`**：追加新条件，与已有条件为 AND 关系
- **`orWhere()`**：追加新条件，与已有条件为 OR 关系

### 3. 空值安全的条件注入

```typescript
// 推荐写法：使用 1=1 作为占位条件
const qb = this.userRepository.createQueryBuilder('user')
  .leftJoinAndSelect('user.profile', 'profile')
  .leftJoinAndSelect('user.roles', 'role')
  .where('1=1'); // 占位条件，避免 WHERE 子句为空

if (username) {
  qb.andWhere('user.username = :username', { username });
}

if (gender) {
  qb.andWhere('profile.gender = :gender', { gender });
}

if (roleId) {
  qb.andWhere('role.id = :roleId', { roleId });
}
```

## 五、SQL 日志调试与问题定位

### 1. 启用日志

```typescript
// ormconfig.json
{
  "logging": true
}
```

### 2. 日志分析

启用日志后，终端会输出完整的 SQL 语句及参数绑定信息：

```sql
SELECT user.*, profile.*, role.*
FROM user
LEFT JOIN profile ON user.id = profile.userId
LEFT JOIN role ON user.id = role.userId
WHERE user.username = ? AND profile.gender = ?
-- 参数: ['test', 'male']
```

### 3. 典型错误排查

**错误现象**：SQL 中出现 `WHERE user.username = 'law'`（硬编码值）

**问题根源**：未对参数进行空值判断，导致默认值被硬编码

**修复方案**：使用动态条件注入，确保参数不存在时不添加条件

## 六、最佳实践与常见陷阱

### 常见陷阱

1. **WHERE 条件被覆盖**：连续使用 `where()` 导致之前的条件被重置
2. **空值参数处理不当**：未对空值参数进行判断，导致 SQL 语法错误
3. **JOIN 类型选择错误**：使用 INNER JOIN 导致左表数据丢失

### 最佳实践

1. **使用 1=1 占位**：避免 WHERE 子句为空的情况
2. **优先使用 andWhere**：追加条件时使用 `andWhere()` 而非 `where()`
3. **参数绑定**：始终使用参数绑定（`{ username: 'test' }`）而非字符串拼接
4. **日志调试**：开发环境启用 SQL 日志，便于调试复杂查询

## 七、自我测试

1. Query Builder 与普通 `find()` 方法相比有哪些优势？
2. INNER JOIN 与 LEFT JOIN 的主要区别是什么？
3. 如何避免 WHERE 条件被覆盖？
4. `getMany()` 与 `getRawMany()` 的返回结果有什么不同？

---

**（内容由 AI 生成，经校准优化）**
