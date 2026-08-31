## 第7章 渲染器的设计
### 📖精简面试笔记
**核心：渲染器把VNode转为真实DOM；渲染器与响应系统结合；自定义渲染器**
1. **渲染器职责**
    - `render(vnode, container)`：把虚拟节点vnode渲染到容器container。
    - 包含挂载mount、更新patch；如果vnode为null代表卸载DOM。
2. **VNode基础结构**
    ```js
    const vnode = {
      type:'div', props:{onClick:fn}, children:'xxx'
    }
    ```
3. **mountElement挂载元素**：创建元素、设置属性/事件、处理子节点、appendChild。
4. **patch：对比新旧vnode**
    - type不同：直接卸载旧节点，挂载新节点。
    - type相同：更新props、更新children。
    - children分三种情况：文本、数组、null。
5. **渲染器和响应系统结合**
    - 组件渲染函数执行放在effect副作用函数；数据变化trigger，执行渲染effect，执行patch做更新。
6. **自定义渲染器（跨平台核心）**
    - 将**平台DOM操作API抽离为配置对象（nodeOps：增删改查节点；patchProps属性处理）**。
    - 核心渲染逻辑mount/patch完全复用；替换nodeOps即可渲染到不同平台：浏览器DOM / canvas / 小程序。
    - 自定义渲染器对外`createRenderer({nodeOps,patchProps})`。
7. **面试题**
    1. 渲染器基本流程？👉render接收vnode，判断有无vnode；null则卸载；无旧vnode则mount；有旧vnode执行patch对比更新。
    2. 如何实现跨平台自定义渲染器？👉把所有平台特有DOM操作抽离配置；mount/patch核心逻辑与平台无关；更换配置即可适配其他平台。
    3. 渲染器怎么和响应系统effect配合？👉组件渲染函数包装进effect；状态变化触发effect重新执行渲染，执行patch更新DOM。

### 💻第7章完整极简最终代码（书中最小自定义渲染器）
```js
// 模拟浏览器平台操作
const browserOps = {
  createElement(tag){ return document.createElement(tag) },
  createTextNode(text){ return document.createTextNode(text) },
  insert(el, parent, anchor = null){ parent.insertBefore(el, anchor) },
  remove(el){ el.parentNode && el.parentNode.removeChild(el) },
  setElementText(el, text){ el.textContent = text }
}

function createRenderer(options) {
  const { createElement, createTextNode, insert, remove, setElementText } = options

  function mountElement(vnode, container) {
    const el = createElement(vnode.type)
    if(vnode.props) {
      for(const k in vnode.props) {
        const val = vnode.props[k]
        if(/^on/.test(k)) {
          el.addEventListener(k.slice(2).toLowerCase(), val)
        } else {
          el.setAttribute(k, val)
        }
      }
    }
    if(typeof vnode.children === 'string') {
      setElementText(el, vnode.children)
    } else if(Array.isArray(vnode.children)) {
      vnode.children.forEach(child => patch(null, child, el))
    }
    insert(el, container)
  }

  function patch(n1, n2, container) {
    if(n1 && n1.type !== n2.type) {
      remove(n1.el)
      n1 = null
    }
    if(!n1) {
      mountElement(n2, container)
    } else {
      const el = n2.el = n1.el
      // 更新props省略
      const oldCh = n1.children
      const newCh = n2.children
      if(typeof newCh === 'string') {
        if(Array.isArray(oldCh)) {
          oldCh.forEach(c=>remove(c.el))
        }
        setElementText(el, newCh)
      } else if(Array.isArray(newCh)) {
        if(typeof oldCh === 'string') {
          setElementText(el, '')
          newCh.forEach(c=>patch(null,c,el))
        } else if(Array.isArray(oldCh)) {
          // 第7章不实现完整diff，第9章简单diff
        }
      } else {
        setElementText(el, '')
      }
    }
  }

  function render(vnode, container) {
    if(vnode) {
      patch(container._vnode || null, vnode, container)
    } else {
      if(container._vnode) remove(container._vnode.el)
    }
    container._vnode = vnode
  }
  return { render }
}

// 使用浏览器渲染器
const { render } = createRenderer(browserOps)
/*
const vnode = {
  type:'div',
  props:{onClick:()=>alert(1)},
  children:'hello vue3'
}
render(vnode, document.body)
*/
```

---

## 第8章 挂载与更新
### 📖精简面试笔记
> 完善渲染器：属性、HTML Attribute vs DOM Property、class/style、事件、卸载、Fragment、文本注释节点
1. **HTML Attribute vs DOM Property（高频）**
    - Attribute：写在模板标签上的字符串；`el.setAttribute()`；HTML初始值；不会同步JS对象属性变化。
    - DOM Property：DOM对象JS属性；`el.xxx = val`；JS层面状态；如`el.value`。
    - input表单：`value`用DOM property；`setAttribute('value')只会设置初始默认值。
    渲染器对每个属性 key 做判断，抉择**DOM Property 直接赋值** 还是 **`setAttribute`设置 HTML Attribute**。
    1. **基础规则**

    - `key in el`：DOM 对象存在该属性 → **优先 DOM Property：`el[key] = value`**
    - `key in el`不成立 → 使用`setAttribute(key, value)`

    2. **例外：即使`key in el`为 true，强制走`setAttribute`**

    - SVG 绝大多数属性（`innerHTML/textContent`除外）
    - `form`属性：`el.form`是只读 DOM property，不可赋值

    3. **布尔属性兼容（`disabled/checked/selected`）**
    模板写`<button disabled>`，vnode 中`disabled:""`空字符串；
    直接`el.disabled=""`会被 JS 转为`false`，语义错误。
    👉 矫正：值为空字符串时，赋值`el[key] = true`。
    4. **空值处理**`value === null / undefined` → 调用`removeAttribute(key)`删除属性
2. **class/style处理**
    - class支持：字符串 / 对象`{a:true}` / 数组，通过normalizeClass 函数处理为字符串，用el.className设置。
    - style支持对象；更新时要处理旧样式清除。
3. **事件处理：`onXXX`**
    - 缓存invoker；invoker.value保存事件处理函数；更新事件不需要removeEventListener，直接替换invoker.value；性能优化。
4. **卸载操作unmount**
    - 不只remove节点；组件要触发生命周期；解绑事件；清除副作用effect。
5. **VNode类型区分：flags**
    - 普通元素、文本、注释、Fragment。
    - Fragment(`type:Symbol(Fragment)`)：**不渲染真实DOM标签，只渲染子节点**；解决多根节点。
6. **子节点更新逻辑**
    四种children状态：`null / 文本字符串 / 数组vnode`；新旧children不同类型做分支处理。
7. **面试题**
    1. Attribute和DOM Property区别？input value更新为什么优先DOM property？👉attribute是HTML初始字符串；property是DOM对象JS属性；input setAttribute只会改默认值，不会改当前输入框内容。
    2. Vue事件更新为什么不removeEventListener？👉包装invoker中间对象；事件绑定invoker；更新只替换invoker.value。
    3. Fragment作用？👉多根组件，本身不产生DOM元素，只渲染子节点。