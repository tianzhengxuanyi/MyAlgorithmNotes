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
