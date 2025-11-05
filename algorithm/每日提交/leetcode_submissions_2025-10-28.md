### 2025-10-28

#### [1401. 圆和矩形是否有重叠](https://leetcode.cn/problems/circle-and-rectangle-overlapping/description/)

给你一个以 `(radius, xCenter, yCenter)` 表示的圆和一个与坐标轴平行的矩形 `(x1, y1, x2, y2)` ，其中 `(x1, y1)` 是矩形左下角的坐标，而 `(x2, y2)` 是右上角的坐标。

如果圆和矩形有重叠的部分，请你返回 `true` ，否则返回 `false` 。

换句话说，请你检测是否 **存在** 点 `(xi, yi)` ，它既在圆上也在矩形上（两者都包括点落在边界上的情况）。

**示例 1 ：**

![](https://assets.leetcode.com/uploads/2020/02/20/sample_4_1728.png)

```
输入：radius = 1, xCenter = 0, yCenter = 0, x1 = 1, y1 = -1, x2 = 3, y2 = 1
输出：true
解释：圆和矩形存在公共点 (1,0) 。
```

**示例 2 ：**

```
输入：radius = 1, xCenter = 1, yCenter = 1, x1 = 1, y1 = -3, x2 = 2, y2 = -1
输出：false
```

**示例 3 ：**

![](https://assets.leetcode.com/uploads/2020/02/20/sample_2_1728.png)

```
输入：radius = 1, xCenter = 0, yCenter = 0, x1 = -1, y1 = 0, x2 = 0, y2 = 1
输出：true
```

**提示：**

* `1 <= radius <= 2000`
* `-104 <= xCenter, yCenter <= 104`
* `-104 <= x1 < x2 <= 104`
* `-104 <= y1 < y2 <= 104`

##### 根据圆心的位置判断于矩阵的最小距离

```js
/**
 * @param {number} radius
 * @param {number} xCenter
 * @param {number} yCenter
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @return {boolean}
 */
var checkOverlap = function (radius, xCenter, yCenter, x1, y1, x2, y2) {
    if (xCenter >= x1 && xCenter <= x2 && yCenter >= y1 && yCenter <= y2) {
        return true;
    }
    if (xCenter >= x1 && xCenter <= x2 && yCenter >= y2) {
        return distance(xCenter, yCenter, xCenter, y2) <= radius * radius;
    }
    if (xCenter >= x1 && xCenter <= x2 && yCenter <= y1) {
        return distance(xCenter, yCenter, xCenter, y1) <= radius * radius;
    }
    if (xCenter < x1 && yCenter > y2) {
        return distance(xCenter, yCenter, x1, y2) <= radius * radius;
    }
    if (xCenter > x2 && yCenter > y2) {
        return distance(xCenter, yCenter, x2, y2) <= radius * radius;
    }
    if (xCenter <= x1 && yCenter >= y1 && yCenter <= y2) {
        return distance(xCenter, yCenter, x1, yCenter) <= radius * radius;
    }
    if (xCenter >= x2 && yCenter >= y1 && yCenter <= y2) {
        return distance(xCenter, yCenter, x2, yCenter) <= radius * radius;
    }
    if (xCenter < x1 && yCenter < y1) {
        return distance(xCenter, yCenter, x1, y1) <= radius * radius;
    }
    if (xCenter > x2 && yCenter < y1) {
        return distance(xCenter, yCenter, x2, y1) <= radius * radius;
    }
    return false;
};

const distance = (x1, y1, x2, y2) => {
    return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
}
```

#### [2280. 表示一个折线图的最少线段数](https://leetcode.cn/problems/minimum-lines-to-represent-a-line-chart/description/)

给你一个二维整数数组 `stockPrices` ，其中 `stockPrices[i] = [dayi, pricei]` 表示股票在 `dayi` 的价格为 `pricei` 。**折线图** 是一个二维平面上的若干个点组成的图，横坐标表示日期，纵坐标表示价格，折线图由相邻的点连接而成。比方说下图是一个例子：

![](https://assets.leetcode.com/uploads/2022/03/30/1920px-pushkin_population_historysvg.png)

请你返回要表示一个折线图所需要的 **最少线段数** 。

**示例 1：**

![](https://assets.leetcode.com/uploads/2022/03/30/ex0.png)

```
输入：stockPrices = [[1,7],[2,6],[3,5],[4,4],[5,4],[6,3],[7,2],[8,1]]
输出：3
解释：
上图为输入对应的图，横坐标表示日期，纵坐标表示价格。
以下 3 个线段可以表示折线图：
- 线段 1 （红色）从 (1,7) 到 (4,4) ，经过 (1,7) ，(2,6) ，(3,5) 和 (4,4) 。
- 线段 2 （蓝色）从 (4,4) 到 (5,4) 。
- 线段 3 （绿色）从 (5,4) 到 (8,1) ，经过 (5,4) ，(6,3) ，(7,2) 和 (8,1) 。
可以证明，无法用少于 3 条线段表示这个折线图。
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2022/03/30/ex1.png)

```
输入：stockPrices = [[3,4],[1,2],[7,8],[2,3]]
输出：1
解释：
如上图所示，折线图可以用一条线段表示。
```

**提示：**

* `1 <= stockPrices.length <= 105`
* `stockPrices[i].length == 2`
* `1 <= dayi, pricei <= 109`
* 所有 `dayi` **互不相同** 。


##### 斜率 转化为交叉相乘

```js
/**
 * @param {number[][]} stockPrices
 * @return {number}
 */
var minimumLines = function (stockPrices) {
    const n = stockPrices.length;
    if (n == 1) return 0;
    stockPrices.sort((a, b) => a[0] - b[0]);
    let ans = 1;
    let dx = (stockPrices[1][0] - stockPrices[0][0]), dy = (stockPrices[1][1] - stockPrices[0][1]);

    for (let i = 2; i < n; i++) {
        if (BigInt(dy) * BigInt(stockPrices[i][0] - stockPrices[i - 1][0]) == BigInt(dx) * BigInt(stockPrices[i][1] - stockPrices[i - 1][1])) {
            continue;
        }
        dx = stockPrices[i][0] - stockPrices[i - 1][0], dy = stockPrices[i][1] - stockPrices[i - 1][1];
        ans++;
    }

    return ans;
};
```

#### [1232. 缀点成线](https://leetcode.cn/problems/check-if-it-is-a-straight-line/description/)

给定一个整数数组 `coordinates` ，其中 `coordinates[i] = [x, y]` ， `[x, y]` 表示横坐标为 `x`、纵坐标为 `y` 的点。请你来判断，这些点是否在该坐标系中属于同一条直线上。

**示例 1：**

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/10/19/untitled-diagram-2.jpg)

```
输入：coordinates = [[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
输出：true
```

**示例 2：**

**![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/10/19/untitled-diagram-1.jpg)**

```
输入：coordinates = [[1,1],[2,2],[3,4],[4,5],[5,6],[7,7]]
输出：false
```

**提示：**

* `2 <= coordinates.length <= 1000`
* `coordinates[i].length == 2`
* `-104 <= coordinates[i][0], coordinates[i][1] <= 104`
* `coordinates` 中不含重复的点

##### 斜率 防止除0变成乘法

```js
/**
 * @param {number[][]} coordinates
 * @return {boolean}
 */
var checkStraightLine = function (coordinates) {
    const dx = (coordinates[0][0] - coordinates[1][0]), dy = (coordinates[0][1] - coordinates[1][1]);
    for (let i = 2; i < coordinates.length; i++) {
        if (dx * (coordinates[i - 1][1] - coordinates[i][1]) !== (coordinates[i - 1][0] - coordinates[i][0]) * dy) return false;
    }
    return true;
};
```

#### [1927. 求和游戏](https://leetcode.cn/problems/sum-game/description/)

Alice 和 Bob 玩一个游戏，两人轮流行动，**Alice 先手** 。

给你一个 **偶数长度** 的字符串 `num` ，每一个字符为数字字符或者 `'?'` 。每一次操作中，如果 `num` 中至少有一个 `'?'` ，那么玩家可以执行以下操作：

1. 选择一个下标 `i` 满足 `num[i] == '?'` 。
2. 将 `num[i]` 用 `'0'` 到 `'9'` 之间的一个数字字符替代。

当 `num` 中没有 `'?'` 时，游戏结束。

Bob 获胜的条件是 `num` 中前一半数字的和 **等于** 后一半数字的和。Alice 获胜的条件是前一半的和与后一半的和 **不相等** 。

* 比方说，游戏结束时 `num = "243801"` ，那么 Bob 获胜，因为 `2+4+3 = 8+0+1` 。如果游戏结束时 `num = "243803"` ，那么 Alice 获胜，因为 `2+4+3 != 8+0+3` 。

在 Alice 和 Bob 都采取 **最优** 策略的前提下，如果 Alice 获胜，请返回 `true` ，如果 Bob 获胜，请返回 `false` 。

**示例 1：**

```
输入：num = "5023"
输出：false
解释：num 中没有 '?' ，没法进行任何操作。
前一半的和等于后一半的和：5 + 0 = 2 + 3 。
```

**示例 2：**

```
输入：num = "25??"
输出：true
解释：Alice 可以将两个 '?' 中的一个替换为 '9' ，Bob 无论如何都无法使前一半的和等于后一半的和。
```

**示例 3：**

```
输入：num = "?3295???"
输出：false
解释：Bob 总是能赢。一种可能的结果是：
- Alice 将第一个 '?' 用 '9' 替换。num = "93295???" 。
- Bob 将后面一半中的一个 '?' 替换为 '9' 。num = "932959??" 。
- Alice 将后面一半中的一个 '?' 替换为 '2' 。num = "9329592?" 。
- Bob 将后面一半中最后一个 '?' 替换为 '7' 。num = "93295927" 。
Bob 获胜，因为 9 + 3 + 2 + 9 = 5 + 9 + 2 + 7 。
```

**提示：**

* `2 <= num.length <= 105`
* `num.length` 是 **偶数** 。
* `num` 只包含数字字符和 `'?'` 。

```js
/**
 * @param {string} num
 * @return {boolean}
 */
var sumGame = function (num) {
    const n = num.length, half = n / 2;
    let leftCnt = 0, rightCnt = 0, leftSum = 0, rightSum = 0;
    for (let i = 0; i < n; i++) {
        let x = num[i];
        if (i < half) {
            leftCnt += x == "?" ? 1 : 0;
            leftSum += x == "?" ? 0 : +x;
        } else {
            rightCnt += x == "?" ? 1 : 0;
            rightSum += x == "?" ? 0 : +x;
        }
    }
    let totalCnt = leftCnt + rightCnt, diff = leftSum - rightSum;
    // case1 问号总数为奇数
    if (totalCnt % 2) return true;
    // case2 问号总数为0
    if (totalCnt == 0) return diff != 0;
    // case3 问号在左右两侧都有
    if (leftCnt > 0 && rightCnt > 0) {
        let restCnt = Math.abs(leftCnt - rightCnt);
        if ((diff > 0) && (leftCnt >= rightCnt) || (diff < 0 && (rightCnt >= leftCnt))) return true;
        return Math.abs(diff) != restCnt * 9 / 2;
    } else {
        // case4 问号在单侧
        if ((diff > 0 && leftCnt) || (diff < 0 && rightCnt)) return true;
        return Math.abs(diff) != totalCnt * 9 / 2;
    }
};
```

#### [1406. 石子游戏 III](https://leetcode.cn/problems/stone-game-iii/description/)

Alice 和 Bob 继续他们的石子游戏。几堆石子 **排成一行** ，每堆石子都对应一个得分，由数组 `stoneValue` 给出。

Alice 和 Bob 轮流取石子，**Alice** 总是先开始。在每个玩家的回合中，该玩家可以拿走剩下石子中的的前 **1、2 或 3 堆石子** 。比赛一直持续到所有石头都被拿走。

每个玩家的最终得分为他所拿到的每堆石子的对应得分之和。每个玩家的初始分数都是 **0** 。

比赛的目标是决出最高分，得分最高的选手将会赢得比赛，比赛也可能会出现平局。

假设 Alice 和 Bob 都采取 **最优策略** 。

如果 Alice 赢了就返回 `"Alice"` *，*Bob 赢了就返回`"Bob"`*，*分数相同返回 `"Tie"` 。

**示例 1：**

```
输入：values = [1,2,3,7]
输出："Bob"
解释：Alice 总是会输，她的最佳选择是拿走前三堆，得分变成 6 。但是 Bob 的得分为 7，Bob 获胜。
```

**示例 2：**

```
输入：values = [1,2,3,-9]
输出："Alice"
解释：Alice 要想获胜就必须在第一个回合拿走前三堆石子，给 Bob 留下负分。
如果 Alice 只拿走第一堆，那么她的得分为 1，接下来 Bob 拿走第二、三堆，得分为 5 。之后 Alice 只能拿到分数 -9 的石子堆，输掉比赛。
如果 Alice 拿走前两堆，那么她的得分为 3，接下来 Bob 拿走第三堆，得分为 3 。之后 Alice 只能拿到分数 -9 的石子堆，同样会输掉比赛。
注意，他们都应该采取 最优策略 ，所以在这里 Alice 将选择能够使她获胜的方案。
```

**示例 3：**

```
输入：values = [1,2,3,6]
输出："Tie"
解释：Alice 无法赢得比赛。如果她决定选择前三堆，她可以以平局结束比赛，否则她就会输。
```

**提示：**

* `1 <= stoneValue.length <= 5 * 104`
* `-1000 <= stoneValue[i] <= 1000`

##### 递推优化

```js
/**
 * @param {number[]} stoneValue
 * @return {string}
 */
var stoneGameIII = function (stoneValue) {
    const n = stoneValue.length;
    const dp = [stoneValue[n - 1], 0, 0];
    for (let i = n - 2; i >= 0; i--) {
        let score = 0, curr = -Infinity;
        for (let j = 0; j < 3 && i + j < n; j++) {
            score += stoneValue[i + j];
            curr = Math.max(curr, score - dp[j]);
        }
        dp[2] = dp[1], dp[1] = dp[0], dp[0] = curr;
    }
    return dp[0] == 0 ? "Tie" : dp[0] > 0 ? "Alice" : "Bob";
};
```

##### 递推

```js
/**
 * @param {number[]} stoneValue
 * @return {string}
 */
var stoneGameIII = function (stoneValue) {
    const n = stoneValue.length;
    const dp = Array(n + 1).fill(-Infinity);
    dp[n] = 0, dp[n - 1] = stoneValue[n - 1];
    for (let i = n - 2; i >= 0; i--) {
        let score = 0;
        for (let j = 0; j < 3 && i + j < n; j++) {
            score += stoneValue[i + j];
            dp[i] = Math.max(dp[i], score - dp[i + j + 1]);
        }
    }
    return dp[0] == 0 ? "Tie" : dp[0] > 0 ? "Alice" : "Bob";
};
```

##### DP 记忆化缓存

```js
/**
 * @param {number[]} stoneValue
 * @return {string}
 */
var stoneGameIII = function (stoneValue) {
    const n = stoneValue.length;
    const memo = Array(n);
    const dfs = (i) => {
        if (i >= n) return 0;
        if (typeof memo[i] != "undefined") return memo[i];
        let res = -Infinity;
        let score = 0;
        for (let j = 0; j < 3 && i + j < n; j++) {
            score += stoneValue[i + j];
            res = Math.max(res, score - dfs(i + j + 1));
        }
        return memo[i] = res;
    }
    const diff = dfs(0);
    return diff == 0 ? "Tie" : diff > 0 ? "Alice" : "Bob";
};
```

#### [3354. 使数组元素等于零](https://leetcode.cn/problems/make-array-elements-equal-to-zero/description/)

给你一个整数数组 `nums` 。

开始时，选择一个满足 `nums[curr] == 0` 的起始位置 `curr` ，并选择一个移动 **方向** ：向左或者向右。

此后，你需要重复下面的过程：

* 如果 `curr` 超过范围 `[0, n - 1]` ，过程结束。
* 如果 `nums[curr] == 0` ，沿当前方向继续移动：如果向右移，则 **递增** `curr` ；如果向左移，则 **递减** `curr` 。
* 如果 `nums[curr] > 0`:
  + 将 `nums[curr]` 减 1 。
  + **反转** 移动方向（向左变向右，反之亦然）。
  + 沿新方向移动一步。

如果在结束整个过程后，`nums` 中的所有元素都变为 0 ，则认为选出的初始位置和移动方向 **有效** 。

返回可能的有效选择方案数目。

**示例 1：**

**输入：**nums = [1,0,2,0,3]

**输出：**2

**解释：**

可能的有效选择方案如下：

* 选择 `curr = 3` 并向左移动。
  + `[1,0,2,0,3] -> [1,0,2,0,3] -> [1,0,1,0,3] -> [1,0,1,0,3] -> [1,0,1,0,2] -> [1,0,1,0,2] -> [1,0,0,0,2] -> [1,0,0,0,2] -> [1,0,0,0,1] -> [1,0,0,0,1] -> [1,0,0,0,1] -> [1,0,0,0,1] -> [0,0,0,0,1] -> [0,0,0,0,1] -> [0,0,0,0,1] -> [0,0,0,0,1] -> [0,0,0,0,0]`.
* 选择 `curr = 3` 并向右移动。
  + `[1,0,2,0,3] -> [1,0,2,0,3] -> [1,0,2,0,2] -> [1,0,2,0,2] -> [1,0,1,0,2] -> [1,0,1,0,2] -> [1,0,1,0,1] -> [1,0,1,0,1] -> [1,0,0,0,1] -> [1,0,0,0,1] -> [1,0,0,0,0] -> [1,0,0,0,0] -> [1,0,0,0,0] -> [1,0,0,0,0] -> [0,0,0,0,0].`

**示例 2：**

**输入：**nums = [2,3,4,0,4,1,0]

**输出：**0

**解释：**

不存在有效的选择方案。

**提示：**

* `1 <= nums.length <= 100`
* `0 <= nums[i] <= 100`
* 至少存在一个元素 `i` 满足 `nums[i] == 0` 。

##### 小球打砖块   前、后缀和

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var countValidSelections = function (nums) {
    const total = _.sum(nums);
    let prefix = 0, ans = 0;
    for (const x of nums) {
        if (x == 0) {
            // 0 位置  前缀和 与 后缀和 相等 可以向左也可以向右移动
            // 0 位置  前缀和 与 后缀和 相差1 只能向多的一边移动
            const diff = Math.abs(total - 2 * prefix);
            ans += Math.max(2 - diff, 0)
        }
        prefix += x;
    }

    return ans;
};
```

