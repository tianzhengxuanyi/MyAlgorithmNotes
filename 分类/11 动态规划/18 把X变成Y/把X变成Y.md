### 把X变成Y

#### [397. 整数替换](https://leetcode.cn/problems/integer-replacement/description/)

给定一个正整数 n ，你可以做如下操作：

- 如果 n 是偶数，则用 n / 2替换 n 。
- 如果 n 是奇数，则可以用 n + 1或n - 1替换 n 。

返回 n 变为 1 所需的 最小替换次数 。


```js
/**
 * 将整数n通过特定操作变为1所需的最小步骤数
 * 操作规则：
 * 1. 如果n是偶数，可以除以2
 * 2. 如果n是奇数，可以加1或减1
 * @param {number} n - 输入的整数
 * @return {number} - 最小操作次数
 */
var integerReplacement = function(n) {
    // 使用记忆化搜索来优化递归
    const dfs = (n) => {
        // 如果已经计算过该值，直接返回缓存结果
        if (memo.has(n)) return memo.get(n);
        // 基准情况：当n=1时不需要任何操作
        if (n === 1) return 0;
        
        let res;
        // 偶数情况：只能除以2
        if (n % 2 === 0) {
            res = dfs(n / 2) + 1;  // 当前操作+子问题的解
        } else {
            // 奇数情况：可以选择加1或减1，取两者中较小的
            res = Math.min(dfs(n + 1), dfs(n - 1)) + 1;
        }
        // 将计算结果存入缓存
        memo.set(n, res);

        return res;
    }

    return dfs(n);
};

// 使用Map来缓存中间结果，避免重复计算
const memo = new Map();

```

**迭代 + 向下取整**

[方法三](https://leetcode.cn/problems/integer-replacement/solutions/1108099/zheng-shu-ti-huan-by-leetcode-solution-swef/)


```js
/**
 * 将整数n通过特定操作变为1所需的最小步骤数（迭代版本）
 * 操作规则：
 * 1. 如果n是偶数，可以除以2
 * 2. 如果n是奇数，可以加1或减1
 * @param {number} n - 输入的整数
 * @return {number} - 最小操作次数
 */
var integerReplacement = function (n) {
    let ans = 0;  // 记录操作次数
    
    // 循环直到n变为1
    while (n !== 1) {
        // 偶数情况：直接除以2
        if (n % 2 == 0) {
            ans += 1;  // 操作次数+1
            n = n / 2;  // 执行除以2操作
        } 
        // 奇数且n%4==1的情况：减1比加1更优
        else if (n % 4 == 1) {
            ans += 2;  // 减1然后除以2，共2步操作
            n = Math.floor(n / 2);  // 相当于(n-1)/2
        } 
        // 其他奇数情况
        else {
            // 特殊情况：n=3时，减1比加1更优
            if (n === 3) {
                ans += 2;  // 3→2→1，共2步
                n = 1;
            } 
            // 一般奇数情况：加1比减1更优
            else {
                ans += 2;  // 加1然后除以2，共2步操作
                n = Math.floor(n / 2) + 1;  // 相当于(n+1)/2
            }
        }
    }

    return ans;  // 返回总操作次数
};

```

#### [2998. 使 X 和 Y 相等的最少操作次数](https://leetcode.cn/problems/minimum-number-of-operations-to-make-x-and-y-equal/)
 
给你两个正整数 x 和 y 。

一次操作中，你可以执行以下四种操作之一：

- 如果 x 是 11 的倍数，将 x 除以 11 。
- 如果 x 是 5 的倍数，将 x 除以 5 。
- 将 x 减 1 。
- 将 x 加 1 。

请你返回让 x 和 y 相等的 最少 操作次数。

**题解：**

定义dp[i]为将i变为y的最少操作次数

状态转移：
- 如果i % 11的余数为m
  - m <= 5, 可以先操作m次减1变为11的倍数，再除以11; dp[i] = dp[Math.floor(i / 11)] + m + 1
  - m > 5, 可以先操作(11-m)次加1变为11的倍数，再除以11; dp[i] = dp[Math.floor(i / 11) + 1] + (11 - m) + 1
- 如果i % 5的余数为m
  - m <= 2, 可以先操作m次减1变为5的倍数，再除以5; dp[i] = dp[Math.floor(i / 5)] + m + 1
  - m > 2, 可以先操作(5-m)次加1变为5的倍数，再除以5; dp[i] = dp[Math.floor(i / 5) + 1] + (5 - m) + 1

边际情况：
- 如果x === y，返回0
- 如果x < y，返回y - x

```js
/**
 * 计算将整数x变为y所需的最少操作次数
 * 支持的操作:
 * 1. 如果x是11的倍数，将x除以11
 * 2. 如果x是5的倍数，将x除以5
 * 3. 将x减1
 * 4. 将x加1
 * @param {number} x - 起始整数
 * @param {number} y - 目标整数
 * @return {number} - 最少操作次数
 */
var minimumOperationsToMakeEqual = function (x, y) {
    // 记忆化缓存：存储已计算过的数值对应的最少操作次数
    const memo = new Map();
    
    /**
     * 深度优先搜索计算将数值i变为y的最少操作次数
     * @param {number} i - 当前需要处理的数值
     * @return {number} - 最少操作次数
     */
    const dfs = (i) => {
        // 基础情况：当i小于等于y时，只能通过加1操作达到y，操作次数为y-i
        if (i <= y) {
            memo.set(i, y - i);
        }
        
        // 缓存命中：如果已计算过i的结果，直接返回缓存值
        if (memo.has(i)) {
            return memo.get(i);
        }
        
        // 初始化为最坏情况：一直减1直到y的操作次数
        let res = i - y;
        
        // 处理11的倍数情况
        if (i % 11 <= 5) {
            // 余数<=5：先减余数变为11的倍数，再除以11（共余数+1次操作）
            res = Math.min(res, dfs(Math.floor(i / 11)) + i % 11 + 1);
        } else {
            // 余数>5：先加(11-余数)变为11的倍数，再除以11（共(11-余数)+1次操作）
            res = Math.min(res, dfs(Math.floor(i / 11) + 1) + 11 - i % 11 + 1);
        }
        
        // 处理5的倍数情况
        if (i % 5 <= 2) {
            // 余数<=2：先减余数变为5的倍数，再除以5（共余数+1次操作）
            res = Math.min(res, dfs(Math.floor(i / 5)) + i % 5 + 1);
        } else {
            // 余数>2：先加(5-余数)变为5的倍数，再除以5（共(5-余数)+1次操作）
            res = Math.min(res, dfs(Math.floor(i / 5) + 1) + 5 - i % 5 + 1);
        }
        
        // 将计算结果存入缓存
        memo.set(i, res);
        return res;
    }

    // 从初始值x开始递归计算
    return dfs(x);
};

```


