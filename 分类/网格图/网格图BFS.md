## 网格图 BFS

BFS 从起点开始，按 层（Level） 向外扩展。每层对应从起点出发的 固定步数：

第 0 层：起点本身（距离为 0）。

第 1 层：所有与起点直接相邻的节点（距离为 1）。

第 2 层：所有与第 1 层节点相邻且未被访问的节点（距离为 2），依此类推。

由于 BFS 使用队列（FIFO 结构）保存待访问节点，先被发现的节点总是先被处理。这保证了当目标节点首次被访问时，其对应的层数（即步数）一定是最小的。

#### [1162. 地图分析](https://leetcode.cn/problems/as-far-from-land-as-possible/description/)

你现在手里有一份大小为 n x n 的 网格 grid，上面的每个 单元格 都用 0 和 1 标记好了。其中 0 代表海洋，1 代表陆地。

请你找出一个海洋单元格，这个海洋单元格到离它最近的陆地单元格的距离是最大的，并返回该距离。如果网格上只有陆地或者海洋，请返回 -1。

我们这里说的距离是「曼哈顿距离」（ Manhattan Distance）：(x0, y0) 和 (x1, y1) 这两个单元格之间的距离是 |x0 - x1| + |y0 - y1|

> 将所有陆地加入队列，然后多源dfs
```js
/**
 * @param {number[][]} grid
 * @return {number}
 */
var maxDistance = function (grid) {
  const m = grid.length,
    n = grid[0].length;
  const queue = [],
    dx = [0, 0, 1, -1],
    dy = [1, -1, 0, 0];
  let ans = -1;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        queue.push([i, j, 0]);
      }
    }
  }
  while (queue.length) {
    const [x, y, step] = queue.shift();
    for (let i = 0; i < 4; i++) {
      const nextx = x + dx[i],
        nexty = y + dy[i];
      if (
        nextx >= 0 &&
        nextx < m &&
        nexty >= 0 &&
        nexty < n &&
        grid[nextx][nexty] === 0
      ) {
        queue.push([nextx, nexty, step + 1]);
        grid[nextx][nexty] = step + 1;
        ans = Math.max(ans, step + 1);
      }
    }
  }
  return ans;
};
```
