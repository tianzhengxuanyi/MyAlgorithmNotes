### 2025-10-20

#### [1250. 检查「好数组」](https://leetcode.cn/problems/check-if-it-is-a-good-array/description/)

给你一个正整数数组 `nums`，你需要从中任选一些子集，然后将子集中每一个数乘以一个 **任意整数**，并求出他们的和。

假如该和结果为 `1`，那么原数组就是一个「**好数组**」，则返回 `True`；否则请返回 `False`。

**示例 1：**

```
输入：nums = [12,5,7,23]
输出：true
解释：挑选数字 5 和 7。
5*3 + 7*(-2) = 1
```

**示例 2：**

```
输入：nums = [29,6,10]
输出：true
解释：挑选数字 29, 6 和 10。
29*1 + 6*(-3) + 10*(-1) = 1
```

**示例 3：**

```
输入：nums = [3,6]
输出：false
```

**提示：**

* `1 <= nums.length <= 10^5`
* `1 <= nums[i] <= 10^9`

##### 裴蜀定理 ax +by = gcd(a, b)

```js
/**
 * 判断一个数组是否为「好数组」
 * 好数组定义：如果存在不全部为0的整数组合 a1, a2, ..., an，使得 a1*nums[0] + a2*nums[1] + ... + an*nums[n-1] = 1
 * @param {number[]} nums - 输入的整数数组
 * @return {boolean} 如果数组是好数组则返回true，否则返回false
 * @note 算法基于贝祖定理：一组数的最大公约数为1当且仅当它们的线性组合可以得到1
 *       因此问题转化为求数组所有元素的最大公约数是否为1
 */
var isGoodArray = function(nums) {
    // 处理边界情况：如果数组只有一个元素，则该元素必须为1才是好数组
    if (nums.length == 1) return nums[0] == 1;
    
    // 初始化最大公约数为第一个元素
    let g = nums[0];
    
    // 遍历数组，逐步计算当前最大公约数与下一个元素的最大公约数
    for (let i = 1; i < nums.length; i++) {
        g = gcd(g, nums[i]);
        
        // 优化：如果当前最大公约数已经为1，可以提前返回true
        if (g == 1) return true;
    }
    
    // 如果遍历完数组后最大公约数仍不为1，则返回false
    return false;
};

/**
 * 计算两个非负整数的最大公约数（GCD）
 * 使用欧几里得算法（辗转相除法）实现
 * @param {number} x - 第一个非负整数
 * @param {number} y - 第二个非负整数
 * @return {number} 两个数的最大公约数
 * @complexity 时间复杂度 O(log(min(x,y)))，空间复杂度 O(1)
 */
const gcd = (x, y) => {
    // 欧几里得算法核心逻辑：不断用较大数对较小数取模，直到余数为0
    while (y) {
        let t = x % y; // 计算余数
        x = y;        // 将除数作为新的被除数
        y = t;        // 将余数作为新的除数
    }
    // 当余数为0时，被除数即为最大公约数
    return x;
};

```

#### [1071. 字符串的最大公因子](https://leetcode.cn/problems/greatest-common-divisor-of-strings/description/)

对于字符串 `s` 和 `t`，只有在 `s = t + t + t + ... + t + t`（`t` 自身连接 1 次或多次）时，我们才认定 “`t` 能除尽 `s`”。

给定两个字符串 `str1` 和 `str2` 。返回 *最长字符串 `x`，要求满足 `x` 能除尽 `str1` 且 `x` 能除尽 `str2`* 。

**示例 1：**

```
输入：str1 = "ABCABC", str2 = "ABC"
输出："ABC"
```

**示例 2：**

```
输入：str1 = "ABABAB", str2 = "ABAB"
输出："AB"
```

**示例 3：**

```
输入：str1 = "LEET", str2 = "CODE"
输出：""
```

**提示：**

* `1 <= str1.length, str2.length <= 1000`
* `str1` 和 `str2` 由大写英文字母组成

##### 数学 + gcd

```js
/**
 * 计算两个字符串的最大公约数字符串
 * 如果两个字符串可以通过某个子串重复多次组成，则返回该子串的最大可能长度版本
 * @param {string} str1 - 第一个输入字符串
 * @param {string} str2 - 第二个输入字符串
 * @return {string} 两个字符串的最大公约数字符串，如果不存在则返回空字符串
 * @note 算法思路：首先验证两个字符串是否可以通过某个子串重复组成，
 *       验证方法是检查str1+str2是否等于str2+str1
 */
var gcdOfStrings = function(str1, str2) {
    // 关键验证：如果两个字符串可以通过子串重复组成，则它们的拼接顺序不影响结果
    if (str1 + str2 != str2 + str1) return "";
    
    // 计算两个字符串长度的最大公约数，并截取该长度的前缀作为结果
    return str1.slice(0, gcd(str1.length, str2.length));
};

/**
 * 计算两个非负整数的最大公约数（GCD）
 * 使用欧几里得算法（辗转相除法）实现
 * @param {number} x - 第一个非负整数
 * @param {number} y - 第二个非负整数
 * @return {number} 两个数的最大公约数
 * @complexity 时间复杂度 O(log(min(x,y)))，空间复杂度 O(1)
 */
const gcd = (x, y) => {
    // 欧几里得算法核心逻辑：不断用较大数对较小数取模，直到余数为0
    while (y) {
        let t = x % y; // 计算余数
        x = y;        // 将除数作为新的被除数
        y = t;        // 将余数作为新的除数
    }
    // 当余数为0时，被除数即为最大公约数
    return x;
};

```

#### [2011. 执行操作后的变量值](https://leetcode.cn/problems/final-value-of-variable-after-performing-operations/description/)

存在一种仅支持 4 种操作和 1 个变量 `X` 的编程语言：

* `++X` 和 `X++` 使变量 `X` 的值 **加** `1`
* `--X` 和 `X--` 使变量 `X` 的值 **减** `1`

最初，`X` 的值是 `0`

给你一个字符串数组 `operations` ，这是由操作组成的一个列表，返回执行所有操作后，`X` 的 **最终值** 。

**示例 1：**

```
输入：operations = ["--X","X++","X++"]
输出：1
解释：操作按下述步骤执行：
最初，X = 0
--X：X 减 1 ，X =  0 - 1 = -1
X++：X 加 1 ，X = -1 + 1 =  0
X++：X 加 1 ，X =  0 + 1 =  1
```

**示例 2：**

```
输入：operations = ["++X","++X","X++"]
输出：3
解释：操作按下述步骤执行： 
最初，X = 0
++X：X 加 1 ，X = 0 + 1 = 1
++X：X 加 1 ，X = 1 + 1 = 2
X++：X 加 1 ，X = 2 + 1 = 3
```

**示例 3：**

```
输入：operations = ["X++","++X","--X","X--"]
输出：0
解释：操作按下述步骤执行：
最初，X = 0
X++：X 加 1 ，X = 0 + 1 = 1
++X：X 加 1 ，X = 1 + 1 = 2
--X：X 减 1 ，X = 2 - 1 = 1
X--：X 减 1 ，X = 1 - 1 = 0
```

**提示：**

* `1 <= operations.length <= 100`
* `operations[i]` 将会是 `"++X"`、`"X++"`、`"--X"` 或 `"X--"`

##### 模拟

```js
/**
 * @param {string[]} operations
 * @return {number}
 */
var finalValueAfterOperations = function(operations) {
    let ans = 0;
    for (let x of operations) {
        if (x == "++X" || x == "X++") {
            ans++;
        } else {
            ans--;
        }
    }
    return ans;
};
```

