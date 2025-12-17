### 2025-12-17

#### [160. 相交链表](https://leetcode.cn/problems/intersection-of-two-linked-lists/description/)

给你两个单链表的头节点 `headA` 和 `headB` ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 `null` 。

图示两个链表在节点 `c1` 开始相交**：**

[![](https://assets.leetcode.cn/aliyun-lc-upload/uploads/2018/12/14/160_statement.png)](https://assets.leetcode.cn/aliyun-lc-upload/uploads/2018/12/14/160_statement.png)

题目数据 **保证** 整个链式结构中不存在环。

**注意**，函数返回结果后，链表必须 **保持其原始结构** 。

**自定义评测：**

**评测系统** 的输入如下（你设计的程序 **不适用** 此输入）：

* `intersectVal` - 相交的起始节点的值。如果不存在相交节点，这一值为 `0`
* `listA` - 第一个链表
* `listB` - 第二个链表
* `skipA` - 在 `listA` 中（从头节点开始）跳到交叉节点的节点数
* `skipB` - 在 `listB` 中（从头节点开始）跳到交叉节点的节点数

评测系统将根据这些输入创建链式数据结构，并将两个头节点 `headA` 和 `headB` 传递给你的程序。如果程序能够正确返回相交节点，那么你的解决方案将被 **视作正确答案** 。

**示例 1：**

[![](https://assets.leetcode.com/uploads/2021/03/05/160_example_1_1.png)](https://assets.leetcode.com/uploads/2018/12/13/160_example_1.png)

```
输入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3
输出：Intersected at '8'
解释：相交节点的值为 8 （注意，如果两个链表相交则不能为 0）。
从各自的表头开始算起，链表 A 为 [4,1,8,4,5]，链表 B 为 [5,6,1,8,4,5]。
在 A 中，相交节点前有 2 个节点；在 B 中，相交节点前有 3 个节点。
— 请注意相交节点的值不为 1，因为在链表 A 和链表 B 之中值为 1 的节点 (A 中第二个节点和 B 中第三个节点) 是不同的节点。换句话说，它们在内存中指向两个不同的位置，而链表 A 和链表 B 中值为 8 的节点 (A 中第三个节点，B 中第四个节点) 在内存中指向相同的位置。
```

**示例 2：**

[![](https://assets.leetcode.com/uploads/2021/03/05/160_example_2.png)](https://assets.leetcode.com/uploads/2018/12/13/160_example_2.png)

```
输入：intersectVal = 2, listA = [1,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1
输出：Intersected at '2'
解释：相交节点的值为 2 （注意，如果两个链表相交则不能为 0）。
从各自的表头开始算起，链表 A 为 [1,9,1,2,4]，链表 B 为 [3,2,4]。
在 A 中，相交节点前有 3 个节点；在 B 中，相交节点前有 1 个节点。
```

**示例 3：**

[![](https://assets.leetcode.cn/aliyun-lc-upload/uploads/2018/12/14/160_example_3.png)](https://assets.leetcode.com/uploads/2018/12/13/160_example_3.png)

```
输入：intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2
输出：No intersection
解释：从各自的表头开始算起，链表 A 为 [2,6,4]，链表 B 为 [1,5]。
由于这两个链表不相交，所以 intersectVal 必须为 0，而 skipA 和 skipB 可以是任意值。
这两个链表不相交，因此返回 null 。
```

**提示：**

* `listA` 中节点数目为 `m`
* `listB` 中节点数目为 `n`
* `1 <= m, n <= 3 * 104`
* `1 <= Node.val <= 105`
* `0 <= skipA <= m`
* `0 <= skipB <= n`
* 如果 `listA` 和 `listB` 没有交点，`intersectVal` 为 `0`
* 如果 `listA` 和 `listB` 有交点，`intersectVal == listA[skipA] == listB[skipB]`

**进阶：**你能否设计一个时间复杂度 `O(m + n)` 、仅用 `O(1)` 内存的解决方案？

##### 双指针

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function(headA, headB) {
    if (!headA || !headB) return null;
    let nodeA = headA, nodeB = headB;
    while (nodeA != nodeB) {
        nodeA = nodeA ? nodeA.next : headB;
        nodeB = nodeB ? nodeB.next : headA;
    }
    return nodeA;
};
```

##### 哈希set

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function(headA, headB) {
    const st = new Set();
    let nodeA = headA;
    while (nodeA) {
        st.add(nodeA);
        nodeA = nodeA.next;
    }
    let nodeB = headB;
    while (nodeB) {
        if (st.has(nodeB)) return nodeB;
        nodeB = nodeB.next;
    }

    return null;
};
```

#### [240. 搜索二维矩阵 II](https://leetcode.cn/problems/search-a-2d-matrix-ii/description/)

编写一个高效的算法来搜索 `m x n` 矩阵 `matrix` 中的一个目标值 `target` 。该矩阵具有以下特性：

* 每行的元素从左到右升序排列。
* 每列的元素从上到下升序排列。

**示例 1：**

![](https://assets.leetcode.cn/aliyun-lc-upload/uploads/2020/11/25/searchgrid2.jpg)

```
输入：matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5
输出：true
```

**示例 2：**

![](https://assets.leetcode.cn/aliyun-lc-upload/uploads/2020/11/25/searchgrid.jpg)

```
输入：matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 20
输出：false
```

**提示：**

* `m == matrix.length`
* `n == matrix[i].length`
* `1 <= n, m <= 300`
* `-109 <= matrix[i][j] <= 109`
* 每行的所有元素从左到右升序排列
* 每列的所有元素从上到下升序排列
* `-109 <= target <= 109`

##### 排除法：z字形查找

```js
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function(matrix, target) {
    const m = matrix.length, n = matrix[0].length;
    let i = 0, j = n - 1;
    while (i < m && j >= 0) {
        if (matrix[i][j] == target) {
            return true;
        } else if (matrix[i][j] > target) {
            // 整列都大于target
            j--;
        } else {
            // 整行都小于target
            i++;
        }
    }

    return false;
};
```

#### [48. 旋转图像](https://leetcode.cn/problems/rotate-image/description/)

给定一个 *n*× *n* 的二维矩阵 `matrix` 表示一个图像。请你将图像顺时针旋转 90 度。

你必须在 **[原地](https://baike.baidu.com/item/%E5%8E%9F%E5%9C%B0%E7%AE%97%E6%B3%95)** 旋转图像，这意味着你需要直接修改输入的二维矩阵。**请不要** 使用另一个矩阵来旋转图像。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/08/28/mat1.jpg)

```
输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
输出：[[7,4,1],[8,5,2],[9,6,3]]
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2020/08/28/mat2.jpg)

```
输入：matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
输出：[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]
```

**提示：**

* `n == matrix.length == matrix[i].length`
* `1 <= n <= 20`
* `-1000 <= matrix[i][j] <= 1000`

##### 转置 + 翻转行

```js
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function(matrix) {
    const n = matrix.length;
    // (i, j)的元素旋转90°后到(j, n - 1 - i)
    // 通过转置矩阵(i, j) -> (j, i)
    // 翻转行(j, i) -> (j, n - 1 - i)
    for (let j = 0; j < n; j++) {
        // 转置数组
        for (let i = 0; i < j; i++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }

    // 翻转行
    for (let i = 0; i < n; i++) {
        matrix[i].reverse();
    }
};
```

##### 自外向内

```js
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function (matrix) {
    const n = matrix.length;
    let l = 0, r = n - 1, t = 0, b = n - 1;
    while (l <= r && t <= b) {
        for (let k = 0; k < r - l; k++) {
            let i = l, j = t + k, p = matrix[i][j];
            let next = [[t + k, r], [b, r - k], [b - k, l], [t, l + k]];
            for (let [ni, nj] of next) {
                [p, matrix[ni][nj]] = [matrix[ni][nj], p];
            }
        }
        l++, r--, t++, b--;
    }
};
```

#### [3573. 买卖股票的最佳时机 V](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-v/description/)

给你一个整数数组 `prices`，其中 `prices[i]` 是第 `i` 天股票的价格（美元），以及一个整数 `k`。

你最多可以进行 `k` 笔交易，每笔交易可以是以下任一类型：

* **普通交易**：在第 `i` 天买入，然后在之后的第 `j` 天卖出，其中 `i < j`。你的利润是 `prices[j] - prices[i]`。
* **做空交易**：在第 `i` 天卖出，然后在之后的第 `j` 天买回，其中 `i < j`。你的利润是 `prices[i] - prices[j]`。

**注意**：你必须在开始下一笔交易之前完成当前交易。此外，你不能在已经进行买入或卖出操作的同一天再次进行买入或卖出操作。

通过进行 **最多** `k` 笔交易，返回你可以获得的最大总利润。

**示例 1:**

**输入:** prices = [1,7,9,8,2], k = 2

**输出:** 14

**解释:**

我们可以通过 2 笔交易获得 14 美元的利润：

* 一笔普通交易：第 0 天以 1 美元买入，第 2 天以 9 美元卖出。
* 一笔做空交易：第 3 天以 8 美元卖出，第 4 天以 2 美元买回。

**示例 2:**

**输入:** prices = [12,16,19,19,8,1,19,13,9], k = 3

**输出:** 36

**解释:**

我们可以通过 3 笔交易获得 36 美元的利润：

* 一笔普通交易：第 0 天以 12 美元买入，第 2 天以 19 美元卖出。
* 一笔做空交易：第 3 天以 19 美元卖出，第 4 天以 8 美元买回。
* 一笔普通交易：第 5 天以 1 美元买入，第 6 天以 19 美元卖出。

**提示:**

* `2 <= prices.length <= 103`
* `1 <= prices[i] <= 109`
* `1 <= k <= prices.length / 2`

##### 迭代+空间压缩优化

```js
/**
 * @param {number[]} prices
 * @param {number} k
 * @return {number}
 */
var maximumProfit = function (prices, k) {
    const n = prices.length;
    const f = Array.from({ length: 2 }, () => Array.from({ length: k + 1 }, () => Array(3).fill(0)))
    for (let r = 1; r <= k; r++) {
        f[(n - 1) % 2][r][0] = 0, f[(n - 1) % 2][r][1] = prices[n - 1], f[(n - 1) % 2][r][2] = -prices[n - 1];
    }
    // buy: 0: 不持有股票 1：持有股票（普通交易买入） 2：倒欠股票（做空交易卖出）
    for (let i = n - 2; i >= 0; i--) {
        for (let r = 1; r <= k; r++) {
            for (let b = 0; b <= 2; b++) {
                let p1 = f[(i + 1) % 2][r][b]; // 当天不进行操作
                if (b == 0) {
                    f[i % 2][r][b] = Math.max(p1,
                        f[(i + 1) % 2][r][1] - prices[i],
                        f[(i + 1) % 2][r][2] + prices[i])
                } else if (b == 1) {
                    f[i % 2][r][b] = Math.max(p1,
                        f[(i + 1) % 2][r - 1][0] + prices[i])  // 当天普通交易卖出
                } else {
                    f[i % 2][r][b] = Math.max(p1,
                        f[(i + 1) % 2][r - 1][0] - prices[i]) // 当天做空交易买回
                }
            }
        }
    }
    return f[0][k][0];
};
```

##### dfs记忆化搜索

```js
/**
 * @param {number[]} prices
 * @param {number} k
 * @return {number}
 */
var maximumProfit = function (prices, k) {
    const n = prices.length;
    const memo = Array.from({ length: n }, () => Array.from({ length: k + 1 }, () => []))
    // buy: 0: 不持有股票 1：持有股票（普通交易买入） 2：倒欠股票（做空交易卖出）
    const dfs = (i, buy, r) => {
        if (r <= 0) return 0;
        if (i == n - 1) return buy == 1 ? prices[i] : buy == 2 ? -prices[i] : 0;
        if (memo[i][r][buy] !== undefined) return memo[i][r][buy];
        let profit = dfs(i + 1, buy, r); // 当天不进行操作
        if (buy == 0) {
            profit = Math.max(profit,
                dfs(i + 1, 1, r) - prices[i],
                dfs(i + 1, 2, r) + prices[i])
        } else if (buy == 1) {
            profit = Math.max(profit,
                dfs(i + 1, 0, r - 1) + prices[i])  // 当天普通交易卖出
        } else {
            profit = Math.max(profit,
                dfs(i + 1, 0, r - 1) - prices[i]) // 当天做空交易买回
        }
        return memo[i][r][buy] = profit;
    }

    return dfs(0, 0, k);
};
```

