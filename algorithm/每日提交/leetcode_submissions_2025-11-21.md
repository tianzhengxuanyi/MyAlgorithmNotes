### 2025-11-21

#### [494. 目标和](https://leetcode.cn/problems/target-sum/description/)

给你一个非负整数数组 `nums` 和一个整数 `target` 。

向数组中的每个整数前添加 `'+'` 或 `'-'` ，然后串联起所有整数，可以构造一个 **表达式** ：

* 例如，`nums = [2, 1]` ，可以在 `2` 之前添加 `'+'` ，在 `1` 之前添加 `'-'` ，然后串联起来得到表达式 `"+2-1"` 。

返回可以通过上述方法构造的、运算结果等于 `target` 的不同 **表达式** 的数目。

**示例 1：**

```
输入：nums = [1,1,1,1,1], target = 3
输出：5
解释：一共有 5 种方法让最终目标和为 3 。
-1 + 1 + 1 + 1 + 1 = 3
+1 - 1 + 1 + 1 + 1 = 3
+1 + 1 - 1 + 1 + 1 = 3
+1 + 1 + 1 - 1 + 1 = 3
+1 + 1 + 1 + 1 - 1 = 3
```

**示例 2：**

```
输入：nums = [1], target = 1
输出：1
```

**提示：**

* `1 <= nums.length <= 20`
* `0 <= nums[i] <= 1000`
* `0 <= sum(nums[i]) <= 1000`
* `-1000 <= target <= 1000`

##### 折半枚举

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var findTargetSumWays = function (nums, target) {
    const n = nums.length;
    let sum = nums.reduce((a, b) => a + b, 0);
    // 添加+的数的总和为p，添加-的数的总和为q
    // p + q = sum  p - q = target
    let p = (sum + target) / 2, q = (sum - target) / 2;
    // 将nums分为两部分k 和 n - k，分别枚举每个部分的子序列，求和
    const k = n >> 1;

    // 获取每一部分的子序列和的出现频率
    const getSubSum = (k, base) => {
        const cnt = new Map([[0, 1]]);
        const subsum = Array(1 << k).fill(0);
        for (let i = 0; i < k; i++) {
            for (let bit = 0; bit < (1 << i); bit++) {
                let s = subsum[bit] + nums[i + base];
                subsum[bit | (1 << i)] = s;
                cnt.set(s, (cnt.get(s) ?? 0) + 1);
            }
        }
        return cnt;
    }
    const cnt1 = getSubSum(k, 0), cnt2 = getSubSum(n - k, k);
    let ans = 0;
    for (let [key, val] of cnt1.entries()) {
        if (cnt2.has(p - key)) {
            ans += val * cnt2.get(p - key);
        }
    }
    return ans;
};
```

##### dfs + 记忆化缓存

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var findTargetSumWays = function(nums, target) {
    const n = nums.length;
    const memo = Array.from({length: n}, () => new Map())
    const dfs = (i, sum) => {
        if (i == n) {
            return sum == target ? 1 : 0;
        }
        if (memo[i].has(sum)) return memo[i].get(sum);
        const res =  dfs(i + 1, sum + nums[i]) + dfs(i + 1, sum - nums[i]);
        memo[i].set(sum, res);
        return res;
    }
    return  dfs(0, 0);
};
```

#### [1930. 长度为 3 的不同回文子序列](https://leetcode.cn/problems/unique-length-3-palindromic-subsequences/description/)

给你一个字符串 `s` ，返回 `s` 中 **长度为 3** 的**不同回文子序列** 的个数。

即便存在多种方法来构建相同的子序列，但相同的子序列只计数一次。

**回文** 是正着读和反着读一样的字符串。

**子序列** 是由原字符串删除其中部分字符（也可以不删除）且不改变剩余字符之间相对顺序形成的一个新字符串。

* 例如，`"ace"` 是 `"abcde"` 的一个子序列。

**示例 1：**

```
输入：s = "aabca"
输出：3
解释：长度为 3 的 3 个回文子序列分别是：
- "aba" ("aabca" 的子序列)
- "aaa" ("aabca" 的子序列)
- "aca" ("aabca" 的子序列)
```

**示例 2：**

```
输入：s = "adc"
输出：0
解释："adc" 不存在长度为 3 的回文子序列。
```

**示例 3：**

```
输入：s = "bbcbaba"
输出：4
解释：长度为 3 的 4 个回文子序列分别是：
- "bbb" ("bbcbaba" 的子序列)
- "bcb" ("bbcbaba" 的子序列)
- "bab" ("bbcbaba" 的子序列)
- "aba" ("bbcbaba" 的子序列)
```

**提示：**

* `3 <= s.length <= 105`
* `s` 仅由小写英文字母组成


##### 前后缀分解

```js
/**
 * @param {string} s
 * @return {number}
 */
var countPalindromicSubsequence = function (s) {
    const n = s.length;
    const prefix = Array(n).fill(0);
    const suffix = Array(n).fill(0);
    const subset = Array(27).fill(0);
    for (let i = 1; i < n; i++) {
        // [0, i-1]出现过那些字符
        prefix[i] = prefix[i - 1] | (1 << (s[i - 1].charCodeAt() - 97));
    }
    for (let i = n - 2; i >= 0; i--) {
        // [i+1, n-1]出现过那些字符
        suffix[i] = suffix[i + 1] | (1 << (s[i + 1].charCodeAt() - 97));
        // i处所代表的字母前后同时出现的字母
        subset[s[i].charCodeAt() - 97] |= prefix[i] & suffix[i];
    }
    let ans = 0;
    for (let x of subset) {
        while (x) {
            ans++;
            x &= x - 1;
        }
    }
    return ans;
};
```
