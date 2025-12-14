### 2025-12-11

#### [42. 接雨水](https://leetcode.cn/problems/trapping-rain-water/description/)

给定 `n` 个非负整数表示每个宽度为 `1` 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

**示例 1：**

![](https://assets.leetcode.cn/aliyun-lc-upload/uploads/2018/10/22/rainwatertrap.png)

```
输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
输出：6
解释：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。
```

**示例 2：**

```
输入：height = [4,2,0,3,2,5]
输出：9
```

**提示：**

* `n == height.length`
* `1 <= n <= 2 * 104`
* `0 <= height[i] <= 105`

##### 单调栈

```js
/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function (height) {
    const st = [];
    let ans = 0;
    for (let i = 0; i < height.length; i++) {
        while (st.length && height[i] >= height[st[st.length - 1]]) {
            let bh = height[st.pop()];
            if (st.length) {
                let l = st[st.length - 1];
                ans += (i - l - 1) * (Math.min(height[l], height[i]) - bh);
            }
        }
        st.push(i);
    }
    return ans;
};
```

##### 前后缀分解

```js
/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
    const n = height.length;
    const leftMax = Array(n); // 位置i左侧最大高度
    let max = -1, ans = 0;
    for (let i = 0; i < n; i++) {
        leftMax[i] = max;
        max = Math.max(max, height[i]);
    }
    max = height[n - 1]; // 位置i右侧最大高度
    for (let i = n - 2; i >= 0; i--) {
        ans += Math.max(0, Math.min(leftMax[i], max) - height[i]);
        max = Math.max(max, height[i]);
    }
    return ans;
};
```

##### 双指针

```js
/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function (height) {
    const n = height.length;
    let ans = 0, l = 0, r = n - 1;
    let leftMax = 0, // l左侧的最大高度
        rightMax = 0; // r右侧的最大高度
    while (l <= r) {
        if (leftMax <= rightMax) {
            // l 左侧的瓶颈为leftMax
            // l 右侧的瓶颈至少为rightMax
            // 因为leftMax小于rightMax，所综合l的瓶颈为leftMax
            // r 左侧的瓶颈至少为leftMax
            // r 右侧的瓶颈为rightMax
            // 因为leftMax小于rightMax,r左侧可能会有比leftMax更高的位置，所以r无法确认瓶颈
            ans += Math.max(0, leftMax - height[l]);
            leftMax = Math.max(leftMax, height[l++]);
        } else {
            ans += Math.max(0, rightMax - height[r]);
            rightMax = Math.max(rightMax, height[r--]);
        }
    }
    return ans;
};
```

#### [15. 三数之和](https://leetcode.cn/problems/3sum/description/)

给你一个整数数组 `nums` ，判断是否存在三元组 `[nums[i], nums[j], nums[k]]` 满足 `i != j`、`i != k` 且 `j != k` ，同时还满足 `nums[i] + nums[j] + nums[k] == 0` 。请你返回所有和为 `0` 且不重复的三元组。

**注意：**答案中不可以包含重复的三元组。

**示例 1：**

```
输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]
解释：
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0 。
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0 。
nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0 。
不同的三元组是 [-1,0,1] 和 [-1,-1,2] 。
注意，输出的顺序和三元组的顺序并不重要。
```

**示例 2：**

```
输入：nums = [0,1,1]
输出：[]
解释：唯一可能的三元组和不为 0 。
```

**示例 3：**

```
输入：nums = [0,0,0]
输出：[[0,0,0]]
解释：唯一可能的三元组和为 0 。
```

**提示：**

* `3 <= nums.length <= 3000`
* `-105 <= nums[i] <= 105`

##### 双指针

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
    nums.sort((a, b) => a - b);
    const n = nums.length;
    const ans = [];
    for (let i = n - 1; i >= 2; i--) {
        // 倒序遍历，跳过重复的值，应为i+1已经遍历过了
        if (nums[i] == nums[i + 1]) continue;
        if (nums[i - 1] + nums[i - 2] + nums[i] < 0) break;
        if (nums[0] + nums[1] + nums[i] > 0) continue;
        let l = 0, r = i - 1;
        while (l < r) {
            if (nums[l] + nums[r] > -nums[i]) {
                r--;
            } else if (nums[l] + nums[r] < -nums[i]) {
                l++;
            } else {
                ans.push([nums[l], nums[r], nums[i]]);
                l++, r--;
                // 跳过重复的值
                while (nums[l] == nums[l - 1]) {
                    l++;
                };
                while (nums[r] == nums[r + 1]) {
                    r--;
                }
            }
        }
    }
    return ans;
};
```

#### [11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/description/)

给定一个长度为 `n` 的整数数组 `height` 。有 `n` 条垂线，第 `i` 条线的两个端点是 `(i, 0)` 和 `(i, height[i])` 。

找出其中的两条线，使得它们与 `x` 轴共同构成的容器可以容纳最多的水。

返回容器可以储存的最大水量。

**说明：**你不能倾斜容器。

**示例 1：**

![](https://aliyun-lc-upload.oss-cn-hangzhou.aliyuncs.com/aliyun-lc-upload/uploads/2018/07/25/question_11.jpg)

```
输入：[1,8,6,2,5,4,8,3,7]
输出：49 
解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。
```

**示例 2：**

```
输入：height = [1,1]
输出：1
```

**提示：**

* `n == height.length`
* `2 <= n <= 105`
* `0 <= height[i] <= 104`

##### 双指针

```js
/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
    const n = height.length;
    let l = 0, r = n - 1, ans = 0;
    while (l <= r) {
        // 以l、r和为边界的窗口 水的容量
        ans = Math.max(ans, Math.min(height[l], height[r]) * (r - l));
        if (height[r] >= height[l]) {
            // 在[l, r]中以l为左端点的窗口的水的容量都小于[l, r]窗口，所以l++
            l++;
        } else {
            r--;
        }
    }
    return ans;
};
```

#### [3531. 统计被覆盖的建筑](https://leetcode.cn/problems/count-covered-buildings/description/)

给你一个正整数 `n`，表示一个 `n x n` 的城市，同时给定一个二维数组 `buildings`，其中 `buildings[i] = [x, y]` 表示位于坐标 `[x, y]` 的一个 **唯一**建筑。

如果一个建筑在四个方向（左、右、上、下）中每个方向上都至少存在一个建筑，则称该建筑 **被覆盖**。

返回 **被覆盖**的建筑数量。

**示例 1：**

![](https://pic.leetcode.cn/1745660407-qtNUjI-telegram-cloud-photo-size-5-6212982906394101085-m.jpg)

**输入:** n = 3, buildings = [[1,2],[2,2],[3,2],[2,1],[2,3]]

**输出:** 1

**解释:**

* 只有建筑 `[2,2]` 被覆盖，因为它在每个方向上都至少存在一个建筑：
  + 上方 (`[1,2]`)
  + 下方 (`[3,2]`)
  + 左方 (`[2,1]`)
  + 右方 (`[2,3]`)
* 因此，被覆盖的建筑数量是 1。

**示例 2：**

![](https://pic.leetcode.cn/1745660407-tUMUKl-telegram-cloud-photo-size-5-6212982906394101086-m.jpg)

**输入:** n = 3, buildings = [[1,1],[1,2],[2,1],[2,2]]

**输出:** 0

**解释:**

* 没有任何一个建筑在每个方向上都有至少一个建筑。

**示例 3：**

![](https://pic.leetcode.cn/1745660407-bQIwBX-telegram-cloud-photo-size-5-6248862251436067566-x.jpg)

**输入:** n = 5, buildings = [[1,3],[3,2],[3,3],[3,5],[5,3]]

**输出:** 1

**解释:**

* 只有建筑 `[3,3]` 被覆盖，因为它在每个方向上至少存在一个建筑：
  + 上方 (`[1,3]`)
  + 下方 (`[5,3]`)
  + 左方 (`[3,2]`)
  + 右方 (`[3,5]`)
* 因此，被覆盖的建筑数量是 1。

**提示：**

* `2 <= n <= 105`
* `1 <= buildings.length <= 105`
* `buildings[i] = [x, y]`
* `1 <= x, y <= n`
* `buildings` 中所有坐标均 **唯一**。

##### 统计每一行和列的最大最小坐标

```js
/**
 * @param {number} n
 * @param {number[][]} buildings
 * @return {number}
 */
var countCoveredBuildings = function (n, buildings) {
    const rowMap = Array.from({length: n + 1}, () => [Infinity, -Infinity]), colMap = Array.from({length: n + 1}, () => [Infinity, -Infinity]);
    for (let [x, y] of buildings) {
        // x = x0时 y轴坐标点的范围
        const rowRange = rowMap[x];
        // y = y0时 x轴坐标点的范围
        const colRange = colMap[y];
        rowRange[0] = Math.min(rowRange[0], y), rowRange[1] = Math.max(rowRange[1], y);
        colRange[0] = Math.min(colRange[0], x), colRange[1] = Math.max(colRange[1], x);
    }
    let ans = 0;
    for (let [x, y] of buildings) {
        const [b, t] = rowMap[x];
        const [l, r] = colMap[y];
        if (l < x && x < r && b < y && y < t) {
            ans++;
        }
    }
    return ans;
};
```

