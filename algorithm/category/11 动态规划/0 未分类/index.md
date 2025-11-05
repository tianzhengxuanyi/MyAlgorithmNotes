#### [3459. 最长 V 形对角线段的长度](https://leetcode.cn/problems/length-of-longest-v-shaped-diagonal-segment/description)

给你一个大小为 n x m 的二维整数矩阵 grid，其中每个元素的值为 0、1 或 2。

V 形对角线段 定义如下：

- 线段从 1 开始。
- 后续元素按照以下无限序列的模式排列：2, 0, 2, 0, ...。
- 该线段：
  - 起始于某个对角方向（左上到右下、右下到左上、右上到左下或左下到右上）。
  - 沿着相同的对角方向继续，保持 序列模式 。
  - 在保持 序列模式 的前提下，最多允许 一次顺时针 90 度转向 另一个对角方向。

返回最长的 V 形对角线段 的 长度 。如果不存在有效的线段，则返回 0。

##### 动态规划

注意记忆化缓存存在问题，di和rotate需要合并，如果rotate作为维度，**会不命中缓存**

```js
/**
 * 计算二维网格中最长V型对角线的长度
 * @param {number[][]} grid 二进制网格（包含0、1、2三种值）
 * @return {number} 最长V型对角线长度
 * 
 * 实现原理：
 * 1. 使用记忆化DFS遍历四个对角线方向（左上、右上、右下、左下）
 * 2. 通过三维memo数组缓存计算结果（i,j坐标 + 方向 + 旋转状态）
 * 3. 允许一次90度方向旋转来形成V型路径
 * 
 * 时间复杂度：O(m*n*4*2) 空间复杂度：O(m*n*8)
 */
var lenOfVDiagonal = function (grid) {
    const m = grid.length, n = grid[0].length;
    // 四个对角线方向：左上、右上、右下、左下
    const d = [[-1, -1], [-1, 1], [1, 1], [1, -1]];

    // 记忆化数组：[i][j][方向<<1 | 旋转状态]
    const memo = Array.from({ length: m }, () => 
        Array.from({ length: n }, () => 
            Array(1 << 3).fill(-1)));

    const dfs = (i, j, di, rotate) => {
        // 边界检查
        if (i < 0 || i >= m || j < 0 || j >= n) return 0;
        
        // 生成缓存key：方向(2bit) + 旋转状态(1bit)
        const mask = (di << 1) | (+rotate);
        if (memo[i][j][mask] >= 0) return memo[i][j][mask];

        let res = 1;
        // 计算下一个目标值（1→2→0→2循环）
        const target = (grid[i][j] === 1 || grid[i][j] === 0) ? 2 : 0;

        // 沿当前方向继续搜索
        let ni = i + d[di][0], nj = j + d[di][1];
        if (grid[ni]?.[nj] === target) {
            res = Math.max(res, dfs(ni, nj, di, rotate) + 1);
        }

        // 允许一次90度转向（旋转标记为true后不可再转）
        if (!rotate) {
            const rdi = (di + 1) % 4; // 下一个方向
            // 计算各方向最大可能步长进行剪枝
            const maxSteps = [
                Math.min(i, j),         // 左上方向剩余步长
                Math.min(n-j-1, i),     // 右上方向剩余步长
                Math.min(m-i-1, n-j-1),// 右下方向剩余步长
                Math.min(m-i-1, j)     // 左下方向剩余步长
            ];
            
            ni = i + d[rdi][0], nj = j + d[rdi][1];
            if (maxSteps[rdi] + 1 > res && grid[ni]?.[nj] === target) {
                res = Math.max(res, dfs(ni, nj, rdi, true) + 1);
            }
        }

        return memo[i][j][mask] = res;
    }

    // 遍历所有起点
    let ans = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] !== 1) continue;
            // 计算四个方向的初始最大可能步长
            const initialMax = [
                i + 1,      // 左上方向初始最大步长
                n - j,      // 右上方向初始最大步长
                m - i,      // 右下方向初始最大步长
                j + 1       // 左下方向初始最大步长
            ];
            
            // 尝试四个初始方向
            for (let k = 0; k < 4; k++) {
                if (initialMax[k] > ans) {
                    ans = Math.max(ans, dfs(i, j, k, false));
                }
            }
        }
    }
    return ans;
};

```

##### 预处理不转向的序列线段长度

```js
/**
 * 计算网格中最长连续对角线长度（含四个方向）
 * @param {number[][]} grid - 二维网格数组，元素值包含0、1、2三种状态
 * @returns {number} 最长连续对角线长度
 * @note 使用动态规划预处理四个对角线方向，时间复杂度O(mn)
 */
var lenOfVDiagonal = function (grid) {
    // 网格行列尺寸
    const m = grid.length, n = grid[0].length;
    // 预处理四个对角线方向的连续长度：左上、右上、右下、左下
    const dRes = [seriesLen(grid, 0), seriesLen(grid, 1), seriesLen(grid, 2), seriesLen(grid, 3)];

    let ans = 0;
    // 遍历每个网格单元寻找最大长度
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] == 1) {  // 只在有效起点计算
                // 检查四个对角线方向
                for (let k = 0; k <= 3; k++) {
                    ans = Math.max(ans, dRes[k][i][j]);
                    // 尝试组合不同方向的对角线
                    let p = i, q = j;
                    for (let u = 1; u < dRes[k][i][j]; u++) {
                        p += d[k][0], q += d[k][1];
                        ans = Math.max(ans, u + dRes[(k + 1) % 4][p][q]);
                    }
                }
            }
        }
    }

    return ans;
};

// 四个对角线方向向量：左上、右上、右下、左下
const d = [[-1, -1], [-1, 1], [1, 1], [1, -1]];

/**
 * 预处理指定方向的连续序列长度
 * @param {number[][]} grid - 二维网格数组
 * @param {number} di - 方向索引（0-3对应d数组的四个方向）
 * @returns {number[][]} 每个位置在指定方向上的连续长度
 * @note 使用动态规划进行预处理，空间复杂度O(mn)
 */
const seriesLen = (grid, di) => {
    const m = grid.length, n = grid[0].length;
    const res = Array.from({ length: m }, () => Array(n).fill(1));
    const dy = d[di][0], dx = d[di][1];

    // 根据方向确定遍历起点和顺序
    for (let i = (di == 0 || di == 1 ? 0 : m - 1); i < m && i >= 0; i -= dy) {
        for (let j = (di == 0 || di == 3 ? 0 : n - 1); j < n && j >= 0; j -= dx) {
            // 动态规划状态转移：有效路径延续
            if ((grid[i][j] == 1 || grid[i][j] == 0) && grid[i + dy]?.[j + dx] == 2) {
                res[i][j] += res[i + dy][j + dx];
            } else if (grid[i][j] == 2 && grid[i + dy]?.[j + dx] == 0) {
                res[i][j] += res[i + dy][j + dx];
            }
        }
    }

    return res;
}


```