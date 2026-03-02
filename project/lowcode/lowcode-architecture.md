# 低代码引擎架构文档

## 一、系统概述

这是一个面向企业管理平台的低代码可视化设计引擎，采用 Vue 3 + TypeScript + Pinia 技术栈构建。平台支持通过拖拽方式快速构建页面，并提供完整的运行时渲染能力。

## 二、整体架构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              低代码引擎架构                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         Designer (设计器层)                            │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │
│  │  │  左侧物料区  │  │  画布区     │  │  右侧配置区 │  │   顶部工具栏 │ │  │
│  │  │ LeftPanel   │  │ Designer-   │  │ RightPanel  │  │   Header   │ │  │
│  │  │             │  │ Content     │  │             │  │            │ │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                     Renderer Core (渲染核心层)                        │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │
│  │  │  渲染器     │  │  指令系统   │  │  事件系统   │  │  模拟器     │ │  │
│  │  │  Render    │  │  Directive  │  │   Event    │  │  Simulator │ │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                       Store (状态管理层 Pinia)                        │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │
│  │  │  组件库     │  │  页面配置   │  │  运行时配置 │  │  设计工具   │ │  │
│  │  │ Components │  │  PageConfig │  │RuntimeConfig│  │DesignTools │ │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         Types (类型定义层)                            │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │
│  │  │  组件类型   │  │  元素节点   │  │  数据源     │  │  逻辑流     │ │  │
│  │  │Component-  │  │  Element    │  │  DataSource │  │  LogicFlow │ │  │
│  │  │ Registry   │  │    Node     │  │             │  │            │ │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        Utils (工具函数层)                            │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │
│  │  │  字符串工具 │  │  对象工具   │  │  日期工具   │  │  树形工具   │ │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 三、核心模块详解

### 3.1 Types 类型定义层

位于 `packages/common/common-lowcode/types/src/`

#### 3.1.1 组件注册类型 (component-registry.ts)

```typescript
// 组件分类
enum BaseGroupType {
  CONTAINER = "布局",      // 布局容器
  COMMON = "基础",         // 基础组件
  TABLE = "表格",          // 表格组件
  NAV = "导航",            // 导航组件
  INPUT = "信息输入",       // 输入组件
  SELECT = "选择器",       // 选择器
  CHART = "图表",          // 图表
  FEEDBACK = "反馈",       // 反馈组件
  GUIDE = "引导",          // 引导组件
  SHOW = "展示型",         // 展示组件
  BASE_ROUTER = "基本路由", // 路由
  HIDDEN = "隐藏"          // 隐藏
}

enum AdvanceGroupType {
  BASE = "基础元素",
  CONTAINER = "布局容器",
  FORM = "表单类",
  TABLE = "表格类",
  LAYOUT = "布局",
  CHART = "图表类",
  HIDDEN = "隐藏"
}

// 组件定义接口
interface AbstractComponent {
  name: string;           // 组件名称
  label: string;          // 组件标签
  group: BaseGroupType | AdvanceGroupType;
  component: {
    pcEditor?: ComponentDefinition;   // PC编辑器
    pcViewer?: ComponentDefinition;   // PC预览器
    mobileEditor?: ComponentDefinition;// 移动端编辑器
    mobileViewer?: ComponentDefinition;// 移动端预览器
  };
  propsDefinition?: ComponentPropGroup[]; // 属性配置
  eventNames?: EventNameDesc[];           // 事件定义
  isContainer?: boolean;                  // 是否为容器
  acceptElement?: string[];               // 接受的子元素
  nodeAdapter?: (node: ElementNode) => void; // 节点适配器
}
```

#### 3.1.2 元素节点 (element.ts)

```typescript
// 核心元素节点结构
interface Element {
  tag: string;                    // 组件标签
  cid?: string;                   // 组件唯一ID
  tid?: number;                   // 临时ID
  coordinate?: number[];          // 树坐标
  class?: string[] | Record<string, boolean>;  // 类名
  style?: Record<string, any>;    // 样式
  styleList?: Record<string, any>[]; // 动态样式列表
  directives?: ElementDirective[]; // 指令列表
  on?: { [key: string]: EventData }; // 事件绑定
  slots?: { [key: string]: ElementNode[] | Function }; // 插槽
  children?: ElementNode[];       // 子元素
  show?: boolean;                 // 显示隐藏
  context?: { [key: string]: Object }; // 上下文
  datasource?: any;               // 数据源
  dataStruct?: any;               // 数据结构
  logicType?: string;             // 逻辑类型
  functionProp?: Record<string, string>; // 函数属性
}

// 指令类型
enum DirectiveType {
  V_FOR = "V_FOR",    // 循环指令
  V_IF = "V_IF",      // 条件指令
  V_SHOW = "V_SHOW",  // 显示指令
  V_BIND = "V_BIND",  // 绑定指令
  V_MODEL = "V_MODEL" // 模型指令
}
```

#### 3.1.3 数据源 (datasource.ts)

```typescript
// 数据源接口定义
interface InterfaceType {
  id: string;                    // 接口ID
  path: string;                  // 接口路径
  method: RequestMethod;         // 请求方法 (GET/POST/PUT/DELETE)
  name?: string;                 // 接口名称
  param?: VariableProperty[];    // 请求参数
  returnType?: VariableProperty[];// 返回参数
  generateVar?: boolean;         // 是否生成变量
  fromType?: InterfaceFromType; // 接口来源类型
  isExternal?: boolean;          // 是否外部接口
}
```

### 3.2 Utils 工具函数层

位于 `packages/common/common-lowcode/utils/src/`

| 工具模块 | 功能说明 |
|---------|---------|
| string-util.ts | 字符串处理工具 |
| object-util.ts | 对象操作工具 |
| date.ts | 日期处理工具 |
| tree.ts | 树形结构工具 |
| array-util.ts | 数组操作工具 |
| uuid.ts | UUID生成 |
| serialize.ts | 序列化工具 |
| pinyin.ts | 拼音转换 |
| md5.ts | MD5加密 |
| css-helpler.ts | CSS辅助工具 |

### 3.3 Store 状态管理层

位于 `packages/common/common-lowcode/renderer-core/src/store/`

#### 3.3.1 组件库 Store (components.ts)

负责管理所有可用的组件定义和注册。

```typescript
// 核心功能
- baseComponents: Record<BaseGroupType, BaseComponent[]>  // 基础组件列表
- advanceComponents: Record<AdvanceGroupType, AdvanceComponent[]> // 高级组件
- componentNameMap: Record<string, AbstractComponent>      // 组件名称映射
- registeredMap: Record<string, boolean>                   // 已注册组件

// 核心方法
- addBaseComponent(component, app)    // 添加基础组件
- addAdvanceComponent(component, app)  // 添加高级组件
- getComponentByName(name)            // 获取组件定义
- isPlatComponent(tag)                 // 判断是否为平台组件
- isContainer(tag)                     // 判断是否为容器
- registerComponent(app, component)    // 注册组件到Vue应用
```

#### 3.3.2 页面配置 Store (page-config.ts)

管理设计时页面状态和组件映射。

```typescript
// 核心状态
- componentMap: Record<string, ElementNode>  // 组件映射 cid->node
- currentId: string                             // 当前选中组件ID
- currentPage: ElementNode                     // 当前页面配置
- data: object                                 // 页面数据
- dataStruct: VariableProperty[]              // 数据结构

// 核心方法
- setCurrentId(id)              // 设置当前选中组件
- putComponent(id, node)       // 添加组件到映射
- getComponentById(id)         // 获取组件配置
- swapNode(node1, node2, type) // 交换节点位置
- canDragIn(container, target) // 拖拽校验
- forceUpdate()                // 强制刷新
```

#### 3.3.3 运行时配置 Store (runtime-config.ts)

管理运行时全局配置。

```typescript
// 核心状态
- app: App                          // Vue应用实例
- isDesign: boolean                 // 是否设计时
- platEnv: "pc" | "mobile"          // 平台环境
- vueInstanceMap: Record<string, any>  // Vue实例映射
- componentInstanceMap: Record<string, any> // 组件实例映射
- allDatasource: InterfaceType[]   // 全局数据源

// 核心方法
- putVueInstance(cid, instance)    // 保存Vue实例
- getDatasource(dsId)               // 获取数据源
- addDatasource(ds)                 // 添加数据源
- getAction/postAction/putAction/deleteAction  // HTTP请求方法
```

### 3.4 Renderer Core 渲染核心层

位于 `packages/common/common-lowcode/renderer-core/src/`

#### 3.4.1 渲染器 (renderer/render.tsx)

将 ElementNode 转换为 Vue VNode 的核心渲染器。

```typescript
// 渲染流程
1. initRuntime(node, context, env)  // 初始化运行时节点
   - 处理 v-for 指令
   - 处理条件渲染
   - 挂载事件
   - 处理插槽

2. doRender(node)                  // 执行渲染
   - 处理子节点
   - 处理插槽
   - 生成VNode
```

#### 3.4.2 适配器 (renderer/adapter/index.ts)

负责将设计时的 ElementNode 转换为运行时节点。

```typescript
// 核心功能
- initRuntime()                    // 初始化运行时
- initRuntimeItem()                // 初始化单个运行时项
- copyProps()                      // 复制属性
- handleDirective()                // 处理指令
- handleDesigner()                 // 设计时处理
- deliveryContext()                // 上下文传递
```

#### 3.4.3 指令系统 (renderer/directive/)

| 指令文件 | 功能说明 |
|---------|---------|
| v-if.ts | 条件渲染指令 |
| v-show.ts | 显示隐藏指令 |
| v-bind.ts | 属性绑定指令 |
| v-model.ts | 双向绑定指令 |
| v-for.ts | 循环渲染指令 |

**v-model 指令实现要点：**
```typescript
// 核心逻辑
- 解析表达式获取值
- 绑定 update 事件处理数据同步
- 支持信号量变量 (signal)
- 支持查询类型追加 (_like, _eq 等)
```

#### 3.4.4 事件系统 (renderer/event/index.ts)

```typescript
// 事件挂载流程
mountEvent(node, result, env)
  └── mountEventItem(event, result, node, env)
        ├── funName: 组件方法名调用
        ├── funCode: 函数代码执行
        └── fun: 直接绑定函数

// 支持事件修饰符
- enter: 回车键修饰符
```

#### 3.4.5 模拟器 (simulator/)

实现拖拽功能的模拟器系统。

```typescript
// 核心类
class SimulatorModelDragon {
  boost()              // 释放拖拽
  boostMove()          // 移动组件
  boostCreate()        // 创建组件
  isBeforeDelete()     // 判断删除顺序
}

class ModelDragon {
  // 拖拽类型
  - canvas_component:        // 画布组件
  - canvas_component_move:   // 画布组件移动
  - component_material:      // 物料区组件
  - page_component:          // 页面组件
}
```

### 3.5 Designer 设计器层

位于 `packages/common/common-lowcode/designer/src/`

#### 3.5.1 设计器主组件 (designer/designer.vue)

```vue
<template>
  <div class="engine-main">
    <DesignHeader />           <!-- 顶部工具栏 -->
    <DesignerContent />        <!-- 设计内容区 -->
  </div>
</template>
```

#### 3.5.2 设计器区域划分

| 区域 | 组件 | 说明 |
|-----|------|-----|
| 左侧物料区 | left-panel/index.vue | 组件选择面板 |
| 画布区 | designer-content.vue | 可视化设计区域 |
| 右侧配置区 | setting/index.vue | 属性/事件/样式配置 |
| 顶部工具栏 | header/index.vue | 保存/预览/生成代码 |

#### 3.5.3 设计器功能模块

```typescript
// 核心功能
- 组件拖拽: 使用 ModelDragon 实现
- 组件配置: 通过 setting 组件配置属性
- 大纲树: outline/tree-node-content.vue 显示层级
- 代码编辑: code-panel/index.vue 编辑逻辑代码
- 数据源管理: datasource/index.vue 配置接口
```

## 四、数据流架构

### 4.1 设计时数据流

```
用户操作
   │
   ▼
┌─────────────────┐
│   Designer UI   │
└────────┬────────┘
         │ 拖拽/配置
         ▼
┌─────────────────┐     ┌─────────────────┐
│  PageConfig    │◄───►│ DesignTools    │
│  Store         │     │ Store          │
└────────┬────────┘     └────────┬────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  ComponentMap   │     │  OperateStack   │
│  (cid→node)    │     │  (撤销/重做)    │
└─────────────────┘     └─────────────────┘
```

### 4.2 运行时数据流

```
页面配置 (ElementNode)
        │
        ▼
┌─────────────────────────────────────┐
│         Render Engine               │
│  ┌─────────────────────────────┐   │
│  │    initRuntime()             │   │
│  │    - 解析指令                │   │
│  │    - 处理数据绑定             │   │
│  │    - 挂载事件                │   │
│  └─────────────────────────────┘   │
└────────┬────────────────────────────┘
         │ RuntimeNode
         ▼
┌─────────────────────────────────────┐
│         Vue Render                  │
│  ┌─────────────────────────────┐   │
│  │    createVNode()            │   │
│  └─────────────────────────────┘   │
└────────┬────────────────────────────┘
         │ VNode
         ▼
    DOM 渲染
```

### 4.3 数据流转关键点

```typescript
// 1. 组件配置 → ElementNode
ComponentDesc → ElementNode

// 2. ElementNode → RuntimeNode
initRuntime(elementNode, context, env)

// 3. RuntimeNode → VNode
doRender(runtimeNode)

// 4. VNode → DOM
render(vNode, container)
```

## 五、组件生命周期

### 5.1 设计时生命周期

```
1. 组件注册
   └── addBaseComponent() / addAdvanceComponent()
         └── registerComponent(app, component)
               └── app.component(name, definition)

2. 拖拽创建
   └── ModelDragon.setMaterialDraggable()
         └── componentMaterialDraggable.setDraggable()
               └── onDrop → boostCreate()

3. 属性配置
   └── PageConfig.setCurrentId()
         └── ComponentPropGroup 配置面板

4. 保存发布
   └── Header.save()
         └── serialize(ElementNode) → JSON
```

### 5.2 运行时生命周期

```
1. 页面加载
   └── loadPageConfig()
         └── initRuntime(pageConfig)

2. 组件渲染
   └── render(pageConfig)
         └── doRender(node)
               └── createVNode()

3. 事件触发
   └── userEvent
         └── parseFunction(funCode)
               └── bind(context).execute()

4. 数据更新
   └── v-model update
         └── context.variable = value
               └── $forceUpdate()
```

## 六、扩展机制

### 6.1 自定义组件注册

```typescript
// 注册基础组件
components().addBaseComponent({
  name: 'CustomComponent',
  label: '自定义组件',
  group: BaseGroupType.COMMON,
  component: {
    pcEditor: defineComponent({...}),
    pcViewer: defineComponent({...})
  },
  propsDefinition: [
    {
      name: 'propName',
      title: '属性名称',
      setter: { name: 'TextSetter' }
    }
  ]
}, app)
```

### 6.2 自定义 Setter

```typescript
// 属性Setter类型
enum CompPropSetterType {
  text_setter = "TextSetter",           // 文本
  number_setter = "NumberSetter",       // 数字
  bool_setter = "BoolSetter",            // 布尔
  select_setter = "SelectSetter",        // 选择
  color_setter = "ColorSetter",          // 颜色
  style_setter = "StyleSetter",          // 样式
  loop_setter = "LoopSetter",            // 循环
  interface_setter = "InterfaceSetter",  // 接口
  function_setter = "FunctionSetter",    // 函数
  // ... 更多类型
}
```

### 6.3 自定义指令

```typescript
// 指令类型
enum DirectiveType {
  V_FOR = "V_FOR",    // 循环
  V_IF = "V_IF",      // 条件
  V_SHOW = "V_SHOW",  // 显示
  V_BIND = "V_BIND",  // 绑定
  V_MODEL = "V_MODEL" // 双向绑定
}
```

## 七、核心算法

### 7.1 拖拽放置算法

```typescript
// 坐标计算
isBeforeDelete(from, to) {
  // 比较坐标深度
  const min = Math.min(from.coordinate.length, to.coordinate.length);
  for (let i = 0; i < min; i++) {
    if (from.coordinate[i] !== to.coordinate[i]) {
      return from.coordinate[i] > to.coordinate[i];
    }
  }
  return true;
}
```

### 7.2 表达式解析

```typescript
// 解析绑定表达式
parseExpression(expression, self, context, appendExpr) {
  // 支持 this.xxx 访问
  // 支持 context.xxx 访问
  // 支持动态查询后缀
}
```

## 八、目录结构总览

```
packages/common/common-lowcode/
├── types/                    # 类型定义
│   └── src/
│       ├── component-registry.ts    # 组件注册类型
│       ├── component-type.ts        # 组件类型
│       ├── element.ts               # 元素节点
│       ├── datasource.ts            # 数据源
│       ├── program.ts               # 变量程序
│       └── ...
│
├── utils/                    # 工具函数
│   └── src/
│       ├── string-util.ts
│       ├── object-util.ts
│       ├── date.ts
│       ├── tree.ts
│       └── ...
│
├── components/               # 组件库
│   └── src/
│       └── engine/           # 组件引擎
│
├── renderer-core/           # 渲染核心
│   └── src/
│       ├── renderer/         # 渲染器
│       │   ├── render.tsx
│       │   ├── adapter/
│       │   ├── directive/
│       │   └── event/
│       ├── simulator/        # 模拟器
│       │   ├── dragon.ts
│       │   ├── model-draggable.ts
│       │   └── bem-tools/
│       └── store/            # 状态管理
│           ├── components.ts
│           ├── page-config.ts
│           └── runtime-config.ts
│
└── designer/                 # 设计器
    └── src/
        ├── designer/         # 主设计器
        │   ├── designer.vue
        │   ├── designer-content.vue
        │   ├── left-panel/
        │   ├── right-panel/
        │   ├── header/
        │   └── outline/
        ├── portal-designer/  # 门户设计器
        └── component-design/ # 组件设计器
```

## 九、技术栈总结

| 层次 | 技术选型 | 说明 |
|-----|---------|-----|
| 框架 | Vue 3 | 响应式UI框架 |
| 状态管理 | Pinia | Vue 3 推荐的状态管理 |
| 语言 | TypeScript | 类型安全 |
| 构建工具 | Vite | 快速开发体验 |
| 样式 | SCSS | CSS 预处理器 |
| 包管理 | Lerna | Monorepo 管理 |

## 十、总结

该低代码引擎采用了清晰的分层架构设计：

1. **类型层** - 提供了完整的类型定义，确保开发时的类型安全
2. **工具层** - 封装了丰富的工具函数，提高开发效率
3. **状态层** - 使用 Pinia 进行全局状态管理，支持设计时和运行时
4. **渲染层** - 自研的渲染引擎，支持指令系统和事件系统
5. **设计器层** - 完整的可视化设计器，支持拖拽、配置、预览等功能

整体架构具有良好的扩展性，支持自定义组件、自定义Setter和自定义指令的扩展。
