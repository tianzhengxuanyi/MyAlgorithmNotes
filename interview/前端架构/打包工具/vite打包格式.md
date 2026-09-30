# Vite库模式 + ESM/CJS/UMD模块规范 面试题文档

> 
> 合并内容：Vite库模式概念、使用场景、配置、产物格式ESM/CJS/UMD模块规范、package.json入口字段、面试高频问答。

## 1、什么是Vite的库模式（build.lib）？

**考察方向：概念、使用场景，区分「应用模式」与「库模式」**

> 
> 简答：
> Vite默认是**应用模式**，用来开发业务Web应用，构建产物目标是浏览器网页，会处理HTML入口、CSS注入、资源内联、html打包等。

**库模式（`build.lib`）是专门用来打包SDK、组件库、工具函数库的构建模式**。

- 目标输出：给其他项目导入使用的js模块包（ESM / CJS / UMD），**不会生成 index.html 入口文件**；
- 不会做HTML相关处理，重点处理导出模块、外部依赖剥离、多格式产物输出；
- 底层：Vite 1‑7基于Rollup实现；Vite8基于Rolldown实现，配置API完全兼容。

✅ 适合场景：组件库、工具函数库、SDK、公共npm包
❌ 不适合：普通业务前端Web项目（业务项目使用默认应用模式）

> 
> 关键特性：

1. 需要指定库入口`entry`；
2. 可配置输出多种模块格式 `formats: ['es','cjs','umd']`；
3. umd格式需要配置`name`，作为浏览器全局挂载变量名；
4. 通过`rollupOptions.external`把第三方依赖排除，不打进库产物（库开发核心，避免把vue/pinia打包进你的npm包）。

## 2、ESM、CJS、UMD三种模块规范分别是什么？

**考察方向：模块标准、特性差异、适用场景**

> 
> 注意：CMD是SeaJS旧规范，现已废弃，新项目不用考虑。

### ESM（ES Module / ES6 Module）

ES官方标准模块规范

- 语法：`import / export / export default`
- 运行环境：现代浏览器（`type="module"`）、Node.js（`package.json "type":"module"` / `.mjs`后缀）
- 特点：
  1. **静态解析**，`import/export`必须写在顶层，编译期可做Tree‑Shaking，删除未使用代码；
  2. 默认开启严格模式，顶层`this`为`undefined`；
- 产物后缀：`.mjs`

```
//导出
export const msg = "hello"
export default function foo(){}
//导入
import foo, {msg} from './index.mjs'
```

### CJS（CommonJS）

Node.js传统模块规范

- 语法：`require()`、`module.exports`、`exports`
- 运行环境：仅Node原生支持，浏览器不原生支持
- 特点：
  1. **运行时动态加载**，`require()`可写在if、函数内部；**不支持Tree‑Shaking**；
  2. 每个模块拥有独立`require / exports / module / __dirname / __filename`；
- 产物后缀：`.cjs`

```
exports.msg = "hello"
module.exports = function foo(){}
const foo = require('./index')
```

### UMD（Universal Module Definition 通用模块）

> 
> 目的：一份产物同时兼容浏览器全局、AMD(requirejs)、CommonJS环境

- 内部带环境判断胶水代码；
- 使用场景：直接通过`<script src="xxx.umd.js">`在浏览器引入，挂载全局window变量；
- 缺点：胶水代码增加体积，**不支持Tree‑Shaking**。

UMD伪代码示例

```
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MyLib = factory();
  }
})(this, function() {
  return { hello() {} }
})
```

| 格式 | 运行环境 | 语法 | Tree‑Shaking | 典型后缀 |
| --- | --- | --- | --- | --- |
| ESM | 现代浏览器 / Node(type:module) | `import / export` | ✅支持 | `.mjs` |
| CJS | Node.js | `require / module.exports` | ❌不支持 | `.cjs` |
| UMD | 浏览器script标签、AMD、Node | 环境判断胶水代码 | ❌不支持 | `.umd.js` |

## 3、Vite库模式完整配置示例，同时输出es、cjs、umd产物

**考察方向：实操配置，库开发必问**

```
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    // 开启库模式
    lib: {
      entry: './src/index.ts', //库入口文件
      name: 'MyDemoLib', // umd模式挂载到window的全局变量名
      fileName: (format) => `my‑lib.${format}.js`,
      formats: ['es', 'cjs', 'umd'] //输出多种格式
    },
    rollupOptions: {
      external: ['vue','pinia'], //外部依赖，不打包进库产物
      output: {
        // umd模式外部依赖对应的全局变量映射
        globals: {
          vue: 'Vue',
          pinia: 'Pinia'
        }
      }
    }
  }
})
```

> 
> 打包dist输出产物：

- `my‑lib.es.js` — ESM格式
- `my‑lib.cjs.js` — CJS格式
- `my‑lib.umd.js` — UMD格式

## 4、库项目package.json关键入口字段，main / module / exports 区别

**考察方向：npm包发布，下游工具如何识别你的产物**

```
{
  "name": "my‑lib",
  "version": "1.0.0",
  "main": "./dist/my‑lib.cjs.js",
  "module": "./dist/my‑lib.es.js",
  "exports": {
    ".": {
      "import": "./dist/my‑lib.es.js",
      "require": "./dist/my‑lib.cjs.js"
    }
  },
  "types": "./dist/index.d.ts"
}
```

- `main`：传统入口，`require()`加载，指向CJS产物，**不支持Tree‑Shaking**；兼容老项目。
- `module`：供Vite / Webpack / Rollup识别，指向ESM产物，**用于Tree‑Shaking**；浏览器、Node原生不会读取此字段。
- `exports`：**优先级最高**，现代Node、Vite、Rollup优先读取exports；可以区分`import`和`require`指定不同产物。

## 5、面试高频问答

### Q1：库模式和普通应用模式的核心区别？

> 
> 简答：

1. 应用模式：构建网页，输出index.html，面向浏览器业务页面；
2. 库模式：不输出html，输出js模块包（es/cjs/umd），面向npm包、组件库、SDK，供其他项目导入使用。

### Q2：库模式中external是做什么？不配置会怎么样？

> 
> 简答：`external`声明外部依赖（vue、pinia等），告诉打包工具不要把第三方依赖打进库产物。
> 如果不配置external，vue/pinia会被打包进你的库，下游项目会出现多份Vue实例，引发响应式bug、包体积膨胀。

### Q3：什么场景需要输出UMD格式？

> 
> 简答：需要使用者直接用`<script>`标签在浏览器引入，不需要构建工具，挂载window全局变量。普通业务、内部npm包不需要输出umd。

### Q4：ESM支持Tree‑Shaking，CJS为什么不行？

> 
> 简答：ESM是**静态模块**，import/export写在顶层，编译期可以分析未被使用导出；
> CJS的`require()`运行时执行，可以写在条件、函数内部，编译期无法静态分析，不能做Tree‑Shaking。

### Q5：`.mjs`、`.cjs`后缀的作用

1. `.mjs`：强制文件作为ESM执行，不受package.json type字段控制；
2. `.cjs`：强制文件作为CommonJS执行；
3. `.js`行为受`package.json`的`type`控制：
   - `"type":"module"` → `.js`解析为ESM；
   - 不设置 / `"type":"commonjs"` → `.js`解析为CJS。

### Q6：Vite8 Rolldown下库模式有什么变化？

> 
> 简答：API完全兼容，不需要修改配置；底层打包引擎从Rollup替换为Rolldown，构建速度提升。

## 📋速记清单

| 问题 | 关键词 |
| --- | --- |
| Vite库模式 | `build.lib`；用于打包组件库/SDK/npm包；不输出index.html；区别于普通web应用模式 |
| ESM | `import/export`，静态，支持Tree‑Shaking，`.mjs` |
| CJS | `require/module.exports`，运行时加载，无Tree‑Shaking，`.cjs` |
| UMD | 兼容script直接引入，带胶水代码，无Tree‑Shaking |
| 配置要点 | `entry`入口、`name`umd全局变量、`formats`输出格式、`external`剥离外部依赖 |
| package.json | `main(cjs)`、`module(es用于tree‑shake)`、`exports`优先级最高 |

---

> 
> 如果你需要，我可以把这份文档，和之前：Vue‑Router + Pinia + VueUse + Element‑Plus + Vite(Vite8+Rolldown) + Module‑Federation模块联邦全部合并为一份完整大Markdown复习文档。