// --------------------------
// 桶：存储副作用
// targetMap: WeakMap<target, Map<key, Set<effectFn>>>
// --------------------------
const targetMap = new WeakMap()
let activeEffect
const effectStack = []
// 调度执行标记，用于scheduler
let shouldTrack = true

/**
 * 收集依赖
 * @param {object} target 原始对象
 * @param {string|symbol} key 属性key
 */
function track(target, key) {
  if (!activeEffect || !shouldTrack) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  deps.add(activeEffect)
  // effect保存自己关联的依赖集合，供cleanup使用
  activeEffect.deps.push(deps)
}

/**
 * 触发副作用执行
 * @param {object} target
 * @param {string|symbol} key
 */
function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  const effectsToRun = new Set()
  // 拷贝Set，防止forEach删除又添加导致死循环
  effects && effects.forEach(effectFn => {
    // 避免无限递归：当前触发的effect不能等于正在执行的activeEffect
    if (effectFn !== activeEffect) {
      effectsToRun.add(effectFn)
    }
  })
  effectsToRun.forEach(effectFn => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn)
    } else {
      effectFn()
    }
  })
}

// 清除遗留依赖 cleanup
function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}

/**
 * 注册副作用函数
 * @param {Function} fn 副作用逻辑
 * @param {object} options {lazy,scheduler}
 */
function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(effectFn)
    const res = fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
    return res
  }
  effectFn.options = options
  effectFn.deps = []
  // lazy为true，不立刻执行
  if (!options.lazy) {
    effectFn()
  }
  return effectFn
}

// --------------------------
// computed 实现 lazy + dirty
// --------------------------
function computed(getter) {
  let value
  let dirty = true

  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      if (!dirty) {
        dirty = true
        // 依赖变化，手动触发computed.value关联的外层effect
        trigger(obj, 'value')
      }
    }
  })

  const obj = {
    get value() {
      if (dirty) {
        value = effectFn()
        dirty = false
      }
      // 手动track，收集外层effect
      track(obj, 'value')
      return value
    }
  }
  return obj
}

// --------------------------
// watch实现，包含immediate、flush、onInvalidate过期副作用
// --------------------------

// 递归读取对象所有属性，用于收集全部依赖
function traverse(value, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has(value)) return
  seen.add(value)
  for (const k in value) {
    traverse(value[k], seen)
  }
  return value
}

/**
 *
 * @param {object|Function} source 响应式对象 或者 getter函数
 * @param {Function} cb 回调
 * @param {object} options {immediate, flush}
 */
function watch(source, cb, options = {}) {
  let getter
  if (typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }

  let oldValue, newValue
  let cleanup // 保存onInvalidate注册的清理函数

  // 用户注册过期回调
  function onInvalidate(fn) {
    cleanup = fn
  }

  const job = () => {
    newValue = effectFn()
    // 执行上一轮过期副作用
    if (cleanup) {
      cleanup()
    }
    cb(newValue, oldValue, onInvalidate)
    oldValue = newValue
  }

  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      if (options.flush === 'post') {
        const p = Promise.resolve()
        p.then(job)
      } else {
        job()
      }
    }
  })

  if (options.immediate) {
    job()
  } else {
    oldValue = effectFn()
  }
}

// ==========================================
// 【测试示例】
// 注意！！本代码只是第四章逻辑层，**没有Proxy代理**！
// track、trigger需要手动调用；第五章才会封装Proxy做reactive。
// ==========================================
/*
// 模拟原始数据
const data = { foo: 1, bar: 2, ok: true, text: 'hello' }

// 测试effect
effect(() => {
  console.log('effect执行', data.foo)
  track(data, 'foo')
})
// 修改，手动trigger（因为没有Proxy拦截set）
data.foo = 10
trigger(data, 'foo')

// 测试computed
const sum = computed(() => {
  track(data, 'foo')
  track(data, 'bar')
  return data.foo + data.bar
})
console.log(sum.value)

// 测试watch
watch(
  () => {
    track(data, 'foo')
    return data.foo
  },
  (nv, ov) => {
    console.log('watch触发', nv, ov)
  },
  { immediate: false }
)
*/