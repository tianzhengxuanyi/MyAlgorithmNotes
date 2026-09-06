# 《Vue.js 设计与实现》第15章 编译器核心技术概览

> 
> 完全基于原书PDF内容整理，保留全部核心知识点、关键代码片段、概念，适合面试复习；分为章节笔记 + 书中完整汇总可运行源码 + 面试问答题库。

## 📖详细笔记

### 15.1 模板DSL的编译器

1. **编译器本质**：一段程序，把**源代码A翻译成目标代码B**。Vue模板是**领域特定语言DSL**，不是通用编程语言。
2. 完整编译教科书流程：编译前端（词法分析、语法分析、语义分析）→ 中端（中间代码、优化）→ 编译后端（目标代码生成）。
3. **Vue模板编译器三阶段（核心，面试必背）**

```
模板字符串
  ↓【parse 解析器：词法+语法分析】
模板AST（描述HTML模板结构）
  ↓【transform 转换器：语义分析、AST转换】
JavaScript AST（ESTree，描述JS渲染函数）
  ↓【generate 代码生成器】
渲染函数字符串
```

- **模板AST**：抽象语法树，和模板**同构**，层级结构一一对应。
节点主要类型：
  - `Root`：逻辑根节点，模板所有内容放在它的`children`
  - `Element`：元素标签，`tag`标签名，`props`属性/指令，`children`子节点
  - `Text`：文本节点
  - `Directive`：指令节点，如`v‑if`，包含`name`、`exp`表达式
  - `Expression`：表达式节点，保存插值/指令里的JS表达式内容

> 
> 示例模板

```
<div>
  <h1 v-if="ok">Vue Template</h1>
</div>
```

产出模板AST：

```
{
  type: 'Root',
  children: [
    {
      type: 'Element',
      tag: 'div',
      children: [
        {
          type: 'Element',
          tag: 'h1',
          props: [
            {
              type: 'Directive',
              name: 'if',
              exp: { type: 'Expression', content: 'ok' }
            }
          ]
        }
      ]
    }
  ]
}
```

4. parse：输入模板字符串，输出模板AST。
5. transform：做**语义分析**（校验v‑else配对、判断是否静态、插槽作用域等），把模板AST转换为JS AST。
6. generate：遍历JS AST，字符串拼接，输出渲染函数字符串。

### 15.2 parser解析器与有限状态自动机

1. parser第一步：**tokenize 标记化**。把模板字符串切割为一个个Token（词法记号）。

> 
> 示例：`<p>Vue</p>` 得到3个token：
> `{type:'tag',name:'p'}`开始标签、`{type:'text',content:'Vue'}`文本、`{type:'tagEnd',name:'p'}`结束标签。
2. **有限状态自动机**

- 有限个状态；逐个读取字符，根据字符自动切换状态。
- 原书定义状态枚举：

```
const State = {
  initial: 1,      // 初始状态
  tagOpen: 2,      // 标签开始状态，读到 <
  tagName: 3,      // 标签名称状态
  text: 4,         // 文本状态
  tagEnd: 5,       // 结束标签状态，读到 </
  tagEndName: 6    // 结束标签名称状态
}
```

- `isAlpha()`：辅助函数，判断字符是否是字母。
- tokenize函数：while循环消费字符串，根据当前状态+输入字符做状态迁移，生成token数组。> 
> 注意：正则本质也是有限状态自动机；书中先用手动状态机实现，便于理解原理。

### 15.3 构造AST（由Token生成模板AST）

1. 拿到token数组后，扫描token，借助**栈结构`elementStack`**构建树形AST。

- 栈初始压入`Root`根节点；**栈顶永远是当前节点的父节点**。
- 遇到开始标签`tag`：创建Element节点，添加到栈顶父节点children，节点压入栈。
- 遇到文本`text`：创建Text节点，添加到栈顶父节点children。
- 遇到结束标签`tagEnd`：栈执行pop弹出栈顶。

```
// 核心逻辑伪代码
function parse(str) {
  const tokens = tokenize(str)
  const root = { type:'Root', children:[] }
  const elementStack = [root]
  while(tokens.length){
    const parent = elementStack[elementStack.length-1]
    const t = tokens[0]
    switch(t.type){
      case 'tag':
        const elNode = {type:'Element',tag:t.name,children:[]}
        parent.children.push(elNode)
        elementStack.push(elNode)
        break
      case 'text':
        parent.children.push({type:'Text',content:t.content})
        break
      case 'tagEnd':
        elementStack.pop()
        break
    }
    tokens.shift()
  }
  return root
}
```

> 
> 局限：本章简易实现不支持自闭合标签，第16章完善。

### 15.4 AST的转换与插件化架构

> 
> transform：遍历模板AST，做增、删、改；插件化解耦转换逻辑。

#### 15.4.1 节点的访问 traverseNode

- **深度优先遍历**AST树。
- dump工具函数：格式化打印AST，用于调试观察树结构。
- 基础`traverseNode`递归遍历全部子节点。
- 痛点：如果所有逻辑全部写在traverseNode，函数臃肿，难以维护。

#### 15.4.2 转换上下文 context

`context`是转换阶段的上下文，相当于转换过程内的局部全局变量，所有转换插件共享。
context核心属性与方法：

| 属性/方法 | 作用 |
| --- | --- |
| `currentNode` | 当前正在处理的AST节点 |
| `parent` | 当前节点的父节点 |
| `childIndex` | 当前节点在父节点children数组的下标 |
| `nodeTransforms` | 转换插件函数数组 |
| `replaceNode(node)` | **替换当前节点**，修改父节点children对应位置，更新currentNode |
| `removeNode()` | **删除当前节点**，父节点splice移除，置空currentNode |

> 
> 注意：执行`removeNode()`之后，`currentNode`会变成null；traverseNode要做判断，如果currentNode为null直接return，不再继续处理该节点。

#### 15.4.3 enter 进入 / exit 退出阶段（重点面试）

1. 问题：有些转换逻辑**必须等全部子节点处理完成之后，才能处理父节点**；单纯自上而下enter无法满足。
2. 改造traverseNode：转换函数可以返回一个`onExit`回调函数。
   - **enter进入阶段：自上而下**，刚访问到节点立刻执行；
   - **exit退出阶段：自下而上**，该节点**所有子节点全部遍历、处理完毕之后才执行**。
3. 执行顺序：

```
enter(A)
 enter(B)
  enter(C)
  exit(C)
 exit(B)
exit(A)
```

4. 实现要点：

- traverseNode内部维护`exitFns`数组；每个插件返回的onExit存入数组。
- 子节点全部递归处理完成后，**逆序执行exitFns数组**。> 
> 逆序：先注册的transform，它的exit会后执行。

5. 插件化架构：把每一类节点处理逻辑封装独立转换函数，放到`context.nodeTransforms`数组，串行执行；和Babel插件思想完全一致。

### 15.5 将模板AST转为JavaScript AST

1. 模板AST描述HTML；**JS AST（ESTree规范）描述JS代码**；最终要用来生成render渲染函数。
2. JS AST常用节点类型：

| JS AST节点type | 含义 |
| --- | --- |
| `FunctionDecl` | 函数声明，用来描述`function render(){}` |
| `ReturnStatement` | return返回语句 |
| `CallExpression` | 函数调用，如`h('div', [...])` |
| `Identifier` | 标识符，变量/函数名字，如`h` |
| `StringLiteral` | 字符串字面量 |
| `ArrayExpression` | 数组字面量 |
3. 辅助创建JS AST节点的工具函数

```
function createStringLiteral(value){ return {type:'StringLiteral',value} }
function createIdentifier(name){ return {type:'Identifier',name} }
function createArrayExpression(elements){ return {type:'ArrayExpression',elements} }
function createCallExpression(callee, args){
  return {
    type:'CallExpression',
    callee: createIdentifier(callee),
    arguments: args
  }
}
```

4. 转换函数分工

- `transformText`：模板Text节点 → JS的`StringLiteral`
- `transformElement`：**写在exit回调**，必须等子节点全部转换完毕；模板Element节点 → `CallExpression`（h函数调用）
- `transformRoot`：写在exit回调；Root根节点生成完整`FunctionDecl` render函数声明。> 
> 模板AST节点上增加`node.jsNode`属性，保存转换之后对应的JS AST节点。

### 15.6 代码生成 generate

1. generate接收JS AST，递归遍历各个节点，做**字符串拼接**，输出render函数字符串。
2. generate上下文context：

- `code`：存储拼接的最终代码字符串
- `push()`：追加字符串
- `indent()`、`deIndent()`、`newline()`：处理换行、缩进，提升生成代码可读性。

3. `genNode()`：分发函数，根据节点type调用对应生成器函数：
`genFunctionDecl` / `genReturnStatement` / `genCallExpression` / `genStringLiteral` / `genArrayExpression`
4. 顶层`compile(template)`总入口：`parse → transform → generate`，返回渲染函数字符串。

### 15.7 本章总结

1. Vue编译器三大步骤：parse（状态机tokenize + 栈构建模板AST）、transform（插件化AST转换，enter/exit）、generate（字符串拼接生成渲染函数）。
2. tokenize依靠有限状态自动机切割模板字符串得到token；再借助栈结构把token转为模板AST。
3. transform深度优先遍历AST，context上下文提供replaceNode/removeNode；区分enter进入、exit退出阶段，支持插件。
4. transform把模板AST转JS AST；generate遍历JS AST，字符串拼接输出render代码。

---

## 💻原书第15章完整汇总可运行源码

```
// ------------------------------
// 1.tokenize 有限状态自动机，生成token数组
// ------------------------------
const State = {
  initial: 1,
  tagOpen: 2,
  tagName: 3,
  text: 4,
  tagEnd: 5,
  tagEndName: 6
}

function isAlpha(char) {
  return char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z'
}

function tokenize(str) {
  let currentState = State.initial
  const chars = []
  const tokens = []
  while (str) {
    const char = str[0]
    switch (currentState) {
      case State.initial:
        if (char === '<') {
          currentState = State.tagOpen
          str = str.slice(1)
        } else if (isAlpha(char)) {
          currentState = State.text
          chars.push(char)
          str = str.slice(1)
        }
        break
      case State.tagOpen:
        if (isAlpha(char)) {
          currentState = State.tagName
          chars.push(char)
          str = str.slice(1)
        } else if (char === '/') {
          currentState = State.tagEnd
          str = str.slice(1)
        }
        break
      case State.tagName:
        if (isAlpha(char)) {
          chars.push(char)
          str = str.slice(1)
        } else if (char === '>') {
          currentState = State.initial
          tokens.push({ type: 'tag', name: chars.join('') })
          chars.length = 0
          str = str.slice(1)
        }
        break
      case State.text:
        if (isAlpha(char)) {
          chars.push(char)
          str = str.slice(1)
        } else if (char === '<') {
          currentState = State.tagOpen
          tokens.push({ type: 'text', content: chars.join('') })
          chars.length = 0
          str = str.slice(1)
        }
        break
      case State.tagEnd:
        if (isAlpha(char)) {
          currentState = State.tagEndName
          chars.push(char)
          str = str.slice(1)
        }
        break
      case State.tagEndName:
        if (isAlpha(char)) {
          chars.push(char)
          str = str.slice(1)
        } else if (char === '>') {
          currentState = State.initial
          tokens.push({ type: 'tagEnd', name: chars.join('') })
          chars.length = 0
          str = str.slice(1)
        }
        break
    }
  }
  return tokens
}

// ------------------------------
// 2.parse：token数组 → 模板AST
// ------------------------------
function parse(str) {
  const tokens = tokenize(str)
  const root = { type: 'Root', children: [] }
  const elementStack = [root]

  while (tokens.length) {
    const parent = elementStack[elementStack.length - 1]
    const t = tokens[0]
    switch (t.type) {
      case 'tag': {
        const elementNode = {
          type: 'Element',
          tag: t.name,
          children: []
        }
        parent.children.push(elementNode)
        elementStack.push(elementNode)
        break
      }
      case 'text': {
        const textNode = {
          type: 'Text',
          content: t.content
        }
        parent.children.push(textNode)
        break
      }
      case 'tagEnd':
        elementStack.pop()
        break
    }
    tokens.shift()
  }
  return root
}

// ------------------------------
// 3.transform AST转换、插件化、enter/exit
// ------------------------------
function dump(node, indent = 0) {
  const type = node.type
  const desc = node.type === 'Root'
    ? ''
    : node.type === 'Element'
      ? node.tag
      : node.content
  console.log(`${'-'.repeat(indent)}${type}: ${desc}`)
  if (node.children) {
    node.children.forEach(n => dump(n, indent + 2))
  }
}

function transform(ast, nodeTransforms) {
  const context = {
    currentNode: null,
    parent: null,
    childIndex: 0,
    nodeTransforms,
    replaceNode(node) {
      context.parent.children[context.childIndex] = node
      context.currentNode = node
    },
    removeNode() {
      if (context.parent) {
        context.parent.children.splice(context.childIndex, 1)
        context.currentNode = null
      }
    }
  }

  function traverseNode(node, context) {
    context.currentNode = node
    const exitFns = []
    for (let i = 0; i < context.nodeTransforms.length; i++) {
      const onExit = context.nodeTransforms[i](context.currentNode, context)
      if (onExit) exitFns.push(onExit)
      if (!context.currentNode) return
    }

    const children = context.currentNode.children
    if (children) {
      for (let i = 0; i < children.length; i++) {
        context.parent = context.currentNode
        context.childIndex = i
        traverseNode(children[i], context)
      }
    }
    // 逆序执行exit回调
    let i = exitFns.length
    while (i--) exitFns[i]()
  }
  traverseNode(ast, context)
}

// ------------------------------
// 4.模板AST转JS AST 辅助工厂函数 & 转换插件
// ------------------------------
function createStringLiteral(value) { return { type: 'StringLiteral', value } }
function createIdentifier(name) { return { type: 'Identifier', name } }
function createArrayExpression(elements) { return { type: 'ArrayExpression', elements } }
function createCallExpression(callee, arguments) {
  return {
    type: 'CallExpression',
    callee: createIdentifier(callee),
    arguments
  }
}

// 转换文本节点
function transformText(node) {
  if (node.type !== 'Text') return
  node.jsNode = createStringLiteral(node.content)
}

// 转换Element元素节点，写在exit回调，等待子节点全部处理完毕
function transformElement(node) {
  return () => {
    if (node.type !== 'Element') return
    const callExp = createCallExpression('h', [
      createStringLiteral(node.tag)
    ])
    node.children.length === 1
      ? callExp.arguments.push(node.children[0].jsNode)
      : callExp.arguments.push(createArrayExpression(node.children.map(c => c.jsNode)))
    node.jsNode = callExp
  }
}

// 转换Root根节点，生成render函数声明
function transformRoot(node) {
  return () => {
    if (node.type !== 'Root') return
    const vnodeJSAST = node.children[0].jsNode
    node.jsNode = {
      type: 'FunctionDecl',
      id: createIdentifier('render'),
      params: [],
      body: [
        {
          type: 'ReturnStatement',
          return: vnodeJSAST
        }
      ]
    }
  }
}

// ------------------------------
// 5.generate 代码生成
// ------------------------------
function generate(node) {
  const context = {
    code: '',
    push(code) { context.code += code },
    currentIndent: 0,
    newline() { context.code += '\n' + '  '.repeat(context.currentIndent) },
    indent() { context.currentIndent++; context.newline() },
    deIndent() { context.currentIndent--; context.newline() }
  }

  function genNode(node, ctx) {
    switch (node.type) {
      case 'FunctionDecl': genFunctionDecl(node, ctx); break
      case 'ReturnStatement': genReturnStatement(node, ctx); break
      case 'CallExpression': genCallExpression(node, ctx); break
      case 'StringLiteral': genStringLiteral(node, ctx); break
      case 'ArrayExpression': genArrayExpression(node, ctx); break
    }
  }

  function genNodeList(nodes, ctx) {
    const { push } = ctx
    for (let i = 0; i < nodes.length; i++) {
      genNode(nodes[i], ctx)
      if (i < nodes.length - 1) push(', ')
    }
  }

  function genFunctionDecl(node, ctx) {
    const { push, indent, deIndent } = ctx
    push(`function ${node.id.name} (`)
    genNodeList(node.params, ctx)
    push(`) {`)
    indent()
    node.body.forEach(n => genNode(n, ctx))
    deIndent()
    push(`}`)
  }

  function genReturnStatement(node, ctx) {
    const { push } = ctx
    push('return ')
    genNode(node.return, ctx)
  }

  function genCallExpression(node, ctx) {
    const { push } = ctx
    const { callee, arguments: args } = node
    push(`${callee.name}(`)
    genNodeList(args, ctx)
    push(`)`)
  }

  function genStringLiteral(node, ctx) {
    const { push } = ctx
    push(`'${node.value}'`)
  }

  function genArrayExpression(node, ctx) {
    const { push } = ctx
    push('[')
    genNodeList(node.elements, ctx)
    push(']')
  }

  genNode(node, context)
  return context.code
}

// ------------------------------
// 编译总入口 compile
// ------------------------------
function compile(template) {
  const ast = parse(template)
  transform(ast, [transformText, transformElement, transformRoot])
  const code = generate(ast.jsNode)
  return code
}

// ========== 测试示例 ==========
/*
const template = `<div><p>Vue</p><p>Template</p></div>`
const renderCode = compile(template)
console.log(renderCode)
*/
```

## 📝本章面试问答题库

### Q1 Vue模板编译器完整的三大阶段是什么？每个阶段产出什么？

> 
> 1. parse解析器：模板字符串 → **模板AST**，依靠有限状态自动机做词法分析得到token，再通过栈构建树形AST；
> 2. transform转换器：模板AST → **JavaScript AST**；深度优先遍历，插件化架构，enter进入、exit退出阶段，做语义分析与节点转换；
> 3. generate代码生成器：JS AST → **渲染函数字符串**，本质是字符串拼接。

### Q2 tokenize词法分析依靠什么原理？

> 
> **有限状态自动机**。维护多个状态，逐个消费模板字符，根据输入字符做状态迁移，切割生成token记号。正则表达式底层本质也是有限状态自动机。

### Q3 parse构造模板AST为什么需要栈？

> 
> HTML标签存在嵌套关系；遇到开始标签压栈，结束标签出栈；**栈顶永远是当前节点的父节点**，以此维护父子嵌套关系。

### Q4 transform转换中 enter 和 exit 的区别，分别适合做什么？

> 
> - enter进入：**自上而下**，刚访问节点立刻执行；适合处理节点自身，不依赖子节点结果。
> - exit退出：**自下而上**，当前节点**全部子节点处理完毕之后才执行**；适合转换逻辑需要依赖子节点处理结果的场景。
> 多个转换插件，exit回调会逆序执行。

### Q5 transform的context上下文对象作用？有哪些关键属性和工具函数？

> 
> context是转换阶段共享的局部全局对象，所有转换插件可以访问。
> 
> 
> - `currentNode`：当前节点；`parent`父节点；`childIndex`下标；
> - `replaceNode()`：替换当前节点；
> - `removeNode()`：删除当前节点；删除后currentNode置空，traverseNode直接return不再处理。

### Q6 模板AST和JavaScript AST有什么区别？

> 
> - **模板AST**：描述HTML模板结构；节点类型Element/Text/Directive；面向模板语法。
> - **JavaScript AST**：描述JS代码（遵循ESTree）；节点类型CallExpression / FunctionDecl / Identifier等；用来生成渲染函数JS代码。

### Q7 generate代码生成器原理是什么？

> 
> 递归遍历JS AST各个节点，根据不同节点类型做**字符串拼接**；context维护code字符串、缩进换行工具函数，输出完整render函数字符串。

### Q8 插件化架构在transform怎么体现？有什么好处？

> 
> 将每一类节点处理逻辑封装独立转换函数，放到`nodeTransforms`数组串行执行；好处是逻辑解耦，新增/移除转换逻辑不需要修改traverseNode核心遍历代码，类似Babel插件。
