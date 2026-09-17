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