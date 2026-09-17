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

这个插件解决了一个关键问题：让 Element Plus 的自动导入能够被模块联邦正确共享。

核心问题
// unplugin-vue-components 默认生成的代码
import { ElButton } from "element-plus/es";

// 模块联邦 shared 配置
shared: {
  "element-plus": { ... }  // 只匹配 "element-plus"，不匹配 "element-plus/es"
}
问题：element-plus/es 和 element-plus 是不同的 specifier，federation 无法识别并共享。

解决方案：两层拦截
┌─────────────────────────────────────────────────────────────────┐
│                    Element Plus 共享处理流程                     │
├─────────────────────────────────────────────────────────────────┤
│  源码：<el-button>                                               │
│         ↓                                                        │
│  unplugin-vue-components 解析                                    │
│         ↓                                                        │
│  [第一层] Resolver 拦截                                          │
│  from: "element-plus/es" → "element-plus"                       │
│         ↓                                                        │
│  生成 import { ElButton } from "element-plus"                   │
│         ↓                                                        │
│  [第二层] Transform 拦截手写代码                                 │
│  "element-plus/es" → "element-plus"                             │
│         ↓                                                        │
│  Federation 识别为 shared，改写成 importShared                   │
└─────────────────────────────────────────────────────────────────┘
第一层：Resolver 拦截（自动导入）
// element-plus-share.ts 第 23-36 行
export function createElementPlusShareResolvers() {
  const resolvers = ElementPlusResolver({ importStyle: false });
  
  return list.map(resolver => {
    // 包装原始 resolver
    return async (name: string) => {
      const result = await resolver(name);
      // result.from = "element-plus/es" 
      //    ↓ 改写
      // result.from = "element-plus"
      return toSharedElementPlusFrom(result);
    };
  });
}
示例转换
// 原始 resolver 返回
{
  from: "element-plus/es",
  name: "ElButton"
}

// toSharedElementPlusFrom 改写后
{
  from: "element-plus",  // 改成包名
  name: "ElButton"
}
在构建链中使用
// sub-remote-plugins.ts 第 40-45 行
Components({
  dts: false,
  resolvers: [
    ...createElementPlusShareResolvers(),  // 注入包装后的 resolver
    createJhPlatformResolver()
  ]
})
第二层：Transform 拦截（手写代码）
开发者可能手写导入语句：

// 手写的代码
import { ElMessage } from "element-plus/es";

// 这个不会走 Components resolver，需要 transform 拦截
// element-plus-share.ts 第 41-58 行
export function createElementPlusSharedSpecifierPlugin(): PluginOption {
  return {
    name: "jh4j-element-plus-shared-specifier",
    enforce: "post",  // 在其他 transform 之后执行
    transform(code, id) {
      // 跳过 node_modules
      if (id.includes("node_modules")) {
        return null;
      }
      
      // 快速检测：无相关字符串则跳过
      if (!code.includes("element-plus/es") && 
          !code.includes("element-plus/lib")) {
        return null;
      }
      
      // 正则替换
      // "element-plus/es" → "element-plus"
      // 'element-plus/lib' → 'element-plus'
      return {
        code: code.replace(
          /(["'])element-plus\/(?:es|lib)\1/g,
          "$1element-plus$1"
        ),
        map: null
      };
    }
  };
}
正则解释
/(["'])element-plus\/(?:es|lib)\1/g

// 匹配：
// "element-plus/es"  ✓
// 'element-plus/lib' ✓
// `element-plus/es`  ✗ (不匹配模板字符串)

// \1 是反向引用，确保引号配对
// "element-plus/es'  ✗ (引号不配对)
插件顺序要求
// sub-remote-plugins.ts 第 49-68 行
return [
  // ... 其他插件
  
  Components({ resolvers: [...createElementPlusShareResolvers()] }),
  
  createSubRemoteSharedCommonCorePlugin(),
  createFederationDuplicateRemoteImportCheckPlugin(),
  createElementPlusSharedSpecifierPlugin(),  // 必须在 federation 之前
  
  federation({
    shared: {
      "element-plus": { ... }  // 现在能正确匹配了
    }
  }),
];
为什么必须在 federation 之前？

federation 插件在 enforce: "post" 阶段扫描 import 语句
如果先执行 federation，element-plus/es 已经被识别为普通依赖
必须先改写成 element-plus，federation 才能识别为 shared
完整数据流示例
┌──────────────────────────────────────────────────────────────┐
│ 源码                                                          │
├──────────────────────────────────────────────────────────────┤
│ <template>                                                    │
│   <el-button>提交</el-button>                                │
│ </template>                                                   │
│ <script setup>                                                │
│ import { ElMessage } from "element-plus/es";                 │
│ </script>                                                     │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ Components 插件处理（自动导入）                               │
├──────────────────────────────────────────────────────────────┤
│ Resolver 解析 <el-button>                                    │
│   原始结果: { from: "element-plus/es", name: "ElButton" }   │
│   改写后: { from: "element-plus", name: "ElButton" }        │
│   生成: import { ElButton } from "element-plus";            │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ SharedSpecifier 插件处理（手写导入）                         │
├──────────────────────────────────────────────────────────────┤
│ 检测到: "element-plus/es"                                    │
│ 替换为: "element-plus"                                       │
│ 结果: import { ElMessage } from "element-plus";             │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ Federation 插件处理                                           │
├──────────────────────────────────────────────────────────────┤
│ 识别 import { ElButton } from "element-plus";               │
│ 匹配 shared 配置中的 "element-plus"                          │
│ 改写为: const { ElButton } = await importShared("element-plus");│
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ 运行时                                                        │
├──────────────────────────────────────────────────────────────┤
│ 从宿主 share scope 获取共享的 element-plus 实例              │
│ 所有子模块使用同一份 Element Plus，避免重复加载              │
└──────────────────────────────────────────────────────────────┘
关键设计点
设计点	实现方式
统一 specifier	element-plus/es 和 element-plus/lib 都改成 element-plus
自动导入处理	包装 ElementPlusResolver，改写 resolve 结果的 from 字段
手写代码处理	Transform 阶段正则替换 import 语句
性能优化	快速检测字符串，跳过不相关文件
插件顺序	enforce: "post" 但在 federation 之前执行
这套机制确保 Element Plus 能够被正确共享，无论通过自动导入还是手写导入，最终都会被 federation 识别并从宿主获取。