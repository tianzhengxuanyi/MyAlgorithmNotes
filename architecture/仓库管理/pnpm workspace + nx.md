### 1. 安装 pnpm

```bash
npm install -g pnpm
```

### 2. 创建 pnpm workplace

目录结构
![目录结构](/asset/image/pnpm+nx目录结构.png)

2.1 新建 pnpm workplace 工作空间文件 pnpm-workspace.yaml ，具体如下:

```yaml
packages:
  # 会将packages下面归纳给到pnpm工作空间进行管理
  - "packages/*"
  - "examples/*"
  # 排除下面的目录
  - "!**/test/**"
```

2.2 子项目互相依赖的时候，可以通过 workplace: 协议去设置依赖，支持一下几种写法：

- “npm_name”: “workplace: \*” 所有版本都依赖本地工作空间
- “npm_name”: “workplace: npm_name@1.0.0” 指定版本写法
- “npm_name”: “workplace: ../npm_name” 相对路径写法

如项目中的 examples/vue 依赖 packages/vuts-table，packagejson 中的写法如下：

```json
"dependencies": {
  "vuts-table": "workplace:*"
}
```

**注意：** 在package.json中使用workplace:协议依赖时，需要在项目根目录下执行 pnpm install 命令，才能将依赖安装到本地。

### 3. 引入 nx，实现按序打包

全局安装和在项目根目录下安装 nx

```bash
pnpm install nx -g
# 项目nx初始化 注意目录不能已经安装nx或者有nx.json
npx nx@latest init
```

nx 在 monorepo 架构中里主要解决几个问题：

- 解决项目中互相依赖问题，就是构建顺序问题，其任务流有点像管道的概念
- 解决项目中打包缓存问题，比如：一些公共包没有多大变动，就不需要再次打包
- 提供一些快捷工具快速引入一个子项目或公共包

```json
// 项目根目录下的package.json
"scripts": {
  "build": "nx run-many --target=build", // 按顺序打包
  "dev": "nx run-many --target=dev", // 按顺序启动
  "lint": "nx run-many --target=lint", // 按顺序检查
  "serve": "cd ./examples/vue && pnpm run dev", // 启动子项目
  "test": "echo \"Error: no test specified\" && exit 1"
},
```

### 4. vuts-table配置rollup打包

```bash
pnpm install rollup rollup-plugin-vue -Dw
```

```js
// vuts-table/rollup.config.mjs
import vuePlugin from "rollup-plugin-vue";

export default {
  input: "index.ts",
  external: ["vue", "@tanstack/table-core"],
  plugins: [vuePlugin()],
  globals: {
    vue: "Vue",
  },
  output: {
    file: "./build/lib/index.mjs",
    format: "es",
  },
};
```

```json
// vuts-table/package.json
  "scripts": {
    "build": "rollup -c rollup.config.mjs",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```
