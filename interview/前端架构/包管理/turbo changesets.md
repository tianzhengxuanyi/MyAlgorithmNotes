Turborepo 和 Changesets 是现代 Monorepo 工程中两个核心但职责完全不同的工具。**Turborepo 负责“构建/任务”的效率，Changesets 负责“版本/发布”的管理**，两者组合起来，恰好覆盖了 Monorepo 从开发到发布的全流程。

---

## 🏗️ Turborepo：高性能构建系统

Turborepo 是由 Vercel 开发的构建系统，专门用来解决 Monorepo 的“规模”问题。

它的核心机制是：

- **增量构建与缓存**：Turborepo 会分析你的任务输入（源码、依赖、环境变量等），如果输入没变，就直接从缓存中恢复输出，不再重复执行。**远程缓存**则让整个团队和 CI 共享这份缓存，CI 永远不会做重复的工作。
- **任务编排与并行**：它根据 `package.json` 中已有的 scripts 和依赖关系，自动构建任务图（task graph），然后并行调度所有可并行的任务，最大化利用 CPU 核心。
- **零侵入**：你只需要一个 `turbo.json` 文件来定义 pipeline，不需要大幅修改现有项目结构。它兼容 npm、yarn、pnpm 等任何包管理器。

一个典型的 `turbo.json` 配置：

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

这表示：`build` 任务需要先构建它的所有依赖（`^build`），且产物在 `dist/` 目录下，需要被缓存；`test` 任务则必须在 `build` 之后执行。

---

## 📦 Changesets：版本与发布管家

Changesets 是一个专注于 Monorepo 的版本管理和发布工具，由 Atlassian 开源，目前是 pnpm 官方推荐的版本管理方案。

它解决的问题是：**在 Monorepo 中，如何优雅地决定哪个包该升什么版本、生成 changelog、并发布到 npm。**

Changesets 的工作流基于“变更集（changeset）”文件：

1. **开发者提交变更集**：当你完成一个功能或修复后，在仓库根目录运行 `pnpm changeset`。CLI 会引导你选择哪些包发生了变更，以及每个包是 `patch`（补丁）、`minor`（次要）还是 `major`（主要）版本升级。这个选择会生成一个 `.changeset/*.md` 文件，记录你的决定。
2. **维护者批量处理版本**：当准备好发布时，运行 `pnpm changeset version`。Changesets 会读取所有待处理的变更集文件，**自动计算每个包的新版本号**（包括处理包之间的依赖关系，比如 A 依赖 B，B 升级了，A 的依赖范围也会被自动更新），并生成对应的 `CHANGELOG.md`。
3. **发布**：最后运行 `pnpm changeset publish`，将更新后的包发布到 npm。

关键优势在于：**版本决策是分散在每次代码提交中由开发者做出的，而不是等到发布前由某个人集中拍板**。这让版本管理变得可追溯、可协作。

---

## 🔗 两者如何协同：Turborepo + Changesets 完整链路

在 Monorepo 中，它们的分工非常清晰：

| 工具 | 职责 | 触发时机 |
|---|---|---|
| **Turborepo** | 任务编排、缓存、并行构建 | 日常开发、CI 构建、测试 |
| **Changesets** | 版本决策、changelog、npm 发布 | 发布准备、版本升级 |

一个典型的集成工作流是这样的：

**开发阶段**：开发者修改代码 → 运行 `pnpm changeset` 记录变更 → 提交代码和生成的 changeset 文件。

**CI 阶段**：Turborepo 负责跑 `build`、`test`、`lint`。由于它知道变更集文件也是输入的一部分，当 changeset 文件发生变化时，相关包的缓存会自动失效，确保构建的是最新状态。

**发布阶段**：维护者运行 `pnpm changeset version`，Changesets 自动更新所有包的版本号和 changelog。然后运行 `pnpm turbo run build` 确保所有包构建通过，最后 `pnpm changeset publish` 发布到 npm。

在 CI 中，通常会用 `changesets/action` 来自动化这个流程：当有新的 changeset 合并到主分支时，Bot 会自动创建一个“Version Packages”的 PR，里面包含了版本号和 changelog 的更新。合并这个 PR 后，会自动触发发布。

---

## 💡 一句话总结

**Turborepo 让你的 Monorepo 跑得快，Changesets 让你的 Monorepo 发得对。** 前者是构建层的加速器，后者是发布层的治理工具，两者组合（通常再加上 pnpm workspace 做依赖管理）构成了当前前端 Monorepo 最主流的工程化方案。