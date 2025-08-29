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

#### BFS 双列表写法 [909. 蛇梯棋](https://leetcode.cn/problems/snakes-and-ladders/description/?envType=daily-question&envId=2025-05-31)

给你一个大小为 n x n 的整数矩阵 board ，方格按从 1 到 n2 编号，编号遵循 转行交替方式 ，从左下角开始 （即，从 board[n - 1][0] 开始）的每一行改变方向。

你一开始位于棋盘上的方格  1。每一回合，玩家需要从当前方格 curr 开始出发，按下述要求前进：

选定目标方格 next ，目标方格的编号在范围 [curr + 1, min(curr + 6, n2)] 。
该选择模拟了掷 六面体骰子 的情景，无论棋盘大小如何，玩家最多只能有 6 个目的地。
传送玩家：如果目标方格 next 处存在蛇或梯子，那么玩家会传送到蛇或梯子的目的地。否则，玩家传送到目标方格 next 。 
当玩家到达编号 n2 的方格时，游戏结束。
如果 board[r][c] != -1 ，位于 r 行 c 列的棋盘格中可能存在 “蛇” 或 “梯子”。那个蛇或梯子的目的地将会是 board[r][c]。编号为 1 和 n2 的方格不是任何蛇或梯子的起点。

注意，玩家在每次掷骰的前进过程中最多只能爬过蛇或梯子一次：就算目的地是另一条蛇或梯子的起点，玩家也 不能 继续移动。

举个例子，假设棋盘是 [[-1,4],[-1,3]] ，第一次移动，玩家的目标方格是 2 。那么这个玩家将会顺着梯子到达方格 3 ，但 不能 顺着方格 3 上的梯子前往方格 4 。（简单来说，类似飞行棋，玩家掷出骰子点数后移动对应格数，遇到单向的路径（即梯子或蛇）可以直接跳到路径的终点，但如果多个路径首尾相连，也不能连续跳多个路径）
返回达到编号为 n2 的方格所需的最少掷骰次数，如果不可能，则返回 -1。