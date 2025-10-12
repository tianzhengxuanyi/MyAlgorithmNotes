### 2025-10-11

#### [866. 回文质数](https://leetcode.cn/problems/prime-palindrome/description/)

给你一个整数 `n` ，返回大于或等于 `n` 的最小 **回文质数**。

一个整数如果恰好有两个除数：`1` 和它本身，那么它是 **质数** 。注意，`1` 不是质数。

* 例如，`2`、`3`、`5`、`7`、`11` 和 `13` 都是质数。

一个整数如果从左向右读和从右向左读是相同的，那么它是 **回文数** 。

* 例如，`101` 和 `12321` 都是回文数。

测试用例保证答案总是存在，并且在 `[2, 2 * 108]` 范围内。

**示例 1：**

```
输入：n = 6
输出：7
```

**示例 2：**

```
输入：n = 8
输出：11
```

**示例 3：**

```
输入：n = 13
输出：101
```

**提示：**

* `1 <= n <= 108`

##### 生成所有回文质数 二分

- 生成所有的回文数
- 过滤出所有的回文质数
- 二分查找第一个大于等于n的回文质数

```js
/**
 * @function primePalindrome
 * @description 查找大于等于给定数字的最小素数回文数
 * @param {number} n - 输入的目标数字
 * @return {number} 大于等于n的最小素数回文数
 * @算法核心思想：预生成所有可能的回文数，筛选出素数后，使用二分查找快速定位目标值
 * @时间复杂度：O(1) - 预计算阶段完成后查询为O(log n)
 * @空间复杂度：O(k) - k为预生成的素数回文数数量
 */
var primePalindrome = function (n) {
    return lowerBound(n);
};

/**
 * @var {Array} palindrome - 存储预生成的回文数
 */
const palindrome = [];

/**
 * @constant {number} MX - 预生成回文数的最大值
 */
const MX = 2e8;

/**
 * 预生成所有小于MX的回文数
 * 分为奇数长度和偶数长度两种情况生成
 */
outer: for (let base = 1; ; base *= 10) {
    // 生成奇数长度的回文数
    for (let i = base; i < base * 10; i++) {
        let x = i;
        // 将i的前几位逆序追加到i后面，形成奇数长度回文数
        for (let t = Math.floor(x / 10); t > 0; t = Math.floor(t / 10)) {
            x = x * 10 + t % 10;
        }
        if (x > MX) {
            break outer;
        }
        palindrome.push(x);
    }
    
    // 生成偶数长度的回文数
    for (let i = base; i < base * 10; i++) {
        let x = i;
        // 将i完全逆序追加到i后面，形成偶数长度回文数
        for (let t = x; t > 0; t = Math.floor(t / 10)) {
            x = x * 10 + t % 10;
        }
        if (x > MX) {
            break outer;
        }
        palindrome.push(x);
    }
}

/**
 * @function isPrime
 * @description 判断一个数是否为素数
 * @param {number} x - 待判断的数字
 * @return {boolean} 如果是素数返回true，否则返回false
 * @算法核心思想：检查从2到√x的所有整数是否能整除x
 * @时间复杂度：O(√n)
 * @空间复杂度：O(1)
 */
const isPrime = (x) => {
    if (x < 2) return false; // 小于2的数不是素数
    let sqrt = Math.sqrt(x);
    for (let i = 2; i <= sqrt; i++) {
        if (x % i == 0) return false; // 能被i整除，不是素数
    }
    return true;
};

/**
 * @var {Array} primes - 存储所有是素数的回文数
 */
const primes = palindrome.filter(isPrime);

/**
 * @function lowerBound
 * @description 使用二分查找找到大于等于目标值的最小素数回文数
 * @param {number} target - 目标值
 * @return {number} 大于等于target的最小素数回文数
 * @算法核心思想：二分查找有序数组中的下界
 * @时间复杂度：O(log n)
 * @空间复杂度：O(1)
 */
const lowerBound = (target) => {
    let l = 0, r = primes.length;
    while (l <= r) {
        // 计算中间位置（避免整数溢出的写法）
        let m = Math.floor((r - l) / 2) + l;
        if (primes[m] < target) {
            l = m + 1; // 目标值在右半部分
        } else {
            r = m - 1; // 目标值在左半部分或等于中间值
        }
    }
    return primes[l]; // 返回下界位置的元素
};

```

#### [3186. 施咒的最大总伤害](https://leetcode.cn/problems/maximum-total-damage-with-spell-casting/description/)

一个魔法师有许多不同的咒语。

给你一个数组 `power` ，其中每个元素表示一个咒语的伤害值，可能会有多个咒语有相同的伤害值。

已知魔法师使用伤害值为 `power[i]` 的咒语时，他们就 **不能** 使用伤害为 `power[i] - 2` ，`power[i] - 1` ，`power[i] + 1` 或者 `power[i] + 2` 的咒语。

每个咒语最多只能被使用 **一次** 。

请你返回这个魔法师可以达到的伤害值之和的 **最大值** 。

**示例 1：**

**输入：**power = [1,1,3,4]

**输出：**6

**解释：**

可以使用咒语 0，1，3，伤害值分别为 1，1，4，总伤害值为 6 。

**示例 2：**

**输入：**power = [7,1,6,6]

**输出：**13

**解释：**

可以使用咒语 1，2，3，伤害值分别为 1，6，6，总伤害值为 13 。

**提示：**

* `1 <= power.length <= 105`
* `1 <= power[i] <= 109`

##### 值域打家劫舍 递推

```js
/**
 * @function maximumTotalDamage
 * @description 使用动态规划计算可以获得的最大总伤害，规则是不能选择相差小于等于2的伤害值
 * @param {number[]} power - 伤害值数组
 * @return {number} 最大总伤害值
 * @算法核心思想：自底向上动态规划，对于每个伤害值，决策选择或不选择当前值
 * @时间复杂度：O(n log n)，主要开销在排序上
 * @空间复杂度：O(n)，用于存储频率统计、排序后的数组和动态规划数组
 */
var maximumTotalDamage = function (power) {
    // 使用Map统计每个伤害值出现的频率
    const cnt = new Map();
    for (let p of power) {
        cnt.set(p, (cnt.get(p) ?? 0) + 1); // 如果键不存在则初始化为0，然后加1
    }
    
    // 提取所有不同的伤害值并按升序排序
    const vals = Array.from(cnt.keys()).sort((a, b) => a - b);
    const n = vals.length;

    // dp[i]表示从索引i开始到数组末尾能获得的最大伤害值
    const dp = Array(n + 1).fill(0);
    
    // 自底向上动态规划：从数组末尾向前遍历
    for (let i = n - 1; i >= 0; i--) {
        let j = i;
        // 找到第一个大于vals[i]+2的值的索引，即选择当前值后可以继续选择的值的起始位置
        while (j < n && vals[j] <= vals[i] + 2) {
            j++;
        }
        // 状态转移方程：取两种情况的最大值
        // 情况1：不选择当前值，最大伤害为dp[i+1]
        // 情况2：选择当前值，最大伤害为当前值的总伤害加上dp[j]
        dp[i] = Math.max(dp[i + 1], dp[j] + vals[i] * cnt.get(vals[i]));
    }

    // 返回从索引0开始的最大伤害值，即整个问题的解
    return dp[0];
};

```

##### 值域打家劫舍 dfs

```js
/**
 * @function maximumTotalDamage
 * @description 计算可以获得的最大总伤害，规则是不能选择相差小于等于2的伤害值
 * @param {number[]} power - 伤害值数组
 * @return {number} 最大总伤害值
 * @算法核心思想：动态规划（记忆化搜索），处理选择或不选择当前伤害值的情况
 * @时间复杂度：O(n log n)，主要开销在排序上
 * @空间复杂度：O(n)，用于存储频率统计、排序后的数组和记忆化数组
 */
var maximumTotalDamage = function(power) {
    // 使用Map统计每个伤害值出现的频率
    const cnt = new Map();
    for (let p of power) {
        cnt.set(p, (cnt.get(p) ?? 0) + 1); // 如果键不存在则初始化为0，然后加1
    }
    
    // 提取所有不同的伤害值并按升序排序
    const vals = Array.from(cnt.keys()).sort((a, b) => a - b);
    const n = vals.length;

    // 记忆化数组，存储子问题的解，避免重复计算
    const memo = Array(n).fill(-1);
    
    /**
     * @function dfs
     * @description 深度优先搜索函数，计算从索引i开始的最大总伤害
     * @param {number} i - 当前考虑的伤害值索引
     * @return {number} 从i开始的最大总伤害值
     */
    const dfs = (i) => {
        if (i >= n) return 0; // 递归终止条件：超出数组范围，返回0
        if (memo[i] >= 0) return memo[i]; // 如果已经计算过，直接返回记忆化的结果
        
        let cp = vals[i]; // 当前伤害值
        
        // 情况1：不选择当前伤害值，直接考虑下一个
        let res = dfs(i + 1);
        
        // 情况2：选择当前伤害值，需要跳过所有与当前值相差<=2的值
        let j = i;
        // 找到第一个大于cp+2的值的索引
        while (vals[j] <= cp + 2) {
            j++;
        }
        // 计算选择当前值的总伤害：当前值×频率 + 后续可选值的最大伤害
        res = Math.max(res, dfs(j) + cp * cnt.get(cp));
        
        // 记忆化结果并返回
        return memo[i] = res;
    };

    // 修正：原代码中dfs调用时传入了两个参数，但函数定义只有一个参数
    // 这里应该只传入一个参数i=0
    return dfs(0);
};

```

