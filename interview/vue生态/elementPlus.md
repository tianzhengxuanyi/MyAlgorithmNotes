# Element‑Plus 高频面试题 + 重点源码组件

> 
> 说明：
> 
> 
> 1. 面试不会考背诵API，**重点考二次封装、底层原理、业务踩坑、虚拟滚动、表单校验、组件通信、样式定制**；
> 2. 简历写「熟悉 Element‑Plus」，面试官默认你做过**业务二次封装**，而不是只会直接用组件；
> 3. 3个值得阅读源码的组件，标注考察点、阅读重点，告诉你看哪些文件，面试会问到的点。

## Element‑Plus 高频面试简答

### 1、Element‑Plus 是什么？和 Element‑UI 的区别

> 
> 简答：Element‑Plus 是基于 Vue3 的 PC 端组件库；Element‑UI 是 Vue2 版本。
> 差异：
> 1）全部改为组合式API；
> 2）使用 `el‑` 前缀，支持全局/局部按需导入；
> 3）CSS变量实现主题定制，不再依靠修改scss变量；
> 4）移除部分 Vue2 兼容API，使用 `v‑model` 多参数语法；
> 5）支持TS全量类型。

### 2、Element‑Plus 按需引入怎么做？有几种方案

> 
> 简答：
> 
> 
> 1. **自动导入（主流）**：`unplugin‑vue‑components` + `unplugin‑auto‑import`，vite插件，不用手动import，模板直接写标签，自动导入组件与样式。
> 2. 手动按需 import：导入组件+导入对应css。
> 3. 全量引入：app.use(ElementPlus)，体积大，项目一般不推荐。

### 追问：unplugin‑vue‑components原理？

> 
> 简答：编译阶段扫描模板AST，识别el‑xxx标签，自动补充import语句，注入到模块，不增加运行时代码。

### 3、Element‑Plus 主题定制有哪两种方式？

> 
> 简答：
> 
> 
> 1. **CSS变量（推荐）**：全局覆盖 `--el‑color‑primary` 等css变量，运行时可以动态切换主题；
> 2. SCSS变量覆盖：修改scss源变量，重新编译样式包，构建时生效，运行时不能动态切换。

### 4、el‑form 表单校验原理，表单校验流程，rules校验规则

> 
> 简答：
> 底层依赖 **async‑validator** 第三方库做校验逻辑。
> 
> 
> 1. el‑form 接收 `rules`；el‑form‑item 通过 `prop` 绑定字段；
> 2. 触发时机：输入change、blur，或者手动调用 `formRef.validate()`；
> 3. validate会遍历rules，执行同步/异步校验；校验失败展示message；
> 4. `validateField` 校验单个字段；`clearValidate()` 清除校验提示。

> 
> 坑点面试追问：
> 
> 
> - prop必须和model的key完全一致；
> - v‑model绑定对象嵌套属性，prop需要写完整路径如 `user.name`；
> - resetFields：重置到表单**初始绑定值**，不是清空对象。

### 5、el‑table 你遇到过哪些业务问题？如何解决？（超级高频）

> 
> 简答：
> 
> 
> 1. **大数据卡顿**：使用`el-table-v2`做大数据虚拟表格；注意虚拟表格对树形表格、单元格合并等高级特性支持有限。
> 2. 固定列：固定列滚动错位、阴影闪烁，是DOM重复渲染导致，升级版本，关闭部分过渡，或者修改样式；
> 3. 表格行/单元格编辑：自定义插槽，维护编辑状态；
> 4. 树形表格：`row‑key` 必须配置，否则展开行异常；
> 5. 多选框回显：`row‑key` + `toggleRowSelection` 手动设置选中。

> 
> 追问：el-table-v2虚拟滚动原理？
> 简答：计算可视区域高度，只渲染视口内DOM，超出的不渲染；通过transform偏移模拟滚动，减少DOM节点数量。

### 6、el‑table row‑key是干什么的，不写会有什么问题

> 
> 简答：作为每一行数据唯一标识；
> 不写会出现：树形展开异常、多选回显错误、虚拟滚动错乱、行状态丢失。

### 7、el‑select 远程搜索怎么实现？遇到过什么坑？

> 
> 简答：`filterable` 开启搜索，`remote`、`remote‑method` 远程请求；
> 坑：需要保证option的value唯一；远程搜索时本地过滤要关闭 `filter‑method=null`；异步回显时option还没加载出来，显示value数字不显示label。

### 8、Dialog弹窗的坑：样式不生效、v‑if和v‑show区别、销毁内部组件

> 
> 简答：
> 
> 
> 1. el‑dialog内部写scoped样式不生效：弹窗DOM被挂载到 `body`，不在当前组件DOM树，深度选择器 `:deep()`；
> 2. `destroy‑on‑close`：关闭弹窗销毁内部组件实例，下次打开重新mount；适合表单重置；
> 3. v‑if会销毁重建；v‑show只是display隐藏，组件实例保留。

### 9、el‑popover / el‑tooltip 浮层组件，遇到的问题，teleport作用

> 
> 简答：
> 浮层默认使用 `<teleport to="body">`，DOM挂载到body，避免父容器 `overflow:hidden` 被截断；
> 坑点：
> 
> 
> 1. 滚动父容器，浮层不跟随滚动；需要关闭teleport，或者监听滚动实时更新浮层位置；
> 2. zIndex层级冲突，多个弹窗浮层互相遮挡。

### 10、Element‑Plus组件二次封装你怎么做？

> 
> 简答：
> 
> 
> 1. 属性透传：`v‑bind="$attrs"` 继承原组件所有属性；
> 2. 插槽透传：`v‑slot="$slots"` 把全部插槽向下传递；
> 3. 事件透传：`v‑on="$listeners"`（Vue3中v‑on="$attrs"自动处理事件）；
> 4. 封装业务默认逻辑，比如：统一表单校验、统一请求、统一字典下拉、统一表格列。

> 
> 面试官重点看：会不会透传属性插槽，而不是写死一堆prop。

### 11、el‑input v‑model修饰符 .lazy .number .trim 的效果

> 
> 简答：
> 
> 
> - `.lazy`：change事件更新，失焦才赋值；
> - `.number`：自动转数字；
> - `.trim`：自动去除首尾空格。

### 12、el‑tree 常见问题

> 
> 简答：必须配置 `node‑key`；
> 常用：`check‑strictly`父子不关联勾选；
> 方法：`setCheckedKeys` 设置选中；`getCheckedKeys` 获取选中key。

### 13、Form的 resetFields 和 clearValidate 区别

> 
> 简答：
> 
> 
> - `resetFields()`：把表单恢复到**组件挂载时的初始model值**，同时清除校验提示；
> - `clearValidate()`：只清除校验文字提示，不会恢复表单数据。

---

# 3个最值得看源码的 Element‑Plus组件（面试会考察源码思路）

> 
> 提示：不需要通读全部源码，看**核心逻辑文件**，记住核心实现思路即可，面试讲思路，不是背代码。
> element‑plus仓库路径：`packages/components/xxx`

## 📌 1、el‑form（表单组件，面试最高频）

**文件夹路径**：`packages/components/form/`
重点文件：

- `src/form.vue` 外层容器
- `src/form‑item.vue` 表单项
- `src/form.ts` 逻辑ts

**阅读重点&面试考察点：**

1. **provide / inject 跨组件通信**：`el‑form` 通过provide向下注入表单实例；`el‑form‑item` inject拿到form实例；父子组件跨组件通信，不依赖prop层层传递。
2. 如何收集所有form‑item实例，统一做 `validate()`、`resetFields()`；
3. 对 `async‑validator` 的封装；校验触发时机；错误消息渲染。

> 
> 面试提问方式：el‑form是怎么让form‑item拿到rules并且批量校验？
> 回答关键点：provide/inject + form收集form‑item子组件实例数组，调用每个item的校验函数。

## 📌 2、el‑table（表格组件，业务最常踩坑，面试必问）

**文件夹路径**：`packages/components/table/`
重点：

- `src/table.vue`
- `src/table‑body` 表格渲染逻辑
- `src/virtual‑table` 虚拟滚动实现

**阅读重点&面试考察点：**

1. table整体架构：table外层容器、header、body、colgroup列定义；
2. **虚拟滚动 virtual‑table**：可视区域计算，transform偏移渲染有限DOM；
3. row‑key作用，内部怎么用rowKey做行唯一标识；
4. 固定列实现：多套DOM，左右固定列 + 中间滚动区域；也是固定列闪烁bug来源；
5. 树形表格展开行实现。

> 
> 面试提问：el‑table固定列为什么会出现滚动错位闪烁？
> 回答：左右固定列是独立DOM，滚动事件同步有时间差；同时DOM重绘会带来闪烁。

## 📌 3、el‑tooltip / el‑popover（浮层类组件，teleport、定位）

**文件夹路径**：`packages/components/tooltip/`，popover依赖tooltip
重点文件：`src/tooltip.vue`、`src/trigger.ts`、`src/content.ts`

**阅读重点&面试考察点：**

1. **Teleport 的使用**，DOM挂载到body；解决overflow:hidden截断；
2. `popper‑js` 第三方库做浮层位置计算，自动翻转防止超出视口；
3. trigger触发逻辑：hover / click / focus；事件委托；
4. zIndex管理，递增zIndex避免弹窗层级覆盖。

> 
> 面试提问：tooltip为什么要用teleport挂载body？去掉teleport会出现什么问题？

---

# 面试速记小提示

简历写「熟悉Element‑Plus」，你要准备好两段口述：

1. 讲el‑form的provide/inject + async‑validator校验；
2. 讲el‑table虚拟滚动、row‑key、固定列的坑；
3. 讲业务中如何二次封装组件，属性插槽透传。

> 
> 面试官很少让手写源码，主要问**原理、踩坑、业务封装思路**。

如果你需要，我可以把 Vue‑Router + Pinia + VueUse + Element‑Plus 四套全部合并成一份完整markdown面试复习文档。