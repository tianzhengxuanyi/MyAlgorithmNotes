### 2025-12-29

#### [124. 二叉树中的最大路径和](https://leetcode.cn/problems/binary-tree-maximum-path-sum/description/)

二叉树中的 **路径** 被定义为一条节点序列，序列中每对相邻节点之间都存在一条边。同一个节点在一条路径序列中 **至多出现一次** 。该路径 **至少包含一个** 节点，且不一定经过根节点。

**路径和** 是路径中各节点值的总和。

给你一个二叉树的根节点 `root` ，返回其 **最大路径和** 。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/10/13/exx1.jpg)

```
输入：root = [1,2,3]
输出：6
解释：最优路径是 2 -> 1 -> 3 ，路径和为 2 + 1 + 3 = 6
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2020/10/13/exx2.jpg)

```
输入：root = [-10,9,20,null,null,15,7]
输出：42
解释：最优路径是 15 -> 20 -> 7 ，路径和为 15 + 20 + 7 = 42
```

**提示：**

* 树中节点数目范围是 `[1, 3 * 104]`
* `-1000 <= Node.val <= 1000`

##### dfs

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxPathSum = function (root) {
    let ans = -Infinity;
    const dfs = (node) => {
        if (!node) return 0;
        let left = dfs(node.left), right = dfs(node.right);
        ans = Math.max(ans, left + right + node.val);
        return Math.max(0, Math.max(left, right) + node.val)
    }
    dfs(root)
    return ans;
};
```

#### [236. 二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/description/)

给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。

[百度百科](https://baike.baidu.com/item/%E6%9C%80%E8%BF%91%E5%85%AC%E5%85%B1%E7%A5%96%E5%85%88/8918834?fr=aladdin)中最近公共祖先的定义为：“对于有根树 T 的两个节点 p、q，最近公共祖先表示为一个节点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（**一个节点也可以是它自己的祖先**）。”

**示例 1：**

![](https://assets.leetcode.com/uploads/2018/12/14/binarytree.png)

```
输入：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
输出：3
解释：节点 5 和节点 1 的最近公共祖先是节点 3 。
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2018/12/14/binarytree.png)

```
输入：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
输出：5
解释：节点 5 和节点 4 的最近公共祖先是节点 5 。因为根据定义最近公共祖先节点可以为节点本身。
```

**示例 3：**

```
输入：root = [1,2], p = 1, q = 2
输出：1
```

**提示：**

* 树中节点数目在范围 `[2, 105]` 内。
* `-109 <= Node.val <= 109`
* 所有 `Node.val` `互不相同` 。
* `p != q`
* `p` 和 `q` 均存在于给定的二叉树中。

##### dfs

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q) {
    if (root == null || root == p || root == q) return root;
    let left = lowestCommonAncestor(root.left, p, q);
    let right = lowestCommonAncestor(root.right, p, q);
    if (left && right) {
        return root;
    }
    return left ? left : right;
};
```

#### [437. 路径总和 III](https://leetcode.cn/problems/path-sum-iii/description/)

给定一个二叉树的根节点 `root` ，和一个整数 `targetSum` ，求该二叉树里节点值之和等于 `targetSum` 的 **路径** 的数目。

**路径** 不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/04/09/pathsum3-1-tree.jpg)

```
输入：root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8
输出：3
解释：和等于 8 的路径有 3 条，如图所示。
```

**示例 2：**

```
输入：root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
输出：3
```

**提示:**

* 二叉树的节点个数的范围是 `[0,1000]`
* `-109 <= Node.val <= 109`
* `-1000 <= targetSum <= 1000`

##### dfs

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number}
 */
var pathSum = function (root, targetSum) {
    if (!root) return 0;
    return rootPathSum(root, targetSum) + pathSum(root.left, targetSum)
        + pathSum(root.right, targetSum);
};

const rootPathSum = function (root, target) {
    if (!root) return 0;
    const nerTarget = target - root.val;
    return (nerTarget == 0 ? 1 : 0) + rootPathSum(root.left, nerTarget)
        + rootPathSum(root.right, nerTarget)
}
```

##### 路径前缀和+回溯

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number}
 */
var pathSum = function (root, targetSum) {
    let ans = 0;
    let map = new Map([[0, 1]]);
    const dfs = (node, sum) => {
        if (!node) return;
        let curr = node.val + sum;
        ans += map.get(curr - targetSum) ?? 0;
        map.set(curr, (map.get(curr) ?? 0) + 1);
        dfs(node.left, curr), dfs(node.right, curr);
        map.set(curr, map.get(curr) - 1);
    }
    dfs(root, 0);
    return ans;
};
```

#### [756. 金字塔转换矩阵](https://leetcode.cn/problems/pyramid-transition-matrix/description/)

你正在把积木堆成金字塔。每个块都有一个颜色，用一个字母表示。每一行的块比它下面的行 **少一个块** ，并且居中。

为了使金字塔美观，只有特定的 **三角形图案** 是允许的。一个三角形的图案由 **两个块** 和叠在上面的 **单个块** 组成。模式是以三个字母字符串的列表形式 `allowed` 给出的，其中模式的前两个字符分别表示左右底部块，第三个字符表示顶部块。

* 例如，`"ABC"` 表示一个三角形图案，其中一个 `“C”` 块堆叠在一个 `'A'` 块(左)和一个 `'B'` 块(右)之上。请注意，这与 `"BAC"` 不同，`"B"` 在左下角，`"A"` 在右下角。

你从作为单个字符串给出的底部的一排积木 `bottom` 开始，**必须** 将其作为金字塔的底部。

在给定 `bottom` 和 `allowed` 的情况下，如果你能一直构建到金字塔顶部，使金字塔中的 **每个三角形图案** 都是在 `allowed` 中的，则返回 `true` ，否则返回 `false` 。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/08/26/pyramid1-grid.jpg)

```
输入：bottom = "BCD", allowed = ["BCC","CDE","CEA","FFF"]
输出：true
解释：允许的三角形图案显示在右边。
从最底层(第 3 层)开始，我们可以在第 2 层构建“CE”，然后在第 1 层构建“A”。
金字塔中有三种三角形图案，分别是 “BCC”、“CDE” 和 “CEA”。都是允许的。
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2021/08/26/pyramid2-grid.jpg)

```
输入：bottom = "AAAA", allowed = ["AAB","AAC","BCD","BBE","DEF"]
输出：false
解释：允许的三角形图案显示在右边。
从最底层(即第 4 层)开始，创造第 3 层有多种方法，但如果尝试所有可能性，你便会在创造第 1 层前陷入困境。
```

**提示：**

* `2 <= bottom.length <= 6`
* `0 <= allowed.length <= 216`
* `allowed[i].length == 3`
* 所有输入字符串中的字母来自集合 `{'A', 'B', 'C', 'D', 'E', 'F'}`。
* `allowed` 中所有值都是 **唯一的**

##### 回溯优化2：减少更多重复搜索

```js
/**
 * @param {string} bottom
 * @param {string[]} allowed
 * @return {boolean}
 */
var pyramidTransition = function (bottom, allowed) {
    const allowedMap = new Map();
    for (let x of allowed) {
        let key = x.slice(0, 2), val = x[2];
        let set = allowedMap.get(key) ?? new Set();
        set.add(val);
        allowedMap.set(key, set);
    }
    const n = bottom.length;
    const pryamid = Array.from({ length: n }, (_, i) => Array(i + 1).fill(""));
    pryamid[n - 1] = bottom.split("");
    const vis = new Set(); // 缓存枚举过的行值
    const dfs = (i, j) => {
        if (i < 0) return true;
        let row = pryamid[i].join("");
        if (vis.has(row)) return false; // 如果已经枚举过，返回false
        if (j == pryamid[i].length) {
            vis.add(row);
            return dfs(i - 1, 0);
        }
        let key = pryamid[i + 1][j] + pryamid[i + 1][j + 1];
        let vals = allowedMap.get(key);
        if (vals) {
            for (let val of vals) {
                pryamid[i][j] = val;
                if (dfs(i, j + 1)) return true;
                pryamid[i][j] = "";
            }
        }
        return false;
    }
    return dfs(n - 2, 0);
};
```

##### 回溯优化1：缓存枚举过的行值

```js
/**
 * @param {string} bottom
 * @param {string[]} allowed
 * @return {boolean}
 */
var pyramidTransition = function (bottom, allowed) {
    const allowedMap = new Map();
    for (let x of allowed) {
        let key = x.slice(0, 2), val = x[2];
        let set = allowedMap.get(key) ?? new Set();
        set.add(val);
        allowedMap.set(key, set);
    }
    const n = bottom.length;
    const pryamid = Array.from({length: n}, (_, i) => Array(i + 1).fill(""));
    pryamid[n - 1] = bottom.split("");
    const vis = new Set(); // 缓存枚举过的行值
    const dfs = (i, j) => {
        if (i <  0) return true;
        if (j == pryamid[i].length) {
            let row = pryamid[i].join("");
            if (vis.has(row)) return false; // 如果已经枚举过，返回false
            vis.add(row);
            return dfs(i - 1, 0);
        }
        let key = pryamid[i+1][j] + pryamid[i+1][j+1];
        let vals = allowedMap.get(key);
        if (vals) {
            for (let val of vals) {
                pryamid[i][j] = val;
                if (dfs(i, j+1)) return true;
                pryamid[i][j] = "";
            }
        }
        return false;
    }
    return dfs(n - 2, 0);
};
```

##### 回溯

```js
/**
 * @param {string} bottom
 * @param {string[]} allowed
 * @return {boolean}
 */
var pyramidTransition = function (bottom, allowed) {
    const allowedMap = new Map();
    for (let x of allowed) {
        let key = x.slice(0, 2), val = x[2];
        let set = allowedMap.get(key) ?? new Set();
        set.add(val);
        allowedMap.set(key, set);
    }
    const n = bottom.length;
    const pryamid = Array.from({length: n}, (_, i) => Array(i + 1).fill(""));
    pryamid[n - 1] = bottom.split("");
    const dfs = (i, j) => {
        if (i <  0) return true;
        if (j == pryamid[i].length) {
            return dfs(i - 1, 0);
        }
        let key = pryamid[i+1][j] + pryamid[i+1][j+1];
        let vals = allowedMap.get(key);
        if (vals) {
            for (let val of vals) {
                pryamid[i][j] = val;
                if (dfs(i, j+1)) return true;
                pryamid[i][j] = "";
            }
        }
        return false;
    }
    return dfs(n - 2, 0);
};
```

