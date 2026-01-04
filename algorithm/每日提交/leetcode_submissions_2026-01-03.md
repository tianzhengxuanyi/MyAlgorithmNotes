### 2026-01-03

#### [1411. 给 N x 3 网格图涂色的方案数](https://leetcode.cn/problems/number-of-ways-to-paint-n-3-grid/description/)

你有一个 `n x 3` 的网格图 `grid` ，你需要用 **红，黄，绿** 三种颜色之一给每一个格子上色，且确保相邻格子颜色不同（也就是有相同水平边或者垂直边的格子颜色不同）。

给你网格图的行数 `n` 。

请你返回给 `grid` 涂色的方案数。由于答案可能会非常大，请你返回答案对 `10^9 + 7` 取余的结果。

**示例 1：**

```
输入：n = 1
输出：12
解释：总共有 12 种可行的方法：
![](https://assets.leetcode.cn/aliyun-lc-upload/uploads/2020/04/12/e1.png)
```

**示例 2：**

```
输入：n = 2
输出：54
```

**示例 3：**

```
输入：n = 3
输出：246
```

**示例 4：**

```
输入：n = 7
输出：106494
```

**示例 5：**

```
输入：n = 5000
输出：30228214
```

**提示：**

* `n == grid.length`
* `grid[i].length == 3`
* `1 <= n <= 5000`

##### 递推

```js
/**
 * @param {number} n
 * @return {number}
 */
var numOfWays = function (n) {
    let f1 = 6, f2 = 6, newF1, newF2;
    for (let i = 1; i < n; i++) {
        newF1 = (f1 * 3 % MOD + f2 * 2 % MOD) % MOD;
        newF2 = (f1 * 2 % MOD + f2 * 2 % MOD) % MOD;
        f1 = newF1, f2 = newF2;
    }
    return (f1 + f2) % MOD;
};

const MOD = 1e9 + 7;
```

##### 动态规划

```js
/**
 * @param {number} n
 * @return {number}
 */
var numOfWays = function(n) {
    const memo = Array.from({length: n}, () => new Map());
    const dfs = (i, color) => {
        if (i == n - 1) return 1;
        if (memo[i].has(color)) return memo[i].get(color);
        let res = 0;
        for (let c of colors) {
            if (c & color) continue;
            res = (res + dfs(i + 1, c)) % MOD;
        }
        memo[i].set(color, res);
        return res;
    }
    let ans = 0;
    for (let c of colors) {
        ans = (ans + dfs(0, c)) % MOD;
    }
    return ans;
};

const MOD = 1e9 + 7;
// 返回1行所有可能的颜色排列
// 000 000 000 每一个用3位表示，
// 100：红，010：黄，001：绿
const colors = [];
const getColors = (i, path) => {
    if (i == 3) {
        colors.push(path);
        return;
    }
    for (let k = 0; k < 3; k++) {
        let mask = 1 << k;
        if ((path >> (3 * Math.max(0, i - 1))) & mask) continue;
        getColors(i + 1, path | (mask << (i * 3)))
    }
}

getColors(0, 0);
```

