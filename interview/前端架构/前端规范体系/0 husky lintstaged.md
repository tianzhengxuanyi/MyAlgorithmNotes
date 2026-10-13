# husky lint-staged

## husky

通过git hooks对代码、文件进行预设的检查，检查不过可以阻止代码提交。

```bash
pnpm i husky -D # 安装
pnpx husky install # 启用git hooks
```

核心的git hooks：
1. pre-commit —— 代码检查与格式化（本地拦截）。
2. commit-msg —— 提交信息规范校验。
3. pre-push —— 推送前全量测试（防止漏网之鱼）。
4. post-merge —— 合并后自动同步依赖（提升体验）。


创建一个 hook: `husky add <file> [cmd]`
- file: 指定保存命令的文件，通常是在 .husky 目录下
- cmd: 指定 git hooks 的名字，最常使用的是 pre-commit

```bash
# 创建一个 pre-commit 的 hooks 文件
pnpx husky add .husky/pre-commit "npm test" # pnpm
git add .husky/pre-commit
# 创建好这个文件之后，你就可以根据你的需要去编写这个 shell 脚本了
```

**注意：在客户端 hooks 中，可以通过 git commit -m "commit message" -n (-n 等价于 --no-verify) 来忽略掉 pre-commit hook 的执行！**

## lint-staged

lint-staged 是一个专门用于在通过 git 提交代码之前，对暂存区的代码执行一系列的格式化。

```bash
pnpm i lint-staged -D # pnpm
```

在package.json中添加lint-staged的配置：
```json
"lint-staged": {
  "*.{js,ts,jsx,tsx}": [
    "eslint --cache --fix",
    "prettier --write"
  ],
  "*.vue": [
    "eslint --cache --fix",
    "prettier --write"
  ],
  "*.{css,scss,less,md,json}": "prettier --write"
}
```

## 初始化husky和lint-staged配置

使用 mrm 这个库来同时集成 husky 和 lint-staged 配置。

```bash
pnpm i husky lint-staged -D

pnpx mrm@2 lint-staged # pnpm 初始化husky和lint-staged配置
```

执行命令之后，package.json 里多了一个 lint-staged 配置项，且根目录下多了一个 .husky 目录，里面就包含了 pre-commit 文件，里面包含了一个最基础的命令：npx lint-staged。
