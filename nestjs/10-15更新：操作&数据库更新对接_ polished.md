# 10-15更新：操作&数据库更新对接

## 核心内容概述

本课程讲解了用户信息更新功能的实现细节，重点解析了关联模型级联更新失败的原因及解决方案，并通过设置cascade和使用merge与save方法完成复杂更新；同时介绍了基于headers的权限校验机制，演示了如何通过authorization头判断操作权限并抛出HTTP异常，最后引出JWT用于安全身份认证的后续学习内容。

## Update User 核心逻辑分析

### 关键实现要点

1. **敏感信息处理**：更新后需删除返回数据中的敏感信息（如password）
2. **权限验证**：判断传入的ID与DTO用户是否为同一用户，防止他人越权修改
3. **密码保护**：若非本人尝试修改密码，则禁止操作
4. **调试技巧**：在代码中打印ID和DTO内容以进行调试验证

## Postman测试与路径参数说明

### 测试步骤

1. 使用Postman发送PATCH请求进行用户更新
2. 请求方式为路径传参，需在URL中指定数据库中存在的用户ID
3. 示例：将用户名更新为test password，密码设为123456

## 数据库初始状态核验

查看ID为2的用户当前信息：
- 用户名：toy mark
- 密码：123456

## 传递非核心字段导致更新失败的问题

### 问题现象

尝试更新email、gender字段，同时尝试更新profile中的address、photo字段时出现错误提示：
```
"property address was not found in user, make sure query is correct"
```

即使调整字段顺序或仅传递部分字段，仍报错。只有传递username和password才能成功更新。

### 失败原因定位

问题根源在于`user.entity.ts`中的profile是一个对象类型的关联关系（OneToOne）。默认情况下TypeORM不会自动更新关联实体，必须显式设置`cascade: true`才能实现级联保存。

## TypeORM级联更新机制详解

### 配置说明

在`@OneToOne`装饰器的relation options中存在`cascade`配置项，可设置为`true`或指定操作类型（如insert、update等）。

### 官方文档示例

若`cascade: true`，则子实体可随主实体一同插入数据库。示例中通过一次`save`操作即可保存包含多个category的question实例。

## 解决方案

### 方案一：启用级联更新

修改`user.entity.ts`文件，在`@OneToOne`的第三个参数中添加：
```ts
{ cascade: true }
```

### 方案二：使用merge + save进行联合模型更新

#### 代码实现细节

```ts
userTemp = await this.findProfile(id);
newUser = this.userRepository.merge(userTemp, dto);
return await this.userRepository.save(newUser);
```

#### 测试验证

1. 在Postman中设置：
   - address: 2
   - photo: "!!"
   - gender: 2

2. 发送请求后获得正常响应
3. 查询所有用户确认gender、photo、address均已更新
4. 再次测试修改gender为1、address为3、password为hello123，响应正常

## TypeORM Repository API补充知识

### merge方法

`merge`方法可用于将多个实体合并成新实体。

### preload方法

`preload`方法可通过普通JS对象创建实体，先从数据库加载再替换值。但经测试发现`preload`不自动加载关联数据（如profile），除非手动指定relations。

### 推荐做法

1. 显式查询主实体并设置`{ relations: ['profile'] }`
2. 使用`merge`合并数据
3. 使用`save`持久化

## 权限校验初步实现

### 实现步骤

1. **解析Authorization Header**：从请求头中提取authorization信息
2. **权限比对逻辑**：将解析出的用户ID与请求路径中的ID进行比对
3. **抛出HTTP异常**：当权限不足时，抛出`UnauthorizedException`等内置异常

### 代码实现

```ts
import { Headers } from '@nestjs/common';

// 在控制器方法中获取headers
@Patch(':id')
update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Headers() headers) {
  const userId = headers.authorization;
  if (userId !== id) {
    throw new UnauthorizedException('无权修改其他用户信息');
  }
  // 执行更新逻辑
}
```

### 实际测试

1. 请求路径传入ID为2
2. authorization header设置为`1`
3. 发送请求后立即返回`401 Unauthorized`错误，表明权限校验生效

## 安全性问题讨论

### 现有方案的不足

前端可随意修改authorization值，存在安全隐患。当前仅为演示逻辑，实际应用中需结合加密技术确保token不可伪造。

### 解决方案：JWT认证机制

使用JSON Web Token (JWT)可实现安全的身份透传：
1. 服务端签发token
2. 前端携带token请求
3. 服务端验证签名
4. 若token签名无效或过期，请求将被拒绝（返回401）

## 后续学习规划

1. **JWT技术**：下一章节将展开讲解JWT技术
2. **用户登录认证流程**：接着学习用户登录认证流程
3. **权限控制机制**：深入学习权限控制机制
4. **预习建议**：感兴趣的同学可提前了解JWT相关知识

## 学习要点总结

### 核心知识点

1. **级联更新配置**：在`@OneToOne`装饰器中设置`cascade: true`实现关联模型自动更新
2. **merge + save策略**：使用repository.merge合并新旧数据，再通过save保存完整实体树
3. **权限校验实现**：通过解析headers中的authorization信息实现基本权限控制
4. **HTTP异常处理**：使用NestJS内置的HTTP异常类快速响应未授权访问等场景

### 关键技能

1. 掌握TypeORM关联模型更新的两种解决方案
2. 学会实现基于请求头的权限验证机制
3. 了解JWT技术在安全身份认证中的应用
4. 掌握Postman测试API接口的基本方法

### 常见陷阱

1. 忘记设置cascade导致关联模型更新失败
2. 未正确处理敏感信息返回
3. 权限验证逻辑不严谨导致安全漏洞
4. 混淆merge和preload方法的使用场景

## 学习建议

1. 动手实践级联更新和权限校验代码
2. 测试不同配置下的更新效果
3. 思考如何优化权限验证逻辑
4. 预习JWT相关知识为后续学习做准备