### 2025-10-24

#### [633. 平方数之和](https://leetcode.cn/problems/sum-of-square-numbers/description/)

给定一个非负整数 `c` ，你要判断是否存在两个整数 `a` 和 `b`，使得 `a2 + b2 = c` 。

**示例 1：**

```
输入：c = 5
输出：true
解释：1 * 1 + 2 * 2 = 5
```

**示例 2：**

```
输入：c = 3
输出：false
```

**提示：**

* `0 <= c <= 231 - 1`

##### 双指针

```js
/**
 * @param {number} c
 * @return {boolean}
 */
var judgeSquareSum = function(c) {
    let left = 0, right = Math.floor(Math.sqrt(c));
    while (left <= right) {
        let t = left * left + right * right;
        if (t == c) {
            return true;
        } else if (t > c) {
            right--;
        } else {
            left++;
        }
    }

    return false;
};
```

#### [2048. 下一个更大的数值平衡数](https://leetcode.cn/problems/next-greater-numerically-balanced-number/description/)

如果整数  `x` 满足：对于每个数位 `d` ，这个数位 **恰好** 在 `x` 中出现 `d` 次。那么整数 `x` 就是一个 **数值平衡数** 。

给你一个整数 `n` ，请你返回 **严格大于** `n` 的 **最小数值平衡数** 。

**示例 1：**

```
输入：n = 1
输出：22
解释：
22 是一个数值平衡数，因为：
- 数字 2 出现 2 次 
这也是严格大于 1 的最小数值平衡数。
```

**示例 2：**

```
输入：n = 1000
输出：1333
解释：
1333 是一个数值平衡数，因为：
- 数字 1 出现 1 次。
- 数字 3 出现 3 次。 
这也是严格大于 1000 的最小数值平衡数。
注意，1022 不能作为本输入的答案，因为数字 0 的出现次数超过了 0 。
```

**示例 3：**

```
输入：n = 3000
输出：3133
解释：
3133 是一个数值平衡数，因为：
- 数字 1 出现 1 次。
- 数字 3 出现 3 次。 
这也是严格大于 3000 的最小数值平衡数。
```

**提示：**

* `0 <= n <= 106`

##### 预处理 + 二分

```js
/**
 * @param {number} n
 * @return {number}
 */
var nextBeautifulNumber = function (n) {
    let l = 0, r = balaceNums.length - 1;
    while (l <= r) {
        let m = Math.floor((r - l) / 2) +l;
        if (balaceNums[m] < n + 1) {
            l = m +1;
        } else {
            r = m - 1;
        }
    }
    return balaceNums[l] == n ? balaceNums[l + 1] : balaceNums[l]; 
};


const MX = 1e6;
const balaceNums = [0];

const getDigitCnt = (x) => {
    let cnt = Array(10).fill(0);
    while (x) {
        cnt[x % 10] += 1;
        x = Math.floor(x / 10);
    }
    return cnt;
}

outer: for (let i = 1; i <= MX; i++) {
    let cnt = getDigitCnt(i);
    for (let k = 0; k <= 9; k++) {
        if (cnt[k] > 0 && k != cnt[k]) {
            continue outer;
        }
    }
    balaceNums.push(i);
}
balaceNums.push(1224444);
```

