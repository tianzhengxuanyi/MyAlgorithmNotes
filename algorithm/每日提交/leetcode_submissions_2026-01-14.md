### 2026-01-14

#### [55. 跳跃游戏](https://leetcode.cn/problems/jump-game/description/)

给你一个非负整数数组 `nums` ，你最初位于数组的 **第一个下标** 。数组中的每个元素代表你在该位置可以跳跃的最大长度。

判断你是否能够到达最后一个下标，如果可以，返回 `true` ；否则，返回 `false` 。

**示例 1：**

```
输入：nums = [2,3,1,1,4]
输出：true
解释：可以先跳 1 步，从下标 0 到达下标 1, 然后再从下标 1 跳 3 步到达最后一个下标。
```

**示例 2：**

```
输入：nums = [3,2,1,0,4]
输出：false
解释：无论怎样，总会到达下标为 3 的位置。但该下标的最大跳跃长度是 0 ， 所以永远不可能到达最后一个下标。
```

**提示：**

* `1 <= nums.length <= 104`
* `0 <= nums[i] <= 105`

##### 迭代 剪枝

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {
    const n = nums.length;
    const f = Array(n).fill(false);
    f[n - 1] = true;
    for (let i = n - 2; i >= 0; i--) {
        if (i + nums[i] >= n) {
            f[i] = true;
            continue;
        }
        for (let j = 1; j <= nums[i]; j++) {
            if (f[i + j]) {
                f[i] = true;
                break;
            }
        }
    }
   return f[0];
};
```

#### [215. 数组中的第K个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array/description/)

给定整数数组 `nums` 和整数 `k`，请返回数组中第 `k` 个最大的元素。

请注意，你需要找的是数组排序后的第 `k` 个最大的元素，而不是第 `k` 个不同的元素。

你必须设计并实现时间复杂度为 `O(n)` 的算法解决此问题。

**示例 1:**

```
输入: [3,2,1,5,6,4], k = 2
输出: 5
```

**示例 2:**

```
输入: [3,2,3,1,2,4,5,5,6], k = 4
输出: 4
```

**提示：**

* `1 <= k <= nums.length <= 105`
* `-104 <= nums[i] <= 104`

##### 快速排序

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function(nums, k) {
    const n = nums.length, target = n - k;
    let l = 0, r = n - 1;
    while (true) {
        let j = partition(nums, l, r);
        if (j == target) {
            return nums[j];
        } else if (j < target) {
            l = j + 1;
        } else {
            r = j - 1;
        }
    }
};

function partition(nums, left, right) {
    let index = left + Math.floor(Math.random() * (right - left + 1));
    let pivot = nums[index];
    [nums[left], nums[index]] = [nums[index], nums[left]];

    let i = left + 1, j = right;
    while (true) {
        while (i <= j && nums[i] < pivot) {
            i++;
        }
        // nums[i] >= piovt
        while (i <= j && nums[j] > pivot) {
            j--;
        }
        // nums[j] <= piovt;
        if (i >= j) {
            break;
        }
        [nums[i], nums[j]] = [nums[j], nums[i]];
        i++, j--;
    }
    [nums[j], nums[left]] = [nums[left], nums[j]];
    return j;
}
```

#### [3454. 分割正方形 II](https://leetcode.cn/problems/separate-squares-ii/description/)

给你一个二维整数数组 `squares` ，其中 `squares[i] = [xi, yi, li]` 表示一个与 x 轴平行的正方形的左下角坐标和正方形的边长。

找到一个**最小的** y 坐标，它对应一条水平线，该线需要满足它以上正方形的总面积 **等于** 该线以下正方形的总面积。

答案如果与实际答案的误差在 `10-5` 以内，将视为正确答案。

**注意**：正方形 **可能会**重叠。重叠区域只 **统计一次**。

**示例 1：**

**输入：** squares = [[0,0,1],[2,2,1]]

**输出：** 1.00000

**解释：**

![](https://pic.leetcode.cn/1739609602-zhNmeC-4065example1drawio.png)

任何在 `y = 1` 和 `y = 2` 之间的水平线都会有 1 平方单位的面积在其上方，1 平方单位的面积在其下方。最小的 y 坐标是 1。

**示例 2：**

**输入：** squares = [[0,0,2],[1,1,1]]

**输出：** 1.00000

**解释：**

![](https://pic.leetcode.cn/1739609605-ezeVgk-4065example2drawio.png)

由于蓝色正方形和红色正方形有重叠区域且重叠区域只统计一次。所以直线 `y = 1` 将正方形分割成两部分且面积相等。

**提示：**

* `1 <= squares.length <= 5 * 104`
* `squares[i] = [xi, yi, li]`
* `squares[i].length == 3`
* `0 <= xi, yi <= 109`
* `1 <= li <= 109`
* 所有正方形的总面积不超过 `1015`。

##### CV：线段树 + 扫描线

```js
class SegmentTree {
    constructor(xs) {
        this.xs = xs;  // sorted x coordinates
        this.n = xs.length - 1;
        this.count = new Array(4 * this.n).fill(0);
        this.covered = new Array(4 * this.n).fill(0);
    }
    
    update(qleft, qright, qval, left, right, pos) {
        if (this.xs[right + 1] <= qleft || this.xs[left] >= qright) {
            return;  // no overlap
        }
        if (qleft <= this.xs[left] && this.xs[right + 1] <= qright) {
            this.count[pos] += qval;
        } else {
            const mid = Math.floor((left + right) / 2);
            this.update(qleft, qright, qval, left, mid, pos * 2 + 1);
            this.update(qleft, qright, qval, mid + 1, right, pos * 2 + 2);
        }
        
        if (this.count[pos] > 0) {
            this.covered[pos] = this.xs[right + 1] - this.xs[left];
        } else {
            if (left === right) {
                this.covered[pos] = 0;
            } else {
                this.covered[pos] = this.covered[pos * 2 + 1] + this.covered[pos * 2 + 2];
            }
        }
    }
    
    query() {
        return this.covered[0];
    }
}


var separateSquares = function(squares) {
    // 存储事件: [y坐标, 类型, 左边界, 右边界]
    const events = [];
    const xsSet = new Set();
    
    for (const sq of squares) {
        const [x, y, l] = sq;
        const xr = x + l;
        events.push([y, 1, x, xr]);
        events.push([y + l, -1, x, xr]);
        xsSet.add(x);
        xsSet.add(xr);
    }
    
    // 按y坐标排序事件
    events.sort((a, b) => a[0] - b[0]);
    // 离散化坐标
    const xs = Array.from(xsSet).sort((a, b) => a - b);
    // 初始化线段树
    const segTree = new SegmentTree(xs);
    
    const psum = [];
    const widths = [];
    let total_area = 0;
    let prev = events[0][0];
    
    // 扫描：计算总面积和记录中间状态
    for (const event of events) {
        const [y, delta, xl, xr] = event;
        const length = segTree.query();
        total_area += length * (y - prev);
        segTree.update(xl, xr, delta, 0, segTree.n - 1, 0);
        // 记录前缀和和宽度
        psum.push(total_area);
        widths.push(segTree.query());
        prev = y;
    }
    
    // 计算目标面积（向上取整的一半）
    const target = Math.floor((total_area + 1) / 2);
    // 二分查找第一个大于等于target的位置
    let left = 0, right = psum.length - 1;
    let i = 0;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (psum[mid] < target) {
            i = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    // 获取对应的面积、宽度和高度
    const area = psum[i];
    const width = widths[i];
    const height = events[i][0];

    return height + (total_area - area * 2) / (width * 2.0);
};
```

#### [3453. 分割正方形 I](https://leetcode.cn/problems/separate-squares-i/description/)

给你一个二维整数数组 `squares` ，其中 `squares[i] = [xi, yi, li]` 表示一个与 x 轴平行的正方形的左下角坐标和正方形的边长。

找到一个**最小的** y 坐标，它对应一条水平线，该线需要满足它以上正方形的总面积 **等于** 该线以下正方形的总面积。

答案如果与实际答案的误差在 `10-5` 以内，将视为正确答案。

**注意**：正方形 **可能会**重叠。重叠区域应该被 **多次计数**。

**示例 1：**

**输入：** squares = [[0,0,1],[2,2,1]]

**输出：** 1.00000

**解释：**

![](https://pic.leetcode.cn/1739609465-UaFzhk-4062example1drawio.png)

任何在 `y = 1` 和 `y = 2` 之间的水平线都会有 1 平方单位的面积在其上方，1 平方单位的面积在其下方。最小的 y 坐标是 1。

**示例 2：**

**输入：** squares = [[0,0,2],[1,1,1]]

**输出：** 1.16667

**解释：**

![](https://pic.leetcode.cn/1739609527-TWqefZ-4062example2drawio.png)

面积如下：

* 线下的面积：`7/6 * 2 (红色) + 1/6 (蓝色) = 15/6 = 2.5`。
* 线上的面积：`5/6 * 2 (红色) + 5/6 (蓝色) = 15/6 = 2.5`。

由于线以上和线以下的面积相等，输出为 `7/6 = 1.16667`。

**提示：**

* `1 <= squares.length <= 5 * 104`
* `squares[i] = [xi, yi, li]`
* `squares[i].length == 3`
* `0 <= xi, yi <= 109`
* `1 <= li <= 109`
* 所有正方形的总面积不超过 `1012`。

##### 差分

```js
/**
 * @param {number[][]} squares
 * @return {number}
 */
var separateSquares = function(squares) {
    const diff = new Map();
    let total = 0;
    for (let [x, y, l] of squares) {
        diff.set(y, (diff.get(y) ?? 0) + l);
        // 这里是y + l不是y + l + 1
        diff.set(y + l, (diff.get(y + l) ?? 0) - l);
        total += l * l;
    }
    const sortedDiff = Array.from(diff.entries()).sort((a, b) => a[0] - b[0]);
    let sumA = 0, sumL = 0, prevY = 0;
    for (let [y, l] of sortedDiff) {
        sumA += (y - prevY) * sumL;
        if (sumA * 2 >= total) {
            return y - (sumA * 2 - total) / (sumL * 2)
        }
        prevY = y;
        sumL += l;
    }

    return -1;
};
```

