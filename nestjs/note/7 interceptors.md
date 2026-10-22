# NestJS 拦截器（Interceptors）学习笔记

> 
> 文档来源：[https://docs.nestjs.cn/overview/interceptors](https://docs.nestjs.cn/overview/interceptors)

## 1. 拦截器基础概念

- 拦截器是被 `@Injectable()` 装饰、实现 `NestInterceptor` 接口的类，基于**面向切面编程AOP**思想。
- 五大能力：
  1. 在控制器方法**执行前后**附加额外逻辑；
  2. 转换控制器返回的响应结果；
  3. 转换、重写抛出的异常；
  4. 扩展原有函数行为；
  5. 完全重写函数（例如缓存场景，不执行控制器直接返回数据）。
- **执行时机**：守卫执行完成之后，**管道之前**执行前置逻辑；控制器处理完之后，拦截器执行后置逻辑。
- 核心方法 `intercept(context, next)`，两个入参：
  1. `ExecutionContext`：执行上下文，和守卫完全一致，继承`ArgumentsHost`，可以拿到请求、控制器、元数据；
  2. `CallHandler`：调用处理器；调用 `next.handle()` 才会执行路由控制器方法；**不调用则控制器不会执行**。
- `next.handle()` 返回 RxJS `Observable`，通过 RxJS 操作符处理后置逻辑。

```
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class DemoInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // ========= 控制器执行【之前】逻辑 =========
    return next.handle()
      .pipe(
        // ========= 控制器执行【之后】逻辑 =========
      );
  }
}
```

### 示例：日志耗时拦截器

```
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    const now = Date.now();
    return next.handle()
      .pipe(
        tap(() => console.log(`After... ${Date.now() - now}ms`))
      );
  }
}
```

> 
> `tap`：执行副作用，不会修改流里面的数据。

## 2. 拦截器绑定（3种作用域）

使用装饰器 `@UseInterceptors()`，支持多个拦截器逗号分隔；优先传入**类名**，交给框架实例化，支持依赖注入；需要自定义配置才手动 new。

1. **方法级别**：仅作用单个接口

```
@Get()
@UseInterceptors(LoggingInterceptor)
findAll() {}
```

2. **控制器级别**：控制器下全部接口生效

```
@Controller('cats')
@UseInterceptors(LoggingInterceptor)
export class CatsController {}
```

3. **全局级别**
① main.ts，缺点：**无法依赖注入**

```
const app = await NestFactory.create(AppModule);
app.useGlobalInterceptors(new LoggingInterceptor());
```

② Module注册令牌 `APP_INTERCEPTOR`，**支持DI注入（推荐）**

```
@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }
  ]
})
export class AppModule {}
```

## 3. 常见业务场景示例

### ① 响应结果转换 map

统一包装返回体，例如把原始数据包装在`data`字段；⚠️ 不能配合`@Res()`原生响应对象。

```
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle()
      .pipe(map(data => ({ data })));
  }
}
```

### ② 异常捕获与重写 catchError

捕获控制器抛出异常，替换为自定义异常。

```
@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle()
      .pipe(
        catchError(err => throwError(() => new BadGatewayException()))
      );
  }
}
```

### ③ 直接返回新流（缓存场景）

直接返回 `of(数据)`，**不再调用 next.handle()，控制器完全不会执行**。

```
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isCached = true;
    if(isCached){
      return of([]); //直接返回缓存结果
    }
    return next.handle();
  }
}
```

### ④ 请求超时处理 timeout

设置接口超时时间，超时抛出请求超时异常。

```
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle()
      .pipe(
        timeout(5000),
        catchError(err => {
          if(err instanceof TimeoutError){
            return throwError(() => new RequestTimeoutException());
          }
          return throwError(() => err);
        })
      )
  };
}
```

## ✨ 重点总结

1. 拦截器AOP能力：**控制器执行前后都可以写逻辑，转换返回值、改写异常、缓存短路请求**。
2. `next.handle()`：调用才会执行控制器；不调用，控制器不会运行；返回RxJS Observable。
3. 前置逻辑写在`next.handle()`之前；后置逻辑写在`.pipe()`的RxJS操作符中（`map/tap/catchError/timeout`）。
4. 绑定：方法、控制器、全局；全局要DI依赖注入使用`APP_INTERCEPTOR`令牌。
5. 支持构造函数注入依赖；尽量传类，不要手动`new`实例。

## 📋 Nest完整请求生命周期汇总

> 
> 请求到来

1. 中间件 →
2. 守卫（鉴权） →
3. **拦截器（前置）** →
4. 管道（参数校验、转换） →
5. 控制器执行业务 →
6. **拦截器（后置，RxJS pipe）** →
7. 异常过滤器（任意环节抛异常都会进入这里） → 响应返回客户端

> 
> 下一章：自定义装饰器