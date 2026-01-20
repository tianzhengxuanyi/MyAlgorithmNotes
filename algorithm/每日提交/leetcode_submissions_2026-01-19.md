### 2026-01-19

#### [1292. 元素和小于等于阈值的正方形的最大边长](https://leetcode.cn/problems/maximum-side-length-of-a-square-with-sum-less-than-or-equal-to-threshold/description/)

给你一个大小为 `m x n` 的矩阵 `mat` 和一个整数阈值 `threshold`。

请你返回元素总和小于或等于阈值的正方形区域的最大边长；如果没有这样的正方形区域，则返回 **0**。

**示例 1：**

![](https://assets.leetcode.cn/aliyun-lc-upload/uploads/2019/12/15/e1.png)

```
输入：mat = [[1,1,3,2,4,3,2],[1,1,3,2,4,3,2],[1,1,3,2,4,3,2]], threshold = 4
输出：2
解释：总和小于或等于 4 的正方形的最大边长为 2，如图所示。
```

**示例 2：**

```
输入：mat = [[2,2,2,2,2],[2,2,2,2,2],[2,2,2,2,2],[2,2,2,2,2],[2,2,2,2,2]], threshold = 1
输出：0
```

**提示：**

* `m == mat.length`
* `n == mat[i].length`
* `1 <= m, n <= 300`
* `0 <= mat[i][j] <= 104`
* `0 <= threshold <= 105`

##### 二维前缀和优化：k从ans开始枚举

```js
/**
 * @param {number[][]} mat
 * @param {number} threshold
 * @return {number}
 */
var maxSideLength = function (mat, threshold) {
    const m = mat.length, n = mat[0].length;
    const prefix = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            prefix[i + 1][j + 1] = prefix[i + 1][j] + prefix[i][j + 1] -
                prefix[i][j] + mat[i][j];
        }
    }

    let ans = 0;
    for (let i = 0; i < m; i++) {
        outer: for (let j = 0; j < n; j++) {
            let mk = Math.min(m - 1 - i, n - 1 - j);
            for (let k = ans; k <= mk; k++) {
                let sum = prefix[i + k + 1][j + k + 1] - prefix[i][j + k + 1] -
                    prefix[i + k + 1][j] + prefix[i][j];
                if (sum <= threshold) {
                    ans = Math.max(ans, k + 1);
                } else {
                    continue outer;
                }
            }
        }
    }
    return ans;
};
```

##### 二维前缀和

```js
/**
 * @param {number[][]} mat
 * @param {number} threshold
 * @return {number}
 */
var maxSideLength = function (mat, threshold) {
    const m = mat.length, n = mat[0].length;
    const prefix = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            prefix[i + 1][j + 1] = prefix[i + 1][j] + prefix[i][j + 1] -
                prefix[i][j] + mat[i][j];
        }
    }

    let ans = 0;
    for (let i = 0; i < m; i++) {
        outer: for (let j = 0; j < n; j++) {
            let mk = Math.min(m - 1 - i, n - 1 - j);
            for (let k = 0; k <= mk; k++) {
                let sum = prefix[i + k + 1][j + k + 1] - prefix[i][j + k + 1] -
                    prefix[i + k + 1][j] + prefix[i][j];
                if (sum <= threshold) {
                    ans = Math.max(ans, k + 1);
                } else {
                    continue outer;
                }
            }
        }
    }
    return ans;
};
```

