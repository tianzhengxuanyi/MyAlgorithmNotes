## 滑动窗口 -> 双端队列

### 1. 窗口滑动

有一个整型数组 arr 和一个大小为 w 的窗口从数组的最左边滑到最右边，窗口每次向右边滑一个位置。`(leetcode 239 题)`

例如，数组为[4,3,5,4,3,3,6,7]，窗口大小为 3 时:

```js
[4 3 5]4 3 3 6 7 // 窗口中最大值为5

4[3 5 4]3 3 6 7 // 窗口中最大值为5

4 3[5 4 3]3 6 7 // 窗口中最大值为5

4 3 5[4 3 3]6 7 // 窗口中最大值为4

4 3 5 4[3 3 6]7 // 窗口中最大值为6

4 3 5 4 3[3 6 7] // 窗口中最大值为7
```

如果数组长度为 n，窗口大小为 w，则一共产生 n-w+1 个窗口的最大值。请实现一个函数。

**输入:** 整型数组 arr，窗口大小为 w。

**输出:** 一个长度为 n-w+1 的数组 res，res[i]表示每一种窗口状态下的

以本题为例，结果应该返回{5,5,5,4,6,7}。

**思路：**

1. 借助双端队列（queueMax）存储 arr 下标，**需严格保证单调性**（从大到小，以下标对应的值组织）；
2. 窗口右边界 R 移动时，queueMax 从队尾向队头依次与新纳入窗口下标 i 的值比较，如果`i`对应的值大，则弹出对应 queueMax 中位置，直到将`i`放置到合适位置，严格保证单调递减；
3. 窗口左边界 L 移动时，L 所对应的下标`j`为移出窗口的下标，比较 queueMax 队头位置是否为`j`，如果是则弹出队头，否则不做任何操作；
4. 当形成窗口时，queueMax 队头位置为窗口内最大值的下标；

每个位置的数最多进队列一次，出队列一次，所以总代价 O(N)，平均单次代价 O(1)

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function (nums, k) {
    if (nums == null || k < 1 || nums.length < k) {
        return null;
    }
    let res = [],
        queueMax = [];
    for (let i = 0; i < nums.length; i++) {
        while (
            queueMax.length !== 0 &&
            nums[queueMax[queueMax.length - 1]] <= nums[i]
        ) {
            queueMax.pop();
        }
        queueMax.push(i);
        if (queueMax[0] === i - k) {
            queueMax.shift();
        }
        if (i + 1 >= k) {
            res.push(nums[queueMax[0]]);
        }
    }
    return res;
};
```

### 2. 边界滑动

窗口只能右边界或左边界向右滑的情况下，维持窗口内部最大值或者最小值快速更新的结构。

窗口内最大值与最小值更新结构的原理与实现。

**思路：** 与 1 一致，只是具体 code 不一样。