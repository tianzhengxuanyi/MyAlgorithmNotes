### 2025-12-15

#### [238. 除自身以外数组的乘积](https://leetcode.cn/problems/product-of-array-except-self/description/)

给你一个整数数组 `nums`，返回 数组 `answer` ，其中 `answer[i]` 等于 `nums` 中除 `nums[i]` 之外其余各元素的乘积 。

题目数据 **保证** 数组 `nums`之中任意元素的全部前缀元素和后缀的乘积都在  **32 位** 整数范围内。

请 **不要使用除法，**且在 `O(n)` 时间复杂度内完成此题。

**示例 1:**

```
输入: nums = [1,2,3,4]
输出: [24,12,8,6]
```

**示例 2:**

```
输入: nums = [-1,1,0,-3,3]
输出: [0,0,9,0,0]
```

**提示：**

* `2 <= nums.length <= 105`
* `-30 <= nums[i] <= 30`
* 输入 **保证** 数组 `answer[i]` 在  **32 位** 整数范围内

**进阶：**你可以在 `O(1)` 的额外空间复杂度内完成这个题目吗？（ 出于对空间复杂度分析的目的，输出数组 **不被视为**额外空间。）

##### 前缀和

```js
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function(nums) {
    const n = nums.length;
    const ans = Array(n).fill(1);
    for (let i = 1; i < n; i++) {
        ans[i] = ans[i - 1] * nums[i - 1];
    }
    let suffix = nums[n - 1];
    for (let i = n - 2; i >= 0; i--) {
        ans[i] *= suffix;
        suffix *= nums[i];
    }

    return ans;
};
```

#### [189. 轮转数组](https://leetcode.cn/problems/rotate-array/description/)

给定一个整数数组 `nums`，将数组中的元素向右轮转 `k`个位置，其中 `k`是非负数。

**示例 1:**

```
输入: nums = [1,2,3,4,5,6,7], k = 3
输出: [5,6,7,1,2,3,4]
解释:
向右轮转 1 步: [7,1,2,3,4,5,6]
向右轮转 2 步: [6,7,1,2,3,4,5]
向右轮转 3 步: [5,6,7,1,2,3,4]
```

**示例 2:**

```
输入：nums = [-1,-100,3,99], k = 2
输出：[3,99,-1,-100]
解释: 
向右轮转 1 步: [99,-1,-100,3]
向右轮转 2 步: [3,99,-1,-100]
```

**提示：**

* `1 <= nums.length <= 105`
* `-231 <= nums[i] <= 231 - 1`
* `0 <= k <= 105`

**进阶：**

* 尽可能想出更多的解决方案，至少有 **三种** 不同的方法可以解决这个问题。
* 你可以使用空间复杂度为 `O(1)` 的 **原地**算法解决这个问题吗？

##### 辅助数组

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function(nums, k) {
    const n = nums.length;
    const arr = Array(n);
    k = k % n;
    for (let i = 0; i < n; i++) {
        arr[(i + k) % n] = nums[i];
    }
    for (let i = 0; i < n; i++) {
        nums[i] = arr[i];
    }
};
```

##### 环状替换

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function(nums, k) {
    const n = nums.length;
    k = k % n;
    const seen = Array(n);
    for (let i = 0; i < k; i++) {
        let j = i, nx = nums[j];
        while (!seen[j]) {
            seen[j] = 1;
            let nj = (j + k) % n;
            [nx, nums[nj]] = [nums[nj], nx];
            j = nj;
        }
    }
};
```

##### 反转整个数组，再反转前后

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function(nums, k) {
    const n = nums.length;
    k = k % n;
    reverse(nums, 0, n - 1);
    reverse(nums, 0, k - 1);
    reverse(nums, k, n - 1);
};

function reverse(nums, l, r) {
    while (l <= r) {
        [nums[l], nums[r]] = [nums[r], nums[l]];
        l++, r--;
    };
}
```

#### [56. 合并区间](https://leetcode.cn/problems/merge-intervals/description/)

以数组 `intervals` 表示若干个区间的集合，其中单个区间为 `intervals[i] = [starti, endi]` 。请你合并所有重叠的区间，并返回 *一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间* 。

**示例 1：**

```
输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
输出：[[1,6],[8,10],[15,18]]
解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].
```

**示例 2：**

```
输入：intervals = [[1,4],[4,5]]
输出：[[1,5]]
解释：区间 [1,4] 和 [4,5] 可被视为重叠区间。
```

**示例 3：**

```
输入：intervals = [[4,7],[1,4]]
输出：[[1,7]]
解释：区间 [1,4] 和 [4,7] 可被视为重叠区间。
```

**提示：**

* `1 <= intervals.length <= 104`
* `intervals[i].length == 2`
* `0 <= starti <= endi <= 104`

##### 差分数组

```js
/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {
    const MX = Math.max(...intervals.map((a) => a[1]));
    const diff = Array(2 * MX + 2).fill(0);
    for (let [s, e] of intervals) {
        diff[s * 2] += 1;
        diff[e * 2 + 1] -= 1;
    }
    let ans = [], sum = 0, s = 0;
    for (let i = 0; i <= 2 * MX; i++) {
        sum += diff[i];
        if (sum == 0) continue;
        s = i;
        while (i <= 2 * MX && sum > 0) {
            sum += diff[++i];
        }
        ans.push([s/2, (i - 1) / 2]);
    }
    return ans;
};
```

##### 排序

```js
/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function (intervals) {
    intervals.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const ans = [];
    let [start, end] = intervals[0];
    for (let [s, e] of intervals) {
        if (s > end) {
            ans.push([start, end]);
            start = s;
        }
        end = Math.max(end, e);
    }
    ans.push([start, end]);
    return ans;
};
```

#### [2110. 股票平滑下跌阶段的数目](https://leetcode.cn/problems/number-of-smooth-descent-periods-of-a-stock/description/)

给你一个整数数组 `prices` ，表示一支股票的历史每日股价，其中 `prices[i]` 是这支股票第 `i` 天的价格。

一个 **平滑下降的阶段** 定义为：对于 **连续一天或者多天** ，每日股价都比 **前一日股价恰好少** `1` ，这个阶段第一天的股价没有限制。

请你返回 **平滑下降阶段** 的数目。

**示例 1：**

```
输入：prices = [3,2,1,4]
输出：7
解释：总共有 7 个平滑下降阶段：
[3], [2], [1], [4], [3,2], [2,1] 和 [3,2,1]
注意，仅一天按照定义也是平滑下降阶段。
```

**示例 2：**

```
输入：prices = [8,6,7,7]
输出：4
解释：总共有 4 个连续平滑下降阶段：[8], [6], [7] 和 [7]
由于 8 - 6 ≠ 1 ，所以 [8,6] 不是平滑下降阶段。
```

**示例 3：**

```
输入：prices = [1]
输出：1
解释：总共有 1 个平滑下降阶段：[1]
```

**提示：**

* `1 <= prices.length <= 105`
* `1 <= prices[i] <= 105`

##### 分组：枚举右端点，维护递减区间的左端点

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var getDescentPeriods = function (prices) {
    let last = 0, ans = 0;
    for (let i = 0; i < prices.length; i++) {
        if (prices[i] + 1 != prices[i - 1]) {
            last = i;
        }
        ans += (i - last + 1);
    }
    return ans;
};
```

