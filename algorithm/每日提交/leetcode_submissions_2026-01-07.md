### 2026-01-07

#### [75. 颜色分类](https://leetcode.cn/problems/sort-colors/description/)

给定一个包含红色、白色和蓝色、共 `n`个元素的数组 `nums` ，**[原地](https://baike.baidu.com/item/%E5%8E%9F%E5%9C%B0%E7%AE%97%E6%B3%95)**对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。

我们使用整数 `0`、 `1` 和 `2` 分别表示红色、白色和蓝色。



必须在不使用库内置的 sort 函数的情况下解决这个问题。

**示例 1：**

```
输入：nums = [2,0,2,1,1,0]
输出：[0,0,1,1,2,2]
```

**示例 2：**

```
输入：nums = [2,0,1]
输出：[0,1,2]
```

**提示：**

* `n == nums.length`
* `1 <= n <= 300`
* `nums[i]` 为 `0`、`1` 或 `2`

**进阶：**

* 你能想出一个仅使用常数空间的一趟扫描算法吗？

##### 荷兰旗问题

```js
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var sortColors = function(nums) {
    let n = nums.length, p1 = 0, p2 = n - 1;
    let i = 0;
    while (i <= p2) {
        if (nums[i] == 2) {
            [nums[i], nums[p2]] = [nums[p2], nums[i]];
            p2--;
        } else if (nums[i] == 0) {
            [nums[i], nums[p1]] = [nums[p1], nums[i]];
            p1++;
            i++;
        } else {
            i++
        }
    }
};
```

#### [169. 多数元素](https://leetcode.cn/problems/majority-element/description/)

给定一个大小为 `n`的数组 `nums` ，返回其中的多数元素。多数元素是指在数组中出现次数 **大于** `⌊ n/2 ⌋` 的元素。

你可以假设数组是非空的，并且给定的数组总是存在多数元素。

**示例 1：**

```
输入：nums = [3,2,3]
输出：3
```

**示例 2：**

```
输入：nums = [2,2,1,1,1,2,2]
输出：2
```

**提示：**

* `n == nums.length`
* `1 <= n <= 5 * 104`
* `-109 <= nums[i] <= 109`
* 输入保证数组中一定有一个多数元素。

**进阶：**尝试设计时间复杂度为 O(n)、空间复杂度为 O(1) 的算法解决此问题。

##### 摩尔投票

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {
    let cnt = 0, ans = 0;
    for (let x of nums) {
        if (cnt == 0) {
            ans = x;
            cnt = 1;
        } else {
            cnt += ans == x ? 1 : -1;
        }
    }
    return ans;
};
```

#### [136. 只出现一次的数字](https://leetcode.cn/problems/single-number/description/)

给你一个 **非空** 整数数组 `nums` ，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。

你必须设计并实现线性时间复杂度的算法来解决此问题，且该算法只使用常量额外空间。

**示例 1 ：**

**输入：**nums = [2,2,1]

**输出：**1

**示例 2 ：**

**输入：**nums = [4,1,2,1,2]

**输出：**4

**示例 3 ：**

**输入：**nums = [1]

**输出：**1

**提示：**

* `1 <= nums.length <= 3 * 104`
* `-3 * 104 <= nums[i] <= 3 * 104`
* 除了某个元素只出现一次以外，其余每个元素均出现两次。

##### 异或

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function(nums) {
    let xors = 0;
    for (let x of nums) {
        xors ^= x;
    }
    return xors;
};
```

#### [72. 编辑距离](https://leetcode.cn/problems/edit-distance/description/)

给你两个单词 `word1` 和 `word2`， *请返回将 `word1` 转换成 `word2` 所使用的最少操作数*  。

你可以对一个单词进行如下三种操作：

* 插入一个字符
* 删除一个字符
* 替换一个字符

**示例 1：**

```
输入：word1 = "horse", word2 = "ros"
输出：3
解释：
horse -> rorse (将 'h' 替换为 'r')
rorse -> rose (删除 'r')
rose -> ros (删除 'e')
```

**示例 2：**

```
输入：word1 = "intention", word2 = "execution"
输出：5
解释：
intention -> inention (删除 't')
inention -> enention (将 'i' 替换为 'e')
enention -> exention (将 'n' 替换为 'x')
exention -> exection (将 'n' 替换为 'c')
exection -> execution (插入 'u')
```

**提示：**

* `0 <= word1.length, word2.length <= 500`
* `word1` 和 `word2` 由小写英文字母组成

##### 迭代 空间压缩

```js
/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
var minDistance = function (word1, word2) {
    const m = word1.length, n = word2.length;
    const f = Array.from({ length: n + 1 }, (_, j) => n - j);
    for (let i = m - 1; i >= 0; i--) {
        f[n] = m - i;
        let p = m - i - 1;
        for (let j = n - 1; j >= 0; j--) {
            let t = f[j];
            if (word1[i] == word2[j]) {
                f[j] = p;
            } else {
                f[j] = Math.min(p, f[j + 1], f[j]) + 1;
            }
            p = t;
        }
    }
    return f[0];
};
```

##### dfs

```js
/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
var minDistance = function (word1, word2) {
    const m = word1.length, n = word2.length;
    const memo = Array.from({ length: m }, () => Array(n).fill(-1));
    const dfs = (i, j) => {
        if (j == n) return m - i;
        if (i == m) return n - j;
        if (memo[i][j] >= 0) return memo[i][j];
        if (word1[i] == word2[j]) {
            return memo[i][j] = dfs(i + 1, j + 1);
        } else {
            return memo[i][j] = Math.min(dfs(i + 1, j + 1), // 替换i
                dfs(i, j + 1), // i处插入
                dfs(i + 1, j)) + 1; // i删除
        }
    }
    return dfs(0, 0);
};
```

#### [1143. 最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/description/)

给定两个字符串 `text1` 和 `text2`，返回这两个字符串的最长 **公共子序列** 的长度。如果不存在 **公共子序列** ，返回 `0` 。

一个字符串的 **子序列**是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。

* 例如，`"ace"` 是 `"abcde"` 的子序列，但 `"aec"` 不是 `"abcde"` 的子序列。

两个字符串的 **公共子序列** 是这两个字符串所共同拥有的子序列。

**示例 1：**

```
输入：text1 = "abcde", text2 = "ace" 
输出：3  
解释：最长公共子序列是 "ace" ，它的长度为 3 。
```

**示例 2：**

```
输入：text1 = "abc", text2 = "abc"
输出：3
解释：最长公共子序列是 "abc" ，它的长度为 3 。
```

**示例 3：**

```
输入：text1 = "abc", text2 = "def"
输出：0
解释：两个字符串没有公共子序列，返回 0 。
```

**提示：**

* `1 <= text1.length, text2.length <= 1000`
* `text1` 和 `text2` 仅由小写英文字符组成。

##### dfs 记忆化缓存

```js
/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
var longestCommonSubsequence = function(text1, text2) {
    const m = text1.length, n = text2.length;
    const memo = Array.from({length: m}, () => Array(n).fill(-1));
    const dfs = (i, j) => {
        if (i >= m || j >= n) return 0;
        if (memo[i][j] >= 0) return memo[i][j];
        let res = Math.max(dfs(i + 1, j), dfs(i, j+1))
        if (text1[i] == text2[j]) {
            res = Math.max(res, dfs(i + 1, j + 1) + 1);
        }
        return memo[i][j] = res;
    }
    return dfs(0, 0);
};
```

#### [1339. 分裂二叉树的最大乘积](https://leetcode.cn/problems/maximum-product-of-splitted-binary-tree/description/)

给你一棵二叉树，它的根为 `root` 。请你删除 1 条边，使二叉树分裂成两棵子树，且它们子树和的乘积尽可能大。

由于答案可能会很大，请你将结果对 10^9 + 7 取模后再返回。

**示例 1：**

**![](https://assets.leetcode.cn/aliyun-lc-upload/uploads/2020/02/02/sample_1_1699.png)**

```
输入：root = [1,2,3,4,5,6]
输出：110
解释：删除红色的边，得到 2 棵子树，和分别为 11 和 10 。它们的乘积是 110 （11*10）
```

**示例 2：**

![](https://assets.leetcode.cn/aliyun-lc-upload/uploads/2020/02/02/sample_2_1699.png)

```
输入：root = [1,null,2,3,4,null,null,5,6]
输出：90
解释：移除红色的边，得到 2 棵子树，和分别是 15 和 6 。它们的乘积为 90 （15*6）
```

**示例 3：**

```
输入：root = [2,3,9,10,7,8,6,5,4,11,1]
输出：1025
```

**示例 4：**

```
输入：root = [1,1]
输出：1
```

**提示：**

* 每棵树最多有 `50000` 个节点，且至少有 `2` 个节点。
* 每个节点的值在 `[1, 10000]` 之间。

##### dfs计算sum和各子树和，不要提前取mod，应为mod后较大的数会变小

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
var maxProduct = function(root) {
    let ans = 0, map = new Map();
    const dfs = (node) => {
        if (!node) return 0;
        map.set(node, dfs(node.left) + dfs(node.right) + node.val)
        return map.get(node);
    }
    const sum = dfs(root);
    for (let val of map.values()) {
        ans = Math.max(ans, val * (sum - val));
    }
    return ans % MOD;
};

const MOD = 1e9 + 7;
```

##### [ 用时: -1 d -13 hrs -22 m -42 s ]

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
var maxProduct = function(root) {
    let ans = 0n, map = new Map();
    const dfs = (node) => {
        if (!node) return 0n;
        map.set(node, dfs(node.left) + dfs(node.right) + BigInt(node.val))
        return map.get(node);
    }
    const sum = dfs(root);
    for (let val of map.values()) {
        let t = val * (sum - val)
        ans = ans > t ? ans : t;
    }
    return Number(ans % MOD);
};

const MOD = BigInt(1e9 + 7);
```

