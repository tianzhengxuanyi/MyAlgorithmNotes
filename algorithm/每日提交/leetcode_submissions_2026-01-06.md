### 2026-01-06

#### [5. 最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/description/)

给你一个字符串 `s`，找到 `s` 中最长的 回文 子串。

**示例 1：**

```
输入：s = "babad"
输出："bab"
解释："aba" 同样是符合题意的答案。
```

**示例 2：**

```
输入：s = "cbbd"
输出："bb"
```

**提示：**

* `1 <= s.length <= 1000`
* `s` 仅由数字和英文字母组成

##### Manacher 算法

```js
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
    const str = manachrStr(s);
    const n = str.length;
    const halfLen = Array(n).fill(0);
    let c = -1, r = -1;
    let mxR = 1, mxC = 0;
    for (let i = 0; i < n; i++) {
        halfLen[i] = r > i ? Math.min(halfLen[2 * c - i] ?? 0, r - i) : 1;
        while (i + halfLen[i] < n && i - halfLen[i] >= 0 &&
            str[i + halfLen[i]] == str[i - halfLen[i]]) {
            halfLen[i] += 1;
        }
        if (i + halfLen[i] > r) {
            r = i + halfLen[i];
            c = i;
        }
        if (halfLen[i] > mxR) {
            mxR = halfLen[i];
            mxC = i;
        }
    }
    return s.slice((mxC - mxR + 1) / 2, (mxC + mxR - 1) / 2);
};

const manachrStr = (s) => {
    let res = "#";
    for (let x of s) {
        res += x + "#";
    }
    return res;
}
```

##### 动态规划

```js
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
    const n = s.length;
    const isP = Array.from({ length: n }, () => Array(n).fill(false));
    let ans = s[0];
    for (let i = n - 1; i >= 0; i--) {
        isP[i][i] = true;
        for (let j = i + 1; j < n; j++) {
            isP[i][j] = s[i] == s[j] && (j == i + 1 || isP[i + 1][j - 1]);
            if (isP[i][j] && j - i + 1 > ans.length) {
                ans = s.slice(i, j + 1);
            }
        }
    }
    return ans;
};
```

#### [64. 最小路径和](https://leetcode.cn/problems/minimum-path-sum/description/)

给定一个包含非负整数的 `m x n` 网格 `grid` ，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。

**说明：**每次只能向下或者向右移动一步。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/11/05/minpath.jpg)

```
输入：grid = [[1,3,1],[1,5,1],[4,2,1]]
输出：7
解释：因为路径 1→3→1→1→1 的总和最小。
```

**示例 2：**

```
输入：grid = [[1,2,3],[4,5,6]]
输出：12
```

**提示：**

* `m == grid.length`
* `n == grid[i].length`
* `1 <= m, n <= 200`
* `0 <= grid[i][j] <= 200`

##### dfs 记忆换缓存

```js
/**
 * @param {number[][]} grid
 * @return {number}
 */
var minPathSum = function (grid) {
    const m = grid.length, n = grid[0].length;
    const memo = Array.from({length: m}, () => Array(n).fill(-1));
    const dfs = (i, j) => {
        if (i == m - 1 && j == n - 1) return memo[i][j] = grid[i][j];
        if (i < 0 || i >= m || j < 0 || j >= n) return Infinity;
        if (memo[i][j] >= 0) return memo[i][j];
        return memo[i][j] = Math.min(dfs(i + 1, j), dfs(i, j + 1)) + grid[i][j];
    }
    return dfs(0, 0);
};
```

#### [62. 不同路径](https://leetcode.cn/problems/unique-paths/description/)

一个机器人位于一个 `m x n`网格的左上角 （起始点在下图中标记为 “Start” ）。

机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。

问总共有多少条不同的路径？

**示例 1：**

![](https://pic.leetcode.cn/1697422740-adxmsI-image.png)

```
输入：m = 3, n = 7
输出：28
```

**示例 2：**

```
输入：m = 3, n = 2
输出：3
解释：
从左上角开始，总共有 3 条路径可以到达右下角。
1. 向右 -> 向下 -> 向下
2. 向下 -> 向下 -> 向右
3. 向下 -> 向右 -> 向下
```

**示例 3：**

```
输入：m = 7, n = 3
输出：28
```

**示例 4：**

```
输入：m = 3, n = 3
输出：6
```

**提示：**

* `1 <= m, n <= 100`
* 题目数据保证答案小于等于 `2 * 109`

##### 组合数学

```js
/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var uniquePaths = function (m, n) {
    return C[m + n - 2][m - 1];
};

const MX = 200
// 组合数学解法：C(k, m) 其中m = (必须步数 + 剩余步数/2)
const C = Array.from({ length: MX + 1 }, () => Array(MX + 1).fill(0));

// 构建组合数表（帕斯卡三角形）
for (let i = 0; i <= MX; i++) {
    C[i][0] = 1; // 任何数选0个的方案都是1
    for (let j = 1; j <= i; j++) {
        // 组合数递推公式，结果取模
        C[i][j] = (C[i - 1][j] + C[i - 1][j - 1]);
    }
}
```

##### 迭代+空间压缩

```js
/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var uniquePaths = function (m, n) {
    const f = Array(n + 1).fill(0);
    for (let i = m - 1; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
            if (i == m - 1 && j == n - 1) {
                f[n - 1] = 1
                continue;
            }
            f[j] += f[j + 1]
        }
    }
    return f[0];
};
```

##### [ 用时: -1 d -14 hrs -5 m -17 s ]

```js
/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var uniquePaths = function (m, n) {
    const f = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = m - 1; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
            if (i == m - 1 && j == n - 1) {
                f[m - 1][n - 1] = 1
                continue;
            }
            f[i][j] = f[i + 1][j] + f[i][j + 1]
        }
    }
    return f[0][0];
};
```

##### dfs 记忆换缓存

```js
/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var uniquePaths = function(m, n) {
    const memo = Array.from({length: m}, () => Array(n).fill(-1));
    const dfs = (i, j) => {
        if (i == m - 1 && j == n - 1) return memo[i][j] = 1;
        if (i < 0 || i >= m || j < 0 || j >= n) return 0;
        if (memo[i][j] >= 0) return memo[i][j];
        return memo[i][j] = dfs(i + 1, j) + dfs(i, j + 1);
    }
    return dfs(0, 0);
};
```

#### [1161. 最大层内元素和](https://leetcode.cn/problems/maximum-level-sum-of-a-binary-tree/description/)

给你一个二叉树的根节点 `root`。设根节点位于二叉树的第 `1` 层，而根节点的子节点位于第 `2` 层，依此类推。

返回总和 **最大** 的那一层的层号 `x`。如果有多层的总和一样大，返回其中 **最小** 的层号 `x`。

**示例 1：**

**![](https://assets.leetcode.cn/aliyun-lc-upload/uploads/2019/08/17/capture.jpeg)**

```
输入：root = [1,7,0,7,-8,null,null]
输出：2
解释：
第 1 层各元素之和为 1，
第 2 层各元素之和为 7 + 0 = 7，
第 3 层各元素之和为 7 + -8 = -1，
所以我们返回第 2 层的层号，它的层内元素之和最大。
```

**示例 2：**

```
输入：root = [989,null,10250,98693,-89388,null,null,null,-32127]
输出：2
```

**提示：**

* 树中的节点数在 `[1, 104]`范围内
* `-105 <= Node.val <= 105`

##### [ 用时: -1 d -15 hrs -17 m -11 s ]

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxLevelSum = function(root) {
    const q = [root];
    let ans = 1, level = 1, mx = -Infinity;
    while (q.length) {
        let sum = 0, n = q.length;
        for (let i = 0; i < n; i++) {
            const node = q.shift();
            sum += node.val;
            if (node.left) q.push(node.left);
            if (node.right) q.push(node.right);
        }
        if (sum > mx) {
            mx = sum;
            ans = level;
        }
        level++;
    }
    return ans;
};
```

