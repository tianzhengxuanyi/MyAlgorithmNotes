### 2026-01-04

#### [322. 零钱兑换](https://leetcode.cn/problems/coin-change/description/)

给你一个整数数组 `coins` ，表示不同面额的硬币；以及一个整数 `amount` ，表示总金额。

计算并返回可以凑成总金额所需的 **最少的硬币个数** 。如果没有任何一种硬币组合能组成总金额，返回 `-1` 。

你可以认为每种硬币的数量是无限的。

**示例 1：**

```
输入：coins = [1, 2, 5], amount = 11
输出：3 
解释：11 = 5 + 5 + 1
```

**示例 2：**

```
输入：coins = [2], amount = 3
输出：-1
```

**示例 3：**

```
输入：coins = [1], amount = 0
输出：0
```

**提示：**

* `1 <= coins.length <= 12`
* `1 <= coins[i] <= 231 - 1`
* `0 <= amount <= 104`

##### 迭代一个数组

```js
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function (coins, amount) {
    const f =  Array(amount + 1).fill(Infinity);
    f[0] = 0;
    for (let i = coins.length - 1; i >= 0; i--) {
        for (let c = 0; c <= amount; c++) {
            if (c >= coins[i]) {
                f[c] = Math.min(f[c], f[c - coins[i]] + 1);
            }
        }
    }
    return f[amount] == Infinity ? -1 : f[amount];
};
```

##### 迭代 空间压缩

```js
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function (coins, amount) {
    const n = coins.length;
    const f = Array.from({ length: 2 }, () => Array(amount + 1).fill(Infinity));
    f[n % 2][0] = 0;
    for (let i = n - 1; i >= 0; i--) {
        for (let c = 0; c <= amount; c++) {
            if (c < coins[i]) {
                f[i % 2][c] = f[(i + 1) % 2][c];
            } else {
                f[i % 2][c] = Math.min(f[(i + 1) % 2][c], f[i % 2][c - coins[i]] + 1);
            }
        }
    }
    return f[0][amount] == Infinity ? -1 : f[0][amount];
};
```

##### 迭代

```js
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
    const n = coins.length; 
    const f = Array.from({length: n + 1}, () => Array(amount + 1).fill(Infinity));
    f[n][0] = 0;
    for (let i = n - 1; i >= 0; i--) {
        for (let c = 0; c <= amount; c++) {
            if (c < coins[i]) {
                f[i][c] = f[i + 1][c];
            } else {
                f[i][c] = Math.min(f[i + 1][c], f[i][c - coins[i]] + 1);
            }
        }
    }
    return f[0][amount] == Infinity ? -1 : f[0][amount];
};
```

##### dfs

```js
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
    const n = coins.length;
    const memo = Array.from({length: n}, () => Array(amount + 1).fill(-1));
    const dfs = (i, rest) => {
        if (rest == 0) return 0;
        if (i == n) return Infinity;
        if (memo[i][rest] >= 0) return memo[i][rest];
        let res = Infinity;
        for (let j = 0; j * coins[i] <= rest; j++) {
            res = Math.min(res, dfs(i + 1, rest - j * coins[i]) + j);
        }
        return memo[i][rest] = res;
    }
     const res = dfs(0, amount);
     return res == Infinity ? -1 : res;
};
```

#### [279. 完全平方数](https://leetcode.cn/problems/perfect-squares/description/)

给你一个整数 `n` ，返回 *和为 `n` 的完全平方数的最少数量* 。

**完全平方数** 是一个整数，其值等于另一个整数的平方；换句话说，其值等于一个整数自乘的积。例如，`1`、`4`、`9` 和 `16` 都是完全平方数，而 `3` 和 `11` 不是。

**示例 1：**

```
输入：n = 12
输出：3 
解释：12 = 4 + 4 + 4
```

**示例 2：**

```
输入：n = 13
输出：2
解释：13 = 4 + 9
```

**提示：**

* `1 <= n <= 104`

##### 迭代 共享memo

```js
/**
 * @param {number} n
 * @return {number}
 */
var numSquares = function (n) {
    return f[n];
};

const MX = 1e4;
const f = Array(MX + 1).fill(Infinity);
f[0] = 0;
for (let i = 1; i <= MX; i++) {
    for (let j = 1; j * j <= i; j++) {
        f[i] = Math.min(f[i], f[i - j * j] + 1);
    }
}

```

##### 迭代

```js
/**
 * @param {number} n
 * @return {number}
 */
var numSquares = function (n) {
    const f = Array(n + 1).fill(Infinity);
    f[0] = 0;
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j * j <= i; j++) {
            f[i] = Math.min(f[i], f[i - j * j] + 1);
        }
    }
    return f[n];
};
```

##### dfs

```js
/**
 * @param {number} n
 * @return {number}
 */
var numSquares = function(n) {
    const memo = Array(n).fill(-1);
    const dfs = (i) => {
        if (i == 0) return memo[i] = 0;
        if (memo[i] >= 0) return memo[i];
        let res = Infinity;
        for (let j = 1; j * j <= i; j++) {
            res = Math.min(res, dfs(i - j * j) + 1);
        }
        return memo[i] = res;
    }
    return dfs(n);
};
```

#### [198. 打家劫舍](https://leetcode.cn/problems/house-robber/description/)

你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，**如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警**。

给定一个代表每个房屋存放金额的非负整数数组，计算你 **不触动警报装置的情况下** ，一夜之内能够偷窃到的最高金额。

**示例 1：**

```
输入：[1,2,3,1]
输出：4
解释：偷窃 1 号房屋 (金额 = 1) ，然后偷窃 3 号房屋 (金额 = 3)。
     偷窃到的最高金额 = 1 + 3 = 4 。
```

**示例 2：**

```
输入：[2,7,9,3,1]
输出：12
解释：偷窃 1 号房屋 (金额 = 2), 偷窃 3 号房屋 (金额 = 9)，接着偷窃 5 号房屋 (金额 = 1)。
     偷窃到的最高金额 = 2 + 9 + 1 = 12 。
```

**提示：**

* `1 <= nums.length <= 100`
* `0 <= nums[i] <= 400`

##### 迭代：空间压缩

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function (nums) {
    if (nums.length == 1) return nums[0];
    let p = p1 = Math.max(nums[0], nums[1]), p2 = nums[0];
    for (let i = 2; i < nums.length; i++) {
        p = Math.max(nums[i] + p2, p1);
        p2 = p1, p1 = p;
    }
    return p;
};
```

#### [118. 杨辉三角](https://leetcode.cn/problems/pascals-triangle/description/)

给定一个非负整数 *`numRows`，*生成「杨辉三角」的前 *`numRows`*行。

在**「杨辉三角」**中，每个数是它左上方和右上方的数的和。

![](https://pic.leetcode.cn/1626927345-DZmfxB-PascalTriangleAnimated2.gif)

**示例 1:**

```
输入: numRows = 5
输出: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
```

**示例 2:**

```
输入: numRows = 1
输出: [[1]]
```

**提示:**

* `1 <= numRows <= 30`

##### 迭代：ans[i][j] = ans[i - 1][j - 1] + ans[i - 1][j];

```js
/**
 * @param {number} numRows
 * @return {number[][]}
 */
var generate = function(numRows) {
    const ans = Array.from({length: numRows}, (_, i) => Array(i + 1).fill(1));
    for (let i = 2; i < numRows; i++) {
        for (let j = 1; j < i; j++) {
            ans[i][j] = ans[i - 1][j - 1] + ans[i - 1][j];
        }
    }
    return ans;
};

```

#### [70. 爬楼梯](https://leetcode.cn/problems/climbing-stairs/description/)

假设你正在爬楼梯。需要 `n` 阶你才能到达楼顶。

每次你可以爬 `1` 或 `2` 个台阶。你有多少种不同的方法可以爬到楼顶呢？

**示例 1：**

```
输入：n = 2
输出：2
解释：有两种方法可以爬到楼顶。
1. 1 阶 + 1 阶
2. 2 阶
```

**示例 2：**

```
输入：n = 3
输出：3
解释：有三种方法可以爬到楼顶。
1. 1 阶 + 1 阶 + 1 阶
2. 1 阶 + 2 阶
3. 2 阶 + 1 阶
```

**提示：**

* `1 <= n <= 45`

##### 动态规划：迭代 + 空间压缩

```js
/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    if (n <= 3) return n;
    let p = 0, p1 = 2, p2 = 1; 
    for (let i = 3; i <= n; i++) {
        p = p1 + p2;
        p2 = p1, p1 = p;
    }
    return p;
};
```

#### [763. 划分字母区间](https://leetcode.cn/problems/partition-labels/description/)

给你一个字符串 `s` 。我们要把这个字符串划分为尽可能多的片段，同一字母最多出现在一个片段中。例如，字符串 `"ababcc"` 能够被分为 `["abab", "cc"]`，但类似 `["aba", "bcc"]` 或 `["ab", "ab", "cc"]` 的划分是非法的。

注意，划分结果需要满足：将所有划分结果按顺序连接，得到的字符串仍然是 `s` 。

返回一个表示每个字符串片段的长度的列表。

**示例 1：**

```
输入：s = "ababcbacadefegdehijhklij"
输出：[9,7,8]
解释：
划分结果为 "ababcbaca"、"defegde"、"hijhklij" 。
每个字母最多出现在一个片段中。
像 "ababcbacadefegde", "hijhklij" 这样的划分是错误的，因为划分的片段数较少。
```

**示例 2：**

```
输入：s = "eccbbbbdec"
输出：[10]
```

**提示：**

* `1 <= s.length <= 500`
* `s` 仅由小写英文字母组成

##### 贪心：记录每个字符最后一次出现的位置，不断用pos更新end，当i等于end时，start和end区间内分隔为一个子串

```js
/**
 * @param {string} s
 * @return {number[]}
 */
var partitionLabels = function(s) {
    const n = s.length;
    const pos = Array(26).fill(0);
    for (let i = 0; i < s.length; i++) {
        pos[s[i].charCodeAt() - 97] = i;
    }
    const ans = [];
    let start = 0, end = 0;
    for (let i = 0; i < s.length; i++) {
        end = Math.max(end, pos[ s[i].charCodeAt() - 97]);
        if (i == end) {
            ans.push(end - start + 1);
            start = i + 1;
        }
    }

    return ans;
};
```

#### [45. 跳跃游戏 II](https://leetcode.cn/problems/jump-game-ii/description/)

给定一个长度为 `n` 的 **0 索引**整数数组 `nums`。初始位置在下标 0。

每个元素 `nums[i]` 表示从索引 `i` 向后跳转的最大长度。换句话说，如果你在索引 `i` 处，你可以跳转到任意 `(i + j)` 处：

* `0 <= j <= nums[i]` 且
* `i + j < n`

返回到达 `n - 1` 的最小跳跃次数。测试用例保证可以到达 `n - 1`。

**示例 1:**

```
输入: nums = [2,3,1,1,4]
输出: 2
解释: 跳到最后一个位置的最小跳跃数是 2。
     从下标为 0 跳到下标为 1 的位置，跳 1 步，然后跳 3 步到达数组的最后一个位置。
```

**示例 2:**

```
输入: nums = [2,3,0,1,4]
输出: 2
```

**提示:**

* `1 <= nums.length <= 104`
* `0 <= nums[i] <= 1000`
* 题目保证可以到达 `n - 1`

##### 贪心

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var jump = function(nums) {
    const n = nums.length;
    let rightMost = 0, prevRightMost  = 0, ans = 0;
    // 题目保证能到达末尾，i要小于n - 1，要不ans会多加一次
    for (let i = 0; i < n - 1; i++) {
        rightMost = Math.max(rightMost, i + nums[i]);
        if (i == prevRightMost) {
            ans++;
            prevRightMost = rightMost;
        }
    }
    return ans;
};
```

#### [55. 跳跃游戏](https://leetcode.cn/problems/jump-game/description/)

给你一个非负整数数组 `nums` ，你最初位于数组的 **第一个下标** 。数组中的每个元素代表你在该位置可以跳跃的最大长度。

判断你是否能够到达最后一个下标，如果可以，返回 `true` ；否则，返回 `false` 。

**示例 1：**

```
输入：nums = [2,3,1,1,4]
输出：true
解释：可以先跳 1 步，从下标 0 到达下标 1, 然后再从下标 1 跳 3 步到达最后一个下标。
```

**示例 2：**

```
输入：nums = [3,2,1,0,4]
输出：false
解释：无论怎样，总会到达下标为 3 的位置。但该下标的最大跳跃长度是 0 ， 所以永远不可能到达最后一个下标。
```

**提示：**

* `1 <= nums.length <= 104`
* `0 <= nums[i] <= 105`

##### 贪心

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {
    const n = nums.length;
    let rightMost = 0; // 能够到达的最右位置
    for (let i = 0; i < n && i <= rightMost && rightMost < n; i++) {
        let right = i + nums[i];
        if (right > rightMost) {
            rightMost = right;
        };
    }
   return rightMost >= n - 1;
};
```

##### 后缀和：如果从i能到达末尾，设为1，否则设为0，根据[i+1, i+nums[i]]范围内的后缀和判断i能否到达末尾

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {
    const n = nums.length;
    const suffix = Array(n + 1).fill(0);
    suffix[n - 1] = 1;
    for (let i = n - 2; i >= 0; i--) {
        let j = i + nums[i];
        let c = suffix[i + 1] - (suffix[j + 1] ?? 0);
        suffix[i] = suffix[i + 1] + (c > 0 ? 1 : 0);
    }
   return (suffix[0] - suffix[1]) > 0;
};
```

##### 迭代

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {
    const n = nums.length;
    const f = Array(n).fill(false);
    f[n - 1] = true;
    for (let i = n - 2; i >= 0; i--) {
        for (let j = 1; j <= nums[i] && i + j < n; j++) {
            if (f[i + j]) {
                f[i] = true;
                break;
            }
        }
    }
   return f[0];
};
```

##### dfs

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {
    const n = nums.length;
    const memo = Array(n);
    const dfs = (i) => {
        if (i == n - 1) return memo[i] = true;
        if (i >= n) return false;
        if (memo[i] !== undefined) return memo[i];
        for (let j = 1; j <= nums[i]; j++) {
            if (dfs(i + j)) return memo[i] = true;
        }
        return memo[i] = false;
    }
    return dfs(0);
};
```

#### [1390. 四因数](https://leetcode.cn/problems/four-divisors/description/)

给你一个整数数组 `nums`，请你返回该数组中恰有四个因数的这些整数的各因数之和。如果数组中不存在满足题意的整数，则返回 `0` 。

**示例 1：**

```
输入：nums = [21,4,7]
输出：32
解释：
21 有 4 个因数：1, 3, 7, 21
4 有 3 个因数：1, 2, 4
7 有 2 个因数：1, 7
答案仅为 21 的所有因数的和。
```

**示例 2:**

```
输入: nums = [21,21]
输出: 64
```

**示例 3:**

```
输入: nums = [1,2,3,4,5]
输出: 0
```

**提示：**

* `1 <= nums.length <= 104`
* `1 <= nums[i] <= 105`

##### 埃氏筛：预处理因子个数和因子和

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var sumFourDivisors = function(nums) {
    let sum = 0;
    for (let x of nums) {
        if (cnt[x] == 4) sum += sums[x];
    }
    return sum;
};

const MX = 1e5;
const cnt = Array(MX + 1).fill(2);
const sums = Array.from({length: MX + 1}, (_, i) => i + 1);

for (let i = 2; i <= MX; i++) {
    for (let j = i; i * j <= MX; j++) {
        cnt[i * j] += (j == i ? 1 : 2);
        sums[i * j] += (j == i ? i : i + j);
    }
}
```

