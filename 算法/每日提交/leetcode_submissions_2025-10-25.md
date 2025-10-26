### 2025-10-25

#### [878. 第 N 个神奇数字](https://leetcode.cn/problems/nth-magical-number/description/)

一个正整数如果能被 `a` 或 `b` 整除，那么它是神奇的。

给定三个整数 `n` , `a` , `b` ，返回第 `n` 个神奇的数字。因为答案可能很大，所以返回答案 **对**`109 + 7` **取模**后的值。



**示例 1：**

```
输入：n = 1, a = 2, b = 3
输出：2
```

**示例 2：**

```
输入：n = 4, a = 2, b = 3
输出：6
```

**提示：**

* `1 <= n <= 109`
* `2 <= a, b <= 4 * 104`

##### 二分  第n个数之前有 i个 a的倍数 j个b的倍数  c个 lcm(a, b)的倍数   n = i + j - c

```js
/**
 * @param {number} n
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
var nthMagicalNumber = function (n, a, b) {
    let mn = Math.min(a, b), l = mn, r = n * mn;
    let c = lcm(a, b);
    const check = (x) => {
        let ma = Math.floor(x / a), mb = Math.floor(x / b),
            mab = Math.floor(x / c);
        return (ma + mb - mab)
    }

    while (l <= r) {
        let mid = Math.floor((r - l) / 2) + l;
        if (check(mid) < n) {
            l = mid + 1;
        } else {
            r = mid - 1;
        }
    }

    return l % MOD;
};

const MOD = 1e9 + 7;

const gcd = (x, y) => {
    while (y) {
        let t = x % y;
        x = y, y = t;
    }

    return x;
}

const lcm = (x, y) => x * y / gcd(x, y);
```

#### [2652. 倍数求和](https://leetcode.cn/problems/sum-multiples/description/)

给你一个正整数 `n` ，请你计算在 `[1，n]` 范围内能被 `3`、`5`、`7` 整除的所有整数之和。

返回一个整数，用于表示给定范围内所有满足约束条件的数字之和。

**示例 1：**

```
输入：n = 7
输出：21
解释：在 [1, 7] 范围内能被 3、5、7 整除的所有整数分别是 3、5、6、7 。数字之和为 21。
```

**示例 2：**

```
输入：n = 10
输出：40
解释：在 [1, 10] 范围内能被 3、5、7 整除的所有整数分别是 3、5、6、7、9、10 。数字之和为 40。
```

**示例 3：**

```
输入：n = 9
输出：30
解释：在 [1, 9] 范围内能被 3、5、7 整除的所有整数分别是 3、5、6、7、9 。数字之和为 30。
```

**提示：**

* 1 <= n <= 103

##### 容斥原理：计算3的倍数和、5的倍数和、7的倍数和

```js
/**
 * @param {number} n
 * @return {number}
 */
var sumOfMultiples = function (n) {
    return sub(3, n) + sub(5, n) + sub(7, n) - sub(15, n) -
        sub(21, n) - sub(35, n) + sub(105, n);
};

const sub = (m, n) => {
    let c = Math.floor(n / m);
    return m * c * (1 + c) / 2;
}
```

##### 遍历

```js
/**
 * @param {number} n
 * @return {number}
 */
var sumOfMultiples = function(n) {
    let s = 0;
    for (let i = 3; i <= n; i++) {
        if (i % 3 == 0 || i % 5 == 0 || i % 7 == 0) {
            s += i;
        }
    }

    return s;
};
```

#### [1641. 统计字典序元音字符串的数目](https://leetcode.cn/problems/count-sorted-vowel-strings/description/)

给你一个整数 `n`，请返回长度为 `n` 、仅由元音 (`a`, `e`, `i`, `o`, `u`) 组成且按 **字典序排列** 的字符串数量。

字符串 `s` 按 **字典序排列** 需要满足：对于所有有效的 `i`，`s[i]` 在字母表中的位置总是与 `s[i+1]` 相同或在 `s[i+1]` 之前。

**示例 1：**

```
输入：n = 1
输出：5
解释：仅由元音组成的 5 个字典序字符串为 ["a","e","i","o","u"]
```

**示例 2：**

```
输入：n = 2
输出：15
解释：仅由元音组成的 15 个字典序字符串为
["aa","ae","ai","ao","au","ee","ei","eo","eu","ii","io","iu","oo","ou","uu"]
注意，"ea" 不是符合题意的字符串，因为 'e' 在字母表中的位置比 'a' 靠后
```

**示例 3：**

```
输入：n = 33
输出：66045
```

**提示：**

* `1 <= n <= 50`

##### DP

```js
/**
 * @param {number} n
 * @return {number}
 */
var countVowelStrings = function (n) {
    const memo = Array.from({ length: 6 }, () => Array(n + 1).fill(-1));
    const dfs = (i, r) => {
        if (r == 0) return memo[i][r] = 1;
        if (i >= 5) return 0;
        if (memo[i][r] >= 0) return memo[i][r];
        let res = 0;
        for (let j = 0; j <= r; j++) {
            res += dfs(i + 1, r - j);
        }

        return memo[i][r] = res;
    }


    return dfs(0, n);
};
```

##### n个盒子放m个球，允许盒子为空

```js
/**
 * @param {number} n
 * @return {number}
 */
var countVowelStrings = function(n) {
    // n个盒子放m个球，不允许盒子为空  C[m - 1][n - 1]
    // n个盒子放m个球，允许盒子为空    C[m + n - 1][n - 1]

    // 5个盒子放n个球，允许盒子为空    C[5 + n - 1][4]
    return (n + 4) * (n + 3) * (n + 2) * (n + 1) / 24;
};
```

#### [1359. 有效的快递序列数目](https://leetcode.cn/problems/count-all-valid-pickup-and-delivery-options/description/)

给你 `n` 笔订单，每笔订单都需要快递服务。

计算所有有效的 取货 / 交付 可能的顺序，使 delivery(i) 总是在 pickup(i) 之后。

由于答案可能很大，请返回答案对 10^9 + 7 取余的结果。

**示例 1：**

```
输入：n = 1
输出：1
解释：只有一种序列 (P1, D1)，物品 1 的配送服务（D1）在物品 1 的收件服务（P1）后。
```

**示例 2：**

```
输入：n = 2
输出：6
解释：所有可能的序列包括：
(P1,P2,D1,D2)，(P1,P2,D2,D1)，(P1,D1,P2,D2)，(P2,P1,D1,D2)，(P2,P1,D2,D1) 和 (P2,D2,P1,D1)。
(P1,D2,P2,D1) 是一个无效的序列，因为物品 2 的收件服务（P2）不应在物品 2 的配送服务（D2）之后。
```

**示例 3：**

```
输入：n = 3
输出：90
```

**提示：**

* `1 <= n <= 500`

##### 全排(2n)! 排除顺序的2^n个

```js
/**
 * @param {number} n
 * @return {number}
 */
var countOrders = function(n) {
    let f = 1n;
    for (let i = 1; i <= 2 * n; i++) {
        f = f * BigInt(i) % MOD;
    }
    let p = 1n;
    for (let i = 1; i <= n; i++) {
        p = 2n * p % MOD;
    }
    return Number(f * pow(p, MOD - 2n) % MOD);
};

const MOD = BigInt(1e9 + 7);

const pow = (x, n) => {
    x = BigInt(x)
    let res = 1n;
    while (n) {
        if (n & 1n) {
            res = res * x % MOD;
        }
        x = x * x % MOD;
        n = n >> 1n;
    }
    return res;
}
```

#### [3179. K 秒后第 N 个元素的值](https://leetcode.cn/problems/find-the-n-th-value-after-k-seconds/description/)

给你两个整数 `n` 和 `k`。

最初，你有一个长度为 `n` 的整数数组 `a`，对所有 `0 <= i <= n - 1`，都有 `a[i] = 1` 。每过一秒，你会同时更新每个元素为其前面所有元素的和加上该元素本身。例如，一秒后，`a[0]` 保持不变，`a[1]` 变为 `a[0] + a[1]`，`a[2]` 变为 `a[0] + a[1] + a[2]`，以此类推。

返回 `k` 秒后 `a[n - 1]` 的**值**。

由于答案可能非常大，返回其对 `109 + 7` **取余** 后的结果。

**示例 1：**

**输入：**n = 4, k = 5

**输出：**56

**解释：**

| 时间（秒） | 数组状态 |
| --- | --- |
| 0 | [1,1,1,1] |
| 1 | [1,2,3,4] |
| 2 | [1,3,6,10] |
| 3 | [1,4,10,20] |
| 4 | [1,5,15,35] |
| 5 | [1,6,21,56] |

**示例 2：**

**输入：**n = 5, k = 3

**输出：**35

**解释：**

| 时间（秒） | 数组状态 |
| --- | --- |
| 0 | [1,1,1,1,1] |
| 1 | [1,2,3,4,5] |
| 2 | [1,3,6,10,15] |
| 3 | [1,4,10,20,35] |

**提示：**

* `1 <= n, k <= 1000`

##### a[i][j] = a[i - 1][j] + a[i][j - 1]等价于C[i + j][i]

```js
/**
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var valueAfterKSeconds = function (n, k) {
    // a[i][j] = a[i - 1][j] + a[i][j - 1]
    // 从[0, 0] 到 [i, j] 的路径数，从 i + j步中选取i步向下，j步向右C[i + j][j] 或 C[i + j][i]

    return Number(comb(k + n - 1, k) % MOD);
};

const MOD = BigInt(1e9 + 7);
const MX = 2000;

const f = Array(MX);
f[0] = 1n;

for (let i = 1; i < MX; i++) {
    f[i] = f[i - 1] * BigInt(i) % MOD;
}

const pow = (x, n) => {
    x = BigInt(x);
    let res = 1n;
    while (n) {
        if (n & 1n) {
            res = res * x % MOD;
        }
        x = x * x % MOD;
        n = n >> 1n;
    }
    return res;
}
const invF = Array(MX);
invF[MX - 1] = pow(f[MX - 1], MOD - 2n);

for (let i = MX - 2; i >= 0; i--) {
    invF[i] = invF[i + 1] * BigInt(i + 1) % MOD;
}


const comb = (n, k) => {
    return f[n] * invF[k] * invF[n - k];
}

```

##### 模拟

```js
/**
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var valueAfterKSeconds = function(n, k) {
    const a = Array(n).fill(1);
    for (let i = 0; i < k; i++) {
        for (let j = 1; j < n; j++) {
            a[j] = (a[j - 1] + a[j]) % MOD;
        }
    }

    return a[n - 1];
};

const MOD = 1e9 + 7;
```

#### [1175. 质数排列](https://leetcode.cn/problems/prime-arrangements/description/)

请你帮忙给从 `1` 到 `n` 的数设计排列方案，使得所有的「质数」都应该被放在「质数索引」（索引从 1 开始）上；你需要返回可能的方案总数。

让我们一起来回顾一下「质数」：质数一定是大于 1 的，并且不能用两个小于它的正整数的乘积来表示。

由于答案可能会很大，所以请你返回答案 **模 mod `10^9 + 7`** 之后的结果即可。

**示例 1：**

```
输入：n = 5
输出：12
解释：举个例子，[1,2,5,4,3] 是一个有效的排列，但 [5,2,3,4,1] 不是，因为在第二种情况里质数 5 被错误地放在索引为 1 的位置上。
```

**示例 2：**

```
输入：n = 100
输出：682289015
```

**提示：**

* `1 <= n <= 100`

##### 判断质数  排列数

```js
/**
 * @param {number} n
 * @return {number}
 */
var numPrimeArrangements = function (n) {
    let pCnt = cnt[n];
    let p1 = 1n;
    for (let i = 1; i <= pCnt; i++) {
        p1 = (p1 * BigInt(i)) % MOD;
    }
    let p2 = 1n;
    for (let i = 1; i <= n - pCnt; i++) {
        p2 = (p2 * BigInt(i)) % MOD;
    }
    return Number(p1 * p2 % MOD);
};

const MOD = BigInt(1e9 + 7);
const MAX = 100;
const isPrime = Array(MAX + 1).fill(1);
isPrime[0] = isPrime[1] = 0;
for (let i = 2; i <= MAX; i++) {
    if (isPrime[i]) {
        for (let j = i; j * i <= MAX; j++) {
            isPrime[i * j] = 0;
        }
    }
}
const cnt = Array(MAX + 1).fill(0);

for (let i = 2; i <= MAX; i++) {
    cnt[i] = cnt[i - 1] + isPrime[i];
}


```

#### [357. 统计各位数字都不同的数字个数](https://leetcode.cn/problems/count-numbers-with-unique-digits/description/)

给你一个整数 `n` ，统计并返回各位数字都不同的数字 `x` 的个数，其中 `0 <= x < 10n`。

**示例 1：**

```
输入：n = 2
输出：91
解释：答案应为除去 11、22、33、44、55、66、77、88、99 外，在 0 ≤ x < 100 范围内的所有数字。
```

**示例 2：**

```
输入：n = 0
输出：1
```

**提示：**

* `0 <= n <= 8`

##### 组合计算 一次遍历

```js
/**
 * @param {number} n
 * @return {number}
 */
var countNumbersWithUniqueDigits = function (n) {
    if (n == 0) return 1;
    if (n == 1) return 10;
    let ans = 10, cnt = 9;
    for (let i = 2; i <= n; i++) {
        cnt = cnt * (9 - i + 2)
        ans += cnt;
    }

    return ans;
};
```

#### [1573. 分割字符串的方案数](https://leetcode.cn/problems/number-of-ways-to-split-a-string/description/)

给你一个二进制串 `s`  （一个只包含 0 和 1 的字符串），我们可以将 `s` 分割成 3 个 **非空** 字符串 s1, s2, s3 （s1 + s2 + s3 = s）。

请你返回分割 `s` 的方案数，满足 s1，s2 和 s3 中字符 '1' 的数目相同。

由于答案可能很大，请将它对 10^9 + 7 取余后返回。

**示例 1：**

```
输入：s = "10101"
输出：4
解释：总共有 4 种方法将 s 分割成含有 '1' 数目相同的三个子字符串。
"1|010|1"
"1|01|01"
"10|10|1"
"10|1|01"
```

**示例 2：**

```
输入：s = "1001"
输出：0
```

**示例 3：**

```
输入：s = "0000"
输出：3
解释：总共有 3 种分割 s 的方法。
"0|0|00"
"0|00|0"
"00|0|0"
```

**示例 4：**

```
输入：s = "100100010100110"
输出：12
```

**提示：**

* `s[i] == '0'` 或者 `s[i] == '1'`
* `3 <= s.length <= 10^5`

##### 模拟，哈希记录1的位置，计算分割处中间的0的位置

```js
/**
 * @param {string} s
 * @return {number}
 */
var numWays = function (s) {
    const n = s.length;
    const pos = new Map();
    let total = 0;
    for (let i = 0; i < n; i++) {
        total += (+s[i]);
        if (s[i] == 1) {
            pos.set(total, i);
        }
    }
    if (total % 3 !== 0) return 0;
    if (total == 0) {
        return ((n - 1) * (n - 2) / 2) % MOD;
    }

    let part = total / 3, part2 = 2 * part;
    let cnt1 = pos.get(part + 1) - pos.get(part);
    let cnt2 = pos.get(part2 + 1) - pos.get(part2);
    return cnt1 * cnt2 % MOD;
};

const MOD = 1e9 + 7;
```

##### 模拟

```js
/**
 * @param {string} s
 * @return {number}
 */
var numWays = function (s) {
    const n = s.length;
    let total = 0;
    for (let i = 0; i < n; i++) {
        total += (+s[i]);
    }
    if (total % 3 !== 0) return 0;
    if (total == 0) {
        return ((n - 1) * (n - 2) / 2) % MOD;
    }

    let part = total / 3;
    let cnt1 = 0, sum1 = 0;
    for (let i = 0; i < n; i++) {
        sum1 += +s[i];
        if (sum1 == part) {
            cnt1++;
        } else if (sum1 > part) {
            break;
        }
    }
    let cnt2 = 0, sum2 = 0;
    for (let i = n - 1; i >= 0; i--) {
        sum2 += +s[i];
        if (sum2 == part) {
            cnt2++;
        } else if (sum2 > part) {
            break;
        }
    }

    return cnt1 * cnt2 % MOD;
};

const MOD = 1e9 + 7;
```
