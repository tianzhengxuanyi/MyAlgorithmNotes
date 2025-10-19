### 2025-10-18

#### [914. 卡牌分组](https://leetcode.cn/problems/x-of-a-kind-in-a-deck-of-cards/description/)

给定一副牌，每张牌上都写着一个整数。

此时，你需要选定一个数字 `X`，使我们可以将整副牌按下述规则分成 1 组或更多组：

* 每组都有 `X` 张牌。
* 组内所有的牌上都写着相同的整数。

仅当你可选的 `X >= 2` 时返回 `true`。

**示例 1：**

```
输入：deck = [1,2,3,4,4,3,2,1]
输出：true
解释：可行的分组是 [1,1]，[2,2]，[3,3]，[4,4]
```

**示例 2：**

```
输入：deck = [1,1,1,2,2,2,3,3]
输出：false
解释：没有满足要求的分组。
```

**提示：**

* `1 <= deck.length <= 104`
* `0 <= deck[i] < 104`

##### 计数的最大公约数

```js
/**
 * 功能：判断一副牌是否可以被分成若干个大小为X的组，其中X >= 2
 * 核心思想：计算所有卡牌数量的最大公约数(GCD)，若GCD >= 2则可以分组
 * 
 * @param {number[]} deck - 输入的卡牌数组，每个元素代表卡牌的数值
 * @return {boolean} 如果可以分组返回true，否则返回false
 * 
 * 时间复杂度：O(n + m log k)，其中n是数组长度，m是不同卡牌的数量，k是最大卡牌数量
 * 空间复杂度：O(m)，需要存储不同卡牌的出现次数
 */
var hasGroupsSizeX = function (deck) {
    // 使用哈希表统计每个卡牌的出现次数
    const cnt = new Map();
    for (let x of deck) {
        cnt.set(x, (cnt.get(x) ?? 0) + 1);
    }
    
    // 将所有卡牌数量提取到数组中
    const vals = Array.from(cnt.values());
    
    // 特殊情况处理：如果只有一种卡牌，只需检查其数量是否大于等于2
    if (vals.length == 1) return vals[0] >= 2;
    
    // 初始化最大公约数为第一个卡牌的数量
    let g = vals[0];
    
    // 遍历所有卡牌数量，计算它们的最大公约数
    for (let i = 1; i < vals.length; i++) {
        g = gcd(g, vals[i]);
        
        // 剪枝优化：如果当前最大公约数已经为1，则无法分组，可以提前返回
        if (g == 1) {
            return false;
        }
    }
    
    // 所有卡牌数量的最大公约数大于等于2时，可以分组
    return true;
};

/**
 * 辅助函数：使用欧几里得算法计算两个数的最大公约数
 * 
 * @param {number} x - 第一个数
 * @param {number} y - 第二个数
 * @return {number} x和y的最大公约数
 */
const gcd = (x, y) => {
    // 欧几里得算法：用较大数除以较小数，然后用余数继续除以除数，直到余数为0
    while (y) {
        let t = x % y;
        x = y;  // 交换x和y的值
        y = t;  // y变为余数
    }
    
    // 当y为0时，x就是最大公约数
    return x;
};

```

#### [1979. 找出数组的最大公约数](https://leetcode.cn/problems/find-greatest-common-divisor-of-array/description/)

给你一个整数数组 `nums` ，返回数组中最大数和最小数的 **最大公约数** 。

两个数的 **最大公约数** 是能够被两个数整除的最大正整数。

**示例 1：**

```
输入：nums = [2,5,6,9,10]
输出：2
解释：
nums 中最小的数是 2
nums 中最大的数是 10
2 和 10 的最大公约数是 2
```

**示例 2：**

```
输入：nums = [7,5,6,8,3]
输出：1
解释：
nums 中最小的数是 3
nums 中最大的数是 8
3 和 8 的最大公约数是 1
```

**示例 3：**

```
输入：nums = [3,3]
输出：3
解释：
nums 中最小的数是 3
nums 中最大的数是 3
3 和 3 的最大公约数是 3
```

**提示：**

* `2 <= nums.length <= 1000`
* `1 <= nums[i] <= 1000`

##### 最大公约数模板

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findGCD = function(nums) {
    let mn = Infinity, mx = -Infinity;
    for (let x of nums) {
        mn = Math.min(mn, x);
        mx = Math.max(mx, x);
    }

    while (mn) {
        let t = mx % mn;
        mx = mn, mn = t; 
    }

    return mx;
};
```

#### [3164. 优质数对的总数 II](https://leetcode.cn/problems/find-the-number-of-good-pairs-ii/description/)

给你两个整数数组 `nums1` 和 `nums2`，长度分别为 `n` 和 `m`。同时给你一个**正整数** `k`。

如果 `nums1[i]` 可以被 `nums2[j] * k` 整除，则称数对 `(i, j)` 为 **优质数对**（`0 <= i <= n - 1`, `0 <= j <= m - 1`）。

返回 **优质数对** 的总数。

**示例 1：**

**输入：**nums1 = [1,3,4], nums2 = [1,3,4], k = 1

**输出：**5

**解释：**

5个优质数对分别是 `(0, 0)`, `(1, 0)`, `(1, 1)`, `(2, 0)`, 和 `(2, 2)`。

**示例 2：**

**输入：**nums1 = [1,2,4,12], nums2 = [2,4], k = 3

**输出：**2

**解释：**

2个优质数对分别是 `(3, 0)` 和 `(3, 1)`。

**提示：**

* `1 <= n, m <= 105`
* `1 <= nums1[i], nums2[j] <= 106`
* `1 <= k <= 103`

##### 用map去重后枚举nums2倍数

```js
/**
 * 功能：计算满足条件的数对(i,j)的数量，其中nums1[i]能被nums2[j]*k整除
 * 核心思想：预处理+哈希表优化 - 通过预处理nums2数组中每个元素的倍数，快速统计符合条件的数对
 * 
 * @param {number[]} nums1 - 第一个数字数组
 * @param {number[]} nums2 - 第二个数字数组
 * @param {number} k - 给定的倍数因子
 * @return {number} 满足条件的数对数量
 * 
 * 时间复杂度：O(n + m + MX/k)，其中n是nums1长度，m是nums2长度，MX是nums1中的最大值
 * 空间复杂度：O(m + MX)，需要哈希表存储nums2元素频率和数组存储预处理结果
 */
var numberOfPairs = function(nums1, nums2, k) {
    // 找到nums1中的最大值，用于确定预处理数组的大小
    const MX = Math.max(...nums1);
    
    // 创建预处理数组，记录每个可能的数值能被多少个nums2[j]*k的倍数整除
    const target = Array(MX + 1).fill(0);
    
    // 使用哈希表统计nums2中每个元素出现的频率
    const cnt2 = new Map();
    for (let x of nums2) {
        cnt2.set(x, (cnt2.get(x) ?? 0) + 1);
    }
    
    // 预处理阶段：对nums2中的每个元素x，计算x*k的所有倍数在target中的出现次数
    for (let [x, c] of cnt2.entries()) {
        x *= k;  // 计算x*k的值
        
        // 剪枝：如果x*k超过nums1中的最大值，则无法形成有效数对，跳过
        if (x > MX) continue;
        
        // 对于x*k的每个倍数j*x，增加其在target中的计数
        for (let j = 1; j * x <= MX; j++) {
            target[j * x] += c;
        }
    }
    
    // 统计阶段：遍历nums1中的每个元素，累加其在预处理数组中的计数
    let ans = 0;
    for (let x of nums1) {
        ans += target[x];
    }
    
    return ans;
};

```

#### [3447. 将元素分配给有约束条件的组](https://leetcode.cn/problems/assign-elements-to-groups-with-constraints/description/)

给你一个整数数组 `groups`，其中 `groups[i]` 表示第 `i` 组的大小。另给你一个整数数组 `elements`。

请你根据以下规则为每个组分配 **一个**元素：

* 如果 `groups[i]` 能被 `elements[j]` 整除，则下标为 `j` 的元素可以分配给组 `i`。
* 如果有多个元素满足条件，则分配 **最小的下标** `j` 的元素。
* 如果没有元素满足条件，则分配 -1 。

返回一个整数数组 `assigned`，其中 `assigned[i]` 是分配给组 `i` 的元素的索引，若无合适的元素，则为 -1。

**注意：**一个元素可以分配给多个组。

**示例 1：**

**输入：** groups = [8,4,3,2,4], elements = [4,2]

**输出：** [0,0,-1,1,0]

**解释：**

* `elements[0] = 4` 被分配给组 0、1 和 4。
* `elements[1] = 2` 被分配给组 3。
* 无法为组 2 分配任何元素，分配 -1 。

**示例 2：**

**输入：** groups = [2,3,5,7], elements = [5,3,3]

**输出：** [-1,1,0,-1]

**解释：**

* `elements[1] = 3` 被分配给组 1。
* `elements[0] = 5` 被分配给组 2。
* 无法为组 0 和组 3 分配任何元素，分配 -1 。

**示例 3：**

**输入：** groups = [10,21,30,41], elements = [2,1]

**输出：** [0,1,0,1]

**解释：**

`elements[0] = 2` 被分配给所有偶数值的组，而 `elements[1] = 1` 被分配给所有奇数值的组。

**提示：**

* `1 <= groups.length <= 105`
* `1 <= elements.length <= 105`
* `1 <= groups[i] <= 105`
* `1 <= elements[i] <= 105`

##### 枚举element的倍数

```js
/**
 * 功能：将元素数组中的元素分配给组数组中的每个组
 * 核心思想：贪心策略 - 为每个可能的组值分配可用的最小元素（按索引顺序）
 * 
 * @param {number[]} groups - 组值数组，表示需要分配元素的各个组
 * @param {number[]} elements - 可用元素数组，每个元素可以分配给其倍数的组值
 * @return {number[]} 分配结果数组，每个元素表示对应组分配到的元素索引
 * 
 * 时间复杂度：O(n + m * log(MX))，其中n是groups长度，m是elements长度，MX是groups中的最大值
 * 空间复杂度：O(MX)，需要额外数组存储分配信息
 */
var assignElements = function (groups, elements) {
    const n = groups.length, m = elements.length;
    
    // 找到组数组中的最大值，用于确定分配数组的大小
    let MX = Math.max(...groups);
    
    // 创建分配目标数组，初始值为-1（表示未分配）
    const target = Array(MX + 1).fill(-1);
    
    // 遍历元素数组，进行分配
    for (let j = 0; j < m; j++) {
        let e = elements[j];
        
        // 剪枝：如果元素超过最大组值或已被分配过，则跳过
        if (e > MX || target[e] >= 0) continue;
        
        // 贪心策略：为当前元素的所有倍数分配该元素（如果这些倍数尚未分配）
        // 这确保了每个组值会被分配到索引最小的可用元素
        for (let f = 1; f * e <= MX; f++) {
            if (target[f * e] < 0) {
                target[f * e] = j;
            }
        }
    }
    
    // 根据分配结果，更新组数组中的每个值
    for (let i = 0; i < n; i++) {
        groups[i] = target[groups[i]];
    }
    
    return groups;
};

```

/**
 * 功能：判断一副牌是否可以被分成若干个大小为X的组，其中X >= 2
 * 核心思想：计算所有卡牌数量的最大公约数(GCD)，若GCD >= 2则可以分组
 * 
 * @param {number[]} deck - 输入的卡牌数组，每个元素代表卡牌的数值
 * @return {boolean} 如果可以分组返回true，否则返回false
 * 
 * 时间复杂度：O(n + m log k)，其中n是数组长度，m是不同卡牌的数量，k是最大卡牌数量
 * 空间复杂度：O(m)，需要存储不同卡牌的出现次数
 */
var hasGroupsSizeX = function (deck) {
    // 使用哈希表统计每个卡牌的出现次数
    const cnt = new Map();
    for (let x of deck) {
        cnt.set(x, (cnt.get(x) ?? 0) + 1);
    }
    
    // 将所有卡牌数量提取到数组中
    const vals = Array.from(cnt.values());
    
    // 特殊情况处理：如果只有一种卡牌，只需检查其数量是否大于等于2
    if (vals.length == 1) return vals[0] >= 2;
    
    // 初始化最大公约数为第一个卡牌的数量
    let g = vals[0];
    
    // 遍历所有卡牌数量，计算它们的最大公约数
    for (let i = 1; i < vals.length; i++) {
        g = gcd(g, vals[i]);
        
        // 剪枝优化：如果当前最大公约数已经为1，则无法分组，可以提前返回
        if (g == 1) {
            return false;
        }
    }
    
    // 所有卡牌数量的最大公约数大于等于2时，可以分组
    return true;
};

/**
 * 辅助函数：使用欧几里得算法计算两个数的最大公约数
 * 
 * @param {number} x - 第一个数
 * @param {number} y - 第二个数
 * @return {number} x和y的最大公约数
 */
const gcd = (x, y) => {
    // 欧几里得算法：用较大数除以较小数，然后用余数继续除以除数，直到余数为0
    while (y) {
        let t = x % y;
        x = y;  // 交换x和y的值
        y = t;  // y变为余数
    }
    
    // 当y为0时，x就是最大公约数
    return x;
};

#### [1390. 四因数](https://leetcode.cn/problems/four-divisors/description/)

给你一个整数数组 `nums`，请你返回该数组中恰有四个因数的这些整数的各因数之和。如果数组中不存在满足题意的整数，则返回 `0` 。

**示例 1：**

```
输入：nums = [21,4,7]
输出：32
解释：
21 有 4 个因数：1, 3, 7, 21
4 有 3 个因数：1, 2, 4
7 有 2 个因数：1, 7
答案仅为 21 的所有因数的和。
```

**示例 2:**

```
输入: nums = [21,21]
输出: 64
```

**示例 3:**

```
输入: nums = [1,2,3,4,5]
输出: 0
```

**提示：**

* `1 <= nums.length <= 104`
* `1 <= nums[i] <= 105`

```js
/**
 * 功能：计算数组中所有恰好有4个除数的元素的除数之和
 * 核心思想：通过因数分解，检查每个数的除数数量是否为4
 * 
 * @param {number[]} nums - 输入的数字数组
 * @return {number} 所有恰好有4个除数的元素的除数之和
 * 
 * 时间复杂度：O(n*√m)，其中n是数组长度，m是数组中的最大元素值
 * 空间复杂度：O(1)，仅使用常数额外空间
 */
var sumFourDivisors = function(nums) {
    let ans = 0;  // 存储最终结果：所有恰好有4个除数的元素的除数和
    
    // 外层循环：遍历数组中的每个元素
    outer: for (let x of nums) {
        // 初始化除数计数和除数和
        // 每个数至少有1和它本身两个除数
        let cnt = 2, s = x + 1;
        
        // 内层循环：检查2到√x之间的所有可能因数
        for (let i = 2; i * i <= x; i++) {
            // 找到一个因数i
            if (x % i == 0) {
                // 如果i是平方根（完全平方数的情况）
                if (i * i == x) {
                    cnt += 1;  // 平方根只算一个除数
                    s += i;
                } else {
                    cnt += 2;  // 找到一对因数i和x/i，各算一个除数
                    s += i + (x / i);
                }
            }
            
            // 剪枝：如果除数数量已经超过4，直接跳过当前数
            if (cnt > 4) continue outer;
        }
        
        // 只有当除数数量恰好为4时，才将其除数和加入结果
        if (cnt == 4) ans += s;
    }
    
    return ans;
};

```


#### [3397. 执行操作后不同元素的最大数量](https://leetcode.cn/problems/maximum-number-of-distinct-elements-after-operations/description/)

给你一个整数数组 `nums` 和一个整数 `k`。

你可以对数组中的每个元素 **最多** 执行 **一次**以下操作：

* 将一个在范围 `[-k, k]` 内的整数加到该元素上。

返回执行这些操作后，`nums` 中可能拥有的不同元素的 **最大**数量。

**示例 1：**

**输入：** nums = [1,2,2,3,3,4], k = 2

**输出：** 6

**解释：**

对前四个元素执行操作，`nums` 变为 `[-1, 0, 1, 2, 3, 4]`，可以获得 6 个不同的元素。

**示例 2：**

**输入：** nums = [4,4,4,4], k = 1

**输出：** 3

**解释：**

对 `nums[0]` 加 -1，以及对 `nums[1]` 加 1，`nums` 变为 `[3, 5, 4, 4]`，可以获得 3 个不同的元素。

**提示：**

* `1 <= nums.length <= 105`
* `1 <= nums[i] <= 109`
* `0 <= k <= 109`

##### 贪心

```js
/**
 * 功能：计算在对数组元素进行调整后，可以得到的最大不同元素数量
 * 核心思想：贪心算法 - 通过最小化调整幅度，使尽可能多的元素保持唯一性
 * 
 * @param {number[]} nums - 输入的数字数组
 * @param {number} k - 每个元素可以调整的最大幅度（范围：[-k, k]）
 * @return {number} 调整后可以得到的最大不同元素数量
 * 
 * 时间复杂度：O(n log n)，主要来自排序操作
 * 空间复杂度：O(1)，仅使用常数额外空间
 */
var maxDistinctElements = function(nums, k) {
    const n = nums.length;
    
    // 边界条件：如果k足够大，可以调整所有元素为不同值
    if (2*k + 1 >= n) return n;
    
    // 排序以便后续贪心处理
    nums.sort((a, b) => a - b);
    
    let ans = 1;  // 计数变量，至少有一个不同元素
    
    // 初始化第一个元素的调整后值（调至最小可能值）
    nums[0] = nums[0] - k;
    
    // 从第二个元素开始遍历，贪心调整每个元素
    for (let i = 1; i < n; i++) {
        // 贪心策略：
        // 1. 确保当前元素不小于前一个元素+1（保证唯一性）
        // 2. 同时使调整幅度尽可能小（不超过-k和+k的限制）
        nums[i] = Math.max(nums[i] - k, Math.min(nums[i - 1] + 1, nums[i] + k));
        
        // 如果当前元素与前一个元素不同，则计数加1
        if (nums[i] !== nums[i - 1]) ans++;
    }
    
    return ans;
};

```

