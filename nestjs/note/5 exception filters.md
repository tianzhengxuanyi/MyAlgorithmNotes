# NestJS 异常过滤器学习笔记

> 
> 文档来源：[https://docs.nestjs.cn/overview/exception-filters](https://docs.nestjs.cn/overview/exception-filters)

## 1. 内置异常处理层

- Nest自带**全局异常处理层**，捕获所有未被代码捕获的异常，自动返回友好JSON响应。
- 内置全局过滤器可以处理 `HttpException` 及其子类。
- 遇到非`HttpException`的普通错误，默认返回：

```
{
  "statusCode":500,
  "message":"Internal server error"
}
```

- 兼容`http‑errors`库，带有`statusCode`、`message`属性的错误会被正常解析。

> 
> 注意：`HttpException`系列属于`IntrinsicException`，默认**不会打印控制台日志**，需要日志要自己写自定义过滤器。

## 2. HttpException 抛出标准HTTP异常

构造函数参数：

1. `response`：响应体，可以字符串 / 对象；
2. `status`：HTTP状态码，推荐用枚举`HttpStatus`；
3. `options`：可选，`{cause:err}`，保存原始错误，仅用于日志，不会返回到前端。

示例：

```
//简单抛出
throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

//自定义完整返回体，携带原始错误cause
throw new HttpException(
  { status: HttpStatus.FORBIDDEN, error: '自定义提示' },
  HttpStatus.FORBIDDEN,
  { cause: error }
);
```

## 3. 内置HTTP异常类

`@nestjs/common`提供大量现成异常类，直接使用，无需自己new HttpException。
`BadRequestException`、`UnauthorizedException`、`NotFoundException`、`ForbiddenException`、`ConflictException`、`InternalServerErrorException`等。

支持传入message、`{cause,description}`：

```
throw new BadRequestException("参数错误",{cause:err,description:"输入字段非法"});
```

## 4. 自定义业务异常

继承`HttpException`实现自己异常类，Nest内置过滤器可以识别处理。

```
export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
```

## 5. 自定义异常过滤器

### 实现要求

1. 实现接口 `ExceptionFilter<T>`
2. 使用装饰器 `@Catch(异常类)` 指定捕获什么异常；不传参数`@Catch()`代表捕获全部异常
3. 必须实现 `catch(exception, host:ArgumentsHost)` 方法

```
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();
    res.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url
    });
  }
}
```

### ArgumentsHost 参数

- `host`：执行上下文对象，兼容HTTP、WebSocket、微服务多种场景。
- `host.switchToHttp()` 获取HTTP上下文，拿到`Request/Response`对象。> 
> Fastify框架不要使用`res.json()`，改用`res.send()`。

## 6. 过滤器绑定（三种作用域）

使用`@UseFilters()`装饰器；**优先传入类，不要手动new实例，方便依赖注入、复用单例**。

1. **方法级别**：只作用单个接口

```
@Post()
@UseFilters(HttpExceptionFilter)
async create(){}
```

2. **控制器级别**：控制器全部接口生效

```
@Controller()
@UseFilters(HttpExceptionFilter)
export class CatsController {}
```

3. **全局级别**：两种写法
① main.ts，缺点：**无法依赖注入**

```
app.useGlobalFilters(new HttpExceptionFilter());
```

② 在Module注册`APP_FILTER`令牌，**支持DI注入**（推荐）

```
@Module({
  providers:[
    { provide:APP_FILTER, useClass:HttpExceptionFilter }
  ]
})
export class AppModule{}
```

> 
> 注意：`app.useGlobalFilters()`注册的全局过滤器**不会作用网关Gateway**。

## 7. 捕获全部异常

`@Catch()`不带参数捕获所有类型异常。
借助`HttpAdapterHost`写平台无关代码，不直接操作express/fastify原生req/res。

```
@Catch()
export class AllFilter implements ExceptionFilter{
  constructor(private readonly httpAdapterHost:HttpAdapterHost){}
  catch(exception:unknown, host:ArgumentsHost){
    const {httpAdapter}=this.httpAdapterHost;
    const ctx=host.switchToHttp();
    // ...
    httpAdapter.reply(ctx.getResponse(), body, status);
  }
}
```

> 
> 优先级：通用捕获全部过滤器要放在前面，让专门捕获特定异常的过滤器优先匹配。

## 8. 继承内置BaseExceptionFilter

可以继承`BaseExceptionFilter`复用Nest原生异常逻辑，重写部分逻辑。

```
@Catch()
export class AllExFilter extends BaseExceptionFilter{
  catch(exception:unknown, host:ArgumentsHost){
    super.catch(exception,host); //调用原生处理逻辑
  }
}
```

> 
> 控制器/方法作用域继承`BaseExceptionFilter`的过滤器，不能手动new，交给框架实例化。

## ✨ 重点总结

1. 业务优先直接抛内置异常类，或者继承`HttpException`自定义异常；
2. `cause`用于保存原始错误，仅内部日志，不会返回前端；
3. 自定义过滤器：`@Catch()` + 实现`ExceptionFilter`接口 + `catch()`；
4. `ArgumentsHost`抽象上下文，适配http/ws/微服务；
5. 绑定过滤器：方法、控制器、全局；全局要DI就用`APP_FILTER`token；
6. 尽量传入类给`@UseFilters`，不要`new`，利于依赖注入。

### 和前面知识链路

请求链路：中间件 → 管道 → 控制器；发生未捕获异常 → **异常过滤器**接管处理，输出响应。