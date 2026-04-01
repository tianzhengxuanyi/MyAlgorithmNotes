# NestJS 中 class-validator 完整使用指南

`class-validator` 是 NestJS 官方推荐的**数据校验库**，配合 `class-transformer` 使用，专门用于校验**DTO（数据传输对象）** 中的入参，确保接口接收的数据格式、类型、规则符合要求。

## 一、前置安装

NestJS 项目默认不自带，需要先安装依赖：

```Bash

npm install class-validator class-transformer --save
```

## 二、核心配置（必须开启）

要让校验生效，必须在应用入口**开启全局校验管道**，打开 `main.ts`：

```TypeScript

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// 导入校验管道
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 开启全局参数校验（核心配置）
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动过滤非 DTO 定义的字段
      forbidNonWhitelisted: true, // 收到非法字段直接报错
      transform: true, // 自动将入参转换为 DTO 实例
    }),
  );

  await app.listen(3000);
}
bootstrap();
```

## 三、基础使用：编写 DTO 校验

DTO 是定义接口入参规则的文件，我们在 DTO 中使用 `class-validator` 装饰器标注校验规则。

### 示例：用户注册 DTO

创建 `src/users/dto/create-user.dto.ts`：

```TypeScript

import { IsString, IsEmail, IsInt, Min, Max, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  // 非空 + 邮箱格式
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email: string;

  // 非空 + 字符串
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  password: string;

  // 可选参数 + 整数 + 范围限制
  @IsOptional()
  @IsInt({ message: '年龄必须是整数' })
  @Min(18, { message: '年龄不能小于18岁' })
  @Max(100, { message: '年龄不能大于100岁' })
  age?: number;

  // 字符串 + 最小长度
  @IsString()
  @MinLength(2, { message: '用户名长度不能小于2位' })
  username: string;
}
```

## 四、在 Controller 中使用 DTO

直接在接口参数中使用 DTO，校验会**自动触发**：

```TypeScript

import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // 校验通过才会执行这里
    return '用户创建成功';
  }
}
```

## 五、常用校验装饰器速查

### 1. 基础类型校验

```TypeScript

@IsString() // 必须是字符串
@IsInt() // 必须是整数
@IsNumber() // 必须是数字（含小数）
@IsBoolean() // 必须是布尔值
@IsDate() // 必须是日期对象
```

### 2. 非空/可选校验

```TypeScript

@IsNotEmpty() // 不能为空（字符串、对象、数组都适用）
@IsOptional() // 可选字段（不传不校验，传了就按规则校验）
@IsNull() // 必须为 null
```

### 3. 格式校验

```TypeScript

@IsEmail() // 邮箱
@IsPhoneNumber('CN') // 手机号（CN=中国）
@IsUrl() // 网址
@IsUUID() // UUID 格式
@Matches(/正则/) // 自定义正则校验
```

### 4. 长度/范围校验

```TypeScript

@MinLength(5) // 最小长度
@MaxLength(20) // 最大长度
@Min(18) // 最小值
@Max(100) // 最大值
@Length(5, 20) // 固定长度范围
```

### 5. 数组/对象校验

```TypeScript

@IsArray() // 必须是数组
@ArrayMinSize(1) // 数组最小长度
@ArrayMaxSize(10) // 数组最大长度
@ValidateNested() // 嵌套对象校验（必须配合 Type 装饰器）
```

## 六、高级用法

### 1. 嵌套对象校验

如果入参是嵌套对象，需要用 `@ValidateNested` + `@Type`：

```TypeScript

import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @IsString()
  city: string;

  @IsString()
  street: string;
}

export class CreateUserDto {
  @IsString()
  username: string;

  // 嵌套校验
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
```

### 2. 数组元素校验

校验数组中每一个元素的规则：

```TypeScript

import { IsArray, IsString, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  // 字符串数组，至少1个元素
  @IsArray()
  @IsString({ each: true }) // each: true 表示校验数组每一项
  @ArrayMinSize(1)
  hobbies: string[];
}
```

### 3. 自定义校验规则

如果内置规则不够用，可以自定义校验器：

```TypeScript

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

// 自定义校验规则：密码不能包含用户名
@ValidatorConstraint({ name: 'isNotUsername', async: false })
export class IsNotUsername implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    const { username } = args.object as any;
    return !password.includes(username);
  }

  defaultMessage() {
    return '密码不能包含用户名';
  }
}

// 使用自定义校验
import { Validate } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @Validate(IsNotUsername) // 挂载自定义规则
  password: string;
}
```

## 七、校验失败响应格式

校验不通过时，NestJS 会自动返回标准错误：

```JSON

{
  "statusCode": 400,
  "message": [
    "请输入有效的邮箱地址",
    "年龄不能小于18岁"
  ],
  "error": "Bad Request"
}
```

## 八、常见问题

1. **校验不生效？**

    - 检查是否在 `main.ts` 开启了 `ValidationPipe`

    - 检查 DTO 装饰器是否导入正确

    - 检查参数装饰器是否用了 `@Body()`/`@Query()`/`@Param()`

2. **多余字段被传入？**

    - 开启 `whitelist: true` 会自动过滤非 DTO 字段

3. **参数类型转换失败？**

    - 开启 `transform: true` 会自动转换入参类型

---

## 总结

1. 安装 `class-validator` + `class-transformer` 依赖

2. 全局开启 `ValidationPipe` 校验管道

3. 在 DTO 中用装饰器定义校验规则

4. Controller 中直接使用 DTO，校验自动触发

5. 支持基础校验、嵌套校验、数组校验、自定义校验，满足绝大多数业务场景
> （注：文档部分内容可能由 AI 生成）