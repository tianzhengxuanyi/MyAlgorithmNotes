### 2025-12-25

#### [543. 二叉树的直径](https://leetcode.cn/problems/diameter-of-binary-tree/description/)

给你一棵二叉树的根节点，返回该树的 **直径** 。

二叉树的 **直径** 是指树中任意两个节点之间最长路径的 **长度** 。这条路径可能经过也可能不经过根节点 `root` 。

两节点之间路径的 **长度** 由它们之间边数表示。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/03/06/diamtree.jpg)

```
输入：root = [1,2,3,4,5]
输出：3
解释：3 ，取路径 [4,2,1,3] 或 [5,2,1,3] 的长度。
```

**示例 2：**

```
输入：root = [1,2]
输出：1
```

**提示：**

* 树中节点数目在范围 `[1, 104]` 内
* `-100 <= Node.val <= 100`

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
var diameterOfBinaryTree = function(root) {
    let ans = 0;
    const dfs = (node) => {
        if (!node) return -1;
        let left = dfs(node.left) + 1;
        let right = dfs(node.right) + 1;
        ans = Math.max(ans, left + right);
        return Math.max(left, right);
    }
    dfs(root);
    return ans;
};
```

#### [101. 对称二叉树](https://leetcode.cn/problems/symmetric-tree/description/)

给你一个二叉树的根节点 `root` ， 检查它是否轴对称。

**示例 1：**

![](https://pic.leetcode.cn/1698026966-JDYPDU-image.png)

```
输入：root = [1,2,2,3,4,4,3]
输出：true
```

**示例 2：**

![](https://pic.leetcode.cn/1698027008-nPFLbM-image.png)

```
输入：root = [1,2,2,null,3,null,3]
输出：false
```

**提示：**

* 树中节点数目在范围 `[1, 1000]` 内
* `-100 <= Node.val <= 100`

**进阶：**你可以运用递归和迭代两种方法解决这个问题吗？

##### 迭代

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
 * @return {boolean}
 */
var isSymmetric = function(root) {
    const q = [];
    q.push(root), q.push(root);
    while (q.length) {
        let u = q.shift(), v = q.shift();
        if (!u && !v) continue;
        if (!u || !v || u.val != v.val) return false;
        q.push(u.left), q.push(v.right);
        q.push(u.right), q.push(v.left);
    }
    return true;
};


```

##### 递归

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
 * @return {boolean}
 */
var isSymmetric = function (root) {
    return check(root.left, root.right);
};

const check = (node1, node2) => {
    if (!node1 && !node2) return true;
    if (!node1 || !node2 || node1.val != node2.val) return false;
    let left = check(node1.left, node2.right);
    let right = check(node1.right, node2.left);
    return left && right;
}
```

#### [226. 翻转二叉树](https://leetcode.cn/problems/invert-binary-tree/description/)

给你一棵二叉树的根节点 `root` ，翻转这棵二叉树，并返回其根节点。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/03/14/invert1-tree.jpg)

```
输入：root = [4,2,7,1,3,6,9]
输出：[4,7,2,9,6,3,1]
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2021/03/14/invert2-tree.jpg)

```
输入：root = [2,1,3]
输出：[2,3,1]
```

**示例 3：**

```
输入：root = []
输出：[]
```

**提示：**

* 树中节点数目范围在 `[0, 100]` 内
* `-100 <= Node.val <= 100`

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
 * @return {TreeNode}
 */
var invertTree = function(root) {
    if (!root) return root;
    [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
    return root;
};
```

#### [3075. 幸福值最大化的选择方案](https://leetcode.cn/problems/maximize-happiness-of-selected-children/description/)

给你一个长度为 `n` 的数组 `happiness` ，以及一个 **正整数** `k` 。

`n` 个孩子站成一队，其中第 `i` 个孩子的 **幸福值** 是`happiness[i]` 。你计划组织 `k` 轮筛选从这 `n` 个孩子中选出 `k` 个孩子。

在每一轮选择一个孩子时，所有 **尚未** 被选中的孩子的 **幸福值** 将减少 `1` 。注意，幸福值 **不能** 变成负数，且只有在它是正数的情况下才会减少。

选择 `k` 个孩子，并使你选中的孩子幸福值之和最大，返回你能够得到的**最大值** 。

**示例 1：**

```
输入：happiness = [1,2,3], k = 2
输出：4
解释：按以下方式选择 2 个孩子：
- 选择幸福值为 3 的孩子。剩余孩子的幸福值变为 [0,1] 。
- 选择幸福值为 1 的孩子。剩余孩子的幸福值变为 [0] 。注意幸福值不能小于 0 。
所选孩子的幸福值之和为 3 + 1 = 4 。
```

**示例 2：**

```
输入：happiness = [1,1,1,1], k = 2
输出：1
解释：按以下方式选择 2 个孩子：
- 选择幸福值为 1 的任意一个孩子。剩余孩子的幸福值变为 [0,0,0] 。
- 选择幸福值为 0 的孩子。剩余孩子的幸福值变为 [0,0] 。
所选孩子的幸福值之和为 1 + 0 = 1 。
```

**示例 3：**

```
输入：happiness = [2,3,4,5], k = 1
输出：5
解释：按以下方式选择 1 个孩子：
- 选择幸福值为 5 的孩子。剩余孩子的幸福值变为 [1,2,3] 。
所选孩子的幸福值之和为 5 。
```

**提示：**

* `1 <= n == happiness.length <= 2 * 105`
* `1 <= happiness[i] <= 108`
* `1 <= k <= n`

##### 贪心：选最大的k个

```js
/**
 * @param {number[]} happiness
 * @param {number} k
 * @return {number}
 */
var maximumHappinessSum = function(happiness, k) {
    happiness.sort((a, b) => b - a);
    let ans = 0;
    for (let i = 0; i < k && happiness[i] > i; i++) {
        ans += happiness[i] - i;
    }
    return ans;
};
```

