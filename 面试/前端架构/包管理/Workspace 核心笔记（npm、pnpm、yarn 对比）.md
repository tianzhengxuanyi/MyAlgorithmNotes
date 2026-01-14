# Workspace 核心笔记（npm、pnpm、yarn 对比）

# 一、Workspace 基础认知

## 1. 核心定义

Workspace（工作区）是包管理工具提供的 **monorepo 项目支持机制**，允许在单个代码仓库中管理多个关联子包，实现依赖共享、脚本统一运行、子包联动等能力，无需第三方工具（如 lerna）。

## 2. 核心价值

- 依赖共享：根目录安装公共依赖（如 eslint、webpack），子包无需重复安装，节省磁盘空间和安装时间。

- 子包联动：子包间可本地相互依赖，修改实时生效，无需发布到 npm 仓库，提升开发效率。

- 统一管理：根目录可批量/指定运行子包脚本，统一管理版本，简化多包项目操作。

## 3. 通用项目结构

```plaintext

my-monorepo/          # 根仓库
├── package.json      # 根配置（标记私有、共享依赖）
├── [锁文件]          # 保证依赖一致性
├── packages/         # 子包存放目录（可自定义）
│   ├── app/          # 子包1（主应用）
│   ├── components/   # 子包2（组件库）
│   └── utils/        # 子包3（工具库）
└── [工具配置文件]    # 如 .eslintrc.js、tsconfig.json
```

关键：根目录 package.json 需设置 `"private": true`，避免误发布。

# 二、三大包管理工具 Workspace 核心使用

## 1. npm Workspace（v7+ 内置）

### （1）配置方式

根目录 package.json 中添加 workspaces 字段：

```json

{
  "private": true,
  "workspaces": ["packages/*"]  // 指定子包目录（通配符）
}
```

### （2）核心命令

- 根目录安装共享依赖：`npm install -D eslint`

- 指定子包安装依赖：`npm install axios --workspace=app`

- 批量运行子包脚本：`npm run build --workspaces`

- 子包相互依赖：`npm install @my-monorepo/utils --workspace=app`

### （3）特点

开箱即用、学习成本低，命令与 npm 兼容；功能基础，适合小型 monorepo 项目。

## 2. Yarn Workspace（v1+ 内置）

### （1）配置方式（二选一）

- 方式1：根目录 package.json 配置：`"workspaces": ["packages/*"]`

- 方式2：单独创建 yarn.workspaces.yml（推荐，更灵活）：

```yaml

packages:
  - "packages/*"
  - "!packages/ignore-this"  # 排除无需管理的子包
```

### （2）核心命令

- 根目录安装共享依赖：`yarn add -D eslint`

- 指定子包安装依赖：`yarn workspace @my-monorepo/app add axios`

- 批量运行子包脚本：`yarn workspaces run build`

- 清理子包依赖：`yarn workspaces clean`

### （3）特点

功能成熟、配置灵活，支持子包排除；团队协作兼容性好，适合中型项目。Yarn Berry（v2+）支持 PnP 机制，进一步优化磁盘占用。

## 3. pnpm Workspace（v6+ 内置，性能最优）

### （1）配置方式

必须单独创建根目录 pnpm-workspace.yaml：

```yaml

packages:
  - "packages/*"
  - "apps/*"  # 支持多子包目录
  - "!packages/ignore-this"  # 排除子包
```

### （2）核心命令

- 根目录安装共享依赖：`pnpm add -D eslint -w`（-w 表示根目录）

- 指定子包安装依赖：`pnpm add axios --filter=@my-monorepo/app`（--filter 筛选子包）

- 批量运行子包脚本：`pnpm run build --filter="packages/*"`

- 子包相互依赖：`pnpm add @my-monorepo/utils --filter=@my-monorepo/app`

### （3）特点

依托全局缓存+硬链接，安装速度极快、磁盘利用率极高；杜绝幽灵依赖，依赖管理严谨；--filter 筛选功能强大，适合大型/复杂 monorepo 项目。

# 三、三大工具核心差异对比

|对比维度|npm Workspace|Yarn Workspace|pnpm Workspace|
|---|---|---|---|
|支持版本|v7+|v1+（Classic）、v2+（Berry）|v6+|
|核心标识/筛选|--workspace/--workspaces|workspace/workspaces|-w（根目录）、--filter（筛选）|
|安装速度|中等|较快（Berry 更优）|极快|
|磁盘利用率|一般|一般（v1）/ 较高（Berry）|极高|
|幽灵依赖|存在|存在（v1）/ 减轻（Berry）|不存在|
|适用场景|小型项目、新手入门|中型团队协作项目|大型/复杂 monorepo 项目|
# 四、实用选型建议

1. 新手/小型项目：选 npm Workspace，无需额外学习，开箱即用。

2. 中型团队：选 Yarn Workspace，功能稳定、配置灵活，协作兼容性好。

3. 大型/复杂项目：选 pnpm Workspace，极致性能+严谨依赖，提升开发效率。

4. 通用规范：子包名称统一前缀（如 @my-monorepo/app），锁文件提交 Git 保证一致性。
> （注：文档部分内容可能由 AI 生成）