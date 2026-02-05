## Lerna

Lerna 是一个管理工具，用于管理包含多个软件包（package）的 JavaScript 项目，是 Babel 自己用来维护自己的 Monorepo 并开源出的一个项目。
它可以：

- 统一的一套规范、构建标准；
- 对相互耦合较大、相互独立的 JS/Git 库进行管理；
- 统一的工作流和 Code Sharing（代码共享）。

下面我们从以下几个方面来熟悉 Lerna：

- Lerna 管理模式；
- Lerna 入门指引；
- Lerna 管理命令；
- Lerna 配置文件；
- Lerna 应用 Demo；
- Lerna 版本发布；
- Lerna 最佳实践；
- Lerna 注意事项。

### Lerna 管理模式

lerna 管理项目可以使用两种模式，默认固定模式，当使用 lerna init -i 命令初始化项目时，此时为独立模式。（模式是用来管理多个 package 发包时的方式）

- 固定模式：
  在发包时会检测 packages 下涉及到变更的包，给这些变更的包使用同一版本，未发生变更的包不应用改版本，且不做发布升级；发布时可通过 lerna publish major（大） | minor（中） | patch （小）自定义版本。

- 独立模式（常用的模式）：
  允许每个包有自己独立的版本号，在 lerna publish 发布时，需要为每个改动的库指定版本号（逐个询问需要升级的版本号）。此模式，lerna.json - version 字段指定为 independent。如果 packages 下，其中一个包发生改动，另一个包依赖了这个包，即使它没有发生改动，也会被进行发布更新。

### Lerna 入门指引

- 全局安装 Lerna：

`npm install --global lerna`

- 初始化 git 代码仓库：

`git init lerna-repo && cd lerna-repo`

- 初始化 Lerna：


```
 lerna init
// lerna info Creating package.json
// lerna info Creating lerna.json
// lerna info Creating packages directory
// lerna success Initialized Lerna files
```

此时得到了这样一个仓库目录结构：

```
lerna-repo/
    packages/
    package.json
    lerna.json
```

其中 packages 中保存着每个独立的包模块。

- 安装 lerna 到仓库 node_modules 中：

```
npm install
```

至此，我们就完成了一个 Lerna 工程的初始化工作，下面我们掌握一些操作命令来管理 Lerna。

### Lerna 管理命令

1. lerna init 将一个仓库初始化为 lerna 仓库（默认固定模式）。支持参数：

```
--independent/-i – 使用独立的版本控制模式
```

2. lerna create 「package」创建一个 package 到项目工程的 packages 下。

3. lerna publish 用于 npm 包版本发布，具体细节可看下文 「Lerna 版本发布」。

4. lerna bootstrap 用于将 packages 链接在一起(前提是相互依赖的库)，并安装 package 下的依赖到 package/node_modules。

   注意，它不会安装根目录 package.json 的依赖，如果需要安装根目录依赖，请使用 npm/yarn install。

参数：

--hoist：依赖提升，把每个 package 下的依赖包都提升到工程根目录（删除包下的 node_modules，将依赖安装在根目录，但依赖注册不会在 package/package.json 内删除，也不会在 root/package.json 内添加此依赖）

5. lerna clean 删除各个包下的 node_modules（不会删除根目录 node_modules）。

6. lerna ls 列出当前 Lerna 仓库中的所有公共软件包（public packages）。

7. lerna run 「script」运行每个包下面的 script（如果某个包没有此 script，将会报错）

​		运行某个包下面的 script

```
 lerna run test --scope package1
```

8. lerna exec 「shell」允许去执行 shell 脚本

9. lerna changed 检查自上次发布以来哪些软件包被修改过。

10. lerna link 链接互相引用的库，当 pakcage/package.json 内明确了 packages 下的包时，才会将相关包链接到 package/node_modules 中。

11. lerna info 查看 lerna 及运行环境的信息。

### Lerna 配置文件

在 lerna.json 配置文件内可以指定工作模式、packages 的位置以及一些命令的默认参数定义，如下示例：

```json
{
    "version": "1.0.0",
    "npmClient": "yarn",
    "packages": [
        "packages/*"
    ],
    "command": {
        "bootstrap": {
            "npmClientArgs": [
                "--no-package-lock"
            ]
        },
        "version": {},
        "publish": {
            "npmClient": "npm",
            "ignoreChanges": [
                "**/*.md",
                "**/test/**"
            ],
            "message": "chore(release): publish",
            "registry": "https://registry.npmjs.org",
            "conventionalCommits": true
        }
    }
}
```

- version: 当前仓库的版本，Independent mode 请设置为 independent；

- packages: 指定包所在的目录，支持指定多个目录；

- npmClient: 允许指定命令使用的 client， 默认是 npm， 可以设置成 yarn；

- command.bootstrap.npmClientArgs: 指定默认传给 lerna bootstrap 命令的参数；

- command.publish.ignoreChanges: 指定那些目录或者文件的变更不用触发 package 版本的变更；

- command.publish.message: 执行发布版本更新时的生成的 commit message；

- command.publish.registry: 指定发布到的 registry url，比如可以发布到指定私服，默认是 npmjs.org；

- command.publish.conventionalCommits: lerna version 将生成 CHANGELOG.md files（如果设置了这个，lerna 管理模式将直接使用固定模式，version = independent 的配置将失效）。


### Lerna 应用 Demo

有了上面的基础使用的了解，下面我们通过一个简单 Demo 熟悉一下 Lerna 管理 Packages 的流程方式。

创建 Lerna 工程：

bash 代码解读复制代码 git init lerna-demo && cd lerna-demo && lerna init

创建两个 package：

bash 代码解读复制代码 lerna create lerna-module1
lerna create lerna-module2

在 package 中维护几行测试代码：

js 代码解读复制代码// lerna-module1/lib/lerna-module1.js
module.exports = lernaModule1;
function lernaModule1() {
console.log('lerna-module1');
}

// lerna-module2/lib/lerna-module2.js
const lernaModule1 = require('lerna-module1');
module.exports = lernaModule2;
function lernaModule2() {
console.log('lerna-module2');
}
lernaModule1();
lernaModule2();

在 lerna-module2 下添加一个执行脚本：

json 代码解读复制代码// lerna-module2/package.json
"scripts": {
"test": "node ./lib/lerna-module2.js"
}

运行脚本：

bash 代码解读复制代码 lerna run test --scope lerna-module2

哎呀，此时会看到终端报错信息：

Error: Cannot find module 'lerna-module1'

手动建立 package 之间的关联：

bash 代码解读复制代码 lerna add lerna-module1 --scope lerna-module2
// lerna info Adding lerna-module1 in 1 package

此时可以在 lerna-module2 目录下看到生成了 node_modules 文件夹，并且在里面放置了和 lerna-module1 一模一样的包（软链接）。

再来执行一次命令：

bash 代码解读复制代码 lerna run test --scope lerna-module2
终端输出：
lerna-module1
lerna-module2

好啦，我们第一个简单 Lerna 应用编写完成。接下来就是发布工作。
Lerna 版本发布
packages 下的包版本发布需要使用 lerna publish，这个命令组合了这两个命令：lerna version 和 npm publish。
其中 lerna version 针对 Lerna 的管理模式（固定模式和独立模式），在表现上有所不同。
但主要工作还是在进行 npm publish 之前，去管理哪些包要进行发布，以及发布过程中生成的 Git commit、Git tag 的提交。

固定模式下的 lerna version：

找出从上一个版本发布以来有过变更的 package；
根据当前 lerna.json 中的版本生成新的版本号；
更新涉及到变更 package 下的 package.json 版本号；
更新 lerna.json 文件中的版本号；
将 version 更新、生成的 CHANGELOG.md 文件带来的变动提交为一次 commit；
基于这次 commit 为所有涉及到更新的 package 打上各自的 tag；
推送 commit 和 tags 到远程仓库。

独立模式下的 lerna version：

找出从上一个版本发布以来有过变更的 package；
提示开发者为需要更新的 package 选择（一组 Version Select）要发布的版本号；
更新到 package 下的 package.json version 版本号；
如果 packages 下其他包有依赖这个包，那么这些包下的 package.json 中此包版本也会更新；
将 version 的更新变动提交为一次 commit；
基于这次 commit 为所有涉及到更新的 package 打上各自的 tag；
推送 commit 和 tags 到远程仓库。

这里需要注意一下 lerna 查找包变更的逻辑：

在当前分支，找到最近一次 tag，将当前 commit 和 tag 进行比较，看哪些 package 下的文件发生了变更。

命令使用如下：
bash 代码解读复制代码 lerna publish
lerna publish semver
// semver bump [major | minor | patch | premajor | preminor | prepatch | prerelease]
lerna publish from git
lerna publish from-package

初次使用发布时可能会遇到以下一些问题和注意事项：

避免开发者自己去打 tag。
lerna 发布时会自动生成 tag，并且查找更新是基于 tag 来识别的，避免开发者手动打上 tag 后，影响 lerna 查找变更，可能会造成一些变更包没有按照预期发布。

避免多条分支同时进行。
在多条分支同时进行时，可能会生成相同的版本号，从而发生版本冲突。解决办法：分支开发者之前应提前约定好版本。

lerna publish 中途发布失败，如何进行重发布。
有时候发布可能会失败（比如 npm 没有登录、没有使用 npmjs 镜像源），再次运行 lerna publish 时，因为 tag 已经打上了，无法再查找到更新，进行包的发布。

可以采用下面两种发布方式：

运行 lerna publish from-git。会将当前标签中涉及的 NPM 包再发布一次。（不会再更新 package.json，只是执行 npm publish）；
运行 lerna publish from-package。会将当前所有本地包中的 package.json 和远端 npm 比对，如果 npm 上不存在此包的最新版本，都执行一次 npm publish。

Lerna 最佳实践
目前业界使用最多的方案是：lerna + yarm workspace 结合的 Monorepo 方案，两者工作职责划分不同：

yarn 处理依赖安装工作（只想做好包管理工具）；
lerna 处理发布流程。

此处内容可以在下文查看 yarn workspace 使用指南。
Leran 注意事项

发布前，提交工作区的变更。
在发布前，需要提交工作区的文件变更，否则终端会收到下面报错信息：

lerna ERR! EUNCOMMIT Working tree has uncommitted changes, please commit or remove the following changes before continuing:

发布前，需使用 npmjs.org 镜像。
在发布前，如果 npm 设置的镜像源为淘宝镜像，需要切换回 npm 镜像：

bash 代码解读复制代码 npm config get registry
npm config set registry https://registry.npmjs.org

如果要发布一个 Scope 包：
Scope 是指具有“组织”的包，比如 Babel 的相关包都是这一格式：@babel/xxx，在发布一个具有 Scope 包时，需要确保 Organization（组织）已在 npm 上创建，私有包需要收费，公共包则为免费。

在发布 Scope package 时，需要在 package.json 声明 access publish：
json 代码解读复制代码{
"name": "@feu/tools",
"publishConfig": {
"access": "publish" // 如果该模块需要发布，对于 scope 模块，需要设置为 publish
}
}

发布意外中断，进行重发布：
如果发布因为某些原因中断了，未发布成功，再次执行发布，会得到如下提示：

lerna success No changed packages to publish

但由于包并未成功发布到 npmjs 上，这时可以执行以下命令进行重发布：
bash 代码解读复制代码 lerna publish from-git
// or
lerna publish from-package

independent 模式并未生效：
在 lerna.json 下指定了 version 为 independent，但是发布时却还是固定模式的流程，原因可能是 lerna.json 内配置了 conventionalCommits：

json 代码解读复制代码"command": {
"publish": {
"conventionalCommits": true
}
}

可以将其配置移除得到解决。

固定模式如何自己指定版本：
当我们执行 lerna publish 时，lerna 会自定分配一个版本提供我们使用；但这个版本可能不是我们期望发布的版本；如何自己控制发布的版本呢，在发布时我们可以传递配置：

bash 代码解读复制代码 lerna publish major（大） | minor（中） | patch （小）
lerna publish patch // 发布小版本

yarn workspace
对于 Monorepo 的工程，使用最多的方式是 lerna 结合 yarn workspace 一起使用。
因为 yarn 在依赖管理上做的非常不错，适合我们业务场景的依赖模块管理。
而 package 的发布工作依旧交由 lerna publish 来运转。
下面我们从以下几个方面来熟悉 yarn workspace：

yarn workspace 管理工程；
yarn workspace 管理命令；
yarn workspace 入门实战。

yarn workspace 管理工程
初始化工程的步骤和上面 lerna 的方式一样，与 lerna 不同的是，需要做以下配置：

在 lerna.json 中声明使用 yarn workspace 进行依赖管理：

json 代码解读复制代码{
...
"npmClient": "yarn",
"useWorkspaces": true
}

在 root/package.json 下必需包含 workspaces 数组，与 lerna.json 下的 packages 保持一致：

json 代码解读复制代码{
"private": true, // 工作空间不需要发布
...
"workspaces": ["packages/*"]
}

yarn workspace 管理命令
yarn 管理命令大致分为两类（容易混淆，这里先提及一下）：

处理工程下指定的包模块时使用：yarn workspace；
处理工程根目录全局或所有包模块时使用：yarn workspaces。

yarn install
代替 npm install + lerna bootstrap 安装工程依赖。

它与 lerna bootstarp 不同的是：

yarn install 会将 package 下的依赖统一安装到根目录之下。这有利于提升依赖的安装效率和不同 package 间的版本复用（有些包是需要私有依赖的，而私有依赖会被多个包安装多次，而提升依赖可以解决这一问题）。
yarn install 会自动帮助解决安装（包括根目录下的安装）和 packages link 问题。

yarn add 「module」

为每个 package 都安装指定依赖：

bash 代码解读复制代码 yarn workspaces add react

为指定的 package 安装特定依赖：

bash 代码解读复制代码 yarn workspace package1 add react react-dom --save

注意，package1 一定是 packages/package1/package.json name 字段，有时候 package 的目录名和 name 字段不一致，要以 name 为准。

添加依赖到根目录 node_modules 中：

bash 代码解读复制代码 cd 根目录
yarn add @babel/core -D -W （-W 表示将依赖添加到 workspaces 根目录）

package 之间的相互依赖（会在 package/package.json 下添加该依赖）：

bash 代码解读复制代码 yarn workspace package1 add package2

注意，当 package2 没有发布在 npmjs 上时，此时会报错：package2 not found；解决办法：显示指定 package2 的版本： yarn workspace package1 add package2@^1.0.0

在工程根目录下引入 packages/package 包：

bash 代码解读复制代码 yarn add package@^1.0.0 -W

yarn remove「module」
和上面 yarn add 命令格式相同，只需将 add 替换为 remove 即可。

yarn run 「script」

运行工程根目录下 script：

bash 代码解读复制代码 yarn test

运行指定包模块下的 script：

bash 代码解读复制代码 yarn workspace package1 run test

值得注意的是，命令虽然是在根目录下执行，但在执行文件中拿到的 process.cwd() 是 package 下的执行文件所在路径

运行所有 package 下的 script 命令：

bash 代码解读复制代码 yarn workspaces run test

注意，如果某个 package 下没有对应 script，将会终止命令，并报错。若 package 不具备 script，可以定义一个占位 script，类似如下：

json 代码解读复制代码"scripts": {
"lint": "echo lint successful."
}

yarn workspaces info
查看 workspace 依赖树信息。

yarn workspace 入门实战

新建 yarn workspace 工程：

bash 代码解读复制代码 git init yarn-demo && cd yarn-demo && yarn init -y && yarn add lerna -D && lerna init

配置 lerna.json 改用 yarn workspaces：

json 代码解读复制代码// lerna.json
{
"npmClient": "yarn",
"useWorkspaces": true,
"packages": [
"packages/*"
],
"version": "independent"
}

根目录 package.json 必须包含一个 workspaces 数组:

json 代码解读复制代码{
"private": true, // 工作空间不需要发布
"workspaces": ["packages/*"],
...
}

新建两个 package：

bash 代码解读复制代码 cd packages && mkdir yarn-module1 && cd yarn-module1 && yarn init -y
cd packages && mkdir yarn-module2 && cd yarn-module2 && yarn init -y

添加几行测试代码：

js 代码解读复制代码// yarn-module1/index.js
function yarnModule1() {
console.log('yarn-module1');
}

module.exports = yarnModule1;

// yarn-module2/index.js
const yarnModule1 = require('yarn-module1');

function yarnModule2() {
console.log('yarn-module2');
}

yarnModule1();
yarnModule2();

module.exports = yarnModule2;

为 yarn-module2 添加个 script：

json 代码解读复制代码// yarn-module2/package.json
"scripts": {
"test": "node index.js"
}

回到根目录执行 script：

bash 代码解读复制代码 yarn workspace yarn-module2 run test

不出意外，会得到如下错误：

Error: Cannot find module 'yarn-module1'

建立 package 之间的关系：

bash 代码解读复制代码 yarn install

可以看到，根目录下的 node_modules 中已经存在了 yarn-module1 和 yarn-module2 这两个包，与 lerna 的区别在于没有在各自的 package 下创建 node_modules，而是统一链接到根目录。
但，yarn-module2 中依赖的 yarn-module1，应该将其添加到 package.json 中，最好的方式是采用：
bash 代码解读复制代码 yarn workspace yarn-module2 add yarn-module1@^1.0.0

再来一次 script：

bash 代码解读复制代码 yarn workspace yarn-module2 run test

输出：
yarn-module1
yarn-module2

### 引用

[lerna + yarn workspace 使用总结](https://juejin.cn/post/7097820725301477406?from=search-suggest#heading-11)
