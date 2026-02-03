### 提升打包构建速度



|                 | webpack                                                      | vite                                                         |
| --------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Thead多线程     | loader中使用thread-loader，代码压缩使用terser-webpack-plugin | vite默认使用esbuild压缩代码（比terser快20-40 倍），所以无需使用terser多线程（`rollup-plugin-terser`的多线程模式（需安装 terser））。 |
| Cache缓存       | 对babel-loader和EsLintWebpackPlugin缓存                      | vite预构建的缓存在nodemodules/.vite，通过cacheDir配置缓存路径 |
| Include/Exclude | babel-loader和EsLintWebpackPlugin使用include/exclude排除不需要的文件如nodemoudles | - 预构建时使用optimizeDeps.exclude排除已经是esm的包，optimizeDeps.include强制预构建链接的包；      - 通过 `esbuild.include` 和 `esbuild.exclude` 对要处理的文件类型进行配置(**文件数量多 / 体积大**，且本身**已经是标准 ES5/ES6**，**不需要 TS/JSX 转译**) |
| OneOf           | 只能匹配上一个 loader, 剩下的就不匹配了(vue-loader不支持oneOf) | -                                                            |
|                 |                                                              |                                                              |

#### Thead多线程

- **webpack**

```javascript
const os = require("os");
// ...
const TerserPlugin = require("terser-webpack-plugin");

// cpu核数
const threads = os.cpus().length;

module.exports = {
  //...
  module: {
    rules: [
      {
        oneOf: [
          // ...
          {
            test: /\.js$/,
            // exclude: /node_modules/, // 排除node_modules代码不编译
            include: path.resolve(__dirname, "../src"), // 也可以用包含
            use: [
              {
                loader: "thread-loader", // 开启多进程
                options: {
                  workers: threads, // 数量
                },
              },
              {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true, // 开启babel编译缓存
                },
              },
            ],
          },
        ],
      },
    ],
  },
  plugins: [
	// ...
  ],
  optimization: {
    minimize: true,
    minimizer: [
      // css压缩也可以写到optimization.minimizer里面，效果一样的
      new CssMinimizerPlugin(),
      // 当生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
      new TerserPlugin({
        parallel: threads // 开启多进程
      })
    ],
  },
  // ...
};
```

- **vite**

  
  
 ```javascript
 import { terser } from 'rollup-plugin-terser'
 
 export default defineConfig({
     build: {
         minify: 'terser', // boolean | 'terser' | 'esbuild'  默认为'esbuild'
         terserOptions: {
             parallel: true // 多线程压缩
         }
     }
 })
 ```

  #### cache缓存

  ```javascript
  // ...
  
  module.exports = {
    entry: "./src/main.js",
    output: {
  	// ...
    },
    module: {
      rules: [
        {
          oneOf: [
            // ...  
            {
              test: /\.js$/,
              // exclude: /node_modules/, // 排除node_modules代码不编译
              include: path.resolve(__dirname, "../src"), // 也可以用包含
              loader: "babel-loader",
              options: {
                cacheDirectory: true, // 开启babel编译缓存
                cacheCompression: false, // 缓存文件不要压缩
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new ESLintWebpackPlugin({
        // 指定检查文件的根目录
        context: path.resolve(__dirname, "../src"),
        exclude: "node_modules", // 默认值
        cache: true, // 开启缓存
        // 缓存目录
        cacheLocation: path.resolve(
          __dirname,
          "../node_modules/.cache/.eslintcache"
        ),
      }),
    	// ...  
    ],
    // ...
  };
  ```

#### Exclude/Include

- **webpack**

```javascript
// ...
module.exports = {
  entry: "./src/main.js",
  output: {
	// ...
  },
  module: {
    rules: [
      {
        oneOf: [
          // ...
          {
            test: /\.js$/,
            // exclude: /node_modules/, // 排除node_modules代码不编译
            include: path.resolve(__dirname, "../src"), // 也可以用包含
            loader: "babel-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new ESLintWebpackPlugin({
      // 指定检查文件的根目录
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules", // 默认值
    }),
    // ...
  ],
  // ...
};
```

- **vite**

```javascript
export default defineConfig({
  esbuild: {
    include: /src/.*.(ts|js|vue)$/, // 只处理src目录下的指定文件
    exclude: /node_modules/
  },
  optimizeDeps: {
    exclude: ['esm-dep'],
    include: ['esm-dep > cjs-dep', 'my-lib/components/**/*.vue'],
  },
})
```

#### Oneof

- **webpack**

```javascript
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    // ...
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            // 用来匹配 .css 结尾的文件
            test: /\.css$/,
            // use 数组里面 Loader 执行顺序是从右到左
            use: ["style-loader", "css-loader"],
          },
          {
            test: /\.less$/,
            use: ["style-loader", "css-loader", "less-loader"],
          },
          {
            test: /\.s[ac]ss$/,
            use: ["style-loader", "css-loader", "sass-loader"],
          },
          {
            test: /\.styl$/,
            use: ["style-loader", "css-loader", "stylus-loader"],
          },
          // ...
        ],
      },
    ],
  },
  plugins: [
    // ...
  ],
  //...
};
```

### 打包体积优化

|                 | webpack                                                      | vite                                            |
| --------------- | ------------------------------------------------------------ | ----------------------------------------------- |
| Tree Shaking    | 默认开启                                                     | 默认开启                                        |
| 按需import      | 对 UI 库使用按需导入；对于菜单使用按需加载                   | 对 UI 库使用按需导入；对于菜单使用按需加载      |
| 代码分割        |                                                              | build.rollupOptions.output.manualChunks拆分代码 |
| Babel           | Babel 为编译的每个文件都插入了辅助代码，使代码体积过大！禁用了 Babel 自动对每个文件的 runtime 注入，而是引入 `@babel/plugin-transform-runtime` 并且使所有辅助代码从这里引用。 | -                                               |
| Image Minimizer | `image-minimizer-webpack-plugin`: 用来压缩图片的插件         | 使用`vite-plugin-imagemin`处理图片              |
| css压缩         | CssMinimizerPlugin                                           | 默认使用esbuild压缩css（build.minify）          |
| js压缩          | 生产模式会默认开启TerserPlugin                               | 默认使用esbuild压缩js（build.minify）           |
| gzip压缩        | 使用`compression-webpack-plugin`生成压缩文件                 | 使用`vite-plugin-compression`生成压缩文件       |
| 定位体积问题    | webpack-bundle-analyzer                                      | 可视化工具：rollup-plugin-visualizer            |
|                 |                                                              |                                                 |

#### 代码分割

- ##### **webpack**

```javascript
// webpack.prod.js
// ...

module.exports = {
  entry: "./src/main.js",
  output: {
    // ...
  },
  module: {
    rules: [
      // ...
    ],
  },
  plugins: [
    // ...
  ],
  optimization: {
    // ...
    // 代码分割配置
    splitChunks: {
      chunks: "all", // 对所有模块都进行分割
      // 其他内容用默认配置即可
      // 以下是默认值
      // minSize: 20000, // 分割代码最小的大小
      // minRemainingSize: 0, // 类似于minSize，最后确保提取的文件大小不能为0
      // minChunks: 1, // 至少被引用的次数，满足条件才会代码分割
      // maxAsyncRequests: 30, // 按需加载时并行加载的文件的最大数量
      // maxInitialRequests: 30, // 入口js文件最大并行请求数量
      // enforceSizeThreshold: 50000, // 超过50kb一定会单独打包（此时会忽略minRemainingSize、maxAsyncRequests、maxInitialRequests）
      // cacheGroups: { // 组，哪些模块要打包到一个组
      //   defaultVendors: { // 组名
      //     test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
      //     priority: -10, // 权重（越大越高）
      //     reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
      //   },
      //   default: { // 其他没有写的配置会使用上面的默认值
      //     minChunks: 2, // 这里的minChunks权重更大
      //     priority: -20,
      //     reuseExistingChunk: true,
      //   },
      // },
    },
  },
  // ...
};
```

- ##### **vite**

  ###### 生产构建阶段：Rollup 原生拆分规则

  ###### 规则 1：入口文件作为独立 chunk

  - 项目的入口文件（如 `src/main.js`）会被打包成独立的 `index-[hash].js`（或对应入口名），作为主 chunk；
  - 如果配置了多入口（`build.rollupOptions.input`），每个入口都会生成独立的主 chunk。

  ###### 规则 2：动态导入（`import()`）自动拆分为独立 chunk

  这是最核心的默认拆分逻辑！只要你在代码中使用 `import()` 做懒加载（比如路由懒加载），Vite 会自动将动态导入的模块拆成单独的 chunk：

  ```javascript
  // 示例：Vue Router 路由懒加载
  const Home = () => import('@/views/home.vue'); // 自动拆分为 `home-[hash].js`
  const About = () => import('@/views/about.vue'); // 自动拆分为 `about-[hash].js`
  ```

  - 动态导入的模块会生成独立 chunk，首屏只加载主 chunk，懒加载模块在触发时才加载；
  - 如果多个动态导入共享同一个子模块，该子模块会被提取为**公共 chunk**（比如两个页面都导入 `src/utils/request.js`，则 `request.js` 会被拆成独立 chunk）。

  ###### 规则 3：公共依赖自动提取为共享 chunk

  在 Vite 生产构建时（基于 Rollup），**被至少两个不同的「顶级 chunk」引用、且体积超过最小阈值** 的公共依赖模块，会被自动提取为独立的共享 chunk；反之则会内联到引用它的 chunk 中。

  - 比如动态导入的两个组件 `home.vue` 和 `about.vue` 都导入了 `src/utils/common.js`，则 `common.js` 会被拆成 `common-[hash].js`；
  - 预构建后的第三方依赖（如 `react`）如果被多个 chunk 引用，也会被提取为独立的 `vendor-[hash].js`。

  这里的关键前提：

  1. **顶级 chunk**：指入口 chunk（如 `index.js`）或动态导入生成的 chunk（如 `home.js`、`about.js`），而非嵌套的子模块；
  2. **静态导入**：仅针对 `import xxx from 'xxx'` 静态导入的模块，动态导入 `import()` 的模块本身就是独立 chunk，其内部公共依赖按上述规则处理。

  ###### 	规则4：自动CSS 分割代码 
  Vite 实现了自动 CSS 代码分割的能力，即实现一个 chunk 对应一个 css 文件，而按需加载的 chunk，也对应单独的一份 js 和 css 文件，这样做也能提升 CSS 文件的缓存复用率。（build.cssCodeSplit默认为true，设为false整个项目中的所有 CSS 将被提取到一个 CSS 文件中。）

##### 手动拆分

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // 拆分代码块
        manualChunks: {
          // 拆分vue相关依赖打包为单独chunk
          vue: ['vue', 'vue-router', 'pinia'],
          // 拆分工具库
          utils: ['lodash-es', 'date-fns'],
          // 拆分UI组件库
          ui: ['element-plus']
        },
        // 函数形式 
        // manualChunks(id) {
        //    if (id.includes('node_modules')) {
        //        return 'vendor'; // 如果函数返回字符串，那么该模块及其所有依赖将被添加到以返回字符串命名的自定义 chunk 中
        //    }
        //
        //    return null;
        }
      }
    }
  }
})
```



#### Babel

- **webpack**

```bash
npm i @babel/plugin-transform-runtime -D
```

```javascript
// ...

module.exports = {
  entry: "./src/main.js",
  output: {
	// ...
  },
  module: {
    rules: [
      {
        oneOf: [
          // ...
          {
            test: /\.js$/,
            // exclude: /node_modules/, // 排除node_modules代码不编译
            include: path.resolve(__dirname, "../src"), // 也可以用包含
            use: [
              {
                loader: "thread-loader", // 开启多进程
                options: {
                  workers: threads, // 数量
                },
              },
              {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true, // 开启babel编译缓存
                  cacheCompression: false, // 缓存文件不要压缩
                  plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积
                },
              },
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    // ...
  ],
  optimization: {
    // ...
  ],
  // ...
};
```

#### Image Minimizer

- **webpack**

1. 下载包



```text
npm i image-minimizer-webpack-plugin imagemin -D
```

还有剩下包需要下载，有两种模式：

- 无损压缩



```text
npm install imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo -D
```

- 有损压缩



```text
npm install imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant imagemin-svgo -D
```

2. 配置

我们以无损压缩配置为例：

```javascript
// ...
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
	// ...
  },
  module: {
    rules: [
      		// ...
        ],
      },
    ],
  },
  plugins: [
    // ...
  ],
  optimization: {
    minimizer: [
	  // ...
      // 压缩图片
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },
  // ...
};
```

- **vite**

```javascript
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    viteImagemin({
      gifsicle: { quality: 80 }, // gif压缩
      optipng: { optimizationLevel: 2 }, // png压缩
      mozjpeg: { quality: 80 }, // jpg压缩
      pngquant: { quality: [0.6, 0.8] }
    })
  ]
})
```

#### css压缩

- **webpack**

```javascript
// ...
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 提取css为单独的文件
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); // 压缩css

module.exports = {
  entry: "./src/main.js",
  output: { //...
  },
  module: {
    rules: [
      // ...
    ],
  },
  plugins: [
    // 提取css成单独文件
    new MiniCssExtractPlugin({
      // 定义输出文件名和目录
      filename: "static/css/main.css",
    }),
    // ...
  ],
  optimization: {
    minimizer: [
      // css压缩也可以写到optimization.minimizer里面，效果一样的
      new CssMinimizerPlugin(),
      // 当生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
      new TerserPlugin({
        parallel: threads, // 开启多进程
      }),
      // ...
    ],
  },
  // ...
};
```

####  gzip压缩

- **webpack**

```javascript
const CompressionPlugin = require('compression-webpack-plugin');
module.exports = {
 plugins: [
   new CompressionPlugin({
     filename: '[path][base].gz', // 输出的压缩文件名
     algorithm: 'gzip', // 使用 gzip 算法
     test: /\.(js|css|html|svg)$/, // 匹配需要压缩的文件类型
     threshold: 10240, // 文件大于 10KB 时才进行压缩
     minRatio: 0.8, // 压缩比小于 0.8 时才进行压缩
     deleteOriginalAssets: false // 是否删除原始文件，建议保留以防止兼容问题
   })
 ]
};
```

- **vite**

```javascript
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    compression({
      algorithm: 'gzip', // 可选brotliCompress
      threshold: 10240, // 大于10kb的文件才压缩
      deleteOriginFile: false // 不删除原文件
    })
  ]
})
```

#### 定位体积问题

- **webpack**

```javascript
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
module.exports = {
 plugins: [
   new BundleAnalyzerPlugin({
     analyzerMode: 'server', // 或 'static'
     analyzerPort: 8888,
     openAnalyzer: true,
     defaultSizes: 'parsed',
     compressionAlgorithm: 'gzip'
   })
 ]
};
```

- **vite**

```javascript
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    // 打包后生成stats.html分析报告
    visualizer({
      filename: './node_modules/.cache/visualizer/stats.html',
      open: true, // 自动打开报告
      gzipSize: true, // 显示gzip压缩后的大小
      brotliSize: true // 显示brotli压缩后的大小
    })
  ]
})

```

