### 2026-02-02

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

#### [32. 最长有效括号](https://leetcode.cn/problems/longest-valid-parentheses/description/)

给你一个只包含 `'('` 和 `')'` 的字符串，找出最长有效（格式正确且连续）括号 子串 的长度。

左右括号匹配，即每个左括号都有对应的右括号将其闭合的字符串是格式正确的，比如 `"(()())"`。

**示例 1：**

```
输入：s = "(()"
输出：2
解释：最长有效括号子串是 "()"
```

**示例 2：**

```
输入：s = ")()())"
输出：4
解释：最长有效括号子串是 "()()"
```

**示例 3：**

```
输入：s = ""
输出：0
```

**提示：**

* `0 <= s.length <= 3 * 104`
* `s[i]` 为 `'('` 或 `')'`

##### [ 用时: 14 m 49 s ]

```js
/**
 * @param {string} s
 * @return {number}
 */
var longestValidParentheses = function (s) {
    const n = s.length;
    const f = Array(n).fill(0);
    let ans = 0;
    for (let i = 1; i < n; i++) {
        if (s[i] == ")") {
            if (s[i - 1] == "(") {
                f[i] = (f[i - 2] ?? 0) + 2;
            } else if (s[i - 1 - f[i - 1]] == "(") {
                f[i] = f[i - 1] + 2 + (f[i - 2 - f[i - 1]] ?? 0);
            }
        }
        ans = Math.max(ans, f[i]);
    }
    return ans;
};
```

#### [300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/description/)

给你一个整数数组 `nums` ，找到其中最长严格递增子序列的长度。

**子序列**是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，`[3,6,2,7]` 是数组 `[0,3,1,6,2,2,7]` 的子序列。

**示例 1：**

```
输入：nums = [10,9,2,5,3,7,101,18]
输出：4
解释：最长递增子序列是 [2,3,7,101]，因此长度为 4 。
```

**示例 2：**

```
输入：nums = [0,1,0,3,2,3]
输出：4
```

**示例 3：**

```
输入：nums = [7,7,7,7,7,7,7]
输出：1
```

**提示：**

* `1 <= nums.length <= 2500`
* `-104 <= nums[i] <= 104`

**进阶：**

* 你能将算法的时间复杂度降低到 `O(n log(n))` 吗?

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

#### [3013. 将数组分成最小总代价的子数组 II](https://leetcode.cn/problems/divide-an-array-into-subarrays-with-minimum-cost-ii/description/)

给你一个下标从 **0** 开始长度为 `n` 的整数数组 `nums` 和两个 **正** 整数 `k` 和 `dist` 。

一个数组的 **代价** 是数组中的 **第一个** 元素。比方说，`[1,2,3]` 的代价为 `1` ，`[3,4,1]` 的代价为 `3` 。

你需要将 `nums` 分割成 `k` 个 **连续且互不相交** 的子数组，满足 **第二** 个子数组与第 `k` 个子数组中第一个元素的下标距离 **不超过** `dist` 。换句话说，如果你将 `nums` 分割成子数组 `nums[0..(i1 - 1)], nums[i1..(i2 - 1)], ..., nums[ik-1..(n - 1)]` ，那么它需要满足 `ik-1 - i1 <= dist` 。

请你返回这些子数组的 **最小** 总代价。

**示例 1：**

```
输入：nums = [1,3,2,6,4,2], k = 3, dist = 3
输出：5
解释：将数组分割成 3 个子数组的最优方案是：[1,3] ，[2,6,4] 和 [2] 。这是一个合法分割，因为 ik-1 - i1 等于 5 - 2 = 3 ，等于 dist 。总代价为 nums[0] + nums[2] + nums[5] ，也就是 1 + 2 + 2 = 5 。
5 是分割成 3 个子数组的最小总代价。
```

**示例 2：**

```
输入：nums = [10,1,2,2,2,1], k = 4, dist = 3
输出：15
解释：将数组分割成 4 个子数组的最优方案是：[10] ，[1] ，[2] 和 [2,2,1] 。这是一个合法分割，因为 ik-1 - i1 等于 3 - 1 = 2 ，小于 dist 。总代价为 nums[0] + nums[1] + nums[2] + nums[3] ，也就是 10 + 1 + 2 + 2 = 15 。
分割 [10] ，[1] ，[2,2,2] 和 [1] 不是一个合法分割，因为 ik-1 和 i1 的差为 5 - 1 = 4 ，大于 dist 。
15 是分割成 4 个子数组的最小总代价。
```

**示例 3：**

```
输入：nums = [10,8,18,9], k = 3, dist = 1
输出：36
解释：将数组分割成 4 个子数组的最优方案是：[10] ，[8] 和 [18,9] 。这是一个合法分割，因为 ik-1 - i1 等于 2 - 1 = 1 ，等于 dist 。总代价为 nums[0] + nums[1] + nums[2] ，也就是 10 + 8 + 18 = 36 。
分割 [10] ，[8,18] 和 [9] 不是一个合法分割，因为 ik-1 和 i1 的差为 3 - 1 = 2 ，大于 dist 。
36 是分割成 3 个子数组的最小总代价。
```

**提示：**

* `3 <= n <= 105`
* `1 <= nums[i] <= 109`
* `3 <= k <= n`
* `k - 2 <= dist <= n - 2`

##### 有序集合模板

```js
const {
    BinarySearchTree,
    BinarySearchTreeNode,
    AvlTree,
    AvlTreeNode,
} = require("@datastructures-js/binary-search-tree");
/**
 * @param {number[]} nums
 * @param {number} k
 * @param {number} dist
 * @return {number}
 */
var minimumCost = function (nums, k, dist) {
    const n = nums.length;
    // 第二个子数组的第一个元素i于第k个子数组的第一个元素i_k的距离小于等于dist
    // 满足这个条件，求最小的总代价 => 在长度为dist的滑动窗口里选择k-1个最小的数
    const st = new Container(k - 2); // 有序集合  不包含最后一个子组数的开头元素
    // 
    for (let i = 1; i < k - 1; i++) { // 添加第一窗口的数据
        st.add(nums[i]);
    }
    let ans = st.getSum() + nums[k - 1];
    // 下标i代表最后一个子数组的首个元素的下标为i，滑动窗口并不包含它，子数组要非空，省去判空最后一个子数组
    for (let i = k; i < n; i++) {
        let j = i - dist - 1; // 离开窗口的下标
        if (j > 0) {
            st.erase(nums[j]); // 从有序集合中移除
        }
        st.add(nums[i - 1]); // 添加
        ans = Math.min(ans, st.getSum() + nums[i]);
    }

    return ans + nums[0];
};

class Container {
    constructor(k) {
        this.k = k;
        this.st1 = new Map();
        this.st2 = new Map();
        this.st1Size = 0;
        this.st2Size = 0;
        // 前k小的值存放到tree1
        this.tree1 = new AvlTree((a, b) => a - b);
        // 其余的值存放到tree2
        this.tree2 = new AvlTree((a, b) => a - b);
        this.sum = 0;
    }

    add(x) {
        // 如果st2有元素且x大于tree2的最小值，x加入tree2中
        if (this.st2Size > 0 && x >= this.tree2.min().getValue()) {
            this.st2Size++;
            this.st2.set(x, (this.st2.get(x) ?? 0) + 1);
            this.tree2.insert(x);
        } else {
            // 加入tree1
            this.st1Size++;
            this.st1.set(x, (this.st1.get(x) ?? 0) + 1);
            this.tree1.insert(x);
            this.sum += x;
        }
        this.adjust(); // 保证tree1的size小于等于k
    }

    erase(x) {
        // st2中有x，则优先删除st2中的x
        if (this.st2.has(x)) {
            this.st2Size--;
            this.st2.set(x, this.st2.get(x) - 1);
            if (this.st2.get(x) == 0) {
                this.st2.delete(x);
                this.tree2.remove(x);
            }
        } else if (this.st1.has(x)) {
            this.st1Size--;
            this.st1.set(x, this.st1.get(x) - 1);
            if (this.st1.get(x) == 0) {
                this.st1.delete(x);
                this.tree1.remove(x);
            }
            this.sum -= x;
        }
        this.adjust();
    }

    adjust() {
        // tree1 size大于k
        while (this.st1Size > this.k) {
            let x = this.tree1.max().getValue();
            this.st1Size--;
            this.st1.set(x, this.st1.get(x) - 1);
            if (this.st1.get(x) == 0) {
                this.st1.delete(x);
                this.tree1.remove(x);
            }
            this.sum -= x;
            
            this.st2Size++;
            this.st2.set(x, (this.st2.get(x) ?? 0) + 1);
            this.tree2.insert(x);
        }

        // tree1 size小于k且 tree2 size大于0，要从tree2移动最小的值到tree1中
        while (this.st1Size < this.k && this.st2Size > 0) {
            let x = this.tree2.min().getValue();
            this.st2Size--;
            this.st2.set(x, this.st2.get(x) - 1);
            if (this.st2.get(x) == 0) {
                this.st2.delete(x);
                this.tree2.remove(x);
            }
            this.st1Size++;
            this.st1.set(x, (this.st1.get(x) ?? 0) + 1);
            this.tree1.insert(x);
            this.sum += x;
        }
    }

    getSum() {
        return this.sum;
    }
}
```

