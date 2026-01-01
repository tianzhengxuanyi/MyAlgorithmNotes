### 2026-01-01

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

##### 优先队列

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function(nums, k) {
    const pq = new MinPriorityQueue();
    for (let x of nums) {
        if (pq.size() < k) {
            pq.enqueue(x);
        } else {
            if (x > pq.front()) {
                pq.enqueue(x);
                pq.dequeue();
            }
        }
    }
    return pq.front();
};
```

#### [84. 柱状图中最大的矩形](https://leetcode.cn/problems/largest-rectangle-in-histogram/description/)

给定 *n* 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1 。

求在该柱状图中，能够勾勒出来的矩形的最大面积。

**示例 1:**

![](https://assets.leetcode.com/uploads/2021/01/04/histogram.jpg)

```
输入：heights = [2,1,5,6,2,3]
输出：10
解释：最大的矩形为图中红色区域，面积为 10
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2021/01/04/histogram-1.jpg)

```
输入： heights = [2,4]
输出： 4
```

**提示：**

* `1 <= heights.length <=105`
* `0 <= heights[i] <= 104`

##### 单调栈：一次遍历

```js
/**
 * @param {number[]} heights
 * @return {number}
 */
var largestRectangleArea = function (heights) {
    heights.push(-1); // 最后清空栈
    const st = [-1]; // 哨兵
    let ans = 0;
    for (let i = 0; i < heights.length; i++) {
        while (st.length && heights[i] < heights[st[st.length - 1]]) {
            let j = st.pop(); // 计算高度的下标
            // j右侧小于height[j]的下标为i
            // j左侧小于height[j]的下标为栈顶，应为栈为递减栈
            ans = Math.max((i - st[st.length - 1] - 1) * heights[j], ans);
        }
        st.push(i);
    }
    return ans;
};
```

##### 单调栈：两次遍历

```js
/**
 * @param {number[]} heights
 * @return {number}
 */
var largestRectangleArea = function (heights) {
    const n = heights.length;
    const left = Array(n).fill(-1);
    const right = Array(n).fill(n);
    const st = [];
    for (let i = 0; i < n; i++) {
        while (st.length && heights[i] < heights[st[st.length - 1]]) {
            let j = st.pop();
            right[j] = i;
        }
        if (st.length) {
            left[i] = st[st.length - 1];
        }
        st.push(i);
    }
    let ans = 0;
    for (let i = 0; i < n; i++) {
        ans = Math.max(ans, (right[i] - left[i] - 1) * heights[i]);
    }
    return ans;
};
```

#### [739. 每日温度](https://leetcode.cn/problems/daily-temperatures/description/)

给定一个整数数组 `temperatures` ，表示每天的温度，返回一个数组 `answer` ，其中 `answer[i]` 是指对于第 `i` 天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 `0` 来代替。

**示例 1:**

```
输入: temperatures = [73,74,75,71,69,72,76,73]
输出: [1,1,4,2,1,1,0,0]
```

**示例 2:**

```
输入: temperatures = [30,40,50,60]
输出: [1,1,1,0]
```

**示例 3:**

```
输入: temperatures = [30,60,90]
输出: [1,1,0]
```

**提示：**

* `1 <= temperatures.length <= 105`
* `30 <= temperatures[i] <= 100`

##### 单调递减栈：从右向左

```js
/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
var dailyTemperatures = function(temperatures) {
    const n = temperatures.length;
    const ans = Array(n).fill(0), st = [];
    for (let i = n - 1; i >= 0; i--) {
        while (st.length && temperatures[i] >= temperatures[st[st.length - 1]]) {
            st.pop();
        }
        if (st.length) {
            ans[i] = st[st.length - 1] - i;
        }
        st.push(i);
    }
    return ans;
};
```

##### 单调递减栈：从左向右

```js
/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
var dailyTemperatures = function(temperatures) {
    const n = temperatures.length;
    const ans = Array(n).fill(0), st = [];
    for (let i = 0; i < n; i++) {
        while (st.length && temperatures[i] > temperatures[st[st.length - 1]]) {
            let t = st.pop();
            ans[t] = i - t;
        }
        st.push(i);
    }
    return ans;
};
```

#### [394. 字符串解码](https://leetcode.cn/problems/decode-string/description/)

给定一个经过编码的字符串，返回它解码后的字符串。

编码规则为: `k[encoded_string]`，表示其中方括号内部的 `encoded_string` 正好重复 `k` 次。注意 `k` 保证为正整数。

你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。

此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 `k` ，例如不会出现像 `3a` 或 `2[4]` 的输入。

测试用例保证输出的长度不会超过 `105`。

**示例 1：**

```
输入：s = "3[a]2[bc]"
输出："aaabcbc"
```

**示例 2：**

```
输入：s = "3[a2[c]]"
输出："accaccacc"
```

**示例 3：**

```
输入：s = "2[abc]3[cd]ef"
输出："abcabccdcdcdef"
```

**示例 4：**

```
输入：s = "abc3[cd]xyz"
输出："abccdcdcdxyz"
```

**提示：**

* `1 <= s.length <= 30`
* `s` 由小写英文字母、数字和方括号 `'[]'` 组成
* `s` 保证是一个 **有效** 的输入。
* `s` 中所有整数的取值范围为 `[1, 300]`

##### 栈

```js
/**
 * @param {string} s
 * @return {string}
 */
var decodeString = function (s) {
    const st = [], n = s.length;
    for (let i = 0; i < n; i++) {
        if (s[i] == "]") {
            let t = ""
            // 弹出并拼接[]内的字符
            while (st.length && st[st.length - 1] != "[") {
                t = st.pop() + t;
            }
            // 弹出[
            st.pop();
            // 弹出重复次数
            let num = st.pop();
            // 将t重复后重新推入栈中
            st.push(t.repeat(+num));
        } else {
            // 如果s[i]为数字且栈顶为数字 拼接
            if (st.length && isNumber(s[i]) && isNumber(st[st.length - 1])) {
                st[st.length - 1] += s[i];
            } else {
                st.push(s[i]);
            }
        }
    }
    return st.join("");
};

function isNumber(x) {
    let num = Number(x);
    return num == 0 || !!num;
}
```

#### [155. 最小栈](https://leetcode.cn/problems/min-stack/description/)

设计一个支持 `push` ，`pop` ，`top` 操作，并能在常数时间内检索到最小元素的栈。

实现 `MinStack` 类:

* `MinStack()` 初始化堆栈对象。
* `void push(int val)` 将元素val推入堆栈。
* `void pop()` 删除堆栈顶部的元素。
* `int top()` 获取堆栈顶部的元素。
* `int getMin()` 获取堆栈中的最小元素。

**示例 1:**

```
输入：
["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]

输出：
[null,null,null,null,-3,null,0,-2]

解释：
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin();   --> 返回 -3.
minStack.pop();
minStack.top();      --> 返回 0.
minStack.getMin();   --> 返回 -2.
```

**提示：**

* `-231 <= val <= 231 - 1`
* `pop`、`top` 和 `getMin` 操作总是在 **非空栈** 上调用
* `push`, `pop`, `top`, and `getMin`最多被调用 `3 * 104` 次

##### 栈中维护[val, min]

```js

var MinStack = function() {
    this.st = [[-1, Infinity]]; // 哨兵
};

/** 
 * @param {number} val
 * @return {void}
 */
MinStack.prototype.push = function(val) {
   const min = Math.min(val, this.getMin());
    this.st.push([val, min]);
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function() {
    this.st.pop();
};

/**
 * @return {number}
 */
MinStack.prototype.top = function() {
    return this.st[this.st.length - 1][0];
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function() {
    return this.st[this.st.length - 1][1];
};

/** 
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(val)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */
```

##### 维护单调递减栈

```js

var MinStack = function () {
    this.st = []; // 栈
    this.min = []; // 单调递减栈
};

/** 
 * @param {number} val
 * @return {void}
 */
MinStack.prototype.push = function (val) {
    this.st.push(val);
    // 如果val小于min栈顶 入栈
    if (!this.min.length || val <= this.st[this.min[this.min.length - 1]]) {
        this.min.push(this.st.length - 1);
    }
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function () {
    const index = this.st.length - 1;
    this.st.pop();
    // 如果st弹出的index为min栈顶
    if (this.min.length && this.min[this.min.length - 1] == index) {
        this.min.pop();
    }
};

/**
 * @return {number}
 */
MinStack.prototype.top = function () {
    return this.st[this.st.length - 1];
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function () {
    return this.st[this.min[this.min.length - 1]];
};

/** 
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(val)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */
```

#### [20. 有效的括号](https://leetcode.cn/problems/valid-parentheses/description/)

给定一个只包括 `'('`，`')'`，`'{'`，`'}'`，`'['`，`']'` 的字符串 `s` ，判断字符串是否有效。

有效字符串需满足：

1. 左括号必须用相同类型的右括号闭合。
2. 左括号必须以正确的顺序闭合。
3. 每个右括号都有一个对应的相同类型的左括号。

**示例 1：**

**输入：**s = "()"

**输出：**true

**示例 2：**

**输入：**s = "()[]{}"

**输出：**true

**示例 3：**

**输入：**s = "(]"

**输出：**false

**示例 4：**

**输入：**s = "([])"

**输出：**true

**示例 5：**

**输入：**s = "([)]"

**输出：**false

**提示：**

* `1 <= s.length <= 104`
* `s` 仅由括号 `'()[]{}'` 组成

##### 栈

```js
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
    if (s.length % 2) return false;
    const st = [];
    for (let x of s) {
        if (!st.length) {
            if (x == "]" || x == "}" || x == ")") return false;
            st.push(x);
            continue;
        }
        if ((x == "]" && st[st.length - 1] == "[") ||
            (x == ")" && st[st.length - 1] == "(") ||
            (x == "}" && st[st.length - 1] == "{")) {
                st.pop();
            } else {
                st.push(x);
            }
    }
    return st.length == 0;
};
```

#### [4. 寻找两个正序数组的中位数](https://leetcode.cn/problems/median-of-two-sorted-arrays/description/)

给定两个大小分别为 `m` 和 `n` 的正序（从小到大）数组 `nums1` 和 `nums2`。请你找出并返回这两个正序数组的 **中位数** 。

算法的时间复杂度应该为 `O(log (m+n))` 。

**示例 1：**

```
输入：nums1 = [1,3], nums2 = [2]
输出：2.00000
解释：合并数组 = [1,2,3] ，中位数 2
```

**示例 2：**

```
输入：nums1 = [1,2], nums2 = [3,4]
输出：2.50000
解释：合并数组 = [1,2,3,4] ，中位数 (2 + 3) / 2 = 2.5
```

**提示：**

* `nums1.length == m`
* `nums2.length == n`
* `0 <= m <= 1000`
* `0 <= n <= 1000`
* `1 <= m + n <= 2000`
* `-106 <= nums1[i], nums2[i] <= 106`

##### 获取第k小的元素

```js
/**
 * 寻找两个正序数组的中位数（核心功能注释）
 * 算法思路：二分查找法，通过寻找第k小元素来求解中位数，时间复杂度O(log(m+n))
 * @param {number[]} nums1 - 第一个升序排列的数字数组
 * @param {number[]} nums2 - 第二个升序排列的数字数组
 * @return {number} - 两个正序数组合并后的中位数
 */
var findMedianSortedArrays = function (nums1, nums2) {
    // 分别获取两个数组的长度
    const m = nums1.length, n = nums2.length;
    // 计算两个数组的总长度
    const totalLen = m + n;
    // 情况1：总长度为奇数，中位数是中间的那个元素（唯一值）
    if (totalLen % 2 === 1) {
        // 计算中间元素的索引（向下取整）
        let minIndex = Math.floor(totalLen / 2);
        // 由于getKthElement寻找的是第k小元素（k从1开始计数），因此需要minIndex+1
        return getKthElement(nums1, nums2, minIndex + 1)
    } 
    // 情况2：总长度为偶数，中位数是中间两个元素的平均值
    else {
        // 计算中间两个元素的索引（从0开始计数）
        let minIndex1 = Math.floor(totalLen / 2) - 1; // 前一个中间元素索引
        let minIndex2 = Math.floor(totalLen / 2);     // 后一个中间元素索引
        // 分别获取第(minIndex1+1)小和第(minIndex2+1)小元素，取平均值作为中位数
        return (getKthElement(nums1, nums2, minIndex1 + 1) + getKthElement(nums1, nums2, minIndex2 + 1)) / 2
    }
};

/**
 * 二分查找两个正序数组中的第k小元素（辅助函数）
 * @param {number[]} nums1 - 第一个升序排列的数字数组
 * @param {number[]} nums2 - 第二个升序排列的数字数组
 * @param {number} k - 要寻找的第k小元素（k从1开始计数）
 * @return {number} - 找到的第k小元素
 */
function getKthElement(nums1, nums2, k) {
    // 获取两个数组的当前有效长度
    const len1 = nums1.length, len2 = nums2.length;
    // 定义两个指针，分别指向nums1和nums2的当前起始位置（初始为0）
    let index1 = 0, index2 = 0;

    // 循环进行二分查找，直到找到目标元素
    while (true) {
        // 边界情况1：nums1已经遍历完毕，直接返回nums2中第(index2 + k -1)个元素
        if (index1 === len1) {
            return nums2[index2 + k - 1];
        }

        // 边界情况2：nums2已经遍历完毕，直接返回nums1中第(index1 + k -1)个元素
        if (index2 === len2) {
            return nums1[index1 + k - 1];
        }

        // 边界情况3：k=1时，只需返回两个数组当前起始位置的较小值（即第1小元素）
        if (k === 1) {
            return Math.min(nums1[index1], nums2[index2]);
        }

        // 核心逻辑：计算二分的步长（k>>1 等价于 Math.floor(k/2)，位运算效率更高）
        let half = k >> 1;
        // 计算nums1中本次要比较的元素索引（防止越界，取最小值后减1）
        let newIndex1 = Math.min(index1 + half, len1) - 1;
        // 计算nums2中本次要比较的元素索引（防止越界，取最小值后减1）
        let newIndex2 = Math.min(index2 + half, len2) - 1;
        // 获取两个数组中要比较的基准元素
        let pivot1 = nums1[newIndex1], pivot2 = nums2[newIndex2];

        // 比较两个基准元素，排除不可能包含第k小元素的部分
        if (pivot1 <= pivot2) {
            // 若pivot1更小，说明nums1中[index1, newIndex1]的元素都小于第k小元素，直接排除
            // 更新k值：减去排除的元素个数
            k -= (newIndex1 - index1 + 1);
            // 更新nums1的起始指针，指向排除部分的下一个位置
            index1 = newIndex1 + 1;
        } else {
            // 若pivot2更小，说明nums2中[index2, newIndex2]的元素都小于第k小元素，直接排除
            // 更新k值：减去排除的元素个数
            k -= (newIndex2 - index2 + 1);
            // 更新nums2的起始指针，指向排除部分的下一个位置
            index2 = newIndex2 + 1;
        }
    }
}
```

##### 双指针优化为二分

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
    if (nums1.length > nums2.length) {
        [nums1, nums2] = [nums2, nums1];
    }
    const m = nums1.length, n = nums2.length;

    // 循环不变量：a[l - 1] <= b[j+1]
    // 循环不变量：a[r + 1] > b[j+1]
    let l = 0, r = m - 1;
    while (l <= r) {
        //  nums1中 有 i+1 个数在第一组
        let i = Math.floor((r - l) / 2) + l;
        //  nums2中 有 j+1 个数在第一组
        let j = Math.floor((m + n + 1) / 2) - i - 2;
        if (nums1[i] <= nums2[j + 1]) {
            l = i + 1;
        } else {
            r = i - 1;
        }
    }
    const i = r;
    const j = Math.floor((m + n + 1) / 2) - i - 2;
    const ai = i >= 0 ? nums1[i] : -Infinity;
    const bj = j >= 0 ? nums2[j] : -Infinity;
    const ai1 = i + 1 < m ? nums1[i + 1] : Infinity;
    const bj1 = j + 1 < n ? nums2[j + 1] : Infinity;
    const mx1 = Math.max(ai, bj);
    const mn2 = Math.min(ai1, bj1);
    return (m + n) % 2 ? mx1 : (mx1 + mn2) / 2;
};
```

##### 双指针：枚举nums1中在第一组中的个数

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
    if (nums1.length > nums2.length) {
        [nums1, nums2] = [nums2, nums1];
    }
    const m = nums1.length, n = nums2.length;
    nums1 = [-Infinity, ...nums1, Infinity];
    nums2 = [-Infinity, ...nums2, Infinity];

    // 枚举nums1中有i个数在第一组
    // 那么nums2中有j = (m + n + 1) /2 - i个数在第一组
    let i = 0; j = Math.floor((m + n + 1) / 2);
    while (true) {
        // 第一组最大值小于等于第二组最小值
        if (Math.max(nums1[i], nums2[j]) <= Math.min(nums1[i + 1], nums2[j + 1])) {
            const max1 = Math.max(nums1[i], nums2[j]);
            const min2 = Math.min(nums1[i + 1], nums2[j + 1]);
            return (m + n) % 2 ? max1 : (max1 + min2) / 2;
        }
        i++, j--;
    }
};
```

##### 双指针:合并数组

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function (nums1, nums2) {
    const n = nums1.length, m = nums2.length;
    let k = Math.ceil((m + n) / 2);
    let p1 = 0, p2 = 0, mid = 0, mid2 = 0;
    for (let i = 0; i <= k; i++) {
        mid2 = mid;
        if (p1 == n) {
            mid = nums2[p2];
            p2++;
            continue;
        }
        if (p2 == m) {
            mid = nums1[p1];
            p1++;
            continue;
        }
        if (nums1[p1] < nums2[p2]) {
            mid = nums1[p1];
            p1++;
        } else {
            mid = nums2[p2];
            p2++;
        }
    }
    if ((m + n) % 2) {
        return mid2;
    } else {
        return (mid + mid2) / 2;
    }
};
```

#### [153. 寻找旋转排序数组中的最小值](https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/description/)

已知一个长度为 `n` 的数组，预先按照升序排列，经由 `1` 到 `n` 次 **旋转** 后，得到输入数组。例如，原数组 `nums = [0,1,2,4,5,6,7]` 在变化后可能得到：

* 若旋转 `4` 次，则可以得到 `[4,5,6,7,0,1,2]`
* 若旋转 `7` 次，则可以得到 `[0,1,2,4,5,6,7]`

注意，数组 `[a[0], a[1], a[2], ..., a[n-1]]` **旋转一次** 的结果为数组 `[a[n-1], a[0], a[1], a[2], ..., a[n-2]]` 。

给你一个元素值 **互不相同** 的数组 `nums` ，它原来是一个升序排列的数组，并按上述情形进行了多次旋转。请你找出并返回数组中的 **最小元素** 。

你必须设计一个时间复杂度为 `O(log n)` 的算法解决此问题。

**示例 1：**

```
输入：nums = [3,4,5,1,2]
输出：1
解释：原数组为 [1,2,3,4,5] ，旋转 3 次得到输入数组。
```

**示例 2：**

```
输入：nums = [4,5,6,7,0,1,2]
输出：0
解释：原数组为 [0,1,2,4,5,6,7] ，旋转 4 次得到输入数组。
```

**示例 3：**

```
输入：nums = [11,13,15,17]
输出：11
解释：原数组为 [11,13,15,17] ，旋转 4 次得到输入数组。
```

**提示：**

* `n == nums.length`
* `1 <= n <= 5000`
* `-5000 <= nums[i] <= 5000`
* `nums` 中的所有整数 **互不相同**
* `nums` 原来是一个升序排序的数组，并进行了 `1` 至 `n` 次旋转

##### 二分：跟第一个数比较

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function(nums) {
    let n = nums.length, l = 0, r = n - 1;
    if (nums[r] >= nums[l]) return nums[l];
    while (l <= r) {
        let m = Math.floor((r - l) / 2) + l;
        if (nums[m] >= nums[0]) {
            l = m + 1;
        } else {
            r = m - 1;
        }
    }
    return nums[l]
};
```

#### [33. 搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array/description/)

整数数组 `nums` 按升序排列，数组中的值 **互不相同** 。

在传递给函数之前，`nums` 在预先未知的某个下标 `k`（`0 <= k < nums.length`）上进行了 **向左旋转**，使数组变为 `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]`（下标 **从 0 开始** 计数）。例如， `[0,1,2,4,5,6,7]` 下标 `3` 上向左旋转后可能变为 `[4,5,6,7,0,1,2]` 。

给你 **旋转后** 的数组 `nums` 和一个整数 `target` ，如果 `nums` 中存在这个目标值 `target` ，则返回它的下标，否则返回 `-1` 。

你必须设计一个时间复杂度为 `O(log n)` 的算法解决此问题。

**示例 1：**

```
输入：nums = [4,5,6,7,0,1,2], target = 0
输出：4
```

**示例 2：**

```
输入：nums = [4,5,6,7,0,1,2], target = 3
输出：-1
```

**示例 3：**

```
输入：nums = [1], target = 0
输出：-1
```

**提示：**

* `1 <= nums.length <= 5000`
* `-104 <= nums[i] <= 104`
* `nums` 中的每个值都 **独一无二**
* 题目数据保证 `nums` 在预先未知的某个下标上进行了旋转
* `-104 <= target <= 104`

##### 二分

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
    let l = 0, r = nums.length - 1;
    if (nums[0] == target) return 0;
    if (nums[r] == target) return r;
    while (l <= r) {
        let m = Math.floor((r - l) / 2) + l;
        // 找到target
        if (nums[m] == target) {
            return m;
        }
        if (nums[0] <= target && nums[m] < nums[0]) { // target在前半部分,但是mid在后半部分
            r = m - 1; // r右移
            continue;
        }
        if (nums[0] > target && nums[m] >= nums[0]) { // target在后半部分，但是mid在前半部分
            l = m + 1; // l左移
            continue;
        }
        // mid在正确的半区内
        if (nums[m] < target) {
            l = m + 1; // l左移
        } else {
            r = m - 1; // r右移
        }
    }
    return -1;
};
```

#### [34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/description/)

给你一个按照非递减顺序排列的整数数组 `nums`，和一个目标值 `target`。请你找出给定目标值在数组中的开始位置和结束位置。

如果数组中不存在目标值 `target`，返回 `[-1, -1]`。

你必须设计并实现时间复杂度为 `O(log n)` 的算法解决此问题。

**示例 1：**

```
输入：nums = [5,7,7,8,8,10], target = 8
输出：[3,4]
```

**示例 2：**

```
输入：nums = [5,7,7,8,8,10], target = 6
输出：[-1,-1]
```

**示例 3：**

```
输入：nums = [], target = 0
输出：[-1,-1]
```

**提示：**

* `0 <= nums.length <= 105`
* `-109 <= nums[i] <= 109`
* `nums` 是一个非递减数组
* `-109 <= target <= 109`

##### 二分

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function (nums, target) {
    let pos1 = lowerBound(nums, target);
    if (nums[pos1] !== target) return [-1, -1];
    let pos2 = lowerBound(nums, target + 1) - 1;
    return [pos1, pos2];
};

function lowerBound(nums, target) {
    let l = 0, r = nums.length - 1;
    while (l <= r) {
        let m = Math.floor((r - l) / 2) + l;
        if (nums[m] < target) {
            l = m + 1;
        } else {
            r = m - 1;
        }
    }
    return l;
}
```

#### [74. 搜索二维矩阵](https://leetcode.cn/problems/search-a-2d-matrix/description/)

给你一个满足下述两条属性的 `m x n` 整数矩阵：

* 每行中的整数从左到右按非严格递增顺序排列。
* 每行的第一个整数大于前一行的最后一个整数。

给你一个整数 `target` ，如果 `target` 在矩阵中，返回 `true` ；否则，返回 `false` 。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/10/05/mat.jpg)

```
输入：matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
输出：true
```

**示例 2：**

![](https://assets.leetcode.cn/aliyun-lc-upload/uploads/2020/11/25/mat2.jpg)

```
输入：matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
输出：false
```

**提示：**

* `m == matrix.length`
* `n == matrix[i].length`
* `1 <= m, n <= 100`
* `-104 <= matrix[i][j], target <= 104`

##### 二分：将mid转为matrix中坐标

```js
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function(matrix, target) {
    const m = matrix.length, n = matrix[0].length;
    let l = 0, r = m * n - 1;
    while (l <= r) {
        let mid = Math.floor((r - l) / 2) + l;
        // 将mid转换为matrix中的坐标
        let val = matrix[Math.floor(mid / n)][mid % n];
        if (val < target) {
            l = mid + 1;
        } else if (val > target) {
            r = mid - 1;
        } else {
            return true;
        }
    }

    return false;
};
```

##### 排除法

```js
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function(matrix, target) {
    const m = matrix.length, n = matrix[0].length;
    let r = 0, c = n - 1;
    while (r < m && c >= 0) {
        if (matrix[r][c] == target) return true;
        if (matrix[r][c] > target) {
            c--;
        } else {
            r++;
        }
    }
    return false;
};
```

#### [35. 搜索插入位置](https://leetcode.cn/problems/search-insert-position/description/)

给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。

请必须使用时间复杂度为 `O(log n)` 的算法。

**示例 1:**

```
输入: nums = [1,3,5,6], target = 5
输出: 2
```

**示例 2:**

```
输入: nums = [1,3,5,6], target = 2
输出: 1
```

**示例 3:**

```
输入: nums = [1,3,5,6], target = 7
输出: 4
```

**提示:**

* `1 <= nums.length <= 104`
* `-104 <= nums[i] <= 104`
* `nums` 为 **无重复元素**的 **升序**排列数组
* `-104 <= target <= 104`

##### 二分

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
    let l = 0, r = nums.length - 1;
    while (l <= r) {
        let m = Math.floor((r - l) / 2) + l;
        if (nums[m] < target) {
            l = m + 1;
        } else {
            r = m - 1;
        }
    }
    return l;
};
```

#### [51. N 皇后](https://leetcode.cn/problems/n-queens/description/)

按照国际象棋的规则，皇后可以攻击与之处在同一行或同一列或同一斜线上的棋子。

**n 皇后问题** 研究的是如何将 `n` 个皇后放置在 `n×n` 的棋盘上，并且使皇后彼此之间不能相互攻击。

给你一个整数 `n` ，返回所有不同的 **n皇后问题** 的解决方案。

每一种解法包含一个不同的 **n 皇后问题** 的棋子放置方案，该方案中 `'Q'` 和 `'.'` 分别代表了皇后和空位。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/11/13/queens.jpg)

```
输入：n = 4
输出：[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
解释：如上图所示，4 皇后问题存在两个不同的解法。
```

**示例 2：**

```
输入：n = 1
输出：[["Q"]]
```

**提示：**

* `1 <= n <= 9`

##### 回溯

```js
/**
 * @param {number} n
 * @return {string[][]}
 */
var solveNQueens = function (n) {
    const ans = [], path = Array(n).fill(0);
    const col = Array(n).fill(false), dialog1 = Array(2 * n).fill(false),
        dialog2 = Array(2 * n).fill(false);
    const dfs = (i) => {
        if (i == n) {
            ans.push(path.map(j => ".".repeat(j) + "Q" + ".".repeat(n - j - 1)));
            return;
        }
        for (let j = 0; j < n; j++) {
            let rc = i - j + n - 1;
            if (col[j] || dialog1[i + j] || dialog2[rc]) continue;
            path[i] = [j];
            col[j] = dialog1[i + j] = dialog2[rc] = true;
            dfs(i + 1);
            col[j] = dialog1[i + j] = dialog2[rc] = false;
        }
    }
    dfs(0);
    return ans;
};
```

#### [131. 分割回文串](https://leetcode.cn/problems/palindrome-partitioning/description/)

给你一个字符串 `s`，请你将`s`分割成一些 子串，使每个子串都是 **回文串** 。返回 `s` 所有可能的分割方案。

**示例 1：**

```
输入：s = "aab"
输出：[["a","a","b"],["aa","b"]]
```

**示例 2：**

```
输入：s = "a"
输出：[["a"]]
```

**提示：**

* `1 <= s.length <= 16`
* `s` 仅由小写英文字母组成

##### dfs: 枚举子串结束位置

```js
/**
 * @param {string} s
 * @return {string[][]}
 */
var partition = function (s) {
    const n = s.length;
    const isP = Array.from({ length: n }, () => Array(n).fill(false));
    for (let i = n - 1; i >= 0; i--) {
        isP[i][i] = true;
        for (let j = i + 1; j < n; j++) {
            if (j == i + 1) {
                isP[i][j] = s[i] == s[j];
            } else {
                isP[i][j] = s[i] == s[j] && isP[i + 1][j - 1];
            }
        }
    }
    const ans = [], path = [];
    const dfs = (i) => {
        if (i == n) {
            ans.push(path.slice());
            return;
        }
        for (let j = i; j < n; j++) {
            if (isP[i][j]) {
                path.push(s.slice(i, j + 1));
                dfs(j + 1);
                path.pop();
            }
        }
    }
    dfs(0);
    return ans;
};
```

#### [79. 单词搜索](https://leetcode.cn/problems/word-search/description/)

给定一个 `m x n` 二维字符网格 `board` 和一个字符串单词 `word` 。如果 `word` 存在于网格中，返回 `true` ；否则，返回 `false` 。

单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/11/04/word2.jpg)

```
输入：board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = "ABCCED"
输出：true
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2020/11/04/word-1.jpg)

```
输入：board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = "SEE"
输出：true
```

**示例 3：**

![](https://assets.leetcode.com/uploads/2020/10/15/word3.jpg)

```
输入：board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = "ABCB"
输出：false
```

**提示：**

* `m == board.length`
* `n = board[i].length`
* `1 <= m, n <= 6`
* `1 <= word.length <= 15`
* `board` 和 `word` 仅由大小写英文字母组成

**进阶：**你可以使用搜索剪枝的技术来优化解决方案，使其在 `board` 更大的情况下可以更快解决问题？

##### dfs：优化

```js
/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function (board, word) {
    const m = board.length, n = board[0].length, l = word.length;
    // 统计词频
    const wordCnt = new Map(), cnt = new Map();
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            cnt.set(board[i][j], (cnt.get(board[i][j]) ?? 0) + 1);
        }
    }
    for (let w of word) {
        wordCnt.set(w, (wordCnt.get(w) ?? 0) + 1);
        // 优化一：如果word中某字母词频大于board，board中不可能存在word
        if (!cnt.has(w) || wordCnt.get(w) > cnt.get(w)) return false;
    }
    // 优化二：如果word末尾字符在board中出现次数更少，那么从末尾搜索会更快
    if (cnt.get(word[0]) > cnt.get(word[l - 1])) {
        word = word.split("").reverse();
    }
    const dfs = (i, j, k) => {
        if (board[i][j] !== word[k]) {
            return false;
        }
        if (k == l - 1) return true;
        board[i][j] = 0;
        for (let [di, dj] of direction) {
            let ni = i + di, nj = j + dj;
            if (ni < 0 || ni >= m || nj < 0 || nj >= n) continue;
            if (board[ni][nj] && dfs(ni, nj, k + 1)) {
                board[i][j] = word[k];
                return true;
            }
        }
        board[i][j] = word[k];
        return false;
    }
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (dfs(i, j, 0)) return true;
        }
    }
    return false;
};

const direction = [[1, 0], [-1, 0], [0, 1], [0, -1]];
```

##### dfs: 原地修改替代vis

```js
/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function (board, word) {
    const m = board.length, n = board[0].length, l = word.length;
    const dfs = (i, j, k) => {
        if (board[i][j] !== word[k]) {
            return false;
        }
        if (k == l - 1) return true;
        board[i][j] = 0;
        for (let [di, dj] of direction) {
            let ni = i + di, nj = j + dj;
            if (ni < 0 || ni >= m || nj < 0 || nj >= n) continue;
            if (board[ni][nj] && dfs(ni, nj, k + 1)) {
                board[i][j] = word[k];
                return true;
            }
        }
        board[i][j] = word[k];
        return false;
    }
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (dfs(i, j, 0)) return true;
        }
    }
    return false;
};

const direction = [[1, 0], [-1, 0], [0, 1], [0, -1]];
```

##### dfs

```js
/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function (board, word) {
    const m = board.length, n = board[0].length, l = word.length;
    const vis = Array.from({ length: m }, () => Array(n).fill(false));
    const dfs = (i, j, k) => {
        if (board[i][j] !== word[k]) {
            return false;
        }
        if (k == l - 1) return true;
        vis[i][j] = true;
        for (let [di, dj] of direction) {
            let ni = i + di, nj = j + dj;
            if (ni < 0 || ni >= m || nj < 0 || nj >= n) continue;
            if (!vis[ni][nj] && dfs(ni, nj, k + 1)) {
                vis[i][j] = false;
                return true;
            }
        }
        vis[i][j] = false;
        return false;
    }
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (dfs(i, j, 0)) return true;
        }
    }
    return false;
};

const direction = [[1, 0], [-1, 0], [0, 1], [0, -1]];
```

#### [22. 括号生成](https://leetcode.cn/problems/generate-parentheses/description/)

数字 `n` 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 **有效的** 括号组合。

**示例 1：**

```
输入：n = 3
输出：["((()))","(()())","(())()","()(())","()()()"]
```

**示例 2：**

```
输入：n = 1
输出：["()"]
```

**提示：**

* `1 <= n <= 8`

##### 枚举左括号的下标⭐

```js
/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function (n) {
    const ans = [];
    const path = []; // 记录左括号的位置
    // 目前填了 i 个括号
    // 这 i 个括号中的左括号个数 - 右括号个数 = balance
    const dfs = (i, balance) => {
        if (path.length == n) {
            const s = Array(2 * n).fill(")");
            for (let j of path) {
                s[j] = "(";
            }
            ans.push(s.join(""));
            return;
        }
        // 枚举填 j = 0,1,2,3...balance 个右括号
        for (let j = 0; j <= balance; j++) {
            // 填j个右括号后填1个左括号，记录左括号下标i+j
            path.push(i + j)
            dfs(i + j + 1, balance - j + 1);
            path.pop();
        }
    }

    dfs(0, 0);
    return ans;
};
```

##### 枚举当前位置填左括号还是右括号

```js
/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function (n) {
    const ans = [];
    const dfs = (l, r, path) => {
        // 括号数满足
        if (l == r && l == n) {
            ans.push(path);
            return;
        }
        if (l > n || r > n) return;
        // 添加左括号
        dfs(l + 1, r, path + "(");
        // 只有l大于r时才能添加右括号，保证合法
        if (l > r) {
            dfs(l, r + 1, path + ")");
        }
    }
    dfs(0, 0, "");
    return ans;
};
```

#### [66. 加一](https://leetcode.cn/problems/plus-one/description/)

给定一个表示 **大整数** 的整数数组 `digits`，其中 `digits[i]` 是整数的第 `i` 位数字。这些数字按从左到右，从最高位到最低位排列。这个大整数不包含任何前导 `0`。

将大整数加 1，并返回结果的数字数组。

**示例 1：**

```
输入：digits = [1,2,3]
输出：[1,2,4]
解释：输入数组表示数字 123。
加 1 后得到 123 + 1 = 124。
因此，结果应该是 [1,2,4]。
```

**示例 2：**

```
输入：digits = [4,3,2,1]
输出：[4,3,2,2]
解释：输入数组表示数字 4321。
加 1 后得到 4321 + 1 = 4322。
因此，结果应该是 [4,3,2,2]。
```

**示例 3：**

```
输入：digits = [9]
输出：[1,0]
解释：输入数组表示数字 9。
加 1 得到了 9 + 1 = 10。
因此，结果应该是 [1,0]。
```

**提示：**

* `1 <= digits.length <= 100`
* `0 <= digits[i] <= 9`
* `digits` 不包含任何前导 `0`。

##### 找到连续为9的后缀

```js
/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function (digits) {
    let n = digits.length;
    for (let i = n - 1; i >= 0; i--) {
        if (digits[i] != 9) {
            digits[i]++; // 进位
            return digits; // 返回结果
        }
        digits[i] = 0;
    }
    // digits全是9
    digits.push(0);
    digits[0] = 1;
    return digits;
};
```

##### 设置进位变量carry

```js
/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function (digits) {
    let n = digits.length;
    let carry = (digits[n - 1] + 1) >= 10 ? 1 : 0
    digits[n - 1] = (digits[n - 1] + 1) % 10;
    for (let i = n - 2; i >= 0 && carry; i--) {
        carry = (digits[i] + carry) >= 10 ? 1 : 0
        digits[i] = (digits[i] + 1) % 10;
    }
    if (carry) {
        digits.unshift(carry);
    }
    return digits;
};
```

