### 2026-01-05

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

##### 不需要额外空间

```js
/**
 * @param {string} s
 * @return {number}
 */
var longestValidParentheses = function (s) {
    const n = s.length;
    let ans = 0, left = 0, right = 0;
    for (let i = 0; i < n; i++) {
        if (s[i] == "(") {
            left++;
        } else {
            right++;
        }
        if (left == right) {
            ans = Math.max(ans, 2 * left);
        } else if (right > left) {
            left = right = 0;
        }
    }
    left = right = 0;
    for (let i = n - 1; i >= 0; i--) {
        if (s[i] == "(") {
            left++;
        } else {
            right++;
        }
        if (left == right) {
            ans = Math.max(ans, 2 * left);
        } else if (left > right) {
            left = right = 0;
        }
    }
    return ans;
};
```

##### 栈

```js
/**
 * @param {string} s
 * @return {number}
 */
var longestValidParentheses = function(s) {
    const n = s.length;
    // 「最后一个没有被匹配的右括号的下标」
    const st = [-1];
    let ans = 0;
    for (let i = 0; i < n; i++) {
        if (s[i] == "(") {
            st.push(i);
        } else {
            let t = st.pop();
            // 右括号未匹配
            if (st.length == 0) {
                st.push(i);
            } else {
                ans = Math.max(ans, i - st[st.length - 1]);
            }
        }
    }
    return ans;
};
```

##### 动态规划

```js
/**
 * @param {string} s
 * @return {number}
 */
var longestValidParentheses = function(s) {
    const n = s.length;
    const f = Array(n).fill(0);
    let ans = 0;
    for (let i = 1; i < n; i++) {
        if (s[i] == ")") {
            if (s[i - 1] == "(") {
                f[i] = (f[i - 2] ?? 0) + 2
            } else {
                if (s[i - f[i - 1] - 1] == "(") {
                    // ( + () + )
                    f[i] = (f[i - f[i - 1] - 2] ?? 0) + (f[i - 1] + 2)
                }
            }
        }
        ans = Math.max(ans, f[i]);
    }
    return ans;
};
```

#### [416. 分割等和子集](https://leetcode.cn/problems/partition-equal-subset-sum/description/)

给你一个 **只包含正整数** 的 **非空** 数组 `nums` 。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。

**示例 1：**

```
输入：nums = [1,5,11,5]
输出：true
解释：数组可以分割成 [1, 5, 5] 和 [11] 。
```

**示例 2：**

```
输入：nums = [1,2,3,5]
输出：false
解释：数组不能分割成两个元素和相等的子集。
```

**提示：**

* `1 <= nums.length <= 200`
* `1 <= nums[i] <= 100`

##### 迭代 剪枝 + 提前返回

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canPartition = function (nums) {
    const n = nums.length;
    const total = _.sum(nums);
    if (total % 2) return false;
    const target = total / 2;
    const f = Array(target + 1).fill(false);
    f[0] = true;
    for (let i = n - 1; i >= 0; i--) {
        for (let r = target; r >= nums[i]; r--) {
            f[r] = f[r] || f[r - nums[i]];
        }
        // 提前return
        if (f[target]) return true;
    }
    return false;
};
```

##### 迭代 + 空间压缩

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canPartition = function (nums) {
    const n = nums.length;
    const total = _.sum(nums);
    if (total % 2) return false;
    const target = total / 2;
    const f = Array(target + 1).fill(false);
    f[0] = true;
    for (let i = n - 1; i >= 0; i--) {
        for (let r = target; r >= 1; r--) {
            f[r] = f[r] || (f[r - nums[i]] ?? false);
        }
    }
    return f[target];
};
```

##### dfs + 记忆化缓存

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canPartition = function (nums) {
    const n = nums.length;
    const total = _.sum(nums);
    if (total % 2) return false;
    const target = total / 2;
    const memo = Array.from({ length: n }, () => Array(target + 1))
    const dfs = (i, r) => {
        if (r == 0) return true;
        if (i >= n || r < 0) return false;
        if (memo[i][r] !== undefined) return memo[i][r];
        return memo[i][r] = dfs(i + 1, r) || dfs(i + 1, r - nums[i]);
    }
    return dfs(0, target);
};
```

#### [152. 乘积最大子数组](https://leetcode.cn/problems/maximum-product-subarray/description/)

给你一个整数数组 `nums` ，请你找出数组中乘积最大的非空连续 子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。

测试用例的答案是一个 **32-位** 整数。

**请注意**，一个只包含一个元素的数组的乘积是这个元素的值。

**示例 1:**

```
输入: nums = [2,3,-2,4]
输出: 6
解释: 子数组 [2,3] 有最大乘积 6。
```

**示例 2:**

```
输入: nums = [-2,0,-1]
输出: 0
解释: 结果不能为 2, 因为 [-2,-1] 不是子数组。
```

**提示:**

* `1 <= nums.length <= 2 * 104`
* `-10 <= nums[i] <= 10`
* `nums` 的任何子数组的乘积都 **保证** 是一个 **32-位** 整数

##### 迭代 + 空间压缩

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function (nums) {
    let ans = nums[0], mx = nums[0], mn = nums[0];
    for (let i = 1; i < nums.length; i++) {
        ans = Math.max(ans, Math.max(nums[i], nums[i] * mx, nums[i] * mn));
        [mx, mn] = [Math.max(nums[i], nums[i] * mx, nums[i] * mn), Math.min(nums[i], nums[i] * mx, nums[i] * mn)]
    }
    return ans;
};
```

##### dfs记忆化缓存

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function(nums) {
    const n = nums.length;
    let ans = nums[0];
    const memo = Array(n);
    const dfs = (i) => {
        if (i == 0) return memo[i] = [nums[i], nums[i]];
        if (memo[i]) return memo[i];
        const [mx, mn] = dfs(i - 1);
        ans = Math.max(ans, Math.max(nums[i], nums[i] * mx, nums[i] * mn));
        return  memo[i] =  [Math.max(nums[i], nums[i] * mx, nums[i] * mn), Math.min(nums[i], nums[i] * mx, nums[i] * mn)]
    }
    dfs(n - 1);
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

##### 贪心 + 二分

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function (nums) {
    const n = nums.length;
    const LIS = [0];
    const lowerBound = (target) => {
        let l = 0, r = LIS.length - 1;
        while (l <= r) {
            let m = Math.floor((r - l) / 2) + l;
            if (nums[LIS[m]] < target) {
                l = m + 1;
            } else {
                r = m - 1;
            }
        }
        return l;
    }
    for (let i = 0; i < n; i++) {
        if (nums[i] > nums[LIS[LIS.length - 1]]) {
            LIS.push(i);
        } else {
            let pos = lowerBound(nums[i]);
            LIS[pos] = i;
        }
    }
    return LIS.length
};


```

#### [139. 单词拆分](https://leetcode.cn/problems/word-break/description/)

给你一个字符串 `s` 和一个字符串列表 `wordDict` 作为字典。如果可以利用字典中出现的一个或多个单词拼接出 `s` 则返回 `true`。

**注意：**不要求字典中出现的单词全部都使用，并且字典中的单词可以重复使用。

**示例 1：**

```
输入: s = "leetcode", wordDict = ["leet", "code"]
输出: true
解释: 返回 true 因为 "leetcode" 可以由 "leet" 和 "code" 拼接成。
```

**示例 2：**

```
输入: s = "applepenapple", wordDict = ["apple", "pen"]
输出: true
解释: 返回 true 因为 "applepenapple" 可以由 "apple" "pen" "apple" 拼接成。
     注意，你可以重复使用字典中的单词。
```

**示例 3：**

```
输入: s = "catsandog", wordDict = ["cats", "dog", "sand", "and", "cat"]
输出: false
```

**提示：**

* `1 <= s.length <= 300`
* `1 <= wordDict.length <= 1000`
* `1 <= wordDict[i].length <= 20`
* `s` 和 `wordDict[i]` 仅由小写英文字母组成
* `wordDict` 中的所有字符串 **互不相同**

##### 迭代 + hash set

```js
/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function (s, wordDict) {
    const n = s.length;
    const st = new Set(wordDict);
    let mxL = 0;
    for (let word of wordDict) {
        mxL = Math.max(mxL, word.length);
    }
    const f = Array(n + 1).fill(false);
    f[n] = true;
    for (let i = n - 1; i >= 0; i--) {
        for (let j = i; j < n && j < i + mxL; j++) {
            if (st.has(s.slice(i, j + 1)) && f[j + 1]) {
                f[i] = true;
                break;
            };
        }
    }
    return f[0];
};
```

##### 迭代 + 字典树

```js
/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function (s, wordDict) {
    const n = s.length;
    const trie = new TrieNode();
    for (const word of wordDict) {
        let node = trie;
        for (const w of word) {
            const code = w.charCodeAt() - 97;
            if (!node[code]) {
                node[code] = new TrieNode();
            }
            node = node[code];
        }
        node.end = true;
    }
    const f = Array(n + 1).fill(false);
    f[n] = true;
    for (let i = n - 1; i >= 0; i--) {
        let node = trie, j = i, code = s[j].charCodeAt() - 97;
        while (j < n && node[code]) {
            node = node[code];
            if (node.end && f[j + 1]) {
                f[i] = true;
                break;
            }
            j++;
            code = (s[j]?.charCodeAt()) - 97;
        }
    }
    return f[0];
};

function TrieNode() {
    this.next = Array(26);
    this.end = false;
}
```

##### dfs + 字典树

```js
/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function (s, wordDict) {
    const n = s.length;
    const trie = new TrieNode();
    for (const word of wordDict) {
        let node = trie;
        for (const w of word) {
            const code = w.charCodeAt() - 97;
            if (!node[code]) {
                node[code] = new TrieNode();
            }
            node = node[code];
        }
        node.end = true;
    }
    const memo = Array(n + 1);
    const dfs = (i) => {
        if (i == n) return memo[i] = true;
        if (memo[i] !== undefined) return memo[i];
        let node = trie, j = i, code = s[j].charCodeAt() - 97;
        while (j < n && node[code]) {
            node = node[code];
            if (node.end && dfs(j + 1)) return memo[i] = true;
            j++;
            code = (s[j]?.charCodeAt()) - 97;
        }
        return memo[i] = false;
    }

    return dfs(0);
};

function TrieNode() {
    this.next = Array(26);
    this.end = false;
}
```

#### [1975. 最大方阵和](https://leetcode.cn/problems/maximum-matrix-sum/description/)

给你一个 `n x n` 的整数方阵 `matrix` 。你可以执行以下操作 **任意次** ：

* 选择 `matrix` 中 **相邻** 两个元素，并将它们都 **乘以** `-1` 。

如果两个元素有 **公共边** ，那么它们就是 **相邻** 的。

你的目的是 **最大化** 方阵元素的和。请你在执行以上操作之后，返回方阵的 **最大** 和。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/07/16/pc79-q2ex1.png)

```
输入：matrix = [[1,-1],[-1,1]]
输出：4
解释：我们可以执行以下操作使和等于 4 ：
- 将第一行的 2 个元素乘以 -1 。
- 将第一列的 2 个元素乘以 -1 。
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2021/07/16/pc79-q2ex2.png)

```
输入：matrix = [[1,2,3],[-1,-2,-3],[1,2,3]]
输出：16
解释：我们可以执行以下操作使和等于 16 ：
- 将第二行的最后 2 个元素乘以 -1 。
```

**提示：**

* `n == matrix.length == matrix[i].length`
* `2 <= n <= 250`
* `-105 <= matrix[i][j] <= 105`

##### 任意位置的两个负数都可以通过多次操作变成正数

```js
/**
 * @param {number[][]} matrix
 * @return {number}
 */
var maxMatrixSum = function (matrix) {
    let ans = 0, maxNegative = -Infinity, minPositive = Infinity,
        cnt = 0;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (matrix[i][j] > 0) {
                ans += matrix[i][j];
                minPositive = Math.min(minPositive, matrix[i][j]);
            } else {
                ans -= matrix[i][j];
                cnt++;
                maxNegative = Math.max(maxNegative, matrix[i][j]);
            }
        }
    }
    return cnt % 2 ? ans - Math.min(-maxNegative, minPositive) * 2 : ans;
};
```

