### 2026-01-08

#### [287. 寻找重复数](https://leetcode.cn/problems/find-the-duplicate-number/description/)

给定一个包含 `n + 1` 个整数的数组 `nums` ，其数字都在 `[1, n]` 范围内（包括 `1` 和 `n`），可知至少存在一个重复的整数。

假设 `nums` 只有 **一个重复的整数** ，返回 **这个重复的数** 。

你设计的解决方案必须 **不修改** 数组 `nums` 且只用常量级 `O(1)` 的额外空间。

**示例 1：**

```
输入：nums = [1,3,4,2,2]
输出：2
```

**示例 2：**

```
输入：nums = [3,1,3,4,2]
输出：3
```

**示例 3 :**

```
输入：nums = [3,3,3,3,3]
输出：3
```

**提示：**

* `1 <= n <= 105`
* `nums.length == n + 1`
* `1 <= nums[i] <= n`
* `nums` 中 **只有一个整数** 出现 **两次或多次** ，其余整数均只出现 **一次**

**进阶：**

* 如何证明 `nums` 中至少存在一个重复的数字?
* 你可以设计一个线性级时间复杂度 `O(n)` 的解决方案吗？

##### 位运算 统计nums每一位上1的个数与[1, n-1]中对应位数比对

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findDuplicate = function (nums) {
    const n = nums.length;
    const len = 32 - Math.clz32(n);
    let ans = 0;
    for (let bit = 0; bit < len; bit++) {
        let cnt1 = 0, cnt2 = 0;
        for (let x of nums) {
            cnt1 += (x & (1 << bit))
        }
        // 数组长度为n,数字范围为[1, n-1]
        for (let i = 1; i < n; i++) {
            cnt2 += (i & (1 << bit))
        }
        if (cnt1 > cnt2) {
            ans |= (1 << bit);
        }
    }
    return ans;
};
```

##### 快慢指针

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findDuplicate = function(nums) {
    let slow = 0, fast = 0;
    while (true) {
        slow = nums[slow];
        fast = nums[nums[fast]];
        if (slow == fast) break;
    }
    let head = 0;
    while (slow !== head) {
        slow = nums[slow];
        head = nums[head];
    }
    return slow;
};
```

##### 二分

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findDuplicate = function(nums) {
    let l = 1, r = nums.length;
    // 如果不存在重复的数，nums中数在[1, n]中，小于等于m的数右m个
    // 如果小于等于m的数的个数超过m，表明[1, m]中有重复的数
    const check = (m) => {
        let cnt = 0;
        for (let x of nums) {
            if (x <= m) {
                cnt++;
            }
            if (cnt > m) return false;
        }
        return true;
    }
    while (l <= r) {
        let m = Math.floor((r - l) / 2) + l;
        if (check(m)) {
            l = m + 1;
        } else {
            r = m - 1;
        }
    }
    return l;
};
```

#### [31. 下一个排列](https://leetcode.cn/problems/next-permutation/description/)

整数数组的一个 **排列**  就是将其所有成员以序列或线性顺序排列。

* 例如，`arr = [1,2,3]` ，以下这些都可以视作 `arr` 的排列：`[1,2,3]`、`[1,3,2]`、`[3,1,2]`、`[2,3,1]` 。

整数数组的 **下一个排列** 是指其整数的下一个字典序更大的排列。更正式地，如果数组的所有排列根据其字典顺序从小到大排列在一个容器中，那么数组的 **下一个排列** 就是在这个有序容器中排在它后面的那个排列。如果不存在下一个更大的排列，那么这个数组必须重排为字典序最小的排列（即，其元素按升序排列）。

* 例如，`arr = [1,2,3]` 的下一个排列是 `[1,3,2]` 。
* 类似地，`arr = [2,3,1]` 的下一个排列是 `[3,1,2]` 。
* 而 `arr = [3,2,1]` 的下一个排列是 `[1,2,3]` ，因为 `[3,2,1]` 不存在一个字典序更大的排列。

给你一个整数数组 `nums` ，找出 `nums` 的下一个排列。

必须 **[原地](https://baike.baidu.com/item/%E5%8E%9F%E5%9C%B0%E7%AE%97%E6%B3%95)** 修改，只允许使用额外常数空间。

**示例 1：**

```
输入：nums = [1,2,3]
输出：[1,3,2]
```

**示例 2：**

```
输入：nums = [3,2,1]
输出：[1,2,3]
```

**示例 3：**

```
输入：nums = [1,1,5]
输出：[1,5,1]
```

**提示：**

* `1 <= nums.length <= 100`
* `0 <= nums[i] <= 100`

#### [1458. 两个子序列的最大点积](https://leetcode.cn/problems/max-dot-product-of-two-subsequences/description/)

给你两个数组 `nums1` 和 `nums2` 。

请你返回 `nums1` 和 `nums2` 中两个长度相同的 **非空** 子序列的最大点积。

数组的非空子序列是通过删除原数组中某些元素（可能一个也不删除）后剩余数字组成的序列，但不能改变数字间相对顺序。比方说，`[2,3,5]` 是 `[1,2,3,4,5]` 的一个子序列而 `[1,5,3]` 不是。

**示例 1：**

```
输入：nums1 = [2,1,-2,5], nums2 = [3,0,-6]
输出：18
解释：从 nums1 中得到子序列 [2,-2] ，从 nums2 中得到子序列 [3,-6] 。
它们的点积为 (2*3 + (-2)*(-6)) = 18 。
```

**示例 2：**

```
输入：nums1 = [3,-2], nums2 = [2,-6,7]
输出：21
解释：从 nums1 中得到子序列 [3] ，从 nums2 中得到子序列 [7] 。
它们的点积为 (3*7) = 21 。
```

**示例 3：**

```
输入：nums1 = [-1,-1], nums2 = [1,1]
输出：-1
解释：从 nums1 中得到子序列 [-1] ，从 nums2 中得到子序列 [1] 。
它们的点积为 -1 。
```

**提示：**

* `1 <= nums1.length, nums2.length <= 500`
* `-1000 <= nums1[i], nums2[i] <= 1000`

**点积：**

```
定义 a = [a1, a2,…, an] 和 b = [b1, b2,…, bn] 的点积为：

![\mathbf{a}\cdot \mathbf{b} = \sum_{i=1}^n a_ib_i = a_1b_1 + a_2b_2 + \cdots + a_nb_n ](https://pic.leetcode.cn/1666164309-PBJMQp-image.png)

这里的 Σ 指示总和符号。
```

##### 迭代 + 空间压缩

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var maxDotProduct = function (nums1, nums2) {
    const m = nums1.length, n = nums2.length;
    const f = Array(n + 1).fill(-Infinity);
    for (let i = 0; i < m; i++) {
        let prev = -Infinity;
        for (let j = 0; j < n; j++) {
            let temp = f[j+1];
            let dot = nums1[i] * nums2[j];
            f[j + 1] = Math.max(dot, prev + dot, f[j + 1], f[j]);
            prev = temp;
        }
    }
    return f[n];
};
```

