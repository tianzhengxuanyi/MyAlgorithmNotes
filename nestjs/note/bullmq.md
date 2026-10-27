# NestJS @nestjs/bullmq 极简学习笔记
> 适配你当前项目（`registerQueueAsync` + `@Processor` + `WorkerHost`），和你截图代码保持一致
> 前置：本地启动 Redis，bullmq 依赖 Redis

## 1. 安装
```bash
npm install @nestjs/bullmq bullmq
# 类型已经内置，不需要额外 @types
```

## 2. 根模块全局Redis连接（可选，推荐）
`BullModule.forRoot` 统一全局redis连接，所有队列复用
```ts
// app.module.ts
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: '127.0.0.1',
        port: 6379,
        // password: 'xxx',
      },
    }),
  ]
})
export class AppModule {}
```
> 也可以不在forRoot配置，每个队列 `registerQueueAsync` 单独传 connection（你现在代码就是这种）

## 3. 模块内注册队列（两种写法）
### 方式A：同步注册 registerQueue
```ts
BullModule.registerQueue({
  name: 'ai-ingestion',
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 1000,
  }
})
```

### 方式B：异步注册 registerQueueAsync（你项目在用，读ConfigService）
```ts
BullModule.registerQueueAsync({
  name: 'ai-ingestion',
  useFactory: (configService: ConfigService) => {
    const redis = configService.get('redis');
    return {
      connection: redis,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: 100,
        removeOnFail: 1000,
      },
    }
  },
  inject: [ConfigService]
})
```
✅ 重点：**registerQueueAsync 只注册队列配置，不会启动Worker**

## 4. 消费器 Processor（重点，对应你截图）
规则：
1. 类必须继承 `WorkerHost`，实现 `async process(job: Job)`
2. `@Processor(队列名, {concurrency: 并发数})`
3. **必须加到当前模块 providers[]**，否则bullmq扫描不到，worker不会启动
4. 框架在 `onModuleInit` 生命周期自动扫描、匹配同名队列、创建Worker，自动轮询Redis消费

```ts
// ingestion.processor.ts
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

export const AI_INGESTION_QUEUE = 'ai-ingestion';

@Processor(AI_INGESTION_QUEUE, { concurrency: 5 })
export class IngestionProcessor extends WorkerHost {
  private logger = new Logger(IngestionProcessor.name);

  // 核心消费方法
  async process(job: Job) {
    this.logger.log(`开始处理任务: ${job.id}, data:`, job.data);
    // 你的业务逻辑
    // 抛出异常 → bullmq自动重试（按照defaultJobOptions的attempts）
    return { ok: true };
  }

  // 任务生命周期钩子（可选）
  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`任务完成 ${job.id}`);
  }
  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    this.logger.error(`任务失败 ${job.id}`, err);
  }
}
```

模块里注册：
```ts
@Module({
  imports: [
    BullModule.registerQueueAsync({name: AI_INGESTION_QUEUE, ...})
  ],
  providers: [IngestionProcessor] // ✅ 关键！不加不会启动worker
})
```

> 时序回顾（你刚才问的）：
> 装饰器只是打元数据标记 → DI实例化provider → BullModule.onModuleInit 扫描所有provider，找到@Processor，匹配同名队列，内部 `new Worker()` 启动轮询

## 5. 生产者：往队列添加任务
`@InjectQueue(队列名)` 注入队列实例，调用 `.add()`
```ts
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { AI_INGESTION_QUEUE } from './ingestion.processor';

@Injectable()
export class IngestionService {
  constructor(
    @InjectQueue(AI_INGESTION_QUEUE)
    private readonly ingestionQueue: Queue
  ) {}

  async addDocTask(documentId: number) {
    // 投递任务
    const job = await this.ingestionQueue.add('ingest', { documentId });
    return job.id;
  }
}
```
- 第一个参数：**job名称**，同一个队列可以区分多种job类型
- 第二个：job的payload数据

## 6. 常用Job配置
```ts
await queue.add('job-name', payload, {
  attempts: 3, // 重试次数
  backoff: { type: 'exponential', delay: 3000 }, // 指数退避
  delay: 10000, // 延迟10s执行
  priority: 10, // 优先级，数字越大越高
  removeOnComplete: true, // 完成自动删除
  removeOnFail: 50, // 失败保留最近50条
});
```

## 7. 重要踩坑清单（高频）
1. **队列名称必须严格一致**：`registerQueueAsync` 的name 和 `@Processor` 第一个参数完全一样，大小写敏感，否则匹配不到，worker不启动
2. **Processor必须写在providers数组**，否则框架扫描不到
3. `@nestjs/bullmq` 和旧的 `@nestjs/bull` 不兼容，不要混用
4. 默认 `manualRegistration: false` → 自动创建worker；开启 `manualRegistration:true` 需要手动new Worker
5. 异常：`process` 里面 throw Error，bullmq才会触发重试；return 不会触发重试
6. 多实例部署：多个nest进程连同一个redis，自动负载均衡消费，同一个job只会被一个worker消费
7. concurrency：单个worker实例同时并发处理任务数量，不是全局并发

## 8. 常用内置装饰器/API
- `@InjectQueue(name)`：注入队列
- `@Processor(name, opts)`：消费器标记
- `@OnWorkerEvent('completed' | 'failed' | 'active' | 'drained')`：任务事件监听
- `WorkerHost`：基础父类，必须继承，提供process入口
- `job.updateProgress(percent)`：更新任务进度，前端可查询进度

## 9. 调试工具
Bull Board（可视化面板），可以看队列、任务、重试、失败任务
```bash
npm install @bull-board/nestjs @bull-board/bullmq
```

## 10. 生命周期完整时序（复习）
1. 编译阶段：`@Processor` 给类附加元数据（仅标记，不启动worker、不连redis）
2. Nest模块初始化：执行 `registerQueueAsync` 的useFactory，拿到redis配置，注册队列
3. DI容器实例化所有provider（IngestionProcessor 被实例化，依赖注入完成）
4. BullModule 的 `onModuleInit` 钩子：扫描全部provider，找到带`@Processor`的类
5. 匹配同名队列 → 内部 `new Worker(queue, processorFn, {concurrency})`，worker启动，开始轮询redis消费任务
6. 应用启动完成 `onApplicationBootstrap`