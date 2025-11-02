### 2025-11-01

#### [528. 按权重随机选择](https://leetcode.cn/problems/random-pick-with-weight/description/)

给你一个 **下标从 0 开始** 的正整数数组 `w` ，其中 `w[i]` 代表第 `i` 个下标的权重。

请你实现一个函数 `pickIndex` ，它可以 **随机地** 从范围 `[0, w.length - 1]` 内（含 `0` 和 `w.length - 1`）选出并返回一个下标。选取下标 `i` 的 **概率** 为 `w[i] / sum(w)` 。



* 例如，对于 `w = [1, 3]`，挑选下标 `0` 的概率为 `1 / (1 + 3) = 0.25` （即，25%），而选取下标 `1` 的概率为 `3 / (1 + 3) = 0.75`（即，`75%`）。

**示例 1：**

```
输入：
["Solution","pickIndex"]
[[[1]],[]]
输出：
[null,0]
解释：
Solution solution = new Solution([1]);
solution.pickIndex(); // 返回 0，因为数组中只有一个元素，所以唯一的选择是返回下标 0。
```

**示例 2：**

```
输入：
["Solution","pickIndex","pickIndex","pickIndex","pickIndex","pickIndex"]
[[[1,3]],[],[],[],[],[]]
输出：
[null,1,1,1,1,0]
解释：
Solution solution = new Solution([1, 3]);
solution.pickIndex(); // 返回 1，返回下标 1，返回该下标概率为 3/4 。
solution.pickIndex(); // 返回 1
solution.pickIndex(); // 返回 1
solution.pickIndex(); // 返回 1
solution.pickIndex(); // 返回 0，返回下标 0，返回该下标概率为 1/4 。

由于这是一个随机问题，允许多个答案，因此下列输出都可以被认为是正确的:
[null,1,1,1,1,0]
[null,1,1,1,1,1]
[null,1,1,1,0,0]
[null,1,1,1,0,1]
[null,1,0,1,0,0]
......
诸若此类。
```

**提示：**

* `1 <= w.length <= 104`
* `1 <= w[i] <= 105`
* `pickIndex` 将被调用不超过 `104` 次

##### 前缀和 + 二分

```js
/**
 * @param {number[]} w
 */
var Solution = function (w) {
    const n = w.length;
    let sum = w[0];
    for (let i = 1; i < n; i++) {
        sum += w[i];
        w[i] += w[i - 1];
    }
    this.w = w, this.sum = sum;
};

/**
 * @return {number}
 */
Solution.prototype.pickIndex = function () {
    let rand = Math.floor(Math.random() * this.sum) + 1;
    // 二分大于等于rand的下标
    let l = 0, r = this.w.length - 1;
    while (l <= r) {
        let m = Math.floor((r - l) / 2) + l;
        if (this.w[m] < rand) {
            l = m + 1;
        } else {
            r = m - 1;
        }
    }
    
    return l;
};

/** 
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(w)
 * var param_1 = obj.pickIndex()
 */
```

#### [470. 用 Rand7() 实现 Rand10()](https://leetcode.cn/problems/implement-rand10-using-rand7/description/)

给定方法 `rand7` 可生成 `[1,7]` 范围内的均匀随机整数，试写一个方法 `rand10` 生成 `[1,10]` 范围内的均匀随机整数。

你只能调用 `rand7()` 且不能调用其他方法。请不要使用系统的 `Math.random()` 方法。



每个测试用例将有一个内部参数 `n`，即你实现的函数 `rand10()` 在测试时将被调用的次数。请注意，这不是传递给 `rand10()` 的参数。

**示例 1:**

```
输入: 1
输出: [2]
```

**示例 2:**

```
输入: 2
输出: [2,8]
```

**示例 3:**

```
输入: 3
输出: [3,8,10]
```

**提示:**

* `1 <= n <= 105`

**进阶:**

* `rand7()`调用次数的 [期望值](https://en.wikipedia.org/wiki/Expected_value) 是多少 ?
* 你能否尽量少调用 `rand7()` ?

##### 拒绝采样，生成二位七进制

```js
/**
 * The rand7() API is already defined for you.
 * var rand7 = function() {}
 * @return {number} a random integer in the range 1 to 7
 */
var rand10 = function () {
    while (true) {
        // 两位的七进制，等概率 1 / 48
        let r = (rand7() - 1) * 7 + (rand7() - 1);
        if (r < 40) return r % 10 + 1;
    }
};
```

##### 将rand7变成等概率返回 0 1的f函数，用f生成四位二进制，返回小于10的数

```js
/**
 * The rand7() API is already defined for you.
 * var rand7 = function() {}
 * @return {number} a random integer in the range 1 to 7
 */
var rand10 = function() {
    const f = () => {
        let r;
        do {
            r = rand7();
        } while (r == 4);

        return r < 4 ? 0 : 1;
    }

    const g = () => {
        let r;
        do {
            r = (f() << 3) | (f() << 2) | (f() << 1) | f()
        } while (r >= 10);

        return r + 1;
    }

    return g();
};
// 10 => 1010
```

#### [384. 打乱数组](https://leetcode.cn/problems/shuffle-an-array/description/)

给你一个整数数组 `nums` ，设计算法来打乱一个没有重复元素的数组。打乱后，数组的所有排列应该是 **等可能** 的。

实现 `Solution` class:

* `Solution(int[] nums)` 使用整数数组 `nums` 初始化对象
* `int[] reset()` 重设数组到它的初始状态并返回
* `int[] shuffle()` 返回数组随机打乱后的结果

**示例 1：**

```
输入
["Solution", "shuffle", "reset", "shuffle"]
[[[1, 2, 3]], [], [], []]
输出
[null, [3, 1, 2], [1, 2, 3], [1, 3, 2]]

解释
Solution solution = new Solution([1, 2, 3]);
solution.shuffle();    // 打乱数组 [1,2,3] 并返回结果。任何 [1,2,3]的排列返回的概率应该相同。例如，返回 [3, 1, 2]
solution.reset();      // 重设数组到它的初始状态 [1, 2, 3] 。返回 [1, 2, 3]
solution.shuffle();    // 随机返回数组 [1, 2, 3] 打乱后的结果。例如，返回 [1, 3, 2]
```

**提示：**

* `1 <= nums.length <= 50`
* `-106 <= nums[i] <= 106`
* `nums` 中的所有元素都是 **唯一的**
* 最多可以调用 `104` 次 `reset` 和 `shuffle`

##### 洗牌算法，原地乱序

```js
/**
 * @param {number[]} nums
 */
var Solution = function(nums) {
    this.nums = nums;
};

/**
 * @return {number[]}
 */
Solution.prototype.reset = function() {
    return this.nums;
};

/**
 * @return {number[]}
 */
Solution.prototype.shuffle = function() {
    const shuffle = this.nums.slice();
    // 随机的数与剩余的数最后一位交换
    for (let i = shuffle.length - 1; i >= 0; i--) {
        let rand = randRange(i + 1);
        [shuffle[i], shuffle[rand]] = [shuffle[rand], shuffle[i]];
    }

    return shuffle;
};

const randRange = (n) => {
    return Math.floor(Math.random() * n);
}

/** 
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(nums)
 * var param_1 = obj.reset()
 * var param_2 = obj.shuffle()
 */
```

##### 从[0, n-1]中随机抽取i，排除i，继续在剩下的下标中随机抽取，直到下标数组为空

```js
/**
 * @param {number[]} nums
 */
var Solution = function(nums) {
    this.nums = nums;
};

/**
 * @return {number[]}
 */
Solution.prototype.reset = function() {
    return this.nums;
};

/**
 * @return {number[]}
 */
Solution.prototype.shuffle = function() {
    const n = this.nums.length;
    let indices = Array.from({length: n}, (_, i) => i);
    const shuffleIndex = [];
    while (indices.length) {
        let i = randRange(indices.length);
        shuffleIndex.push(indices[i]);
        indices.splice(i, 1);
    }
    return shuffleIndex.map((i) => this.nums[i]);
};

const randRange = (n) => {
    return Math.floor(Math.random() * n);
}

/** 
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(nums)
 * var param_1 = obj.reset()
 * var param_2 = obj.shuffle()
 */
```

#### [382. 链表随机节点](https://leetcode.cn/problems/linked-list-random-node/description/)

给你一个单链表，随机选择链表的一个节点，并返回相应的节点值。每个节点 **被选中的概率一样** 。

实现 `Solution` 类：

* `Solution(ListNode head)` 使用整数数组初始化对象。
* `int getRandom()` 从链表中随机选择一个节点并返回该节点的值。链表中所有节点被选中的概率相等。

**示例：**

![](https://assets.leetcode.com/uploads/2021/03/16/getrand-linked-list.jpg)

```
输入
["Solution", "getRandom", "getRandom", "getRandom", "getRandom", "getRandom"]
[[[1, 2, 3]], [], [], [], [], []]
输出
[null, 1, 3, 2, 2, 3]

解释
Solution solution = new Solution([1, 2, 3]);
solution.getRandom(); // 返回 1
solution.getRandom(); // 返回 3
solution.getRandom(); // 返回 2
solution.getRandom(); // 返回 2
solution.getRandom(); // 返回 3
// getRandom() 方法应随机返回 1、2、3中的一个，每个元素被返回的概率相等。
```

**提示：**

* 链表中的节点数在范围 `[1, 104]` 内
* `-104 <= Node.val <= 104`
* 至多调用 `getRandom` 方法 `104` 次

**进阶：**

* 如果链表非常大且长度未知，该怎么处理？
* 你能否在不使用额外空间的情况下解决此问题？

##### 蓄水池算法

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 */
var Solution = function (head) {
    this.head = head;
};

/**
 * @return {number}
 */
Solution.prototype.getRandom = function () {
    let ans = 0;
    // i从1开始，抽一个样本
    // 从[0, i - 1]随机，如果随机数为0，则替换蓄水池中样本
    for (let i = 1, node = this.head; node; i++, node = node.next) {
        if (Math.floor(Math.random() * i) == 0) {
            ans = node.val;
        }
    }
    return ans;
};

/** 
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(head)
 * var param_1 = obj.getRandom()
 */
```

##### 预处理为数组，随机下标

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 */
var Solution = function(head) {
    this.nums = [];
    let node = head;
    while (node) {
        this.nums.push(node.val);
        node = node.next;
    }
    this.n = this.nums.length;
};

/**
 * @return {number}
 */
Solution.prototype.getRandom = function() {
    return this.nums[Math.floor(Math.random() * this.n)]
};

/** 
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(head)
 * var param_1 = obj.getRandom()
 */
```

#### [398. 随机数索引](https://leetcode.cn/problems/random-pick-index/description/)

给你一个可能含有 **重复元素** 的整数数组 `nums` ，请你随机输出给定的目标数字 `target` 的索引。你可以假设给定的数字一定存在于数组中。

实现 `Solution` 类：

* `Solution(int[] nums)` 用数组 `nums` 初始化对象。
* `int pick(int target)` 从 `nums` 中选出一个满足 `nums[i] == target` 的随机索引 `i` 。如果存在多个有效的索引，则每个索引的返回概率应当相等。

**示例：**

```
输入
["Solution", "pick", "pick", "pick"]
[[[1, 2, 3, 3, 3]], [3], [1], [3]]
输出
[null, 4, 0, 2]

解释
Solution solution = new Solution([1, 2, 3, 3, 3]);
solution.pick(3); // 随机返回索引 2, 3 或者 4 之一。每个索引的返回概率应该相等。
solution.pick(1); // 返回 0 。因为只有 nums[0] 等于 1 。
solution.pick(3); // 随机返回索引 2, 3 或者 4 之一。每个索引的返回概率应该相等。
```

**提示：**

* `1 <= nums.length <= 2 * 104`
* `-231 <= nums[i] <= 231 - 1`
* `target` 是 `nums` 中的一个整数
* 最多调用 `pick` 函数 `104` 次

##### 哈希表

```js
/**
 * @param {number[]} nums
 */
var Solution = function(nums) {
    this.idx = new Map();
    for (let i = 0; i < nums.length; i++) {
        const arr = this.idx.get(nums[i]) ?? [];
        arr.push(i);
        this.idx.set(nums[i], arr);
    }
};

/** 
 * @param {number} target
 * @return {number}
 */
Solution.prototype.pick = function(target) {
    const arr = this.idx.get(target);
    return arr[rand(arr.length)];
};

// 0 - n-1随机输出
const rand = (n) => {
    return Math.floor(Math.random() * n);
}

/** 
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(nums)
 * var param_1 = obj.pick(target)
 */
```

#### [1526. 形成目标数组的子数组最少增加次数](https://leetcode.cn/problems/minimum-number-of-increments-on-subarrays-to-form-a-target-array/description/)

给你一个整数数组 `target` 和一个数组 `initial` ，`initial` 数组与 `target`  数组有同样的大小，且一开始全部为 0 。

请你返回从 `initial` 得到  `target` 的最少操作次数，每次操作需遵循以下规则：

* 在 `initial` 中选择 **任意** 子数组，并将子数组中每个元素增加 1 。

答案保证在 32 位有符号整数以内。

**示例 1：**

```
输入：target = [1,2,3,2,1]
输出：3
解释：我们需要至少 3 次操作从 intial 数组得到 target 数组。
[0,0,0,0,0] 将下标为 0 到 4 的元素（包含二者）加 1 。
[1,1,1,1,1] 将下标为 1 到 3 的元素（包含二者）加 1 。
[1,2,2,2,1] 将下标为 2 的元素增加 1 。
[1,2,3,2,1] 得到了目标数组。
```

**示例 2：**

```
输入：target = [3,1,1,2]
输出：4
解释：(initial)[0,0,0,0] -> [1,1,1,1] -> [1,1,1,2] -> [2,1,1,2] -> [3,1,1,2] (target) 。
```

**示例 3：**

```
输入：target = [3,1,5,4,2]
输出：7
解释：(initial)[0,0,0,0,0] -> [1,1,1,1,1] -> [2,1,1,1,1] -> [3,1,1,1,1] 
                                  -> [3,1,2,2,2] -> [3,1,3,3,2] -> [3,1,4,4,2] -> [3,1,5,4,2] (target)。
```

**示例 4：**

```
输入：target = [1,1,1,1]
输出：1
```

**提示：**

* `1 <= target.length <= 10^5`
* `1 <= target[i] <= 10^5`

##### 差分数组

```js
/**
 * @param {number[]} target
 * @return {number}
 */
var minNumberOperations = function(target) {
    let ans = target[0];
    for (let i = 1; i < target.length; i++) {
        ans += Math.max(target[i] - target[i - 1], 0);
    }
    return ans;
};
```

