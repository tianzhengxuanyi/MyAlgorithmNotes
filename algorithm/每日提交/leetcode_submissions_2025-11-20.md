### 2025-11-20

#### [47. 全排列 II](https://leetcode.cn/problems/permutations-ii/description/)

给定一个可包含重复数字的序列 `nums` ，***按任意顺序*** 返回所有不重复的全排列。

**示例 1：**

```
输入：nums = [1,1,2]
输出：
[[1,1,2],
 [1,2,1],
 [2,1,1]]
```

**示例 2：**

```
输入：nums = [1,2,3]
输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

**提示：**

* `1 <= nums.length <= 8`
* `-10 <= nums[i] <= 10`

##### 回溯，排序，如果存在重复的数，只选择第一个未使用的位置，确保不会重复

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permuteUnique = function (nums) {
    nums.sort((a, b) => a - b); // 排序
    const n = nums.length;
    const ans = [], path = [];
    const dfs = (mask) => {
        if (path.length == n) {
            ans.push([...path]);
            return;
        }
        for (let i = 0; i < n; i++) {
            // 1. 下标i已经用过，跳过
            // 2. nums[i] 和 nums[i - 1]相等，且nums[i - 1]没用过，跳过
                // 如果存在重复的数，只选择第一个未使用的位置，确保不会重复
            if ((mask & (1 << i)) || (nums[i] == nums[i - 1] && !(mask & (1 << (i - 1))))) continue;
            path.push(nums[i]);
            dfs(mask |(1 << i));
            path.pop();
        }
    }

    dfs(0);

    return ans;
};
```

##### 回溯，用set过滤掉递归同一层中重复选择的数

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permuteUnique = function (nums) {
    const n = nums.length;
    const ans = [], path = [];
    const dfs = (mask) => {
        if (path.length == n) {
            ans.push([...path]);
            return;
        }
        const set = new Set();
        for (let i = 0; i < n; i++) {
            const x = nums[i];
            if ((mask & (1 << i)) || set.has(x)) continue;
            set.add(x);
            path.push(x);
            dfs(mask |(1 << i));
            path.pop();
        }
    }

    dfs(0);

    return ans;
};
```

#### [40. 组合总和 II](https://leetcode.cn/problems/combination-sum-ii/description/)

给定一个候选人编号的集合 `candidates` 和一个目标数 `target` ，找出 `candidates` 中所有可以使数字和为 `target` 的组合。

`candidates` 中的每个数字在每个组合中只能使用 **一次** 。

**注意：**解集不能包含重复的组合。

**示例 1:**

```
输入: candidates = [10,1,2,7,6,1,5], target = 8,
输出:
[
[1,1,6],
[1,2,5],
[1,7],
[2,6]
]
```

**示例 2:**

```
输入: candidates = [2,5,2,1,2], target = 5,
输出:
[
[1,2,2],
[5]
]
```

**提示:**

* `1 <= candidates.length <= 100`
* `1 <= candidates[i] <= 50`
* `1 <= target <= 30`

##### 回溯，枚举[i,n-1]中选取哪个j，如果j>i，说明j-1没有选，跳过所有相同的数

```js
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum2 = function (candidates, target) {
    candidates.sort((a, b) => a - b);
    const ans = [], path = [];
    const n = candidates.length;
    const dfs = (i, sum) => {
        if (sum == target) {
            ans.push([...path]);
            return;
        }
        if (sum > target) return;
        for (let j = i; j < n; j++) {
            // 如果 j>i，说明 candidates[j-1] 没有选 
            // 同方法一，所有等于 candidates[j-1] 的数都不选
            const x = candidates[j];
            if (j > i && candidates[j] == candidates[j - 1]) {
                continue;
            }
            path.push(x);
            dfs(j + 1, sum + x);
            path.pop();
        }
    }
    dfs(0, 0);
    return ans;
};
```

##### 回溯，选i和不选i，不选i的时候跳过后续重复的数

```js
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum2 = function(candidates, target) {
    candidates.sort((a, b) => a - b);
    const ans = [], path = [];
    const n = candidates.length;
    const dfs = (i, sum) => {
        if (sum == target) {
            ans.push([...path]);
            return;
        }
        if (i == n || sum > target) {
            return;
        }
        // 选i
        path.push(candidates[i]);
        dfs(i + 1, sum + candidates[i])
        path.pop();
        // 不选i，跳过后续重复数字
        let j = i;
        while (j < n && candidates[i] == candidates[j]) {
            j++;
        }
        dfs(j, sum);
    } 
    dfs(0,0);
    return ans;
};
```

#### [491. 非递减子序列](https://leetcode.cn/problems/non-decreasing-subsequences/description/)

给你一个整数数组 `nums` ，找出并返回所有该数组中不同的递增子序列，递增子序列中 **至少有两个元素** 。你可以按 **任意顺序** 返回答案。

数组中可能含有重复元素，如出现两个整数相等，也可以视作递增序列的一种特殊情况。

**示例 1：**

```
输入：nums = [4,6,7,7]
输出：[[4,6],[4,6,7],[4,6,7,7],[4,7],[4,7,7],[6,7],[6,7,7],[7,7]]
```

**示例 2：**

```
输入：nums = [4,4,3,2,1]
输出：[[4,4]]
```

**提示：**

* `1 <= nums.length <= 15`
* `-100 <= nums[i] <= 100`

##### 回溯，选哪个，过滤重复值

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var findSubsequences = function (nums) {
    const n = nums.length;
    const ans = [], path = [];
    const dfs = (i) => {
        if (path.length > 1) { // 长度大于2直接加入ans
            ans.push([...path]);
        }
        const set = new Set(); // 过滤这一层递归中的重复值
        for (let j = i; j < n; j++) {
            if ((path.length == 0 || nums[j] >= path[path.length - 1]) && !set.has(nums[j])) {
                path.push(nums[j]);
                set.add(nums[j]);
                dfs(j + 1);
                path.pop();
            }
        }
    }
    dfs(0);
    return ans;
};
```

#### [90. 子集 II](https://leetcode.cn/problems/subsets-ii/description/)

给你一个整数数组 `nums` ，其中可能包含重复元素，请你返回该数组所有可能的 子集（幂集）。

解集 **不能** 包含重复的子集。返回的解集中，子集可以按 **任意顺序** 排列。

**示例 1：**

```
输入：nums = [1,2,2]
输出：[[],[1],[1,2],[1,2,2],[2],[2,2]]
```

**示例 2：**

```
输入：nums = [0]
输出：[[],[0]]
```

**提示：**

* `1 <= nums.length <= 10`
* `-10 <= nums[i] <= 10`

##### 回溯，选或不选，不选时跳过重复的数字

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsetsWithDup = function(nums) {
    nums.sort((a, b) => a - b);
    const n = nums.length;
    const ans = [], path = [];
    const dfs = (i) => {
        if (i == n) {
            ans.push([...path]);
            return;
        }
        // 选择当前i
        path.push(nums[i]);
        dfs(i + 1);
        path.pop();
        // 不选i要跳过重复数字
        let j = i;
        while (j < n && nums[i] == nums[j]) {
            j++;
        }
        dfs(j);
    }
    dfs(0);
    return ans;
};
```

#### [52. N 皇后 II](https://leetcode.cn/problems/n-queens-ii/description/)

**n 皇后问题** 研究的是如何将 `n` 个皇后放置在 `n × n` 的棋盘上，并且使皇后彼此之间不能相互攻击。

给你一个整数 `n` ，返回 **n 皇后问题** 不同的解决方案的数量。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/11/13/queens.jpg)

```
输入：n = 4
输出：2
解释：如上图所示，4 皇后问题存在两个不同的解法。
```

**示例 2：**

```
输入：n = 1
输出：1
```

**提示：**

* `1 <= n <= 9`

##### 回溯，同51

```js
/**
 * @param {number} n
 * @return {number}
 */
var totalNQueens = function(n) {
    const col = Array(n).fill(false);
    const dialog1 = Array(2*n).fill(false);
    const dialog2 = Array(2*n).fill(false);

    let ans = 0;
    const dfs = (i) => {
        if (i == n) {
            ans++;
            return;
        }
        for (let j = 0; j < n; j++) {
            let d1 = i +j, d2 = i - j + n;
            if (col[j] || dialog1[d1] || dialog2[d2]) continue;
            col[j] = dialog1[d1] = dialog2[d2] = true;
            dfs(i + 1);
            col[j] = dialog1[d1] = dialog2[d2] = false;
        }
    }

    dfs(0);
    return ans;
};
```

#### [51. N 皇后](https://leetcode.cn/problems/n-queens/description/)

按照国际象棋的规则，皇后可以攻击与之处在同一行或同一列或同一斜线上的棋子。

**n 皇后问题** 研究的是如何将 `n` 个皇后放置在 `n×n` 的棋盘上，并且使皇后彼此之间不能相互攻击。

给你一个整数 `n` ，返回所有不同的 **n皇后问题** 的解决方案。

每一种解法包含一个不同的 **n 皇后问题** 的棋子放置方案，该方案中 `'Q'` 和 `'.'` 分别代表了皇后和空位。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/11/13/queens.jpg)

```
输入：n = 4
输出：[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
解释：如上图所示，4 皇后问题存在两个不同的解法。
```

**示例 2：**

```
输入：n = 1
输出：[["Q"]]
```

**提示：**

* `1 <= n <= 9`

##### 回溯，对角线记录r+c和r-c判断

```js
/**
 * @param {number} n
 * @return {string[][]}
 */
var solveNQueens = function (n) {
    const ans = [];
    const path = [];
    const baseStr = Array(n).fill(".");
    const col = Array(n).fill(false);
    const dialog1 = Array(2 * n).fill(false);
    const dialog2 = Array(2 * n).fill(false);
    const dfs = (i) => {
        if (i == n) {
            ans.push([...path]);
            return;
        }
        for (let j = 0; j < n; j++) {
            let d1 = i + j, d2 = i - j + n;
            if (col[j] || dialog1[d1] || dialog2[d2]) continue;
            baseStr[j] = "Q"
            path.push(baseStr.join(""));
            baseStr[j] = "."
            col[j] = dialog1[d1] = dialog2[d2] = true;
            dfs(i + 1);
            col[j] = dialog1[d1] = dialog2[d2] = false;
            path.pop();
        }
    }
    dfs(0, 0, 0, 0);
    return ans;
};
```

#### [452. 用最少数量的箭引爆气球](https://leetcode.cn/problems/minimum-number-of-arrows-to-burst-balloons/description/)

有一些球形气球贴在一堵用 XY 平面表示的墙面上。墙面上的气球记录在整数数组 `points` ，其中`points[i] = [xstart, xend]` 表示水平直径在 `xstart` 和 `xend`之间的气球。你不知道气球的确切 y 坐标。

一支弓箭可以沿着 x 轴从不同点 **完全垂直** 地射出。在坐标 `x` 处射出一支箭，若有一个气球的直径的开始和结束坐标为 `xstart`，`xend`， 且满足  `xstart ≤ x ≤ xend`，则该气球会被 **引爆** 。可以射出的弓箭的数量 **没有限制** 。 弓箭一旦被射出之后，可以无限地前进。

给你一个数组 `points` ，*返回引爆所有气球所必须射出的 **最小** 弓箭数*。

**示例 1：**

```
输入：points = [[10,16],[2,8],[1,6],[7,12]]
输出：2
解释：气球可以用2支箭来爆破:
-在x = 6处射出箭，击破气球[2,8]和[1,6]。
-在x = 11处发射箭，击破气球[10,16]和[7,12]。
```

**示例 2：**

```
输入：points = [[1,2],[3,4],[5,6],[7,8]]
输出：4
解释：每个气球需要射出一支箭，总共需要4支箭。
```

**示例 3：**

```
输入：points = [[1,2],[2,3],[3,4],[4,5]]
输出：2
解释：气球可以用2支箭来爆破:
- 在x = 2处发射箭，击破气球[1,2]和[2,3]。
- 在x = 4处射出箭，击破气球[3,4]和[4,5]。
```

**提示:**

* `1 <= points.length <= 105`
* `points[i].length == 2`
* `-231 <= xstart < xend <= 231 - 1`

##### 贪心

```js
/**
 * @param {number[][]} points
 * @return {number}
 */
var findMinArrowShots = function(points) {
    points.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
    const n = points.length;
    const explosion = Array(n).fill(false);
    const help = (i, x) => {
        for (; i >= 0; i--) {
            if (points[i][1] < x) {
                break;
            }
            explosion[i] = true;
        }
    }
    let ans = 0;
    for (let i = n - 1; i >= 0; i--) {
        if (!explosion[i]) {
            ans++;
            help(i, points[i][0]);
        }
    }
    return ans;
};
```

#### [757. 设置交集大小至少为2](https://leetcode.cn/problems/set-intersection-size-at-least-two/description/)

给你一个二维整数数组 `intervals` ，其中 `intervals[i] = [starti, endi]` 表示从 `starti` 到 `endi` 的所有整数，包括 `starti` 和 `endi` 。

**包含集合** 是一个名为 `nums` 的数组，并满足 `intervals` 中的每个区间都 **至少** 有 **两个** 整数在 `nums` 中。

* 例如，如果 `intervals = [[1,3], [3,7], [8,9]]` ，那么 `[1,2,4,7,8,9]` 和 `[2,3,4,8,9]` 都符合 **包含集合** 的定义。

返回包含集合可能的最小大小。

**示例 1：**

```
输入：intervals = [[1,3],[3,7],[8,9]]
输出：5
解释：nums = [2, 3, 4, 8, 9].
可以证明不存在元素数量为 4 的包含集合。
```

**示例 2：**

```
输入：intervals = [[1,3],[1,4],[2,5],[3,5]]
输出：3
解释：nums = [2, 3, 4].
可以证明不存在元素数量为 2 的包含集合。
```

**示例 3：**

```
输入：intervals = [[1,2],[2,3],[2,4],[4,5]]
输出：5
解释：nums = [1, 2, 3, 4, 5].
可以证明不存在元素数量为 4 的包含集合。
```

**提示：**

* `1 <= intervals.length <= 3000`
* `intervals[i].length == 2`
* `0 <= starti < endi <= 108`

##### 贪心，选择区间前m个数

```js
/**
 * @param {number[][]} intervals
 * @return {number}
 */
var intersectionSizeTwo = function (intervals) {
    intervals.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
    const n = intervals.length, m = 2;
    // 记录每个区间已选的数
    const temp = Array.from({ length: n }, () => []);

    // 将选择的数加到相交的区间中
    const help = (i, num) => {
        for (; i >= 0; i--) {
            if (intervals[i][1] < num) {
                break;
            }
            temp[i].push(num);
        }
    }

    let ans = 0;
    // 贪心每个区间只选择前m个数
    // 以最后一个区间为例，选择前m个数重叠的区间数量一定最大
    for (let i = n - 1; i >= 0; i--) {
        for (let j = intervals[i][0], k = temp[i].length; k < m; k++, j++) {
            ans++;
            help(i, j);
        }
    }

    return ans;
};
```

