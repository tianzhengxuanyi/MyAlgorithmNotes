## Node.js 

### ES6模块和CommonJS模块的区别？

1. 模块定义方式
   - CommonJS模块：使用require()函数引入模块，模块导出通过exports对象实现。
   - ES6模块：使用import和export语句引入模块，模块导出通过export语句实现。
2. 加载方式
   - CommonJS模块：同步加载。
   - ES6模块：异步加载。
3. 依赖分析
   - CommonJS模块：动态，会在运行时解析模块的依赖关系。
   - ES6模块：静态，在编译时解析依赖关系。
**TODO：Q**
4. 模块作用域
   - CommonJS模块：每个模块都有自己的作用域，模块内部的变量和函数不会影响到其他模块。
   - ES6模块：模块作用域是静态的，模块内部的变量和函数不会影响到其他模块。
**TODO：Q**
5. 导出的值
   - CommonJS模块：导出的是值。
   - ES6模块：导出的是对象引用。


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

### 如何在node中实现文件的压缩和解压？

使用内置的zlib模块实现文件的压缩和解压。

**文件压缩：**

```js
const fs = require('fs');
const zlib = require('zlib');

const inputFile = 'input.txt';
const outputFile = 'input.txt.gz';

const gzip = zlib.createGzip();
const input = fs.createReadStream(inputFile);
const output = fs.createWriteStream(outputFile);

input.pipe(gzip).pipe(output);

output.on('finish', () => {
    console.log(`File successfully compressed to ${outputFile}`);
});
```

**文件解压：**
```js
const fs = require('fs');
const zlib = require('zlib');

const inputFile = 'input.txt.gz';
const outputFile = 'output.txt';

const gunzip = zlib.createGunzip();
const input = fs.createReadStream(inputFile);
const output = fs.createWriteStream(outputFile);

input.pipe(gunzip).pipe(output);

output.on('finish', () => {
    console.log(`File successfully decompressed to ${outputFile}`);
});
```

### 在node中如何处理文件上传和下载？

通过express和multer模块实现文件上传和下载。

```js
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 配置 multer
const storage = multer.diskStorage({
  // 上传文件存储目录
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  // 上传文件存储文件名
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ 
  storage,
  // 限制上传文件类型
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb('Error: File type not supported!');
  },
  // 限制上传文件大小
  limits: { fileSize: 2 * 1024 * 1024 },  // 2MB
});

// 上传接口
// upload.single('file') 中间件 用于处理单个文件上传
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully.');
});

// 下载接口
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.download(filePath);
});

// 流式下载接口
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

```

### 如何在Node.js中实现纳米级别的高精度计时？

使用`process.hrtime()`方法

```js
const startTime = process.hrtime();

// 执行一些代码
for (let i = 0; i < 1e6; i++) {
  // 模拟一些耗时操作
}

// [秒, 纳秒]
const elapsedTime = process.hrtime(startTime);
console.log(`执行时间为 ${elapsedTime[0]} 秒 ${elapsedTime[1]} 纳秒`);
```

### 如何在Node.js中实现数据的缓存，提高性能？

- 内存缓存：使用node-cache、memory-cache
- 分布式缓存：使用Redis

**内存缓存：node-cache**
```js
const NodeCache = require('node-cache');
const myCache = new NodeCache();

// 设置缓存数据
myCache.set("key", "value", 10000); // 数据10秒后过期

// 获取缓存数据
const value = myCache.get("key");
console.log(value); // 输出 'value'
```

**内存缓存：memory-cache**
```js
const cache = require('memory-cache');

// 设置缓存数据
cache.put('key', 'value', 10000); // 数据10秒后过期

// 获取缓存数据
const value = cache.get('key');
console.log(value); // 输出 'value'
```

**分布式缓存：Redis**
```js
const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => {
  console.log('Error ' + err);
});

// 连接 Redis 服务器
client.connect();

// 设置缓存数据，10秒后过期
client.set('key', 'value', 'EX', 10);

// 获取缓存数据
client.get('key', (err, value) => {
  if (err) throw err;
  console.log(value); // 输出 'value'（如果数据未过期）
});
```

### Node.js中的守护进程如何实现的？

使用child_process模块创建守护进程，通过将父进程退出并且保持子进程运行，实现守护进程的功能。
1. 使用 spawn 方法创建子进程
2. 使用 detached 选项使子进程独立于父进程运行
3. 将输出重定向到文件，以便子进程不依赖终端
4. 退出父进程，使子进程成为孤儿进程

```js
const { spawn } = require('child_process');
const fs = require('fs');

// 定义守护进程的基本逻辑
function startDaemon() {
  const out = fs.openSync('./out.log', 'a');
  const err = fs.openSync('./err.log', 'a');

  const child = spawn(process.argv[0], ['child.js'], {
    detached: true,
    stdio: ['ignore', out, err]
  });

  // 让子进程不依赖父进程关闭
  child.unref();

  console.log(`Daemon process started with PID: ${child.pid}`);
}

// 如果当前进程是父进程，则启动守护进程
if (process.argv[2] !== 'daemon') {
  startDaemon();
  process.exit();
}

// 子进程的逻辑（保存在 child.js 文件中）
if (process.argv[2] === 'daemon') {
  setInterval(() => {
    console.log(`Daemon running with PID: ${process.pid}`);
  }, 1000);
}
```

### 如何在Node.js中处理文件系统的监控？

使用fs.watch或者fs.watchFile方法监控文件系统的变化。fs.watch适合监听目录的变化，fs.watchFile适合监听单个文件的变化。

**fs.watch：**
1. 基于事件驱动的文件系统监控，可以监听文件或目录的变化事件，包括rename和change事件
2. 支持控制是否递归监听目录

```js
const fs = require('fs');

fs.watch('path/to/file/or/directory', (eventType, filename) => {
  if (filename) {
    console.log(`${filename} file Changed due to ${eventType}`);
  }
});
```

**fs.watchFile：**
1. 基于轮询的文件系统监控，可以监听单个文件的变化事件
2. 支持设置轮询间隔时间，默认1000毫秒

```js
const fs = require('fs');

fs.watchFile('path/to/file', { interval: 500 }, (curr, prev) => {
  console.log(`File modified at: ${curr.mtime}`);
});
```