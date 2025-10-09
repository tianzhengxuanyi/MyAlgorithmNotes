### 2025-10-08

#### [327. 区间和的个数](https://leetcode.cn/problems/count-of-range-sum/description/)

给你一个整数数组 `nums` 以及两个整数 `lower` 和 `upper` 。求数组中，值位于范围 `[lower, upper]` （包含 `lower` 和 `upper`）之内的 **区间和的个数** 。

**区间和** `S(i, j)` 表示在 `nums` 中，位置从 `i` 到 `j` 的元素之和，包含 `i` 和 `j` (`i` ≤ `j`)。

**示例 1：**

```
输入：nums = [-2,5,-1], lower = -2, upper = 2
输出：3
解释：存在三个区间：[0,0]、[2,2] 和 [0,2] ，对应的区间和分别是：-2 、-1 、2 。
```

**示例 2：**

```
输入：nums = [0], lower = 0, upper = 0
输出：1
```

**提示：**

* `1 <= nums.length <= 105`
* `-231 <= nums[i] <= 231 - 1`
* `-105 <= lower <= upper <= 105`
* 题目数据保证答案是一个 **32 位** 的整数

##### 前缀和 + 树状数组

```js
/**
 * 计算数组中满足特定区间和条件的子数组数量
 * 问题描述：统计数组中所有满足 lower ≤ 区间和 ≤ upper 的子数组数量
 * 
 * @param {number[]} nums - 输入整数数组
 * @param {number} lower - 区间和的下界
 * @param {number} upper - 区间和的上界
 * @return {number} - 满足条件的子数组数量
 * 
 * 算法思路：使用前缀和 + 离散化 + Fenwick Tree（树状数组）
 * 时间复杂度：O(n log n)
 * 空间复杂度：O(n)
 */
var countRangeSum = function (nums, lower, upper) {
    const n = nums.length;
    // 计算前缀和数组
    const prefix = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        // 处理 i=0 时 prefix[-1] 为 undefined 的情况
        prefix[i] = (prefix[i - 1] ?? 0) + nums[i];
    };
    
    // 对索引进行排序，排序依据是对应的前缀和值
    // 这一步实现了前缀和的离散化处理
    const sorted = Array.from({ length: n }, (_, i) => i).sort((a, b) => {
        return prefix[a] - prefix[b];
    })
    
    // 初始化 Fenwick Tree（树状数组）用于高效范围查询和更新
    const fenwick = new Fenwick(n);
    let ans = 0;
    
    // 遍历每个前缀和，寻找满足条件的区间
    for (let i = 0; i < n; i++) {
        let x = prefix[i]; // 当前前缀和
        
        // 二分查找找到第一个大于等于 x 的前缀和的位置
        let sortedIdx = lowerBound(0, n - 1, (m) => {
            return prefix[sorted[m]] < x;
        })
        
        // 查找满足 y >= x - upper 的最小位置
        // x - y <= upper 等价于 y >= x - upper
        let upperIdx = lowerBound(0, n - 1, (m) => {
            return prefix[sorted[m]] < x - upper;
        })
        
        // 查找满足 y <= x - lower 的最大位置
        // x - y >= lower 等价于 y <= x - lower
        // 通过查找 x - lower + 1 的下界然后减1实现
        let lowerIdx = lowerBound(0, n -1, (m) => {
            return prefix[sorted[m]] < x - lower + 1;
        }) - 1;
        
        // 检查当前前缀和自身是否满足条件（即从数组开头到当前位置的子数组）
        if (prefix[i] <= upper && prefix[i] >= lower) {
            ans += 1;
        }
        
        // 使用 Fenwick Tree 查询在 [upperIdx, lowerIdx] 范围内的元素数量
        // 这些元素对应满足条件的前缀和数量
        ans += fenwick.rangeSum(upperIdx, lowerIdx);
        
        // 更新 Fenwick Tree，将当前前缀和的索引位置加1
        fenwick.update(sortedIdx, 1);
    }
    
    return ans;
};

/**
 * 二分查找下界函数
 * 找到第一个不满足 check 条件的位置
 * 
 * @param {number} l - 查找区间的左边界
 * @param {number} r - 查找区间的右边界
 * @param {function} check - 判断条件函数，参数为中间位置索引
 * @return {number} - 找到的位置索引
 */
function lowerBound(l, r, check) {
    while (l <= r) {
        let m = Math.floor((r - l) / 2) + l; // 防止整数溢出的中间位置计算
        if (check(m)) {
            l = m + 1; // 中间位置满足条件，向右查找
        } else {
            r = m - 1; // 中间位置不满足条件，向左查找
        }
    }
    return l; // 返回第一个不满足条件的位置
}

/**
 * Fenwick Tree（树状数组）类
 * 用于高效地进行前缀和查询和单点更新操作
 */
class Fenwick {
    /**
     * 初始化 Fenwick Tree
     * @param {number} n - 数组大小
     */
    constructor(n) {
        this.tree = Array(n + 1).fill(0); // 树状数组大小为 n+1，索引从1开始
    }

    /**
     * 更新树状数组中的某个位置的值
     * @param {number} index - 要更新的索引（从0开始）
     * @param {number} val - 要增加的值
     */
    update(index, val) {
        // 树状数组的索引从1开始，所以+1
        for (let i = index + 1; i < this.tree.length; i += (i & (-i))) {
            this.tree[i] += val;
        }
    }

    /**
     * 计算从1到i的前缀和
     * @param {number} i - 结束索引
     * @return {number} - 前缀和结果
     */
    preSum(i) {
        let s = 0;
        for (; i > 0; i &= i - 1) { // 逐步减去最低位的1
            s += this.tree[i];
        }
        return s;
    }

    /**
     * 计算区间 [l, r] 的和
     * @param {number} l - 区间左边界（从0开始）
     * @param {number} r - 区间右边界（从0开始）
     * @return {number} - 区间和结果
     */
    rangeSum(l, r) {
        // 利用前缀和的性质计算区间和：sum[l..r] = sum[1..r+1] - sum[1..l]
        return this.preSum(r + 1) - this.preSum(l);
    }
}

```

#### [493. 翻转对](https://leetcode.cn/problems/reverse-pairs/description/)

给定一个数组 `nums` ，如果 `i < j` 且 `nums[i] > 2*nums[j]` 我们就将 `(i, j)` 称作一个***重要翻转对***。

你需要返回给定数组中的重要翻转对的数量。

**示例 1:**

```
输入: [1,3,2,3,1]
输出: 2
```

**示例 2:**

```
输入: [2,4,3,5,1]
输出: 3
```

**注意:**

1. 给定数组的长度不会超过`50000`。
2. 输入数组中的所有数字都在32位整数的表示范围内。

##### 树状数组 + 离散化

```js
/**
 * 计算数组中的翻转对数量
 * @param {number[]} nums - 输入数组
 * @return {number} 满足条件的翻转对数量
 * @note 翻转对定义为满足 i < j 且 nums[i] > 2*nums[j] 的元素对
 * @algorithm 树状数组（Fenwick Tree）+ 二分查找
 * @complexity 时间复杂度：O(n log n)，空间复杂度：O(n)
 */
var reversePairs = function (nums) {
    const n = nums.length;
    
    // 生成数组索引并按对应元素值从小到大排序
    // 这一步实现了数据的离散化，便于后续在树状数组中进行操作
    const sorted = Array.from({ length: n }, (_, i) => i).sort((a, b) => {
        return nums[a] - nums[b];
    });
    
    // 创建树状数组，用于高效地进行前缀和查询和单点更新
    const fenwick = new Fenwick(n);
    
    let ans = 0; // 存储翻转对的总数
    
    // 从右向左遍历原数组
    // 这样可以保证在处理当前元素时，右侧的所有元素已经被处理并记录在树状数组中
    for (let i = n - 1; i >= 0; i--) {
        // 查找当前元素在排序索引中的位置，用于树状数组的更新
        let pos1 = lowerBound(0, n - 1, (m) => {
            return nums[sorted[m]] < nums[i];
        });
        
        // 查找满足 nums[j] < nums[i]/2 的元素在排序索引中的位置
        // 这是翻转对条件的关键部分
        let pos2 = lowerBound(0, n - 1, (m) => {
            return nums[sorted[m]] < (nums[i] / 2);
        });
        
        // 如果存在满足条件的元素，累加其数量到结果中
        // fenwick.preSum(pos2) 计算当前已处理元素中满足 nums[j] < nums[i]/2 的元素个数
        ans += pos2 < 0 ? 0 : fenwick.preSum(pos2);
        
        // 在树状数组中更新当前元素的位置计数
        fenwick.update(pos1, 1);
    }

    return ans;
};

/**
 * 二分查找实现，寻找满足条件的最右边界
 * @param {number} l - 查找区间左边界
 * @param {number} r - 查找区间右边界
 * @param {function} check - 判断函数，返回true表示需要继续向右查找
 * @return {number} 满足条件的最右边界的下一个位置
 */
function lowerBound(l, r, check) {
    while (l <= r) {
        // 计算中间位置（避免整数溢出的写法）
        let m = Math.floor((r - l) / 2) + l;
        if (check(m)) {
            // 如果中间位置满足条件，向右查找更优解
            l = m + 1;
        } else {
            // 否则向左查找
            r = m - 1;
        }
    }
    // 返回满足条件的最右边界的下一个位置
    return l;
}

/**
 * 树状数组（Fenwick Tree/Binary Indexed Tree）类
 * 用于高效地进行前缀和查询和单点更新操作
 */
class Fenwick {
    /**
     * 初始化树状数组
     * @param {number} n - 数组大小
     */
    constructor(n) {
        // 树状数组大小为n+1，索引从1开始
        this.tree = Array(n + 1).fill(0);
    }

    /**
     * 更新指定索引位置的值
     * @param {number} index - 要更新的索引（0-based）
     * @param {number} val - 要增加的值
     */
    update(index, val) {
        // 树状数组索引从1开始，所以+1
        for (let i = index + 1; i < this.tree.length; i += (i & (-i))) {
            this.tree[i] += val;
        }
    }

    /**
     * 计算前缀和（从1到i的累加和）
     * @param {number} i - 前缀和的结束位置（1-based）
     * @return {number} 前缀和结果
     */
    preSum(i) {
        let s = 0;
        // 利用树状数组的性质累加各个区间的值
        for (; i > 0; i &= (i - 1)) {
            s += this.tree[i];
        }
        return s;
    }
}

```

#### [315. 计算右侧小于当前元素的个数](https://leetcode.cn/problems/count-of-smaller-numbers-after-self/description/)

给你一个整数数组 `nums`，按要求返回一个新数组 `counts`。数组 `counts` 有该性质： `counts[i]` 的值是  `nums[i]` 右侧小于 `nums[i]` 的元素的数量。

**示例 1：**

```
输入：nums = [5,2,6,1]
输出：[2,1,1,0] 
解释：
5 的右侧有 2 个更小的元素 (2 和 1)
2 的右侧仅有 1 个更小的元素 (1)
6 的右侧有 1 个更小的元素 (1)
1 的右侧有 0 个更小的元素
```

**示例 2：**

```
输入：nums = [-1]
输出：[0]
```

**示例 3：**

```
输入：nums = [-1,-1]
输出：[0,0]
```

**提示：**

* `1 <= nums.length <= 105`
* `-104 <= nums[i] <= 104`

##### 树状数组 + 离散化

```js
/**
 * 计算数组中每个元素右侧小于当前元素的元素个数
 * @param {number[]} nums - 输入数组
 * @return {number[]} 结果数组，其中result[i]表示nums[i]右侧小于nums[i]的元素个数
 * @algorithm 树状数组（Fenwick Tree）+ 二分查找
 * @complexity 时间复杂度：O(n log n)，空间复杂度：O(n)
 */
var countSmaller = function(nums) {
    const n = nums.length;
    
    // 生成数组索引并按对应元素值从小到大排序
    // 这一步实现了数据的离散化，将原始数值映射到排序后的位置
    const sorted = Array.from({length: n}, (_, i) => i).sort((a, b) => nums[a] - nums[b]);
    
    // 创建结果数组，初始值都为0
    const ans = Array(n).fill(0);
    
    // 初始化树状数组，用于高效地进行前缀和查询和单点更新
    const fenwick = new Fenwick(n);
    
    // 从右向左遍历原数组，这样可以保证在处理当前元素时，右侧的元素已经被处理并记录在树状数组中
    for (let i = n - 1; i >= 0; i--) {
        // 使用二分查找找到在排序索引中第一个值小于当前元素的位置
        // 这一步确定了当前元素在离散化后的值域中的位置
        let pos = lowerBound(0, n - 1, (m) => {
            return nums[sorted[m]] < nums[i];
        });
        
        // 在树状数组中更新该位置的计数，记录当前元素的出现
        fenwick.update(pos, 1);
        
        // 计算前缀和，即当前位置之前（值更小）的元素个数
        // 由于我们是从右向左遍历，这里得到的就是当前元素右侧比它小的元素个数
        ans[i] = fenwick.preSum(pos);
    }

    return ans;
};

/**
 * 二分查找实现，寻找满足条件的最右边界
 * @param {number} l - 查找区间左边界
 * @param {number} r - 查找区间右边界
 * @param {function} check - 判断函数，返回true表示需要继续向右查找
 * @return {number} 满足条件的最右边界的下一个位置
 */
function lowerBound(l, r, check) {
    while (l <= r) {
        // 计算中间位置（避免整数溢出的写法）
        let m = Math.floor((r - l) / 2) + l;
        if (check(m)) {
            // 如果中间位置满足条件，向右查找更优解
            l = m + 1;
        } else {
            // 否则向左查找
            r = m - 1;
        }
    }
    // 返回满足条件的最右边界的下一个位置
    return l;
}

/**
 * 树状数组（Fenwick Tree/Binary Indexed Tree）类
 * 用于高效地进行前缀和查询和单点更新操作
 */
class Fenwick {
    /**
     * 初始化树状数组
     * @param {number} n - 数组大小
     */
    constructor(n) {
        // 树状数组大小为n+1，索引从1开始
        this.tree = Array(n + 1).fill(0);
    }

    /**
     * 更新指定索引位置的值
     * @param {number} index - 要更新的索引（0-based）
     * @param {number} val - 要增加的值
     */
    update(index, val) {
        // 树状数组索引从1开始，所以+1
        for (let i = index + 1; i < this.tree.length; i += (i & (-i))) {
            this.tree[i] += val;
        }
    }

    /**
     * 计算前缀和（从1到i的累加和）
     * @param {number} i - 前缀和的结束位置（1-based）
     * @return {number} 前缀和结果
     */
    preSum(i) {
        let s = 0;
        // 利用树状数组的性质累加各个区间的值
        for (; i > 0; i &= (i - 1)) {
            s += this.tree[i];
        }
        return s;
    }
}

```

#### [LCR 170. 交易逆序对的总数](https://leetcode.cn/problems/shu-zu-zhong-de-ni-xu-dui-lcof/description/)

在股票交易中，如果前一天的股价高于后一天的股价，则可以认为存在一个「交易逆序对」。请设计一个程序，输入一段时间内的股票交易记录 `record`，返回其中存在的「交易逆序对」总数。

**示例 1：**

```
输入：record = [9, 7, 5, 4, 6]
输出：8
解释：交易中的逆序对为 (9, 7), (9, 5), (9, 4), (9, 6), (7, 5), (7, 4), (7, 6), (5, 4)。
```

**提示：**

`0 <= record.length <= 50000`

##### 树状数组 + 离散化

```js
/**
 * 计算数组中的逆序对数量
 * @param {number[]} record - 输入数组
 * @return {number} 逆序对的数量
 * @note 逆序对定义为满足 i < j 且 record[i] > record[j] 的元素对
 */
var reversePairs = function (record) {
    const n = record.length;
    // 生成数组索引并按对应元素值从小到大排序
    // 这样可以将原问题转换为排序后的索引上的操作
    const sorted = Array.from({ length: n }, (_, i) => i).sort((a, b) => record[a] - record[b]);
    // 创建树状数组，用于高效计算前缀和和更新操作
    const fenwick = new Fenwick(n);
    let ans = 0; // 存储逆序对数量
    
    // 从右向左遍历原数组
    for (let i = n - 1; i >= 0; i--) {
        // 使用二分查找找到在排序索引中第一个值小于当前元素的位置
        let pos = lowerBound(0, n - 1, (m) => {
            return record[sorted[m]] < record[i];
        });
        
        // 在树状数组中更新该位置的计数
        fenwick.update(pos, 1);
        // 累加前缀和，即当前元素能形成的逆序对数量
        ans += fenwick.preSum(pos);
    }
    
    return ans;
};

/**
 * 二分查找实现，寻找第一个不满足条件的位置
 * @param {number} l - 查找区间左边界
 * @param {number} r - 查找区间右边界
 * @param {function} check - 判断函数，返回true表示需要继续向右查找
 * @return {number} 第一个不满足条件的位置索引
 */
function lowerBound(l, r, check) {
    while (l <= r) {
        // 计算中间位置（避免整数溢出的写法）
        let m = Math.floor((r - l) / 2) + l;
        if (check(m)) {
            // 如果满足条件，向右查找
            l = m + 1;
        } else {
            // 否则向左查找
            r = m - 1;
        }
    }
    // 返回第一个不满足条件的位置
    return l;
}

/**
 * 树状数组（Fenwick Tree/Binary Indexed Tree）类
 * 用于高效地进行前缀和查询和单点更新操作
 */
class Fenwick {
    /**
     * 初始化树状数组
     * @param {number} n - 数组大小
     */
    constructor(n) {
        // 树状数组大小为n+1，索引从1开始
        this.tree = Array(n + 1).fill(0);
    }

    /**
     * 更新指定索引位置的值
     * @param {number} index - 要更新的索引（0-based）
     * @param {number} v - 要增加的值
     */
    update(index, v) {
        // 树状数组索引从1开始，所以+1
        for (let i = index + 1; i < this.tree.length; i += (i & (-i))) {
            this.tree[i] += v;
        }
    }

    /**
     * 计算前缀和（从1到i的累加和）
     * @param {number} i - 前缀和的结束位置（1-based）
     * @return {number} 前缀和结果
     */
    preSum(i) {
        let s = 0;
        // 利用树状数组的性质累加各个区间的值
        for (; i > 0; i &= i - 1) {
            s += this.tree[i];
        }
        return s;
    }

    /**
     * 计算区间和（从l到r的累加和）
     * @param {number} l - 区间左边界（0-based）
     * @param {number} r - 区间右边界（0-based）
     * @return {number} 区间和结果
     * @note 此方法在当前问题中未被使用，但作为树状数组的标准功能保留
     */
    rangeSum(l, r) {
        return this.preSum(r + 1) - this.preSum(l);
    }
}

```

##### 归并排序

```js
/**
 * 计算数组中的逆序对数量（归并排序实现）
 * @param {number[]} record - 输入数组
 * @return {number} 逆序对的数量
 * @note 逆序对定义为满足 i < j 且 record[i] > record[j] 的元素对
 * @algorithm 归并排序（分治）
 * @complexity 时间复杂度：O(n log n)，空间复杂度：O(n)
 */
var reversePairs = function (record) {
    const n = record.length;
    
    /**
     * 递归分治函数，将数组划分为更小的子数组并计算逆序对
     * @param {number[]} arr - 当前处理的数组
     * @param {number} l - 当前子数组的左边界
     * @param {number} r - 当前子数组的右边界
     * @return {number} 当前子数组中的逆序对数量
     */
    const dfs = (arr, l, r) => {
        // 基本情况：当子数组长度小于等于1时，没有逆序对
        if (l >= r) return 0;
        
        // 计算中间点，避免整数溢出的写法
        let mid = Math.floor((r - l) / 2) + l;
        
        // 递归计算左子数组和右子数组中的逆序对数量
        // 然后加上合并过程中发现的跨左右子数组的逆序对数量
        return dfs(arr, l, mid) + dfs(arr, mid + 1, r) + merge(arr, l, mid, r);
    }

    /**
     * 合并两个已排序的子数组，并统计跨左右子数组的逆序对
     * @param {number[]} arr - 原数组
     * @param {number} l - 左子数组的起始索引
     * @param {number} m - 左子数组的结束索引（右子数组起始索引为m+1）
     * @param {number} r - 右子数组的结束索引
     * @return {number} 合并过程中统计的逆序对数量
     */
    const merge = (arr, l, m, r) => {
        // 创建辅助数组，用于合并过程
        const help = Array(r - l + 1);
        let res = 0; // 存储当前合并阶段统计的逆序对数量
        let left = l, right = m + 1, i = 0; // left指向左子数组当前位置，right指向右子数组当前位置
        
        // 当左右子数组都有元素未处理时
        while (left <= m && right <= r) {
            // 核心逻辑：统计逆序对
            // 如果左子数组当前元素大于右子数组当前元素，说明左子数组从left到m的所有元素都与right位置元素构成逆序对
            res += arr[left] > arr[right] ? (m - left) + 1 : 0;
            
            // 合并操作：将较小的元素放入辅助数组
            help[i++] = arr[left] > arr[right] ? arr[right++] : arr[left++];
        }
        
        // 处理左子数组剩余的元素
        while (left <= m) {
            help[i++] = arr[left++];
        }
        
        // 处理右子数组剩余的元素
        while (right <= r) {
            help[i++] = arr[right++];
        }
        
        // 将辅助数组中的排序结果复制回原数组
        for (let i = 0; i < help.length; i++) {
            arr[l + i] = help[i];
        }
        
        return res; // 返回当前合并阶段统计的逆序对数量
    }

    // 调用递归函数，从整个数组的边界开始
    return dfs(record, 0, n - 1);
};

```

#### [2300. 咒语和药水的成功对数](https://leetcode.cn/problems/successful-pairs-of-spells-and-potions/description/)

给你两个正整数数组 `spells` 和 `potions` ，长度分别为 `n` 和 `m` ，其中 `spells[i]` 表示第 `i` 个咒语的能量强度，`potions[j]` 表示第 `j` 瓶药水的能量强度。

同时给你一个整数 `success` 。一个咒语和药水的能量强度 **相乘** 如果 **大于等于** `success` ，那么它们视为一对 **成功** 的组合。

请你返回一个长度为 `n` 的整数数组`pairs`，其中`pairs[i]` 是能跟第 `i` 个咒语成功组合的 **药水** 数目。

**示例 1：**

```
输入：spells = [5,1,3], potions = [1,2,3,4,5], success = 7
输出：[4,0,3]
解释：
- 第 0 个咒语：5 * [1,2,3,4,5] = [5,10,15,20,25] 。总共 4 个成功组合。
- 第 1 个咒语：1 * [1,2,3,4,5] = [1,2,3,4,5] 。总共 0 个成功组合。
- 第 2 个咒语：3 * [1,2,3,4,5] = [3,6,9,12,15] 。总共 3 个成功组合。
所以返回 [4,0,3] 。
```

**示例 2：**

```
输入：spells = [3,1,2], potions = [8,5,8], success = 16
输出：[2,0,2]
解释：
- 第 0 个咒语：3 * [8,5,8] = [24,15,24] 。总共 2 个成功组合。
- 第 1 个咒语：1 * [8,5,8] = [8,5,8] 。总共 0 个成功组合。
- 第 2 个咒语：2 * [8,5,8] = [16,10,16] 。总共 2 个成功组合。
所以返回 [2,0,2] 。
```

**提示：**

* `n == spells.length`
* `m == potions.length`
* `1 <= n, m <= 105`
* `1 <= spells[i], potions[i] <= 105`
* `1 <= success <= 1010`

##### 计数 + 值域后缀和

```js
/**
 * 计算每个咒语能够成功配对的药水数量
 * 问题描述：给定咒语数组和药水数组，找出每个咒语与多少种药水结合后效果值大于等于success
 * 
 * @param {number[]} spells - 咒语数组，每个元素表示咒语的强度
 * @param {number[]} potions - 药水数组，每个元素表示药水的强度
 * @param {number} success - 成功阈值，咒语与药水的乘积必须大于等于此值
 * @return {number[]} - 结果数组，ans[i]表示第i个咒语能够成功配对的药水数量
 * 
 * 算法思路：计数排序 + 后缀和预处理
 * 时间复杂度：O(m + k + n)，其中m是药水数量，k是药水强度的最大值，n是咒语数量
 * 空间复杂度：O(k)，用于存储计数数组
 * 注意：该方法适用于药水强度值范围不是特别大的情况
 */
var successfulPairs = function(spells, potions, success) {
    // 找出药水数组中的最大强度值
    const mx = Math.max(...potions);
    
    // 创建计数数组，大小为最大值+2，用于统计每个强度的药水数量
    // +2 是为了处理边界情况，确保后缀和计算时不会越界
    const cnt = Array(mx + 2).fill(0);
    
    // 统计每个强度的药水出现次数
    for (let p of potions) {
        cnt[p]++;
    }
    
    // 计算后缀和：cnt[i]表示强度大于等于i的药水数量
    // 从最大值开始向前遍历，累加后续位置的值
    for (let i = mx; i >= 0; i--) {
        cnt[i] += cnt[i + 1]; // 后缀和
    }

    // 遍历每个咒语，计算其成功配对的药水数量
    for (let i = 0; i < spells.length; i++) {
        // 计算当前咒语所需的最小药水强度
        // 由于乘积需要>=success，所以药水强度至少为success/spells[i]向上取整
        let p = Math.ceil(success / spells[i]);
        
        // 如果所需最小强度超过药水的最大强度，则没有匹配的药水
        // 否则使用预处理好的后缀和数组直接获取结果
        spells[i] = p > mx ? 0 : cnt[p];
    }

    return spells;
};

```

##### 排序 +  二分 [ 用时: 6 m 8 s ]

```js
/**
 * 计算每个咒语能够成功配对的药水数量
 * 问题描述：给定咒语数组和药水数组，找出每个咒语与多少种药水结合后效果值大于等于success
 * 
 * @param {number[]} spells - 咒语数组，每个元素表示咒语的强度
 * @param {number[]} potions - 药水数组，每个元素表示药水的强度
 * @param {number} success - 成功阈值，咒语与药水的乘积必须大于等于此值
 * @return {number[]} - 结果数组，ans[i]表示第i个咒语能够成功配对的药水数量
 * 
 * 算法思路：排序 + 二分查找
 * 时间复杂度：O(m log m + n log m)，其中m是药水数量，n是咒语数量
 * 空间复杂度：O(n)，用于存储结果数组
 */
var successfulPairs = function(spells, potions, success) {
    const n = spells.length, m = potions.length;
    // 创建结果数组，长度与咒语数组相同
    const ans = Array(n);
    
    // 对药水数组进行升序排序，为后续二分查找做准备
    potions.sort((a, b) => a - b);

    /**
     * 二分查找函数，找出给定咒语能够配对的最小药水索引
     * @param {number} spell - 当前咒语的强度
     * @return {number} - 满足条件的最小药水索引
     */
    const lowerBound = (spell) => {
        let l = 0, r = m - 1;
        while (l <= r) {
            // 计算中间位置，防止整数溢出
            let mid = Math.floor((r - l) / 2) + l;
            // 检查当前药水与咒语的乘积是否小于成功阈值
            if (spell * potions[mid] < success) {
                // 乘积小于阈值，需要寻找更强的药水，右移左边界
                l = mid + 1;
            } else {
                // 乘积大于等于阈值，继续向左寻找更小的符合条件的索引
                r = mid - 1;
            }
        }
        // 返回第一个满足条件的药水索引
        return l;
    }

    // 遍历每个咒语，计算其成功配对的药水数量
    for (let i = 0; i < n; i++) {
        // 成功配对的药水数量 = 总药水数 - 第一个满足条件的药水索引
        ans[i] = m - lowerBound(spells[i]);
    }

    return ans;
};

```

