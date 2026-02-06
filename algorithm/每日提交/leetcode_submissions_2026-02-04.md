### 2026-02-04

#### [3640. 三段式数组 II](https://leetcode.cn/problems/trionic-array-ii/description/)

给你一个长度为 `n` 的整数数组 `nums`。

**三段式子数组** 是一个连续子数组 `nums[l...r]`（满足 `0 <= l < r < n`），并且存在下标 `l < p < q < r`，使得：

* `nums[l...p]` **严格** 递增，
* `nums[p...q]` **严格** 递减，
* `nums[q...r]` **严格** 递增。

请你从数组 `nums` 的所有三段式子数组中找出和最大的那个，并返回其 **最大**和。

**示例 1：**

**输入：**nums = [0,-2,-1,-3,0,2,-1]

**输出：**-4

**解释：**

选择 `l = 1`, `p = 2`, `q = 3`, `r = 5`：

* `nums[l...p] = nums[1...2] = [-2, -1]` 严格递增 (`-2 < -1`)。
* `nums[p...q] = nums[2...3] = [-1, -3]` 严格递减 (`-1 > -3`)。
* `nums[q...r] = nums[3...5] = [-3, 0, 2]` 严格递增 (`-3 < 0 < 2`)。
* 和 = `(-2) + (-1) + (-3) + 0 + 2 = -4`。

**示例 2:**

**输入:** nums = [1,4,2,7]

**输出:** 14

**解释:**

选择 `l = 0`, `p = 1`, `q = 2`, `r = 3`：

* `nums[l...p] = nums[0...1] = [1, 4]` 严格递增 (`1 < 4`)。
* `nums[p...q] = nums[1...2] = [4, 2]` 严格递减 (`4 > 2`)。
* `nums[q...r] = nums[2...3] = [2, 7]` 严格递增 (`2 < 7`)。
* 和 = `1 + 4 + 2 + 7 = 14`。

**提示:**

* `4 <= n = nums.length <= 105`
* `-109 <= nums[i] <= 109`
* 保证至少存在一个三段式子数组。

##### 状态机DP

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSumTrionic = function (nums) {
    const n = nums.length;
    let ans = -Infinity, f1 = -Infinity, f2 = -Infinity, f3 = -Infinity;
    for (let i = 1; i < n; i++) {
        f3 = nums[i - 1] < nums[i] ? Math.max(f3, f2) + nums[i] : -Infinity;
        f2 = nums[i - 1] > nums[i] ? Math.max(f2, f1) + nums[i] : -Infinity;
        f1 = nums[i - 1] < nums[i] ? Math.max(f1, nums[i - 1]) + nums[i]: -Infinity; // 第一段的倒数第二个数，第一段第一个数
        ans = Math.max(ans, f3);
    }
    return ans;
};
```

##### 分组循环

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSumTrionic = function (nums) {
    const n = nums.length;
    let i = 0, ans = -Infinity;
    while (i < n) {
        let start = i; // 第一段开始
        i += 1;
        while (i < n && nums[i - 1] < nums[i]) {
            i++;
        }
        // 第一段必需要两个数
        if (i - start < 2) {
            continue;
        }
        let peek = i - 1,  // 峰谷 划分到第一段
         res = nums[peek - 1] + nums[peek]; // 第一段的最后两个数必须要
        while (i < n && nums[i - 1] > nums[i]) {
            res += nums[i]; // 第二段所有值都是必须的
            i++
        }
        if (i - peek < 2 || i == n || nums[i - 1] == nums[i]) continue; // 第二段和第三段都必须要有两个数
        let bottom = i - 1, suffixSum = 0, maxSum = 0; // 第三段应为已经选了数了，所以后续可以为0
        res += nums[i]; // 第三段的第一个数必须要的， bottom划分到第二段了
        i++;
        while (i < n && nums[i - 1] < nums[i]) {
            suffixSum += nums[i];
            maxSum = Math.max(suffixSum, maxSum); // 第三段从左往右前缀和的最大值
            i++
        }

        let prefixSum = 0, maxSum2 = 0; // 第一段从右向左前缀和的最大值
        for (let k = peek - 2; k >= start; k--) {
            prefixSum += nums[k];
            maxSum2 = Math.max(prefixSum, maxSum2);
        }

        ans = Math.max(res + maxSum +maxSum2, ans);
        i = bottom;
    }
    return ans;
};
```

