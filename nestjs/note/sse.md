# NestJS SSE 流式使用笔记（简洁可直接复制）

> 
> SSE：Server-Sent Events，单向服务端推送，基于 HTTP，长连接，区别于 WebSocket；适合 AI 流式输出、日志推送、进度返回。
> Nest 内置 `@Sse()` 装饰器，不需要额外装包（@nestjs/common）

## 1. 基础要点

- 路由装饰器：`@Sse()`，**不是 @Get()**
- 返回值：必须是 `Observable<MessageEvent>`（rxjs）
- 响应头自动：`Content-Type: text/event-stream`、`Cache-Control: no-cache`、`Connection: keep-alive`
- 客户端：浏览器原生 `EventSource`
- 依赖：rxjs 项目一般自带

## 2. 最简示例（Controller）

```
import { Controller, Sse } from '@nestjs/common';
import { Observable, from, map } from 'rxjs';

@Controller('sse')
export class SseController {
  @Sse('stream')
  stream(): Observable<MessageEvent> {
    // 模拟分段输出，AI 流式返回常用
    const dataList = ['hello', ' ', 'nest', ' ', 'sse'];
    return from(dataList).pipe(
      map((chunk) => ({
        data: chunk, // 推送内容
        // id: '1', // 可选，消息id
        // event: 'custom', // 自定义事件名，默认 message
      } as MessageEvent)),
    );
  }
}
```

## 3. 真实 AI 流式场景（while 循环 + interval）

```
import { Controller, Sse } from '@nestjs/common';
import { Observable, interval, take, map } from 'rxjs';

@Controller('sse')
export class SseController {
  @Sse('ai-chat')
  aiChat(): Observable<MessageEvent> {
    const words = ['你', '好', '，', '这', '是', '流', '式', '回', '答'];
    let idx = 0;
    return interval(150).pipe(
      take(words.length),
      map(() => {
        return {
          data: words[idx++],
        } as MessageEvent;
      }),
    );
  }
}
```

## 4. 客户端调用（前端 EventSource）

```
const evtSource = new EventSource('/sse/ai-chat');
evtSource.onmessage = (e) => {
  console.log('收到片段：', e.data);
};
evtSource.onerror = (err) => {
  console.error('sse error', err);
  evtSource.close();
};
// 关闭连接：evtSource.close()
```

## 5. 带请求参数（查询参数）

```
@Sse('chat')
chat(@Query() query: { prompt: string }): Observable<MessageEvent> {
  // 根据 prompt 生成流
}
```

> 
> ⚠️ 注意：EventSource **不支持 POST**，默认只能 GET；
> 如果要 POST 传大参数（prompt 很长），两种方案：
> 
> 
> 1. 先用一个接口拿到 token，sse 用 token 查询参数拉流
> 2. 使用 fetch + ReadableStream（不属于标准 SSE，前端手动解析 `data:`）

## 6. 重要踩坑点

1. **不要在 @Sse 里面用 return 普通对象**，必须返回 Observable
2. 连接断开：客户端关闭页面 / close() 后，Observable 会自动 complete，推荐加 `takeUntil` 释放资源、停止耗时任务
3. 超时：Nest 默认 http 超时、nginx 反向代理超时，需要调大
   - nginx：`proxy_read_timeout 300s;`
4. 跨域：CORS 正常配置即可，SSE 遵循跨域规则
5. 不要混着使用 `res.write()` 原生写法 + @Sse，会冲突
6. MessageEvent 字段：
   - `data`：最核心，字符串（**不能直接传对象，需要 JSON.stringify**）
   - `event`：自定义事件类型，前端用 `addEventListener('xxx')` 监听
   - `id`：last-event-id，断线重连时浏览器自动带上

## 7. 带 JSON 数据 + 断线重连示例

```
@Sse('progress')
progress(): Observable<MessageEvent> {
  return interval(500).pipe(
    map((i) => ({
      data: JSON.stringify({ percent: i * 10 }),
      id: String(i),
      event: 'progress',
    } as MessageEvent)),
  );
}
```

前端：

```
const es = new EventSource('/sse/progress');
es.addEventListener('progress', (e) => {
  const info = JSON.parse(e.data);
  console.log(info.percent);
});
```

## 8. 手动控制关闭（外部触发停止流）

```
import { Subject, Observable, takeUntil } from 'rxjs';

@Controller('sse')
export class SseController {
  private readonly stop$ = new Subject<void>();

  @Sse('long-stream')
  longStream(): Observable<MessageEvent> {
    return interval(300).pipe(
      takeUntil(this.stop$), // 收到stop信号终止流
      map((v) => ({ data: v.toString() } as MessageEvent)),
    );
  }

  @Get('stop')
  stop() {
    this.stop$.next();
  }
}
```

## 9. 【补充】fetch 流式（非标准SSE，POST可用，AI项目更常用）

很多大模型流式接口不用 EventSource，直接返回 `ReadableStream`，不走 `@Sse()`，用 `@Post` + 原生 `res.write`，如果你需要我可以给一份配套代码。