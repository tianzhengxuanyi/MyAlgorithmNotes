### 2025-10-17

#### [507. 完美数](https://leetcode.cn/problems/perfect-number/description/)

对于一个 **正整数**，如果它和除了它自身以外的所有 **正因子** 之和相等，我们称它为 **「完美数」**。

给定一个 **整数**`n`， 如果是完美数，返回 `true`；否则返回 `false`。

**示例 1：**

```
输入：num = 28
输出：true
解释：28 = 1 + 2 + 4 + 7 + 14
1, 2, 4, 7, 和 14 是 28 的所有正因子。
```

**示例 2：**

```
输入：num = 7
输出：false
```

**提示：**

* `1 <= num <= 108`

##### 因子分解

```js
/**
 * 功能：检查一个整数是否为完美数
 * 参数：num - 待检查的整数
 * 返回：布尔值，表示num是否为完美数
 * 算法核心思想：遍历所有可能的因子，计算真因子之和并与原数比较
 * 时间复杂度：O(√n)，只需要遍历到num的平方根
 * 空间复杂度：O(1)，只使用常数额外空间
 * 注：完美数是指一个数等于它所有真因子（除了自身以外的因子）的和
 */
var checkPerfectNumber = function (num) {
    // 初始化真因子和为1（1是任何数的真因子）
    let s = 1;
    
    // 遍历可能的因子，只需遍历到num的平方根
    // 这样可以将时间复杂度优化到O(√n)
    for (let i = 2; i * i <= num; i++) {
        // 如果i是num的因子
        if (num % i == 0) {
            s += i;
            // 注意：当i*i != num时，i和num/i是不同的因子
            if (i * i != num) {
                s += num / i;
            }
        }
    }
    
    // 特殊情况处理：1没有真因子，不是完美数
    // 其他情况下，如果真因子和等于原数，则为完美数
    return num == 1 ? false : s == num;
};

```

#### [3003. 执行操作后的最大分割数量](https://leetcode.cn/problems/maximize-the-number-of-partitions-after-operations/description/)

给你一个下标从 **0** 开始的字符串 `s` 和一个整数 `k`。

你需要执行以下分割操作，直到字符串 `s`变为 **空**：

* 选择 `s` 的最长 **前缀**，该前缀最多包含 `k`个 **不同**字符。
* **删除**这个前缀，并将分割数量加一。如果有剩余字符，它们在 `s` 中保持原来的顺序。

执行操作之 **前** ，你可以将 `s` 中 **至多一处** 下标的对应字符更改为另一个小写英文字母。

在最优选择情形下改变至多一处下标对应字符后，用整数表示并返回操作结束时得到的 **最大** 分割数量。

**示例 1：**

**输入：**s = "accca", k = 2

**输出：**3

**解释：**

最好的方式是把 `s[2]` 变为除了 a 和 c 之外的东西，比如 b。然后它变成了 `"acbca"`。

然后我们执行以下操作：

1. 最多包含 2 个不同字符的最长前缀是 `"ac"`，我们删除它然后 `s` 变为 `"bca"`。
2. 现在最多包含 2 个不同字符的最长前缀是 `"bc"`，所以我们删除它然后 `s` 变为 `"a"`。
3. 最后，我们删除 `"a"` 并且 `s` 变成空串，所以该过程结束。

进行操作时，字符串被分成 3 个部分，所以答案是 3。

**示例 2：**

**输入：**s = "aabaab", k = 3

**输出：**1

**解释：**

一开始 `s` 包含 2 个不同的字符，所以无论我们改变哪个， 它最多包含 3 个不同字符，因此最多包含 3 个不同字符的最长前缀始终是所有字符，因此答案是 1。

**示例 3：**

**输入：**s = "xxyz", k = 1

**输出：**4

**解释：**

最好的方式是将 `s[0]` 或 `s[1]` 变为 `s` 中字符以外的东西，例如将 `s[0]` 变为 `w`。

然后 `s` 变为 `"wxyz"`，包含 4 个不同的字符，所以当 `k` 为 1，它将分为 4 个部分。

**提示：**

* `1 <= s.length <= 104`
* `s` 只包含小写英文字母。
* `1 <= k <= 26`

##### 记忆化缓存

```js
/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var maxPartitionsAfterOperations = function (s, k) {
    const n = s.length;
    // memo[i] 存储从位置i开始，在特定mask和changed状态下的最大分区数
    // 使用Map存储，键为mask | (changed << 26)，值为对应的最大分区数
    const memo = Array.from({length: n}, () => new Map());
    
    /**
     * 深度优先搜索函数
     * @param {number} i - 当前处理的字符索引
     * @param {number} mask - 表示当前分区中已出现的字符的位掩码
     * @param {boolean} changed - 表示是否已经修改过字符
     * @returns {number} 从当前状态开始的最大分区数
     */
    const dfs = (i, mask, changed) => {
        // 基本情况：已经处理完所有字符，返回1（最后一个分区）
        if (i >= n) return 1;
        // 生成记忆化键：使用位运算将changed状态存储在mask的高位
        let mkey = mask | (+changed << 26);
        // 检查是否已经计算过这种状态
        if (memo[i].has(mkey)) return memo[i].get(mkey);
        
        let x = s[i].charCodeAt() - 97;  // 将当前字符转换为0-25的数字
        let res = 0;  // 存储当前状态下的最大分区数
        
        if (changed) {
            // 已经修改过字符，只能使用原字符
            mask |= 1 << x;  // 将当前字符添加到mask中
            if (digitCnt(mask) > k) {
                // 如果添加后不同字符数超过k，必须在此处分割
                res += dfs(i + 1, 1 << x, true) + 1;
            } else {
                // 否则继续当前分区
                res += dfs(i + 1, mask, true);
            }
        } else {
            // 尚未修改字符，尝试将当前字符修改为任意可能的字符（a-z）
            for (let c = 0; c < 26; c++) {
                let n_mask = mask | (1 << c);  // 计算修改后的mask
                if (digitCnt(n_mask) > k) {
                    // 如果修改后不同字符数超过k，必须在此处分割
                    // c !== x表示是否在此次尝试中进行了修改
                    res = Math.max(res, dfs(i + 1, 1 << c, c !== x) + 1);
                } else {
                    // 否则继续当前分区
                    res = Math.max(res, dfs(i + 1, n_mask, c !== x));
                }
            }
        }
        
        // 存储结果到记忆化表中
        memo[i].set(mkey, res);
        return res;
    };
    
    // 从索引0开始，初始mask为0（无字符），尚未修改字符
    return dfs(0, 0, false);
};

/**
 * 功能：计算一个整数的二进制表示中1的个数（用于统计mask中不同字符的数量）
 * 参数：x - 输入整数
 * 返回：二进制表示中1的个数
 * 算法：使用位运算优化，x &= x - 1可以快速清除x最右边的1
 */
const digitCnt = (x) => {
    let cnt = 0;
    while (x) {
        cnt++;
        x &= x - 1;  // 清除最低位的1
    }
    return cnt;
};

```

