### 15 概率/期望DP

#### 688. 骑士在棋盘上的概率(https://leetcode.cn/problems/knight-probability-in-chessboard/description/)
 
在一个 n x n 的国际象棋棋盘上，一个骑士从单元格 (row, column) 开始，并尝试进行 k 次移动。行和列是 从 0 开始 的，所以左上单元格是 (0,0) ，右下单元格是 (n - 1, n - 1) 。

象棋骑士有8种可能的走法，如下图所示。每次移动在基本方向上是两个单元格，然后在正交方向上是一个单元格。

每次骑士要移动时，它都会随机从8种可能的移动中选择一种(即使棋子会离开棋盘)，然后移动到那里。

骑士继续移动，直到它走了 k 步或离开了棋盘。

返回 骑士在棋盘停止移动后仍留在棋盘上的概率 。

```js
/**
 * 计算骑士在n x n棋盘上经过k次移动后仍留在棋盘上的概率
 * @param {number} n - 棋盘大小（n x n）
 * @param {number} k - 骑士需要移动的次数
 * @param {number} row - 骑士初始行位置（0-based）
 * @param {number} column - 骑士初始列位置（0-based）
 * @return {number} 骑士停止移动后仍留在棋盘上的概率
 */
var knightProbability = function (n, k, row, column) {
    // 骑士的8种可能移动方向，每个方向为[x,y]坐标偏移量（横纵坐标变化量）
    const direct = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
    
    // 记忆化数组：memo[i][j][r]表示从(i,j)位置开始，剩余r步移动时，仍留在棋盘上的路径数量
    const memo = Array.from({ length: n }, () => Array.from({ length: n }, () => Array(k + 1).fill(0)));
    
    /**
     * 深度优先搜索函数：计算从当前位置(i,j)开始，剩余r步移动时，留在棋盘上的路径数量
     * @param {number} i - 当前行位置
     * @param {number} j - 当前列位置
     * @param {number} r - 剩余移动步数
     * @return {number} 有效路径数量（从当前状态出发，经过r步后仍在棋盘上的路径总数）
     */
    const dfs = (i, j, r) => {
        // 边界条件：若当前位置(i,j)不在棋盘内，返回0（该路径无效）
        if (i < 0 || i >= n || j < 0 || j >= n) return 0;
        // 边界条件：若剩余移动步数为0，当前位置有效，返回1（1条有效路径）
        if (r === 0) return memo[i][j][r] = 1;
        // 若已计算过当前状态（i,j,r），直接返回记忆值（避免重复计算）
        if (memo[i][j][r] > 0) return memo[i][j][r];
        
        let res = 0;
        // 遍历所有可能的移动方向
        for (let [x, y] of direct) {
            // 累加所有方向的有效路径数量（递归计算下一步的路径数）
            res += dfs(i + x, j + y, r - 1);
        }
        
        // 将当前状态的结果存入记忆数组并返回（记忆化存储，避免重复计算）
        return memo[i][j][r] = res;
    }
    
    // 总有效路径数除以总可能路径数（8^k，每步有8种选择），得到最终概率
    return dfs(row, column, k) / Math.pow(8, k);
};

```

 