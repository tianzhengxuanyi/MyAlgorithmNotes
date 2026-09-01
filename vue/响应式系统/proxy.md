## 《Vue.js设计与实现》第5‑8章精简笔记 + 完整可运行代码

### 第5章 非原始值的响应式方案

#### 📖精简面试笔记

**核心主题**：基于Proxy实现完善对象、数组、Set/Map响应式；解决各种语义边界问题；实现`reactive/shallowReactive/readonly/shallowReadonly/toRaw`

1. **Proxy与Reflect**
   - Proxy只能代理对象（非原始值），拦截对象基本语义操作（get/set/has/deleteProperty/ownKeys）。
   - `Reflect.get/set`的`receiver`：保证访问器getter内部`this`指向**代理对象**，否则this指向原始target，无法收集依赖。
2. **普通Object代理需要拦截的捕获器**
   | JS操作 | 捕获器 | track的key | trigger时机 |
   |--------|--------|------------|------------|
   | `obj.key`读 | get | key | 属性读取 |
   | `obj.key=val`写 | set | key | SET(修改已有)/ADD(新增) |
   | `'k' in obj` | has | key | in操作 |
   | `for...in obj` | ownKeys | `ITERATE_KEY(Symbol)` | **新增/删除属性才trigger ITERATE_KEY** |
   | `delete obj.k` | deleteProperty | key | DELETE |
   - `ITERATE_KEY`：for…in没有具体key，用唯一Symbol作为依赖key；普通修改属性值不要触发ITERATE_KEY。
3. **数组代理重点**
   - 数组本质对象，下标为key，length特殊属性。
   - 修改`length`截断数组：被删除的下标要触发trigger。
   - `push/unshift/pop/splice`这类变异方法：内部会先读length、再写length，会造成无限循环；解决：调用原生方法时`pauseTracking()`暂停收集，执行完`resumeTracking()`恢复。
4. **Set / Map / WeakSet / WeakMap代理难点**
   - 调用`proxy.add/set/get/delete/forEach`时，方法内部this默认是proxy，访问`this.size`会重复触发get拦截，产生多余track。
   - 解决：重写集合原型方法，bind绑定**原始target**作为this执行。
   - `toRaw()`：入参转为原始对象，**防止把proxy存入原始集合污染原始数据**。
   - 迭代器`values/keys/entries/forEach`需要额外Symbol `MAP_KEY_ITERATE_KEY`收集key迭代依赖。
5. **四层响应API**
   - `reactive`：**深响应**，嵌套对象递归代理
   - `shallowReactive`：浅响应，仅第一层响应，嵌套不代理
   - `readonly`：**深只读**，禁止set/delete，修改抛出警告；递归嵌套只读
   - `shallowReadonly`：浅只读，仅第一层只读
   - 缓存`reactiveMap(原始→proxy)`、`rawMap(proxy→原始)`：避免重复代理，提供`toRaw()`。
6. **面试高频题**
   1. Reflect receiver作用？👉保证访问器getter中this指向代理对象，依赖收集正常。
   2. for‑in如何响应？ITERATE_KEY什么时候trigger？👉ownKeys收集ITERATE_KEY；**新增、删除属性才trigger**，单纯改属性值不触发。
   3. push为什么会无限循环？👉读写length；执行变异方法时pauseTracking关闭收集。
   4. Set代理为什么bind(target)？👉避免this指向proxy，重复触发get捕获器。

#### 💻第5章完整最终代码（依赖第4章effect/track/trigger）

```js
// ========== 第4章基础依赖 ==========
const targetMap = new WeakMap();
let activeEffect;
const effectStack = [];
let shouldTrack = true;
const ITERATE_KEY = Symbol("ITERATE_KEY");
const MAP_KEY_ITERATE_KEY = Symbol("MAP_KEY_ITERATE_KEY");

function pauseTracking() {
  shouldTrack = false;
}
function resumeTracking() {
  shouldTrack = true;
}

function track(target, key) {
  if (!activeEffect || !shouldTrack) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) targetMap.set(target, (depsMap = new Map()));
  let deps = depsMap.get(key);
  if (!deps) depsMap.set(key, (deps = new Set()));
  deps.add(activeEffect);
  activeEffect.deps.push(deps);
}

function trigger(target, key, type, newVal) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  const iterateEffects = depsMap.get(ITERATE_KEY);
  const keyIterateEffects = depsMap.get(MAP_KEY_ITERATE_KEY);
  const effectsToRun = new Set();

  effects &&
    effects.forEach((effectFn) => {
      if (effectFn !== activeEffect) effectsToRun.add(effectFn);
    });

  if (type === "ADD" || type === "DELETE") {
    iterateEffects &&
      iterateEffects.forEach((effectFn) => {
        if (effectFn !== activeEffect) effectsToRun.add(effectFn);
      });
  }

  if (Array.isArray(target) && key === "length") {
    depsMap.forEach((dep, k) => {
      if (k !== "length" && Number(k) >= newVal) {
        dep.forEach((effectFn) => {
          if (effectFn !== activeEffect) effectsToRun.add(effectFn);
        });
      }
    });
  }

  if ((type === "ADD" || type === "DELETE") && target instanceof Map) {
    keyIterateEffects &&
      keyIterateEffects.forEach((effectFn) => {
        if (effectFn !== activeEffect) effectsToRun.add(effectFn);
      });
  }

  effectsToRun.forEach((effectFn) => {
    if (effectFn.options?.scheduler) effectFn.options.scheduler(effectFn);
    else effectFn();
  });
}

function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }
  effectFn.deps.length = 0;
}

function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    const res = fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    return res;
  };
  effectFn.options = options;
  effectFn.deps = [];
  if (!options.lazy) effectFn();
  return effectFn;
}

function computed(getter) {
  let value;
  let dirty = true;
  const obj = {};
  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      if (!dirty) {
        dirty = true;
        trigger(obj, "value");
      }
    },
  });
  Object.defineProperty(obj, "value", {
    get() {
      if (dirty) {
        value = effectFn();
        dirty = false;
      }
      track(obj, "value");
      return value;
    },
  });
  return obj;
}

function traverse(value, seen = new Set()) {
  if (value === null || typeof value !== "object" || seen.has(value)) return;
  seen.add(value);
  for (const k in value) traverse(value[k], seen);
  return value;
}

function watch(source, cb, options = {}) {
  let getter;
  if (typeof source === "function") getter = source;
  else getter = () => traverse(source);
  let oldValue, newValue;
  let cleanup;
  const onInvalidate = (fn) => {
    cleanup = fn;
  };

  const job = () => {
    newValue = effectFn();
    if (cleanup) cleanup();
    cb(newValue, oldValue, onInvalidate);
    oldValue = newValue;
  };
  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      if (options.flush === "post") Promise.resolve().then(job);
      else job();
    },
  });
  if (options.immediate) job();
  else oldValue = effectFn();
}

// ========== 第5章代码开始 ==========
const reactiveMap = new WeakMap();
const rawMap = new WeakMap();
function toRaw(observed) {
  return rawMap.get(observed);
}

// 集合对象工具方法重写
function createInstrumentations() {
  const mutableInstrumentations = {
    add(val) {
      const target = toRaw(this);
      const rawVal = toRaw(val);
      const had = target.has(rawVal);
      if (!had) {
        target.add(rawVal);
        trigger(target, null, "ADD");
      }
      return this;
    },
    delete(val) {
      const target = toRaw(this);
      const rawVal = toRaw(val);
      const had = target.has(rawVal);
      const res = target.delete(rawVal);
      if (had) trigger(target, null, "DELETE");
      return res;
    },
    get(key) {
      const target = toRaw(this);
      track(target, key);
      const rawKey = toRaw(key);
      return target.get(rawKey);
    },
    set(key, val) {
      const target = toRaw(this);
      const rawKey = toRaw(key);
      const rawVal = toRaw(val);
      const had = target.has(rawKey);
      target.set(rawKey, rawVal);
      if (!had) trigger(target, null, "ADD");
      else trigger(target, null, "SET");
      return this;
    },
    has(key) {
      const target = toRaw(this);
      track(target, toRaw(key));
      return target.has(toRaw(key));
    },
    get size() {
      const target = toRaw(this);
      track(target, ITERATE_KEY);
      return target.size;
    },
    forEach(callback, thisArg) {
      const target = toRaw(this);
      track(target, ITERATE_KEY);
      target.forEach((v, k) => {
        callback.call(thisArg, reactive(v), reactive(k), this);
      });
    },
    keys() {
      const target = toRaw(this);
      track(target, MAP_KEY_ITERATE_KEY);
      return target.keys();
    },
    values() {
      const target = toRaw(this);
      track(target, ITERATE_KEY);
      return target.values();
    },
    entries() {
      const target = toRaw(this);
      track(target, ITERATE_KEY);
      return target.entries();
    },
    [Symbol.iterator]() {
      const target = toRaw(this);
      track(target, ITERATE_KEY);
      return target[Symbol.iterator]();
    },
  };
  return mutableInstrumentations;
}
const instrumentations = createInstrumentations();

function getTargetType(target) {
  const t = Object.prototype.toString.call(target);
  if (
    [
      "[object Set]",
      "[object Map]",
      "[object WeakSet]",
      "[object WeakMap]",
    ].includes(t)
  )
    return 2;
  if (Array.isArray(target)) return 1;
  return 0;
}

function createReactive(target, isShallow = false, isReadonly = false) {
  const existProxy = reactiveMap.get(target);
  if (existProxy) return existProxy;
  if (rawMap.has(target)) return target;

  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      if (key === "__v_raw") return target;
      const tType = getTargetType(target);
      if (tType === 2) return instrumentations[key];

      const res = Reflect.get(target, key, receiver);
      if (!isReadonly) track(target, key);
      if (isShallow) return res;
      if (res !== null && typeof res === "object") {
        return createReactive(res, false, isReadonly);
      }
      return res;
    },
    set(target, key, newVal, receiver) {
      if (isReadonly) {
        console.warn(`属性${String(key)}只读`);
        return true;
      }
      const oldVal = Reflect.get(target, key, receiver);
      const rawNewVal = toRaw(newVal);
      const hadKey = Array.isArray(target)
        ? Number(key) < target.length
        : Object.prototype.hasOwnProperty.call(target, key);
      const ok = Reflect.set(target, key, rawNewVal, receiver);
      if (ok && oldVal !== rawNewVal) {
        const type = hadKey ? "SET" : "ADD";
        trigger(target, key, type, newVal);
      }
      return ok;
    },
    has(target, key) {
      !isReadonly && track(target, key);
      return Reflect.has(target, key);
    },
    ownKeys(target) {
      !isReadonly && track(target, ITERATE_KEY);
      return Reflect.ownKeys(target);
    },
    deleteProperty(target, key) {
      if (isReadonly) {
        console.warn(`属性${String(key)}只读，不能删除`);
        return true;
      }
      const hadKey = Object.prototype.hasOwnProperty.call(target, key);
      const ok = Reflect.deleteProperty(target, key);
      if (ok && hadKey) trigger(target, key, "DELETE");
      return ok;
    },
  });
  reactiveMap.set(target, proxy);
  rawMap.set(proxy, target);
  return proxy;
}

function reactive(target) {
  return createReactive(target, false, false);
}
function shallowReactive(target) {
  return createReactive(target, true, false);
}
function readonly(target) {
  return createReactive(target, false, true);
}
function shallowReadonly(target) {
  return createReactive(target, true, true);
}
```

---

### 第6章 原始值的响应式方案

#### 📖精简面试笔记

Proxy不能代理字符串/数字/布尔/null/undefined原始类型；`ref`解决原始值响应；响应丢失问题；自动脱ref

1. **ref原理**
   - 把原始值包装成**普通对象`{ value:xxx }`**，对象可以被Proxy代理。
   - `RefImpl`类实现；`.value`属性get中track，set中trigger。
   - `shallowRef`：只包装`.value`，不对value内部做深度响应。
2. **响应丢失问题（非常高频面试）**
   ```js
   const obj = reactive({ foo: 1 });
   const { foo } = obj;
   foo++; // ❌不会触发响应；解构拿到普通原始值，脱离proxy代理
   ```

   - 场景：解构、展开运算符`...obj`、函数传参，响应式对象转为普通变量，丢失代理。
   - 解决：把属性包装为ref；`toRef`单个属性转ref；`toRefs`批量把reactive对象全部属性转为ref。
   - `toRef`：**不拷贝值**，内部访问原始reactive对象的属性；修改`.value`会同步修改源对象；源对象变化ref也同步变化。
3. **自动脱ref（unref）**
   - `unref`：如果是ref取`.value`，不是ref直接返回本身。
   - template模板中自动脱ref：模板顶层直接写ref变量，不用`.value`。
   - 注意：**对象属性不会自动脱ref**；`const obj = {a:ref(1)}`，模板 <code v-pre>{{obj.a}}</code>，仍要`.value`。
4. **API区分**
   | API | 作用 |
   |-----|------|
   | `ref(val)` | 包装原始/对象；对象内部会调用reactive做深响应 |
   | `shallowRef(val)` | 仅`.value`响应，value内部不递归代理 |
   | `toRef(obj,key)` | 拿reactive对象某个属性生成ref，**引用源对象，不是拷贝** |
   | `toRefs(obj)` | reactive对象全部属性批量转为ref，用于解构 |
   | `unref(val)` | 解包ref，不是ref原样返回 |
5. **面试题**
   1. Proxy为什么不能代理原始值？👉Proxy只接收对象类型。ref包装一层对象。
   2. toRef和直接`const r = ref(obj.foo)`区别？👉toRef**引用原始reactive对象**；ref是拷贝初始值，两者互不联动。
   3. 什么是响应丢失？什么场景出现？👉解构、展开reactive对象，原始值脱离proxy；用toRefs解决。
   4. 模板什么时候自动脱ref？👉顶层变量自动脱ref；作为对象属性不会自动脱ref。

#### 💻第6章完整最终代码（接第5章）

```js
// ========== 接第5章代码，第6章 ref相关 ==========
class RefImpl {
  constructor(value, isShallow = false) {
    this._rawValue = value;
    this._shallow = isShallow;
    this._value = isShallow ? value : reactive(value);
  }
  get value() {
    track(this, "value");
    return this._value;
  }
  set value(newVal) {
    newVal = toRaw(newVal);
    if (newVal === this._rawValue) return;
    this._rawValue = newVal;
    this._value = this._shallow ? newVal : reactive(newVal);
    trigger(this, "value", "SET");
  }
}

function ref(val) {
  return new RefImpl(val, false);
}
function shallowRef(val) {
  return new RefImpl(val, true);
}

function toRef(obj, key) {
  const wrapper = {
    get value() {
      return obj[key];
    },
    set value(val) {
      obj[key] = val;
    },
  };
  return wrapper;
}

function toRefs(obj) {
  const ret = {};
  for (const key in obj) {
    ret[key] = toRef(obj, key);
  }
  return ret;
}

function unref(val) {
  return val && typeof val === "object" && "value" in val ? val.value : val;
}
```

---

### 第7章 渲染器的设计

#### 📖精简面试笔记

**核心：渲染器把VNode转为真实DOM；渲染器与响应系统结合；自定义渲染器**

1. **渲染器职责**
   - `render(vnode, container)`：把虚拟节点vnode渲染到容器container。
   - 包含挂载mount、更新patch；如果vnode为null代表卸载DOM。
2. **VNode基础结构**
   ```js
   const vnode = {
     type: "div",
     props: { onClick: fn },
     children: "xxx",
   };
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

#### 💻第7章完整极简最终代码（书中最小自定义渲染器）

```js
// 模拟浏览器平台操作
const browserOps = {
  createElement(tag) {
    return document.createElement(tag);
  },
  createTextNode(text) {
    return document.createTextNode(text);
  },
  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor);
  },
  remove(el) {
    el.parentNode && el.parentNode.removeChild(el);
  },
  setElementText(el, text) {
    el.textContent = text;
  },
};

function createRenderer(options) {
  const { createElement, createTextNode, insert, remove, setElementText } =
    options;

  function mountElement(vnode, container) {
    const el = createElement(vnode.type);
    if (vnode.props) {
      for (const k in vnode.props) {
        const val = vnode.props[k];
        if (/^on/.test(k)) {
          el.addEventListener(k.slice(2).toLowerCase(), val);
        } else {
          el.setAttribute(k, val);
        }
      }
    }
    if (typeof vnode.children === "string") {
      setElementText(el, vnode.children);
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach((child) => patch(null, child, el));
    }
    insert(el, container);
  }

  function patch(n1, n2, container) {
    if (n1 && n1.type !== n2.type) {
      remove(n1.el);
      n1 = null;
    }
    if (!n1) {
      mountElement(n2, container);
    } else {
      const el = (n2.el = n1.el);
      // 更新props省略
      const oldCh = n1.children;
      const newCh = n2.children;
      if (typeof newCh === "string") {
        if (Array.isArray(oldCh)) {
          oldCh.forEach((c) => remove(c.el));
        }
        setElementText(el, newCh);
      } else if (Array.isArray(newCh)) {
        if (typeof oldCh === "string") {
          setElementText(el, "");
          newCh.forEach((c) => patch(null, c, el));
        } else if (Array.isArray(oldCh)) {
          // 第7章不实现完整diff，第9章简单diff
        }
      } else {
        setElementText(el, "");
      }
    }
  }

  function render(vnode, container) {
    if (vnode) {
      patch(container._vnode || null, vnode, container);
    } else {
      if (container._vnode) remove(container._vnode.el);
    }
    container._vnode = vnode;
  }
  return { render };
}

// 使用浏览器渲染器
const { render } = createRenderer(browserOps);
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

### 第8章 挂载与更新

#### 📖精简面试笔记

> 完善渲染器：属性、HTML Attribute vs DOM Property、class/style、事件、卸载、Fragment、文本注释节点

1. **HTML Attribute vs DOM Property（高频）**
   - Attribute：写在模板标签上的字符串；`el.setAttribute()`；HTML初始值；不会同步JS对象属性变化。
   - DOM Property：DOM对象JS属性；`el.xxx = val`；JS层面状态；如`el.value`。
   - input表单：`value`用DOM property；`setAttribute('value')只会设置初始默认值。
2. **class/style处理**
   - class支持：字符串 / 对象`{a:true}` / 数组。
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
