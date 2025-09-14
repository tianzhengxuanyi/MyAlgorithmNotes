---
lang: zh-CN
title: 场景题
description: 场景面试题
---

# 场景题

## 1、如何解决前端常见的竞态问题
::: details 详情
**举例：**
- 有一个分页列表，快速地切换第二页，第三页。
- 先后请求 data2 与 data3，分页器显示当前在第三页，并且进入 loading。
- 但由于网络的不确定性，先发出的请求不一定先响应，所以有可能 data3 比 data2 先返回。
- 在 data2 最终返回后，分页器指示当前在第三页，但展示的是第二页的数据。

---

**竞态问题的原因**
- 网络延迟：请求的响应顺序可能与发送顺序不一致。
- 状态更新不一致：组件状态未正确同步，导致显示错误的数据。
- 异步操作的不可控性：多个异步请求同时进行，缺乏有效的管理机制。

---

**解决方法**
- 使用请求标识
  > - 为每次请求生成唯一的标识符（如页码）。
  > - 仅处理当前标识符对应的响应，忽略过期的响应。
  ```js
  let currentPage = 0;

  async function fetchData(page) {
    currentPage = page; // 更新当前页码
    const response = await fetch(`/api/data?page=${page}`);
    if (page === currentPage) { // 仅处理当前页码的响应
      const data = await response.json();
      renderData(data);
    }
  }

  function renderData(data) {
    console.log('渲染数据:', data);
  }

  // 示例：快速切换页码
  fetchData(2);
  fetchData(3);
  ```
- 对比当前页码和后端返回的页码
  > - 在请求时，将当前页码作为参数发送给后端，后端在响应中返回对应的页码。
  > - 前端对比当前页码和后端返回的页码是否一致，仅处理匹配的响应数据。
  ```js
  let currentPage = 0;

  async function fetchData(page) {
    currentPage = page; // 更新当前页码

    const response = await fetch(`/api/data?page=${page}`);
    const result = await response.json();

    // 对比当前页码和后端返回的页码
    if (result.page === currentPage) {
      renderData(result.data);
    } else {
      console.log(`忽略过期响应：当前页码 ${currentPage}，返回页码 ${result.page}`);
    }
  }

  function renderData(data) {
    console.log('渲染数据:', data);
  }

  // 示例：快速切换页码
  fetchData(2);
  fetchData(3);
  ```
- 使用 AbortController
  > - 在发起新请求时，取消之前的未完成请求。
  ```js
  let controller;

  async function fetchData(page) {
    if (controller) {
      controller.abort(); // 取消之前的请求
    }
    // https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController
    controller = new AbortController();
    const signal = controller.signal;

    try {
      const response = await fetch(`/api/data?page=${page}`, { signal });
      const data = await response.json();
      renderData(data);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('请求被取消');
      } else {
        console.error('请求失败:', error);
      }
    }
  }

  function renderData(data) {
    console.log('渲染数据:', data);
  }

  // 示例：快速切换页码
  fetchData(2);
  fetchData(3);
  ```
- 使用 Promise 的最新响应
  > - 通过记录最新的请求时间戳，仅处理最新的响应。
  ```js
  let lastRequestTime = 0;

  async function fetchData(page) {
    const requestTime = Date.now();
    lastRequestTime = requestTime;

    const response = await fetch(`/api/data?page=${page}`);
    if (requestTime === lastRequestTime) { // 仅处理最新的响应
      const data = await response.json();
      renderData(data);
    }
  }

  function renderData(data) {
    console.log('渲染数据:', data);
  }

  // 示例：快速切换页码
  fetchData(2);
  fetchData(3);
  ```
:::

## 2、如何实现前端常见的网络并发请求控制
::: details 详情
**举例：**
- 现有 30 个异步请求需要发送，但由于某些原因，我们必须将同一时刻并发请求数量控制在 5 个以内，同时还要尽可能快速的拿到响应结果。应该怎么做？

---

**实现方法**
- 使用队列管理并发请求
  > - 将所有请求放入队列中，限制同时执行的请求数量。
  > - 当一个请求完成后，从队列中取出下一个请求执行。
  ```js
  function limitConcurrentRequests(requests, limit) {
    const results = [];
    let activeCount = 0;
    let currentIndex = 0;

    return new Promise((resolve) => {
      function next() {
        if (currentIndex === requests.length && activeCount === 0) {
          resolve(results); // 所有请求完成
          return;
        }

        while (activeCount < limit && currentIndex < requests.length) {
          const index = currentIndex++;
          activeCount++;
          requests[index]()
            .then((result) => {
              results[index] = result;
            })
            .catch((error) => {
              results[index] = error;
            })
            .finally(() => {
              activeCount--;
              next(); // 继续处理下一个请求
            });
        }
      }

      next();
    });
  }

  // 示例：30 个请求，限制并发数量为 5
  const requests = Array.from({ length: 30 }, (_, i) => () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(`请求 ${i + 1} 完成`), Math.random() * 1000);
    })
  );

  limitConcurrentRequests(requests, 5).then((results) => {
    console.log('所有请求完成:', results);
  });
  ```
- 使用 Semaphore（信号量）实现并发控制
  > - 使用信号量控制并发数量，确保同一时刻只有指定数量的请求在执行。
  ```js
  class Semaphore {
    constructor(limit) {
      this.limit = limit;
      this.queue = [];
      this.activeCount = 0;
    }

    async acquire(task) {
      if (this.activeCount >= this.limit) {
        await new Promise((resolve) => this.queue.push(resolve));
      }
      this.activeCount++;
      try {
        return await task();
      } finally {
        this.activeCount--;
        if (this.queue.length > 0) {
          const resolve = this.queue.shift();
          resolve();
        }
      }
    }
  }

  // 示例：30 个请求，限制并发数量为 5
  const semaphore = new Semaphore(5);
  const tasks = Array.from({ length: 30 }, (_, i) => () =>
    semaphore.acquire(() =>
      new Promise((resolve) => {
        setTimeout(() => resolve(`任务 ${i + 1} 完成`), Math.random() * 1000);
      })
    )
  );

  Promise.all(tasks.map((task) => task())).then((results) => {
    console.log('所有任务完成:', results);
  });
  ```
- 使用第三方库
  > - 使用现成的并发控制库（如 `p-limit`）简化实现。
  ```js
  const pLimit = require('p-limit');

  const limit = pLimit(5); // 限制并发数量为 5

  const tasks = Array.from({ length: 30 }, (_, i) =>
    limit(() =>
      new Promise((resolve) => {
        setTimeout(() => resolve(`任务 ${i + 1} 完成`), Math.random() * 1000);
      })
    )
  );

  Promise.all(tasks).then((results) => {
    console.log('所有任务完成:', results);
  });
  ```
> PS：在一般的 web 项目中用不到这个需求，因为浏览器会自带并发请求数量的控制。
:::

## 3、浏览器有同源策略，那 CDN 为什么不触发跨域限制
::: details 详情
浏览器允许通过 `<script>`、`<link>`、`<img>` 等具有 `src` 属性的标签加载跨域资源，这是浏览器的设计行为。如果需要通过 JavaScript 动态加载跨域资源（如通过 `fetch` 或 `XMLHttpRequest`），则需要服务器配置 **CORS**（跨域资源共享），允许特定的来源访问资源。
::: tip 注意
如果图片服务器设置了防盗链（如检查 Referer），`<img>` 标签加载资源时可能因服务器拒绝访问而失败。
:::

## 4、如何做应用灰度发布
::: details 详情
**什么是灰度发布**
- 灰度发布是一种逐步发布新版本的策略，通过将新版本的功能或代码逐步推送给一部分用户，观察其运行效果，确保新版本稳定后再全面推广。灰度发布可以有效降低发布风险，提升用户体验。

---

**灰度发布的核心目标**
- 降低风险
  > 通过小范围测试，发现潜在问题，避免大规模故障。
- 用户分层
  > 根据用户特征（如地域、设备、用户等级等）选择灰度用户。
- 快速回滚
  > 在发现问题时，能够快速切换回旧版本。

---

**实现方法**
- 基于用户分组
  > 将用户分为不同的分组（如 A/B 测试组），新版本仅对部分用户生效。
  ```js
  function isGrayUser(userId) {
     // 假设用户 ID 的哈希值对 10 取模，前 20% 的用户进入灰度组
     return hash(userId) % 10 < 2;
  }

  const userId = '12345';
  if (isGrayUser(userId)) {
    console.log('用户进入灰度发布组');
  } else {
    console.log('用户使用旧版本');
  }  
  ```
- 基于流量分配
  > 按照一定比例分配流量到新版本和旧版本。
  ```nginx
  upstream old_version {
    server old.example.com;
  }

  upstream new_version {
    server new.example.com;
  }

  server {
    listen 80;

    location / {
      # 20% 流量分配到新版本
      if ($request_uri ~* ".*") {
          set $version "old";
          if ($random < 0.2) {
              set $version "new";
          }
      }

      proxy_pass http://$version_version;
    }
  }
  ```
- 基于功能开关
  > 使用配置中心或数据库控制新功能的开启状态。
  ```js
  async function loadFeatureConfig() {
    const response = await fetch('/api/feature-config');
    const config = await response.json();

    if (config.newFeatureEnabled) {
      console.log('加载新功能');
      loadNewFeature();
    } else {
      console.log('加载旧功能');
      loadOldFeature();
    }
  }

  loadFeatureConfig();
  ```
- 基于地域或设备
  > 根据用户的地域或设备类型进行灰度发布。
  ```js
  function isGrayRegion(ip) {
    const grayRegions = ['US', 'CA', 'UK']; // 灰度发布的区域
    const userRegion = getRegionFromIP(ip);
    return grayRegions.includes(userRegion);
  }

  const userIP = '192.168.1.1';
  if (isGrayRegion(userIP)) {
    console.log('用户所在区域进入灰度发布');
  } else {
    console.log('用户所在区域使用旧版本');
  }
  ```

---

**注意事项**
- 监控和日志
  > 实时监控灰度用户的行为和系统性能，记录日志以便排查问题。
- 快速回滚
  > 在发现问题时，能够快速切换回旧版本，减少影响范围。
- 用户体验
  > 确保灰度用户的体验不会受到明显影响，避免因版本差异导致用户流失。
- 逐步扩大范围
  > 从小范围用户开始，逐步扩大灰度范围，最终覆盖所有用户。
:::

## 5、使用同一个链接，如何做到 PC 打开是 WEB 应用，H5 打开是 H5 应用
::: details 详情
- 基于 `User-Agent` 判断
  > 通过判断浏览器的 `User-Agent`，识别用户设备类型（PC 或移动设备），然后跳转到对应的页面。
  ```js
  const userAgent = navigator.userAgent;
  if (/Mobile|Android|iPhone/i.test(userAgent)) {
    window.location.href = 'https://m.example.com'; // 跳转到 H5 页面
  } else {
    window.location.href = 'https://www.example.com'; // 跳转到 Web 页面
  }
  ```
- 基于响应式设计
  > 使用 CSS 媒体查询，根据屏幕宽度调整页面布局。
  ```css
  /* 针对 PC 的样式 */
  @media screen and (min-width: 1024px) {
    body {
      background-color: lightblue;
    }
  }

  /* 针对移动设备的样式 */
  @media screen and (max-width: 1024px) {
    body {
      background-color: lightgreen;
    }
  }
  ```
- 基于域名或子域名
  > 有点偏题，还可以通过不同的域名或子域名区分 PC 和 H5 应用。
  ```
  PC 用户访问 https://www.example.com。
  移动用户访问 https://m.example.com。
  ```
:::

## 6、前端如何做大文件上传
::: details 详情
**实现思路**
- 文件分片
  > 将大文件切分成多个小文件块。
- 多线程上传
  > 利用多线程并发上传文件块，提高上传效率。
- 断点续传
  > 记录已上传的文件块，支持上传中断后继续上传。
- 后端合并文件
  > 后端接收所有文件块并合并成完整文件。

---

**前端实现**
- HTML
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>大文件上传</title>
</head>
<body>
  <h1>大文件上传示例</h1>
  <input type="file" id="fileInput" />
  <script src="upload.js"></script>
</body>
</html>
```
- JavaScript（`upload.js`）
```js
// navigator.hardwareConcurrency 属性，该属性返回用户设备的逻辑 CPU 核心数。
const MAX_WORKERS = Math.min(navigator.hardwareConcurrency || 4, 8); // 动态设置最大 Web Worker 数量，最多 8 个
const workers = []; // 存储 Web Worker 实例

// 创建 Web Worker 池
for (let i = 0; i < MAX_WORKERS; i++) {
  const worker = new Worker('worker.js');
  worker.idle = true; // 标记 Worker 是否空闲
  workers.push(worker);
}

// 分配任务给空闲的 Worker
function assignTaskToWorker(task) {
  return new Promise((resolve, reject) => {
    const availableWorker = workers.find((worker) => worker.idle);

    if (availableWorker) {
      availableWorker.idle = false;
      availableWorker.postMessage(task);

      availableWorker.onmessage = (event) => {
        availableWorker.idle = true;
        resolve(event.data);
      };

      availableWorker.onerror = (error) => {
        availableWorker.idle = true;
        reject(error);
      };
    } else {
      reject(new Error('没有空闲的 Worker 可用'));
    }
  });
}

// 获取已上传的块信息
async function getUploadedChunks(fileName) {
  const response = await fetch(`http://localhost:3000/uploaded-chunks?fileName=${fileName}`);
  if (response.ok) {
    return await response.json(); // 返回已上传的块索引数组
  }
  return [];
}

// 文件上传逻辑
async function uploadFile(file) {
  const CHUNK_SIZE = 5 * 1024 * 1024; // 每块大小 5MB
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const chunks = [];

  // 分片任务
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(file.size, start + CHUNK_SIZE);
    chunks.push({ chunk: file.slice(start, end), index: i });
  }

  console.log('文件分片完成，开始上传');

  // 获取已上传的块
  const uploadedChunks = await getUploadedChunks(file.name);
  console.log('已上传的块:', uploadedChunks);

  // 上传文件块
  const uploadChunk = async (chunk, index) => {
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('index', index);
    formData.append('fileName', file.name);

    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`块 ${index} 上传失败`);
    }
    console.log(`块 ${index} 上传成功`);
  };

  // 使用 Worker 池处理分片并上传未完成的块
  const promises = chunks
    .filter(({ index }) => !uploadedChunks.includes(index)) // 过滤已上传的块
    .map(({ chunk, index }) =>
      assignTaskToWorker({ chunk, index, fileName: file.name }).then((data) =>
        uploadChunk(data.chunk, data.index)
      )
    );

  await Promise.all(promises);

  console.log('所有文件块上传完成');

  // 通知后端合并文件
  const mergeResponse = await fetch('http://localhost:3000/merge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: file.name, totalChunks }),
  });

  if (mergeResponse.ok) {
    console.log('文件合并成功');
  } else {
    console.error('文件合并失败');
  }
}

// 选择文件并上传
document.getElementById('fileInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadFile(file);
  }
});
```
- Web Worker（`worker.js`）
```js
self.onmessage = (event) => {
  const { chunk, index, fileName } = event.data;

  // 模拟处理任务（这里可以加入更多复杂的逻辑）
  console.log(`Worker 正在处理块 ${index}`);

  // 将处理结果发送回主线程
  self.postMessage({ chunk, index, fileName });
};
```

---

**后端实现（Node.js）**
- 安装依赖
```bash
npm install express multer
```
- 完整后端代码
```js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' }); // 临时存储文件块
const uploadedChunks = {}; // 模拟存储已上传的块信息

// 获取已上传的块
app.get('/uploaded-chunks', (req, res) => {
  const { fileName } = req.query;
  res.json(uploadedChunks[fileName] || []);
});

// 接收文件块
app.post('/upload', upload.single('chunk'), (req, res) => {
  const { index, fileName } = req.body; // 获取块索引和文件名
  const chunkPath = path.join(__dirname, 'uploads', `${fileName}-${index}`);

  // 模拟记录已上传的块
  if (!uploadedChunks[fileName]) {
    uploadedChunks[fileName] = [];
  }
  uploadedChunks[fileName].push(Number(index));

  fs.renameSync(req.file.path, chunkPath); // 重命名文件块
  console.log(`接收到文件块 ${index}`);
  res.sendStatus(200);
});

// 合并文件
app.post('/merge', express.json(), (req, res) => {
  const { fileName, totalChunks } = req.body;
  const filePath = path.join(__dirname, 'uploads', fileName);
  const writeStream = fs.createWriteStream(filePath);

  // 按顺序读取文件块并写入最终文件
  const mergeChunks = async () => {
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(__dirname, 'uploads', `${fileName}-${i}`);
      await new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(chunkPath);
        readStream.pipe(writeStream, { end: false });
        readStream.on('end', () => {
          fs.unlinkSync(chunkPath); // 删除文件块
          resolve();
        });
        readStream.on('error', reject);
      });
    }
    writeStream.end();
  };

  mergeChunks()
    .then(() => {
      console.log('文件合并完成');
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('文件合并失败:', error);
      res.sendStatus(500);
    });
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`服务器已启动，监听端口 ${PORT}`);
});
```

:::

## 7、常见的图片懒加载方式有哪些
::: details 详情
- 使用原生 `loading="lazy"` 属性
  > HTML5 提供了原生的图片懒加载支持，只需在 `<img>` 标签中添加 `loading="lazy"` 属性即可。
  > - 优点：简单易用，无需额外的 js，浏览器原生支持，性能较好。
  > - 缺点：兼容性有限，仅支持现代浏览器。
  ```html
  <img src="example.jpg" alt="示例图片" loading="lazy" />
  ```
- 使用 Intersection Observer API
  > 通过 `IntersectionObserver` 检测图片是否进入视口，动态加载图片。
  > - 优点：性能好，支持批量观察，现代浏览器支持较好。
  > - 缺点：需要手动处理图片的加载时机。
  ```html
  <img data-src="example.jpg" alt="示例图片" />
  ```
  ```js
  const lazyImages = document.querySelectorAll('img[data-src]');

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src; // 替换真实图片地址
        img.removeAttribute('data-src');
        observer.unobserve(img); // 停止观察
      }
    });
  });

  lazyImages.forEach((img) => observer.observe(img));
  ```
- 滚动事件监听
  > 通过监听 `scroll` 事件，判断图片是否进入视口，动态加载图片。
  > - 优点：兼容性好，支持所有浏览器
  > - 缺点：性能较差，滚动事件频繁触发需要优化（如节流或防抖）。
  ```js
  const lazyImages = document.querySelectorAll('img[data-src]');

  const lazyLoad = () => {
    lazyImages.forEach((img) => {
      const rect = img.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        img.src = img.dataset.src; // 替换真实图片地址
        img.removeAttribute('data-src');
      }
    });
  };

  window.addEventListener('scroll', lazyLoad);
  lazyLoad(); // 初始化加载
  ```
- 使用第三方库
  > 使用现成的懒加载库（如 `lazysizes`）。
  > - 优点：功能强大，支持多种场景，兼容性好，社区维护活跃。。
  > - 缺点：需要引入额外的库，增加项目体积。
  ```html
  <img data-src="example.jpg" class="lazyload" alt="示例图片" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js"></script>
  ```
:::

## 8、常见的图片预加载方式有哪些
::: details 详情
- 使用 js 创建 `Image` 对象
  > 通过 js 动态创建 `Image` 对象，将图片加载到浏览器缓存中。
  > - 优点：简单易用，兼容性好。
  > - 缺点：需要手动管理图片加载逻辑。
  ```js
  const img = new Image();
  img.src = 'example.jpg'; // 设置图片地址
  img.onload = () => {
    console.log('图片预加载完成');
  };
  ```
- 使用 CSS 背景图
  > 将图片设置为 CSS 的 `background-image` 属性，提前加载图片。
  > - 优点：简单易用，适合背景图片的预加载。
  > - 缺点：仅适用于背景图片，无法直接用于 `<img>` 标签。
  ```css
  .preload {
    background-image: url('example.jpg');
    display: none; /* 隐藏元素 */
  }
  ```
- 使用 `<link>` 标签的 `rel="preload"`
  > 使用 `<link>` 标签的 `rel="preload"` 属性，告诉浏览器提前加载图片资源。
  > - 优点：浏览器原生支持，性能较好。
  > - 缺点：兼容性有限，仅支持现代浏览器。
  ```html
  <link rel="preload" href="example.jpg" as="image" />
  ```
- 使用第三方库
  > 使用现成的懒加载库（如 `preload-js`）。
  > - 优点：功能强大，支持多种场景，兼容性好，社区维护活跃。。
  > - 缺点：需要引入额外的库，增加项目体积。
  ```js
  const queue = new createjs.LoadQueue(false);
  queue.on("fileload", handleFileComplete);
  queue.loadFile('http://createjs.com/assets/images/png/createjs-badge-dark.png');
  function handleFileComplete(event) {
    document.body.appendChild(event.result);
  }
  ```
:::

## 9、常见的图片压缩方式有哪些
::: details 详情
- Canvas 压缩
  > 使用 HTML5 的 `<canvas>` 元素将图片绘制到画布上，然后通过 `toDataURL` 方法导出压缩后的图片。
  ```js
  function compressImage(file, quality = 0.8) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);
          canvas.toBlob((blob) => resolve(blob), file.type || 'image/jpeg', quality);
        };
      };
      reader.readAsDataURL(file);
    });
  }
  ```
- 前端压缩库
  > 使用第三方库（如 `compress.js` 或 `browser-image-compression`）进行图片压缩。
  ```js
  import imageCompression from 'browser-image-compression';

  async function compressImage(file) {
    const options = {
      maxSizeMB: 1, // 最大文件大小
      maxWidthOrHeight: 1920, // 最大宽高
      useWebWorker: true, // 使用 Web Worker
    };
    return await imageCompression(file, options);
  }
  ```
- 使用在线工具
  > 使用（如 [tinypng](https://tinypng.com/) 、[compressor.io](https://compressor.io/) ）等在线工具进行图片压缩。
:::

## 10、扫码登录的实现方式
::: details 详情
大致流程：

1️⃣ 生成二维码
  - 服务端生成一个唯一标识（如 `UUID` 或 `Token`），并将其编码为二维码。
  - 前端展示二维码。

2️⃣ 客户端扫描二维码
  - 用户使用手机端（如 App）扫描二维码，提取登录标识（`Token`）。

3️⃣ 服务端验证
  - 手机端将 `Token` 发送到服务端，服务端验证并更新登录状态。

4️⃣ 轮询或 WebSocket 通知
  - 浏览器端通过轮询或 WebSocket 查询登录状态。
  - 服务端确认登录后，通知浏览器端登录成功。

5️⃣ 完成登录
  - 浏览器端接收到登录成功的通知后，跳转到登录后的页面。
:::

## 11、SEO 优化方式，从技术方面来说
::: details 详情
- 网站结构优化
  > 优化网站结构，如使用正确的 HTML 标签、语义化标签，优化页面的 `meta` 信息，提升搜索引擎排名，提高可读性。
- 网站速度优化
  > 优化网站速度，如使用缓存、压缩静态资源、使用 CDN 等，提高用户体验。
- 页面渲染优化
  > 优化页面渲染，如使用服务器端渲染、预渲染、懒加载等，提高用户体验。
- URL 优化
  > 优化 URL，使用短、描述性的 URL，并使用关键词来优化 URL 结构。
- 链接优化
  > 内部链接和外部链接都对 SEO 有影响，在网站内部设置相关性强的链接，使页面之间相互连接，外部链接是获取更多外部网站链接指向自己网站的重要手段，可以通过内容创作和社交媒体之类的推广来获得更多高质量的外部链接。
- Schema 标记
  > 使用 `Schema` 标记网页内容，如使用 `JSON-LD` 、 `Microdata` 或 `RDFa` 等标记格式，提高搜索引擎对网页的解析能力。
- XML 网站地图
  > 使用 `XML` 网站地图，提供页面结构和页面信息，让搜索引擎更好地索引网站内容。
- Robots.txt 文件
  > 使用 `Robots.txt` 文件，控制搜索引擎爬虫的访问权限。
- HTTPS 加密
  > 使用 HTTPS 加密，可以提高网站安全性和用户体验，可以防止被攻击，同时搜索引擎更倾向于收录和排名视频 HTTPS 的网站。
- 移动友好性
  > 优化移动设备上的用户体验，如使用响应式设计、使用移动优先的 CSS、使用移动端优化的图片等，提高用户体验。
:::

## 12、生产环境如何定位报错
::: details 详情
生产环境的代码通常经过压缩和混淆，导致错误堆栈难以追踪到源代码。
- 启用 Source Map，还原压缩后的代码。
  > - Source Map 是一种映射文件，它记录了压缩混淆后的代码与原始源代码之间的映射关系。通过 Source Map，可以将生产环境中的错误堆栈信息还原到原始代码位置。
- 集成错误监控工具，实时捕获和上报错误。
  > - 错误监控工具可以自动捕获 JavaScript 错误、网络请求错误等，并将错误信息上报到后台，方便开发者及时发现和定位问题。
- 记录日志，确保错误信息可追踪。
  > - 在关键代码位置添加日志记录，记录程序的执行状态、输入输出等信息，有助于在出现错误时快速定位问题。
- 模拟生产环境，复现问题并定位根因。
:::

## 13、一次性渲染十万条数据，该怎么优化
::: details 详情
- 虚拟列表
  > - 只渲染可视区域内的元素，其他元素在滚动时动态加载。
  > - 使用现成的库（如 `react-window`、`react-virtualized`、`vue-virtual-scroller`）或自行实现。
  ```jsx
  // react-window 举例
  import { FixedSizeList as List } from 'react-window';
 
  const Row = ({ index, style }) => (
    <div style={style}>Row {index}</div>
  );
  
  const Example = () => (
    <List
      height={150}
      itemCount={1000}
      itemSize={35}
      width={300}
    >
      {Row}
    </List>
  );
  ```
- `requestAnimationFrame` + `fragment`（时间分片）
  > - 使用 `requestAnimationFrame` 将渲染任务分片，避免一次性渲染大量数据导致页面卡顿。
  > - 使用 `fragment` 将数据分组，减少 DOM 操作次数，提高性能。
  ```js
  function renderLargeData(data) {
    const container = document.getElementById('container');
    const total = data.length;
    const chunkSize = 100; // 每次渲染的条数
    let index = 0;

    function renderChunk() {
      const fragment = document.createDocumentFragment(); // 使用 documentFragment 减少 DOM 操作
      for (let i = 0; i < chunkSize && index < total; i++, index++) {
        const div = document.createElement('div');
        div.textContent = `Item ${data[index]}`;
        fragment.appendChild(div);
      }
      container.appendChild(fragment);

      if (index < total) {
        requestAnimationFrame(renderChunk); // 下一帧继续渲染
      }
    }

    renderChunk();
  }

  // 示例数据
  const largeData = Array.from({ length: 100000 }, (_, i) => i + 1);
  renderLargeData(largeData);
  ```
- `setTimeout` 分片
  > - 简单易用，兼容性好。
  > - 相比 `requestAnimationFrame` + `fragment`（时间分片）的方式性能稍差。
  ```js
  const total = 100000
  let ul = document.getElementById('container')
  let once = 20
  let page = total / once

  function loop(curTotal) {
      if (curTotal <= 0) return 

       let pageCount = Math.min(curTotal, once) // 最后一次渲染一定少于20条，因此取最小

      setTimeout(() => {
          for (let i = 0; i < pageCount; i++) {
             let li = document.createElement('li')
             li.innerHTML = ~~(Math.random() * total)
             ul.appendChild(li)
          }
        loop(curTotal - pageCount)
    }, 0)
    }

  loop(total)
  ```

**总结**
推荐使用 **虚拟列表** 或 `requestAnimationFrame` + `fragment`（时间分片）的方式进行加载。

:::

## 14、应用上线以后，怎么通知用户刷新页面
::: details 详情
**思路**
- 在构建时为静态资源生成唯一的版本哈希值（如 Webpack 的 `[hash]`）。
- 前端定期向服务器请求最新的哈希值，与当前页面的哈希值进行对比，发现更新时通知用户刷新页面。

---

**实现方式**
- 轮询实现
  ```js
  let currentHash = 'abc123'; // 当前页面的版本哈希

  async function checkForUpdates() {
    try {
      const response = await fetch('/api/version');
      const { hash } = await response.json();

      if (hash !== currentHash) {
        alert('有新版本发布，请刷新页面！');
        location.reload(); // 刷新页面
      }
    } catch (error) {
      console.error('检查更新失败:', error);
    }
  }

  // 每隔 2 分钟检查一次
  setInterval(checkForUpdates, 60 * 1000 * 2);
  ```
- WebSocket 实现
  ```js
  const socket = new WebSocket('wss://example.com');

  socket.onmessage = (event) => {
    const { hash } = JSON.parse(event.data);
    if (hash !== currentHash) {
      alert('有新版本发布，请刷新页面！');
      location.reload();
    }
  };
  ```
- SSE 实现
  ```js
  const eventSource = new EventSource('/api/updates');

  eventSource.onmessage = (event) => {
    const { hash } = JSON.parse(event.data);
    if (hash !== currentHash) {
      alert('有新版本发布，请刷新页面！');
      location.reload();
    }
  };
  ```

---

**总结**
- 轮询：实现简单，但会增加服务器压力，适合对实时性要求不高的场景。
- WebSocket：双向通信，实时性强，适合需要频繁交互的场景。
- SSE：单向通信，轻量级，适合只需要服务器推送更新的场景。
:::

## 15、前端项目常用的性能优化手段
::: details 详情
**构建工具优化（CLI 优化）**
- 代码分割
  > - 使用工具（如 Webpack、Vite）进行代码分割，按需加载模块。
- Tree Shaking
  > - 移除未使用的代码，减少打包体积。
- 压缩资源
  > - 压缩 HTML、CSS、JavaScript 文件（如使用 Terser、CSSNano）。
  > - 使用 Gzip 或 Brotli 压缩传输内容。
- 减少第三方库依赖
  > - 使用轻量级库或原生 API 替代大型库（如：`day.js` 替代 `moment.js` ）。

---

**网络请求优化**
- 减少 HTTP 请求
  > - 合并 CSS 和 JS 文件，使用雪碧图（Sprite）优化图片。
- 使用 CDN
  > - 将静态资源托管到 CDN，减少服务器压力并加速加载。
- 缓存策略
  > - 设置合理的缓存策略（如强缓存和协商缓存）。
- HTTP/2
  > - 启用 HTTP/2，支持多路复用，提升资源加载速度。

---

**首屏加载优化**
- SSR（服务器端渲染）
  > - 使用 Next.js、Nuxt.js 等框架实现服务器端渲染，提升首屏加载速度。
- 骨架屏
  > - 在页面加载时显示骨架屏，提升用户体验。
- Critical CSS
  > - 提取关键 CSS，内联到 HTML 中，减少渲染阻塞。

---

**渲染性能优化**
- 减少重排和重绘
  > - 避免频繁修改 DOM，使用 `documentFragment` 或批量更新。
  > - 使用 CSS 动画代替 JavaScript 动画。
- 虚拟 DOM 和 Diff 算法
  > - 使用框架（如 React、Vue）的虚拟 DOM 提升渲染性能。
- 图片优化
  > - 使用合适的图片格式（如 WebP）。
  > - 使用图片懒加载。

---

**代码层次**
- 路由懒加载
  > - 使用动态导入实现路由懒加载，减少初始加载体积。
- 组件懒加载
  > - 使用动态导入实现组件懒加载，减少初始加载体积。
- 复用组件
  > - 通过复用组件减少 DOM 节点的创建和销毁，提升性能。
:::

## 16、前端项目如何封装通用组件
::: details 详情
- 单一职责
  > - 每个组件只解决一个特定问题（如DatePicker只处理日期选择）。
  > - 避免将业务逻辑与UI组件耦合。
- 可复用性
  > - 设计组件时考虑可复用性，使其能够适应不同的场景。
  > - 使用 props 和插槽实现组件的可配置性。
- 可维护性
  > - 保持组件的简单和清晰，易于理解和维护。
  > - 使用 TypeScript 或 Flow 进行类型检查。
- 可测试性
  > - 编写单元测试和集成测试，确保组件的正确性。
  > - 使用测试驱动开发（TDD）或行为驱动开发（BDD）。
:::

## 17、前端如何实现精准的倒计时（排除误差、时间偏差）
::: details 详情
**误差来源**
- JS事件循环延迟 - `setTimeout/setInterval` 最小间隔4ms且受主线程阻塞影响。
- 浏览器后台节流 - 标签页隐藏时定时器被降频（如Chrome限制为1秒/次）。  
- 系统时间篡改 - 用户手动修改设备时间导致计算错误。 
- 网络传输延迟 - 服务端时间同步时的网络抖动。

---

**解决方案**
- 使用`performance.now()`替代 `Date`
  > 浏览器高精度时间API（精度可达0.1ms）。`Date.now()`误差约 ±500ms ，`performance.now()`误差 ±50ms。
```js
// 计算结束时间的时间戳（当前时间 + 60秒）
const endTimestamp = Date.now(); + 60 * 1000;
function usePreciseCountdown(endTimestamp) {
    const start = performance.now();
    const duration = endTimestamp - Date.now();
    let remaining = duration;
    let timer = null;

    function update() {
        const elapsed = performance.now() - start;
        remaining = duration - elapsed;

        if (remaining <= 0) {
            // 倒计时结束，清除定时器并返回0
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            return 0;
        }

        // 计算下一次更新的延迟，尽量保持固定间隔
        const delay = Math.min(remaining % 1000, 100); 
        timer = setTimeout(update, delay);

        // 这里可以添加更新UI显示剩余时间的逻辑，而不是直接返回剩余秒数
        // 例如：document.getElementById('countdown').textContent = Math.round(remaining / 1000);
        return Math.round(remaining / 1000);
    }

    update();

    // 如果需要在外部获取倒计时剩余时间，可以返回一个对象包含相关方法和属性
    return {
        getRemainingTime: () => remaining,
        cancel: () => {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
        }
    };
}
usePreciseCountdown(endTimestamp).getRemainingTime()
```
- `Web Worker` 后台计时
  > 避免主线程阻塞。
```js
// 在Web Worker脚本中（假设为worker.js）
let timer = null;
self.onmessage = ({ data: endTime }) => {
    if (timer) {
        clearInterval(timer);
    }
    const interval = 100; // 100ms精度
    timer = setInterval(() => {
        const remaining = endTime - performance.now();
        if (remaining <= 0) {
            clearInterval(timer);
            self.postMessage(0);
        } else {
            self.postMessage(remaining > 0? remaining : 0);
        }
    }, interval);
};

// 在主线程中使用Web Worker
const worker = new Worker('worker.js');
worker.onmessage = (event) => {
    const remaining = event.data;
    // 这里可以根据剩余时间更新UI，例如：document.getElementById('countdown').textContent = Math.round(remaining / 1000);
};
const endTime = Date.now() + 60000; // 假设倒计时60秒，这里只是示例，实际应从服务端获取准确的结束时间
worker.postMessage(endTime);
```
- 服务端时间同步
  > 初始化时校准时间。
```js
async function syncServerTime() {
    try {
        const response = await fetch('/api/timestamp');
        const { serverTime } = await response.json();
        const clientTime = Date.now();
        const offset = serverTime - clientTime;
        return offset;
    } catch (error) {
        console.error('时间同步失败:', error);
        return 0;
    }
}

// 在倒计时函数中使用服务端时间偏移量
async function startPreciseCountdown(endTimestamp) {
    const offset = await syncServerTime();
    const adjustedEndTimestamp = endTimestamp + offset;

    const start = performance.now();
    const duration = adjustedEndTimestamp - Date.now();
    let remaining = duration;
    let timer = null;

    function update() {
        const elapsed = performance.now() - start;
        remaining = duration - elapsed;

        if (remaining <= 0) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            return 0;
        }

        const delay = Math.min(remaining % 1000, 100);
        timer = setTimeout(update, delay);

        // 更新UI逻辑
        // document.getElementById('countdown').textContent = Math.round(remaining / 1000);
        return Math.round(remaining / 1000);
    }

    update();

    return {
        getRemainingTime: () => remaining,
        cancel: () => {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
        }
    };
}
```
- 使用 `requestAnimationFrame` 进行更平滑的更新​
```js
function usePreciseCountdown(endTimestamp) {
    let remaining = endTimestamp - Date.now();
    let timer = null;

    function update() {
        const now = Date.now();
        remaining = endTimestamp - now;

        if (remaining <= 0) {
            // 倒计时结束，取消动画帧并可以执行其他结束逻辑
            cancelAnimationFrame(timer);
            timer = null;
            // 这里可以添加倒计时结束后的操作，例如显示提示信息等
            return;
        }

        // 更新UI显示剩余时间，这里只是示例
        // document.getElementById('countdown').textContent = Math.round(remaining / 1000);

        timer = requestAnimationFrame(update);
    }

    update();

    return {
        getRemainingTime: () => remaining,
        cancel: () => {
            if (timer) {
                cancelAnimationFrame(timer);
                timer = null;
            }
        }
    };
}
```
:::

## 18、简述部署项目目到服务器上的流程
::: details 详情
1.将代码上传到 `git` 托管上。

2.购买云服务器（CentOS示例）等等一系列准备工作，进入云服务器。
  - 举例：使用 MacOS 系统主机登录 Linux 云服务器。
    > - 打开终端，输入 `ssh root@你的服务器IP地址`，回车。
    > - 输入密码，回车。
    > - 登录成功。

3.使用自带的 `yum` 工具安装 `node`、`npm`、`git`、`nginx` 等。
  > - `yum` 是用于基于 RPM 的 Linux 发行版（如 CentOS、RHEL、Fedora）的包管理器。
  > - `yum` 命令跟 `npm`类似， [点击查看 Linux yum 命令](https://www.runoob.com/linux/linux-yum.html)。

4.创建目录。
  - 举例
    > - 在文件夹 `home` 下面创建 `web` 文件夹。（ `ls` 查看当前目录下的文件， `cd home` 进入 `home` 文件夹，`mkdir web` 创建 `web` 文件夹 ）。

5.将项目从 `git` 仓库拉下来。
  > **`推荐`** 如项目打包占用资源过高，服务器内存较小，可能无法进行打包，建议使用 `SFTP` 直接将打包后的文件上传到 Linux 云服务器上。[点击查看 SFTP 上传文件](https://support.huaweicloud.com/ecs_faq/zh-cn_topic_0170139796.html)。
    > - 打开终端，输入 `sftp root@你的服务器IP地址`，回车。
    > - 输入密码，回车。
    > - 登录成功。
    > - 上传文件，输入 `put -r 要传的文件位置 准备放到服务器文件位置`，回车。
    > - 上传完成。

6.安装项目依赖。

7.打包项目，使用 `pwd` 获取 `dist` 文件位置。

8.配置 `nginx`，将 `dist` 文件夹配置到 `nginx` 的 `root` 下。

9.启动 `nginx`，配置完成。

::: tip Linux 常用命令
|命令|描述|
|---|--------|
|`ls`|列出目录内容|
|`cd`|更改当前目录|
|`pwd`|显示当前工作目录|
|`echo`|输出文本|
|`ssh`|远程登录|
|`cp`|复制文件或目录|
|`mv`|移动或重命名文件或目录|
|`rm`|删除文件或目录|
|`mkdir`|创建新目录|
|`rmdir`|删除空目录|
|`touch`|创建空文件或更新文件时间戳|
|`cat`|查看文件内容|
|`more` / `less`|分页查看文件内容|
|`head` / `tail`|查看文件的开头或结尾部分|
|`grep`|在文件中搜索文本|
|`find`|查找文件和目录|
|`chmod`|更改文件权限|
|`chown`|更改文件所有者|
|`df`|显示磁盘空间使用情况|
|`du`|显示目录或文件的磁盘使用情况|
|`ps`|显示当前进程状态|
|`kill`|终止进程|
|`top` / `htop`|实时显示系统进程状况|
|`man`|显示命令的手册页|
|`tar`|打包和解压文件|
|`wget` / `curl`|下载文件|
|`scp`|安全复制文件|
:::

## 19、简述前端项目的CI/CD
- 持续集成（CI）：
  > - 代码提交后自动触发构建和测试。
  > - 确保代码质量和功能稳定性。
- 持续交付（CD）：
  > - 自动将代码部署到测试环境。
  > - 手动或自动触发将代码部署到生产环境。
::: details 详情
- 方案：
  > - 使用 `gitee 流水线`，`gitlab actions`，`github ci` 等代码托管平台的 CI/CD 功能。
  > - 使用 `jenkins` 搭建自己的 CI/CD 平台。
- 代码托管平台流程：
  > - 代码提交到代码托管平台后，触发 CI/CD 流程，配置 `Node.js` 或者其他进行构建，比如先进行本地构建打包，然后通过 `ssh` 进入云服务器，通过 `sftp` 或者 `scp` 之类的把构建产物上传到云服务器指定位置，然后执行代码更新或重启 `nginx` 之类的操作。
:::

## 20、简述从0到1搭建项目的思路
::: details 详情
在需求评估后，需分阶段完成技术规划：
- ​技术选型​​：根据团队能力和项目复杂度选定框架（如 Vue/React）及状态管理方案（Pinia/Redux），根据实际情况考虑是否需要使用ts。
- ​​架构设计​​：判断项目是否需要微前端或 Monorepo，否则按功能模块划分目录结构（如api、utils、components、pages等）。
- ​​模块化开发​​：采用 modules 的目录设计，隔离业务逻辑与通用代码。
​- ​国际化与依赖管理​​：评估多语言需求后集成 i18n 方案，并按需引入第三方依赖库。
- 代码规范与文档：制定统一的代码规范，完善开发文档，便于团队协作。
- 自动化测试与 CI/CD：集成自动化测试和持续集成/持续交付流程，提升交付质量和效率。
- ​打包优化​​：配置代码分割、资源压缩等。
- 时间节点：根据时间节点进行任务划分，并根据时间节点进行任务跟进，如期限内无法完成，该加班加班，该协调协调，否则进行上报。
:::