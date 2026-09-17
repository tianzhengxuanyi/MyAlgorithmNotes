# Vite 自定义插件知识点总结
学习 Vite 自定义插件，核心是理解其**基于 Rollup 的钩子（Hook）系统**，并掌握 Vite 为此扩展的**独有钩子**。插件本质是一个包含特定生命周期钩子的对象，通过这些钩子在构建流程中注入自定义逻辑。

## 🧱 插件的基本结构
插件一般写成**工厂函数**，返回包含 `name` 和各类钩子的对象，支持传参配置；`name` 为必填，用于日志、冲突识别。
可选属性：
- `enforce`：控制插件执行顺序，可选 `pre` / `post`
- `apply`：限定插件生效环境，可选 `serve` / `build`

```javascript
// my-vite-plugin.js
export default function myVitePlugin(options = {}) {
  return {
    name: 'vite-plugin-my-plugin', // 必需，插件名称
    enforce: 'pre', // 可选，控制执行顺序：'pre' | 'post'
    apply: 'serve', // 可选，指定运行环境：'serve' | 'build' | 'client' | 'server'
    // 在此添加各个生命周期钩子...
  }
}
```

## ⚙️ 核心钩子（Hooks）详解
钩子分为两大类：**通用钩子（继承Rollup，dev+build均可使用）**、**Vite独有钩子**。
> 通用钩子执行主线：`resolveId → load → transform`

### 通用钩子（模块处理管道）
| 钩子 | 调用时机 | 常见用途 |
| :--- | :--- | :--- |
| `resolveId` | 解析模块导入路径时 | 自定义路径解析，**创建虚拟模块** |
| `load` | 加载模块内容时 | 返回模块代码，与 `resolveId` 配合实现虚拟模块 |
| `transform` | 转换模块内容时 | 修改源码（如移除 `console`、编译自定义语法） |
| `buildStart` | 构建开始时 | 初始化操作（仅build阶段） |
| `generateBundle` | 产物生成前 | 修改/增删打包产物文件（仅build阶段） |
| `closeBundle` | 构建/服务关闭时 | 资源清理工作 |

### Vite 独有钩子（开发服务器、HTML、配置、HMR）
| 钩子 | 调用时机 | 常见用途 |
| :--- | :--- | :--- |
| `config` | 解析Vite配置**之前** | 修改/补充vite配置，返回部分配置对象 |
| `configResolved` | 配置解析**完成后** | 读取最终完整配置，区分serve/build环境 |
| `configureServer` | 创建Dev Server时 | 注册Koa中间件、Mock接口，仅开发环境 |
| `transformIndexHtml` | 处理index.html | 向html注入script、meta标签 |
| `handleHotUpdate` | 文件变更触发HMR | 自定义热更新逻辑，控制哪些模块刷新，仅开发环境 |

## 🔗 插件执行顺序（enforce）
插件执行顺序由 `enforce` + `plugins` 数组顺序共同决定：
1. `enforce: 'pre'`：在Vite核心插件**之前**执行，适合预处理逻辑
2. normal（默认无enforce）：标准流程
3. `enforce: 'post'`：在Vite核心插件**之后**执行，适合后置处理

> 同级别下，按 `plugins` 数组书写顺序依次执行。

## 💡 实战示例
### 1. 内联插件（快速原型，写在vite.config里）
适合简单需求，不用单独抽离文件
```javascript
// vite.config.js
export default {
  plugins: [
    {
      name: 'vite-plugin-remove-console',
      transform(code, id) {
        if (id.endsWith('.js')) {
          return code.replace(/console\.log\(.*?\)/g, '')
        }
      }
    }
  ]
}
```

### 2. 虚拟模块（高频考点）
`resolveId` + `load` 配合；虚拟id前缀 `\0` 是Rollup约定，用来区分真实文件，防止循环解析
```javascript
// virtual-module-plugin.js
export default function virtualModulePlugin() {
  const virtualModuleId = 'virtual:my-module'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  return {
    name: 'vite-plugin-virtual-module',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export const msg = "Hello from virtual module!"`
      }
    }
  }
}
```

### 3. configureServer 注册中间件，Mock接口
```javascript
// mock-server-plugin.js
export default function mockServerPlugin() {
  return {
    name: 'vite-plugin-mock-server',
    configureServer(server) {
      server.middlewares.use('/api/user', (req, res, next) => {
        res.end(JSON.stringify({ name: 'Vite User' }))
      })
    }
  }
}
```

## 🛠️ 插件调试 & 开发规范
1. **vite-plugin-inspect**：官方推荐调试插件，启动后访问 `/__inspect/`，可视化查看每个模块经过插件转换后的中间代码，排查钩子转换问题。
2. 命名规范：自定义插件建议前缀 `vite-plugin-`，package.json 添加关键词 `vite-plugin`。
3. 钩子注意：钩子函数不要使用箭头函数，否则丢失插件上下文 `this`；transform会遍历所有模块，需要加id判断避免无效处理。

## 自定义修改unplugin-vue-components 插件

### 问题描述

模块联邦项目中，平台组件和element-plus组件混用，如果平台弹窗组件中使用element-plus的select组件会导致select的选择框被弹窗遮盖。排查发现是两个z-index管理不是一套，即存在两个element-plus实例。

模块联邦中将element-plus作为shared共享，并指定版本号，远程模块和主模块版本号保持了一致，且远程模块设置了import: false。但是远程模块还是将element-plus打包进代码中。

### 问题定位

分析打包后发现，远程模块将element-plus打包进es-xxx的文件中。使用vite-plugin-inspect插件发现是unplugin-vue-components插件导致的。unplugin-vue-components插件会从element-plus/es中导入组件，而不是从element-plus中导入。

### 自定插件解决
# unplugin-vue-components/vite 中 `Components` 配置详解

> 
> 一句话回答你的问题：**`resolvers` 就是组件解析器，用来告诉插件「遇到某个组件标签时，该从哪个包/路径自动导入这个组件」，可以是官方内置解析器，也可以自己写自定义解析逻辑**，和 Vite 插件的 `resolveId` 模块解析思路很像，但它是**专门针对Vue组件自动导入**的解析器。

## 核心参数说明（你截图里的配置）

```
Components({
  dts: false,
  resolvers: [
    ...createElementPlusShareResolvers(),
    createJhPlatformResolver()
  ]
})
```

### 1. `dts`

- 作用：**是否自动生成 `components.d.ts` 类型声明文件**，给 Volar/TS 提供自动导入组件的类型提示。
- `dts: false`：关闭类型文件生成；
- `dts: true`：默认值（安装TS时自动开启），会在项目根目录生成 `components.d.ts`；
- 也可以传字符串：`dts: 'src/types/components.d.ts'` 指定输出路径。

### 2. `resolvers: ComponentResolver[]` ✅（你重点问的）

**resolver：组件解析器**，数组，可以配置多个。

> 
> 插件默认逻辑：扫描 `dirs` 目录下的本地vue组件自动导入；
> **resolvers 用来处理【第三方UI库/自定义组件库】的组件自动导入**。

#### 工作原理

当模板里写 `<el-button>`，插件拿到组件名 `ElButton`，遍历数组里的resolver：

1. 解析器判断这个组件名是否属于自己管理的组件库
2. 返回 `{ name: 组件名, from: 包路径, sideEffects?: 样式文件路径 }`
3. 插件在编译阶段**自动注入import代码**，实现免手动导入、按需引入组件+样式

```
<!-- 你写模板 -->
<el-button>按钮</el-button>

<!-- 插件编译后自动追加 -->
import { ElButton } from 'element-plus'
import 'element-plus/es/components/button/style/css'
```

#### 两种Resolver

1. **内置解析器**：`ElementPlusResolver`、`AntDesignVueResolver`、`VantResolver`，你截图里的 `createElementPlusShareResolvers()` 就是ElementPlus的解析器，用来自动导入ElementPlus组件。
2. **自定义Resolver**：`createJhPlatformResolver()` 就是你项目里**自己封装的组件库解析器**，用于自动导入内部业务组件库JhPlatform。

#### 手写最简自定义resolver示例

```
Components({
  resolvers: [
    // 自定义解析器，匹配 My 开头组件，从 @/my-components 导入
    (componentName) => {
      if(componentName.startsWith('My')) {
        return {
          name: componentName,
          from: '@/my-components'
        }
      }
    }
  ]
})
```

## 其他常用配置补充

| 参数 | 作用 |
| --- | --- |
| `dirs` | 扫描本地组件目录，默认 `['src/components']`，自动导入项目内写的vue组件 |
| `extensions` | 识别的组件后缀，默认 `['vue']` |
| `deep` | 是否递归扫描子目录，默认true |

## 🔗 和Vite插件钩子的关联（结合你前面Vite插件知识点）

`unplugin-vue-components` 底层是 **unplugin**，同时兼容Vite/Webpack，底层在Vite里就是Vite插件，内部就是靠：

- `transform` 钩子解析vue模板，提取模板内组件标签
- `resolvers` 就是插件内部**自定义组件解析逻辑**，本质是在transform阶段做组件名→模块路径的映射，和 `resolveId` 模块解析概念类似，但它封装成了更上层的组件自动导入能力。

## 区分两个容易混淆概念

- `resolvers`（unplugin-vue-components）：**组件名解析**，模板标签 → import语句，用于自动导入组件
- Vite插件 `resolveId`：**模块路径解析**，`import xxx from 'xxx'` 中的路径id解析

## 你截图里的代码含义

```
resolvers: [
  ...createElementPlusShareResolvers(), // ElementPlus官方组件解析器，自动导入el-xxx组件
  createJhPlatformResolver() // 项目自定义解析器：自动导入JhPlatform内部业务组件
]
```

模板直接写 `<el-button>`、`<jh-table>`，不用写import，插件自动按需引入组件和样式。

如果你需要，我可以给你写一个完整可运行的 `createJhPlatformResolver` 自定义解析器源码。