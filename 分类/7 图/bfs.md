### BFS 广度优先搜索

> 求最短路径或者有关层级的问题

> 单向图

```js
const bfs = (i, graph) => {
  let q = [i];
  const vistid = Array(n).fill(0); // 访问标记数组
  while (q.length) {
    let current = q.shift();
    for (let next of graph[current]) {
      if (!vistid[next]) {
        q.push(next);
        vistid[next] = vistid[current] + 1; // 层级加一
      }
    }
  }
  return ans;
};
```

> 双向图

```js
const bfs = (i, graph) => {
  let q = [[i, null]]; // 记录节点和父节点
  const dis = Array(n).fill(-1);
  dis[i] = 0;
  let ans = Infinity;
  while (q.length) {
    let [current, prev] = q.shift();
    for (let next of graph[current]) {
      if (dis[next] < 0) {
        // 未访问过
        q.push([next, current]);
        dis[next] = dis[current] + 1;
      } else if (next !== prev) {
        // 访问过，且不是父节点
        ans = Math.min(ans, dis[current] + dis[next] + 1);
      }
    }
  }
  return ans;
};
```

#### [1129. 颜色交替的最短路径](https://leetcode.cn/problems/shortest-path-with-alternating-colors/description/)


给定一个整数 n，即有向图中的节点数，其中节点标记为 0 到 n - 1。图中的每条边为红色或者蓝色，并且可能存在自环或平行边。

给定两个数组 redEdges 和 blueEdges，其中：

redEdges[i] = [ai, bi] 表示图中存在一条从节点 ai 到节点 bi 的红色有向边，
blueEdges[j] = [uj, vj] 表示图中存在一条从节点 uj 到节点 vj 的蓝色有向边。
返回长度为 n 的数组 answer，其中 answer[X] 是从节点 0 到节点 X 的红色边和蓝色边交替出现的最短路径的长度。如果不存在这样的路径，那么 answer[x] = -1。

```js
/**
 * 寻找从节点0出发到各节点的最短交替颜色路径
 * @param {number} n 节点总数
 * @param {number[][]} redEdges 红边集合，每个元素表示 [起点, 终点]
 * @param {number[][]} blueEdges 蓝边集合，每个元素表示 [起点, 终点]
 * @return {number[]} 到各节点的最短交替路径长度数组
 */
var shortestAlternatingPaths = function (n, redEdges, blueEdges) {
  // 构建邻接表：graph[节点][颜色] = 相邻节点数组（颜色0=红，1=蓝）
  const graph = Array.from({ length: n }, () => [[], []]);
  // 初始化红边（存储到索引0）
  for (let [x, y] of redEdges) {
    graph[x][0].push(y);
  }
  // 初始化蓝边（存储到索引1）
  for (let [x, y] of blueEdges) {
    graph[x][1].push(y);
  }

  // 距离数组：d[节点][最后一步颜色] = 步数
  const d = Array.from({ length: n }, () => [-1, -1]);
  // BFS队列初始化：起始点0可以走红边或蓝边出发（0=红，1=蓝）
  let q = [
    [0, 0],
    [0, 1],
  ];
  let ans = Array(n).fill(-1);
  (d[0][0] = 0), (d[0][1] = 0); // 起点初始化
  ans[0] = 0; // 到自己的距离为0

  // BFS遍历
  while (q.length) {
    let [current, g] = q.shift(); // 当前节点和最后一步颜色
    let nexts = graph[current][1 - g]; // 必须切换颜色（1 - g取反）

    // 遍历所有可到达的下个节点
    for (let next of nexts) {
      if (d[next][1 - g] < 0) {
        // 该颜色路径尚未被访问过
        q.push([next, 1 - g]);
        d[next][1 - g] = d[current][g] + 1; // 步数增加
        // 更新最短路径（首次到达或发现更短路径）
        ans[next] =
          ans[next] === -1
            ? d[next][1 - g]
            : Math.min(d[next][1 - g], ans[next]);
      }
    }
  }

  return ans;
};
```
