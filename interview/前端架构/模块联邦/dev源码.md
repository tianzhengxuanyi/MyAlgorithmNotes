以下是模块联邦 dev 开发走本地 monorepo 源码的完整流程梳理，按「构建期注入 → 运行期映射 → 路由构建 → 组件加载分流 → init-main 初始化 → 远程回退」的顺序展开。

在开发环境采用‘本地源码优先，远程联邦兜底’的策略。通过构建期注入静态映射表，运行期在组件加载的唯一单点做分流，实现了本地 monorepo 源码与远程联邦模块的无缝互换。

具体分为四个关键步骤：

1. 构建期静态注入（零运行时成本）：
仅在 development 模式下，通过 Vite 插件扫描 monorepo，生成以 moduleName:exposePath 为键、源码绝对路径为值的映射表。然后通过 Vite 的 define 将 __LOCAL_DEBUG_MODULES__ 编译进产物。生产环境注入空对象，保证逻辑自动降级。

2. 运行期桥接到 Vite Dev Server：
将映射表转化为运行时 Loader，核心代码是 import(/* @vite-ignore */ '/@fs/' + 绝对路径)。/@fs/ 让浏览器请求落到 Vite Dev Server，由它按需编译 .vue/.ts 源码，天然获得 HMR 和源码级报错。

3. 路由层解耦与统一坐标：
common-core 的路由注册只认 moduleName + componentPath 两级坐标，完全不感知本地还是远程。组件加载器由 main 应用通过依赖注入的方式挂载到菜单路由上。

4. 单点分流与生命周期对齐：
分流逻辑收敛在 system.ts 的 fetchComponent 中。条件满足 isPublicLocal && localLoader 存在 时走 /@fs/，否则走远程 remoteEntry.js。同时，在加载任何组件前，都会先执行 ensureSubModuleInitialized 跑一遍 init-main，确保动态路由注册在本地和远程双通道下行为完全一致。

## 一、构建期（vite.config.ts）：生成映射表并注入全局常量

入口在 main 的 vite 配置。仅当 `mode === "development"` 时才生成映射表，生产构建直接注入空对象：

```79:95:packages/main/vite.config.ts
  const localDebugModules =
    mode === "development"
      ? getLocalDebugModules({
          resolvePath
        })
      : {};
  const localDebugPageLists = mode === "development" ? getLocalDebugPageLists() : {};

  return {
    define: {
      __DEV__: JSON.stringify(isDevCommand),
      __LOCAL_DEBUG_MODULES__: JSON.stringify(localDebugModules),
      __LOCAL_DEBUG_PAGE_LISTS__: JSON.stringify(localDebugPageLists)
    },
```

映射表的键是 `"<moduleName>:<modulePath>"`，值是 monorepo 内**源码文件的绝对路径**，由 `getLocalDebugModules` 聚合四个来源：

```49:139:packages/main/vite/plugins/shared/local-debug-modules.ts
function getPublicLocalDebugModules(
  options: MainLocalDebugModuleOptions
): Record<string, string> {
  const exposes = getPublicSharedExposes({
    resolvePath: (...segments) => options.resolvePath("../public", ...segments)
  });

  return Object.fromEntries(
    Object.entries(exposes).map(([exposeName, sourcePath]) => [
      `public:${exposeName}`,
      sourcePath
    ])
  );
}
// ... 中间省略 components / jh-grid / 业务子模块的同构转换 ...

export function getLocalDebugModules(
  options: MainLocalDebugModuleOptions
): Record<string, string> {
  return {
    ...getComponentsLocalDebugModules(options),
    ...getJhGridLocalDebugModules(options),
    ...getPublicLocalDebugModules(options),
    ...getBusinessSubLocalDebugModules(options),
  };
}
```

四类来源的规则各不相同：

- **public / components**：直接复用各包自己的 federation exposes 清单（`getPublicSharedExposes` / `getComponentsSharedExposes`），加上 `public:` / `components:` 前缀。这保证了本地联调的映射键与远程 `remoteEntry.js` 暴露的模块 ID 完全同构，是“本地源码与远程联邦可无缝互换”的关键。
- **业务子模块**（flow/hrms/oams/store/system/lowcode）：走统一的路径约定——每模块固定登记一条 `init-main` 加上各页面的 `./<pageName>`，页面清单来自各包的 `getXxxPages()`：

```80:97:packages/main/vite/plugins/shared/local-debug-modules.ts
function getSubModulePageLocalDebugModules(
  moduleName: string,
  pages: SubModulePageDefinition[],
  options: MainLocalDebugModuleOptions
): Record<string, string> {
  return {
    // 模块首次使用前加载样式与插件初始化
    [`${moduleName}:./init-main/index.ts`]: options.resolvePath(
      `../sub/${moduleName}/src/init-main/index.ts`
    ),
    ...Object.fromEntries(
      pages.map((page) => [
        `${moduleName}:./${page.name}`,
        options.resolvePath(`../sub/${moduleName}/src/views/${page.name}`)
      ])
    )
  };
}
```

- **jh-grid**：单独处理，因为它用的是 exposes 清单而非页面清单。

新增业务模块由 `scripts/init-sub.mjs` 在 `// init-sub:imports` / `// init-sub:pages` 标记处自动追加，不需要手工维护。

与此同时，`server.fs.allow: [packageRoot]` 允许 Vite dev server 通过 `/@fs/` 直接伺服 monorepo 根下任意包的源码；`resolve.alias` 把 `@jh4j/*` 全部指到各包 `src` 源码。这两条是 `/@fs/` 动态导入能被实时编译的前提。

## 二、运行期：映射表编译成动态 import loader

`__LOCAL_DEBUG_MODULES__` 在 `local-module-loaders.ts` 里被转成运行时 loader 表——这是构建期（静态路径字符串）与运行期（动态 import）之间的桥梁：

```8:22:packages/main/src/util/local-module-loaders.ts
/** 本地源码联调映射表；开发环境下注入绝对路径，生产构建默认为空对象。 */
const localDebugModulePaths = __LOCAL_DEBUG_MODULES__;

/** 将本地源码路径转换为运行时 loader，统一复用 /@fs + vite-ignore 调试口径。 */
export const localModuleLoaders: Record<string, LocalModuleLoader> =
  Object.fromEntries(
    Object.entries(localDebugModulePaths).map(([moduleKey, sourcePath]) => [
      moduleKey,
      () =>
        import(
          /* @vite-ignore */
          `/@fs/${sourcePath}`
        )
    ])
  ) as Record<string, LocalModuleLoader>;
```

要点：`/* @vite-ignore */` 阻止 Vite 对这个动态 import 做静态分析（路径是运行期变量），`/@fs/` 前缀让浏览器请求落到 Vite dev server，由它按需编译对应的 `.vue`/`.ts` 源码——因此本地联调天然获得 HMR 与源码级报错。两个查询函数对外提供：

```23:40:packages/main/src/util/local-module-loaders.ts
export function getLocalModuleLoader(
  moduleName: string,
  modulePath: string
): LocalModuleLoader | undefined {
  return localModuleLoaders[`${moduleName}:${modulePath}`];
}

export function hasLocalDebugModule(moduleName: string): boolean {
  const prefix = `${moduleName}:`;
  return Object.keys(localModuleLoaders).some(moduleKey => moduleKey.startsWith(prefix));
}
```

`hasLocalDebugModule` 在生产构建下恒为 `false`（映射表为空），从而让后续的模块探测逻辑在生产自动走远程。

## 三、路由侧入口（router-register.ts）：把远程组件加载器挂到菜单路由上

菜单驱动的动态路由由 `router-register.ts` 构建。`buildRoutes` / `buildCurrentRoute` 产出“根菜单布局路由 + 叶子页面路由”两级结构，叶子路由的 component 不直接写死，而是通过 `getKeepAliveComponentLoader()` 拿到 main 注入的组件加载器：

```641:651:packages/common/common-core/src/store/router-register.ts
      const componentModuleName = this.resolveComponentModuleName(rootModuleName, String(item.component ?? ""));
      const componentPath = this.normalizeComponentPath(componentModuleName, String(item.component ?? ""));
      return {
        path: childPath,
        name: item.id,
        component: getKeepAliveComponentLoader()(componentModuleName, componentPath, item.id),
        meta: {
          ...baseMeta,
          moduleName: componentModuleName
        }
      };
```

`getKeepAliveComponentLoader` 是从 `envConfig()` 上解耦取的（common-core 不直接依赖 main），由 main 在启动时把自己的 `fetchKeepAliveWrappedAsyncComponent` 塞进去，最终落到 `system.ts` 的 `defineRemoteAsyncComponent` → `fetchComponent`。 компонент名取菜单 `item.id`，保证 KeepAlive 按菜单 id 稳定命中缓存。注意 common-core 只知道 `moduleName + modulePath` 两级坐标，**完全不感知“本地还是远程”**——分流全部收敛在 main 的 `fetchComponent` 里。

## 四、组件加载分流（system.ts fetchComponent）：本地优先、远程兜底

整个方案的核心决策点就这一处：

```347:366:packages/main/src/util/system.ts
/** 本地联调环境优先走源码加载，其他环境回退到远程模块联邦加载。 */
export async function fetchComponent<T = Component>(
  moduleName: string,
  modulePath: string
): Promise<T> {
  if (!isInitMainModulePath(modulePath)) {
    await ensureSubModuleInitialized(moduleName);
  }

  const runtimeEnv = envConfig().getEnv as {
    isPublicLocal?: boolean;
  };
  const localLoader = getLocalModuleLoader(moduleName, modulePath);

  if (runtimeEnv.isPublicLocal && localLoader) {
    return unwrapRemoteModule<T>(await localLoader());
  }

  return fetchRemoteComponent<T>(moduleName, modulePath);
}
```

分流的三个条件缺一不可：

1. `isPublicLocal` —— 来自 `envConfig`，默认值是 `!isBuild`（见 `env-config.ts:230` 的 `isPublicLocal: Boolean(runtimeOption.isPublicLocal ?? !isBuild)`），即 dev 环境下为真、生产构建为假；
2. `localLoader` 存在 —— 即构建期映射表里登记过这个 `moduleName:modulePath`；
3. 二者同时满足才走 `/@fs/` 源码导入，否则回退到 `fetchRemoteComponent` 的模块联邦链路（拉 `remoteEntry.js` → `container.init(sharedScope)` → `container.get(exposeId)` → 解包 default 导出，失败清缓存重试一次）。

`unwrapRemoteModule` 保证两种通道的返回值口径一致（统一取 default 导出），所以对上层调用者来说，本地源码模块与联邦远程模块完全可互换——这就是映射键与 federation expose ID 保持同构的意义。

## 五、init-main 初始化与路由守卫：首次使用前必须先跑注册

`fetchComponent` 在加载任何非 init-main 组件前，都会先 `await ensureSubModuleInitialized(moduleName)`。这个函数保证每个业务子模块的 `init-main`（注册动态路由、注入样式/插件）只执行一次，且对 dev/prod 双通道做了对称处理：

```190:222:packages/main/src/util/system.ts
  const initPromise = (async () => {
    const initMainPath = "./init-main/index.ts";
    const runtimeEnv = envConfig().getEnv as {
      isPublicLocal?: boolean;
    };
    const localLoader = getLocalModuleLoader(moduleName, initMainPath);

    try {
      let initMainModule: unknown;

      if (runtimeEnv.isPublicLocal) {
        // 本地联调：仅当 local-debug-modules 已登记 init-main 时执行
        if (!localLoader) {
          return;
        }
        initMainModule = unwrapRemoteModule<unknown>(await localLoader());
      } else {
        initMainModule = await fetchRemoteComponent<unknown>(moduleName, initMainPath);
      }

      if (typeof initMainModule === "function") {
        await (
          initMainModule as (app?: unknown) => void | Promise<void>
        )(envConfig().app);
      }
```

`public`、`components`、`main` 等平台模块在 `SKIP_INIT_MAIN_MODULES` 里跳过（它们由主应用启动流程单独处理）。

地址栏直达场景由 `setupSubModuleRouteGuard` 兜底：`beforeEach` 发现 `to.matched.length === 0` 时，取 URL 首段作为模块名，先经 `hasModule` 探测——**本地联调直接查映射表前缀（`hasLocalDebugModule`），不会再发 `/sub/<name>/version.js` 探测请求**；探测通过则执行 init-main，然后 `replace` 一次导航，让 init-main 中 `addRoute` 的记录进入当前导航的 matched，否则页面空白：

```287:310:packages/main/src/util/system.ts
export function setupSubModuleRouteGuard(router: Router): void {
  const rematchKeys = new Set<string>();

  router.beforeEach(async to => {
    if (to.matched.length > 0) {
      return true;
    }
    // ... 省略：ensureSubSystemsLoaded、matchRootPath(type===1) 分支 ...

    const moduleName = resolvePathModuleName(to.path);
    if (!(await canInitializeBusinessModule(moduleName))) {
      return true;
    }

    await ensureSubModuleInitialized(moduleName);

    const rematchKey = to.fullPath;
    if (rematchKeys.has(rematchKey)) {
      return true;
    }
```

## 六、整体链路总结

dev 模式下一次菜单页面加载的完整路径是：

菜单数据 → `router-register.buildPageChildRoute` 解析出 `moduleName + componentPath` → `getKeepAliveComponentLoader`（即 main 注入的 `fetchKeepAliveWrappedAsyncComponent`）→ `defineAsyncComponent(fetchComponent)` → `ensureSubModuleInitialized` 先跑该模块 init-main（本地也走 `/@fs/`）→ `isPublicLocal && localLoader` 命中 → `import("/@fs/<monorepo绝对路径>")` 由 Vite dev server 按需编译 monorepo 源码 → 解包 default 导出渲染。未命中（如映射表没登记的 expose、或生产构建）则回退远程联邦：`/sub/<module>/remoteEntry.js` + host 注入的 sharedScope，保证远程模块复用 main 的 vue/pinia/element-plus 实例。

设计的几个关键取舍值得注意：其一，映射表在构建期静态生成并 `JSON.stringify` 进 `define`，运行期零成本；其二，本地与远程通过**相同的键坐标系**（`moduleName:exposePath`）和**相同的解包口径**（`unwrapRemoteModule`）实现完全互等，分流逻辑收敛在 `fetchComponent` 单点，common-core 与路由层对加载来源无感知；其三，`init-main` 的“先注册、再 replace”机制两条通道共用，避免了本地模式下动态路由丢失的问题；其四，shared scope（`ensureHostFederationShareScope`）只对远程通道有意义——本地 `/@fs/` 导入走 Vite 的 alias 直接复用主应用的模块实例，天然单例 Vue，这也是注释中提到的 `refs=null` 问题仅在远程通道需要处理的原因。

以上就是完整的流程梳理。如需进一步看某个分支（如 `resolveComponentModuleName` 如何决定组件归属、或 public 包的 `getPublicSharedExposes` 结构），告诉我即可。