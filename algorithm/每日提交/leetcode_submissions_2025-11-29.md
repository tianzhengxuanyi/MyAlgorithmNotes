### 2025-11-29

#### [2745. 构造最长的新字符串](https://leetcode.cn/problems/construct-the-longest-new-string/description/)

给你三个整数 `x` ，`y` 和 `z` 。

这三个整数表示你有 `x` 个 `"AA"` 字符串，`y` 个 `"BB"` 字符串，和 `z` 个 `"AB"` 字符串。你需要选择这些字符串中的部分字符串（可以全部选择也可以一个都不选择），将它们按顺序连接得到一个新的字符串。新字符串不能包含子字符串 `"AAA"` 或者 `"BBB"` 。

请你返回 *新字符串的最大可能长度。*

**子字符串** 是一个字符串中一段连续 **非空** 的字符序列。

**示例 1：**

```
输入：x = 2, y = 5, z = 1
输出：12
解释： 我们可以按顺序连接 "BB" ，"AA" ，"BB" ，"AA" ，"BB" 和 "AB" ，得到新字符串 "BBAABBAABBAB" 。
字符串长度为 12 ，无法得到一个更长的符合题目要求的字符串。
```

**示例 2：**

```
输入：x = 3, y = 2, z = 2
输出：14
解释：我们可以按顺序连接 "AB" ，"AB" ，"AA" ，"BB" ，"AA" ，"BB" 和 "AA" ，得到新字符串 "ABABAABBAABBAA" 。
字符串长度为 14 ，无法得到一个更长的符合题目要求的字符串。
```

**提示：**

* `1 <= x, y, z <= 50`

##### DP超时

```js

```

##### 贪心：z可以自身连接在一起， x和y只能交替连接，z不能使x和y自己连接自己，即xzx，yzy不成立， 所以贪心x和y交替连接，z自己连接

```js
/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @return {number}
 */
var longestString = function(x, y, z) {
    // z可以自身连接在一起， x和y只能交替连接
    // z不能使x和y自己连接自己，即xzx，yzy不成立
    // 所以贪心x和y交替连接，z自己连接
    return (Math.min(x, y) * 2 + (x != y) + z)  * 2;
};
```

#### [1414. 和为 K 的最少斐波那契数字数目](https://leetcode.cn/problems/find-the-minimum-number-of-fibonacci-numbers-whose-sum-is-k/description/)

给你数字 `k` ，请你返回和为 `k` 的斐波那契数字的最少数目，其中，每个斐波那契数字都可以被使用多次。

斐波那契数字定义为：

* F1 = 1
* F2 = 1
* Fn = Fn-1 + Fn-2 ， 其中 n > 2 。

数据保证对于给定的 `k` ，一定能找到可行解。

**示例 1：**

```
输入：k = 7
输出：2 
解释：斐波那契数字为：1，1，2，3，5，8，13，……
对于 k = 7 ，我们可以得到 2 + 5 = 7 。
```

**示例 2：**

```
输入：k = 10
输出：2 
解释：对于 k = 10 ，我们可以得到 2 + 8 = 10 。
```

**示例 3：**

```
输入：k = 19
输出：3 
解释：对于 k = 19 ，我们可以得到 1 + 5 + 13 = 19 。
```

**提示：**

* `1 <= k <= 10^9`

##### 贪心：从大到小选择斐波那契数，直到和为k

```js
/**
 * @param {number} k
 * @return {number}
 */
var findMinFibonacciNumbers = function (k) {
    if (k <= 3) return 1;
    const F = [1, 1, 2, 3];
    const MX = k;

    while (F[F.length - 1] + F[F.length - 2] <= MX) {
        F.push(F[F.length - 1] + F[F.length - 2]);
    }
    let r = k, ans = 0;
    for (let i = F.length - 1; i >= 0 && r > 0; i--) {
        if (r >= F[i]) {
            let m = Math.floor(r / F[i]);
            ans += m;
            r -= m * F[i];
        }
    }
    return ans;
};
```

#### [2952. 需要添加的硬币的最小数量](https://leetcode.cn/problems/minimum-number-of-coins-to-be-added/description/)

给你一个下标从 **0** 开始的整数数组 `coins`，表示可用的硬币的面值，以及一个整数 `target` 。

如果存在某个 `coins` 的子序列总和为 `x`，那么整数 `x` 就是一个 **可取得的金额** 。

返回需要添加到数组中的 **任意面值** 硬币的 **最小数量** ，使范围 `[1, target]` 内的每个整数都属于 **可取得的金额** 。

数组的 **子序列** 是通过删除原始数组的一些（**可能不删除**）元素而形成的新的 **非空** 数组，删除过程不会改变剩余元素的相对位置。

**示例 1：**

```
输入：coins = [1,4,10], target = 19
输出：2
解释：需要添加面值为 2 和 8 的硬币各一枚，得到硬币数组 [1,2,4,8,10] 。
可以证明从 1 到 19 的所有整数都可由数组中的硬币组合得到，且需要添加到数组中的硬币数目最小为 2 。
```

**示例 2：**

```
输入：coins = [1,4,10,5,7,19], target = 19
输出：1
解释：只需要添加一枚面值为 2 的硬币，得到硬币数组 [1,2,4,5,7,10,19] 。
可以证明从 1 到 19 的所有整数都可由数组中的硬币组合得到，且需要添加到数组中的硬币数目最小为 1 。
```

**示例 3：**

```
输入：coins = [1,1,1], target = 20
输出：3
解释：
需要添加面值为 4 、8 和 16 的硬币各一枚，得到硬币数组 [1,1,1,4,8,16] 。 
可以证明从 1 到 20 的所有整数都可由数组中的硬币组合得到，且需要添加到数组中的硬币数目最小为 3 。
```

**提示：**

* `1 <= target <= 105`
* `1 <= coins.length <= 105`
* `1 <= coins[i] <= target`

##### 贪心： [归纳法](https://www.bilibili.com/video/BV1og4y1Z7SZ/?vd_source=3689e9fbf6b9550d17c35548137fccbb)

```js
/**
 * @param {number[]} coins
 * @param {number} target
 * @return {number}
 */
var minimumAddedCoins = function(coins, target) {
    coins.sort((a, b) => a - b);
    let ans = 0, i = 0, s = 1; // s表示现在可以构成[0, s - 1]范围内的数
    while (s - 1 < target) {
        // 此时遇到x，[0, s-1]加上x，可有构成[x, s + x - 1]范围内的数
        if (coins[i] <= s) { 
            // 如果x <= s，两个区间可以合并，可以构成[0, s + x - 1]
            s += coins[i++];
        } else {
            // 如果x > s，贪心选取不能构成的数s，此时可以构成[0, 2 * s - 1]
            s += s;
            ans += 1;
        }
    }
    return ans;
};
```

#### [3512. 使数组和能被 K 整除的最少操作次数](https://leetcode.cn/problems/minimum-operations-to-make-array-sum-divisible-by-k/description/)

给你一个整数数组 `nums` 和一个整数 `k`。你可以执行以下操作任意次：

* 选择一个下标 `i`，并将 `nums[i]` 替换为 `nums[i] - 1`。

返回使数组元素之和能被 `k` 整除所需的**最小**操作次数。

**示例 1：**

**输入：** nums = [3,9,7], k = 5

**输出：** 4

**解释：**

* 对 `nums[1] = 9` 执行 4 次操作。现在 `nums = [3, 5, 7]`。
* 数组之和为 15，可以被 5 整除。

**示例 2：**

**输入：** nums = [4,1,3], k = 4

**输出：** 0

**解释：**

* 数组之和为 8，已经可以被 4 整除。因此不需要操作。

**示例 3：**

**输入：** nums = [3,2], k = 6

**输出：** 5

**解释：**

* 对 `nums[0] = 3` 执行 3 次操作，对 `nums[1] = 2` 执行 2 次操作。现在 `nums = [0, 0]`。
* 数组之和为 0，可以被 6 整除。

**提示：**

* `1 <= nums.length <= 1000`
* `1 <= nums[i] <= 1000`
* `1 <= k <= 100`

##### 求和取余
```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var minOperations = function(nums, k) {
    return _.sum(nums) % k;
};
```
