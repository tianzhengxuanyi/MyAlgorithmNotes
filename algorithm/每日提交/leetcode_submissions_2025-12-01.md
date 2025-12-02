### 2025-12-01

#### [3375. 使数组的值全部为 K 的最少操作次数](https://leetcode.cn/problems/minimum-operations-to-make-array-values-equal-to-k/description/)

给你一个整数数组 `nums` 和一个整数 `k` 。

如果一个数组中所有 **严格大于** `h` 的整数值都 **相等** ，那么我们称整数 `h` 是 **合法的** 。

比方说，如果 `nums = [10, 8, 10, 8]` ，那么 `h = 9` 是一个 **合法** 整数，因为所有满足 `nums[i] > 9` 的数都等于 10 ，但是 5 不是 **合法** 整数。

你可以对 `nums` 执行以下操作：

* 选择一个整数 `h` ，它对于 **当前** `nums` 中的值是合法的。
* 对于每个下标 `i` ，如果它满足 `nums[i] > h` ，那么将 `nums[i]` 变为 `h` 。

你的目标是将 `nums` 中的所有元素都变为 `k` ，请你返回 **最少** 操作次数。如果无法将所有元素都变 `k` ，那么返回 -1 。

**示例 1：**

**输入：**nums = [5,2,5,4,5], k = 2

**输出：**2

**解释：**

依次选择合法整数 4 和 2 ，将数组全部变为 2 。

**示例 2：**

**输入：**nums = [2,1,2], k = 2

**输出：**-1

**解释：**

没法将所有值变为 2 。

**示例 3：**

**输入：**nums = [9,7,5,3], k = 1

**输出：**4

**解释：**

依次选择合法整数 7 ，5 ，3 和 1 ，将数组全部变为 1 。

**提示：**

* `1 <= nums.length <= 100`
* `1 <= nums[i] <= 100`
* `1 <= k <= 100`

##### 等价转换为大于k的数字种类数

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var minOperations = function(nums, k) {
    const set = new Set();
    for (let x of nums) {
        if (x < k) return -1;
        if (x > k) {
            set.add(x);
        }
    }

    return set.size;
};
```

#### [554. 砖墙](https://leetcode.cn/problems/brick-wall/description/)

你的面前有一堵矩形的、由 `n` 行砖块组成的砖墙。这些砖块高度相同（也就是一个单位高）但是宽度不同。每一行砖块的宽度之和相等。

你现在要画一条 **自顶向下** 的、穿过 **最少** 砖块的垂线。如果你画的线只是从砖块的边缘经过，就不算穿过这块砖。**你不能沿着墙的两个垂直边缘之一画线，这样显然是没有穿过一块砖的。**

给你一个二维数组 `wall` ，该数组包含这堵墙的相关信息。其中，`wall[i]` 是一个代表从左至右每块砖的宽度的数组。你需要找出怎样画才能使这条线 **穿过的砖块数量最少** ，并且返回 **穿过的砖块数量** 。

**示例 1：**

![](https://assets.leetcode.com/uploads/2025/01/17/a.png)

```
输入：wall = [[1,2,2,1],[3,1,2],[1,3,2],[2,4],[3,1,2],[1,3,1,1]]
输出：2
```

**示例 2：**

```
输入：wall = [[1],[1],[1]]
输出：3
```

**提示：**

* `n == wall.length`
* `1 <= n <= 104`
* `1 <= wall[i].length <= 104`
* `1 <= sum(wall[i].length) <= 2 * 104`
* 对于每一行 `i` ，`sum(wall[i])` 是相同的
* `1 <= wall[i][j] <= 231 - 1`

##### 哈希 + 前缀和，求垂线穿过的砖块边缘数量的最大值

```js
/**
 * @param {number[][]} wall
 * @return {number}
 */
var leastBricks = function(wall) {
    const cnt = new Map();
    let ans = 0;
    for (let w of wall) {
        let sum = 0;
        for (let i = 0; i < w.length - 1; i++) {
            sum += w[i];
            cnt.set(sum, (cnt.get(sum) ?? 0) + 1);
            ans = Math.max(ans, cnt.get(sum));
        }
    }
    return wall.length - ans;
};
```

#### [463. 岛屿的周长](https://leetcode.cn/problems/island-perimeter/description/)

给定一个 `row x col` 的二维网格地图 `grid` ，其中：`grid[i][j] = 1` 表示陆地， `grid[i][j] = 0` 表示水域。

网格中的格子 **水平和垂直** 方向相连（对角线方向不相连）。整个网格被水完全包围，但其中恰好有一个岛屿（或者说，一个或多个表示陆地的格子相连组成的岛屿）。

岛屿中没有“湖”（“湖” 指水域在岛屿内部且不和岛屿周围的水相连）。格子是边长为 1 的正方形。网格为长方形，且宽度和高度均不超过 100 。计算这个岛屿的周长。

**示例 1：**

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/10/12/island.png)

```
输入：grid = [[0,1,0,0],[1,1,1,0],[0,1,0,0],[1,1,0,0]]
输出：16
解释：它的周长是上面图片中的 16 个黄色的边
```

**示例 2：**

```
输入：grid = [[1]]
输出：4
```

**示例 3：**

```
输入：grid = [[1,0]]
输出：4
```

**提示：**

* `row == grid.length`
* `col == grid[i].length`
* `1 <= row, col <= 100`
* `grid[i][j]` 为 `0` 或 `1`

##### 脑筋急转弯：枚举陆地格子上下左右四个方向的相邻格子

```js
/**
 * @param {number[][]} grid
 * @return {number}
 */
var islandPerimeter = function (grid) {
    const m = grid.length, n = grid[0].length;
    let ans = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] == 0) {
                continue;
            }
            if (i == 0 || grid[i - 1][j] == 0) {
                ans++;
            }
            if (i == m - 1 || grid[i + 1][j] == 0) {
                ans++;
            }
            if (j == 0 || grid[i][j - 1] == 0) {
                ans++;
            }
            if (j == n - 1 || grid[i][j + 1] == 0) {
                ans++;
            }
        }
    }
    return ans;
};
```

##### dfs

```js
/**
 * @param {number[][]} grid
 * @return {number}
 */
var islandPerimeter = function (grid) {
    const m = grid.length, n = grid[0].length;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] == 1) {
                return dfs(grid, i, j);
            }
        }
    }
};


const dfs = (grid, i, j) => {
    let res = 0;
    grid[i][j] = 2;
    if (grid[i + 1]?.[j] == 1) {
        res += dfs(grid, i + 1, j);
    } else {
        res += !grid[i + 1]?.[j] ? 1 : 0;
    }
    if (grid[i][j + 1] == 1) {
        res += dfs(grid, i, j + 1);
    } else {
        res += !grid[i][j + 1] ? 1 : 0;
    }
    if (grid[i - 1]?.[j] == 1) {
        res += dfs(grid, i - 1, j);
    } else {
        res += !grid[i - 1]?.[j] ? 1 : 0;
    }
    if (grid[i][j - 1] == 1) {
        res += dfs(grid, i, j - 1);
    } else {
        res += !grid[i][j - 1] ? 1 : 0;
    }
    return res;
}
```

#### [522. 最长特殊序列 II](https://leetcode.cn/problems/longest-uncommon-subsequence-ii/description/)

给定字符串列表 `strs` ，返回其中 **最长的特殊序列** 的长度。如果最长特殊序列不存在，返回 `-1` 。

**特殊序列** 定义如下：该序列为某字符串 **独有的子序列（即不能是其他字符串的子序列）**。

`s` 的 **子序列**可以通过删去字符串 `s` 中的某些字符实现。

* 例如，`"abc"` 是 `"aebdc"` 的子序列，因为您可以删除`"aebdc"`中的下划线字符来得到 `"abc"` 。`"aebdc"`的子序列还包括`"aebdc"`、 `"aeb"` 和 "" (空字符串)。

**示例 1：**

```
输入: strs = ["aba","cdc","eae"]
输出: 3
```

**示例 2:**

```
输入: strs = ["aaa","aaa","aa"]
输出: -1
```

**提示:**

* `2 <= strs.length <= 50`
* `1 <= strs[i].length <= 10`
* `strs[i]` 只包含小写英文字母

##### 枚举+判断子序列

```js
/**
 * @param {string[]} strs
 * @return {number}
 */
var findLUSlength = function(strs) {
    let ans = -1;
    outer: for (let i = 0; i < strs.length; i++) {
        let str1 = strs[i];
        for (let j = 0; j < strs.length; j++) {
            let str2 = strs[j];
            if (i == j || str1.length > str2.length) continue;
            if (str1 == str2) continue outer;
            let k = 0;
            for (let x of str2) {
                if (x == str1[k]) {
                    k++;
                }
            }
            if (k == str1.length) continue outer;
        }
        ans = Math.max(ans, str1.length);
    }

    return ans;
};
```

#### [521. 最长特殊序列 Ⅰ](https://leetcode.cn/problems/longest-uncommon-subsequence-i/description/)

给你两个字符串 `a` 和 `b`，请返回 *这两个字符串中 **最长的特殊序列*** 的长度。如果不存在，则返回 `-1` 。

**「最长特殊序列」** 定义如下：该序列为 **某字符串独有的最长子序列（即不能是其他字符串的子序列）** 。

字符串 `s` 的子序列是在从 `s` 中删除任意数量的字符后可以获得的字符串。

* 例如，`"abc"` 是 `"aebdc"` 的子序列，因为删除 `"aebdc"` 中斜体加粗的字符可以得到 `"abc"` 。 `"aebdc"` 的子序列还包括 `"aebdc"` 、 `"aeb"` 和 `""` (空字符串)。

**示例 1：**

```
输入: a = "aba", b = "cdc"
输出: 3
解释: 最长特殊序列可为 "aba" (或 "cdc")，两者均为自身的子序列且不是对方的子序列。
```

**示例 2：**

```
输入：a = "aaa", b = "bbb"
输出：3
解释: 最长特殊序列是 "aaa" 和 "bbb" 。
```

**示例 3：**

```
输入：a = "aaa", b = "aaa"
输出：-1
解释: 字符串 a 的每个子序列也是字符串 b 的每个子序列。同样，字符串 b 的每个子序列也是字符串 a 的子序列。
```

**提示：**

* `1 <= a.length, b.length <= 100`
* `a` 和 `b` 由小写英文字母组成

##### 脑筋急转弯

```js
/**
 * @param {string} a
 * @param {string} b
 * @return {number}
 */
var findLUSlength = function(a, b) {
    if (a == b) return -1;
    return Math.max(a.length, b.length);
};
```

#### [598. 区间加法 II](https://leetcode.cn/problems/range-addition-ii/description/)

给你一个 `m x n` 的矩阵 `M`和一个操作数组 `op` 。矩阵初始化时所有的单元格都为 `0` 。`ops[i] = [ai, bi]` 意味着当所有的 `0 <= x < ai` 和 `0 <= y < bi` 时， `M[x][y]` 应该加 1。

在 *执行完所有操作后* ，计算并返回 *矩阵中最大整数的个数* 。

**示例 1:**

![](https://assets.leetcode.com/uploads/2020/10/02/ex1.jpg)

```
输入: m = 3, n = 3，ops = [[2,2],[3,3]]
输出: 4
解释: M 中最大的整数是 2, 而且 M 中有4个值为2的元素。因此返回 4。
```

**示例 2:**

```
输入: m = 3, n = 3, ops = [[2,2],[3,3],[3,3],[3,3],[2,2],[3,3],[3,3],[3,3],[2,2],[3,3],[3,3],[3,3]]
输出: 4
```

**示例 3:**

```
输入: m = 3, n = 3, ops = []
输出: 9
```

**提示:**

* `1 <= m, n <= 4 * 104`
* `0 <= ops.length <= 104`
* `ops[i].length == 2`
* `1 <= ai <= m`
* `1 <= bi <= n`

##### 脑筋急转弯

```js
/**
 * @param {number} m
 * @param {number} n
 * @param {number[][]} ops
 * @return {number}
 */
var maxCount = function (m, n, ops) {
    let mnr = m, mnc = n;
    for (let [r, c] of ops) {
        mnr = Math.min(r, mnr);
        mnc = Math.min(c, mnc);
    }
    return mnc * mnr;
};
```

#### [2611. 老鼠和奶酪](https://leetcode.cn/problems/mice-and-cheese/description/)

有两只老鼠和 `n` 块不同类型的奶酪，每块奶酪都只能被其中一只老鼠吃掉。

下标为 `i` 处的奶酪被吃掉的得分为：

* 如果第一只老鼠吃掉，则得分为 `reward1[i]` 。
* 如果第二只老鼠吃掉，则得分为 `reward2[i]` 。

给你一个正整数数组 `reward1` ，一个正整数数组 `reward2` ，和一个非负整数 `k` 。

请你返回第一只老鼠恰好吃掉 `k` 块奶酪的情况下，**最大** 得分为多少。

**示例 1：**

```
输入：reward1 = [1,1,3,4], reward2 = [4,4,1,1], k = 2
输出：15
解释：这个例子中，第一只老鼠吃掉第 2 和 3 块奶酪（下标从 0 开始），第二只老鼠吃掉第 0 和 1 块奶酪。
总得分为 4 + 4 + 3 + 4 = 15 。
15 是最高得分。
```

**示例 2：**

```
输入：reward1 = [1,1], reward2 = [1,1], k = 2
输出：2
解释：这个例子中，第一只老鼠吃掉第 0 和 1 块奶酪（下标从 0 开始），第二只老鼠不吃任何奶酪。
总得分为 1 + 1 = 2 。
2 是最高得分。
```

**提示：**

* `1 <= n == reward1.length == reward2.length <= 105`
* `1 <= reward1[i], reward2[i] <= 1000`
* `0 <= k <= n`

##### 贪心：先把奶酪全部给第二只老鼠，然后撤销其中的第 i 块奶酪

```js
/**
 * @param {number[]} reward1
 * @param {number[]} reward2
 * @param {number} k
 * @return {number}
 */
var miceAndCheese = function(reward1, reward2, k) {
    const diff = Array(k);
    let ans = 0;
    for (let i = 0; i < reward1.length; i++) {
        diff[i] = reward1[i] - reward2[i];
        ans += reward2[i];
    }
    diff.sort((a, b) => b - a);
    for (let i = 0; i < k; i++) {
        ans += diff[i];
    }

    return ans;
};
```

#### [2141. 同时运行 N 台电脑的最长时间](https://leetcode.cn/problems/maximum-running-time-of-n-computers/description/)

你有 `n` 台电脑。给你整数 `n` 和一个下标从 **0** 开始的整数数组 `batteries` ，其中第 `i` 个电池可以让一台电脑 **运行**`batteries[i]` 分钟。你想使用这些电池让 **全部** `n` 台电脑 **同时** 运行。

一开始，你可以给每台电脑连接 **至多一个电池** 。然后在任意整数时刻，你都可以将一台电脑与它的电池断开连接，并连接另一个电池，你可以进行这个操作 **任意次** 。新连接的电池可以是一个全新的电池，也可以是别的电脑用过的电池。断开连接和连接新的电池不会花费任何时间。

注意，你不能给电池充电。

请你返回你可以让 `n` 台电脑同时运行的 **最长** 分钟数。

**示例 1：**

![](https://assets.leetcode.com/uploads/2022/01/06/example1-fit.png)

```
输入：n = 2, batteries = [3,3,3]
输出：4
解释：
一开始，将第一台电脑与电池 0 连接，第二台电脑与电池 1 连接。
2 分钟后，将第二台电脑与电池 1 断开连接，并连接电池 2 。注意，电池 0 还可以供电 1 分钟。
在第 3 分钟结尾，你需要将第一台电脑与电池 0 断开连接，然后连接电池 1 。
在第 4 分钟结尾，电池 1 也被耗尽，第一台电脑无法继续运行。
我们最多能同时让两台电脑同时运行 4 分钟，所以我们返回 4 。
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2022/01/06/example2.png)

```
输入：n = 2, batteries = [1,1,1,1]
输出：2
解释：
一开始，将第一台电脑与电池 0 连接，第二台电脑与电池 2 连接。
一分钟后，电池 0 和电池 2 同时耗尽，所以你需要将它们断开连接，并将电池 1 和第一台电脑连接，电池 3 和第二台电脑连接。
1 分钟后，电池 1 和电池 3 也耗尽了，所以两台电脑都无法继续运行。
我们最多能让两台电脑同时运行 2 分钟，所以我们返回 2 。
```

**提示：**

* `1 <= n <= batteries.length <= 105`
* `1 <= batteries[i] <= 109`

##### [贪心](https://leetcode.cn/problems/maximum-running-time-of-n-computers/solutions/3846120/shuang-jie-xiao-dian-chi-pin-jie-da-dian-9t6a/?envType=daily-question&envId=2025-12-01)

```js
/**
 * @param {number} n
 * @param {number[]} batteries
 * @return {number}
 */
var maxRunTime = function(n, batteries) {
    batteries.sort((a, b) => a - b);
    let total = 0;
    for (let x of batteries) {
        total += x;
    }
    // 从最大的开始检查
    for (let i = batteries.length - 1; i >= 0; i--) {
        // 理论上的平均运行时间
        let avg = Math.floor(total / n);
        // 贪心判断：
        if (batteries[i] > avg) {
            // 当前最大的电池能独自支撑一台电脑，且多余电量无法分给别人
            n--;
            total -= batteries[i];
        } else {
            // 如果最大电池 <= 平均时间，说明所有剩余电池都能被完美利用
            return avg;
        }
    }
    return 0;
};
```

##### 二分答案

```js
/**
 * @param {number} n
 * @param {number[]} batteries
 * @return {number}
 */
var maxRunTime = function(n, batteries) {
    let left  = 0, right = 0;
    for (let x of batteries) {
        right += x;
    }
    right = Math.ceil(right / n);
    while (left <= right) {
        let m = Math.floor((right - left) / 2) + left;
        let sum = 0;
        for (let x of batteries) {
            sum += Math.min(m, x);
        }
        if (sum >= m * n) {
            left = m + 1;
        } else {
            right = m - 1;
        }
    }
    return right;
};
```

