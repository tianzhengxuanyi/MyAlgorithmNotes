### 博弈DP

#### [1025. 除数博弈](https://leetcode.cn/problems/divisor-game/description/)

爱丽丝和鲍勃一起玩游戏，他们轮流行动。爱丽丝先手开局。

最初，黑板上有一个数字 n 。在每个玩家的回合，玩家需要执行以下操作：

- 选出任一 x，满足 0 < x < n 且 n % x == 0 。
- 用 n - x 替换黑板上的数字 n 。

如果玩家无法执行这些操作，就会输掉游戏。

只有在爱丽丝在游戏中取得胜利时才返回 true 。假设两个玩家都以最佳状态参与游戏。

##### 动态规划

```js
/**
 * @param {number} n
 * @return {boolean}
 */
/**
 * @param {number} n
 * @return {boolean}
 */
var divisorGame = function (n) {
    // memo[i]用于记忆化存储：当数字为i时当前玩家是否能获胜
    const memo = Array(n + 1);
    
    // 递归函数：判断当前数字为i时，当前玩家能否获胜
    const dfs = (i) => {
        //  base case：当i <= 1时，无法选择x（0 < x < i），当前玩家输
        if (i <= 1) return memo[i] = false;
        // 若已计算过当前i的结果，直接返回记忆值（避免重复计算）
        if (memo[i] !== undefined) return memo[i];
        
        // 遍历所有可能的除数x（j）
        for (let j = 1; j < i; j++) {
            // 若j是i的除数，且选择j后（新数字为i-j）对手会输，则当前玩家赢
            if (i % j === 0 && !dfs(i - j)) {
                return true;
            }
        }

        // 若没有任何除数能让对手输，则当前玩家输，记录结果到memo
        return memo[i] =  false;
    }

    // 从初始数字n开始递归计算Alice是否能赢
    return dfs(n);
};

```


##### 数学

因为每次要选择满足 0 < x < n 且 n % x == 0 的 x，所以 最终 剩下的数字一定是 1。 因此谁拿到1就一定会输。

- **奇数的因子一定是奇数**

如果当前剩余的数字是偶数，当前玩家可以选择1，这样下一个玩家就会面对一个奇数。

如果当前剩余的数字是奇数，当前玩家只能选择奇数因子，这样下一个玩家就会面对一个偶数。

因此，只要当前是偶数，先手玩家就可以一直保持遇到的都是偶数，不会拿到1。

因此**只有在偶数的情况下，当前玩家才能赢**。

```js
/**
 * 判断爱丽丝在除数游戏中是否能获胜（数学优化解法）
 * @param {number} n - 游戏初始数字
 * @return {boolean} - 若爱丽丝获胜返回true，否则返回false
 * 数学原理：当n为偶数时爱丽丝必胜，为奇数时必败
 * 推导过程：
 * 1. 若n为偶数，爱丽丝可选择x=1（或其他合适除数），使剩余数字为奇数
 * 2. 奇数的所有除数必为奇数，鲍勃只能选择奇数x，导致剩余数字为偶数（奇数-奇数=偶数）
 * 3. 如此交替，爱丽丝总能保持面对偶数，最终鲍勃会遇到1而无法操作
 */
var divisorGame = function (n) {
    return n % 2 === 0; // 直接通过n的奇偶性判断：偶数返回true（爱丽丝胜），奇数返回false
};

```

### [877. 石子游戏](https://leetcode.cn/problems/stone-game/description/)
 
Alice 和 Bob 用几堆石子在做游戏。一共有偶数堆石子，排成一行；每堆都有 正 整数颗石子，数目为 piles[i] 。

游戏以谁手中的石子最多来决出胜负。石子的 总数 是 奇数 ，所以没有平局。

Alice 和 Bob 轮流进行，Alice 先开始 。 每回合，玩家从行的 开始 或 结束 处取走整堆石头。 这种情况一直持续到没有更多的石子堆为止，此时手中 石子最多 的玩家 获胜 。

假设 Alice 和 Bob 都发挥出最佳水平，当 Alice 赢得比赛时返回 true ，当 Bob 赢得比赛时返回 false 。

##### 动态规划

**计算先手和后手的最大得分**

```js
/**
 * @param {number[]} piles
 * @return {boolean}
 */
var stoneGame = function (piles) {
    // 石子堆的数量
    const n = piles.length;
    // memo1[i][j]：当前玩家在子数组 piles[i...j] 中能获得的最大分数
    const memo1 = Array.from({ length: n }, () => Array(n).fill(0));
    // memo2[i][j]：当前玩家在子数组 piles[i...j] 中，对手最优操作后能获得的分数
    const memo2 = Array.from({ length: n }, () => Array(n).fill(0));
    
    // 计算当前玩家在子数组 piles[i...j] 中能获得的最大分数
    const f = (i, j) => {
        //  base case：当只有一堆石子时，当前玩家只能取这堆石子，得分为 piles[i]
        if (i === j) return memo1[i][j] = piles[i];
        // 若已计算过当前区间结果，直接返回记忆值（避免重复计算）
        if (memo1[i][j]) return memo1[i][j];
        
        // 选择左端石子后，对手将在 [i+1...j] 中最优操作，当前玩家得分为 piles[i] + 对手操作后自己能获得的分数
        let s1 = s(i + 1, j);
        // 选择右端石子后，对手将在 [i...j-1] 中最优操作，当前玩家得分为 piles[j] + 对手操作后自己能获得的分数
        let s2 = s(i, j - 1);

        // 当前玩家会选择两种方案中的最大值作为最优策略
        return memo1[i][j] = Math.max(piles[i] + s1, piles[j] + s2);
    }

    // 计算当前玩家在子数组 piles[i...j] 中，对手最优操作后能获得的分数
    const s = (i, j) => {
        //  base case：当只有一堆石子时，对手取走后当前玩家得分为 0
        if (i === j) return memo2[i][j] = 0;
        // 若已计算过当前区间结果，直接返回记忆值
        if (memo2[i][j]) return memo2[i][j];
        
        // 对手选择左端石子后，会在 [i+1...j] 中获得最大分数（即当前玩家的损失）
        let f1 = f(i + 1, j);
        // 对手选择右端石子后，会在 [i...j-1] 中获得最大分数
        let f2 = f(i, j - 1);

        // 对手会选择两种方案中的最大值，当前玩家只能获得剩余的最小可能分数
        return memo2[i][j] = Math.min(f1, f2);
    }
    
    // 从整个石子堆范围 [0, n-1] 开始计算 Alice 和 Bob 的最优得分
    f(0, n - 1), s(0, n - 1)

    // Alice 的得分（memo1[0][n-1]）大于 Bob 的得分（memo2[0][n-1]）时 Alice 获胜
    return memo1[0][n - 1] > memo2[0][n - 1];
};

```

**计算两个玩家得分的差值**

```js
/**
 * 判断爱丽丝在石子游戏中是否能获胜（空间优化的动态规划解法）
 * @param {number[]} piles - 石子堆数组，每堆石子的数量
 * @return {boolean} - 若爱丽丝获胜返回true，否则返回false
 */
var stoneGame = function (piles) {
    const n = piles.length;
    // 空间优化的DP数组：f[i%2][j]表示当前玩家在子数组piles[i...j]中
    // 能获得的最大分数差（当前玩家得分 - 对手得分）
    // 使用2行数组是因为i的奇偶性决定了当前行，可复用空间
    const f = Array.from({ length: 2 }, () => Array(n).fill(0));
    
    //  base case：当子数组只有一个元素（i=j=n-1）时，当前玩家只能取这堆石子
    // 得分差即为该堆石子数量
    f[(n - 1) % 2][n - 1] = piles[n - 1];
    
    // 从倒数第二堆石子开始向前遍历（子数组长度从2到n）
    for (let i = n - 2; i >= 0; i--) {
        //  base case：当子数组只有一个元素（i=j）时，当前玩家取这堆石子
        f[i % 2][i] = piles[i];
        
        // 遍历子数组的结束位置j（j > i）
        for (let j = i + 1; j < n; j++) {
            // 状态转移方程：
            // 1. 当前玩家取左端石子piles[i]，则剩余子数组[i+1...j]由对手操作
            //    对手的最优得分差为f[(i+1)%2][j]，因此当前玩家的得分差为 piles[i] - 对手得分差
            // 2. 当前玩家取右端石子piles[j]，则剩余子数组[i...j-1]由对手操作
            //    对手的最优得分差为f[i%2][j-1]，因此当前玩家的得分差为 piles[j] - 对手得分差
            // 当前玩家选择两种方案中得分差更大的一种
            f[i % 2][j] = Math.max(piles[i] - f[(i + 1) % 2][j], piles[j] - f[i % 2][j - 1]);
        }
    }

    // 整个数组[0...n-1]的得分差若>0，说明爱丽丝（先手）得分高于对手，返回true
    return f[0][n - 1] > 0;
};

```

##### 方法二：数学

假设有 n 堆石子，n 是偶数，则每堆石子的下标从 0 到 n−1。根据下标将 n 堆石子分成两组，每组有 n / 2 堆石子，下标为偶数的石子堆属于第一组，下标为奇数的石子堆属于第二组。

初始时，行的开始处的石子堆位于下标 0，属于第一组，行的结束处的石子堆位于下标 n−1，属于第二组，因此作为先手的 Alice 可以自由选择取走第一组的一堆石子或者第二组的一堆石子。如果 Alice 取走第一组的一堆石子，则剩下的部分在行的开始处和结束处的石子堆都属于第二组，因此 Bob 只能取走第二组的一堆石子。如果 Alice 取走第二组的一堆石子，则剩下的部分在行的开始处和结束处的石子堆都属于第一组，因此 Bob 只能取走第一组的一堆石子。无论 Bob 取走的是开始处还是结束处的一堆石子，剩下的部分在行的开始处和结束处的石子堆一定是属于不同组的，因此轮到 Alice 取走石子时，Alice 又可以在两组石子之间进行自由选择。

根据上述分析可知，作为先手的 Alice 可以在第一次取走石子时就决定取走哪一组的石子，并全程取走同一组的石子。既然如此，Alice 是否有必胜策略？

答案是肯定的。将石子分成两组之后，可以计算出每一组的石子数量，同时知道哪一组的石子数量更多。Alice 只要选择取走数量更多的一组石子即可。因此，Alice 总是可以赢得比赛。

```js
/**
 * @param {number[]} piles
 * @return {boolean}
 */
var stoneGame = function (piles) {
    return true;
};
```