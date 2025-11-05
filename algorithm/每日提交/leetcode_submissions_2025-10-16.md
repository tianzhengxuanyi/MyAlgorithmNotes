### 2025-10-16

#### [2598. 执行操作后的最大 MEX](https://leetcode.cn/problems/smallest-missing-non-negative-integer-after-operations/description/)

给你一个下标从 **0** 开始的整数数组 `nums` 和一个整数 `value` 。

在一步操作中，你可以对 `nums` 中的任一元素加上或减去 `value` 。

* 例如，如果 `nums = [1,2,3]` 且 `value = 2` ，你可以选择 `nums[0]` 减去 `value` ，得到 `nums = [-1,2,3]` 。

数组的 MEX (minimum excluded) 是指其中数组中缺失的最小非负整数。

* 例如，`[-1,2,3]` 的 MEX 是 `0` ，而 `[1,0,3]` 的 MEX 是 `2` 。

返回在执行上述操作 **任意次** 后，`nums`的最大 MEX *。*

**示例 1：**

```
输入：nums = [1,-10,7,13,6,8], value = 5
输出：4
解释：执行下述操作可以得到这一结果：
- nums[1] 加上 value 两次，nums = [1,0,7,13,6,8]
- nums[2] 减去 value 一次，nums = [1,0,2,13,6,8]
- nums[3] 减去 value 两次，nums = [1,0,2,3,6,8]
nums 的 MEX 是 4 。可以证明 4 是可以取到的最大 MEX 。
```

**示例 2：**

```
输入：nums = [1,-10,7,13,6,8], value = 7
输出：2
解释：执行下述操作可以得到这一结果：
- nums[2] 减去 value 一次，nums = [1,-10,0,13,6,8]
nums 的 MEX 是 2 。可以证明 2 是可以取到的最大 MEX 。
```

**提示：**

* `1 <= nums.length, value <= 105`
* `-109 <= nums[i] <= 109`

##### 同余

```js
/**
 * 找到最小的无法通过调整数组元素（加减value的倍数）形成的非负整数
 * @param {number[]} nums - 输入的整数数组
 * @param {number} value - 用于调整元素的基数
 * @return {number} 最小的无法形成的非负整数
 * @note 算法思路：统计每个余数出现的次数，然后尝试按顺序构建0,1,2,...直到无法构建
 */
var findSmallestInteger = function (nums, value) {
    // 创建一个长度为value的数组，用于统计每个余数出现的次数
    const modCnt = Array(value).fill(0);
    
    // 遍历数组，统计每个数对value取模后的余数出现次数
    // (num % value + value) % value 确保余数为非负数
    for (let num of nums) {
        modCnt[(num % value + value) % value]++; // 计算非负余数并增加计数
    }
    
    // 尝试按顺序构建0,1,2,...，直到找到第一个无法构建的数
    for (let i = 0; i < nums.length; i++) {
        let m = i % value; // 当前要构建的数对value的余数
        if (modCnt[m] > 0) {
            modCnt[m] -= 1; // 使用一个该余数的数
        } else {
            return i; // 无法构建当前数，返回该数
        }
    }
    
    // 如果所有数都可以构建，则返回数组长度（下一个无法构建的数）
    return nums.length;
};

```

