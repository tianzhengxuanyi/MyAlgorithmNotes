### 2026-01-02

#### [121. 买卖股票的最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/description/)

给定一个数组 `prices` ，它的第 `i` 个元素 `prices[i]` 表示一支给定股票第 `i` 天的价格。

你只能选择 **某一天** 买入这只股票，并选择在 **未来的某一个不同的日子** 卖出该股票。设计一个算法来计算你所能获取的最大利润。

返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 `0` 。

**示例 1：**

```
输入：[7,1,5,3,6,4]
输出：5
解释：在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
     注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格；同时，你不能在买入前卖出股票。
```

**示例 2：**

```
输入：prices = [7,6,4,3,1]
输出：0
解释：在这种情况下, 没有交易完成, 所以最大利润为 0。
```

**提示：**

* `1 <= prices.length <= 105`
* `0 <= prices[i] <= 104`

##### 贪心

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    let ans = 0, min = prices[0];
    for (let i = 1; i < prices.length; i++) {
        ans = Math.max(ans, prices[i] - min);
        min = Math.min(prices[i], min);
    }
    return ans;
};
```

#### [295. 数据流的中位数](https://leetcode.cn/problems/find-median-from-data-stream/description/)

**中位数**是有序整数列表中的中间值。如果列表的大小是偶数，则没有中间值，中位数是两个中间值的平均值。

* 例如 `arr = [2,3,4]` 的中位数是 `3` 。
* 例如 `arr = [2,3]` 的中位数是 `(2 + 3) / 2 = 2.5` 。

实现 MedianFinder 类:

* `MedianFinder()` 初始化 `MedianFinder` 对象。
* `void addNum(int num)` 将数据流中的整数 `num` 添加到数据结构中。
* `double findMedian()` 返回到目前为止所有元素的中位数。与实际答案相差 `10-5` 以内的答案将被接受。

**示例 1：**

```
输入
["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]
[[], [1], [2], [], [3], []]
输出
[null, null, null, 1.5, null, 2.0]

解释
MedianFinder medianFinder = new MedianFinder();
medianFinder.addNum(1);    // arr = [1]
medianFinder.addNum(2);    // arr = [1, 2]
medianFinder.findMedian(); // 返回 1.5 ((1 + 2) / 2)
medianFinder.addNum(3);    // arr[1, 2, 3]
medianFinder.findMedian(); // return 2.0
```

**提示:**

* `-105 <= num <= 105`
* 在调用 `findMedian` 之前，数据结构中至少有一个元素
* 最多 `5 * 104` 次调用 `addNum` 和 `findMedian`

##### 对顶堆

```js

var MedianFinder = function() {
    this.left = new MaxPriorityQueue();
    this.right = new MinPriorityQueue();
};

/** 
 * @param {number} num
 * @return {void}
 */
MedianFinder.prototype.addNum = function(num) {
    if (this.left.size() == this.right.size()) {
        this.right.enqueue(num);
        this.left.enqueue(this.right.dequeue());
    } else {
        this.left.enqueue(num);
        this.right.enqueue(this.left.dequeue());
    }
};

/**
 * @return {number}
 */
MedianFinder.prototype.findMedian = function() {
    if (this.right.size() == this.left.size()) {
        return (this.right.front() + this.left.front()) / 2;
    } else {
        return this.left.front();
    }
};

/** 
 * Your MedianFinder object will be instantiated and called as such:
 * var obj = new MedianFinder()
 * obj.addNum(num)
 * var param_2 = obj.findMedian()
 */
```

#### [347. 前 K 个高频元素](https://leetcode.cn/problems/top-k-frequent-elements/description/)

给你一个整数数组 `nums` 和一个整数 `k` ，请你返回其中出现频率前 `k` 高的元素。你可以按 **任意顺序** 返回答案。

**示例 1：**

**输入：**nums = [1,1,1,2,2,3], k = 2

**输出：**[1,2]

**示例 2：**

**输入：**nums = [1], k = 1

**输出：**[1]

**示例 3：**

**输入：**nums = [1,2,1,2,1,2,3,1,3,2], k = 2

**输出：**[1,2]

**提示：**

* `1 <= nums.length <= 105`
* `-104 <= nums[i] <= 104`
* `k` 的取值范围是 `[1, 数组中不相同的元素的个数]`
* 题目数据保证答案唯一，换句话说，数组中前 `k` 个高频元素的集合是唯一的

**进阶：**你所设计算法的时间复杂度 **必须** 优于 `O(n log n)` ，其中 `n`是数组大小。

##### 堆

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function (nums, k) {
    const cnt = new Map();
    for (let x of nums) {
        cnt.set(x, (cnt.get(x) ?? 0) + 1);
    }
    const pq = new MinPriorityQueue((p) => p[1]);
    for (let [x, v] of cnt.entries()) {
        if (pq.size() < k) {
            pq.enqueue([x, v]);
            continue;
        }
        if ((v > pq.front()[1])) {
            pq.dequeue();
            pq.enqueue([x, v]);
        }
    };
    return pq.toArray().map((item) => item[0]);
};
```

#### [961. 在长度 2N 的数组中找出重复 N 次的元素](https://leetcode.cn/problems/n-repeated-element-in-size-2n-array/description/)

给你一个整数数组 `nums` ，该数组具有以下属性：

* `nums.length == 2 * n`.
* `nums` 包含 `n + 1` 个 **不同的** 元素
* `nums` 中恰有一个元素重复 `n` 次

找出并返回重复了 `n`次的那个元素。

**示例 1：**

```
输入：nums = [1,2,3,3]
输出：3
```

**示例 2：**

```
输入：nums = [2,1,2,5,3,2]
输出：2
```

**示例 3：**

```
输入：nums = [5,1,5,2,5,3,5,4]
输出：5
```

**提示：**

* `2 <= n <= 5000`
* `nums.length == 2 * n`
* `0 <= nums[i] <= 104`
* `nums` 由 `n + 1` 个 **不同的** 元素组成，且其中一个元素恰好重复 `n` 次

##### 随机

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var repeatedNTimes = function (nums) {
    const n = nums.length;
    const getRandom = (x) => {
        return Math.floor(Math.random() * x)
    }
    while (true) {
        let i1 = getRandom(n),
            i2 = getRandom(n - 1); // i2在[0, n-2]中随机取下标，为了当i1 == i2时i2可以加1
        if (i1 == i2) i2++;
        if (nums[i1] == nums[i2]) return nums[i1];
    }
};
```

##### 检查相邻元素

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var repeatedNTimes = function (nums) {
    for (let i = 1; i < nums.length; i++) {
        let x = nums[i];
        if (x == nums[i - 1] || // x中间相邻一个元素
            (i > 1 && x == nums[i - 2]) || // 当n = 2时，x中间可以相邻两个元素[3,1,2,3]
            (i > 2 && x == nums[i - 3])) {
            return x;
        }
    }
};
```

##### 摩尔投票

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var repeatedNTimes = function (nums) {
    let ans = 0, cnt = 0;
    // 跳过nums[0],在[1, 2n-1]中摩尔投票，这样出现n次的数为众数
    for (let i = 1; i < nums.length; i++) {
        // nums[0]为众数
        if (nums[i] == nums[0]) return nums[0];
        // 摩尔投票
        if (cnt == 0) {
            ans = nums[i];
            cnt = 1;
        } else {
            cnt += ans == nums[i] ? 1 : -1;
        }
    }
    return ans;
};
```

##### 哈希集合

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var repeatedNTimes = function(nums) {
    const n = nums.length / 2;
    const set = new Set();
    for (let x of nums) {
        if (set.has(x)) return x;
        set.add(x);
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
 * 寻找数组中的多数元素（摩尔投票法）
 * 多数元素的定义：在数组中出现次数大于 ⌊ n/2 ⌋ 的元素（n为数组长度）
 * @param {number[]} nums - 输入的整数数组，题目保证该数组一定存在多数元素
 * @return {number} - 返回数组中的多数元素
 */
var majorityElement = function(nums) {
    // 初始化结果变量ans，用于存储最终找到的多数元素
    let ans = 0;
    // 初始化计数变量cnt，用于记录当前候选元素的"票数"
    let cnt = 0;

    // 遍历输入数组中的每一个元素x
    for (const x of nums) {
        // 当票数为0时，说明当前没有有效候选元素，将当前元素x设为新的候选元素
        if (cnt == 0) {
            ans = x;     // 更新候选元素为当前遍历到的元素x
            cnt = 1;     // 候选元素票数初始化为1
        } else {
            // 当票数不为0时，判断当前元素是否与候选元素一致
            // 若一致，票数加1；若不一致，票数减1（相当于"抵消"一票）
            cnt += x == ans ? 1 : -1;
        }
    }

    // 遍历结束后，ans即为数组中的多数元素
    return ans;
};
```

