---
lang: zh-CN
title: node
description: node面试题
---

# node

## 1、说说你对 Node.js 的理解
Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，主要用于构建高性能、可扩展的网络应用。它的出现使得 JavaScript 不再局限于浏览器端，而可以在服务端运行。
::: details 详情
**Node.js 的核心特点**
- 单线程、事件驱动
   - Node.js 使用单线程处理请求，通过事件循环（Event Loop）实现高并发。
   - 适合 I/O 密集型任务，但不适合 CPU 密集型任务。
- 非阻塞 I/O
   - Node.js 的 I/O 操作是异步的，避免了线程阻塞，提高了性能。
- 基于 V8 引擎
   - 使用 Google 的 V8 引擎，提供了高效的 JavaScript 执行性能。
- 模块化
   - 内置模块（如 `fs`、`http`）和社区模块（通过 npm 提供）使得开发更加高效。
- 跨平台
   - 支持 Windows、Linux 和 macOS 等多种操作系统。

---

**Node.js 的应用场景**

- Web 服务
  - 构建高性能的 Web 服务器，如 RESTful API 和实时聊天应用。
- 实时应用
  - 适合构建需要实时通信的应用，如 WebSocket 聊天、在线协作工具。
- 工具链
  - 用于构建前端开发工具，如 Webpack、Babel 等。
- 微服务架构
  - 通过轻量化的特性，适合构建微服务架构的服务端。
- 流式处理
  - 处理大文件的流式传输，如视频流、日志流等。

--- 

**Node.js 的优缺点**

- 优点
  - 高性能：Node.js 使用单线程处理请求，避免了线程阻塞，提高了性能。
  - 开发效率高：使用 JavaScript 统一前后端语言，降低了学习成本。
  - 生态丰富：拥有庞大的 npm 包管理器，提供了大量的第三方模块。
- 缺点
  - 单线程：不适合 CPU 密集型任务，可能导致主线程阻塞。
  - 回调地狱：异步编程可能导致代码难以维护（可通过 Promise 和 async/await 改善）。

---

**总结**

Node.js 是一个轻量、高效的 JavaScript 运行时环境，适合构建高并发、I/O 密集型的应用。通过其事件驱动和非阻塞 I/O 模型，Node.js 在实时应用、Web 服务和工具链开发中表现出色。然而，由于单线程的限制，它在处理 CPU 密集型任务时需要特别注意。
:::

## 2、Node.js 模块级别的全局对象
::: details 详情

**模块级别的全局对象**

- `exports`
  > 是 `module.exports` 的一个引用，用于导出模块的内容。如果直接赋值给 `exports`，会断开与 `module.exports` 的引用关系，导致导出失败。
  ```js
    // 正确用法
  exports.hello = function () {
    console.log("Hello, Node.js!");
  };

  // 错误用法（会导致导出失败）
  exports = {
    hello: function () {
      console.log("Hello, Node.js!");
    },
  };
  ```
- `require`
  > 用于引入模块、 `JSON`、或本地文件，可以从 `node_modules` 引入模块。
  ```js
  // 引入核心模块
  const fs = require("fs");

  // 引入本地模块
  const myModule = require("./myModule");

  // 引入 JSON 文件
  const config = require("./config.json");
  ```
- `module`
  > 对当前模块的引用，通过 `module.exports` 用于指定一个模块所导出的内容，即可以通过 `require()` 访问的内容。
  ```js
  console.log(module.id); // 模块标识符
  console.log(module.filename); // 模块的绝对路径
  console.log(module.loaded); // 模块是否已加载完成
  ```
- `__filename`
  > 表示当前模块文件的绝对路径，包含文件名和完整路径。
- `__dirname`
  > 表示当前模块文件所在的目录的绝对路径，不包含文件名。

---

**模块级别的全局变量和真正的全局对象的区别**

- 在浏览器的 JavaScript 中，`window` 是全局对象，而在 Node.js 中，全局对象是 `global`。
- 在 Node.js 中，所有用户代码都运行在模块作用域内，而不是全局作用域中。因此，在最外层定义的变量仅在当前模块中有效，无法直接成为全局变量。但可以通过 `exports` 对象将模块中的内容导出，以供其他模块使用。
- 需要注意的是，在 Node.js 中，用 `var` 声明的变量并不属于全局变量，它的作用域仅限于当前模块。而 `global` 对象则是 Node.js 的全局对象，处于全局作用域中，任何通过 `global` 定义的变量、函数或对象都可以在整个应用中访问。

---

**总结**

在 Node.js 中，`exports`、`require`、`module`、`__filename` 和 `__dirname` 是模块级别的全局变量，它们在每个模块中独立存在，用于支持模块化开发。这些变量并非真正的全局变量，而是通过 Node.js 的模块包装机制传递给每个模块。

Node.js 在加载模块时，会将模块的代码包装在一个立即执行函数（IIFE）中，并将这些变量作为参数传入。例如：
```js
(function(exports, require, module, __filename, __dirname) {
  // 模块的代码在这里
})(exports, require, module, __filename, __dirname);
```
:::

## 3、说说对 Node.js 中的事件循环机制（Event Loop）理解
Node.js 的事件循环（Event Loop）是其核心机制之一，用于实现非阻塞 I/O 和高并发处理。它基于 JavaScript 的事件驱动模型，并结合了 `libuv` 库的多线程能力，管理异步任务的执行。
::: details 详情
**事件循环的六个阶段**

1️⃣ `timers` 阶段
  - 执行由 `setTimeout` 和 `setInterval` 设置的回调函数。
  - 如果定时器的时间到达，回调会被放入此阶段的任务队列。

2️⃣ `pending callbacks` 阶段
  - 执行一些系统操作的回调函数，例如 TCP 错误类型的回调。

3️⃣ `idle, prepare` 阶段
  - 内部使用，几乎不会涉及到用户代码。

4️⃣ `poll` 阶段
  - 处理 I/O 事件，如文件读取、网络请求等。
  - 如果没有定时器或其他任务，事件循环可能会在此阶段阻塞，等待新的 I/O 事件。

5️⃣ `check` 阶段
  - 执行 `setImmediate` 设置的回调函数。

6️⃣ `close callbacks` 阶段
  - 执行一些关闭事件的回调函数，例如 `socket.close()` 的回调。

---

**事件循环的执行顺序**

通过上面的学习，下面开始看看题目：
```js
async function async1() {
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}

async function async2() {
    console.log('async2')
}

console.log('script start')

setTimeout(function () {
    console.log('setTimeout0')
}, 0)

setTimeout(function () {
    console.log('setTimeout2')
}, 300)

setImmediate(() => console.log('setImmediate'));

process.nextTick(() => console.log('nextTick1'));

async1();

process.nextTick(() => console.log('nextTick2'));

new Promise(function (resolve) {
    console.log('promise1')
    resolve();
    console.log('promise2')
}).then(function () {
    console.log('promise3')
})

console.log('script end')
```
分析过程：
<!-- - 先找到同步任务，输出script start。
- 遇到第一个 setTimeout，将里面的回调函数放到 timer 队列中。
- 遇到第二个 setTimeout，300ms后将里面的回调函数放到 timer 队列中。
- 遇到第一个setImmediate，将里面的回调函数放到 check 队列中。
- 遇到第一个 nextTick，将其里面的回调函数放到本轮同步任务执行完毕后执行。
- 执行 async1函数，输出 async1 start。
- 执行 async2 函数，输出 async2，async2 后面的输出 async1 end进入微任务，等待下一轮的事件循环。
- 遇到第二个，将其里面的回调函数放到本轮同步任务执行完毕后执行。
- 遇到 new Promise，执行里面的立即执行函数，输出 promise1、promise2。
- then里面的回调函数进入微任务队列。
- 遇到同步任务，输出 script end。
- 执行下一轮回到函数，先依次输出 nextTick 的函数，分别是 nextTick1、nextTick2。
- 然后执行微任务队列，依次输出 async1 end、promise3。
- 执行timer 队列，依次输出 setTimeout0。
- 接着执行 check 队列，依次输出 setImmediate。
- 300ms后，timer 队列存在任务，执行输出 setTimeout2。 -->
1️⃣ 同步任务执行：
  - `console.log('script start')` 输出 `script start`。
  - 定时器和异步任务（如 `setTimeout`、`setImmediate`、`process.nextTick`）的回调被放入相应的队列中。
  - 执行 `async1()`：
    - 输出 `async1 start`。
    - 调用 `async2()`，输出 `async2`。
    - `await async2()` 后的代码（`console.log('async1 end')`）进入微任务队列。
  - 执行 `new Promise` 的同步部分，输出 `promise1` 和 `promise2`。
  - `then` 的回调函数进入微任务队列。
  - 输出 `script end`。

2️⃣ 微任务队列执行：
  - 按优先级依次执行 `process.nextTick` 的回调，输出 `nextTick1` 和 `nextTick2`。
  - 执行微任务队列中的回调，依次输出 `async1` `end` 和 `promise3`。

3️⃣ 宏任务队列执行：
  - 执行 `timers` 阶段的回调，输出 `setTimeout0`。
  - 执行 `check` 阶段的回调，输出 `setImmediate`。
  - 300ms 后，执行 `timers` 阶段的回调，输出 `setTimeout2`。

执行结果如下：
```
script start
async1 start
async2
promise1
promise2
script end
nextTick1
nextTick2
async1 end
promise3
setTimeout0
setImmediate
setTimeout2
```
补充说明：
- `process.nextTick` 的优先级
  - `process.nextTick` 的回调会在当前事件循环阶段结束前执行，优先级高于微任务（如 `Promise.then`）。
- `setTimeout` 和 `setImmediate` 的顺序
  - 在 Node.js `中，setTimeout` 和 `setImmediate` 的执行顺序取决于它们的调用时机：
    - `如果在主线程中调用，setTimeout` 的回调会在 `timers` 阶段执行，而 `setImmediate` 的回调会在 `check` 阶段执行。
    - 如果在 I/O 回调中调用，`setImmediate` 的回调会优先执行。
- `await` 的行为：
  - `await` 会暂停当前异步函数的执行，并将后续代码放入微任务队列。
- 事件循环阶段：
  - Node.js 的事件循环分为多个阶段，每个阶段处理特定类型的任务。任务的执行顺序由事件循环的阶段决定。

---

**事件循环的特点**
- 单线程
  > - Node.js 的事件循环运行在单线程中，但通过 libuv 库实现了多线程的 I/O 操作。
- 非阻塞 I/O
  > - 异步 I/O 操作不会阻塞主线程，任务完成后会将回调函数放入事件队列中等待执行。
- 任务优先级
  > - `process.nextTick()` 的优先级高于其他异步任务。
  > - `setTimeout` 和 `setImmediate` 的优先级取决于事件循环的阶段。
:::

## 4、说说对 Node.js 中的 `process` 的理解
`process` 是 Node.js 提供的一个全局对象，用于描述当前 Node.js 进程的状态和控制进程的行为。它无需引入，可以直接使用。
::: details 详情
**`process` 的常见属性和方法**
|属性/方法|描述|
|--------|------------|
|`process.pid`|当前进程的 ID|
|`process.platform`|当前运行平台（如 `win32`、`linux`）|
|`process.version`|当前 Node.js 的版本号|
|`process.env`|环境变量对象|
|`process.argv`|命令行参数数组|
|`process.cwd()`|获取当前工作目录|
|`process.exit(code)`|退出当前进程，`code` 为退出码（默认 0 表示正常退出）|
|`process.kill(pid)`|向指定进程发送信号|
|`process.on(event)`|监听进程事件（如 `exit`、`uncaughtException`）|
|`process.nextTick(callback)`|将回调函数放入下一次事件循环的队列中，优先于其他异步任务执行|

---

**注意事项**
- 避免滥用 `process.exit()`：
  - 直接调用 `process.exit()` 会强制退出进程，可能导致未完成的任务被中断。
  - 推荐在退出前清理资源（如关闭文件、断开数据库连接等）。
- 避免滥用 `process.nextTick()`：
  - 如果在 `process.nextTick()` 中递归调用自身，可能会导致事件循环被阻塞，影响其他异步任务的执行。
- 处理未捕获的异常：
  - 使用 `process.on("uncaughtException")` 捕获未处理的异常，但不建议依赖此机制。
  - 推荐使用 `try-catch` 或全局错误处理工具。
- 跨平台兼容性：
  - 使用 `process.platform` 判断运行平台时，注意不同平台的差异（如路径分隔符）。
:::

## 5、Node.js 中有哪些常用的内置模块
::: details 详情
**文件系统模块（`fs`）**
- 用于创建、读取、更新和删除文件。
- 常用方法
  - `fs.readFile()`：异步读取文件内容。
  - `fs.readFileSync()`：同步读取文件内容。
  - `fs.writeFile()`：异步写入文件内容。
  - `fs.writeFileSync()`：同步写入文件内容。
  - `fs.mkdir()`：创建目录。
  - `fs.mkdirSync()`：同步创建目录。
  - `fs.readdir()`：读取目录内容。
  - `fs.unlink()`：删除文件。
  - `fs.stat()`：获取文件或目录的状态信息。
  - `fs.watch()`：监听文件或目录的变化。

---

**HTTP 模块（`http`）**
- 用于创建 HTTP 服务器和客户端。
- 常用方法
  - `http.createServer()`：创建 HTTP 服务器。
  - `http.request()`：发送 HTTP 请求。
  - `http.get()`：发送 GET 请求。

---

**路径模块（`path`）**
- 提供用于处理和操作文件路径的工具。
- 常用方法
  - `path.join()`：将多个路径片段拼接成一个完整路径，自动处理路径分隔符。
  - `path.resolve()`：将路径片段解析为绝对路径，从右到左依次处理，直到构造出一个绝对路径。
  - `path.basename()`：获取文件名。
  - `path.dirname()`：获取目录名。
  - `path.extname()`：获取文件扩展名。
  - `path.parse()`：解析路径为对象。
  - `path.format()`：将路径对象格式化为字符串。

---

**URL 模块（`url`）**
- 提供 URL 解析和格式化的工具。
- 常用方法
  - `url.parse()`：解析 URL。
  - `url.format()`：将 URL 格式化为字符串。
  - `url.resolve()`：解析相对路径。
  - `url.resolveObject()`：解析相对路径为对象。

---

**操作系统模块（`os`）**
- 提供与操作系统相关的信息，如 CPU、内存、文件系统等。
- 常用方法
  - `os.cpus()`：获取 CPU 信息。
  - `os.freemem()`：获取可用内存。
  - `os.totalmem()`：获取总内存。
  - `os.homedir()`：获取用户主目录。
  - `os.networkInterfaces()`：获取网络接口信息。
  - `os.tmpdir()`：获取临时目录。
  - `os.hostname()`：获取主机名。
  - `os.platform()`：获取运行平台。
  - `os.release()`：获取操作系统版本。
  - `os.type()`：获取操作系统类型。
  - `os.uptime()`：获取系统运行时间。
  - `os.userInfo()`：获取用户信息。
  - `os.arch()`：获取 CPU 架构。

---

**事件模块（`events`）**
- 用于创建和监听事件。
- 常用方法
  - `EventEmitter.on()`：监听事件。
  - `EventEmitter.emit()`：触发事件。
  - `EventEmitter.once()`：监听一次性事件。
  - `EventEmitter.removeListener()`：移除事件监听器。

---

**子进程模块（`child_process`）**
- 用于创建子进程，并管理子进程的生命周期。
- 常用方法
  - `child_process.spawn()`：创建子进程。
  - `child_process.exec()`：执行命令行命令。
  - `child_process.execFile()`：执行文件命令。
  - `child_process.fork()`：创建子进程并执行模块。

---

**流模块（`stream`）**
- 提供处理流数据的接口，如文件流、网络流等。。
- 常用方法
  - `stream.Readable`：可读流。
  - `stream.Writable`：可写流。
  - `stream.pipe()`：将可读流连接到可写流。
  - `stream.Transform`：转换流。

---

**加密模块（`crypto`）**
- 用于加密和哈希数据。
- 常用方法
  - `crypto.createHash()`：创建哈希对象。
  - `crypto.createCipher()`：创建加密对象。
  - `crypto.createDecipher()`：创建解密对象。
  - `crypto.randomBytes()`：生成随机字节。
:::

## 6、说说对 Node.js 中的 `path` 模块的理解
`path` 模块提供了用于处理和操作文件路径的工具，能够跨平台处理路径分隔符差异（如 Windows 使用 `\`，而 POSIX 使用 `/`）。
::: details 详情
**常用方法**
- `path.join([...paths])`
  > 将多个路径片段拼接成一个完整路径，自动处理路径分隔符。
  ```js
  const path = require('path');
  const fullPath = path.join('/users', 'john', 'docs', 'file.txt');
  console.log(fullPath); // 输出: /users/john/docs/file.txt
  ```
- `path.resolve([...paths])`
  > 将路径片段解析为绝对路径，从右到左依次处理，直到构造出一个绝对路径。
  ```js
  const path = require('path');
  const absolutePath = path.resolve('docs', 'file.txt');
  console.log(absolutePath); // 输出: /当前工作目录/docs/file.txt
  ```
- `path.basename(path[, ext])`
  > 返回路径的最后一部分（文件名），可以选择移除扩展名。
  ```js
  const path = require('path');
  const fileName = path.basename('/users/john/docs/file.txt');
  console.log(fileName); // 输出: file.txt

  const fileNameWithoutExt = path.basename('/users/john/docs/file.txt', '.txt');
  console.log(fileNameWithoutExt); // 输出: file
  ```
- `path.dirname(path)`
  > 返回路径的目录名（不包含文件名）。
  ```js
  const path = require('path');
  const dirName = path.dirname('/users/john/docs/file.txt');
  console.log(dirName); // 输出: /users/john/docs
  ```
- `path.extname(path)`
  > 返回路径的扩展名。
  ```js
  const path = require('path');
  const extName = path.extname('/users/john/docs/file.txt');
  console.log(extName); // 输出: .txt
  ```
- `path.parse(path)`
  > 将路径解析为对象，包含 `root`、`dir`、`base`、`name` 和 `ext` 属性。
  ```js
  const path = require('path');
  const parsedPath = path.parse('/users/john/docs/file.txt');
  console.log(parsedPath);
  // 输出:
  // {
  //   root: '/',
  //   dir: '/users/john/docs',
  //   base: 'file.txt',
  //   name: 'file',
  //   ext: '.txt'
  // }
  ```
- `path.format(pathObject)`
  > 将路径对象格式化为字符串，效果与 `path.parse()` 相反。
  ```js
  const path = require('path');
  const formattedPath = path.format({
    root: '/',
    dir: '/users/john/docs',
    base: 'file.txt'
  });
  console.log(formattedPath); // 输出: /users/john/docs/file.txt
  ```
- `path.isAbsolute(path)`
  > 判断路径是否为绝对路径。
  ```js
  const path = require('path');
  console.log(path.isAbsolute('/users/john')); // 输出: true
  console.log(path.isAbsolute('docs/file.txt')); // 输出: false
  ```
- `path.relative(from, to)`
  > 返回从 `from` 到 `to` 的相对路径。
  ```js
  const path = require('path');
  const relativePath = path.relative('/users/john/docs', '/users/john/images');
  console.log(relativePath); // 输出: ../images
  ```
- `path.normalize(path)`
  > 规范化路径。
  ```js
  const path = require('path');
  const normalizedPath = path.normalize('/users/john/../docs/./file.txt');
  console.log(normalizedPath); // 输出: /users/docs/file.txt
  ```
- `path.sep`
  > 提供平台特定的路径分隔符（POSIX 为 `/`，Windows 为 `\`）。
  ```js
  const path = require('path');
  console.log(path.sep); // POSIX 输出: /，Windows 输出: \
  ```
- `path.delimiter`
  > 提供平台特定的路径分隔符（POSIX 为 `:`，Windows 为 `;`）。
  ```js
  const path = require('path');
  console.log(path.delimiter); // POSIX 输出: :，Windows 输出: ;
  ```

---

**路径模块的应用场景**
- 跨平台路径处理
  - 使用 `path.join()` 和 `path.resolve()` 处理路径，避免手动拼接路径分隔符。
- 文件路径解析
  - 使用 `path.parse()` 和 `path.basename()` 提取文件名、扩展名等信息。
- 动态路径生成
  - 使用 `path.join()` 和 `path.format()` 动态生成文件路径。
:::

## 7、说说对 Node.js 中的 `fs` 模块的理解
`fs` 模块是 Node.js 的内置模块，用于处理文件系统操作，支持文件和目录的创建、读取、写入、删除等操作。`fs` 模块支持同步和异步两种方式，异步方式更符合 Node.js 的非阻塞 I/O 特性。
::: details 详情
**常用方法**
- `fs.readFile(path, options, callback)`
  > 异步读取文件内容。
  ```js
  const fs = require('fs');
  fs.readFile('example.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
  });
  ```
- `fs.readFileSync(path, options)`
  > 同步读取文件内容。
  ```js
  const fs = require('fs');
  const data = fs.readFileSync('example.txt', 'utf8');
  console.log(data);
  ```
- `fs.createReadStream`
  > 创建一个可读的流，用于从文件读取数据。
  ```js
  const fs = require('fs');
  const readStream = fs.createReadStream('example.txt');
  readStream.on('data', (chunk) => {
    console.log(chunk);
  })
  readStream.on('end', () => {
    console.log('读取完成');
  })
  readStream.on('error', (err) => {
    console.log(err);
  })
  ```
- `fs.writeFile(path, data, options, callback)`
  > 异步写入文件内容。
  ```js
  const fs = require('fs');
  fs.writeFile('example.txt', 'Hello, Node.js!', (err) => {
    if (err) throw err;
    console.log('File written successfully!');
  });
  ```
- `fs.writeFileSync(path, data, options)`
  > 同步写入文件内容。
  ```js
  const fs = require('fs');
  fs.writeFileSync('example.txt', 'Hello, Node.js!');
  console.log('File written successfully!');
  ```
- `fs.appendFile(path, data, options, callback)`
  > 异步追加文件内容。
  ```js
  const fs = require('fs');
  fs.appendFile('example.txt', 'Hello, Node.js!', (err) => {
    if (err) throw err;
    console.log('File appended successfully!');
  })
  ```
- `fs.createWriteStream`
  > 创建一个可写的流，用于向文件写入数据。
  ```js
  const fs = require('fs');
  const writeStream = fs.createWriteStream('example.txt');
  writeStream.write('Hello World');
  writeStream.end();
  writeStream.on('finish', () => {
    console.log('写入完成');
  })
  writeStream.on('error', (err) => {
    console.log(err);
  })
  ```
- `fs.unlink(path, callback)`
  > 异步删除文件。
  ```js
  const fs = require('fs');
  fs.unlink('example.txt', (err) => {
    if (err) throw err;
    console.log('File deleted successfully!');
  })
  ```
- `fs.stat(path, callback)`
  > 异步获取文件信息。
  ```js
  const fs = require('fs');
  fs.stat('example.txt', (err, stats) => {
    if (err) throw err;
    console.log(`File size: ${stats.size} bytes`);
  })
  ```
- `fs.existsSync(path)`
  > 同步检查文件是否存在。
  ```js
  const fs = require('fs');
  if (fs.existsSync('example.txt')) {
    console.log('File exists!');
  }
  ```
- `fs.readdir(path, callback)`
  > 异步读取目录内容。
  ```js
  const fs = require('fs');
  fs.readdir('/path/to/directory', (err, files) => {
    if (err) throw err;
    console.log(files);
  })
  ```
- `fs.watchFile(path, options, listener)`
  > 监听文件变化。
  ```js
  const fs = require('fs');
  fs.watchFile('/path/to/file', (curr, prev) => {
    console.log(`the current mtime is: ${curr.mtime}`);
  })
  ```
- `fs.watch(path, options, listener)`
  > 监听文件或目录的变化。
  ```js
  const fs = require('fs');
  fs.watch('example.txt', (eventType, filename) => {
    console.log(`Event: ${eventType}, File: ${filename}`);
  });
  ```
:::

## 8、Node.js 中 require 时发生了什么
`require` 是 Node.js 中用于引入模块的关键方法，它可以加载核心模块、第三方模块以及本地模块。`require` 的加载过程涉及模块的解析、编译和缓存机制。
::: details 详情
**`require` 的加载过程**

1️⃣ 路径解析
  - Node.js 首先根据传入的模块标识符（如模块名或路径）解析模块的路径。
  - 核心模块（如 `fs`、`http`）优先加载，无需路径解析。
  - 对于本地模块，Node.js 会根据文件路径解析模块的绝对路径。

2️⃣ 文件定位
  - 如果模块标识符是文件路径，Node.js 会尝试加载以下文件：
    - 精确匹配的文件（如 `./module.js`）。
    - 如果没有扩展名，会依次尝试 `.js`、`.json`、`.node`。
  - 如果模块标识符是目录路径，Node.js 会尝试加载目录下的 `package.json` 中的 `main` 字段指定的文件。如果没有 `package.json`，会尝试加载 `index.js` 或 `index.node`。

3️⃣ 模块编译
  - 对于 `.js` 文件，Node.js 会将其包装在一个立即执行函数（IIFE） 中执行。
  - 对于 `.json` 文件，Node.js 会使用 `JSON.parse` 解析文件内容。
  - 对于 `.node` 文件（C++ 扩展），Node.js 会加载编译后的二进制文件。

4️⃣ 模块缓存
  - 加载完成的模块会被缓存到 `require.cache` 中，避免重复加载。
  - 如果再次 `require` 相同的模块，Node.js 会直接从缓存中返回模块的导出对象。

---

**`require` 的加载顺序**

1️⃣ 系统缓存
  - Node.js 首先检查模块是否已经被加载过（即是否存在于 `require.cache` 中）。

2️⃣ 系统模块
  - 如果模块是 Node.js 的核心模块（如 `fs`、`http`），会直接加载核心模块。

3️⃣ 文件模块
  - 如果模块标识符是文件路径（如 `./module.js` 或 `../module`），Node.js 会尝试加载对应的文件。

4️⃣ 目录模块
  - 如果模块标识符是目录路径，Node.js 会尝试加载该目录下的 `package.json` 文件中 `main` 字段指定的文件。
  - 如果没有 `package.json`，会尝试加载目录下的 `index.js` 或 `index.node` 文件。

5️⃣ `node_modules` 目录
  - 如果模块标识符是模块名（如 `express`），Node.js 会从当前模块所在目录开始，逐级向上查找 `node_modules` 目录，直到找到对应的模块。
  - 如果在所有父级目录中都找不到模块，会抛出 `MODULE_NOT_FOUND` 错误。
:::

## 9、如何发布一个全局可执行命令的 npm package
在 package.json 中增加 bin，对应脚本，脚本文件头部 `#!/usr/bin/env node`
> `#!/usr/bin/env node` 是 shebang，用于指定脚本运行时使用 Node.js。

## 10、Node.js 如何修改内存大小
Node.js 默认的内存限制是约 **1.7GB**（64 位系统）或 **0.8GB**（32 位系统）。如果需要处理大数据集或内存密集型任务，可以通过 `node --max-old-space-size=4096` 修改内存大小。

## 11、说说对 Node.js 中的 Buffer 的理解
`Buffer` 是 Node.js 中用于处理二进制数据的类。它类似于浏览器中的 `TypedArray`，但功能更强大，专为处理二进制数据流设计。
::: details 详情
**创建 Buffer 的方式**
- `Buffer.alloc(size)`
  > 创建一个指定大小的 Buffer，并用 `0` 填充。
  ```js
  const buf = Buffer.alloc(10); // 创建一个大小为 10 字节的 Buffer
  console.log(buf); // <Buffer 00 00 00 00 00 00 00 00 00 00>
  ```
- `Buffer.allocUnsafe(size)`
  > 创建一个指定大小的 Buffer，但不初始化内容，可能包含旧数据。
  ```js
  const buf = Buffer.allocUnsafe(10);
  console.log(buf); // 可能包含随机数据
  ```
- `Buffer.from(array)`
  > 从数组创建 Buffer。
  ```js
  const buf = Buffer.from([1, 2, 3]);
  console.log(buf); // <Buffer 01 02 03>
  ```
- `Buffer.from(string[, encoding])`
  > 从字符串创建 Buffer，默认编码为 `utf8`。
  ```js
  const buf = Buffer.from('Hello, Node.js!');
  console.log(buf); // <Buffer 48 65 6c 6c 6f 2c 20 4e 6f 64 65 2e 6a 73 21>
  ```

---

**常用方法**
- `buf.toString([encoding[, start[, end]]])`
  > 将 Buffer 转换为字符串。
  ```js
  const buf = Buffer.from('Hello, Node.js!');
  console.log(buf.toString('utf8')); // 输出: Hello, Node.js!
  ```
- `buf.length`
  > 获取 Buffer 的长度（字节数）。
  ```js
  const buf = Buffer.from('Hello');
  console.log(buf.length); // 输出: 5
  ```
- `buf.slice(start, end)`
  > 截取 Buffer 的一部分，不会复制数据。
  ```js
  const buf = Buffer.from('Hello, Node.js!');
  const slice = buf.slice(0, 5);
  console.log(slice.toString()); // 输出: Hello
  ```
- `Buffer.concat(list[, totalLength])`
  > 合并多个 Buffer。
  ```js
  const buf1 = Buffer.from('Hello, ');
  const buf2 = Buffer.from('Node.js!');
  const buf = Buffer.concat([buf1, buf2]);
  console.log(buf.toString()); // 输出: Hello, Node.js!
  ```
- `buf.write(string[, offset[, length[, encoding]]])`
  > 向 Buffer 中写入数据。
  ```js
  const buf = Buffer.alloc(10);
  buf.write('Hello');
  console.log(buf.toString()); // 输出: Hello
  ```
- `Buffer.isBuffer(obj)`
  > 检查对象是否为 Buffer。
  ```js
  const buf = Buffer.from('Hello');
  console.log(Buffer.isBuffer(buf)); // 输出: true
  ```

---

**Buffer 的特点**
- 固定大小
  > Buffer 的大小在创建时确定，无法动态调整。
- 高效操作
  > Buffer 提供了直接操作内存的方法，适合处理高性能需求的场景。
- 编码支持
  > 支持多种编码格式，如 `utf8`、`ascii`、`base64`、`hex` 等。

---

**使用场景**
- 处理网络数据流
  > 如 `TCP` 数据流、`HTTP` 请求和响应。
- 文件操作
  > 读取和写入二进制文件。
- 数据加密
  > 处理加密算法中的二进制数据。
- 图片、视频等多媒体数据
  > 处理非文本数据

---

**注意事项**
- `Buffer.allocUnsafe` 的风险
  > 由于未初始化内容，可能包含旧数据，使用前需要手动清空。
- 内存泄漏
  > 如果长时间持有 Buffer 对象，可能导致内存泄漏，需及时释放不再使用的 Buffer。
:::

## 12、说说对 Node.js 中的 Stream 的理解
`Stream` 是 Node.js 中处理流式数据的 **抽象接口** ，适合处理大文件、网络数据流等场景。通过流的分块处理和实时传输机制，可以显著提高性能并节省内存。
::: details 详情
**Stream 的类型**
- 可读流（Readable）
  > 可读取数据的流。例如 `fs.createReadStream()` 可以从文件读取内容。
- 可写流（Writable）
  > 可写入数据的流。例如 `fs.createWriteStream()` 可以将数据写入文件。
- 双工流（Duplex）
  > 可读写数据的流。例如 `net.Socket` 可以用于网络通信。
- 转换流（Transform）
  > 可读写数据的流，并且可以进行数据转换。例如 `zlib.createGzip()` 可以将数据压缩。

Node.js中很多对象都实现了流，总之它是会冒数据（以 `Buffer` 为单位），它的独特之处在于，它不像传统的程序那样一次将一个文件读入内存，而是逐块读取数据、处理其内容，而不是将其全部保存在内存中。

流可以分成三部分：`source`、`dest`、`pipe`

在 `source` 和 `dest` 之间有一个连接的管道 `pipe`，它的基本语法是 `source.pipe(dest)`，`source` 和 `dest` 就是通过 `pipe` 连接，让数据从 `source` 流向了 `dest`。

:::

## 13、JWT 是什么
JWT（JSON Web Token）是一种开放标准（RFC 7519），用于在各方之间以 JSON 对象的形式安全地传输信息。它通常用于身份验证和信息交换。
::: details 详情
**JWT 的结构**

JWT 分成了三部分，头部（Header）、载荷（Payload）、签名（Signature），并以.进行拼接。

- 头部（Header）
  > 描述 JWT 的元信息，包括类型和签名算法。
  ```json
  {
    "alg": "HS256", // 签名算法，如 HMAC SHA256
    "typ": "JWT"    // 类型，固定为 JWT
  }
  ```
- 载荷（Payload）
  > 包含需要传输的声明（claims），可以是用户信息或其他数据。
  ```json
  {
    "sub": "1234567890", // 用户 ID
    "name": "John Doe",  // 用户名
    "iat": 1516239022    // 签发时间（时间戳）
  }
  ```
- 签名（Signature）
  > 用于验证数据的完整性，防止数据被篡改。
  ```
  HMACSHA256(
    base64UrlEncode(header) + "." + base64UrlEncode(payload),
    secret
  )
  ```

---

**JWT 的工作原理**

1️⃣ 用户登录
  > 用户通过用户名和密码登录，服务器验证用户身份。

2️⃣ 生成 JWT
  > 服务器根据用户信息生成 JWT，并将其返回给客户端。

3️⃣ 客户端存储 JWT
  > 客户端通常将 JWT 存储在 `localStorage` 或 `cookie` 中。

4️⃣ 请求携带 JWT
  > 客户端在后续请求中将 JWT 放入 `Authorization` 头中。

5️⃣ 服务器验证 JWT
  > 服务器通过验证 JWT 的签名和有效期，确认请求的合法性。

---

**JWT 的优缺点**
- 优点
  - 无状态：JWT 是自包含的，服务器无需存储会话信息，适合分布式系统。
  - 跨语言支持：JWT 是基于 JSON 的，支持多种语言实现。
  - 安全性：使用签名确保数据完整性，防止篡改。
- 缺点
  - 无法撤销：一旦 JWT 签发，无法轻易撤销，除非在服务器端实现黑名单。
  - 大小：JWT 包含头部、载荷和签名，体积可能较大，影响传输效率。
  - 安全性依赖于密钥：如果密钥泄露，JWT 的安全性将受到威胁。
:::

## 14、请简述重新登录 Refresh Token 的原理
::: details 详情
Refresh Token，将会话管理流程改进如下：
- 客户端使用用户名密码进行认证。
- 服务端生成有效时间较短的 `Access Token`（例如 10 分钟），和有效时间较长的 `Refresh Token`（例如 7 天）。
- 客户端访问需要认证的接口时，携带 `Access Token`。
- 如果 `Access Token` 没有过期，服务端鉴权后返回给客户端需要的数据。
- 如果携带 `Access Token` 访问需要认证的接口时鉴权失败（例如返回 401 错误），则客户端使用 `Refresh Token` 向刷新接口申请新的 `Access Token`。
- 如果 `Refresh Token` 没有过期，服务端向客户端下发新的 `Access Token`。
- 客户端使用新的 `Access Token` 访问需要认证的接口。

Refresh Token 提供了服务端禁用用户 Token 的方式，当用户需要登出或禁用用户时，只需要将服务端的 `Refresh Token` 禁用或删除，用户就会在 `Access Token` 过期后，由于无法获取到新的 `Access Token` 而再也无法访问需要认证的接口。这样的方式虽然会有一定的窗口期（取决于 `Access Token` 的失效时间），但是结合用户登出时客户端删除 `Access Token` 的操作，基本上可以适应常规情况下对用户认证鉴权的精度要求。
:::