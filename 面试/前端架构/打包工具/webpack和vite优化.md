### 提升打包构建速度



|             | webpack                                                      | vite                                                         |
| ----------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Thead多线程 | loader中使用thread-loader，代码压缩使用terser-webpack-plugin | vite默认使用esbuild压缩代码（比terser快20-40 倍），所以无需使用terser多线程（`rollup-plugin-terser`的多线程模式（需安装 terser））。 |
| Cache缓存   | 对babel-loader和EsLintWebpackPlugin缓存                      | vite预构建的缓存在nodemodules/.vite，通过cacheDir配置        |
|             |                                                              |                                                              |
|             |                                                              |                                                              |
|             |                                                              |                                                              |

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