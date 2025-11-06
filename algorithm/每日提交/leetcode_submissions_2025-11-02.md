### 2025-11-05

#### [478. 在圆内随机生成点](https://leetcode.cn/problems/generate-random-point-in-a-circle/description/)

给定圆的半径和圆心的位置，实现函数 `randPoint` ，在圆中产生均匀随机点。

实现 `Solution` 类:

* `Solution(double radius, double x_center, double y_center)` 用圆的半径 `radius` 和圆心的位置 `(x_center, y_center)` 初始化对象
* `randPoint()` 返回圆内的一个随机点。圆周上的一点被认为在圆内。答案作为数组返回 `[x, y]` 。

**示例 1：**

```
输入: 
["Solution","randPoint","randPoint","randPoint"]
[[1.0, 0.0, 0.0], [], [], []]
输出: [null, [-0.02493, -0.38077], [0.82314, 0.38945], [0.36572, 0.17248]]
解释:
Solution solution = new Solution(1.0, 0.0, 0.0);
solution.randPoint ();//返回[-0.02493，-0.38077]
solution.randPoint ();//返回[0.82314,0.38945]
solution.randPoint ();//返回[0.36572,0.17248]
```

**提示：**

* `0 < radius <= 108`
* `-107 <= x_center, y_center <= 107`
* `randPoint` 最多被调用 `3 * 104` 次

##### 拒绝抽样

```js
/**
 * @param {number} radius
 * @param {number} x_center
 * @param {number} y_center
 */
var Solution = function (radius, x_center, y_center) {
    this.r = radius, this.x = x_center, this.y = y_center;
};

/**
 * @return {number[]}
 */
Solution.prototype.randPoint = function () {
    while (true) {
        const x = Math.random() * (2 * this.r) - this.r;
        const y = Math.random() * (2 * this.r) - this.r;
        if (x * x + y * y <= this.r * this.r) {
            return [this.x + x, this.y + y];
        }
    }
};

/** 
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(radius, x_center, y_center)
 * var param_1 = obj.randPoint()
 */
```

#### [710. 黑名单中的随机数](https://leetcode.cn/problems/random-pick-with-blacklist/description/)

给定一个整数 `n` 和一个 **无重复** 黑名单整数数组 `blacklist` 。设计一种算法，从 `[0, n - 1]` 范围内的任意整数中选取一个 **未加入**黑名单 `blacklist` 的整数。任何在上述范围内且不在黑名单 `blacklist` 中的整数都应该有 **同等的可能性** 被返回。

优化你的算法，使它最小化调用语言 **内置** 随机函数的次数。

实现 `Solution` 类:

* `Solution(int n, int[] blacklist)` 初始化整数 `n` 和被加入黑名单 `blacklist` 的整数
* `int pick()` 返回一个范围为 `[0, n - 1]` 且不在黑名单 `blacklist` 中的随机整数

**示例 1：**

```
输入
["Solution", "pick", "pick", "pick", "pick", "pick", "pick", "pick"]
[[7, [2, 3, 5]], [], [], [], [], [], [], []]
输出
[null, 0, 4, 1, 6, 1, 0, 4]

解释
Solution solution = new Solution(7, [2, 3, 5]);
solution.pick(); // 返回0，任何[0,1,4,6]的整数都可以。注意，对于每一个pick的调用，
                 // 0、1、4和6的返回概率必须相等(即概率为1/4)。
solution.pick(); // 返回 4
solution.pick(); // 返回 1
solution.pick(); // 返回 6
solution.pick(); // 返回 1
solution.pick(); // 返回 0
solution.pick(); // 返回 4
```

**提示:**

* `1 <= n <= 109`
* `0 <= blacklist.length <= min(105, n - 1)`
* `0 <= blacklist[i] < n`
* `blacklist` 中所有值都 **不同**
* `pick` 最多被调用 `2 * 104` 次

##### 设[n-m, n)为黑名单区域，将[0, n-m)中的黑名单和[n-m, n)中的白名单做映射，在[0, n-m)中随机，如果存在b2w存在映射则返回映射

```js
/**
 * @param {number} n
 * @param {number[]} blacklist
 */
var Solution = function(n, blacklist) {
    const m = blacklist.length;
    const b2w = new Map();
    const wLen = n - m;
    const black = new Set();
    for (const b of blacklist) {
        if (b >= wLen) {
            black.add(b);
        }
    }
    let w = wLen;
    for (let b of blacklist) {
        if (b < wLen) {
            while (black.has(w)) {
                w++;
            }
            b2w.set(b, w++);
        }
    }
    this.b2w = b2w;
    this.wLen = wLen;
};

/**
 * @return {number}
 */
Solution.prototype.pick = function() {
    const rand = Math.floor((Math.random() * this.wLen));
    return this.b2w.get(rand) || rand;
};

/** 
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(n, blacklist)
 * var param_1 = obj.pick()
 */
```

#### [2257. 统计网格图中没有被保卫的格子数](https://leetcode.cn/problems/count-unguarded-cells-in-the-grid/description/)

给你两个整数 `m` 和 `n` 表示一个下标从**0** 开始的 `m x n` 网格图。同时给你两个二维整数数组 `guards` 和 `walls` ，其中 `guards[i] = [rowi, coli]` 且 `walls[j] = [rowj, colj]` ，分别表示第 `i` 个警卫和第 `j` 座墙所在的位置。

一个警卫能看到 4 个坐标轴方向（即东、南、西、北）的 **所有** 格子，除非他们被一座墙或者另外一个警卫 **挡住** 了视线。如果一个格子能被 **至少** 一个警卫看到，那么我们说这个格子被 **保卫** 了。

请你返回空格子中，有多少个格子是 **没被保卫** 的。

**示例 1：**

![](https://assets.leetcode.com/uploads/2022/03/10/example1drawio2.png)

```
输入：m = 4, n = 6, guards = [[0,0],[1,1],[2,3]], walls = [[0,1],[2,2],[1,4]]
输出：7
解释：上图中，被保卫和没有被保卫的格子分别用红色和绿色表示。
总共有 7 个没有被保卫的格子，所以我们返回 7 。
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2022/03/10/example2drawio.png)

```
输入：m = 3, n = 3, guards = [[1,1]], walls = [[0,1],[1,0],[2,1],[1,2]]
输出：4
解释：上图中，没有被保卫的格子用绿色表示。
总共有 4 个没有被保卫的格子，所以我们返回 4 。
```

**提示：**

* `1 <= m, n <= 105`
* `2 <= m * n <= 105`
* `1 <= guards.length, walls.length <= 5 * 104`
* `2 <= guards.length + walls.length <= m * n`
* `guards[i].length == walls[j].length == 2`
* `0 <= rowi, rowj < m`
* `0 <= coli, colj < n`
* `guards` 和 `walls` 中所有位置 **互不相同** 。

##### 要提前初始化guards

```js
/**
 * @param {number} m
 * @param {number} n
 * @param {number[][]} guards
 * @param {number[][]} walls
 * @return {number}
 */
var countUnguarded = function(m, n, guards, walls) {
    const grid = Array.from({length: m}, () => Array(n).fill(0));
    for (const [r, c] of walls) {
        grid[r][c] = 2;
    }
    // 要提前初始化guards
    for (const [r, c] of guards) {
        grid[r][c] = 2;
    }
    for (const [r, c] of guards) {
        for (let i = r - 1; i >= 0; i--) {
            if (grid[i][c] == 2) {
                break;
            }
            grid[i][c] = 1;
        }
        for (let i = r + 1; i < m; i++) {
            if (grid[i][c] == 2) {
                break;
            }
            grid[i][c] = 1;
        }
        for (let j = c - 1; j >= 0; j--) {
            if (grid[r][j] == 2) {
                break;
            }
            grid[r][j] = 1;
        }
        for (let j = c + 1; j < n; j++) {
            if (grid[r][j] == 2) {
                break;
            }
            grid[r][j] = 1;
        }
    }

    let ans = 0;
    for (let i = 0; i < m;i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] == 0) ans++;
        }
    }
    return ans;
};
```

