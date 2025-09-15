---
lang: zh-CN
title: http
description: http面试题
---

# http

## 1、TCP 是如何建立连接的，三次握手，四次挥手
::: details 详情
**三次握手**
- 客户端向服务端发送建立连接请求，客户端进入 `SYN-SEND` 状态。
- 服务端收到建立连接请求后，向客户端发送一个应答，服务端进入 `SYN-RECEIVED` 状态。
- 客户端接收到应答后，向服务端发送确认接收到应答，客户端进入 `ESTABLISHED` 状态。

---

**四次挥手**
- 客户端向服务端发送断开连接请求。
- 服务端收到断开连接请求后，告诉应用层去释放 `TCP` 连接。
- 服务端向客户端发送最后一个数据包 `FINBIT` ，服务端进入 `LAST-ACK` 状态。
- 客户端收到服务端的断开连接请求后，向服务端确认应答。

---

**为什么需要三次握手**
- 防止重复连接：三次握手可以确保客户端和服务器双方都确认了彼此的接收和发送能力，避免因旧的连接请求导致的错误连接。

---

**为什么需要四次挥手**
- 全双工通信的特性：`TCP` 是全双工通信，双方都需要单独关闭发送和接收通道，因此需要四次挥手来确保双方都完全断开连接。

---

**TIME_WAIT 状态的作用**
- 防止旧数据包干扰新连接：客户端在 `TIME_WAIT` 状态下会等待一段时间（通常是 2 倍的最大报文段寿命，约 2 分钟），确保网络中所有旧的报文都消失后再关闭连接。

---

**总结**
- 三次握手：用于建立可靠的连接，确保双方都能正常通信。
- 四次挥手：用于断开连接，确保双方都能正常断开连接。
- TIME_WAIT：用于防止旧数据包干扰新连接，确保连接的可靠性。
:::

## 2、HTTP 几个版本的区别
::: details 详情
**HTTP/0.9 - 单行协议**
- 只有 GET 请求行，无请求头和请求体。
- 只能传输 HTML 文件，以 ASCII 字符流返回。
- 无响应头。

---

**HTTP/1.0 - 多类型支持**
- 支持多种文件类型传输，不限于 ASCII 编码。
- 引入请求头和响应头( key-value 形式)。
- 每个请求都需要建立新的 TCP 连接。

---

**HTTP/1.1 - 持久连接**
- 引入持久连接( keep-alive )：一个 TCP 连接可传输多个 HTTP 请求。
- 默认开启 keep-alive，通常限制 6-8 个并发连接。
- 存在队头阻塞问题：前面的请求阻塞会影响后续请求。
- 引入 Host 字段，支持虚拟主机。
- 引入 Chunk transfer 机制处理动态内容长度。

---

**HTTP/2.0 - 多路复用**
- 一个域名只使用一个 TCP 长连接。
- 引入二进制分帧层，实现多路复用。
- 可对请求设置优先级。
- 引入 HTTPS(HTTP + TLS) 加密。

---

**HTTP/3.0 - QUIC 协议**
- 基于 UDP 协议而非 TCP。
- 实现了类似 TCP 的流量控制和可靠传输。
- 集成 TLS 加密。
- 实现多路复用。
- 解决 TCP 队头阻塞问题。
:::

## 3、HTTP 常见的状态码
::: details 详情
- 1xx 信息响应：
  - 100 Continue：客户端应继续其请求。
  - 101 Switching Protocols：服务器同意切换协议。
- 2xx 成功响应：
  - 200 OK：请求成功，服务器返回请求的数据。
  - 204 No Content：响应成功，但没有返回内容。
  - 206 Partial Content：服务器成功处理了部分 GET 请求。
- 3xx 重定向：
  - 301 Moved Permanently：资源已永久移动到新位置。
  - 302 Found：资源临时移动到新位置。
  - 304 Not Modified：资源未修改，使用缓存。
- 4xx 客户端错误：
  - 400 Bad Request：请求语法错误，服务器无法理解。
  - 401 Unauthorized：未授权，需提供认证信息。
  - 403 Forbidden：服务器拒绝请求。
  - 404 Not Found：请求的资源不存在。
- 5xx 服务器错误：
  - 500 Internal Server Error：服务器内部错误。
  - 501 Not Implemented：服务器不支持请求的功能。
  - 503 Service Unavailable：服务器超载或维护中。
:::

## 4、HTTP 常见 Header
::: details 详情
**请求头**

- accept: text/html 告诉服务端我期望接收到一个html的文件。
- accept-encoding: gzip, deflate, br 告诉服务端以这种方式压缩。
- accept-language: zh-CN 告诉服务端以中文的格式返回。
- authorization: 告诉服务端授权信息。
- cookie: 告诉服务端客户端存储的 cookie。
- origin: 告诉服务端请求的来源。
- content-type: 指定请求体的媒体类型。
- referer: 表示当前请求的来源页面 URL。

---

**响应头**

- content-encoding: br 告诉浏览器压缩方式是br。
- content-type: text/html; charset=utf-8 告诉浏览器以这种方式，编码加载。
- cache-control: 告诉浏览器缓存策略。
- expires: 告诉浏览器缓存过期时间。
- set-cookie: 告诉浏览器设置 cookie。
- access-control-allow-origin: * 告诉浏览器允许跨域。
:::

## 5、HTTP 常见的 Content-Type
`Content-Type` 是 HTTP 中非常重要的头字段，决定了请求和响应的内容格式。
::: details 详情
**文本类型**
- `text/plain`
  > 纯文本格式。
- `text/html`
  > HTML 格式。
- `text/css`
  > CSS 样式表。
- `text/javascript`
  > JavaScript 脚本。

---

**应用类型**
- `application/json`
  > JSON 格式。
- `application/xml`
  > XML 格式。
- `application/x-www-form-urlencoded`
  > 表单数据格式（键值对）。
- `application/octet-stream`
  > 二进制流数据（默认值）。

---

**图片理想**
- `image/gif`
  > GIF 图片格式。
- `image/jpeg`
  > JPEG 图片格式。
- `image/png`
  > PNG 图片格式。
- `image/svg+xml`
  > SVG 矢量图。

---

**音视频类型**
- `audio/mpeg`：
  > MP3 音频。
- `audio/ogg`：
  > OGG 音频。
- `video/mp4`：
  > MP4 视频。
- `video/webm`：
  > WebM 视频。

---

**多部分类型**
- `multipart/form-data`：
  > 表单数据，支持文件上传。
- `multipart/byteranges`：
  > 响应中包含多个范围的数据。
:::

## 6、URL 包含哪些部分
::: details 详情
URL (Uniform Resource Locator) 包含以下部分：
- 协议 (protocol)：如 `http://`、`https://`、`ftp://` 等。
- 域名 (domain)：如 `www.example.com`。
  - 子域名 (subdomain)：如 `www`、`blog`、`api` 等。
  - 主域名 (main domain)：如 `example`。
  - 顶级域名 (top-level domain)：如 `com`、`org`、`net` 等。
- 端口号 (port number)：如 `:80`、`:443`（可选，HTTP 默认 80，HTTPS 默认 443）。
- 路径 (path)：如 `/index.html`、`/about/` 等。
- 查询字符串 (query string)：如 `?name=John&age=30`。
- 哈希值 (hash)：如 `#section1`。
:::

## 7、如何解决跨域
跨域问题是由于 **浏览器的同源策略**（Same-Origin Policy）限制，**域名**、**端口**、**协议** 三者任意一个不同，就会产生跨域。
::: details 详情
- CORS（跨域资源共享）
  > 服务器通过设置特定的 HTTP 响应头，允许浏览器访问跨域资源。
  - 常见响应头
    - `Access-Control-Allow-Origin`：指定允许访问的域名（如 `*` 表示允许所有域名）。
    - `Access-Control-Allow-Methods`：指定允许的 HTTP 方法（如 `GET, POST`）。
    - `Access-Control-Allow-Headers`：指定允许的请求头。
    - `Access-Control-Allow-Credentials`：是否允许携带 Cookie。
- JSONP 
  > 利用 `<script>` 标签不受同源策略限制的特点，通过动态创建 `<script>` 标签实现跨域。
  - 限制
    - 只能用于 GET 请求。
- 代理服务器
  > 前端将请求发送到同源的代理服务器，由代理服务器转发请求到目标服务器，从而绕过浏览器进行请求（如开发环境下设置 `proxy`）。
- Nginx 反向代理
  > 使用 Nginx 配置反向代理，将跨域请求转发到目标服务器。
- WebSocket
  > WebSocket 不受同源策略限制，可以实现跨域通信。
- iframe + postMessage
  > 使用 `iframe` 加载跨域页面，通过 `postMessage` 实现跨域通信。

**总结**
- CORS 是最常用且标准的跨域解决方案。
- 开发环境优先使用代理服务器。
- Nginx 反向代理 适合复杂场景。
:::

## 8、简述浏览器的缓存策略
浏览器缓存策略主要分为两种：**强缓存** 和 **协商缓存**。浏览器缓存策略通过强缓存和协商缓存提高了资源加载效率，减少了服务器压力。合理配置缓存策略可以显著提升用户体验和系统性能。
::: details 详情
**强缓存**
- 定义
  - 在缓存未过期的情况下，浏览器直接从本地缓存中读取资源，不会向服务器发送请求。
- 实现方式
  - 通过 HTTP 响应头中的 `Expires` 或 `Cache-Control` 实现。
- 相关字段
  - `Expires`：指定资源过期时间（绝对时间）。
  - `Cache-Control`：使用相对时间控制缓存，优先级高于 `Expires`。
- 特点
  - 不会向服务器发送请求。
  - 适合静态资源（如图片、CSS、JS 文件）。

---

**协商缓存**
- 定义
  - 浏览器向服务器发送请求，服务器根据资源是否更新决定是否使用缓存。
- 实现方式
  - 通过 HTTP 请求头和响应头中的 `Last-Modified` / `If-Modified-Since` 或 `ETag` / `If-None-Match` 实现。
- 相关字段
  - `Last-Modified` 和 `If-Modified-Since`
    - `Last-Modified`：资源的最后修改时间。
    - `If-Modified-Since`：浏览器发送的请求头，携带上次的 `Last-Modified` 值。
    > 缺点：只能精确到秒，文件内容未改变但修改时间更新时会导致缓存失效。
  - `ETag` 和 `If-None-Match`
    - `ETag`：资源的唯一标识符（由服务器生成）。
    - `If-None-Match`：浏览器发送的请求头，携带上次的 `ETag` 值。
    > 优点：比 `Last-Modified` 更精确，能识别内容是否真正变化。
- 特点
  - 如果资源未更新，服务器返回 `304 Not Modified`，浏览器使用本地缓存。
  - 适合动态资源。

---

**缓存策略的优先级**
- 浏览器优先判断是否命中 **强缓存**。
- 如果未命中强缓存，则发起请求，进入 **协商缓存** 流程。
- 如果协商缓存生效，服务器返回 `304 Not Modified`，浏览器使用本地缓存。
- 如果协商缓存未生效，服务器返回新的资源。

---

**注意事项**
- 合理设置缓存策略
  - 对于静态资源，优先使用强缓存。
  - 对于动态资源，使用协商缓存。
- 版本管理
  - 静态资源可以通过文件名或 URL 中的版本号（如 `style.css?v=1.0`）实现缓存更新。
- 安全性
  - 确保敏感数据不被缓存（通过 `Cache-Control: no-store`）。
:::

## 9、什么是图片防盗链，如何实现
图片防盗链是指服务器通过 HTTP 协议中的 Referer 字段来判断请求是否来自合法站点，从而防止其他网站直接引用本站图片资源。
::: details 详情
- 服务器端实现
  - 检查 HTTP Referer 字段。
  - 判断请求来源是否在白名单中。
  - 对非法请求返回 403 或替代图片。

Nginx 配置示例：
```nginx
location ~ .*\.(gif|jpg|jpeg|png|bmp)$ {
    valid_referers none blocked server_names *.example.com;
    if ($invalid_referer) {
        return 403;
        # 或者返回替代图片
        # rewrite ^/ /path/to/default.jpg break;
    }
}
```
- 其他防盗链方案
  - 给图片添加水印。
  - 使用 Token 验证。
  - 使用 CDN 提供的防盗链功能。
  - 对图片进行加密处理。
- 注意事项
  - Referer 可以被伪造，不能作为唯一判断依据。
  - 需要考虑用户体验和 SEO 影响。
  - 移动端 APP 可能不发送 Referer。
  - 部分浏览器可能禁用 Referer。
:::

## 10、什么是 Restful API 
::: details 详情
RESTful API 是一种软件架构风格，用于设计网络应用程序的接口。主要特点：

**资源导向**

- 使用 URL 定位资源。
- 每个资源都有唯一的 URL。
- 资源可以有多种表现形式（如 JSON、XML）。

---

**HTTP 方法对应操作**

- GET：获取资源。
- POST：创建资源。
- PUT：更新资源（完整更新）。
- PATCH：更新资源（部分更新）。
- DELETE：删除资源。

---

**无状态**

- 服务器不保存客户端状态。
- 每个请求包含所需的所有信息。
- 有利于横向扩展。

---

**统一接口**

- 使用标准的 HTTP 方法。
- 使用标准的 HTTP 状态码。
- 返回格式一致（通常是 JSON）。
:::

## 11、什么是 GraphQL
::: details 详情
GraphQL 是一种用于 API 的查询语言和运行时，由 Facebook 开发。主要特点：

**查询灵活性**

- 客户端可以精确指定需要哪些数据。
- 可以在一个请求中获取多个资源。
- 避免了传统 REST API 的过度获取和获取不足问题。

---

**类型系统**

- 强类型的 Schema 定义。
- 自动生成文档。
- 开发时有更好的类型提示。

---

**单个端点**

- 只需要一个 API 端点。
- 所有查询都发送到同一个地址。
- 通过查询语句区分不同的操作。

---

**主要操作类型**

- Query：获取数据。
- Mutation：修改数据。
- Subscription：实时数据订阅。

---

**优点**

- 减少网络请求。
- 避免版本化问题。
- 强类型保障。
- 更好的开发体验。

---

**缺点**

- 学习成本较高。
- 缓存较为复杂。
- 服务端实现复杂度增加。
:::

## 12、GET 和 POST 请求的区别
::: details 详情
- 协议层面：请求行里一定要有请求方法，官方为了统一语义，定义了 GET 表示拿数据，POST 表示上传数据，PUT 表示修改数据，所以 GET，POST 请求这里仅仅是语义上的差别，没有说哪个请求必须做啥。
- 应用层面：开发者约定俗成的规范，GET 请求的请求体会设空，不是没有请求体。
- 浏览器层面：GET 请求会缓存，有历史记录。
:::

## 13、为何现代浏览器都禁用第三方 Cookie
现代浏览器禁用第三方 Cookie 是为了提升用户隐私和安全性，防止跨站点跟踪（Cross-Site Tracking）和广告商滥用用户数据，同时符合隐私法规（如 GDPR 和 CCPA）的要求。

## 14、浏览器从输入 url 到显示网页的全过程
::: details 详情
- DNS 解析出 IP 地址。
- 建立 TCP 连接。
- 客户端发出 HTTP 请求。
- 服务端响应 HTTP 请求。
- 浏览器解析 HTML CSS。
- 渲染 DOM。
- 执行 JS 代码，可能会 ajax 加载内容，再次渲染 DOM。
- 加载媒体资源。
- 浏览器缓存机制。
:::

## 15、在网络层面可做哪些性能优化
::: details 详情
**减少请求数量**

- 合并文件（CSS/JS 打包）。
  > - 使用工具（如 Webpack、Rollup）将多个 CSS 和 JS 文件合并为一个文件，减少 HTTP 请求数量。
- 雪碧图（CSS Sprites）。
  > - 将多个小图片合并为一张大图片，通过 CSS 的 `background-position` 属性定位显示。
- 图片懒加载。
  > - 延迟加载页面中未进入视口的图片，减少初始加载的资源数量。
- 按需加载/异步加载。
  > - 按需加载：仅加载当前页面需要的资源。
  > - 异步加载：使用 `async` 或 `defer` 属性加载 JS 文件，避免阻塞页面渲染。
- 合理使用缓存。
  > - 对于不经常变化的资源，设置长时间的缓存策略，减少重复请求。

---

**减小资源体积**

- 代码压缩（minify）。
  > - 使用工具（如 Terser、CSSNano）压缩 JS 和 CSS 文件，去除多余的空格、注释等。
- Gzip/Brotli 压缩。
  > - 在服务器端启用 Gzip 或 Brotli 压缩，减少传输数据量。
- 图片优化（压缩、webp格式）。
  > - 使用工具（如 TinyPNG、ImageMagick）压缩图片，或将图片转换为 WebP 格式。
- Tree Shaking。
  > - 移除未使用的代码，通常与 ES6 模块配合使用。
- 代码分割（Code Splitting）。
  > - 将代码按需分割，减少初始加载体积。

---

**CDN 优化**

- 使用 CDN 分发静态资源。
  > - 将静态资源部署到 CDN 节点，用户可以从最近的节点加载资源。
- 合理设置 CDN 缓存。
  > - 配置缓存策略，减少重复请求。
- 选择合适的 CDN 节点。
  > - 根据用户分布选择覆盖范围广、延迟低的 CDN 服务商。
- 配置 CDN 预热和刷新策略。
  > - 预热：在资源上线前，将资源加载到 CDN 节点。
  > - 刷新：当资源更新时，及时刷新 CDN 缓存。

---

**HTTP 优化**

- 使用 HTTP/2 多路复用。
  > - 在一个 TCP 连接中同时传输多个请求和响应，减少连接开销。
- 开启 Keep-Alive。
  > - 复用 TCP 连接，避免频繁建立和关闭连接。
- 合理设置缓存策略。
  > - 对静态资源设置强缓存（`Cache-Control`），对动态资源使用协商缓存（`ETag`）。
- DNS 预解析（dns-prefetch）。
  > - 提前解析外部资源的域名，减少 DNS 查询时间。
- 预连接（preconnect）。
  > - 提前建立与外部资源的连接，包括 DNS 查询、TLS 握手等。
- 预加载（prefetch/preload）。
  > - 预加载：提前加载关键资源。
  > - 预取：加载未来可能需要的资源。

---

**资源加载优化**

- 关键资源优先加载。
  > - 提前加载 CSS、JS 等关键资源，确保页面快速渲染。
- 非关键资源延迟加载。
  > - 延迟加载不影响页面渲染的资源（如图片、广告）。
- 内联关键 CSS/JS。
  > - 将关键 CSS 和 JS 直接写入 HTML，减少外部请求。
- 异步加载非关键 JS（async/defer）。
  > - `async`：脚本加载完成后立即执行，可能阻塞 HTML 解析。
  > - `defer`：脚本加载完成后，等待 HTML 解析完成再执行。
- 优化资源加载顺序。
  > - 优先加载渲染关键路径上的资源，延迟加载非关键资源。

---

**接口优化**

- 接口合并。
  > - 将多个接口请求合并为一个，减少网络请求次数。
- GraphQL 按需查询。
  > - 使用 GraphQL 查询所需字段，避免传统 REST API 的过度获取或获取不足问题。
- 数据缓存。
  > - 使用浏览器缓存（如 `localStorage`、`sessionStorage`）或服务端缓存（如 Redis）。
- 避免重复请求。
  > - 在前端对重复请求进行去重，减少不必要的接口调用。
- 设置合理的超时时间。
  > - 为接口请求设置超时时间，避免长时间等待。

---

**监控和分析**

- 性能监控。
  > - 使用工具（如 Lighthouse、WebPageTest）监控页面性能。
- 错误监控。
  > - 使用工具（如 Sentry）捕获前端和后端的错误日志。
- 用户体验监控。
  > - 收集用户的关键性能指标（如 FCP、LCP、CLS），优化用户体验。
- 性能数据分析。
  > - 分析性能数据，定位瓶颈并持续优化。
- 持续优化。
  > - 定期评估和优化网络性能，跟踪最新的优化技术。
:::

## 16、CORS 是如何实现跨域的
::: details 详情
**什么是 CORS**
- CORS（Cross-Origin Resource Sharing，跨域资源共享）是一种浏览器的跨域访问机制。
- 它通过设置特定的 HTTP 响应头，允许浏览器访问跨域资源。

---

**CORS 的实现原理**
- 浏览器会在跨域请求时，自动添加一些请求头，并根据服务器返回的响应头决定是否允许跨域访问。
- CORS 的核心是服务器通过响应头告知浏览器是否允许跨域请求。

---

**CORS 的关键响应头**
- `Access-Control-Allow-Origin`
  > 指定允许访问的域名。
  ```http
  Access-Control-Allow-Origin: https://example.com
  ```
- `Access-Control-Allow-Methods`
  > 指定允许的 HTTP 方法。
  ```http
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE
  ```
- `Access-Control-Allow-Headers`
  > 指定允许的自定义请求头。
  ```http
  Access-Control-Allow-Headers: Content-Type, Authorization
  ```
- `Access-Control-Allow-Credentials`
  > 指定是否允许携带 Cookie。
  ```http
  Access-Control-Allow-Credentials: true
  ```
- `Access-Control-Expose-Headers`
  > 指定哪些响应头可以被浏览器访问。
  ```http
  Access-Control-Expose-Headers: X-Custom-Header
  ```
- `Access-Control-Max-Age`
  > 指定预检请求的结果可以缓存的时间（单位：秒）。
  ```http
  Access-Control-Max-Age: 86400
  ```

---

**CORS 的两种请求类型**
- 简单请求
  - 满足以下条件的请求被视为简单请求
    - 使用的 HTTP 方法是 `GET`、`POST` 或 `HEAD`。
    - 请求头仅包含以下字段：
      > - `Accept`
      > - `Accept-Language`
      > - `Content-Language`
      > - `Content-Type`（值为 `application/x-www-form-urlencoded`、`multipart/form-data` 或 `text/plain`）。
  - 流程
    - 浏览器直接发送请求，服务器通过响应头决定是否允许跨域。
- 预检请求
  - 如果请求不满足简单请求的条件，浏览器会在正式请求之前发送一个 `OPTIONS` 请求，称为预检请求。
  - 流程
    1. 浏览器发送 `OPTIONS` 请求，询问服务器是否允许跨域。
    2. 服务器返回包含 CORS 相关头的响应。
    3. 如果预检请求通过，浏览器才会发送正式请求。
:::

## 17、什么是 CDN
::: details 详情
**定义**
- CDN（Content Delivery Network，内容分发网络）是一种分布式的网络架构，用于加速内容的分发。
- 通过将内容缓存到多个地理位置分散的节点（Edge Server），用户可以从离自己最近的节点获取资源，从而提高访问速度和可靠性。

---

**工作原理**
1. 用户向目标服务器发起请求。
2. DNS 解析将请求路由到最近的 CDN 节点。
3. CDN 节点检查是否有缓存的资源：
   - 如果有缓存，直接返回资源。
   - 如果没有缓存，向源服务器请求资源并缓存到节点。
4. 用户从 CDN 节点获取资源。

---

**优点**
- 加速访问：用户从最近的节点获取资源，减少延迟。
- 减轻源服务器压力：CDN 节点分担了大部分流量，降低源服务器负载。
- 提高可靠性：多个节点分布式部署，避免单点故障。
- 节省带宽：通过缓存减少重复请求，降低带宽消耗。
- 支持高并发：分布式架构可以同时处理大量用户请求。

---

**应用场景**
- 网站加速：提高网页加载速度，优化用户体验。
- 视频点播/直播：提供高质量的视频流传输，减少卡顿。
- 文件下载：加速大文件的分发（如软件、补丁）。
- API 加速：提升接口响应速度，减少延迟。
:::