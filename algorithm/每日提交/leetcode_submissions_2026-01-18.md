### 2026-01-18

#### [1895. 最大的幻方](https://leetcode.cn/problems/largest-magic-square/description/)

一个 `k x k` 的**幻方** 指的是一个 `k x k` 填满整数的方格阵，且每一行、每一列以及两条对角线的和 **全部****相等** 。幻方中的整数 **不需要互不相同** 。显然，每个 `1 x 1` 的方格都是一个幻方。

给你一个 `m x n` 的整数矩阵 `grid` ，请你返回矩阵中 **最大幻方** 的 **尺寸** （即边长 `k`）。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/05/29/magicsquare-grid.jpg)

```
输入：grid = [[7,1,4,5,6],[2,5,1,6,4],[1,5,4,3,2],[1,2,7,3,4]]
输出：3
解释：最大幻方尺寸为 3 。
每一行，每一列以及两条对角线的和都等于 12 。
- 每一行的和：5+1+6 = 5+4+3 = 2+7+3 = 12
- 每一列的和：5+5+2 = 1+4+7 = 6+3+3 = 12
- 对角线的和：5+4+3 = 6+4+2 = 12
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2021/05/29/magicsquare2-grid.jpg)

```
输入：grid = [[5,1,3,1],[9,3,3,1],[1,3,3,8]]
输出：2
```

**提示：**

* `m == grid.length`
* `n == grid[i].length`
* `1 <= m, n <= 50`
* `1 <= grid[i][j] <= 106`

##### 枚举幻方长度

```js
/**
 * @param {number[][]} grid
 * @return {number}
 */
var largestMagicSquare = function (grid) {
    const m = grid.length, n = grid[0].length;
    const rows = Array.from({ length: m }, () => Array(n + 1).fill(0));
    const cols = Array.from({ length: n }, () => Array(m + 1).fill(0));
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            rows[i][j + 1] = rows[i][j] + grid[i][j];
            cols[j][i + 1] = cols[j][i] + grid[i][j];
        }
    }
    let ans = 1;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            let mk = Math.min(m - 1 - i, n - 1 - j);
            outer: for (let k = 1; k <= mk; k++) {
                let sum = 0, sum2 = 0;
                for (let d = 0; d <= k; d++) {
                    sum += grid[i + d][j + d]; // 主对角线
                    sum2 += grid[i + d][j + k - d]; // 反对角线
                }
                if (sum !== sum2) continue;
                for (let d = 0; d <= k; d++) {
                    // 行 列
                    if ((sum != (rows[i + d][j + k + 1] - rows[i + d][j])) || 
                        (sum != (cols[j + d][i + k + 1] - cols[j + d][i]))) {
                        continue outer;
                    }
                }
                ans = Math.max(ans, k + 1);
            }
        }
    }
    return ans;
};
```

