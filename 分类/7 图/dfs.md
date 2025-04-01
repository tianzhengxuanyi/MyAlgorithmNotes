### DFS 深度优先搜索

> 找连通块、判断是否有环等

#### 模板

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
          dfs(i);
          //...
        }
    }
    // ...
};
```
