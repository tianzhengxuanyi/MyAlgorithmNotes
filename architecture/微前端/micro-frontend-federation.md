# 微前端 + 模块联邦方案详细梳理

## 一、整体架构

平台采用 **Module Federation** 实现微前端架构，基于 `@originjs/vite-plugin-federation`，将系统拆分为 **1 个主应用 + 6 个子应用**，各子应用独立开发、独立部署、运行时动态加载。

### 1.1 应用拓扑

| 应用 | federation name | 职责 | 暴露内容 |
|------|----------------|------|---------|
| **main**（主应用） | `jhict_app` | 壳应用，路由调度、权限控制 | init-platform、permission、store、language、custom-component 等 |
| **public**（公共子系统） | `system-app` | 布局、路由、全局状态、样式 | layout、router、store/modules、plugins、style |
| **platform-pages**（平台页面） | `system-app` | 系统管理页面（菜单、用户、字典等） | 各业务页面模块 |
| **common-visualcode**（BI 子系统） | `bi-app` | 数据可视化/BI 报表页面 | BI 相关页面 |
| **components-core**（低代码子系统） | `lowcode-app` | 低代码设计器与组件 | 低代码设计器页面 |
| **ag-grid**（表格子系统） | `agGrid-app` | 高级表格业务模块 | ag-grid 相关页面 |
| **biz-doc-trace**（文档追踪子系统） | `agGrid-app` | 文档追踪业务 | 文档追踪页面 |

### 1.2 目录结构

```
lowcode/
├── packages/
│   ├── main/                    # 主应用（壳应用）
│   │   ├── src/
│   │   │   ├── util/system.ts   # 远程组件加载核心
│   │   │   ├── store/permission.ts  # 路由动态注册
│   │   │   └── main-core.ts     # 主入口
│   │   └── vite/plugins/
│   │       ├── index.ts         # Federation 配置
│   │       ├── shared/index.ts  # 暴露模块配置
│   │       └── full-import.ts   # 开发环境源码替换
│   │
│   ├── public/                  # 公共子系统
│   │   ├── src/
│   │   │   ├── layout/          # 布局组件
│   │   │   ├── router/          # 路由配置
│   │   │   └── store/modules/   # 全局状态
│   │   └── vite/
│   │       ├── index.ts         # Federation 配置
│   │       └── shared/          # 暴露模块配置
│   │
│   ├── platform-pages/          # 系统管理子系统
│   │   ├── src/views/           # 业务页面
│   │   └── vite/index.ts        # Federation 配置
│   │
│   ├── common/common-visualcode/ # BI 子系统
│   │   ├── src/                 # BI 页面
│   │   └── vite/index.ts
│   │
│   ├── common/common-lowcode/components-core/  # 低代码子系统
│   │   └── vite/index.ts
│   │
│   ├── common/business-modules/
│   │   ├── ag-grid/             # 表格子系统
│   │   └── biz-doc-trace/       # 文档追踪子系统
│   │
│   └── common/vite-plugin/common-vite-plugin/  # 自定义 Vite 插件
│       └── src/
│           ├── increase-pack/   # 增量构建
│           │   ├── federation-option.ts
│           │   └── pack-change-analyzer.ts
│           ├── micro-version/   # 版本文件生成
│           └── cn-tw-converter/ # 简繁转换
```

---

## 二、远程模块依赖关系

### 2.1 主应用消费的远程模块

**配置位置：** `packages/main/vite/plugins/index.ts`

```typescript
const remotes = {
  main: `${"" || webUrl}/assets/remoteEntry.js`,
  bi: `${"" || webUrl}/sub/bi/assets/remoteEntry.js`,
  app: `${"" || webUrl}/sub/app/assets/remoteEntry.js`,
  public: `${webUrl}/sub/public/assets/remoteEntry.js`,
  "biz-doc-trace": `${webUrl}/sub/biz-doc-trace/assets/remoteEntry.js`,
  systemApp: `${webUrl}/sub/systemApp/assets/remoteEntry.js`,
};

vitePlugins.push(
  federation({
    name: "jhict_app",
    remotes,
    exposes: {
      ...getSharedComponents()
    },
    shared: {
      vue: {},
      "@smallwei/avue": {},
      pinia: {},
      "vue-router": {},
      "@jhlc/common-core": {},
      "element-plus": {},
      "@vueuse/core": {},
      "@antv/x6": { import: false },
      "@antv/x6-vue-shape": {},
    }
  })
);
```

### 2.2 共享依赖策略

| 依赖 | 共享策略 | 说明 |
|------|---------|------|
| `vue` | `{}` | 单例共享，版本协商 |
| `pinia` | `{}` | 状态管理共享 |
| `vue-router` | `{}` | 路由共享 |
| `element-plus` | `{}` | UI 组件库共享 |
| `@jhlc/common-core` | `{}` | 内部公共库共享 |
| `@vueuse/core` | `{}` | Vue 工具库共享 |
| `@antv/x6` | `{ import: false }` | 图编辑库，不自动导入 |
| `@antv/x6-vue-shape` | `{}` | X6 Vue 集成共享 |

### 2.3 子应用暴露模块示例

**public 子系统暴露内容：** `packages/public/vite/shared/components.ts`

```typescript
export const getPublicComponentShared = function () {
  const ret: Record<string, string> = {
    "./init-main/index.ts": "./src/init-main/index.ts",
    "./layout/index.vue": "./src/layout/index.vue",
    "./router/index.ts": "./src/router/index.ts",
    "./store/modules/app.ts": "./src/store/modules/app.ts",
    "./store/modules/locales.ts": "./src/store/modules/locales.ts",
    "./store/modules/settings.ts": "./src/store/modules/settings.ts",
    "./plugins/index.ts": "./src/plugins/index.ts",
    "./public/style/index.vue": "./src/views/style/index.vue"
  };
  return ret;
};
```

**main 主应用暴露内容：** `packages/main/vite/plugins/shared/index.ts`

```typescript
export const getSharedComponents = function() {
  let ret = {
    "./init-platform": "./src/views/init-platform/index.ts",
    "./permission.ts": "./src/permission.ts",
    "./plugins/index.ts": "./src/plugins/index.ts",
    "./store/index.ts": "./src/store/index.ts",
    "./language/index.ts": "./src/language/index.ts",
    "./custom-component": "./src/views/lowcode/custom-component.ts",
    "./clone-component.ts": "./src/views/lowcode/clone-component.ts",
  };
  return ret || {};
};
```

---

## 三、运行时远程组件加载机制

### 3.1 核心实现

**位置：** `packages/main/src/util/system.ts` 和 `packages/public/src/util/system.ts`

底层 API 来自 `virtual:__federation__` 虚拟模块：

```typescript
import {
  __federation_method_setRemote,
  __federation_method_getRemote,
  __federation_method_unwrapDefault
} from "virtual:__federation__";
```

### 3.2 组件加载流程

```
┌─────────────────────────────────────────────────────────────┐
│                    doFetchAsyncComponent                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  开发环境 (env.isBuild = false)                              │
│  ├─→ 直接 import 本地模块（通过 pages-dev.ts 映射）          │
│  └─→ 加载样式模块 ./{module}/style/index.vue                │
│                                                              │
│  生产环境 (env.isBuild = true)                               │
│  ├─→ ① readVersion(module)                                   │
│  │      动态加载 /sub/{module}/version.js                    │
│  │      获取 window.{module}_entry 入口文件名                │
│  │                                                            │
│  ├─→ ② getEntry(module)                                      │
│  │      构建完整 URL: /sub/{module}/assets/{filename}?v=xxx │
│  │                                                            │
│  ├─→ ③ federation_method_setRemote(module, { url, format }) │
│  │      注册远程模块                                          │
│  │                                                            │
│  ├─→ ④ federation_method_getRemote(module, path)            │
│  │      获取远程组件包装对象                                  │
│  │                                                            │
│  ├─→ ⑤ federation_method_unwrapDefault(moduleWrapped)       │
│  │      解包获取默认导出                                      │
│  │                                                            │
│  └─→ 返回组件                                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 关键代码

```typescript
const doFetchAsyncComponent = async function(
  module: string,
  path: string,
  isRemote?: boolean
): Promise<any> {
  if (!module || !path) {
    return Promise.resolve(null);
  }
  const env = getEnv();

  // 开发环境 → 直接加载本地模块
  if (!env.isBuild && isRemote !== true) {
    const component = getViewPage(module, path);
    return component().then(res => res?.default);
  }

  // 生产环境 → 远程加载
  if (!remoteFetchFlag[module] && module) {
    await readVersion(module);
    await getEntry(module).then(url => {
      federation_method_setRemote(module, {
        url: () => Promise.resolve(url),
        format: "esm",
        from: "vite"
      });
    });
    remoteFetchFlag[module] = true;
  }

  return new Promise((resolve) => {
    // 20秒超时降级
    setTimeout(() => {
      resolve({
        render() {
          return "程序更新中，请稍后再打开！";
        }
      });
    }, 20000);

    federation_method_getRemote(module, path)
      .then(moduleWrapped => federation_method_unwrapDefault(moduleWrapped))
      .then(m => {
        if (m) resolve(m);
      })
      .catch(() => {
        // 失败重试
        updateRemoteAndFetch(module, path).then(m => resolve(m));
      });
  });
};
```

### 3.4 版本检测与热更新

**版本文件生成：** 构建时生成 `version.js`

```javascript
// Auto-generated version file
window.systemApp_entry = "remoteEntry.js";
window.systemApp_vd = "2.3.0";
window.systemApp_packEndTime = "2026-6-15_10:30:00";
window.systemApp_pageNum = "1";
```

**运行时读取版本：**

```typescript
const readVersion = function(module: string) {
  return new Promise(async resolve => {
    const script = document.createElement("script");
    script.src = `/sub/${module}/version.js?v=${new Date().getTime()}`;
    script.async = true;
    script.onload = () => resolve("执行成功");
    script.onerror = () => resolve("执行失败");
    document.body.append(script);
  });
};
```

**入口文件获取：**

```typescript
const getEntry = function(module: string) {
  return new Promise(resolve => {
    let filename = window[`${module}_entry`] || "remoteEntry.js";
    resolve(`/sub/${module}/assets/${filename}?v=${new Date().getTime()}`);
  });
};
```

### 3.5 容错与重试机制

```typescript
const updateRemoteAndFetch = function(module: string, path: string) {
  return new Promise(async (resolve) => {
    await readVersion(module);
    getEntry(module).then(url => {
      federation_method_setRemote(module, {
        url: () => Promise.resolve(url),
        format: "esm",
        from: "vite"
      });
      federation_method_getRemote(module, path)
        .then(moduleWrapped => federation_method_unwrapDefault(moduleWrapped))
        .then(m => resolve(m));
    });
  });
};
```

### 3.6 子系统探测

```typescript
export const hasModule = function(module: string) {
  return new Promise(async resolve => {
    // 优先读取系统配置
    const sub = envConfig().getSystemConfig?.subSystems?.find(
      item => item.name === module
    );
    if (sub) {
      return resolve(!!sub.enabled);
    }

    // 尝试请求 version.js
    try {
      const res = await axios.get(`/sub/${module}/version.js`);
      if (!res.data.startsWith("// Auto-generated ")) {
        return resolve(false);
      }
      resolve(true);
    } catch {
      resolve(false);
    }
  });
};
```

---

## 四、路由级动态加载

### 4.1 路由组件懒加载

**位置：** `packages/main/src/store/permission.ts`

```typescript
const loadView = function(view: string, meta: any, componentName: string) {
  return () => {
    // 低代码页面 → 加载 cloneComponent
    if (meta.pageId) {
      return new Promise(resolve => {
        pageView().then(res => {
          const m = res.default();
          m.name = componentName;
          resolve(m);
        });
      });
    }

    // 远程模块 → lowcodeEnv.loadComponent
    return lowcodeEnv().loadComponent(view).then(m => {
      return resolveRouterComp(m, componentName, view);
    });
  };
};
```

### 4.2 模块识别逻辑

**位置：** `packages/common/common-core/src/store/lowcode-env.ts`

```typescript
getModule(rawView: string) {
  let module = rawView.split("/")[0];
  
  // base/ 前缀 → systemApp
  if (rawView.startsWith("base/")) {
    return "systemApp";
  }
  
  // 特殊模块映射
  const systemApps = ["ag-grid", "public"];
  if (systemApps.includes(module)) {
    return module;
  }
  
  // 简单系统模式
  if (this.singleAppName) {
    return this.singleAppName;
  }
  
  return module;
}

loadComponent(rawView: string) {
  let module = this.getModule(rawView);
  const env = envConfig().getEnv();
  
  if (module) {
    if (env.isBuild || (env.module !== module)) {
      // 远程加载
      return this.fetchRemoteComponent(module, "./" + rawView);
    } else {
      // 本地加载
      return this.fetchComponent(module, "./" + rawView);
    }
  }
}
```

---

## 五、增量构建优化

### 5.1 整体流程

```
┌─────────────────────────────────────────────────────────────┐
│                    增量构建流程                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ① 从后端 API 获取上次打包记录                               │
│     GET /code/codeFrontPackModule/getById?id={module}       │
│     → { items: [{name, code, module}], createDateTime }     │
│                                                              │
│  ② 执行 git log 获取变更文件                                 │
│     git log --since="{lastPackTime}" --name-only --oneline  │
│                                                              │
│  ③ 过滤出 /src/ 目录下的变更文件                             │
│     .ts, .vue, .js, .tsx, .json                             │
│                                                              │
│  ④ 调用 analyzer-dep.mjs 依赖分析器                         │
│     计算受影响的 expose 模块                                 │
│                                                              │
│  ⑤ 仅打包变更模块                                            │
│     未变更模块从历史记录追加                                  │
│                                                              │
│  ⑥ 合并后写入后端 API 持久化                                 │
│     POST /code/codeFrontPackModule/save                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 核心实现

**位置：** `packages/common/vite-plugin/common-vite-plugin/src/increase-pack/`

#### federation-option.ts

```typescript
export const federationIncreaseOption = async function(option, exposes, filename) {
  // 查询上次打包模块
  const lastPackInfo = await axios.get(
    option.webApi + "/code/codeFrontPackModule/getById?id=" + option.module
  ).then(res => res.data.data);

  const lastModules = lastPackInfo?.items || [];

  if (option.buildFullFlag == "0") {
    console.log("开始做增量打包...");
    await filterPackModules(exposes, lastPackInfo.createDateTime);
  }

  return {
    // 当前打包模块收集器
    currentModulesGetter: (data) => {
      currentModules = data;
      // 计算需要追加的历史模块
      lastModules.forEach(last => {
        if (!currentModules.find(i => i.id == last.name)) {
          addition.push({ id: last.name, code: last.code });
        }
      });
    },
    
    // 追加历史模块代码
    additionalModule: () => {
      if (addition?.length) {
        return addition.map(i => i.code).join("\n");
      }
      return null;
    },
    
    // 打包完成后持久化
    bundledModulesGetter: data => {
      let allModules = [...currentModules, ...addition];
      axios.post(option.webApi + "/code/codeFrontPackModule/save", {
        module: option.module,
        entryName: filename,
        items: allModules.map(i => ({
          name: i.id,
          code: i.code,
          module: option.module
        }))
      });
    }
  };
};
```

#### pack-change-analyzer.ts

```typescript
export const filterPackModules = function(exposes, lastPackTime) {
  if (!lastPackTime) return exposes;

  const date = new Date(lastPackTime);
  date.setHours(date.getHours() - 1);
  lastPackTime = date.toLocaleString().replace(/\//g, "-");

  return new Promise(resolve => {
    // 获取 git 变更文件
    exec(`git log --since="${lastPackTime}" --name-only --oneline`, (error, stdout) => {
      const types = [".ts", ".vue", "js", ".tsx", ".json"];
      const lines = stdout.split("\n")
        .filter(i => i.includes("/src/") && types.find(s => i.endsWith(s)));

      // 写入变更文件列表
      fs.writeFileSync("./vite/script/changed-files.json", JSON.stringify({
        sources: Object.values(exposes),
        changes: lines.map(line => line.split("/src/")[1])
      }));

      // 调用依赖分析器
      exec(`node ./node_modules/@jhlc/common-vite-plugin/exports/analyzer-dep.mjs`, (error, stdout) => {
        const ret = JSON.parse(stdout.split("--out--")[1]);
        
        // 过滤未变更模块
        Object.keys(exposes).forEach(key => {
          if (!ret.includes(exposes[key])) {
            delete exposes[key];
          }
        });
        
        resolve(exposes);
      });
    });
  });
};
```

### 5.3 构建参数说明

| 参数 | 说明 |
|------|------|
| `buildFullFlag == "0"` | 增量打包模式 |
| `buildFullFlag != "0"` | 全量打包模式 |
| `module` | 当前构建的子系统标识 |
| `webApi` | 后端 API 地址 |

---

## 六、开发环境模块源码替换

### 6.1 目的

开发环境下将远程模块引用替换为本地源码路径，实现跨子系统 HMR 热更新。

### 6.2 实现位置

**位置：** `packages/main/vite/plugins/full-import.ts`

### 6.3 替换规则

```typescript
transform(code, id) {
  if (option.isLocal) {
    // systemApp/xxx → @jhlc/platform-pages/src/views/xxx
    if (code.includes(`import("systemApp/`) || code.includes(`from "systemApp/`)) {
      const list = getSharedComponents();
      list.forEach(item => {
        code = code.replace(
          new RegExp(`import\\("systemApp/${item.name}"\\)`, "g"),
          `import("${item.value}")`
        );
        code = code.replace(
          new RegExp(`from "systemApp/${item.name}"`, "g"),
          `from "${item.value}"`
        );
      });
    }

    // public/xxx → @jhlc/public/src/xxx
    if (code.includes(`from "public/`) || code.includes(`import("public/`)) {
      const list = ["init-main/index.ts", "layout/index.vue", "router/index.ts"];
      list.forEach(item => {
        code = code.replace(
          new RegExp(`from "public/${item}"`, "g"),
          `from "@jhlc/public/src/${item}"`
        );
      });
    }

    // bi/xxx → @jhlc/common-visualcode/src/xxx
    if (code.includes(`import("bi/`) || code.includes(`from "bi/`)) {
      const list = getBiComponents();
      list.forEach(item => {
        code = code.replace(
          new RegExp(`import\\("bi/${item.name}"\\)`, "g"),
          `import("${item.value}")`
        );
      });
    }
  }
  return code;
}
```

### 6.4 代码检查

防止主应用直接引用子应用源码路径：

```typescript
function checkCode(code: string, id: string) {
  if (id.includes("main/src") && !id.includes("main/src/views/init-platform/")) {
    const list = [
      `@jhlc/components/src`,
      `@jhlc/components-runtime/src`,
      `@jhlc/renderer-core/src`,
      `@jhlc/designer/src`,
      `@jhlc/platform-pages/src`,
    ];
    const r = list.find(i => code.indexOf(i) >= 0);
    if (r) {
      throw new Error("error," + r + ",in " + id);
    }
  }
}
```

---

## 七、版本文件生成

### 7.1 实现位置

**位置：** `packages/common/vite-plugin/common-vite-plugin/src/micro-version/index.ts`

### 7.2 生成逻辑

```typescript
export const getMicroVersionContent = function(version, module, filename, pageNum) {
  const t = new Date();
  const now = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() 
    + "_" + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
  
  return `// Auto-generated version file
window.${module || "main"}_entry = "${filename}";
window.${module || "main"}_vd = "${version}";
window.${module || "main"}_packEndTime = "${now}";
window.${module || "main"}_pageNum = "${pageNum}";
`;
};
```

### 7.3 构建钩子

各子应用 vite 配置中通过 `closeBundle` 钩子生成：

```typescript
{
  name: 'generate-version-file',
  closeBundle() {
    const content = CommonVitePlugin.getMicroVersionContent(
      getVersion(), 
      "systemApp", 
      "remoteEntry.js", 
      1
    );
    fs.writeFileSync(path.resolve(__dirname, '../dist', 'version.js'), content);
  }
}
```

---

## 八、繁体中文转换

### 8.1 目的

构建后对产物进行简体中文 → 繁体中文转换，生成 `-tw.js` 副本用于台湾地区部署。

### 8.2 实现位置

**位置：** `packages/common/vite-plugin/common-vite-plugin/src/cn-tw-converter/index.ts`

### 8.3 核心逻辑

```typescript
import * as OpenCC from "opencc-js";

export const convertCn2Tw = (dir) => {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.resolve(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      convertCn2Tw(filePath);  // 递归处理
    } else {
      // 排除共享依赖文件
      const ignore = [
        "_vue-router", "x6.", "x6-vue-shape.",
        "_shared_vue.", "_commonjsHelpers.",
        "_element-plus.", "_shared_pinia."
      ];
      
      if (!file.endsWith('.js') && file !== "index.html") return;
      if (file.endsWith("-tw.js")) return;
      
      let content = fs.readFileSync(filePath, 'utf-8');
      let twFile = file.replace('.js', '-tw.js');
      
      // 包含中文内容时进行转换
      if (!ignore.find(i => file.includes(i)) && /[\u4e00-\u9fa5]/.test(content)) {
        const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
        content = converter(content);
      }
      
      // 替换引用路径
      content = content.replace(/-(1\d{12})\.js/g, '-$1-tw.js');
      content = content.replace(/version\.js/g, 'version-tw.js');
      content = content.replace(/remoteEntry\.js/g, 'remoteEntry-tw.js');
      
      fs.writeFileSync(path.resolve(dir, twFile), content);
    }
  });
};
```

### 8.4 转换范围

| 转换内容 | 说明 |
|---------|------|
| 业务代码 | 包含中文字符的 `.js` 文件 |
| 入口文件 | `index.html` → `index-tw.html` |
| 引用路径 | 自动替换为 `-tw` 后缀 |

---

## 九、关键技术点总结

### 9.1 技术栈

| 技术 | 版本/说明 |
|------|----------|
| Module Federation 插件 | `@originjs/vite-plugin-federation@1.4.1-jh.1`（定制版） |
| top-level-await 插件 | `vite-plugin-top-level-await@1.6.0-prod.1` |
| 简繁转换 | `opencc-js@1.0.5` |
| 构建工具 | Vite 4.4.9 |
| 共享依赖 | Vue 3.2.25、Pinia 2.0.14、Element Plus 2.2.6 |

### 9.2 核心能力

1. **运行时动态加载** - 子应用独立部署，按需加载远程组件
2. **版本检测与热更新** - 通过 version.js 实现子应用独立更新
3. **增量构建** - Git diff + 依赖分析，仅打包变更模块
4. **开发环境 HMR** - 远程模块引用替换为本地源码
5. **容错机制** - 失败重试、超时降级、子系统探测
6. **多语言支持** - 简繁体中文产物自动转换

---

## 十、简历提炼版

**微前端 + 模块联邦架构升级**

- 基于 Module Federation（@originjs/vite-plugin-federation 定制版）实现 1 主 + 6 子微前端架构，各子系统独立开发、独立部署、运行时按需加载
- 设计运行时远程组件加载机制，支持版本检测、动态更新 remote entry、失败重试与超时降级，子应用独立发布无需全量上线
- 开发自定义 Vite 插件实现增量构建：通过 git diff 识别变更文件 + 依赖分析器计算影响范围，仅重新打包变更模块，未变更模块从历史记录追加，构建耗时显著降低
- 开发环境通过 Vite transform 钩子将远程模块引用替换为本地源码，实现跨子系统 HMR 热更新
- 构建后自动生成版本文件（version.js）用于运行时版本检测与入口发现；基于 opencc-js 实现简繁体中文产物自动转换