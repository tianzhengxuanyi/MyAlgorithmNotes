### 图 DP

#### [3243. 新增道路查询后的最短距离 I](https://leetcode.cn/problems/shortest-distance-after-road-addition-queries-i/description/)

给你一个整数 n 和一个二维整数数组 queries。

有 n 个城市，编号从 0 到 n - 1。初始时，每个城市 i 都有一条单向道路通往城市 i + 1（ 0 <= i < n - 1）。

queries[i] = [ui, vi] 表示新建一条从城市 ui 到城市 vi 的单向道路。每次查询后，你需要找到从城市 0 到城市 n - 1 的最短路径的长度。

返回一个数组 answer，对于范围 [0, queries.length - 1] 中的每个 i，answer[i] 是处理完前 i + 1 个查询后，从城市 0 到城市 n - 1 的最短路径的长度。

**动态规划**

```js
/**
 * 计算在添加新道路后，从城市0到城市n-1的最短距离变化
 * @param {number} n - 城市数量
 * @param {number[][]} queries - 查询数组，每个查询表示添加一条从u到v的道路
 * @return {number[]} - 每次查询后从0到n-1的最短距离数组
 */
var shortestDistanceAfterQueries = function (n, queries) {
  // 初始化图的邻接表：每个城市i默认只连接i+1(除了最后一个城市)
  const graph = Array.from({ length: n }, (_, i) =>
    i === n - 1 ? [] : [i + 1]
  );

  // 初始化动态规划数组f：f[i]表示从i到n-1的最短距离
  // 初始状态下，每个城市i到终点的距离是n-i-1(因为只能走i→i+1→...→n-1)
  const f = Array.from({ length: n }, (_, i) => n - i - 1);

  const len = queries.length;
  // 初始化结果数组，默认值为n-1(初始状态下0到n-1的距离)
  const ans = Array(len).fill(n - 1);

  for (let i = 0; i < len; i++) {
    let [u, v] = queries[i];
    // 更新u到终点的最短距离：可能通过新添加的u→v道路更近
    f[u] = Math.min(f[u], f[v] + 1);
    // 将新道路添加到邻接表
    graph[u].push(v);

    // 逆向更新u之前所有城市的最短距离(因为新道路可能影响前面的路径)
    for (let j = u - 1; j >= 0; j--) {
      for (let next of graph[j]) {
        // 尝试通过所有邻接城市更新当前城市的最短距离
        f[j] = Math.min(f[j], f[next] + 1);
      }
    }

    // 记录当前查询后的最短距离
    ans[i] = f[0];
  }

  return ans;
};
```

#### [787. K 站中转内最便宜的航班](https://leetcode.cn/problems/cheapest-flights-within-k-stops/description/)

有 n 个城市通过一些航班连接。给你一个数组 flights ，其中 flights[i] = [fromi, toi, pricei] ，表示该航班都从城市 fromi 开始，以价格 pricei 抵达 toi。

现在给定所有的城市和航班，以及出发城市 src 和目的地 dst，你的任务是找到出一条最多经过 k 站中转的路线，使得从 src 到 dst 的 价格最便宜 ，并返回该价格。 如果不存在这样的路线，则输出 -1。

```js
/**
 * @param {number} n
 * @param {number[][]} flights
 * @param {number} src
 * @param {number} dst
 * @param {number} k
 * @return {number}
 */
var findCheapestPrice = function (n, flights, src, dst, k) {
    // 初始化DP数组：使用滚动数组优化空间复杂度
    // f[i][j]表示最多经过i次中转，从城市j到dst的最小花费
    const f = Array.from({ length: 2 }, () => Array(n).fill(Infinity));
    
    // 基准情况：从dst到dst不需要任何花费
    f[0][dst] = 0;
    
    let ans = Infinity; // 初始化答案为无穷大
    
    // 动态规划过程，i从1到k+1（因为最多k次中转意味着最多k+1次航班）
    for (let i = 1; i < k + 2; i++) {
        // 遍历所有航班
        for (let [x, y, v] of flights) {
            // 状态转移：从x出发，搭乘一次航班到y，然后从y继续
            // 使用滚动数组优化空间，只保留当前和前一轮的状态
            f[i % 2][x] = Math.min(f[i % 2][x], f[(i - 1) % 2][y] + v);
        }
        // 每次迭代后更新从src出发的最小花费
        ans = Math.min(ans, f[i % 2][src]);
    }

    // 如果答案未被更新，说明没有可行路径
    return ans === Infinity ? -1 : ans;
};

```

#### [3620. 恢复网络路径](https://leetcode.cn/problems/fruit-into-baskets/description/)

给你一个包含 n 个节点（编号从 0 到 n - 1）的有向无环图。图由长度为 m 的二维数组 edges 表示，其中 edges[i] = [ui, vi, costi] 表示从节点 ui 到节点 vi 的单向通信，恢复成本为 costi。

一些节点可能处于离线状态。给定一个布尔数组 online，其中 online[i] = true 表示节点 i 在线。节点 0 和 n - 1 始终在线。

从 0 到 n - 1 的路径如果满足以下条件，那么它是 有效 的：

- 路径上的所有中间节点都在线。
- 路径上所有边的总恢复成本不超过 k。

对于每条有效路径，其 分数 定义为该路径上的最小边成本。

返回所有有效路径中的 **最大** 路径分数（即最大 **最小** 边成本）。如果没有有效路径，则返回 -1。

**最大化最小值 -> 二分**

**思路：**

二分查找最小边成本，判断在最小成本为c的情况下，是否存在有效路径，即路径的最小总成本小于k。

```js
/**
 * @param {number[][]} edges
 * @param {boolean[]} online
 * @param {number} k
 * @return {number}
 */
/**
 * 寻找有效路径中的最大路径分数（即最大最小边成本）
 * @param {number[][]} edges - 边数组，每个元素为[起点, 终点, 成本]
 * @param {boolean[]} online - 节点在线状态数组
 * @param {number} k - 最大允许的总恢复成本
 * @return {number} - 所有有效路径中的最大路径分数，若无有效路径则返回-1
 */
var findMaxPathScore = function (edges, online, k) {
    // 边界条件：若无边则直接返回-1
    if (edges.length === 0) return -1;
    
    const n = online.length;
    // 构建邻接表表示的图
    const graph = Array.from({ length: n }, () => []);
    // 记录边成本的最小值和最大值，用于二分查找范围
    let mn = Infinity,
        mx = 0;
    
    // 遍历所有边，构建图并筛选在线节点
    for (let [x, y, c] of edges) {
        // 只有起点和终点都在线的边才被加入图中
        if (online[x] && online[y]) {
            graph[x].push([y, c]);
            mn = Math.min(mn, c);  // 更新最小边成本
            mx = Math.max(mx, c);  // 更新最大边成本
        }
    }

    // 记忆化数组，存储已计算的节点最小成本
    let memo = Array(n).fill(-1);
    
    /**
     * 深度优先搜索计算最小总成本
     * @param {number} i - 当前节点
     * @param {number} m - 要求的最小边成本
     * @return {number} - 从i到终点的最小总成本，若不可达则返回Infinity
     */
    const dfs = (i, m) => {
        // 到达终点，成本为0
        if (i === n - 1) return 0;
        // 若已计算过当前节点，直接返回记忆化结果
        if (memo[i] != -1) return memo[i];
        
        let res = Infinity;  // 初始化结果为无穷大
        // 遍历当前节点的所有邻接节点
        for (let [next, cost] of graph[i]) {
            // 跳过成本小于最小要求的边
            if (cost < m) continue;
            // 递归计算通过next节点到达终点的成本，并取最小值
            res = Math.min(res, dfs(next, m) + cost);
        }
        
        // 记忆化存储结果并返回
        return (memo[i] = res);
    };
    
    // 二分查找最大的最小边成本
    let left = mn, right = mx;
    while (left <= right) {
        const mid = Math.floor((right - left) / 2) + left;
        // 重置记忆化数组
        memo.fill(-1);
        // 检查当前mid值是否可行（从起点到终点的最小总成本是否不超过k）
        if (dfs(0, mid) <= k) {
            // 可行，尝试寻找更大的最小值
            left = mid + 1;
        } else {
            // 不可行，尝试寻找更小的最小值
            right = mid - 1;
        }
    }

    // 若right小于最小边成本，说明无有效路径，否则返回right（最大可行的最小边成本）
    return right < mn ? -1 : right;
};

```