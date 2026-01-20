### 2026-01-10

#### [673. 最长递增子序列的个数](https://leetcode.cn/problems/number-of-longest-increasing-subsequence/description/)

给定一个未排序的整数数组 `nums` ， *返回最长递增子序列的个数* 。

**注意** 这个数列必须是 **严格** 递增的。

**示例 1:**

```
输入: [1,3,5,4,7]
输出: 2
解释: 有两个最长递增子序列，分别是 [1, 3, 4, 7] 和[1, 3, 5, 7]。
```

**示例 2:**

```
输入: [2,2,2,2,2]
输出: 5
解释: 最长递增子序列的长度是1，并且存在5个子序列的长度为1，因此输出5。
```

**提示:**

* `1 <= nums.length <= 2000`
* `-106 <= nums[i] <= 106`

##### 树状数组

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findNumberOfLIS = function (nums) {
    // 获取数组长度
    const n = nums.length;
    // 步骤1：离散化处理 - 将原数组元素映射为连续的排名（从0开始）
    // 1.1 去重：[...new Set(nums)] 得到nums中不重复的元素
    // 1.2 排序：sort((a, b) => a - b) 对不重复元素进行升序排序
    // 1.3 映射：map((x, rk) => [x, rk]) 将每个元素与它的索引（排名）绑定
    // 1.4 转Map：valToRank 用于快速查询任意元素对应的离散化排名
    const valToRank = new Map([...new Set(nums)].sort((a, b) => a - b).map((x, rk) => [x, rk]));
    
    // 步骤2：初始化树状数组，大小为原数组长度n（离散化后最大排名不超过n-1）
    const fenwick = new Fenwick(n);
    
    // 步骤3：遍历原数组中的每个元素，依次进行查询和更新树状数组
    for (let x of nums) {
        // 3.1 获取当前元素x对应的离散化排名
        let rk = valToRank.get(x);
        
        // 3.2 查询树状数组中「所有小于x的元素」对应的最优解（[最长长度, 对应个数]）
        // 因为排名从0开始，rk-1 对应所有排名小于rk的元素（即数值小于x的元素）
        let [len, cnt] = fenwick.query(rk - 1);
        
        // 3.3 计算以当前元素x结尾的递增子序列的长度和个数
        let newLen, newCnt;
        if (len == 0) {
            // 情况1：没有比x小的元素，x自身构成长度为1的子序列，个数为1
            newLen = 1, newCnt = 1;
        } else {
            // 情况2：存在比x小的元素，当前长度 = 前置最长长度 + 1，个数 = 前置最长长度对应的总个数
            newLen = len + 1, newCnt = cnt;
        }
        
        // 3.4 将当前元素x对应的[newLen, newCnt]更新到树状数组的对应排名位置
        fenwick.update(rk, [newLen, newCnt]);
    }
    
    // 步骤4：查询整个树状数组的最优解，返回最长递增子序列的总个数
    // n-1 是离散化后的最大排名，query(n-1) 会返回全局最优解[全局最长长度, 对应总个数]
    return fenwick.query(n - 1)[1];
};

/**
 * 树状数组（Fenwick Tree）类定义
 * 每个节点存储二元组 [maxLen, count]：
 * - maxLen：该节点对应区间内的最长递增子序列长度
 * - count：该节点对应区间内，达到maxLen长度的子序列总个数
 */
class Fenwick {
    /**
     * 初始化树状数组
     * @param {number} n - 树状数组的大小（对应离散化后的最大排名+1）
     */
    constructor(n) {
        // 树状数组下标从1开始，因此创建长度为n+1的数组
        // 每个元素初始化为 [0, 0]，表示初始状态下（无元素），长度为0，个数为0
        this.tree = Array(n + 1).fill(0).map(() => [0, 0]);
    }

    /**
     * 辅助方法：合并两个二元组，返回更优的结果（核心辅助方法）
     * 「更优」定义：优先保留更长的子序列长度；长度相同时，累加对应个数
     * @param {Array} a - 二元组 [lenA, cntA]
     * @param {Array} b - 二元组 [lenB, cntB]
     * @returns {Array} 合并后的最优二元组
     */
    merge(a, b) {
        // 解构两个二元组的长度和个数
        const [aLen, aCnt] = a;
        const [bLen, bCnt] = b;
        
        // 情况1：a的长度更长，返回a
        if (aLen > bLen) return [aLen, aCnt];
        // 情况2：b的长度更长，返回b
        if (bLen > aLen) return [bLen, bCnt];
        // 情况3：两者长度相等，返回相同长度 + 个数累加
        return [aLen, aCnt + bCnt];
    }

    /**
     * 树状数组更新操作：将指定排名对应的二元组更新为val（合并更新，保留最优解）
     * @param {number} index - 元素的离散化排名（从0开始）
     * @param {Array} val - 待更新的二元组 [newLen, newCnt]
     */
    update(index, val) {
        // 树状数组下标从1开始，因此将排名index（0开始）转换为树状数组下标i = index + 1
        for (let i = index + 1; i < this.tree.length; i += (i & (-i))) {
            // 合并当前节点的二元组和待更新的val，保留最优解
            this.tree[i] = this.merge(this.tree[i], val);
        }
    }

    /**
     * 树状数组查询操作：查询[0, index]区间内的最优二元组（最长长度 + 对应总个数）
     * @param {number} index - 元素的离散化排名（从0开始），查询区间为[0, index]
     * @returns {Array} 区间最优二元组 [maxLen, totalCnt]
     */
    query(index) {
        // 初始化查询结果为 [0, 0]（无有效元素时的默认值）
        let res = [0, 0];
        // 边界处理：若index < 0，说明没有比当前元素小的元素，直接返回默认值[0, 0]
        if (index < 0) return res;
        
        // 树状数组下标从1开始，转换为树状数组下标i = index + 1
        // 循环逻辑：通过低位消去（i &= (i - 1) 等价于 i -= i & -i）遍历相关节点
        for (let i = index + 1; i > 0; i &= (i - 1)) {
            // 合并当前节点的二元组到查询结果中，逐步更新最优解
            res = this.merge(res, this.tree[i]);
        }
        
        // 返回最终的区间最优解
        return res;
    }
}
```

#### [334. 递增的三元子序列](https://leetcode.cn/problems/increasing-triplet-subsequence/description/)

给你一个整数数组 `nums` ，判断这个数组中是否存在长度为 `3` 的递增子序列。

如果存在这样的三元组下标 `(i, j, k)` 且满足 `i < j < k` ，使得 `nums[i] < nums[j] < nums[k]` ，返回 `true` ；否则，返回 `false` 。

**示例 1：**

```
输入：nums = [1,2,3,4,5]
输出：true
解释：任何 i < j < k 的三元组都满足题意
```

**示例 2：**

```
输入：nums = [5,4,3,2,1]
输出：false
解释：不存在满足题意的三元组
```

**示例 3：**

```
输入：nums = [2,1,5,0,4,6]
输出：true
解释：其中一个满足题意的三元组是 (1, 4, 5)，因为 nums[1] == 1 < nums[4] == 4 < nums[5] == 6
```

**提示：**

* `1 <= nums.length <= 5 * 105`
* `-231 <= nums[i] <= 231 - 1`

**进阶：**你能实现时间复杂度为 `O(n)` ，空间复杂度为 `O(1)` 的解决方案吗？

##### 两次遍历维护左侧最小和右侧最大

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var increasingTriplet = function(nums) {
    const n = nums.length;
    const leftMin = Array(n).fill(Infinity);
    let mn = nums[0];
    for (let i = 1; i < n; i++) {
        leftMin[i] = mn;
        mn = Math.min(mn, nums[i]);
    }
    let mx = nums[n - 1];
    for (let i = n - 2; i >= 1; i--) {
        if (nums[i] > leftMin[i] && mx > nums[i]) return true;
        mx = Math.max(mx, nums[i]);
    }
    return false;
};
```

##### 最长递增子序列

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var increasingTriplet = function(nums) {
    const n = nums.length;
    const LIS = [nums[0]];
    for (let i = 1; i < n; i++) {
        if (nums[i] > LIS[LIS.length - 1]) {
            LIS.push(nums[i]);
        } else {
            const idx = lowerBound(LIS, nums[i]);
            LIS[idx] = nums[i];
        }
        if (LIS.length >= 3) return true;
    }
    return false;
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

##### 贪心 见官解

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var increasingTriplet = function (nums) {
    const n = nums.length;
    let first = nums[0], second = Infinity;
    for (let i = 1; i < n; i++) {
        if (nums[i] > second) {
            return true;
        } else if (nums[i] > first) {
            second = Math.min(nums[i], second);
        } else {
            first = nums[i];
        }
    }
    return false;
};
```

#### [712. 两个字符串的最小ASCII删除和](https://leetcode.cn/problems/minimum-ascii-delete-sum-for-two-strings/description/)

给定两个字符串`s1` 和 `s2`，返回 *使两个字符串相等所需删除字符的 **ASCII**值的最小和*。

**示例 1:**

```
输入: s1 = "sea", s2 = "eat"
输出: 231
解释: 在 "sea" 中删除 "s" 并将 "s" 的值(115)加入总和。
在 "eat" 中删除 "t" 并将 116 加入总和。
结束时，两个字符串相等，115 + 116 = 231 就是符合条件的最小和。
```

**示例 2:**

```
输入: s1 = "delete", s2 = "leet"
输出: 403
解释: 在 "delete" 中删除 "dee" 字符串变成 "let"，
将 100[d]+101[e]+101[e] 加入总和。在 "leet" 中删除 "e" 将 101[e] 加入总和。
结束时，两个字符串都等于 "let"，结果即为 100+101+101+101 = 403 。
如果改为将两个字符串转换为 "lee" 或 "eet"，我们会得到 433 或 417 的结果，比答案更大。
```

**提示:**

* `1 <= s1.length, s2.length <= 1000`
* `s1` 和 `s2` 由小写英文字母组成

##### 多维DP 迭代 空间压缩

```js
/**
 * @param {string} s1
 * @param {string} s2
 * @return {number}
 */
var minimumDeleteSum = function (s1, s2) {
    const n = s2.length;
    const f = Array(n + 1).fill(0);
    for (let j = 0; j < n; j++) {
        f[j + 1] = f[j] + s2[j].charCodeAt();
    }
    for (let i = 0; i < s1.length; i++) {
        let prev = f[0];
        f[0] += s1[i].charCodeAt();
        for (let j = 0; j < n; j++) {
            let temp = f[j + 1];
            if (s1[i] == s2[j]) {
                f[j + 1] = prev;
            } else {
                f[j + 1] = Math.min(f[j + 1] + s1[i].charCodeAt(), f[j] + s2[j].charCodeAt());
            }
            prev = temp;
        }
    }
    return f[n];
};
```

##### 多维DP 迭代

```js
/**
 * @param {string} s1
 * @param {string} s2
 * @return {number}
 */
var minimumDeleteSum = function (s1, s2) {
    const m = s1.length, n = s2.length;
    const f = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i < m; i++) {
        f[i + 1][0] = f[i][0] + + s1[i].charCodeAt();
    }
    for (let j = 0; j < n; j++) {
        f[0][j + 1] = f[0][j] + s2[j].charCodeAt();
    }
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (s1[i] == s2[j]) {
                f[i + 1][j + 1] = f[i][j];
            } else {
                f[i + 1][j + 1] = Math.min(f[i][j + 1] + s1[i].charCodeAt(), 
                    f[i + 1][j] + s2[j].charCodeAt());
            }
        }
    }
    return f[m][n];
};
```

##### 多维DP 记忆化缓存

```js
/**
 * @param {string} s1
 * @param {string} s2
 * @return {number}
 */
var minimumDeleteSum = function(s1, s2) {
    const m = s1.length, n = s2.length;
    const ascll1 = Array(m + 1).fill(0), ascll2 = Array(n + 1).fill(0);
    for (let i = 0; i < m; i++) {
        ascll1[i + 1] = ascll1[i] + s1[i].charCodeAt();
    }
    for (let i = 0; i < n; i++) {
        ascll2[i + 1] = ascll2[i] + s2[i].charCodeAt();
    }
    const memo = Array.from({length: m}, () => Array(n).fill(-1));
    const dfs = (i, j) => {
        if (i < 0) return ascll2[j + 1];
        if (j < 0) return ascll1[i + 1];
        if (memo[i][j] >= 0) return memo[i][j];
        if (s1[i] == s2[j]) return memo[i][j] = dfs(i - 1, j - 1);
        return memo[i][j] = Math.min(dfs(i - 1, j) + s1[i].charCodeAt(), 
            dfs(i, j - 1) + s2[j].charCodeAt())
    }

    return dfs(m - 1, n - 1);
};
```

