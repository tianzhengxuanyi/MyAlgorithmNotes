---
lang: zh-CN
title: html
description: html面试题
---

# html

## 1、什么是 DOCTYPE， 有何作用
**DOCTYPE** 是 HTML5 的文档声明，通过它可以告诉浏览器，使用哪一个 HTML 版本标准解析文档。在浏览器发展的过程中，HTML 出现过很多版本，不同的版本之间格式书写上略有差异。如果没有事先告诉浏览器，那么浏览器就不知道文档解析标准是什么？此时，大部分浏览器将开启最大兼容模式来解析网页，我们一般称为 **怪异模式**，这不仅会降低解析效率，而且会在解析过程中产生一些难以预知的 bug，所以文档声明是必须的。

## 2、说说对 HTML 语义化的理解
HTML 标签的语义化，简单来说，就是用正确的标签做正确的事情，给某块内容用上一个最恰当最合适的标签，使页面有良好的结构，页面元素有含义，无论是谁都能看懂这块内容是什么。

语义化的优点如下：
::: details 详情
- 在没有 CSS 样式情况下也能够让页面呈现出清晰的结构
- 有利于 SEO 和搜索引擎建立良好的沟通，有助于爬虫抓取更多的有效信息，爬虫是依赖于标签来确定上下文和各个关键字的权重
- 方便团队开发和维护，语义化更具可读性，遵循 W3C 标准的团队都遵循这个标准，可以减少差异化
:::

## 3、meta 标签是干什么的，都有什么属性和作用
HTML 中的 `<meta>` 标签用于提供页面的元信息，这些信息不会直接显示在网页内容中，但对浏览器、搜索引擎和其他服务非常重要。
::: details 详情
常见的 meta 信息如下：
- 字符编码：
  > 指定网页的字符编码，确保正确显示内容
```html
<meta charset="utf-8">
```
- 页面视口设置（响应式设计）：
  > 控制页面在移动设备上的显示和缩放行为。
```html
<!-- width=device-width：页面宽度匹配设备屏幕宽度 -->
<!--initial-scale=1.0：初始缩放比例为 1  -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```
- 搜索引擎优化（SEO）：
  > 提供描述性信息，便于搜索引擎索引。
```html
<meta
  name="keywords"
  content="前端, 面试, 前端面试, 面试题, 刷题, js, ts, React, Vue, webpack, vite, HTTP"
/>
<meta name="description" content="前端面试宝典，胖虎的前端面试题" />
<meta name="robots" content="index, follow" />
```
- 作者信息：
  > 提供网页作者信息。
```html
<meta name="author" content="胖虎" />
```
- 防止页面缓存：
  > 防止用户在浏览器中缓存页面，每次访问页面时都会重新加载。
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```
- 刷新与跳转：
  > 设置页面自动刷新或跳转到指定 URL。
```html
<!-- 每隔 5 秒刷新页面 -->
<meta http-equiv="refresh" content="5" />
<!-- 5 秒后跳转到指定页面 -->
<meta http-equiv="refresh" content="5;url=https://example.com" />
```
- 网页兼容模式：
  > 指定网页在 IE 浏览器中的渲染模式。
```html
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
```
- 安全性相关：
  > 提高网页的安全性，防止跨站脚本攻击（XSS）。
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'" />
```
:::

## 4、什么是 DOM ，它和 HTML 有什么区别
DOM 即 Document Object Model 文档对象模型，它是一个 JS 对象。而 HTML 是一种标记语言（和 XML 类似）用于定义网页的内容和结构。
::: details 详情
DOM 的特点：

- 树形结构，DOM 树
- 可编程，可以使用 Javascript 读取和修改 DOM 数据
- 动态性，通过 DOM API 动态修改结构和数据

HTML 到 DOM 的过程：

- HTML 解析：浏览器解析 HTML 代码，生成 DOM 树。
- CSSOM 生成：解析 CSS，生成 CSSOM（CSS 对象模型）。
- 渲染树：结合 DOM 和 CSSOM，生成渲染树。
- 页面渲染：根据渲染树将内容显示在页面上。
:::

## 5、如何一次性插入多个 DOM 节点？考虑性能
直接多次操作 DOM（如多次 `appendChild` 或 `innerHTML` 更新）会导致性能问题，因为每次操作都会触发 DOM 的重新渲染。

`DocumentFragment` 是一个轻量级的文档片段，可以在内存中操作节点，最后一次性插入到 DOM 中，从而减少重绘和回流。
::: details 详情
```js
// 获取目标容器
const container = document.getElementById('list')

// 创建 DocumentFragment
const fragment = document.createDocumentFragment()

// 创建多个节点并添加到 fragment 中
for (let i = 1; i <= 1000; i++) {
  const li = document.createElement('li')
  li.textContent = `item ${i}`
  fragment.appendChild(li)
}

// 一次性插入到 DOM
container.appendChild(fragment)
```
:::

## 6、offsetHeight scrollHeight clientHeight 有什么区别
::: details 详情
- `offsetHeight`：元素的总高度，包括内容高度、内边距（padding）、水平滚动条高度（如果存在）、以及边框（border）。不包括外边距（margin）。
- `scrollHeight`：元素的实际内容高度，包括不可见的溢出部分（scrollable content），大于等于 clientHeight。
- `clientHeight`：元素的可见内容高度，包括内容高度和内边距（padding），但不包括水平滚动条高度、边框（border）和外边距（margin）。
:::

## 7、HTMLCollection 和 NodeList 的区别
在操作 DOM 时，`HTMLCollection` 和 `NodeList` 都是用来表示节点集合的对象，它们的区别是：
::: details 详情
`HTMLCollection` 只包含 **HTML 元素节点**。通过 `document.getElementsByTagName` 或 `document.getElementsByClassName` 返回的结果是 `HTMLCollection`。

`NodeList` 包括 **元素节点、文本节点、注释节点** 等，不仅仅是 **HTML 元素节点**
- 通过 `document.querySelectorAll` 返回的是 静态 `NodeList`
- 通过 `childNodes` 返回的是 动态 `NodeList`

当文档结构发生变化时

- `HTMLCollection` 和 动态 `NodeList` 会随着 DOM 的变化自动更新
- 静态 `NodeList` 不会随着 DOM 的变化自动更新
:::

## 8、Node 和 Element 有什么区别
在 DOM（文档对象模型）中，`HTML Element` 和 `Node` 都是表示文档结构中的对象，但它们有不同的定义和用途：
::: details 详情
- `Node` 是 DOM 树中所有类型对象的基类，是一个接口，表示文档树中的一个节点。它有多个子类型，Element 是其中的一个。其他的还有 Text、Comment 等。
  > Node 常见属性如 `nodeName` `nodeValue`
- `HTML Element` 是 Node 的子类，专门表示 HTML 元素节点。它提供了与 HTML 元素相关的更多功能，如属性、样式等。HTML Element 仅表示 HTML 元素节点，通常对应 HTML 标签，如 `<div>`, `<p>`, `<a>` 等。
  > Element 常见属性和方法如 `innerHTML` `getAttribute` `setAttribute`
:::

## 9、window.onload 和 DOMContentLoaded 的区别是什么
这两个事件都用于检测页面的加载状态，但触发的时机和作用范围有所不同：
::: details 详情
- `DOMContentLoaded` 是当 **DOM 树构建完成**（HTML 被解析完成，不等待样式表、图片、iframe 等资源加载）时触发，不依赖于外部资源。
- `window.onload` 是当 **整个页面及所有资源**（包括样式表、图片、iframe、脚本等）加载完成时触发，依赖于外部资源。

`DOMContentLoaded` 会更早触发。

使用推荐
- 如果你的逻辑只依赖 DOM 的加载（如操作页面结构、绑定事件），使用 `DOMContentLoaded`。
- 如果你的逻辑需要依赖页面所有资源加载完成（如获取图片尺寸、执行动画），使用 `window.onload`。
:::

## 10、script 标签放在 head 里，怎么解决加载阻塞的问题
在 HTML 中，`<script> `标签通常会阻塞页面的渲染，尤其是当它放在 `<head>` 部分时，因为浏览器会在执行 js 代码之前停止解析 HTML。

可参考的解决方案：
::: details 详情
- 使用 `async` 属性。当 `async` 属性添加到 `<script>` 标签时，脚本会异步加载，并在加载完成后立即执行，不会阻塞页面的渲染。适用于不依赖其他脚本或页面内容的独立脚本，但多个 js 文件时无法保证加载和执行顺序。
```html
<head>
  <script src="script.js" async></script>
</head>
```
- 使用 `defer` 属性。`defer` 属性使得脚本延迟执行，直到 HTML 文档解析完毕。这意味着脚本不会阻塞 HTML 渲染，且会按照文档中 `<script>` 标签的顺序执行。适用于依赖 DOM 元素的脚本（如操作页面内容）。
```html
<head>
  <script src="script.js" defer></script>
</head>
```
- 将 `<script>` 放在 `<body>` 最后。
:::

## 11、什么是回流重绘，如何减少回流重绘
- 回流（Reflow）：元素的位置发生变动时发生重排，也叫重排。此时在关键渲染路径中的 `Layout` 阶段，计算每一个元素在设备视口内的确切位置和大小。当一个元素位置发生变化时，其父元素及其后边的元素位置都可能发生变化，代价极高。
- 重绘（Repaint）：元素的样式发生变动，但是位置没有改变。此时在关键渲染路径中的 `Paint` 阶段，将渲染树中的每个节点转换成屏幕上的实际像素，这一步通常称为绘制或栅格化。
::: details 详情
另外，重排必定会造成重绘。以下是避免过多重拍重绘的方法：
- 使用 DocumentFragment 进行 DOM 操作，不过现在原生操作很少也基本上用不到。
- CSS 样式尽量批量修改。
- 使用 CSS 动画代替 js 动画。
- 避免使用 table 布局。
- 为元素提前设置好高宽，不因多次渲染改变位置。
:::