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