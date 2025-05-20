### 差分数组

#### 定义和性质

对于数组 a，定义其差分数组（difference array）为

       d[i]=a[0]       , i=0
       d[i]=a[i]−a[i−1], i≥1

 
**性质 1：** 从左到右累加 d 中的元素，可以得到数组 a。

**性质 2：** 如下两个操作是等价的。

    - 把 a 的子数组 a[i],a[i+1],…,a[j] 都加上 x。
    - 把 d[i] 增加 x，把 d[j+1] 减少 x。

利用性质 2，我们只需要 O(1) 的时间就可以完成对 a 的子数组的操作。最后利用性质 1 从差分数组复原出数组 a。

#### [3355. 零数组变换 I  模版](https://leetcode.cn/problems/zero-array-transformation-i/description/?envType=daily-question&envId=2025-05-20)

给定一个长度为 n 的整数数组 nums 和一个二维数组 queries，其中 queries[i] = [l<sub>i</sub>, r<sub>i</sub>]。

对于每个查询 queries[i]：

在 nums 的下标范围 [l<sub>i</sub>, r<sub>i</sub>] 内选择一个下标 子集。
将选中的每个下标对应的元素值减 1。
零数组 是指所有元素都等于 0 的数组。

如果在按顺序处理所有查询后，可以将 nums 转换为 零数组 ，则返回 true，否则返回 false。

```js
var isZeroArray = function(nums, queries) {
    const n = nums.length;
    const d = Array(n + 1).fill(0); // 创建差分数组（n+1长度防止越界）
    
    // 处理所有查询操作
    for (let [l, r] of queries) {
        d[l] += 1;       // 区间起点增加操作计数
        d[r+1] -= 1;     // 区间终点后一位减少操作计数
    }
    
    let num = 0; // 当前累积的操作次数
    for (let i = 0; i < n; i++) {
        num += d[i];     // 计算前缀和得到当前位置的总操作次数
        if (num < nums[i]) return false; // 操作次数不足以达成目标值
    }

    return true;
};
```