### DFS 深度优先搜索

DFS 算法讲解
[「代码随想录」DFS 算法精讲！](https://leetcode.cn/problems/all-paths-from-source-to-target/solutions/1666224/by-carlsun-2-66pf/)

> 找连通块、判断是否有环等

#### 连通块

```js
function (n, edges) {
    // 构建邻接表
    const graph = Array.from({ length: n }, () => []);
    const visited = Array(n).fill(0); // 访问标记数组

    // 初始化图的邻接关系（无向图需要双向添加）
    for (let [x, y] of edges) {
        graph[x].push(y);
        graph[y].push(x);
    }

    // DFS 遍历连通分量
    const dfs = (i) => {
        visited[i] = 1;
        // 遍历所有邻接节点
        for (let next of graph[i]) {
            if (!visited[next]) {
                dfs(next);
            }
        }
    }

    for (let i = 0; i < n; i++) {
        if (!visited[i]) {
          // ...
          dfs(i); // 联通块数加一
          //...
        }
    }
    // ...
};
```

#### 三色标记法

> 用于判断图是否有环

我们可以使用深度优先搜索来找环，并在深度优先搜索时，用三种颜色对节点进行标记，标记的规则如下：

白色（用 0 表示）：该节点尚未被访问；
灰色（用 1 表示）：该节点位于递归栈中，或者在某个环上；
黑色（用 2 表示）：该节点搜索完毕，是一个安全节点。
当我们首次访问一个节点时，将其标记为灰色，并继续搜索与其相连的节点。

如果在搜索过程中遇到了一个灰色节点，则说明找到了一个环，此时退出搜索，栈中的节点仍保持为灰色，这一做法可以将「找到了环」这一信息传递到栈中的所有节点上。

如果搜索过程中没有遇到灰色节点，则说明没有遇到环，那么递归返回前，我们将其标记由灰色改为黑色，即表示它是一个安全的节点。

> 题目：[802. 找到最终的安全状态](https://leetcode.cn/problems/find-eventual-safe-states/)

```js
/**
 * 找到图中的所有安全节点
 * @param {number[][]} graph 邻接表表示的图
 * @return {number[]}
 */
var eventualSafeNodes = function (graph) {
  const n = graph.length;
  const colors = Array(n).fill(0); // 0: 未访问，1: 访问中，2: 已确认安全
  const ans = [];
  for (let i = 0; i < n; i++) {
    // 如果没有在环中或通向环，则加入结果
    if (!hasCrucial(i, graph, colors)) {
      ans.push(i);
    }
  }
  return ans;
};

/**
 * 使用三色标记法检测环
 * @param {number} i 当前节点
 * @param {number[][]} graph 邻接表
 * @param {number[]} colors 颜色数组
 * @returns {boolean} 是否在环中或通向环
 */
const hasCrucial = (i, graph, colors) => {
  if (colors[i] > 0) {
    return colors[i] === 1; // 遇到访问中节点说明有环
  }
  colors[i] = 1; // 标记为访问中
  for (let next of graph[i]) {
    // 递归检查后续节点
    if (hasCrucial(next, graph, colors)) {
      return true;
    }
  }
  colors[i] = 2; // 所有后续节点安全，标记当前节点为安全
  return false;
};
```
