## Node.js 相关面试题

### 什么是Stream流？

Node.js 中的 Stream 流是一种用于处理数据的机制，它允许你以流式的方式读取和写入数据，而不会占用大量的内存。
Stream 流分为两种类型：可读流（Readable）、可写流（Writable）、双流（Duplex）、转换流（Transform）

```js
const fs = require("fs");
const { Transform } = require("stream");

// 可读流
const readableStream = fs.createReadStream("./test.txt");
// 可写流
const writableStream = fs.createWriteStream("./test2.txt");
// 将可读流转换为大写流
const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback(null, chunk.toString().toUpperCase());
  },
});

// 管道流
readableStream.pipe(upperCaseTransform).pipe(writableStream);
```

### 什么是集群？如何在Node中实现集群和负载均衡？

集群是指在Node.js中运行多个进程，每个进程都执行任务，以提高性能和可扩展性。

1. 加载cluster等模块
2. 使用cluster.isMaster判断是否为主进程
3. 如果是主进程，使用cluster.fork()创建子进程
4. 如果是子进程，创建HTTP服务器，并监听指定端口，处理请求和响应
5. 监听exit事件，当子进程退出时，创建新的子进程

```js
const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log("Starting a new worker");
    cluster.fork();
  });
} else {
  // Workers can share any TCP connection
  // In this case, it is an HTTP server
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end("Hello World\n");
    })
    .listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```

### Node.js 如何处理多线程或多进程？

- child_process模块用于创建子进程，执行系统命令及脚本。
  - exec方法用于执行系统命令，返回命令的输出。
  - spawn方法用于创建子进程，执行系统命令。
  - fork方法用于创建子进程，执行Node.js脚本。
- worker_threads模块用于创建多线程，执行Node.js代码。

**exec**

```js
const { exec } = require("child_process");

exec("ls -la", (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```

**spawn**

```js
const { spawn } = require("child_process");

const ls = spawn("ls", ["-la"]);

ls.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

ls.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});
```

**fork**

```js
const { fork } = require("child_process");

const child = fork("child_script.js");

child.on("message", (msg) => {
  console.log("Message from child", msg);
});

child.send({ hello: "world" });
```

**worker_threads**：用于创建多线程，执行Node.js代码。提供了较小的开销，并且可以共享主线程的内存，快速地交换数据。

```js
const { Worker, isMainThread, parentPort } = require("worker_threads");

if (isMainThread) {
  // 主线程
  const worker = new Worker(__filename);

  worker.on("message", (msg) => {
    console.log("Message from worker:", msg);
  });

  worker.postMessage("Hello, worker!");
} else {
  // Worker 线程
  parentPort.on("message", (msg) => {
    console.log("Message from parent:", msg);
    parentPort.postMessage("Hello, parent!");
  });
}
```
