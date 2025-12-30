### 2025-12-30

#### [207. 课程表](https://leetcode.cn/problems/course-schedule/description/)

你这个学期必须选修 `numCourses` 门课程，记为 `0` 到 `numCourses - 1` 。

在选修某些课程之前需要一些先修课程。 先修课程按数组 `prerequisites` 给出，其中 `prerequisites[i] = [ai, bi]` ，表示如果要学习课程 `ai` 则 **必须** 先学习课程  `bi`。

* 例如，先修课程对 `[0, 1]` 表示：想要学习课程 `0` ，你需要先完成课程 `1` 。

请你判断是否可能完成所有课程的学习？如果可以，返回 `true` ；否则，返回 `false` 。

**示例 1：**

```
输入：numCourses = 2, prerequisites = [[1,0]]
输出：true
解释：总共有 2 门课程。学习课程 1 之前，你需要完成课程 0 。这是可能的。
```

**示例 2：**

```
输入：numCourses = 2, prerequisites = [[1,0],[0,1]]
输出：false
解释：总共有 2 门课程。学习课程 1 之前，你需要先完成​课程 0 ；并且学习课程 0 之前，你还应先完成课程 1 。这是不可能的。
```

**提示：**

* `1 <= numCourses <= 2000`
* `0 <= prerequisites.length <= 5000`
* `prerequisites[i].length == 2`
* `0 <= ai, bi < numCourses`
* `prerequisites[i]` 中的所有课程对 **互不相同**

##### 三色判环

```js
/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
var canFinish = function (numCourses, prerequisites) {
    const g = Array.from({ length: numCourses }, () => []);
    for (const [a, b] of prerequisites) {
        g[b].push(a);
    }
    const colors = Array(numCourses).fill(0);
    const dfs = (x) => {
        colors[x] = 1;
        for (let y of g[x]) {
            if (colors[y] === 1 || colors[y] === 0 && dfs(y)) {
                return true;
            }
        }
        colors[x] = 2;
        return false;
    }
    for (let i = 0; i < numCourses; i++) {
        // 有环
        if (colors[i] === 0 && dfs(i)) {
            return false
        }
    }
    return true
};
```

##### 拓扑排序：广度优先

```js
/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
var canFinish = function (numCourses, prerequisites) {
    const g = Array.from({ length: numCourses }, () => []);
    const indeg = Array(numCourses).fill(0);
    for (let [u, v] of prerequisites) {
        g[v].push(u);
        indeg[u]++;
    }
    const queue = [];
    let cnt = 0;
    for (let i = 0; i < numCourses; i++) {
        if (indeg[i] == 0) {
            queue.push(i);
            cnt++;
        }
    }
    while (queue.length) {
        const curr = queue.shift();
        for (let nx of g[curr]) {
            indeg[nx]--;
            if (indeg[nx] == 0) {
                queue.push(nx);
                cnt++;
            }
        }
    }

    return cnt == numCourses;
};
```

#### [994. 腐烂的橘子](https://leetcode.cn/problems/rotting-oranges/description/)

在给定的 `m x n` 网格 `grid` 中，每个单元格可以有以下三个值之一：

* 值 `0` 代表空单元格；
* 值 `1` 代表新鲜橘子；
* 值 `2` 代表腐烂的橘子。

每分钟，腐烂的橘子 **周围 4 个方向上相邻** 的新鲜橘子都会腐烂。

返回 *直到单元格中没有新鲜橘子为止所必须经过的最小分钟数。如果不可能，返回 `-1`* 。

**示例 1：**

**![](https://assets.leetcode.cn/aliyun-lc-upload/uploads/2019/02/16/oranges.png)**

```
输入：grid = [[2,1,1],[1,1,0],[0,1,1]]
输出：4
```

**示例 2：**

```
输入：grid = [[2,1,1],[0,1,1],[1,0,1]]
输出：-1
解释：左下角的橘子（第 2 行， 第 0 列）永远不会腐烂，因为腐烂只会发生在 4 个方向上。
```

**示例 3：**

```
输入：grid = [[0,2]]
输出：0
解释：因为 0 分钟时已经没有新鲜橘子了，所以答案就是 0 。
```

**提示：**

* `m == grid.length`
* `n == grid[i].length`
* `1 <= m, n <= 10`
* `grid[i][j]` 仅为 `0`、`1` 或 `2`

##### bfs

```js
/**
 * @param {number[][]} grid
 * @return {number}
 */
var orangesRotting = function (grid) {
    const q = [];
    const m = grid.length, n = grid[0].length;
    let cnt = 0, cnt2 = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j]) cnt++;
            if (grid[i][j] == 2) {
                q.push([i, j, 0]);
                grid[i][j] = 3;
                cnt2++;
            }
        }
    }
    let ans = 0;
    while (q.length) {
        const [i, j, t] = q.shift();
        ans = Math.max(ans, t);
        for (let [di, dj] of direction) {
            let ni = di + i, nj = dj + j;
            if (ni < 0 || ni >= m || nj < 0 || nj >= n ||
                grid[ni][nj] != 1) {
                continue;
            }
            q.push([ni, nj, t + 1]);
            grid[ni][nj] = 3, cnt2++;
        }
    }
    return cnt == cnt2 ? ans : -1;
};

const direction = [[1, 0], [-1, 0], [0, 1], [0, -1]];
```

#### [200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/description/)

给你一个由 `'1'`（陆地）和 `'0'`（水）组成的的二维网格，请你计算网格中岛屿的数量。

岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。

此外，你可以假设该网格的四条边均被水包围。

**示例 1：**

```
输入：grid = [
  ['1','1','1','1','0'],
  ['1','1','0','1','0'],
  ['1','1','0','0','0'],
  ['0','0','0','0','0']
]
输出：1
```

**示例 2：**

```
输入：grid = [
  ['1','1','0','0','0'],
  ['1','1','0','0','0'],
  ['0','0','1','0','0'],
  ['0','0','0','1','1']
]
输出：3
```

**提示：**

* `m == grid.length`
* `n == grid[i].length`
* `1 <= m, n <= 300`
* `grid[i][j]` 的值为 `'0'` 或 `'1'`

##### dfs + 原地vist

```js
/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function (grid) {
    const m = grid.length, n = grid[0].length;
    const dfs = (i, j) => {
        if (i < 0 || i >= m || j < 0 || j >= n
            || grid[i][j] == 0 || grid[i][j] == 2) return;
        grid[i][j] = 2;
        for (let [di, dj] of direction) {
            let ni = i + di, nj = j + dj;
            dfs(ni, nj);
        }
    }
    let ans = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] == 1) {
                dfs(i, j);
                ans++;
            }
        }
    }

    return ans;
};

const direction = [[1, 0], [-1, 0], [0, 1], [0, -1]];
```

##### dfs + vist数组

```js
/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function (grid) {
    const m = grid.length, n = grid[0].length;
    const vis = Array.from({ length: m }, () => Array(n).fill(0));
    const dfs = (i, j) => {
        if (i < 0 || i >= m || j < 0 || j >= n
            || grid[i][j] == 0 || vis[i][j]) return;
        vis[i][j] = 1;
        for (let [di, dj] of direction) {
            let ni = i + di, nj = j + dj;
            dfs(ni, nj);
        }
    }
    let ans = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] == 1 && !vis[i][j]) {
                dfs(i, j);
                ans++;
            }
        }
    }

    return ans;
};

const direction = [[1, 0], [-1, 0], [0, 1], [0, -1]];
```

#### [840. 矩阵中的幻方](https://leetcode.cn/problems/magic-squares-in-grid/description/)

`3 x 3` 的幻方是一个填充有 **从 `1` 到 `9`** 的不同数字的 `3 x 3` 矩阵，其中每行，每列以及两条对角线上的各数之和都相等。

给定一个由整数组成的`row x col` 的 `grid`，其中有多少个 `3 × 3` 的 “幻方” 子矩阵？

注意：虽然幻方只能包含 1 到 9 的数字，但 `grid` 可以包含最多15的数字。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/09/11/magic_main.jpg)

```
输入: grid = [[4,3,8,4],[9,5,1,9],[2,7,6,2]]
输出: 1
解释: 
下面的子矩阵是一个 3 x 3 的幻方：
![](https://assets.leetcode.com/uploads/2020/09/11/magic_valid.jpg)
而这一个不是：
![](https://assets.leetcode.com/uploads/2020/09/11/magic_invalid.jpg)
总的来说，在本示例所给定的矩阵中只有一个 3 x 3 的幻方子矩阵。
```

**示例 2:**

```
输入: grid = [[8]]
输出: 0
```

**提示:**

* `row == grid.length`
* `col == grid[i].length`
* `1 <= row, col <= 10`
* `0 <= grid[i][j] <= 15`

##### 优化：1、幻方中心一定为5 2、不需要计算对角线和

```js
/**
 * @param {number[][]} grid
 * @return {number}
 */
var numMagicSquaresInside = function (grid) {
    const row = grid.length, col = grid[0].length;
    if (row < 3 || col < 3) return 0;
    let ans = 0, vis = 0;
    for (let i = 0; i <= row - 3; i++) {
        outer: for (let j = 0; j <= col - 3; j++) {
            vis = 0;
            // 幻方中心一定为5
            if (grid[i+1][j+1] !== 5) continue;
            // 判断每一行sum
            for (let m = 0; m < 2; m++) {
                let r = 0;
                for (let k = 0; k < 3; k++) {
                    let val = grid[i + m][j + k], mask = 1 << val;
                    // 判断数字是否重复或大于9
                    if ((vis & mask) || val > 9 || val <= 0) continue outer;
                    vis |= mask;
                    r += val;
                }
                // 和为15
                if (r !== 15) continue outer;
            }
            // 判断每一列sum
            for (let k = 0; k < 3; k++) {
                let c = 0;
                for (let m = 0; m < 3; m++) {
                    c += grid[i + m][j + k];
                }
                if (c !== 15) continue outer;
            }
            ans++;
        }
    }
    return ans;
};
```

##### 暴力

```js
/**
 * @param {number[][]} grid
 * @return {number}
 */
var numMagicSquaresInside = function (grid) {
    const row = grid.length, col = grid[0].length;
    if (row < 3 || col < 3) return 0;
    let ans = 0, vis = 0;
    for (let i = 0; i <= row - 3; i++) {
        outer: for (let j = 0; j <= col - 3; j++) {
            vis = 0;
            let lsum = grid[i][j] + grid[i + 1][j + 1] + grid[i + 2][j + 2];
            let rsum = grid[i][j + 2] + grid[i + 1][j + 1] + grid[i + 2][j];
            // 判断对角线sum
            if (lsum !== rsum) continue;
            // 判断每一行sum
            for (let m = 0; m < 3; m++) {
                let r = 0;
                for (let k = 0; k < 3; k++) {
                    let val = grid[i + m][j + k], mask = 1 << val;
                    // 判断数字是否重复或大于9
                    if ((vis & mask) || val > 9 || val <= 0) continue outer;
                    vis |= mask;
                    r += val;
                }
                if (r !== lsum) continue outer;
            }
            // 判断每一列sum
            for (let k = 0; k < 3; k++) {
                let c = 0;
                for (let m = 0; m < 3; m++) {
                    c += grid[i + m][j + k];
                }
                if (c !== lsum) continue outer;
            }
            ans++;
        }
    }
    return ans;
};
```

