### 2025-10-21

#### [3334. 数组的最大因子得分](https://leetcode.cn/problems/find-the-maximum-factor-score-of-array/description/)

给你一个整数数组 `nums`。

**因子得分** 定义为数组所有元素的最小公倍数（LCM）与最大公约数（GCD）的 **乘积**。

在 **最多** 移除一个元素的情况下，返回 `nums` 的 **最大因子得分**。

**注意**，单个数字的 LCM 和 GCD 都是其本身，而**空数组** 的因子得分为 0。

**示例 1：**

**输入：** nums = [2,4,8,16]

**输出：** 64

**解释：**

移除数字 2 后，剩余元素的 GCD 为 4，LCM 为 16，因此最大因子得分为 `4 * 16 = 64`。

**示例 2：**

**输入：** nums = [1,2,3,4,5]

**输出：** 60

**解释：**

无需移除任何元素即可获得最大因子得分 60。

**示例 3：**

**输入：** nums = [3]

**输出：** 9

**提示：**

* `1 <= nums.length <= 100`
* `1 <= nums[i] <= 30`

##### 前、后缀gcd、lcm

```js
/**
 * 功能：计算数组的最大分数
 * 参数：nums - 输入的数字数组
 * 返回：最大分数值（将BigInt结果转换为Number返回）
 * 算法核心思想：使用前缀数组和后缀数组优化计算，尝试排除数组中的每一个元素，计算剩余元素的最小公倍数(LCM)和最大公约数(GCD)的乘积，找出其中的最大值
 * 时间复杂度：O(n log m)，其中n是数组长度，m是数组中的最大值（GCD和LCM操作的复杂度）
 * 空间复杂度：O(n)，使用了两个额外的数组存储后缀GCD和后缀LCM
 */
var maxScore = function (nums) {
    const n = nums.length;
    
    // 初始化后缀GCD和后缀LCM数组，使用BigInt避免大数溢出
    const suffixGcd = Array(n + 1).fill(0n), suffixLcm = Array(n + 1).fill(1n);
    
    // 从后向前计算后缀GCD和后缀LCM
    // suffixGcd[i]表示从nums[i]到nums[n-1]的所有元素的GCD
    // suffixLcm[i]表示从nums[i]到nums[n-1]的所有元素的LCM
    for (let i = n - 1; i >= 0; i--) {
        suffixGcd[i] = gcd(BigInt(nums[i]), suffixGcd[i + 1]);
        suffixLcm[i] = lcm(BigInt(nums[i]), suffixLcm[i + 1]);
    }
    
    // 初始化前缀GCD和前缀LCM
    // prefixGcd表示从nums[0]到nums[i-1]的所有元素的GCD
    // prefixLcm表示从nums[0]到nums[i-1]的所有元素的LCM
    let prefixGcd = 0n, prefixLcm = 1n;
    
    // 初始答案为整个数组的GCD和LCM的乘积
    let ans = suffixGcd[0] * suffixLcm[0];
    
    // 遍历数组，尝试排除每一个元素nums[i]
    for (let i = 0; i < n; i++) {
        // 计算排除nums[i]后的GCD：前缀GCD和后缀GCD的GCD
        let g = gcd(prefixGcd, suffixGcd[i + 1]);
        // 计算排除nums[i]后的LCM：前缀LCM和后缀LCM的LCM
        let l = lcm(prefixLcm, suffixLcm[i + 1]);
        // 更新最大分数
        ans = ans > g * l ? ans : g * l;
        
        // 更新前缀GCD和前缀LCM，将当前元素nums[i]包含进来
        prefixGcd = gcd(prefixGcd, BigInt(nums[i]));
        prefixLcm = lcm(prefixLcm, BigInt(nums[i]));
    }

    // 将BigInt结果转换为Number返回
    return Number(ans);
};

/**
 * 功能：计算两个BigInt类型数的最大公约数
 * 参数：x, y - 两个BigInt类型的正整数
 * 返回：x和y的最大公约数（BigInt类型）
 * 算法：欧几里得算法（辗转相除法）
 */
const gcd = (x, y) => {
    while (y) {
        let t = x % y;
        x = y, y = t;
    }
    return x;
}

/**
 * 功能：计算两个BigInt类型数的最小公倍数
 * 参数：x, y - 两个BigInt类型的正整数
 * 返回：x和y的最小公倍数（BigInt类型）
 * 公式：LCM(x,y) = (x * y) / GCD(x,y)
 */
const lcm = (x, y) => (x * y) / gcd(x, y);

```

##### 遍历

```js
/**
 * 功能：计算数组的最大分数
 * 参数：nums - 输入的数字数组
 * 返回：最大分数值
 * 算法核心思想：尝试排除数组中的每一个元素，计算剩余元素的最小公倍数(LCM)和最大公约数(GCD)的乘积，找出其中的最大值
 * 时间复杂度：O(n² log m)，其中n是数组长度，m是数组中的最大值（GCD和LCM操作的复杂度）
 * 空间复杂度：O(1)，只使用了常数额外空间
 */
var maxScore = function (nums) {
    let ans = 0, n = nums.length; // ans存储最大分数，n存储数组长度
    
    // 边界情况处理：如果数组只有一个元素，返回该元素的平方
    if (n == 1) return nums[0] * nums[0];
    
    let l = nums[0], g = nums[0]; // l用于计算LCM，g用于计算GCD
    
    // 遍历数组，尝试排除每一个元素i
    for (let i = 0; i <= n; i++) {
        // 初始化LCM和GCD的起始值
        if (i == 0) {
            // 特殊情况：当排除第一个元素时，从第二个元素开始初始化
            l = nums[1], g = nums[1];
        } else {
            // 正常情况：从第一个元素开始初始化
            l = nums[0], g = nums[0];
        }
        
        // 遍历数组中的其他元素（排除元素i）
        for (let j = i == 0 ? 2 : 0; j < n; j++) {
            // 跳过当前被排除的元素
            if (i == j) continue;
            
            // 更新剩余元素的最小公倍数
            l = lcm(l, nums[j]);
            // 更新剩余元素的最大公约数
            g = gcd(g, nums[j]);
        }
        
        // 更新最大分数
        ans = Math.max(ans, l * g);
    }
    
    return ans;
};

/**
 * 功能：计算两个数的最大公约数
 * 参数：x, y - 两个正整数
 * 返回：x和y的最大公约数
 * 算法：欧几里得算法（辗转相除法）
 */
const gcd = (x, y) => {
    while (y) {
        let t = x % y;
        x = y, y = t;
    }
    return x;
}

/**
 * 功能：计算两个数的最小公倍数
 * 参数：x, y - 两个正整数
 * 返回：x和y的最小公倍数
 * 公式：LCM(x,y) = (x * y) / GCD(x,y)
 */
const lcm = (x, y) => (x * y) / gcd(x, y);

```

#### [2413. 最小偶倍数](https://leetcode.cn/problems/smallest-even-multiple/description/)

给你一个正整数 `n` ，返回 `2`和`n` 的最小公倍数（正整数）。

**示例 1：**

```
输入：n = 5
输出：10
解释：5 和 2 的最小公倍数是 10 。
```

**示例 2：**

```
输入：n = 6
输出：6
解释：6 和 2 的最小公倍数是 6 。注意数字会是它自身的倍数。
```

**提示：**

* `1 <= n <= 150`

##### 2与偶数的gcd为2,2与奇数gcd为1

```js
/**
 * @param {number} n
 * @return {number}
 */
var smallestEvenMultiple = function(n) {
    return n % 2 ? 2 * n : n;
};
```

##### 最小公倍数

```js
/**
 * @param {number} n
 * @return {number}
 */
var smallestEvenMultiple = function(n) {
    return 2 * n / gcd(n, 2);
};

const gcd = (x, y) => {
    while (y) {
        let t = x % y;
        x = y, y = t;
    }
    return x;
}
```

#### [3346. 执行操作后元素的最高频率 I](https://leetcode.cn/problems/maximum-frequency-of-an-element-after-performing-operations-i/description/)

给你一个整数数组 `nums` 和两个整数 `k` 和 `numOperations` 。

你必须对 `nums` 执行 **操作**  `numOperations` 次。每次操作中，你可以：

* 选择一个下标 `i` ，它在之前的操作中 **没有** 被选择过。
* 将 `nums[i]` 增加范围 `[-k, k]` 中的一个整数。

在执行完所有操作以后，请你返回 `nums` 中出现 **频率最高** 元素的出现次数。

一个元素 `x` 的 **频率** 指的是它在数组中出现的次数。

**示例 1：**

**输入：**nums = [1,4,5], k = 1, numOperations = 2

**输出：**2

**解释：**

通过以下操作得到最高频率 2 ：

* 将 `nums[1]` 增加 0 ，`nums` 变为 `[1, 4, 5]` 。
* 将 `nums[2]` 增加 -1 ，`nums` 变为 `[1, 4, 4]` 。

**示例 2：**

**输入：**nums = [5,11,20,20], k = 5, numOperations = 1

**输出：**2

**解释：**

通过以下操作得到最高频率 2 ：

* 将 `nums[1]` 增加 0 。

**提示：**

* `1 <= nums.length <= 105`
* `1 <= nums[i] <= 105`
* `0 <= k <= 105`
* `0 <= numOperations <= nums.length`

##### 差分数组

```js
/**
 * 功能：计算在指定操作次数内可以达到的最大频率
 * 参数：
 *   nums - 输入的数字数组
 *   k - 允许的数值变化范围（目标值±k内的数都可转换为目标值）
 *   numOperations - 最大操作次数（最多可以转换多少个数）
 * 返回：通过最多numOperations次操作可以达到的最大频率
 * 算法核心思想：使用差分数组思想，标记每个数值对其影响范围内频率的贡献，然后遍历计算每个可能目标值的最大可达频率
 * 时间复杂度：O(n + m log m)，其中n是数组长度，m是不同数值的数量（排序操作的复杂度）
 * 空间复杂度：O(m)，使用两个Map存储差异值和计数信息
 */
var maxFrequency = function(nums, k, numOperations) {
    // diffMap：差分数组Map，用于标记数值范围的开始和结束对频率的影响
    const diffMap = new Map();
    // cntMap：计数Map，用于记录每个数值在原始数组中出现的次数
    const cntMap = new Map();

    // 遍历数组，构建差分数组和计数Map
    for (let x of nums) {
        // 更新当前数值x的出现次数
        cntMap.set(x, (cntMap.get(x) ?? 0) + 1);
        
        // 确保x本身在diffMap中存在（值设为0不影响结果）
        if (!diffMap.has(x)) diffMap.set(x, 0);
        
        // 在范围开始处增加1（表示从x-k开始，频率+1）
        diffMap.set(x - k, (diffMap.get(x - k) ?? 0) + 1);
        // 在范围结束后一处减少1（表示x+k+1之后，频率-1）
        diffMap.set(x + k + 1, (diffMap.get(x + k + 1) ?? 0) - 1);
    }

    // 将diffMap转换为数组并按数值大小排序
    const diffs = Array.from(diffMap.entries()).sort((a,b) => a[0] - b[0]);
    
    // ans：最终结果，记录最大频率
    // sumD：当前累积的频率变化量
    let ans = 0, sumD = 0;

    // 遍历排序后的差异数组，计算每个数值点的最大可能频率
    for (let [x, diff] of diffs) {
        // 累积频率变化量
        sumD += diff;
        
        // 更新最大频率：
        // 1. sumD表示在x±k范围内的元素总数
        // 2. numOperations + (cntMap.get(x) ?? 0)表示可用于x的最大资源（操作次数+原始出现次数）
        // 取两者较小值作为当前x的最大可能频率
        ans = Math.max(ans, Math.min(sumD, numOperations + (cntMap.get(x) ?? 0)));
    }

    return ans;
};

```

##### 枚举众数  二分

```js
/**
 * 功能：计算在指定操作次数内可以达到的最大频率
 * 参数：
 *   nums - 输入的数字数组
 *   k - 允许的数值变化范围（目标值±k内的数都可转换为目标值）
 *   numOperations - 最大操作次数（最多可以转换多少个数）
 * 返回：通过最多numOperations次操作可以达到的最大频率
 * 算法核心思想：先对数组排序，然后对于每个可能的目标值，找出其±k范围内的所有元素数量，再结合可用操作次数计算最大可能频率
 * 时间复杂度：O(n log n + (mx - mn) log n)，其中n是数组长度，mx和mn分别是数组的最大值和最小值
 * 空间复杂度：O(n)，使用Map存储每个元素的出现次数
 */
var maxFrequency = function (nums, k, numOperations) {
    const n = nums.length;
    // 对数组进行排序，以便后续使用二分查找
    nums.sort((a, b) => a - b);
    // 记录数组中的最小值和最大值，用于遍历所有可能的目标值
    let mn = nums[0], mx = nums[n - 1];
    // 使用Map统计每个元素出现的次数
    const cnt = new Map();

    // 统计每个元素的频率
    for (let x of nums) {
        cnt.set(x, (cnt.get(x) ?? 0) + 1);
    }
    
    /**
     * 功能：实现二分查找的lower_bound，找到第一个大于等于target的元素的索引
     * 参数：target - 目标值
     * 返回：第一个大于等于target的元素索引
     */
    const lowerBound = (target) => {
        let l = 0, r = n - 1;
        while (l <= r) {
            // 计算中间位置，避免整数溢出
            let m = Math.floor((r - l) / 2) + l;
            if (nums[m] < target) {
                // 中间元素小于目标值，搜索右半部分
                l = m + 1;
            } else {
                // 中间元素大于等于目标值，搜索左半部分
                r = m - 1;
            }
        }
        // 循环结束时，l指向第一个大于等于target的元素位置
        return l;
    }
    
    // 初始化最大频率为1（至少有一个元素）
    let ans = 1;
    
    // 遍历所有可能的目标值（从最小值到最大值）
    for (let i = mn; i <= mx; i++) {
        // 计算目标值i的有效范围：[i-k, i+k]，但不超出数组的实际范围[mn, mx]
        let upper = Math.min(i + k, mx), lower = Math.max(i - k, mn);
        
        // 使用二分查找确定有效范围内元素的边界索引
        // 找到第一个大于upper的元素的位置，然后减1得到最后一个<=upper的元素位置
        let r = lowerBound(upper + 1) - 1;
        // 找到第一个>=lower的元素的位置
        let l = lowerBound(lower);
        
        // 获取当前目标值i在数组中的实际出现次数
        let c = cnt.get(i) ?? 0;
        
        // 更新最大频率：
        // 当前频率 = 目标值i的实际出现次数 + min(可用操作次数, 有效范围内其他元素的数量)
        ans = Math.max(ans, c + Math.min(numOperations, (r - l + 1 - c)))
    }
    
    return ans;
};

```

