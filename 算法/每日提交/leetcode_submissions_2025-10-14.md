### 2025-10-14

#### [2427. 公因子的数目](https://leetcode.cn/problems/number-of-common-factors/description/)

给你两个正整数 `a` 和 `b` ，返回 `a` 和 `b` 的 **公** 因子的数目。

如果 `x` 可以同时整除 `a` 和 `b` ，则认为 `x` 是 `a` 和 `b` 的一个 **公因子** 。

**示例 1：**

```
输入：a = 12, b = 6
输出：4
解释：12 和 6 的公因子是 1、2、3、6 。
```

**示例 2：**

```
输入：a = 25, b = 30
输出：2
解释：25 和 30 的公因子是 1、5 。
```

**提示：**

* `1 <= a, b <= 1000`

##### 最大公约数

```js
/**
 * 功能：计算两个正整数的公共因子数量
 * 参数：a - 第一个正整数，b - 第二个正整数
 * 返回：两个数的公共因子个数
 * 算法核心思想：利用最大公约数性质，两个数的公共因子就是它们最大公约数的所有因子
 * 时间复杂度：O(√gcd(a,b))，空间复杂度：O(1)
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
var commonFactors = function(a, b) {
    // 计算a和b的最大公约数，因为两个数的公共因子就是它们最大公约数的因子
    let c = gcd(a, b), ans = 0;
    
    // 只需遍历到√c，大大减少了遍历次数
    // 数学原理：如果x是c的因子，那么c/x也是c的因子
    for (let x = 1; x * x <= c; x++) {
        // 检查x是否是c的因子
        if (c % x == 0) {
            ans++; // 找到一个因子x，计数器加1
            
            // 避免重复计数：当x*x != c时，c/x是另一个不同的因子
            if (x * x != c) ans++; // 找到配对因子c/x，计数器再加1
        }
    }
    
    return ans; // 返回公共因子的总数
};

/**
 * 功能：使用欧几里得算法计算两个数的最大公约数
 * 参数：x - 第一个正整数，y - 第二个正整数
 * 返回：x和y的最大公约数
 * 算法原理：gcd(x,y) = gcd(y, x mod y)，当y=0时，gcd为x
 * 时间复杂度：O(log min(x,y))，空间复杂度：O(1)
 * @param {number} x
 * @param {number} y
 * @return {number}
 */
const gcd = (x, y) => {
    // 当y不为0时，循环计算
    while (y) {
        // 计算x除以y的余数
        let t = x % y;
        // 更新x为y，y为余数t
        x = y, y = t;
    }
    // 当y=0时，x就是最大公约数
    return x;
}

```

##### 预处理因数

```js
/**
 * 功能：计算两个正整数的公共因子数量
 * 参数：a - 第一个正整数，b - 第二个正整数
 * 返回：两个数的公共因子个数
 * 算法核心思想：利用预计算的因子数组和集合的交集操作快速求解
 * 时间复杂度：预计算O(MX log MX)，查询O(min(numberOfFactors(a), numberOfFactors(b)))
 * 空间复杂度：O(MX log MX)，用于存储预计算的因子数组
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
var commonFactors = function(a, b) {
    // 将a的因子数组转换为Set集合以提高查找效率
    let factA = new Set(Factory[a]);
    // 获取b的因子数组
    let factB = Factory[b];
    let ans = 0; // 用于计数公共因子的数量
    
    // 遍历b的所有因子，检查是否也存在于a的因子集合中
    for (let f of factB) {
        if (factA.has(f)) ans++; // 如果是公共因子，计数器加1
    }
    
    return ans; // 返回公共因子的总数
};

// 定义预计算因子的最大值范围
const MX = 1001;
// 初始化因子数组，每个元素初始化为只包含因子1的数组
// Factory[i]将存储i的所有正因子
const Factory = Array.from({length: MX}, () => [1]);

// 预计算阶段：使用埃拉托斯特尼筛法的思想生成所有数的因子
// 外层循环遍历可能的因子i（从2开始）
for (let i = 2; i < MX; i++) {
    // 内层循环遍历i的所有倍数j
    for (let j = i; j < MX; j += i) {
        // 将i添加到j的因子列表中
        Factory[j].push(i);
    }
}

```

#### [793. 阶乘函数后 K 个零](https://leetcode.cn/problems/preimage-size-of-factorial-zeroes-function/description/)

`f(x)` 是 `x!` 末尾是 0 的数量。回想一下 `x! = 1 * 2 * 3 * ... * x`，且 `0! = 1` 。

* 例如， `f(3) = 0` ，因为 `3! = 6` 的末尾没有 0 ；而 `f(11) = 2` ，因为 `11!= 39916800` 末端有 2 个 0 。

给定 `k`，找出返回能满足 `f(x) = k` 的非负整数 `x` 的数量。

**示例 1：**

```
输入：k = 0
输出：5
解释：0!, 1!, 2!, 3!, 和 4! 均符合 k = 0 的条件。
```

**示例 2：**

```
输入：k = 5
输出：0
解释：没有匹配到这样的 x!，符合 k = 5 的条件。
```

**示例 3:**

```
输入: k = 3
输出: 5
```

**提示:**

* `0 <= k <= 109`

##### 二分

```js
/**
 * 功能：计算阶乘末尾恰好有k个零的非负整数的个数
 * 参数：k - 目标末尾零的个数
 * 返回：满足条件的非负整数的个数（0或5）
 * 算法核心思想：通过二分查找确定上下边界，利用末尾零个数的数学性质
 * 时间复杂度：O(log²k)，空间复杂度：O(1)
 * @param {number} k
 * @return {number}
 */
var preimageSizeFZF = function(k) {
    // 利用二分查找求恰好有k个零的数的范围：[lowerBound(k), lowerBound(k+1))
    // 区间长度即为答案，要么是0（无解）要么是5（有解）
    return lowerBound(k + 1) - lowerBound(k);
};

/**
 * 功能：二分查找求满足trailingZeroes(x) >= k的最小x值
 * 参数：k - 目标末尾零的个数下界
 * 返回：满足条件的最小非负整数x
 * @param {number} k
 * @return {number}
 */
const lowerBound = (k) => {
    // 初始化搜索区间：左边界为0，右边界为5k（数学上的上界估计）
    let l = 0, r = 5 * k;
    
    // 二分查找循环
    while (l <= r) {
        // 计算中间位置（避免整数溢出的写法）
        let m = Math.floor((r - l) / 2) + l;
        
        // 计算中间值的阶乘末尾零个数并比较
        if (trigleZore(m) < k) {
            // 零的个数不足，左边界右移
            l = m + 1;
        } else {
            // 零的个数足够或更多，右边界左移
            r = m - 1;
        }
    }
    
    // 循环结束后，l指向第一个满足trailingZeroes(x) >= k的位置
    return l;
}

/**
 * 功能：计算n!（n的阶乘）末尾零的个数
 * 参数：x - 输入整数n
 * 返回：n!末尾零的个数
 * 数学原理：末尾零的个数等于n!中因子5的个数（因子2的数量总是足够）
 * @param {number} x
 * @return {number}
 */
const trigleZore = (x) => {
    let ans = 0; // 累计末尾零的个数
    
    // 不断除以5并累加商，直到商为0
    // 这一步计算的是x中包含5的倍数、25的倍数、125的倍数等的总个数
    while (x) {
        x = Math.floor(x / 5); // 取整除法，获取当前层5的因子个数
        ans += x; // 累加到结果中
    }
    
    return ans;
}

// f(n) => floor(n / 5) + floor(n / 5^2) + ... + floor(n / 5 ^ k);
```

#### [3349. 检测相邻递增子数组 I](https://leetcode.cn/problems/adjacent-increasing-subarrays-detection-i/description/)

给你一个由 `n` 个整数组成的数组 `nums` 和一个整数 `k`，请你确定是否存在 **两个** **相邻** 且长度为 `k` 的 **严格递增** 子数组。具体来说，需要检查是否存在从下标 `a` 和 `b` (`a < b`) 开始的 **两个** 子数组，并满足下述全部条件：

* 这两个子数组 `nums[a..a + k - 1]` 和 `nums[b..b + k - 1]` 都是 **严格递增** 的。
* 这两个子数组必须是 **相邻的**，即 `b = a + k`。

如果可以找到这样的 **两个** 子数组，请返回 `true`；否则返回 `false`。

**子数组** 是数组中的一个连续 **非空** 的元素序列。

**示例 1：**

**输入：**nums = [2,5,7,8,9,2,3,4,3,1], k = 3

**输出：**true

**解释：**

* 从下标 `2` 开始的子数组为 `[7, 8, 9]`，它是严格递增的。
* 从下标 `5` 开始的子数组为 `[2, 3, 4]`，它也是严格递增的。
* 两个子数组是相邻的，因此结果为 `true`。

**示例 2：**

**输入：**nums = [1,2,3,4,4,4,4,5,6,7], k = 5

**输出：**false

**提示：**

* `2 <= nums.length <= 100`
* `1 <= 2 * k <= nums.length`
* `-1000 <= nums[i] <= 1000`

