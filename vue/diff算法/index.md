### 简单 diff 算法

操作 DOM 的开销是很大的，所以当新旧 VNode 都是一组节点的时候，我们需要尽可能的复用已经存在的节点，而不是频繁的创建新的节点。所以以最小的性能开销完成更
新操作，需要比较两组子节点，用于比较的算法就叫作 Diff 算法。

#### 未使用 key 的情况

未使用 key 的时候，会按照新旧 VNode 数组的索引位置进行逐位对比(patch)更新真实 DOM。

![更新节点](../../image/vue/更新节点.png)
如果新旧 VNode 数组长度不一致：

- 新的 VNode 数组的长度大于旧的 VNode 数组的长度，那么就会在末尾挂在对应节点。![挂载新节点](../../image/vue/挂载新节点.png)
- 新的 VNode 数组的长度小于旧的 VNode 数组的长度，那么就会卸载多余的节点。![卸载节点](../../image/vue/卸载节点.png)

```js
/**
 * 处理未使用key的情况
 * @param c1 旧子节点数组
 * @param c2 新子节点数组
 * @param container 容器
 */
 const patchUnkeyedChildren = (
  c1: VNode[],
  c2: VNodeArrayChildren,
  container: RendererElement
) => {
  // 标准化新旧子节点数组（处理空值情况）
  c1 = c1 || EMPTY_ARR
  c2 = c2 || EMPTY_ARR
  const oldLength = c1.length  // 旧子节点数量
  const newLength = c2.length  // 新子节点数量
  const commonLength = Math.min(oldLength, newLength) // 公共区间长度

  // 遍历公共区间进行就地更新
  let i
  for (i = 0; i < commonLength; i++) {
    // 克隆或标准化新子节点（处理SSR hydration情况）
    const nextChild = (c2[i] = optimized
      ? cloneIfMounted(c2[i] as VNode)
      : normalizeVNode(c2[i]))
    // 递归patch相同位置的子节点
    patch(
      c1[i],
      nextChild,
      container
    )
  }

  if (oldLength > newLength) {
    // 卸载多余的旧子节点（从公共区间结束位置开始）
    unmountChildren(
      c1,
      // ...,
      commonLength, // 从公共区间后开始移除
    )
  } else {
    // 挂载新增的子节点（从公共区间结束位置开始）
    mountChildren(
      c2,
      container,
      // ...,
      commonLength, // 挂载起始位置
    )
  }
}
```

#### DOM 复用与 key 的作用

上述的操作中是逐位比对新旧 VNode 数组的索引位置，无法复用移动后的节点。所以需要确定新的子节点是否出现在旧的一组子节点中，因此需要为每个 VNode 都指定
一个唯一的 key。

**如何寻找需要移动的节点：**

- 当新旧两组子节点的节点顺序不变时，就不需要额外的移动操作，新节点在旧节点中的索引位置按顺序分别为[0,1,2]，具有递增性

- 当顺序变化时
  ![新旧子节点位置](../../image/vue/新旧子节点位置.png)
  新节点在旧节点中的索引位置按顺序分别为[2,0,1]，不具有递增性，所以需要移动节点。

1. 初始化基准索引

- 设置 lastIndex = 0，记录遍历过程中遇到的最大旧节点索引

2. 新节点遍历阶段

```javascript
for (新节点数组) {
   在旧节点数组中查找相同key的节点
   if (找到可复用节点) {
      更新节点内容(patch)
      if (旧索引 < lastIndex) {
         移动DOM到正确位置
      } else {
         更新lastIndex = 当前旧索引
      }
   } else {
      挂载新节点到正确位置
   }
}
```

3. DOM 移动规则

移动条件：当旧节点索引 j < lastIndex
锚点选择：前驱节点的下一个兄弟节点
插入方式：insertBefore DOM API

4. 新增节点挂载

首节点：插入到容器第一个位置
后续节点：插入到前驱节点之后

5. 旧节点清理阶段

```javascript
for (旧节点数组) {
   if (不在新节点数组中) {
      卸载该节点
   }
```

1. 递增序列优化
   当旧索引序列保持递增时（如[0,1,2]），算法无需移动任何节点，仅更新内容

1. 移动最少化原则
   通过 lastIndex 基准值，确保仅当节点顺序发生逆序时才执行 DOM 移动

1. 双端锚点定位
   挂载新节点时：

- 首节点使用 container.firstChild 作为锚点
- 后续节点使用前驱节点的 nextSibling 作为锚点

1. 全量清理机制
   最后遍历旧节点数组时，会全量检查所有需要删除的废弃节点

```js
function patchKeyedChildren() {
  // ...

  // 用来存储寻找过程中遇到的最大索引值
  let lastIndex = 0;
  for (let i = 0; i < newChildren.length; i++) {
    const newVNode = newChildren[i];
    // 在第一层循环中定义变量 find，代表是否在旧的一组子节点中找到可复用的节点，
    // 初始值为 false，代表没找到
    let find = false;
    for (let j = 0; j < oldChildren.length; j++) {
      const oldVNode = oldChildren[j];
      if (newVNode.key === oldVNode.key) {
        // 一旦找到可复用的节点，则将变量 find 的值设为 true
        find = true;
        // 调用 patch 函数进行更新
        patch(oldVNode, newVNode, container);
        if (j < lastIndex) {
          // 如果当前找到的节点在旧 children 中的索引小于最大索引值lastIndex,
          // 说明该节点对应的真实 DOM 需要移动
          const prevVNode = newChildren[i - 1];
          if (prevVNode) {
            // 由于我们要将 newVNode 对应的真实 DOM 移动到prevVNode 所对应真实 DOM 后面，
            // 所以我们需要获取 prevVNode 所对应真实 DOM 的下一个兄弟节点，并将其作为锚点
            const anchor = prevVNode.el.nextSibling;
            // 调用 insert 方法将 newVNode 对应的真实 DOM 插入到锚点元素前面，
            // 也就是 prevVNode 对应真实 DOM 的后面
            insert(newVNode.el, container, anchor);
          }
        } else {
          // 如果当前找到的节点在旧 children 中的索引不小于最大索引值，
          // 则更新 lastIndex 的值
          lastIndex = j;
        }
        break; // 这里需要 break
      }
    }

    // 如果代码运行到这里，find 仍然为 false， 说明在旧的一组子节点中没有找到可复用的节点
    // 也就是说，当前 newVNode 是新增节点，需要挂载
    if (!find) {
      // 为了将节点挂载到正确位置，我们需要先获取锚点元素
      // 首先获取当前 newVNode 的前一个 vnode 节点
      const prevVNode = newChildren[i - 1];
      let anchor = null;
      if (prevVNode) {
        // 如果有前一个 vnode 节点，则使用它的下一个兄弟节点作为锚点元素
        anchor = prevVNode.el.nextSibling;
      } else {
        // 如果没有前一个 vnode 节点，说明即将挂载的新节点是第一个子节点
        // 这时我们使用容器元素的 firstChild 作为锚点
        anchor = container.firstChild;
      }
      // 挂载 newVNode
      patch(null, newVNode, container, anchor);
    }
  }

  // 上一步的更新操作完成后
  // 遍历旧的一组子节点
  for (let i = 0; i < oldChildren.length; i++) {
    const oldVNode = oldChildren[i];
    // 拿旧子节点 oldVNode 去新的一组子节点中寻找具有相同 key 值的节点
    const has = newChildren.find((vnode) => vnode.key === oldVNode.key);
    if (!has) {
      // 如果没有找到具有相同 key 值的节点，则说明需要删除该节点
      // 调用 unmount 函数将其卸载
      unmount(oldVNode);
    }
  }

  // ...
}
```

**diff 算法入口：**

```js
// 比较两组子节点的函数
const patchChildren: PatchChildrenFn = (
  n1,
  n2,
  container,
  anchor,
  parentComponent,
  parentSuspense,
  namespace: ElementNamespace,
  slotScopeIds,
  optimized = false,
) => {
  const c1 = n1 && n1.children // 旧子节点
  const prevShapeFlag = n1 ? n1.shapeFlag : 0 // 旧VNode的形状标志
  const c2 = n2.children // 新子节点

  const { patchFlag, shapeFlag } = n2
  // 快速路径处理
  if (patchFlag > 0) {
    // 处理带有key的Fragment（可能包含混合key的情况）
    if (patchFlag & PatchFlags.KEYED_FRAGMENT) {
      patchKeyedChildren(
        c1 as VNode[],
        c2 as VNodeArrayChildren,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
      )
      return
    }
    // 处理不带key的Fragment
    else if (patchFlag & PatchFlags.UNKEYED_FRAGMENT) {
      patchUnkeyedChildren(
        c1 as VNode[],
        c2 as VNodeArrayChildren,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
      )
      return
    }
  }

  // 处理子节点的三种情况：文本节点、数组子节点或无子节点
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    // 文本子节点快速路径
    if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 如果旧节点是数组，先卸载所有旧子节点
      unmountChildren(c1 as VNode[], parentComponent, parentSuspense)
    }
    // 更新文本内容（当新旧文本不同时）
    if (c2 !== c1) {
      hostSetElementText(container, c2 as string)
    }
  } else {
    // 处理数组子节点的情况
    if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 旧子节点是数组的情况
      if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 新旧都是数组，进行全量diff
        patchKeyedChildren(
          c1 as VNode[],
          c2 as VNodeArrayChildren,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
        )
      } else {
        // 新子节点不是数组，卸载所有旧子节点
        unmountChildren(c1 as VNode[], parentComponent, parentSuspense, true)
      }
    } else {
      // 旧子节点是文本或空的情况
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        // 清除旧文本内容
        hostSetElementText(container, '')
      }
      // 挂载新的数组子节点
      if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(
          c2 as VNodeArrayChildren,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
        )
      }
    }
  }
}
```

### 双端 diff 算法

简单 diff 算法的时间复杂度为 O(n^2)，在处理大量节点时，性能可能会受到影响。

其次在处理一些场景时，简单 diff 算法对节点的移动次数不是最优的，比如在以下场景中：

- 新节点 3 1 2，旧节点 1 2 3，简单 diff 算法会将 1 移动到 2 的后面，然后将 2 移动到 3 的后面，这样就需要移动两次。

而最优的移动次数是一次，即将 3 移动到 1 的前面。

为了优化这个问题，Vue 引入了双端 diff 算法。

双端 diff 算法的基本思想是：

- 从新旧两组子节点的两端开始向中间遍历，
- 当遇到相同的节点时，就将它们移动到正确的位置，
- 当遇到不同的节点时，就将它们卸载或重新挂载。。

**双端 diff 算法的流程：**

1. 用 startNewHead 和 startOldHead 分别指向新节点和旧节点的开头，用 endNewHead 和 endOldHead 分别指向新节点和旧节点的结尾。循环执行以下 if () else if () 操作，直到 startNewHead 大于 endNewHead 或者 startOldHead 大于 endOldHead。
   1. 比对 startNewHead 和 startOldHead 指向的节点，如果两个节点 key 相同，表明 startOldHead 的真实 Dom 的位置不需要移动，只要进行 patch 操作，然后将 startNewHead 和 startOldHead 都向后移动一位。
   2. 比对 endNewHead 和 endOldHead 指向的节点，如果两个节点 key 相同，表明 endOldHead 的真实 Dom 的位置不需要移动，只要进行 patch 操作，然后将 endNewHead 和 endOldHead 都向前移动一位。
   3. 比对 startOldHead 和 endNewHead 指向的节点，如果两个节点 key 相同，表明 startOldHead 的真实 Dom 的位置需要移动到 endNewHead, 以 endNewHead 的后一位的真实 DOM 为锚点，进行 patch 操作，然后将 startOldHead--，endNewHead++。
   4. 比对 endOldHead 和 startNewHead 指向的节点，如果两个节点 key 相同，表明 endOldHead 的真实 Dom 的位置需要移动到 startNewHead, 以 startNewHead 的前一位的真实 DOM 为锚点，进行 patch 操作，然后将 endOldHead++，startNewHead--。
   5. 如果以上四种情况都不满足，需要在旧节点中寻找与 startNewHead 指向的 NewVNode 节点 key 相同的节点
      1. 如果找到对应节点，进行 patch 操作，并将对应真实 DOM 移动到 移动到头部节点 oldStartVNode.el 之前，以 oldStartVNode.el 为锚点，进行 insert 操作。之后对应节点的位置在旧节点中置空（undefined），更新 startNewHead++。
      2. 如果没有找到对应节点，说明该节点是新节点，需要挂载到头部节点 oldStartVNode.el 之前，以 oldStartVNode.el 为锚点，进行 patch 操作挂载新节点 DOM，更新 startNewHead++。
2. 当循环终止时，判断：
   1. 如果 startNewHead 小于 endNewHead，说明新节点中还有未处理的节点，需要将这些节点挂载到头部节点 oldStartVNode.el (此时 oldEndVNode 越界) 之前，以 oldStartVNode.el 为锚点，进行 patch 操作挂载新节点 DOM。
   2. 如果 startOldHead 小于 endOldHead，说明旧节点中还有未处理的节点，需要将这些节点卸载。

```js
function vue2Diff(oldChildren, newChildren, container) {
  let oldStartIdx = 0;
  let oldEndIdx = oldChildren.length - 1;
  let newStartIdx = 0;
  let newEndIdx = newChildren.length - 1;

  // 创建旧节点映射表 { key => index }
  const keyIndexMap = {};
  oldChildren.forEach((child, i) => (keyIndexMap[child.key] = i));

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 头头比对
    if (isSameVNode(oldChildren[oldStartIdx], newChildren[newStartIdx])) {
      patchVNode(oldChildren[oldStartIdx], newChildren[newStartIdx]);
      oldStartIdx++;
      newStartIdx++;
    }
    // 尾尾比对
    else if (isSameVNode(oldChildren[oldEndIdx], newChildren[newEndIdx])) {
      patchVNode(oldChildren[oldEndIdx], newChildren[newEndIdx]);
      oldEndIdx--;
      newEndIdx--;
    }
    // 旧头新尾比对
    else if (isSameVNode(oldChildren[oldStartIdx], newChildren[newEndIdx])) {
      const anchor = oldChildren[oldEndIdx].el.nextSibling;
      container.insertBefore(oldChildren[oldStartIdx].el, anchor);
      patchVNode(oldChildren[oldStartIdx], newChildren[newEndIdx]);
      oldStartIdx++;
      newEndIdx--;
    }
    // 旧尾新头比对
    else if (isSameVNode(oldChildren[oldEndIdx], newChildren[newStartIdx])) {
      const anchor = oldChildren[oldStartIdx].el;
      container.insertBefore(oldChildren[oldEndIdx].el, anchor);
      patchVNode(oldChildren[oldEndIdx], newChildren[newStartIdx]);
      oldEndIdx--;
      newStartIdx++;
    }
    // 非理想情况处理
    else {
      const newStartKey = newChildren[newStartIdx].key;
      const oldIndex = keyIndexMap[newStartKey];

      if (oldIndex !== undefined) {
        const oldVNode = oldChildren[oldIndex];
        // 移动找到的旧节点
        const anchor = oldChildren[oldStartIdx].el;
        container.insertBefore(oldVNode.el, anchor);
        // 标记已处理节点
        oldChildren[oldIndex] = undefined;
        patchVNode(oldVNode, newChildren[newStartIdx]);
      } else {
        // 挂载新节点
        mountElement(
          newChildren[newStartIdx],
          container,
          oldChildren[oldStartIdx].el
        );
      }
      newStartIdx++;
    }
  }

  // 处理剩余新节点
  if (newStartIdx <= newEndIdx) {
    const anchor =
      newEndIdx + 1 < newChildren.length ? newChildren[newEndIdx + 1].el : null;
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      mountElement(newChildren[i], container, anchor);
    }
  }

  // 处理剩余旧节点
  if (oldStartIdx <= oldEndIdx) {
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      if (oldChildren[i]) {
        unmount(oldChildren[i]);
      }
    }
  }
}

// 辅助函数
function isSameVNode(a, b) {
  return a && b && a.key === b.key && a.tag === b.tag;
}
```

### 快速 diff 算法

#### 预处理

在正式 diff 之前，快速 diff 算法会进行预处理，将新节点和旧节点对齐。以文本举例：

```
newVNode = 'hello world, how are you?'
oldVNode = 'hello JavaScript, how are you?'
```

其实新旧节点之间不同的只有中间的'world'和'JavaScript'，所以在进行 diff 之前，快速 diff 算法会将新旧节点进行预处理，将起始和结束位置相同的节点进行 patch。

预处理的过程是：

1. 初始化头部指针 i = 0，尾部指针 e1 = oldVNode.length - 1, e2 = newVNode.length - 1
2. while 循环比对 newVNode[i]和 oldVNode[i]的 key 是否相等，相等则 i++，直到 i 越界(i >= e1 || i >= e2)或 newVNode[i]和 oldVNode[i]的 key 不相等为止。
3. while 循环比对 newVNode[e2]和 oldVNode[e1]的 key 是否相等，相等则 e1--，e2--，直到 e1 < i 或 e2 < i 或 newVNode[e2]和 oldVNode[e1]的 key 不相等为止。
4. 两个 while 循环结束后，如果：
   1. i > e1，说明旧节点中所有节点都被预处理了，如果此时 i <= e2，说明新节点剩余未处理的节点都是新节点，需要挂载，以 oldVNode[i].el(newVNode[e2 + 1].el)为锚点，进行 patch 操作挂载新节点 DOM。
   2. i <= e1 && i > e2，说明新节点中所有节点都被预处理了，旧节点剩余未处理的节点都是旧节点，需要卸载。

#### 寻找需要移动的节点

1. 经过预处理后，此时新旧节点的头部指针为 s2 = s1 = i，尾部指针为 e2，e1
2. 获取新节点在旧节点中的索引位置数组：
   1. 初始化一个长度为 e2 - s2 + 1 的数组 source（初始为 -1， ？？？ 为什么源码设置为 0），用于存储新节点在旧节点中的索引位置。
   2. 创建 map 对象，用于存储新节点（s2~e2）中每个节点的 key 和索引位置。
   3. 初始 patched 变量记录更新的节点数量，moved 变量标记是否需要移动节点，pos 当前遍历时新节点在旧节点中的最大下标用于判断是否需要移动节点。遍历未处理的旧节点（s1~e1）,在 map 对象中查找对应 key 的新节点：
      1. 如果找到则执行 patch，patched++，并将该节点的索引位置(j)存储到数组 source 中，用 j 于 pos 比较，判断是否更新 pos 和 moved。（source[map.get(key)] = j，表示新节点在旧节点中的下标为 j）
      2. 如果找不到则将该旧节点卸载。
      3. 如果遍历时 patched 大于未处理的新节点数量(e2 - s2 + 1)，则卸载后续所有对应的旧节点。
3. 获得 source 数组的最长递增子序列 seq(source 数组中的下标)：

   1. 二分查找 + 贪心算法
      获得最长递增子序列下标数组后，需要进行回溯处理。(https://segmentfault.com/a/1190000039838442)
      如 10 9 2 5 3 7 101 18 1，所获得的 result 数组为[8, 4, 5, 7]，应为后续较小的值下标会覆盖先前的值，所以最终获得的数组不能直接使用。
      需要记录 result 中的每个值是从哪一个值转移而来的，即记录每个值的前驱索引。最后从 result 的最后一直回溯正确是最长递增子序列的下标。

   ```js
   function getSequence(arr: number[]): number[] {
     const p = arr.slice(); // 用于记录每个元素的前驱索引
     const result = [0]; // 存储当前找到的最长递增子序列的索引
     let i, j, u, v, c;
     const len = arr.length;

     // 构建最长递增子序列的优化路径
     for (i = 0; i < len; i++) {
       const arrI = arr[i];
       if (arrI !== 0) {
         j = result[result.length - 1];

         // 当前元素大于序列最后一个元素，直接扩展序列
         if (arr[j] < arrI) {
           p[i] = j; // 记录前驱位置
           result.push(i); // 将当前索引加入结果序列
           continue;
         }

         // 二分查找找到最合适的插入位置
         u = 0;
         v = result.length - 1;
         while (u < v) {
           c = (u + v) >> 1; // 取中间位置
           if (arr[result[c]] < arrI) {
             u = c + 1; // 在右半部分继续查找
           } else {
             v = c; // 在左半部分继续查找
           }
         }

         // 替换序列中第一个大于当前元素的值
         if (arrI < arr[result[u]]) {
           if (u > 0) {
             p[i] = result[u - 1]; // 记录前驱索引
           }
           result[u] = i; // 替换当前位置的索引
         }
       }
     }

     // 回溯重构最长递增子序列
     u = result.length;
     v = result[u - 1];
     while (u-- > 0) {
       // 从后往前填充最终结果
       result[u] = v; // 填入正确的索引顺序
       v = p[v]; // 通过前驱索引回溯
     }
     return result;
   }
   ```

4. 根据最长递增子序列(source 数组中的下标)，将新节点移动到正确位置：
   1. 设定指针 s 和 i 分别指向 seq 和 source 数组的末尾
   2. for 循环 i >= 0，
      1. 如果 i 和 seq[s]相等，说明当前位置的节点不需要移动，将 s--，i--。
      2. 如果 source[i] == -1, 说明当前位置的节点是新节点，需要挂载，以 newVNode[i + s2 + 1].el 为锚点，进行 patch 操作挂载新节点 DOM。
      3. 如果 i 和 seq[s]不相等，说明当前位置的节点需要移动，以 newVNode[i + s2 + 1].el 为锚点，进行 patch 操作移动节点。

```js
  const patchKeyedChildren = (
    c1: VNode[],
    c2: VNodeArrayChildren,
    container: RendererElement,
    parentAnchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    namespace: ElementNamespace,
    slotScopeIds: string[] | null,
    optimized: boolean,
  ) => {
    let i = 0
    const l2 = c2.length
    let e1 = c1.length - 1 // prev ending index
    let e2 = l2 - 1 // next ending index

    // 1. sync from start
    // (a b) c
    // (a b) d e
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = (c2[i] = optimized
        ? cloneIfMounted(c2[i] as VNode)
        : normalizeVNode(c2[i]))
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
        )
      } else {
        break
      }
      i++
    }

    // 2. sync from end
    // a (b c)
    // d e (b c)
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = (c2[e2] = optimized
        ? cloneIfMounted(c2[e2] as VNode)
        : normalizeVNode(c2[e2]))
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
        )
      } else {
        break
      }
      e1--
      e2--
    }

    // 3. common sequence + mount
    // (a b)
    // (a b) c
    // i = 2, e1 = 1, e2 = 2
    // (a b)
    // c (a b)
    // i = 0, e1 = -1, e2 = 0
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1
        const anchor = nextPos < l2 ? (c2[nextPos] as VNode).el : parentAnchor
        while (i <= e2) {
          patch(
            null,
            (c2[i] = optimized
              ? cloneIfMounted(c2[i] as VNode)
              : normalizeVNode(c2[i])),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
          )
          i++
        }
      }
    }

    // 4. common sequence + unmount
    // (a b) c
    // (a b)
    // i = 2, e1 = 2, e2 = 1
    // a (b c)
    // (b c)
    // i = 0, e1 = 0, e2 = -1
    else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true)
        i++
      }
    }

    // 5. unknown sequence
    // [i ... e1 + 1]: a b [c d e] f g
    // [i ... e2 + 1]: a b [e d c h] f g
    // i = 2, e1 = 4, e2 = 5
    else {
      const s1 = i // prev starting index
      const s2 = i // next starting index

      // 5.1 build key:index map for newChildren
      const keyToNewIndexMap: Map<string | number | symbol, number> = new Map()
      for (i = s2; i <= e2; i++) {
        const nextChild = (c2[i] = optimized
          ? cloneIfMounted(c2[i] as VNode)
          : normalizeVNode(c2[i]))
        if (nextChild.key != null) {
          if (__DEV__ && keyToNewIndexMap.has(nextChild.key)) {
            warn(
              `Duplicate keys found during update:`,
              JSON.stringify(nextChild.key),
              `Make sure keys are unique.`,
            )
          }
          keyToNewIndexMap.set(nextChild.key, i)
        }
      }

      // 5.2 loop through old children left to be patched and try to patch
      // matching nodes & remove nodes that are no longer present
      let j
      let patched = 0
      const toBePatched = e2 - s2 + 1
      let moved = false
      // used to track whether any node has moved
      let maxNewIndexSoFar = 0
      // works as Map<newIndex, oldIndex>
      // Note that oldIndex is offset by +1
      // and oldIndex = 0 is a special value indicating the new node has
      // no corresponding old node.
      // used for determining longest stable subsequence
      const newIndexToOldIndexMap = new Array(toBePatched)
      for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0

      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i]
        if (patched >= toBePatched) {
          // all new children have been patched so this can only be a removal
          unmount(prevChild, parentComponent, parentSuspense, true)
          continue
        }
        let newIndex
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          // key-less node, try to locate a key-less node of the same type
          for (j = s2; j <= e2; j++) {
            if (
              newIndexToOldIndexMap[j - s2] === 0 &&
              isSameVNodeType(prevChild, c2[j] as VNode)
            ) {
              newIndex = j
              break
            }
          }
        }
        if (newIndex === undefined) {
          unmount(prevChild, parentComponent, parentSuspense, true)
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex
          } else {
            moved = true
          }
          patch(
            prevChild,
            c2[newIndex] as VNode,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
          )
          patched++
        }
      }

      // 5.3 move and mount
      // generate longest stable subsequence only when nodes have moved
      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToOldIndexMap)
        : EMPTY_ARR
      j = increasingNewIndexSequence.length - 1
      // looping backwards so that we can use last patched node as anchor
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i
        const nextChild = c2[nextIndex] as VNode
        const anchor =
          nextIndex + 1 < l2 ? (c2[nextIndex + 1] as VNode).el : parentAnchor
        if (newIndexToOldIndexMap[i] === 0) {
          // mount new
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
          )
        } else if (moved) {
          // move if:
          // There is no stable subsequence (e.g. a reverse)
          // OR current node is not among the stable sequence
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, MoveType.REORDER)
          } else {
            j--
          }
        }
      }
    }
  }
```
