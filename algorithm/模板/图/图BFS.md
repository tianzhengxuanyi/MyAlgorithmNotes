### 图BFS 广度优先搜索

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