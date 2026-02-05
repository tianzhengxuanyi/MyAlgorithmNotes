---
lang: zh-CN
title: 前端工程化
description: 前端工程化面试题
---

# 前端工程化

## 1、Vite 为什么更快
::: details 详情
Vite 相比传统构建工具（如 Webpack ）更快🚀，主要得益于以下几个核心特性：

**基于原生 ES 模块（ESM）**
- Vite 利用浏览器原生的 ES 模块，在开发模式下 **按需加载** 模块，避免了整体打包，从而减少了启动时间。
- 它通过只编译实际修改的文件，提升了开发过程中的反馈速度。

---

**高效的热模块替换（HMR）**
- Vite 在开发模式下利用原生 ES 模块实现模块级的热更新。
- 当文件发生变化时，Vite 只会重新加载发生变化的模块，而不是重新打包整个应用，极大提高了热更新的速度。

---

**使用 esbuild 进行快速编译**
- Vite 默认使用 esbuild 作为编译工具，相比传统的 JavaScript 编译工具（如 Babel、Terser），esbuild 提供显著的性能提升，能够快速完成代码转换和压缩，从而加速开发和构建过程。

---

**现代 JavaScript 特性支持**
- Vite 在生产环境中使用 Rollup 构建，支持优秀的树摇和代码拆分，有效减小构建体积。
- 同时，Vite 利用现代浏览器特性（如动态导入、ES2015+ 模块），减少了 polyfill 的使用，提升了加载速度。

---

**预构建和缓存**
- Vite 在开发时会预构建常用依赖（如 Vue、React），并将其转换为浏览器可执行的格式，避免每次启动时重新编译。
- 同时，Vite 会缓存这些预构建的依赖，并在启动时复用缓存，从而加快启动速度。

---
::: tip 局限性
- Vite 的开发模式依赖浏览器原生的 ES 模块加载，因此在不支持 ES 模块的旧版浏览器中需要额外的 polyfill。
- 对于非常复杂的项目，Vite 的 Rollup 构建可能需要更多的配置优化。
:::

## 2、Vite 中如何使用环境变量
::: details 详情
根据当前的代码环境变化的变量就叫做 **环境变量**。比如，在生产环境和开发环境将 BASE_URL 设置成不同的值，用来请求不同的环境的接口。

Vite内置了 `dotenv` 这个第三方库， dotenv 会自动读取 `.env` 文件， dotenv 从你的 **环境目录** 中的下列文件加载额外的环境变量：
> .env # 所有情况下都会加载 .env.[mode] # 只在指定模式下加载。

默认情况下
- `npm run dev` 会加载 `.env` 和 `.env.development` 内的配置。
- `npm run build` 会加载 `.env` 和 `.env.production` 内的配置。
- `mode` 可以通过命令行 `--mode` 选项来重写。 环境变量需以 `VITE_` 前缀定义，且通过 `import.meta.env` 访问。
```js
// .env.development
VITE_API_URL = 'http://localhost:3000'
// 代码中访问
console.log(import.meta.env.VITE_API_URL) // http://localhost:3000
```

多模式环境变量的加载优先级
- Vite 会根据当前模式加载对应的 `.env` 文件，加载顺序如下（后者会覆盖前者的同名变量）：
  1. `.env`
  2. `.env.local`
  3. `.env.[mode]`
  4. `.env.[mode].local`

注意
- 环境变量会被打包到前端代码中，因此不要将敏感信息（如 API 密钥、数据库密码）直接存储在 `.env` 文件中。
- 对于敏感信息，建议通过后端接口或其他安全方式获取。
:::

## 3、简述 Vite 的依赖预加载机制
::: details 详情
**什么是依赖预加载**
- Vite 的依赖预加载机制是为了优化开发环境下的模块加载性能。
- 在开发模式中，Vite 会对第三方依赖（如 `node_modules` 中的包）进行预构建，将其转换为浏览器可执行的 ES 模块格式。

---

**依赖预加载的核心原理**
- 使用 esbuild 进行预构建
  > - Vite 使用 `esbuild` 对第三方依赖进行预构建，速度比传统工具（如 Webpack）快 10-100 倍。
  > - 预构建的依赖会被存储在 `node_modules/.vite` 目录中，避免每次启动时重复构建。
- 将 CommonJS 和 UMD 转换为 ESM
  > - 如果依赖是 CommonJS 或 UMD 格式，Vite 会将其转换为 ESM 格式，以便浏览器直接加载。
- 合并模块
  > - 对于一些模块（如 `lodash-es`），Vite 会将其拆分为多个小模块并按需加载。
  > - 对于一些常用依赖（如 `react`、`vue`），Vite 会将其合并为一个模块，减少请求次数。
- 缓存机制
  > - 预构建的依赖会被缓存，只有当依赖的版本或配置发生变化时才会重新构建。

---

**依赖预加载的触发条件**
- 当你运行 `npm run dev` 时，Vite 会自动检查以下条件：
  > - 是否有新的依赖被安装。
  > - 是否有依赖的版本发生变化。
  > - 是否修改了 `vite.config.js` 中的相关配置（如 `optimizeDeps`）。

---

**依赖预加载的优点**
- 提升启动速度
  > - 通过预构建依赖，避免在开发模式下逐个解析和加载模块，显著提升启动速度。
- 优化模块加载
  > - 将非 ESM 格式的依赖转换为 ESM 格式，减少浏览器加载和解析的开销。
- 减少请求次数
  > - 合并模块后，减少了浏览器的 HTTP 请求次数。

---

**如何配置依赖预加载**
- Vite 提供了 `optimizeDeps` 配置项，用于控制依赖预加载的行为。
  ```js
  optimizeDeps: {
    include: ['lodash', 'axios'], // 强制预构建的依赖
    exclude: ['some-large-lib'], // 排除不需要预构建的依赖
  },
  ```

---

**注意事项**
- 动态导入的依赖
  > - 动态导入的依赖不会被自动预构建，需要手动添加到 `optimizeDeps.include` 中。
- 大型依赖
  > - 对于体积较大的依赖，可以通过 `exclude` 排除，避免影响启动速度。
:::

## 4、Vite 中如何加载、处理静态资源
::: details 详情
**静态资源目录（public 目录）**
- 静态资源可以放在 `public` 目录下，这些文件不会经过构建处理，直接按原样复制到输出目录。在开发时可以通过 `/` 路径直接访问，如 `/icon.png`。
- `public` 目录可通过 `vite.config.js` 中的 `publicDir` 配置项修改。

---

**资源引入**
- 图片、字体、视频：通过 `import` 引入，Vite 会自动将其处理为 URL 并生成带哈希值的文件名。在开发时，引用会是根路径（如 `/img.png`），在生产构建后会是如 `/assets/img.2d8efhg.png` 的路径。
- CSS、JS：CSS 会被自动注入到页面中，JS 按模块处理。

---

**强制作为 URL 引入**
- 通过 `?url` 后缀可以显式强制将某些资源作为 URL 引入。
  ```js
  import imgUrl from './img.png?url'
  ```

---

**new URL()**
- 通过 `import.meta.url` 可以动态构建资源的 URL，这对于一些动态路径很有用。
  ```js
  const imgUrl = new URL('./img.png', import.meta.url).href
  document.getElementById('hero-img').src = imgUrl
  ```
:::

## 5、Vite 中可做的项目优化有哪些
::: details 详情
**启用 Gzip/Brotli 压缩**
- 使用 `vite-plugin-compression` 插件开启 Gzip 或 Brotli 压缩，可以有效减小传输的文件体积，提升加载速度。

  安装依赖：
  ```bash
  npm install vite - plugin - compression--save - dev
  ```
  示例：
  ```js
  import compression from 'vite-plugin-compression'
  export default defineConfig({
    plugins: [
      compression({
        algorithm: 'gzip', // 或 'brotli' 压缩
        threshold: 10240, // 文件大于 10KB 时启用压缩
      }),
    ],
  })
  ```

---

**代码分割**
- 路由分割
  > - 使用动态导入实现按需加载，减小初始包的体积，提高页面加载速度。
  ```js
  const module = import('./module.js') // 动态导入
  ```
  > - 在路由中使用懒加载。
  ```js
  const MyComponent = () => import('./MyComponent.vue')
  ```
- 手动控制分包
  > - 配置 Rollup 的 `manualChunks` 选项来手动控制如何分割代码。这个策略适用于想要将特定的依赖或模块提取成单独的 `chunk` 文件。
  ```js
  import { defineConfig } from 'vite'
  export default defineConfig({
    build: {
      minify: false,
      // 在这里配置打包时的rollup配置
      rollupOptions: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
  })
  ```

---

**图片优化**
- 使用 `vite-plugin-imagemin` 插件对项目中的图片进行压缩，减少图片体积，提升加载速度。
  安装依赖：
  ```bash
  npm install vite - plugin - imagemin--save - dev
  ```
  示例：
  ```js
  export default defineConfig({
    plugins: [
      ViteImagemin({
        gifsicle: {
          optimizationLevel: 3,
        },
        optipng: {
          optimizationLevel: 7,
        },
        mozjpeg: {
          quality: 85,
        },
        pngquant: {
          quality: [0.65, 0.9],
        },
      }),
    ],
  })
  ```

---

---

**依赖优化**
- 配置 Vite 的 `optimizeDeps` 选项，提前预构建常用依赖，减少开发环境下的启动时间。
  ```js
  export default defineConfig({
    optimizeDeps: {
      include: ['lodash', 'vue', 'react'], // 预构建依赖
    },
  })
  ```
:::

## 6、Vite 中如何配置代理服务器
::: details 详情
在 Vite 中配置代理可以通过 `server.proxy` 选项来实现。以下是一个示例配置：
```js
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      // 代理 /api 请求到目标服务器
      '/api': {
        target: 'http://localhost:5000', // 目标服务器地址
        changeOrigin: true, // 修改请求头中的 Origin 字段为目标服务器的 origin
        secure: false, // 是否允许 HTTPS 请求
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写请求路径，将 /api 替换为空
      },

      // 代理某些静态资源请求
      '/assets': {
        target: 'http://cdn-server.com', // 目标是静态资源服务器
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/assets/, '/static'), // 将 /assets 路径重写为 /static
      },
    },
  },
})
```
:::

## 7、简述 Vite 插件开发流程
::: details 详情
Vite 插件开发基于 Rollup 插件系统，因此其生命周期和钩子与 Rollup 插件非常相似。以下是开发流程和关键步骤：

1️⃣ 插件生命周期钩子
- `config`：修改 Vite 配置，适用于动态配置。
- `configResolved`：在 Vite 配置解析完成后调用，适合需要基于最终配置进行操作的场景。
- `configureServer`：修改开发服务器行为，如添加中间件。
- `transform`：对模块内容进行转换，适用于文件类型转换或代码处理。
- `load`：自定义模块加载逻辑。
- `resolveId`：自定义模块解析逻辑。
- `buildStart` 和 `buildEnd`：构建开始和结束时触发，适用于日志记录或资源清理。
- `closeBundle`：在打包完成后触发，适合执行清理或后处理操作。

2️⃣ 插件基本结构
```js
export default function myVitePlugin() {
  return {
    name: 'vite-plugin-example', // 插件名称
    config(config) {
      // 修改 Vite 配置
    },
    configureServer(server) {
      // 修改开发服务器行为
    },
    transform(src, id) {
      // 对文件内容进行转换
    },
  }
}
```

3️⃣ 插件开发
- 在插件开发过程中，根据需求实现不同的钩子逻辑。例如，实现一个插件来自动注入环境变量或处理特定的文件类型：
```js
// 自动注入环境变量到代码中的插件
export default function injectEnvPlugin() {
  return {
    name: 'vite-plugin-inject-env',
    transform(src, id) {
      if (id.endsWith('.js')) {
        const envVars = Object.entries(process.env)
          .map(([key, value]) => `const ${key} = "${value}";`)
          .join('\n');
        return {
          code: `${envVars}\n${src}`,
          map: null,
        };
      }
    },
  };
}
```

4️⃣ 插件调试方法
- 使用 `console.log` 输出调试信息。
- 在 `transform` 或其他钩子中打印 `src` 和 `id`，查看文件内容和路径。
- 使用 `debug` 库。
  ```js
  import debug from 'debug';
  const log = debug('vite:plugin-example');
  log('This is a debug message');
  ```

5️⃣ 插件测试
  - 使用 `vitest` 或 `jest` 编写单元测试。
  ```js
  import { describe, it, expect } from 'vitest';
  import myVitePlugin from './my-vite-plugin';

  describe('myVitePlugin', () => {
    it('should transform code correctly', () => {
      const plugin = myVitePlugin();
      const result = plugin.transform('const a = 1;', 'example.js');
      expect(result.code).toContain('transformed code');
    });
  });
  ```

6️⃣ 插件使用
- 插件开发完成后，可以在 Vite 配置中使用：
```js
import transformFilePlugin from 'vite-plugin-transform-file'

export default {
  plugins: [transformFilePlugin()],
}
```

7️⃣ 发布插件
- 开发完成后，插件可以通过 npm 发布，或者将其托管在 GitHub 上，方便团队或社区使用。
:::

## 8、简述 Webpack 是什么以及作用
::: details 详情
Webpack 是一个开源的 **前端静态模块打包工具**，主要用于将现代 JavaScript 应用中的各种资源（代码、样式、图片等）转换为优化的静态文件。它是现代前端开发的核心工具之一，尤其在复杂项目中扮演着关键角色。

**Webpack 的核心作用**
- 模块化支持
  - 将代码拆分为多个模块（文件），管理依赖关系。
  - 支持语法
    - ES Modules ( `import/export` )。
    - CommonJS ( `require/module.exports` )。
    - AMD 等模块化方案。
- 资源整合
  - 处理非 JS 文件：将 CSS、图片、字体、JSON 等资源视为模块，统一管理。
  ```js
  // webpack.config.js
  module.exports = {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg)$/,
          type: 'asset/resource',
        },
      ],
    },
  }
  ```
- 代码优化
  - Tree Shaking：删除未使用的代码。
  - 代码分割（Code Splitting）：按需加载代码，减少首屏体积。
  - 压缩：减小文件体积，提升加载速度。
- 开发工具集成
  - 热更新（HMR）：实时预览代码修改效果。
  - Source Map：调试时映射压缩代码到源代码。
  - 本地服务器：快速启动开发环境。
- 生态扩展
  - Loader：处理特定类型文件（如 .scss → .css ）。
  - Plugin：优化构建流程（如生成 HTML、压缩代码）。

---

**Webpack 的工作流程**
- 入口（Entry）：从指定文件（如 index.js）开始分析依赖。
- 依赖图（Dependency Graph）：递归构建模块间的依赖关系。
- 加载器（Loaders）：转换非 JS 资源（如编译 Sass、处理图片）。
- 插件（Plugins）：在构建生命周期中执行优化任务。
- 输出（Output）：生成优化后的静态文件（如 bundle.js）。

---

**适用场景**
- 单页应用（SPA）：如 React、Vue、Angular 项目。
- 复杂前端工程：多页面、微前端架构。
- 静态网站生成：结合 Markdown、模板引擎使用。

---

**与其他工具对比**
|工具|定位|优点|缺点|
|----|-----|--------|--------|
|Webpack|通用构建工具|功能强大，生态丰富，适合复杂项目|配置复杂，构建速度较慢|
|Rollup|库打包工具|TreeShaking更激进，适合库开发|不适合大型应用|
|Vite|新一代构建工具|开发环境快，零配置，支持现代特性|生产环境依赖Rollup，生态不如Webpack|
|Gulp/Grunt|任务运行器|简单易用，适合小型项目|无模块化支持，功能有限|
:::

## 9、如何使用 Webpack 配置多环境的不同构建配置
::: details 详情
在 Webpack 中配置多环境（如开发环境、测试环境、生产环境）的构建配置，可以通过 环境变量注入 和 配置合并 的方式实现。

1️⃣ 安装依赖
```bash
npm install webpack-merge cross-env --save-dev
```
- `webpack-merge`：用于合并基础配置和环境专属配置。
- `cross-env`：跨平台设置环境变量（兼容 Windows 和 macOS/Linux）。

2️⃣ 创建配置文件结构
```
project/
├── config/
│   ├── webpack.common.js    # 公共配置
│   ├── webpack.dev.js       # 开发环境配置
│   └── webpack.prod.js      # 生产环境配置
├── src/
│   └── ...                  # 项目源码
└── package.json
```

3️⃣ 编写公共配置 ( `webpack.common.js` )
```js
// config/webpack.common.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
```

4️⃣ 编写环境专属配置
- 开发环境 ( `webpack.dev.js` )
```js
// config/webpack.dev.js
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    hot: true,
    open: true,
    port: 3000,
  },
  plugins: [
    // 注入环境变量（可在代码中通过 process.env.API_URL 访问）
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify('https://dev.api.com'),
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
})
```
- 生产环境 ( `webpack.prod.js` )
```js
// config/webpack.prod.js
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [
      '...', // 保留默认的 JS 压缩配置
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify('https://prod.api.com'),
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
})
```

5️⃣ 配置 `package.json` 脚本
```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=development webpack serve --config config/webpack.dev.js",
    "build:dev": "cross-env NODE_ENV=development webpack --config config/webpack.dev.js",
    "build:prod": "cross-env NODE_ENV=production webpack --config config/webpack.prod.js"
  }
}
```

6️⃣ 在代码中使用环境变量
```js
// src/index.js
console.log('当前环境:', process.env.NODE_ENV)
console.log('API 地址:', process.env.API_URL)

// 根据不同环境执行不同逻辑
if (process.env.NODE_ENV === 'development') {
  console.log('这是开发环境')
} else {
  console.log('这是生产环境')
}
```

7️⃣ 运行命令
```bash
# 启动开发服务器（热更新）
npm run start

# 构建开发环境产物
npm run build:dev

# 构建生产环境产物
npm run build:prod
```
:::

## 10、Webpack 的核心概念有哪些
::: details 详情
**入口（Entry）**
- 作用：定义 Webpack 构建依赖图的起点，通常为项目的主文件（如 index.js）。
```js
entry: './src/index.js', // 单入口
    entry: {
        app: './src/app.js',
        admin: './src/admin.js'
    }, // 多入口
```

---

**出口（Output）**
- 作用：指定打包后的资源输出位置和命名规则。
```js
output: {
    filename: '[name].bundle.js', // 输出文件名（[name] 为入口名称）
    path: path.resolve(__dirname, 'dist'), // 输出目录（绝对路径）
    clean: true, // 自动清理旧文件（Webpack 5+）
}
```

---

**加载器（Loaders）**
- 作用：让 Webpack 处理非 JavaScript 文件（如 CSS、图片、字体等），将其转换为有效模块。
```js
module: {
    rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, // 处理 CSS
        {
            test: /\.(png|svg)$/,
            type: 'asset/resource'
        }, // 处理图片（Webpack 5+）
    ],
}
```

---

**插件（Plugins）**
- 作用：扩展 Webpack 功能，干预整个构建流程（如生成 HTML、压缩代码、提取 CSS）。
```js
plugins: [
  new HtmlWebpackPlugin({
    template: './src/index.html',
  }), // 生成 HTML
  new MiniCssExtractPlugin(), // 提取 CSS 为独立文件
]
```

---

**模式（Mode）**
- 作用：预设优化策略，区分开发环境（development）和生产环境（production）。
```js
mode: 'production', // 启用代码压缩、Tree Shaking 等优化
```

---

**模块（Modules）**
- 作用：Webpack 将每个文件视为模块（如 JS、CSS、图片），通过依赖关系构建依赖图。
- 特点：支持 ESM、CommonJS、AMD 等模块化语法。

---

**代码分割（Code Splitting）**
- 作用：将代码拆分为多个文件（chunks），实现按需加载或并行加载，优化性能。
- 实现方式：
  - 动态导入（`import()`）
  - 配置 `optimization.splitChunks`

---

**Tree Shaking**
- 作用：通过静态分析移除未使用的代码，减小打包体积。
- 前提：使用 ES Module（ `import/export` ），并启用生产模式（`mode: 'production'`）。
:::

## 11、Webpack 中如何实现按需加载
::: details 详情
在 Webpack 中实现按需加载（代码分割/懒加载）的核心思路是 将代码拆分为独立 chunk，在需要时动态加载。

1️⃣ 基础方法
  > 动态导入（Dynamic Import） 通过 `import()` 语法实现按需加载，Webpack 会自动将其拆分为独立 chunk。
  - 代码中使用动态导入
  ```js
  // 示例：点击按钮后加载模块
  document.getElementById('btn').addEventListener('click', async () => {
    const module = await import('./module.js')
    module.doSomething()
  })
  ```
  - 配置 Webpack 确保 `webpack.config.js` 的 `output` 配置中包含 `chunkFilename` 
  ```js
  module.exports = {
    output: {
      filename: '[name].bundle.js',
      chunkFilename: '[name].[contenthash].chunk.js', // 动态导入的 chunk 命名规则
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/', // 确保 chunk 的公共路径正确
    },
  }
  ```

2️⃣ 框架集成
  > React/Vue 路由级按需加载 结合前端框架的路由系统实现组件级懒加载。
  - React 示例
  ```jsx
  import React, { Suspense, lazy } from 'react'
  import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

  const Home = lazy(() => import('./routes/Home'))
  const About = lazy(() => import('./routes/About'))

  function App() {
    return (
      <Router>
        <Suspense fallback={<div> Loading... </div>}>
          {' '}
          <Switch>
            <Route exact path="/" component={Home} />{' '}
            <Route
              path="/about
          "
              component={About}
            />{' '}
          </Switch>{' '}
        </Suspense>{' '}
      </Router>
    )
  }
  ```
  - Vue 示例
  ```js
  const routes = [
    {
      path: '/',
      component: () => import('./views/Home.vue'),
    },
    {
      path: '/about',
      component: () => import('./views/About.vue'),
    },
  ]
  ```

3️⃣ 优化配置
  > 代码分割策略 通过 `SplitChunksPlugin` 优化公共代码提取。
  ```js
  module.exports = {
    optimization: {
      splitChunks: {
        chunks: 'all', // 对所有模块进行分割（包括异步和非异步）
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors', // 提取 node_modules 代码为 vendors 块
            priority: 10, // 优先级
            reuseExistingChunk: true,
          },
          common: {
            minChunks: 2, // 被至少两个 chunk 引用的代码
            name: 'common',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      },
    },
  }
  ```

4️⃣ Babel 配置（如需支持旧浏览器）
  > 安装 Babel 插件解析动态导入语法
  ```bash
  npm install @babel/plugin-syntax-dynamic-import --save-dev
  ```
  > 在 `.babelrc` 或 `babel.config.json` 中添加插件
  ```json
  {
    "plugins": ["@babel/plugin-syntax-dynamic-import"]
  }
  ```

5️⃣ 预加载与预取（可选优化）
  > 通过注释提示浏览器提前加载资源（需结合框架使用）。
  > - 预加载是一种资源加载优化策略，允许浏览器在当前页面加载时，与父 `chunk` 并行加载指定的资源。
  > - 预取是一种资源加载优化策略，允许浏览器在空闲时间加载指定的资源。
  - React 示例
  ```js
  const About = lazy(
    () =>
      import(
        /* webpackPrefetch: true */ // 预取（空闲时加载）
        /* webpackPreload: true */ // 预加载（与父 chunk 并行加载）
        './routes/About'
      )
  )
  ```
  - Vue 示例
  ```js
  const routes = [
    {
      path: '/',
      component: () => import(/* webpackPrefetch: true */ './views/Home.vue'), // 预取
    },
    {
      path: '/about',
      component: () => import(/* webpackPreload: true */ './views/About.vue'), // 预加载
    },
  ];
  ```

6️⃣ 验证效果
- 构建产物分析
  - 运行 `npx webpack --profile --json=stats.json` 生成构建报告。
  - 使用 [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) 可视化分析 chunk 分布。
- 网络请求验证
  - 打开浏览器开发者工具，观察触发动态导入时是否加载新 chunk。
:::

## 12、Webpack 的构建流程
::: details 详情
Webpack 的构建流程是一个串行的流程，主要包含以下关键步骤：

1️⃣ 初始化配置
- 读取配置文件：Webpack 启动后，会读取项目根目录下的 `webpack.config.js` 或其他指定的配置文件，获取构建所需的各种配置信息，如入口、出口、加载器、插件等。
- 合并默认配置：将用户自定义的配置与 Webpack 的默认配置进行合并，生成最终的构建配置。

2️⃣  初始化编译环境
- 创建 Compiler 对象：Compiler 对象是 Webpack 的核心对象，负责整个编译过程的控制和管理，包含了所有 Webpack 配置信息。
- 创建 Compilation 对象：Compilation 对象代表了一次资源的构建过程，负责模块的构建、依赖的解析、代码的生成等具体工作。

3️⃣ 解析入口文件
- 确定入口模块：根据配置中的 `entry` 选项，找到项目的入口文件（如 `index.js`）。
- 构建依赖图：从入口文件开始，递归解析模块的依赖关系，使用 `require`、`import` 等语句找到所有依赖的模块，并将它们添加到依赖图中。

4️⃣ 加载模块
- 应用加载器：对于每个模块，Webpack 会根据配置中的 `module.rules` 规则，使用相应的加载器（Loaders）对模块进行转换。例如，使用 `babel-loader` 转换 ES6+ 代码，使用 `css-loader` 和 `style-loader` 处理 CSS 文件。
- 解析模块路径：Webpack 会根据模块的导入语句，解析模块的实际文件路径，并将其转换为绝对路径。

5️⃣ 转换和处理模块
- 代码转换：加载器对模块内容进行转换后，Webpack 会将转换后的代码解析为抽象语法树（AST），并对其进行进一步的处理，如 Tree Shaking、代码压缩等。
- 生成模块实例：处理完成后，Webpack 会为每个模块生成一个模块实例，包含模块的 ID、代码、依赖关系等信息。

6️⃣ 合并模块
- 生成 Chunk：Webpack 根据依赖图和配置中的代码分割规则，将相关的模块合并成一个或多个 Chunk。例如，入口模块和其直接依赖的模块会合并成一个主 Chunk，动态导入的模块会生成独立的 Chunk。
- 优化 Chunk：对生成的 Chunk 进行优化，如提取公共代码、压缩代码等，以减小打包体积。

7️⃣ 输出文件
- 生成最终代码：根据配置中的 `output` 选项，将 Chunk 转换为最终的文件内容，如 JavaScript 文件、CSS 文件等。
- 写入文件系统：将生成的文件写入到指定的输出目录中，完成整个构建过程。

8️⃣ 执行插件
- 生命周期钩子：在整个构建过程中，Webpack 会在不同的阶段触发相应的生命周期钩子，如 `compile`、`make`、`emit` 等。插件可以监听这些钩子，在特定的时机执行相应的操作，如生成 HTML 文件、压缩代码、清理输出目录等。

---

简单示例，以下是一个简单的 Webpack 构建流程示例：
```js
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
};
