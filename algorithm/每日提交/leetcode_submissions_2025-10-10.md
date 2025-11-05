### 2025-10-10

#### [762. 二进制表示中质数个计算置位](https://leetcode.cn/problems/prime-number-of-set-bits-in-binary-representation/description/)

给你两个整数 `left` 和 `right` ，在闭区间 `[left, right]` 范围内，统计并返回 **计算置位位数为质数** 的整数个数。

**计算置位位数** 就是二进制表示中 `1` 的个数。

* 例如， `21` 的二进制表示 `10101` 有 `3` 个计算置位。

**示例 1：**

```
输入：left = 6, right = 10
输出：4
解释：
6 -> 110 (2 个计算置位，2 是质数)
7 -> 111 (3 个计算置位，3 是质数)
9 -> 1001 (2 个计算置位，2 是质数)
10-> 1010 (2 个计算置位，2 是质数)
共计 4 个计算置位为质数的数字。
```

**示例 2：**

```
输入：left = 10, right = 15
输出：5
解释：
10 -> 1010 (2 个计算置位, 2 是质数)
11 -> 1011 (3 个计算置位, 3 是质数)
12 -> 1100 (2 个计算置位, 2 是质数)
13 -> 1101 (3 个计算置位, 3 是质数)
14 -> 1110 (3 个计算置位, 3 是质数)
15 -> 1111 (4 个计算置位, 4 不是质数)
共计 5 个计算置位为质数的数字。
```

**提示：**

* `1 <= left <= right <= 106`
* `0 <= right - left <= 104`

##### 筛质数 lowbit

```js
/**
 * LeetCode提交代码 - 计算二进制中1的个数为质数的数字个数
 * 该文件包含统计区间[left, right]内数字的二进制表示中1的个数为质数的数字数量的解决方案
 * @file leetcode_submissions_2025-10-10.md
 * @date 2025-10-10
 */

/**
 * 计算在区间[left, right]内，其二进制表示中1的个数为质数的数字数量
 * @param {number} left - 区间左边界（包含）
 * @param {number} right - 区间右边界（包含）
 * @return {number} 符合条件的数字数量
 * @note 利用位运算高效计算二进制中1的个数，并使用预计算的质数表进行快速判断
 */
var countPrimeSetBits = function(left, right) {
    let cnt = 0; // 计数器，用于记录符合条件的数字数量
    
    // 遍历区间内的每个数字
    for (let i = left; i <= right; i++) {
        let d = 0, x = i; // d: 二进制中1的个数，x: 当前处理的数字副本
        
        // 使用位运算高效计算二进制中1的个数
        // 技巧：x &= x - 1 会消除x二进制表示中最右边的1
        while (x) {
            x &= x - 1; // 消除最右边的1
            d++; // 每消除一个1，计数加1
        }
        
        // 检查1的个数是否为质数（使用预计算的质数表）
        if (isPrime[d]) cnt++; // 如果是质数，计数器加1
    }
    
    return cnt; // 返回符合条件的数字数量
};

/**
 * 质数表的最大值边界
 * @constant {number} MX - 质数表覆盖的最大数值（包含）
 * @note 设置为21是因为题目中输入数字的二进制表示中1的个数不会超过21个
 */
const MX = 21;

/**
 * 预计算的质数表，使用埃拉托斯特尼筛法生成
 * @constant {boolean[]} isPrime - 布尔数组，isPrime[x]为1表示x是质数
 * @note 数组索引对应数值，值为1表示是质数，0表示非质数
 */
const isPrime = Array(MX).fill(1); // 初始化数组，假设所有数都是质数
isPrime[0] = isPrime[1] = 0; // 0和1不是质数

/**
 * 使用埃拉托斯特尼筛法生成质数表
 * @description 埃拉托斯特尼筛法的核心思想是：如果i是质数，则i的所有倍数都不是质数
 * @time O(MX log log MX) - 埃拉托斯特尼筛法的时间复杂度
 * @space O(MX) - 存储质数表的空间复杂度
 */
for (let i = 2; i < MX; i++) {
    // 只有当i是质数时，才需要标记其倍数为非质数
    if (isPrime[i]) {
        for (let j = i; j * i < MX; j++) {
            isPrime[i * j] = 0; // 标记i的倍数为非质数
        }
    }
}

```

#### [2614. 对角线上的质数](https://leetcode.cn/problems/prime-in-diagonal/description/)

给你一个下标从 **0** 开始的二维整数数组 `nums` 。

返回位于 `nums` 至少一条 **对角线** 上的最大 **质数** 。如果任一对角线上均不存在质数，返回 *0 。*

注意：

* 如果某个整数大于 `1` ，且不存在除 `1` 和自身之外的正整数因子，则认为该整数是一个质数。
* 如果存在整数 `i` ，使得 `nums[i][i] = val` 或者 `nums[i][nums.length - i - 1]= val` ，则认为整数 `val` 位于 `nums` 的一条对角线上。

![](https://assets.leetcode.com/uploads/2023/03/06/screenshot-2023-03-06-at-45648-pm.png)

在上图中，一条对角线是 **[1,5,9]** ，而另一条对角线是 **[3,5,7]** 。

**示例 1：**

```
输入：nums = [[1,2,3],[5,6,7],[9,10,11]]
输出：11
解释：数字 1、3、6、9 和 11 是所有 "位于至少一条对角线上" 的数字。由于 11 是最大的质数，故返回 11 。
```

**示例 2：**

```
输入：nums = [[1,2,3],[5,17,7],[9,11,10]]
输出：17
解释：数字 1、3、9、10 和 17 是所有满足"位于至少一条对角线上"的数字。由于 17 是最大的质数，故返回 17 。
```

**提示：**

* `1 <= nums.length <= 300`
* `nums.length == numsi.length`
* `1 <= nums[i][j] <= 4*106`

##### 判断质数

```js
/**
 * @param {number[][]} nums
 * @return {number}
 */
var diagonalPrime = function(nums) {
    let mx = 0, n = nums.length;
    for (let i = 0; i < n; i++) {
        if (isPrime(nums[i][i])) {
            mx = Math.max(mx, nums[i][i]);
        }
        if (isPrime(nums[i][n - 1 - i])) {
            mx = Math.max(mx, nums[i][n - 1 - i]);
        }
    }
    return mx;
};

function isPrime(x) {
    if (x < 2) return false;
    let sqrt = Math.sqrt(x);
    for (let i = 2; i <= sqrt; i++) {
        if (x % i == 0) return false;
    }
    return true;
}
```

#### [3115. 质数的最大距离](https://leetcode.cn/problems/maximum-prime-difference/description/)

给你一个整数数组 `nums`。

返回两个（不一定不同的）质数在 `nums` 中 **下标** 的 **最大距离**。

**示例 1：**

**输入：** nums = [4,2,9,5,3]

**输出：** 3

**解释：** `nums[1]`、`nums[3]` 和 `nums[4]` 是质数。因此答案是 `|4 - 1| = 3`。

**示例 2：**

**输入：** nums = [4,8,2,8]

**输出：** 0

**解释：** `nums[2]` 是质数。因为只有一个质数，所以答案是 `|2 - 2| = 0`。

**提示：**

* `1 <= nums.length <= 3 * 105`
* `1 <= nums[i] <= 100`
* 输入保证 `nums` 中至少有一个质数。

##### 筛质数

```js
/**
 * LeetCode提交代码 - 最大质数差（筛法优化版）
 * 该文件包含使用埃拉托斯特尼筛法预处理质数表来计算数组中质数索引差的解决方案
 * @file leetcode_submissions_2025-10-10.md
 * @date 2025-10-10
 */

/**
 * 计算数组中第一个和最后一个质数元素的索引差
 * 使用预计算的质数表进行优化，适用于频繁调用场景
 * @param {number[]} nums - 包含数字的数组（假设元素值不超过100）
 * @return {number} 数组中第一个质数索引与最后一个质数索引的差值
 * @note 假设数组中至少包含一个质数元素，且元素值在0-100范围内
 */
var maximumPrimeDifference = function(nums) {
    let mx, mn; // mx存储最后一个质数的索引，mn存储第一个质数的索引
    
    // 从数组头部开始查找第一个质数的索引
    for (let i = 0; i < nums.length; i++) {
        if (isPrime[nums[i]]) { // 使用预计算的质数表进行O(1)时间复杂度的质数判断
            mn = i;
            break;
        }
    }
    
    // 从数组尾部开始查找最后一个质数的索引
    for (let i = nums.length - 1; i >= 0; i--) {
        if (isPrime[nums[i]]) { // 使用预计算的质数表进行质数判断
            mx = i;
            break;
        }
    }
    
    // 返回两个索引的差值
    return mx - mn;
};

/**
 * 质数表的最大值边界
 * @constant {number} MX - 质数表覆盖的最大数值（包含）
 */
const MX = 101;

/**
 * 预计算的质数表，使用埃拉托斯特尼筛法生成
 * @constant {boolean[]} isPrime - 布尔数组，isPrime[x]为true表示x是质数
 * @note 数组索引对应数值，值为1表示是质数，0表示非质数
 */
const isPrime = Array(101).fill(1); // 初始化数组，假设所有数都是质数
isPrime[0] = isPrime[1] = 0; // 0和1不是质数

/**
 * 使用埃拉托斯特尼筛法生成质数表
 * @description 埃拉托斯特尼筛法的核心思想是：如果i是质数，则i的所有倍数都不是质数
 * @time O(MX log log MX) - 埃拉托斯特尼筛法的时间复杂度
 * @space O(MX) - 存储质数表的空间复杂度
 */
for (let i = 2; i < MX; i++) {
    // 只有当i是质数时，才需要标记其倍数为非质数
    if (isPrime[i]) {
        for (let j = i; j * i < MX; j++) {
            isPrime[i * j] = 0; // 标记i的倍数为非质数
        }
    }
}

```

##### 判断质数

```js
/**
 * LeetCode提交代码 - 最大质数差
 * 该文件包含计算数组中第一个和最后一个质数索引差的解决方案
 * @file leetcode_submissions_2025-10-10.md
 * @date 2025-10-10
 */

/**
 * 计算数组中第一个和最后一个质数元素的索引差
 * @param {number[]} nums - 包含数字的数组
 * @return {number} 数组中第一个质数索引与最后一个质数索引的差值
 * @note 假设数组中至少包含一个质数元素
 */
var maximumPrimeDifference = function(nums) {
    let mx, mn; // mx存储最后一个质数的索引，mn存储第一个质数的索引
    
    // 从数组头部开始查找第一个质数的索引
    for (let i = 0; i < nums.length; i++) {
        if (isPrime(nums[i])) {
            mn = i;
            break;
        }
    }
    
    // 从数组尾部开始查找最后一个质数的索引
    for (let i = nums.length - 1; i >= 0; i--) {
        if (isPrime(nums[i])) {
            mx = i;
            break;
        }
    }
    
    // 返回两个索引的差值
    return mx - mn;
};

/**
 * 判断一个数字是否为质数
 * @param {number} x - 待判断的数字
 * @return {boolean} 如果x是质数则返回true，否则返回false
 * @note 质数定义为大于1的自然数，除了1和它本身没有其他因数
 * @time O(√x) - 判断质数的时间复杂度为O(√x)，其中x为输入数字
 */
function isPrime(x) {
    let sqrt = Math.sqrt(x); // 计算x的平方根，优化质数判断
    
    // 检查从2到sqrt(x)的所有数是否能整除x
    for (let i = 2; i <= sqrt; i++) {
        if (x % i == 0) return false; // 若能被整除，则不是质数
    }

    return x !== 1; // 1不是质数，其他情况如果通过上面的循环则是质数
}

```

#### [3147. 从魔法师身上吸取的最大能量](https://leetcode.cn/problems/taking-maximum-energy-from-the-mystic-dungeon/description/)

在神秘的地牢中，`n` 个魔法师站成一排。每个魔法师都拥有一个属性，这个属性可以给你提供能量。有些魔法师可能会给你负能量，即从你身上吸取能量。

你被施加了一种诅咒，当你从魔法师 `i` 处吸收能量后，你将被立即传送到魔法师 `(i + k)` 处。这一过程将重复进行，直到你到达一个不存在 `(i + k)` 的魔法师为止。

换句话说，你将选择一个起点，然后以 `k` 为间隔跳跃，直到到达魔法师序列的末端，**在过程中吸收所有的能量**。

给定一个数组 `energy` 和一个整数`k`，返回你能获得的 **最大** 能量。

**示例 1：**

**输入：** energy = [5,2,-10,-5,1], k = 3

**输出：** 3

**解释：**可以从魔法师 1 开始，吸收能量 2 + 1 = 3。

**示例 2：**

**输入：** energy = [-2,-3,-1], k = 2

**输出：** -1

**解释：**可以从魔法师 2 开始，吸收能量 -1。

**提示：**

* `1 <= energy.length <= 105`
* `-1000 <= energy[i] <= 1000`
* `1 <= k <= energy.length - 1`

##### 贪心 逆序思维

```js
/**
 * @param {number[]} energy
 * @param {number} k
 * @return {number}
 */
var maximumEnergy = function (energy, k) {
    const n = energy.length;
    let ans = -Infinity;
    for (let i = n - 1; i >= 0; i--) {
        if (i + k < n) {
            energy[i] = energy[i] + energy[i + k];
        }
        ans = ans > energy[i] ? ans : energy[i];
    }
    return ans;
};
```

