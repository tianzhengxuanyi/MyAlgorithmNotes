---
lang: zh-CN
title: css
description: css面试题
---

# css

## 1、常见的 CSS 选择器有哪些
::: details 详情
|选择器类型|	示例|	说明|
|----|------|------|
|元素选择器|`p`|选择所有 `<p>` 元素|
|类选择器|`.button`|选择所有 `class="button"` 的元素|
|ID 选择器|`#header`|选择 `id="header"` 的元素|
|通用选择器|`*`|选择页面中的所有元素|
|后代选择器|`div p`|选择 `<div>` 内的所有 `<p>` 元素|
|子元素选择器|`div > p`|选择 `<div>` 的直接子元素 `<p>`|
|相邻兄弟选择器|`h1 + p`|选择紧接在 `<h1>` 后面的 `<p>` 元素|
|通用兄弟选择器|`h1 ~ p`|选择所有紧跟在 `<h1>` 后面的 `<p>` 元素|
|属性选择器|`a[href]`|选择具有 `href` 属性的所有 `<a>` 元素|
|`:hover`|`a:hover`|选择鼠标悬停时的 `<a>` 元素|
|`:first-child`|`p:first-child`|选择父元素中的第一个 `<p>` 元素|
|`:nth-child(n)`|`li:nth-child(odd)`|选择父元素中所有奇数位置的 `<li>` 元素|
|`::before`|`p::before { content: "Note: "; }`|在每个 `<p>` 元素的前面插入 "Note: "|
|`::after`|`p::after { content: "."; }`|在每个 `<p>` 元素的后面插入一个句点|
|:`not()`|`p:not(.highlight)`|选择所有不具有 `highlight` 类的 `<p>` 元素|
:::

## 2、line-height 如何继承
::: details 详情
`line-height` 不同类型的值，继承规则是不一样的。
- 写具体的数值，如 30px，则继承该数值。
```css
div {
  line-height: 30px;
}
p {
  /* 继承具体数值 30px */
  line-height: inherit;
}
```
- 写百分比，如 200% ，则继承当前计算出来的值（即父元素的 `font-size` * 百分比）。
```css
div {
  font-size: 16px;
  line-height: 200%; /* 计算后为 32px */
}
p {
  /* 继承计算后的值 32px */
  line-height: inherit;
}
```
- 写比例，如 2 或 1.5 ，则继承比例。
```css
div {
  font-size: 16px;
  line-height: 1.5; /* 计算后为 24px */
}
p {
  /* 继承比例值 1.5 */
  line-height: inherit;
}
```
:::

## 3、如何让一个盒子垂直居中
::: details 详情
- 使用 `flex` 布局。
  > 这是最常用的方法，适用于现代浏览器。
```css
.container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 300px; /* 父容器高度 */
  border: 1px solid #000;
}
.box {
  width: 100px;
  height: 100px;
  background-color: lightblue;
}
```
- 使用 `grid` 布局。
  > grid 布局可以通过 place-items 属性轻松实现水平和垂直居中。
```css
.container {
  display: grid;
  place-items: center; /* 水平和垂直居中 */
  height: 300px; /* 父容器高度 */
  border: 1px solid #000;
}
.box {
  width: 100px;
  height: 100px;
  background-color: lightgreen;
}
```
- 使用 `position` 和 `transform`。
  > 适用于固定宽高的盒子。
```css
.container {
  position: relative;
  height: 300px; /* 父容器高度 */
  border: 1px solid #000;
}
.box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 水平和垂直居中 */
  width: 100px;
  height: 100px;
  background-color: lightcoral;
}
```
- 使用 `table` 布局。
  > 适用于需要兼容旧版浏览器的场景。
```css
.container {
  display: table;
  width: 100%;
  height: 300px; /* 父容器高度 */
  text-align: center; /* 水平居中 */
  border: 1px solid #000;
}
.box {
  display: table-cell;
  vertical-align: middle; /* 垂直居中 */
  width: 100px;
  height: 100px;
  background-color: lightyellow;
}
```
- 使用 `line-height`。
  > 适用于单行文字或高度固定的盒子。
```css
.container {
  height: 300px; /* 父容器高度 */
  line-height: 300px; /* 行高等于容器高度 */
  text-align: center; /* 水平居中 */
  border: 1px solid #000;
}
.box {
  display: inline-block; /* 使子元素不占满整行 */
  vertical-align: middle; /* 垂直居中 */
  line-height: normal; /* 重置子元素的行高 */
  width: 100px;
  height: 100px;
  background-color: lightpink;
}
```
:::

## 4、CSS 中 overflow: hidden、display：none 和 visibility: hidden 有什么区别
::: details 详情
- `overflow: hidden`：溢出内容不可见，未溢出的部分正常可见。
- `display：none`：隐藏内容，不占用任何空间，内容变化不会重新渲染。
- `visibility: hidden`：隐藏元素，但保留其占据的空间，内容变化会重新渲染。
:::

## 5、CSS 中 px、%、em、rem、vw/vh 的区别
::: details 详情
|单位|基准|绝对/相对|优点|缺点|适用场景|
|--|----|----|-----|-----|------|
|px|固定像素|绝对|精确，简单易用|	缺乏响应式能力|固定尺寸元素|
|%|父元素尺寸|相对|灵活，适合响应式设计|依赖父元素|响应式布局，流式设计|
|em|当前元素字体大小|相对|动态调整，适合局部相对设计|嵌套复杂，计算难预测|动态字体、内外边距等|
|rem|根元素字体大小（html）|相对|全局一致，计算简单|需要设置根元素字体|全局比例调整，响应式设计|
|vw/vh|视口宽度或高度|相对|基于视口，适合全屏设计|小屏显示可能不理想|全屏布局，视口动态调整|

使用建议:
- 响应式设计：结合使用 rem 和 %。
- 固定大小：使用 px 定义精确尺寸。
- 全屏布局：使用 vw 和 vh。
- 动态比例设计：em 和 rem 都是优秀的选择，但推荐 rem 更加简洁统一。
:::

## 6、如何实现 Retina 屏 1px 像素边框
::: details 详情
在 Retina 屏上，由于像素密度更高，1px 的边框可能会显得过粗。以下是几种常见的实现方法：

- 使用 `transform: scale` 实现。
```css
.retina-border {
  position: relative;
}

.retina-border::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px; /* 边框的物理宽度 */
  background-color: black; /* 边框颜色 */
  transform: scaleY(0.5); /* 缩放到 0.5 */
  transform-origin: 0 0; /* 缩放起点 */
}
```
- 使用 `box-shadow` 实现。
```css
.retina-border {
  position: relative;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.5); /* 通过阴影模拟边框 */
}
```
- 使用 `border-image` 实现。
```css
.retina-border {
  border: 1px solid transparent;
  border-image: linear-gradient(to bottom, black, black) 1;
}
```
- 使用 `background` 实现。
```css
.retina-border {
  position: relative;
}

.retina-border::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, black 1px, transparent 0);
  pointer-events: none; /* 防止伪元素影响交互 */
}
```
- 使用 `outline` 实现。
```css
.retina-border {
  outline: 1px solid black;
  outline-offset: -0.5px; /* 调整位置 */
}
```
:::

## 7、使用 CSS 画一个三角形
::: details 详情
使用 CSS “画”一个向上的三角形，重点在于使用透明边框。
```html
<style>
  .triangle-up {
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 50px solid #000; /* 底部颜色即为三角形颜色 */
  }
</style>
<div class="triangle-up"></div>
```
:::

## 8、CSS 中如何理解 z-index
::: details 详情
- `z-index` 是一个 CSS 属性，用于控制元素的堆叠顺序（沿 Z 轴的显示顺序）。值越大，元素越靠前显示，反之值越小，元素越靠后。
- `z-index` 只适用于定位的元素，需要设置 `position` 属性为 `relative`、`absolute`、`fixed` 或 `sticky`，否则 `z-index` 不生效。
- `z-index` 只在同级比较，父子元素的 `z-index` 不会互相影响。
:::

## 9、有没有使用过 css variable（变量），它解决了哪些问题
CSS 变量，也称为自定义属性，允许你在 CSS 中定义可重用的值。它们以 -- 开头，可以在整个样式表中通过 var() 函数引用。
::: details 详情
- 减少样式重复定义。
  > 比如同一个颜色值要在多个地方重复使用，以前通过 less 和 sass 预处理做到，现在 css 变量也可以做到，方便维护，提高可读性。
```css
:root {
  --main-color: #4387fb;
}

h1 {
  color: var(--main-color);
}

p {
  border-color: var(--main-color);
}
```
- 动态修改样式。
  > 可以通过 js 动态修改，制作性能更高的动画或实现主题切换。
```js
document.documentElement.style.setProperty('--main-color', '#e74c3c');
```
- 作用域灵活：
  > 可以在不同的选择器中定义和覆盖，支持局部作用域。
```css
:root {
  --main-color: #3498db;
}

.header {
  --main-color: #e74c3c; /* 局部覆盖 */
}
```
- 支持回退值：
  > 当变量未定义时，可以使用回退值。
```css
body {
  color: var(--main-color, #000); /* 如果 --main-color 未定义，则使用 #000 */
}
```
- 配合 content 等通过 css 给 js 传参，得到一些通过 js 难以获取的参数。

html
```html
<div class="box" data-value="42"></div>
```
css
```css
:root {
  --box-color: #3498db; /* 定义一个 CSS 变量 */
}

.box::before {
  content: attr(data-value); /* 使用 data-value 属性的值 */
  display: none; /* 隐藏伪元素 */
}

.box {
  background-color: var(--box-color); /* 使用 CSS 变量 */
  width: 100px;
  height: 100px;
}
```
js
```js
// 获取伪元素的 content 值
const box = document.querySelector('.box');
const style = getComputedStyle(box, '::before'); // 获取伪元素样式
const contentValue = style.content.replace(/['"]/g, ''); // 去掉引号
console.log('伪元素的 content 值:', contentValue); // 输出: 42

// 动态修改 CSS 变量
document.documentElement.style.setProperty('--box-color', '#e74c3c');
```
:::

## 10、为什么会发生样式抖动
因为没有指定元素具体高度和宽度，比如数据还没有加载进来时元素高度是100px(假设这里是100px)，数据加载进来后，因为有了数据，然后元素被撑大，所有出现了抖动。

## 11、什么是 BFC ，如何触发 BFC
BFC (Block formatting context) 直译为"`块级格式化上下文`"。它是一个独立的渲染区域，与这个区域外部毫不相干。即，BFC 里面的的内容再怎么发生变化，也不会影响到 BFC 外面的布局，这一点是在网页布局中非常有用的。
::: details 详情
BFC 的特性
- 同一个 BFC 内的元素会垂直排列：
  > 每个元素的外边距会发生折叠（margin collapsing）。
- BFC 区域不会与浮动元素重叠：
  > BFC 可以包含浮动的子元素，避免父元素高度塌陷。
- BFC 是一个独立的布局环境：
  > BFC 内部的布局不会影响外部，外部的布局也不会影响 BFC 内部。

如何触发 BFC：
- 根元素
- `float` 属性不为 `none`。
- `position` 为 `absolute` 或 `fixed`。
- `display` 为 `inline-block` `table-cell` `table-caption` `flex` `inline-flex` `flow-root`。
- `overflow` 不为 `visible`。

应用场景：
- 清楚浮动：
  > 当子元素使用 float 布局时，父元素高度会塌陷。通过触发 BFC，可以包含浮动的子元素。
- 防止外边距折叠：
  > 当两个相邻元素的外边距发生折叠时，可以通过触发 BFC 来避免。
- 解决浮动元素重叠问题：
  > 当浮动元素与普通文档流元素重叠时，可以通过触发 BFC 来解决。
- 自适应两栏布局：
  > 使用 BFC 可以实现左侧固定宽度，右侧自适应的两栏布局。
:::

## 12、CSS 中伪类和伪元素有什么区别
- 伪类使用单冒号，而伪元素使用双冒号。如 `:hover` 是伪类，`::before` 是伪元素。
- 伪元素会在文档流生成一个新的元素，并且可以使用 `content` 属性设置内容。

## 13、CSS 如何设置多行超出显示省略号
::: details 详情
```css
.box {
  width: 200px;
  word-wrap: break-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
```
:::

## 14、flex 布局中 order 有何作用
`order` 属性定义 flex 布局中子元素的排列顺序，数值越小，排列越靠前，默认为0。

## 15、简单描述 CSS 的盒模型
CSS 的盒模型主要包括以下两种，可通过 `box-sizing` 属性进行配置：
- 标准盒子模型（`content-box`）
  > - width = content-width height = content-height。
- 怪异盒子模型（`border-box`） 
  > - width = content-width + padding + border height = content-height + padding + border。
  > - 在怪异模式下，width 和 height 设置的是整个盒子的尺寸（包括 padding 和 border），而内容区域会自动调整。