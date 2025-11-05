### 2025-10-22

#### [858. 镜面反射](https://leetcode.cn/problems/mirror-reflection/description/)

有一个特殊的正方形房间，每面墙上都有一面镜子。除西南角以外，每个角落都放有一个接受器，编号为 `0`， `1`，以及 `2`。

正方形房间的墙壁长度为 `p`，一束激光从西南角射出，首先会与东墙相遇，入射点到接收器 `0` 的距离为 `q` 。

返回光线最先遇到的接收器的编号（保证光线最终会遇到一个接收器）。

**示例 1：**

![](https://s3-lc-upload.s3.amazonaws.com/uploads/2018/06/18/reflection.png)

```
输入：p = 2, q = 1
输出：2
解释：这条光线在第一次被反射回左边的墙时就遇到了接收器 2 。
```

**示例 2：**

```
输入：p = 3, q = 1
输入：1
```

**提示：**

* `1 <= q <= p <= 1000`

##### 数学

```js
/**
 * @param {number} p
 * @param {number} q
 * @return {number}
 */
var mirrorReflection = function(p, q) {
    let l = lcm(p, q);
    if ((l / q) % 2 == 0) {
        return 2;
    }
    return (l / p) % 2;
};

const gcd = (x, y) => {
    while (y) {
        let t = x % y;
        x = y, y = t;
    }
    return x;
}

const lcm = (x, y) =>  (x * y) / gcd(x, y);
```

#### [3347. 执行操作后元素的最高频率 II](https://leetcode.cn/problems/maximum-frequency-of-an-element-after-performing-operations-ii/description/)

给你一个整数数组 `nums` 和两个整数 `k` 和 `numOperations` 。

你必须对 `nums` 执行 **操作**  `numOperations` 次。每次操作中，你可以：

* 选择一个下标 `i` ，它在之前的操作中 **没有** 被选择过。
* 将 `nums[i]` 增加范围 `[-k, k]` 中的一个整数。

在执行完所有操作以后，请你返回 `nums` 中出现 **频率最高** 元素的出现次数。

一个元素 `x` 的 **频率** 指的是它在数组中出现的次数。

**示例 1：**

**输入：**nums = [1,4,5], k = 1, numOperations = 2

**输出：**2

**解释：**

通过以下操作得到最高频率 2 ：

* 将 `nums[1]` 增加 0 ，`nums` 变为 `[1, 4, 5]` 。
* 将 `nums[2]` 增加 -1 ，`nums` 变为 `[1, 4, 4]` 。

**示例 2：**

**输入：**nums = [5,11,20,20], k = 5, numOperations = 1

**输出：**2

**解释：**

通过以下操作得到最高频率 2 ：

* 将 `nums[1]` 增加 0 。

**提示：**

* `1 <= nums.length <= 105`
* `1 <= nums[i] <= 109`
* `0 <= k <= 109`
* `0 <= numOperations <= nums.length`

##### 差分数组

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @param {number} numOperations
 * @return {number}
 */
var maxFrequency = function(nums, k, numOperations) {
    const diffMap = new Map();
    const cntMap = new Map();

    for (let x of nums) {
        cntMap.set(x, (cntMap.get(x) ?? 0) + 1);
        if (!diffMap.has(x)) diffMap.set(x, 0);
        diffMap.set(x - k, (diffMap.get(x - k) ?? 0) + 1);
        diffMap.set(x + k + 1, (diffMap.get(x + k + 1) ?? 0) - 1);
    }

    const diffs = Array.from(diffMap.entries()).sort((a,b) => a[0] - b[0]);
    let ans = 0, sumD = 0;

    for (let [x, diff] of diffs) {
        sumD += diff;
        ans = Math.max(ans, Math.min(sumD, numOperations + (cntMap.get(x) ?? 0)));
    }

    return ans;
};
```

##### 双指针 + 三指针

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @param {number} numOperations
 * @return {number}
 */
var maxFrequency = function (nums, k, numOperations) {
    const n = nums.length;
    nums.sort((a, b) => a - b);
    let ans = 0;
    let left = 0, right = 0;
    let cnt = 0; // 相同元素的数量

    // 变成的元素x在nums中
    for (let i = 0; i < n; i++) {
        let x = nums[i];
        cnt++;
        if (i < n - 1 && x == nums[i + 1]) {
            continue;
        }
        // 窗口[left, right)为 在范围[x - k, x + k]的元素
        while (right < n && nums[right] <= x + k) {
            right++;
        }
        while (nums[left] < x - k) {
            left++;
        }
        ans = Math.max(ans, Math.min(right - left, cnt + numOperations));
        cnt = 0;
    }

    if (ans >= numOperations) return ans;

    // 变成的元素y不在nums中
    // 设[left, right]内的元素都可以变成y
    // 从y - 1到 y,只有当y + k在nums中，双指针right才会右移，right - left变大（left也可能右移，当y - k - 1在nums的时候）
    // 所以只需枚举nums作为right
    for (right = 0, left = 0; right < n; right++) {
        let x = nums[right];
        while (nums[left] < x - 2 * k) {
            left++;
        }
        ans = Math.max(ans, Math.min(right - left + 1, numOperations));
    }

    return ans;
};
```

