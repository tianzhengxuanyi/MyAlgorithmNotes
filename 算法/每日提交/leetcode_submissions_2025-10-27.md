### 2025-10-27

#### [1227. 飞机座位分配概率](https://leetcode.cn/problems/airplane-seat-assignment-probability/description/)

有 `n` 位乘客即将登机，飞机正好有 `n` 个座位。第一位乘客的票丢了，他随便选了一个座位坐下。

剩下的乘客将会：

* 如果他们自己的座位还空着，就坐到自己的座位上，
* 当他们自己的座位被占用时，随机选择其他座位

第 `n` 位乘客坐在自己的座位上的概率是多少？

**示例 1：**

```
输入：n = 1
输出：1.00000
解释：第一个人只会坐在自己的位置上。
```

**示例 2：**

```
输入: n = 2
输出: 0.50000
解释：在第一个人选好座位坐下后，第二个人坐在自己的座位上的概率是 0.5。
```

**提示：**

* `1 <= n <= 10^5`

##### 脑筋急转弯

```js
/**
 * @param {number} n
 * @return {number}
 */
var nthPersonGetsNthSeat = function(n) {
    return n == 1 ? 1 : 0.5;
};
```

#### [1140. 石子游戏 II](https://leetcode.cn/problems/stone-game-ii/description/)

Alice 和 Bob 继续他们的石子游戏。许多堆石子 **排成一行**，每堆都有正整数颗石子 `piles[i]`。游戏以谁手中的石子最多来决出胜负。

Alice 和 Bob 轮流进行，Alice 先开始。最初，`M = 1`。

在每个玩家的回合中，该玩家可以拿走剩下的 **前** `X` 堆的所有石子，其中 `1 <= X <= 2M`。然后，令 `M = max(M, X)`。

游戏一直持续到所有石子都被拿走。

假设 Alice 和 Bob 都发挥出最佳水平，返回 Alice 可以得到的最大数量的石头。

**示例 1：**

```
输入：piles = [2,7,9,4,4]
输出：10
解释：如果一开始 Alice 取了一堆，Bob 取了两堆，然后 Alice 再取两堆。Alice 可以得到 2 + 4 + 4 = 10 堆。
如果 Alice 一开始拿走了两堆，那么 Bob 可以拿走剩下的三堆。在这种情况下，Alice 得到 2 + 7 = 9 堆。返回 10，因为它更大。
```

**示例 2:**

```
输入：piles = [1,2,3,4,5,100]
输出：104
```

**提示：**

* `1 <= piles.length <= 100`
* `1 <= piles[i] <= 104`

##### dp：计算两人差值最大

```js
/**
 * @param {number[]} piles
 * @return {number}
 */
var stoneGameII = function (piles) {
    const n = piles.length;
    const prefix = Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + piles[i];
    }
    // 从第i堆开始，M为m时，A和B数量的差值最大
    const memo = Array.from({ length: n }, () => Array(n).fill(-1));
    const dfs = (i, m) => {
        if (i + 2 * m >= n) return memo[i][m] = prefix[n] - prefix[i];
        if (memo[i][m] >= 0) return memo[i][m];
        let res = -Infinity;
        for (let x = 1; x <= Math.min(2 * m, n - i); x++) {
            // 当前拿走的数量
            let cnt = prefix[i + x] - prefix[i];
            // nextD = bc - ac  , currD = ac + cnt - bc = cnt - nextD
            res = Math.max(res, cnt - dfs(i + x, Math.max(m, x)))
        }
        return memo[i][m] = res;
    }

    const diff = dfs(0, 1);
    return (diff + prefix[n]) / 2
};
```

#### [464. 我能赢吗](https://leetcode.cn/problems/can-i-win/description/)

在 "100 game" 这个游戏中，两名玩家轮流选择从 `1` 到 `10` 的任意整数，累计整数和，先使得累计整数和 **达到或超过**  100 的玩家，即为胜者。

如果我们将游戏规则改为 “玩家 **不能** 重复使用整数” 呢？

例如，两个玩家可以轮流从公共整数池中抽取从 1 到 15 的整数（不放回），直到累计整数和 >= 100。

给定两个整数 `maxChoosableInteger` （整数池中可选择的最大数）和 `desiredTotal`（累计和），若先出手的玩家能稳赢则返回 `true` ，否则返回 `false` 。假设两位玩家游戏时都表现 **最佳** 。

**示例 1：**

```
输入：maxChoosableInteger = 10, desiredTotal = 11
输出：false
解释：
无论第一个玩家选择哪个整数，他都会失败。
第一个玩家可以选择从 1 到 10 的整数。
如果第一个玩家选择 1，那么第二个玩家只能选择从 2 到 10 的整数。
第二个玩家可以通过选择整数 10（那么累积和为 11 >= desiredTotal），从而取得胜利.
同样地，第一个玩家选择任意其他整数，第二个玩家都会赢。
```

**示例 2:**

```
输入：maxChoosableInteger = 10, desiredTotal = 0
输出：true
```

**示例 3:**

```
输入：maxChoosableInteger = 10, desiredTotal = 1
输出：true
```

**提示:**

* `1 <= maxChoosableInteger <= 20`
* `0 <= desiredTotal <= 300`

```js
/**
 * @param {number} maxChoosableInteger
 * @param {number} desiredTotal
 * @return {boolean}
 */
var canIWin = function (maxChoosableInteger, desiredTotal) {
    let total = maxChoosableInteger * (maxChoosableInteger + 1) / 2;
    if (total < desiredTotal) return false;
    const memo = Array(1 << maxChoosableInteger);
    const dfs = (mask, r) => {
        if (typeof memo[mask] != "undefined") return memo[mask];
        for (let i = 1; i <= maxChoosableInteger; i++) {
            if (mask & (1 << i)) continue;
            if (i >= r || !dfs(mask | (1 << i), r - i)) {
                return memo[mask] = true;
            }
        }
        return memo[mask] = false;
    }

    return dfs(0, desiredTotal)
};
```

#### [292. Nim 游戏](https://leetcode.cn/problems/nim-game/description/)

你和你的朋友，两个人一起玩 [Nim 游戏](https://baike.baidu.com/item/Nim游戏/6737105)：

* 桌子上有一堆石头。
* 你们轮流进行自己的回合， **你作为先手**。
* 每一回合，轮到的人拿掉 1 - 3 块石头。
* 拿掉最后一块石头的人就是获胜者。

假设你们每一步都是最优解。请编写一个函数，来判断你是否可以在给定石头数量为 `n` 的情况下赢得游戏。如果可以赢，返回 `true`；否则，返回 `false` 。

**示例 1：**

```
输入：n = 4
输出：false 
解释：以下是可能的结果:
1. 移除1颗石头。你的朋友移走了3块石头，包括最后一块。你的朋友赢了。
2. 移除2个石子。你的朋友移走2块石头，包括最后一块。你的朋友赢了。
3.你移走3颗石子。你的朋友移走了最后一块石头。你的朋友赢了。
在所有结果中，你的朋友是赢家。
```

**示例 2：**

```
输入：n = 1
输出：true
```

**示例 3：**

```
输入：n = 2
输出：true
```

**提示：**

* `1 <= n <= 231 - 1`

##### 数学 巴什博弈 ： 4必输 567必赢 8必输

```js
/**
 * @param {number} n
 * @return {boolean}
 */
var canWinNim = function (n) {
    return n % 4 != 0;
};
// 1 2 3
// 4 false
// 5 true
// 6 true
// 7 true
// 8 false
// 9 true
```

#### [2125. 银行中的激光束数量](https://leetcode.cn/problems/number-of-laser-beams-in-a-bank/description/)

银行内部的防盗安全装置已经激活。给你一个下标从 **0** 开始的二进制字符串数组 `bank` ，表示银行的平面图，这是一个大小为 `m x n` 的二维矩阵。 `bank[i]` 表示第 `i` 行的设备分布，由若干 `'0'` 和若干 `'1'` 组成。`'0'` 表示单元格是空的，而 `'1'` 表示单元格有一个安全设备。

对任意两个安全设备而言，**如果****同时** 满足下面两个条件，则二者之间存在 **一个** 激光束：

* 两个设备位于两个 **不同行** ：`r1` 和 `r2` ，其中 `r1 < r2` 。
* 满足 `r1 < i < r2` 的 **所有**行 `i` ，都 **没有安全设备** 。

激光束是独立的，也就是说，一个激光束既不会干扰另一个激光束，也不会与另一个激光束合并成一束。

返回银行中激光束的总数量。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/12/24/laser1.jpg)

```
输入：bank = ["011001","000000","010100","001000"]
输出：8
解释：在下面每组设备对之间，存在一条激光束。总共是 8 条激光束：
 * bank[0][1] -- bank[2][1]
 * bank[0][1] -- bank[2][3]
 * bank[0][2] -- bank[2][1]
 * bank[0][2] -- bank[2][3]
 * bank[0][5] -- bank[2][1]
 * bank[0][5] -- bank[2][3]
 * bank[2][1] -- bank[3][2]
 * bank[2][3] -- bank[3][2]
注意，第 0 行和第 3 行上的设备之间不存在激光束。
这是因为第 2 行存在安全设备，这不满足第 2 个条件。
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2021/12/24/laser2.jpg)

```
输入：bank = ["000","111","000"]
输出：0
解释：不存在两个位于不同行的设备
```

**提示：**

* `m == bank.length`
* `n == bank[i].length`
* `1 <= m, n <= 500`
* `bank[i][j]` 为 `'0'` 或 `'1'`

```js
/**
 * @param {string[]} bank
 * @return {number}
 */
var numberOfBeams = function(bank) {
    let last = 0, ans = 0;
    for (let line of bank) {
        let cnt = getOneCount(line);
        if (cnt > 0) {
            ans += last * cnt;
            last = cnt;
        }
    }
    return ans;
}

const getOneCount = (s) => {
    let cnt = 0;
    for (let x of s) {
        if (x == "1") {
            cnt++;
        }
    }

    return cnt;
}
```