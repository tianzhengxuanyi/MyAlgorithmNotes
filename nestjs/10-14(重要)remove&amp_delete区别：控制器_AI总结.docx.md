# 10-14 (重要) remove & delete 区别：控制器设计

## 课程概述
本课程讲解TypeORM中`remove`与`delete`方法的核心区别，以及NestJS三层架构（Controller、Service、Repository）的命名规范与职责划分。重点内容包括：
- `remove`方法可触发实体监听器（如`@AfterRemove`）
- `delete`方法为硬删除且不触发钩子
- Controller应采用语义化命名（如`removeUser`）
- Service与Repository建议一一对应，复杂业务需拆分以提升可维护性

![课程截图](./images/10-14(重要)remove&amp_delete区别：控制器_AI总结.docx_img1.jpg)

---

## 一、三层架构命名与职责

### 1. Controller层

#### 命名规范
- 方法名应语义化，使用驼峰命名法（小写开头）
- 以`get`/`find`/`create`/`update`/`remove`等动词开头，后接具体业务功能
- 示例：`findAllUsers`、`getUserById`、`createUser`、`updateUser`、`removeUser`

#### 职责
- 处理HTTP请求与响应
- 验证输入参数
- 调用Service层处理业务逻辑
- 返回标准化响应格式

### 2. Service层

#### 命名规范
- 与Repository名称一一对应（如`UserService` ↔ `UserRepository`）
- 采用业务领域命名，如`OrderService`、`ProductService`

#### 职责
- 承载核心业务逻辑
- 处理异常与错误抛出
- 协调多个Repository之间的交互
- 执行事务管理

### 2. 防御性编程
- **可选链操作符**：`exception?.errno` - 避免空值访问导致的运行时错误
- **类型断言**：`exception as QueryFailedError` - 确保TypeScript类型安全
- **精确类型判断**：使用`instanceof`而非`typeof`进行类型检查，避免笼统的异常处理
- **错误信息脱敏**：避免在响应中暴露敏感信息（如数据库表名、字段名）

### 3. 提交规范
```bash
# 清理调试代码
git add .
# 提交信息遵循Conventional Commits规范
git commit -m "feat(user): add typeorm filter for duplicate username handling"
```

#### 拆分时机
当单个Service满足以下条件时，应拆分为独立Service与Repository：
- 方法数≥6-7个
- 总行数接近300行
- 包含大量Query Builder复杂SQL

### 3. Repository层

#### 命名规范
- 严格遵循“一个Repository对应一个实体类（Entity）”原则
- 实体类映射数据库表结构，字段与数据库真实列一一对应

#### 职责
- 专责数据库交互
- 仅包含SQL操作逻辑（如`createQueryBuilder`、`insert`、`remove`等）
- 实现数据访问层的封装

### 4. 依赖关系与注入机制

#### 技术栈
- **OOP**：面向对象编程，使用Class封装业务逻辑
- **AOP**：面向切面编程，实现横切关注点（如日志、事务）

#### 注入链
```
Controller → Service → Repository
```

通过`@Inject()`将类注册至DI容器，实现依赖注入。

### 5. 拆分优势与可替换性

- **技术栈独立**：若需将TypeORM切换为Sequelize或Prisma，仅需重写Repository层
- **业务逻辑复用**：Service层逻辑无需修改，避免逐个调整SQL语句
- **可维护性提升**：单一职责原则，降低模块间耦合度

---

## 二、remove vs. delete 核心区别

### 1. delete方法特性

#### 本质
**硬删除（hard delete）**：直接从数据库物理移除记录，不可逆，无数据残留。

#### 关键特点
- 不触发任何TypeORM实体监听器（Listeners）
- 无法执行清理、审计、归档等副作用逻辑
- 性能更高，因为无需先查询再删除

#### 适用场景
- 非敏感、低价值数据
- 日志记录（`LogRepository.delete()`）
- 用户档案（`ProfileRepository.delete()`）
- 角色信息（`RoleRepository.delete()`）

### 2. remove方法特性

#### 本质
**实体级删除**：先通过ID查出实体实例，再调用`remove(entity)`删除。

> **注意**：这里的“软删除”表述不准确，TypeORM的`remove`方法默认执行硬删除，但会先查询实体再删除。真正的软删除需要使用`@DeleteDateColumn()`装饰器。

> **修正说明**：原视频中“精准软删除”的表述有误，`remove`方法执行的是物理删除，只是会先查询实体实例并触发钩子。真正的软删除需要额外配置。

#### 关键特点
- 完整触发TypeORM生命周期钩子
- 支持`@BeforeRemove`、`@AfterRemove`等钩子方法
- 可在钩子中执行敏感操作

#### 钩子方法示例
```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @AfterRemove()
  afterRemove() {
    console.log(`User ${this.username} has been removed`);
    // 执行归档、审计、通知等操作
  }
}
```

#### 适用场景
- 用户、订单等核心敏感数据
- 需要审计与可追溯性的业务
- 需要执行副作用逻辑的删除操作

### 3. 使用建议

| 场景 | 推荐方法 | 原因 |
|------|----------|------|
| 核心业务数据 | `remove` | 保障审计与可追溯性，支持钩子逻辑 |
| 非关键数据 | `delete` | 性能更高，无需钩子逻辑 |
| 需要副作用操作 | `remove` | 触发`@BeforeRemove`/`@AfterRemove`钩子 |

#### 代码示例
```typescript
// Service层
async removeUser(id: number) {
  const user = await this.userRepository.findOne({ where: { id } });
  if (!user) {
    throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
  }
  return this.userRepository.remove(user);
}

async deleteUser(id: number) {
  const result = await this.userRepository.delete(id);
  if (result.affected === 0) {
    throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
  }
  return result;
}
```

---

## 三、关联方法辨析

### 1. create方法
- 在TypeORM中创建实体类新实例（内存对象）
- 不操作数据库，仅用于对象初始化

### 2. save方法
- 将实体实例持久化至数据库
- 若实体无主键值则执行`INSERT`，若有则执行`UPDATE`
- 触发`@BeforeInsert`/`@AfterInsert`、`@BeforeUpdate`/`@AfterUpdate`钩子

### 3. insert方法
- 直接执行`INSERT` SQL语句
- 绕过实体验证与钩子机制
- 性能更高但丧失生命周期控制能力
- 适用于批量插入且无需钩子响应的场景

---

## 四、实践验证：钩子方法触发流程

### 测试步骤

1. **新增用户**：Postman调用`POST /users` → 触发`@AfterInsert`钩子 → 控制台打印`after insert`
2. **删除用户**：Postman调用`DELETE /users/44` → 先`findOne`查出User实体 → 调用`remove(user)` → 触发`@AfterRemove`钩子 → 控制台打印`after remove`

### 钩子数据访问
在`@AfterRemove`方法体内，可直接通过`this`访问被删除实体的全部属性：
```typescript
@AfterRemove()
afterRemove() {
  console.log(`Deleted user: ${this.username} (ID: ${this.id})`);
  console.log(`User profile: ${JSON.stringify(this.profile)}`);
}
```

---

## 五、总结与最佳实践

### 1. 命名规范
- **Controller**：语义化命名，如`removeUser`、`getUserById`
- **Service**：与Repository一一映射，如`UserService` ↔ `UserRepository`
- **Repository**：对应单个实体类，如`UserRepository` ↔ `User`实体

### 2. 删除选型
- **优先使用`remove`**：尤其涉及用户、订单等核心敏感数据
- **`delete`仅限非关键数据**：避免误删核心业务记录
- **`remove`需先查询再删除**：写法略繁但安全可控

### 3. 架构演进
- Service代码量超300行或含复杂SQL时，必须拆分Repository
- 保障可维护性与技术栈可替换性
- 遵循单一职责原则，降低模块间耦合度

### 4. 监听器启用
- 所有需副作用逻辑（归档、通知、统计）的操作，必须使用`remove`/`save`
- 正确定义实体级`@Before*`/`@After*`装饰器
- 避免使用`delete`/`insert`处理需要审计的业务

---

## 六、课后思考

### 课后思考

1. 如何在TypeORM中实现软删除（Soft Delete）功能？
   - 提示：可以使用`@DeleteDateColumn()`装饰器
2. 如何在Service层实现事务管理？
   - 提示：使用`@Transaction()`装饰器或手动管理事务
3. 如何优化大量数据的删除操作性能？
   - 提示：考虑使用批量删除或分页删除策略

### 实践练习

#### 练习1：实现软删除
为`User`实体添加软删除功能，并实现恢复用户的接口。

#### 练习2：事务管理
在Service层实现一个包含多个数据库操作的事务，确保数据一致性。

#### 练习3：批量删除
实现一个批量删除用户的接口，优化性能并确保数据安全。

### 与前序课程的关联

本课程与上一节“创建用户：创建及异常处理逻辑”紧密相关：
- 上一节讲解了用户创建时的异常处理
- 本节讲解了用户删除时的方法选择与钩子使用
- 两者共同构成了完整的用户生命周期管理

建议结合学习，加深对NestJS三层架构和TypeORM的理解

### 知识拓展

#### 软删除与硬删除的选择

##### 软删除实现
在TypeORM中实现软删除需要使用`@DeleteDateColumn()`装饰器：
```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @DeleteDateColumn()
  deletedAt: Date;
}
```

##### 区别对比
- **软删除**：标记记录为已删除（设置`deletedAt`字段），保留数据用于审计
- **硬删除**：物理删除记录，释放存储空间
- **归档**：将删除的数据迁移至历史表，平衡审计与性能

##### 查询软删除记录
使用`withDeleted()`方法查询包含软删除的记录：
```typescript
// 查询所有用户（包括软删除的）
const allUsers = await userRepository.find({ withDeleted: true });

// 恢复软删除的用户
await userRepository.restore({ id: 1 });
```

#### 性能优化建议
- 对于批量删除操作，优先使用`delete`而非`remove`
- 对于需要审计的批量操作，可考虑使用事务+批量更新标记的方式
- 定期清理软删除的记录，避免数据库表过大
