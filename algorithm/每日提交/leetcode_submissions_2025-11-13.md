### 2025-11-13

#### [530. 二叉搜索树的最小绝对差](https://leetcode.cn/problems/minimum-absolute-difference-in-bst/description/)

给你一个二叉搜索树的根节点 `root` ，返回 **树中任意两不同节点值之间的最小差值** 。

差值是一个正数，其数值等于两值之差的绝对值。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/02/05/bst1.jpg)

```
输入：root = [4,2,6,1,3]
输出：1
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2021/02/05/bst2.jpg)

```
输入：root = [1,0,48,null,null,12,49]
输出：1
```

**提示：**

* 树中节点的数目范围是 `[2, 104]`
* `0 <= Node.val <= 105`

**注意：**本题与 783 <https://leetcode-cn.com/problems/minimum-distance-between-bst-nodes/> 相同

##### 中序遍历记录上一个节点的值，当前节点和prev的差值更新答案

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
var getMinimumDifference = function (root) {
    let prev = -1, min = Infinity;
    const dfs = (node) => {
        if (!node) return;
        dfs(node.left);
        if (prev < 0) {
            prev = node.val;
        } else {
            min = Math.min(min, Math.abs(prev - node.val));
            prev = node.val;
        }
        dfs(node.right);
    }
    dfs(root)
    return min;
};
```

#### [700. 二叉搜索树中的搜索](https://leetcode.cn/problems/search-in-a-binary-search-tree/description/)

给定二叉搜索树（BST）的根节点 `root` 和一个整数值 `val`。

你需要在 BST 中找到节点值等于 `val` 的节点。 返回以该节点为根的子树。 如果节点不存在，则返回 `null` 。

**示例 1:**

![](https://assets.leetcode.com/uploads/2021/01/12/tree1.jpg)

```
输入：root = [4,2,7,1,3], val = 2
输出：[2,1,3]
```

**示例 2:**

![](https://assets.leetcode.com/uploads/2021/01/12/tree2.jpg)

```
输入：root = [4,2,7,1,3], val = 5
输出：[]
```

**提示：**

* 树中节点数在 `[1, 5000]` 范围内
* `1 <= Node.val <= 107`
* `root` 是二叉搜索树
* `1 <= val <= 107`

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
 * @param {number} val
 * @return {TreeNode}
 */
var searchBST = function(root, val) {
    if (!root) return root;
    while (root) {
        if (root.val == val) {
            return root;
        }
        root = root.val > val ? root.left : root.right;
    }
    return null;
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
 * @param {number} val
 * @return {TreeNode}
 */
var searchBST = function (root, val) {
    if (!root) return root;
    if (root.val == val) return root;
    return searchBST(root.val > val ? root.left : root.right, val);
};
```

#### [1123. 最深叶节点的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-deepest-leaves/description/)

给你一个有根节点 `root` 的二叉树，返回它 *最深的叶节点的最近公共祖先* 。

回想一下：

* **叶节点** 是二叉树中没有子节点的节点
* 树的根节点的 **深度**为 `0`，如果某一节点的深度为 `d`，那它的子节点的深度就是 `d+1`
* 如果我们假定 `A` 是一组节点 `S` 的 **最近公共祖先**，`S` 中的每个节点都在以 `A` 为根节点的子树中，且 `A` 的深度达到此条件下可能的最大值。

**示例 1：**

![](https://s3-lc-upload.s3.amazonaws.com/uploads/2018/07/01/sketch1.png)

```
输入：root = [3,5,1,6,2,0,8,null,null,7,4]
输出：[2,7,4]
解释：我们返回值为 2 的节点，在图中用黄色标记。
在图中用蓝色标记的是树的最深的节点。
注意，节点 6、0 和 8 也是叶节点，但是它们的深度是 2 ，而节点 7 和 4 的深度是 3 。
```

**示例 2：**

```
输入：root = [1]
输出：[1]
解释：根节点是树中最深的节点，它是它本身的最近公共祖先。
```

**示例 3：**

```
输入：root = [0,1,3,null,2]
输出：[2]
解释：树中最深的叶节点是 2 ，最近公共祖先是它自己。
```

**提示：**

* 树中的节点数将在 `[1, 1000]` 的范围内。
* `0 <= Node.val <= 1000`
* 每个节点的值都是 **独一无二** 的。

**注意：**本题与力扣 865 重复：<https://leetcode-cn.com/problems/smallest-subtree-with-all-the-deepest-nodes/>

##### 同865

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
var lcaDeepestLeaves = function (root) {
    const dfs = (node, d) => {
        if (!node.left && !node.right) {
            return [node, d];
        }
        if (node.left && node.right) {
            const [ln, ld] = dfs(node.left, d + 1);
            const [rn, rd] = dfs(node.right, d + 1);
            if (ld == rd) {
                return [node, ld];
            } else {
                return [ld > rd ? ln : rn, Math.max(ld, rd)];
            }
        } else if (node.left) {
            return dfs(node.left, d + 1);
        } else {
            return dfs(node.right, d + 1);
        }
    }

    return dfs(root, 1)[0];
};
```

#### [235. 二叉搜索树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-search-tree/description/)

给定一个二叉搜索树, 找到该树中两个指定节点的最近公共祖先。

[百度百科](https://baike.baidu.com/item/%E6%9C%80%E8%BF%91%E5%85%AC%E5%85%B1%E7%A5%96%E5%85%88/8918834?fr=aladdin)中最近公共祖先的定义为：“对于有根树 T 的两个结点 p、q，最近公共祖先表示为一个结点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（**一个节点也可以是它自己的祖先**）。”

例如，给定如下二叉搜索树:  root = [6,2,8,0,4,7,9,null,null,3,5]

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/14/binarysearchtree_improved.png)

**示例 1:**

```
输入: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
输出: 6 
解释: 节点 2 和节点 8 的最近公共祖先是 6。
```

**示例 2:**

```
输入: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4
输出: 2
解释: 节点 2 和节点 4 的最近公共祖先是 2, 因为根据定义最近公共祖先节点可以为节点本身。
```

**说明:**

* 所有节点的值都是唯一的。
* p、q 为不同节点且均存在于给定的二叉搜索树中。

##### 根据二叉搜索树性质判断p和q在左子树或右子树，分类讨论

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
    const dfs = (node) => {
        if (!node || node == p || node == q) return node;;
        if (node.val > p.val && node.val > q.val) {
            return dfs(node.left);
        } else if (node.val < p.val && node.val < q.val){
            return dfs(node.right);
        } else {
            return node;
        }
    }

    return dfs(root);
};
```

##### LCM 模版

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
var lowestCommonAncestor = function (root, p, q) {
    if (!root || root == p || root == q) {
        return root; // 找到 p 或 q 就不往下递归了
    }

    const left = lowestCommonAncestor(root.left, p, q);
    const right = lowestCommonAncestor(root.right, p, q);

    if (left && right) {  // 左右都找到
        return root; // 当前节点是最近公共祖先
    }

    // 如果只有左子树找到，就返回左子树的返回值
    // 如果只有右子树找到，就返回右子树的返回值
    // 如果左右子树都没有找到，就返回 null（注意此时 right = null）
    return left ?? right;
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

##### LCA 模版

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
var lowestCommonAncestor = function (root, p, q) {
    if (!root || root == p || root == q) {
        return root; // 找到 p 或 q 就不往下递归了
    }

    const left = lowestCommonAncestor(root.left, p, q);
    const right = lowestCommonAncestor(root.right, p, q);

    if (left && right) {  // 左右都找到
        return root; // 当前节点是最近公共祖先
    }

    // 如果只有左子树找到，就返回左子树的返回值
    // 如果只有右子树找到，就返回右子树的返回值
    // 如果左右子树都没有找到，就返回 null（注意此时 right = null）
    return left ?? right;
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

##### 路径前缀和 + 回溯

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
var pathSum = function(root, targetSum) {
    const cnt = new Map([[0, 1]]);
    let ans = 0;
    // 回溯，以node为路径结尾且路径和为targetSum（通过前缀和得到路径和）
    const dfs = (node, sum) => {
        if (!node) return;
        let newSum = sum + node.val;
        ans += cnt.get(newSum - targetSum) ?? 0;
        cnt.set(newSum, (cnt.get(newSum) ?? 0) + 1);
        dfs(node.left, newSum);
        dfs(node.right, newSum);
        // 回溯
        cnt.set(newSum, cnt.get(newSum) - 1);
    }
    dfs(root, 0);
    return ans;
};
```

##### 以node为根和不以node为根的递归

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
    return myPathSum(root, targetSum);
};

// node子树中路径和为target的路径数
const myPathSum = (node, target) => {
    if (!node) return 0;
    // 以node为root的路径数 + 不以node为root（左子树 + 右子树）
    return rootPathSum(node, target) + myPathSum(node.left, target)
        + myPathSum(node.right, target);
}

// 必须以node为root且路径和为target的路径数
const rootPathSum = (node, target) => {
    if (!node) return 0;
    let newTarget = target - node.val;
    return (newTarget == 0 ? 1 : 0) + rootPathSum(node.left, newTarget)
        + rootPathSum(node.right, newTarget);
}
```

#### [113. 路径总和 II](https://leetcode.cn/problems/path-sum-ii/description/)

给你二叉树的根节点 `root` 和一个整数目标和 `targetSum` ，找出所有 **从根节点到叶子节点** 路径总和等于给定目标和的路径。

**叶子节点** 是指没有子节点的节点。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/01/18/pathsumii1.jpg)

```
输入：root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
输出：[[5,4,11,2],[5,8,4,5]]
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2021/01/18/pathsum2.jpg)

```
输入：root = [1,2,3], targetSum = 5
输出：[]
```

**示例 3：**

```
输入：root = [1,2], targetSum = 0
输出：[]
```

**提示：**

* 树中节点总数在范围 `[0, 5000]` 内
* `-1000 <= Node.val <= 1000`
* `-1000 <= targetSum <= 1000`

##### 回溯

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
 * @return {number[][]}
 */
var pathSum = function(root, targetSum) {
    const ans = [], path = [];
    const dfs = (node, target) => {
        if (!node) return;
        path.push(node.val);
        const newTarget = target - node.val;
        if (!node.left && !node.right && newTarget == 0) {
            ans.push([...path]);
        }
        dfs(node.left, newTarget), dfs(node.right, newTarget);
        path.pop();
    }
    dfs(root, targetSum);
    return ans;
};
```

#### [257. 二叉树的所有路径](https://leetcode.cn/problems/binary-tree-paths/description/)

给你一个二叉树的根节点 `root` ，按 **任意顺序** ，返回所有从根节点到叶子节点的路径。

**叶子节点** 是指没有子节点的节点。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/03/12/paths-tree.jpg)

```
输入：root = [1,2,3,null,5]
输出：["1->2->5","1->3"]
```

**示例 2：**

```
输入：root = [1]
输出：["1"]
```

**提示：**

* 树中节点的数目在范围 `[1, 100]` 内
* `-100 <= Node.val <= 100`

##### 回溯

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
 * @return {string[]}
 */
var binaryTreePaths = function(root) {
    const ans = [];
    const dfs = (node, path) => {
        if (!node) return;
        path.push(node.val);
        if (!node.left && !node.right) {
            ans.push(path.join("->"));
        }
        dfs(node.left, path);
        dfs(node.right, path);
        path.pop();
    }
    dfs(root, []);
    return ans;
};
```

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

##### 递归直径

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
        const l = dfs(node.left) + 1;
        const r = dfs(node.right) + 1;
        ans = Math.max(ans, l + r);
        return Math.max(l, r);
    }
    dfs(root);
    return ans;
};
```

#### [865. 具有所有最深节点的最小子树](https://leetcode.cn/problems/smallest-subtree-with-all-the-deepest-nodes/description/)

给定一个根为 `root` 的二叉树，每个节点的深度是 **该节点到根的最短距离** 。

返回包含原始树中所有 **最深节点** 的 *最小子树* 。

如果一个节点在 **整个树** 的任意节点之间具有最大的深度，则该节点是 **最深的** 。

一个节点的 **子树** 是该节点加上它的所有后代的集合。

**示例 1：**

![](https://s3-lc-upload.s3.amazonaws.com/uploads/2018/07/01/sketch1.png)

```
输入：root = [3,5,1,6,2,0,8,null,null,7,4]
输出：[2,7,4]
解释：
我们返回值为 2 的节点，在图中用黄色标记。
在图中用蓝色标记的是树的最深的节点。
注意，节点 5、3 和 2 包含树中最深的节点，但节点 2 的子树最小，因此我们返回它。
```

**示例 2：**

```
输入：root = [1]
输出：[1]
解释：根节点是树中最深的节点。
```

**示例 3：**

```
输入：root = [0,1,3,null,2]
输出：[2]
解释：树中最深的节点为 2 ，有效子树为节点 2、1 和 0 的子树，但节点 2 的子树最小。
```

**提示：**

* 树中节点的数量在 `[1, 500]` 范围内。
* `0 <= Node.val <= 500`
* 每个节点的值都是 **独一无二** 的。

**注意：**本题与力扣 1123 重复：[https://leetcode-cn.com/problems/lowest-common-ancestor-of-deepest-leaves](https://leetcode-cn.com/problems/lowest-common-ancestor-of-deepest-leaves/)

##### 递归，分条件讨论，如果叶子结点返回[node,当前深度]；如果左节点和右节点都存在，判断两侧返回的深度，如果深度一致则返回[curr,左侧节点深度]，如果不一致，返回两侧较大的返回值；如果只有一侧，返回单侧的递归返回值

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
var subtreeWithAllDeepest = function (root) {
    const dfs = (node, depth) => {
        if (!node.left && !node.right) {
            return [node, depth];
        }
        if (node.left && node.right) {
            const [ln, ld] = dfs(node.left, depth + 1);
            const [rn, rd] = dfs(node.right, depth + 1);
            if (ld == rd) {
                return [node, ld];
            } else {
                return [ld > rd ? ln : rn, Math.max(ld, rd)];
            }
        } else if (node.left) {
            return dfs(node.left, depth + 1);
        } else {
            return dfs(node.right, depth + 1);
        }

    }
    return dfs(root, 1)[0];
};
```

#### [3228. 将 1 移动到末尾的最大操作次数](https://leetcode.cn/problems/maximum-number-of-operations-to-move-ones-to-the-end/description/)

给你一个 二进制字符串 `s`。

你可以对这个字符串执行 **任意次** 下述操作：

* 选择字符串中的任一下标 `i`（ `i + 1 < s.length` ），该下标满足 `s[i] == '1'` 且 `s[i + 1] == '0'`。
* 将字符 `s[i]` 向 **右移** 直到它到达字符串的末端或另一个 `'1'`。例如，对于 `s = "010010"`，如果我们选择 `i = 1`，结果字符串将会是 `s = "000110"`。

返回你能执行的 **最大** 操作次数。

**示例 1：**

**输入：** s = "1001101"

**输出：** 4

**解释：**

可以执行以下操作：

* 选择下标 `i = 0`。结果字符串为 `s = "0011101"`。
* 选择下标 `i = 4`。结果字符串为 `s = "0011011"`。
* 选择下标 `i = 3`。结果字符串为 `s = "0010111"`。
* 选择下标 `i = 2`。结果字符串为 `s = "0001111"`。

**示例 2：**

**输入：** s = "00111"

**输出：** 0

**提示：**

* `1 <= s.length <= 105`
* `s[i]` 为 `'0'` 或 `'1'`。

##### 堵车模型

```js
/**
 * @param {string} s
 * @return {number}
 */
var maxOperations = function(s) {
    // 堵车模型
    let cnt = 0, ans = 0;
    for (let i = 0; i < s.length; i++) {
        if (s[i] == 1) {
            cnt++; // 左侧车辆的个数
        } else {
            if (s[i - 1] == 1) {
                ans += cnt; // 遇到可通行的道路，左侧车辆数都操作一次
            }
        }
    }

    return ans;
};
```

##### 当前1可操作的次数为右侧连续0 的段数

```js
/**
 * @param {string} s
 * @return {number}
 */
var maxOperations = function(s) {
    let cnt = 0, ans = 0;
    for (let i = s.length - 1; i >= 0; i--) {
        if (s[i] == 1) {
            // 当前1可操作的次数为右侧连续0 的段数
            ans += cnt;
        } else {
            let j = i; 
            // 跳过相邻的0
            while (s[j - 1] == 0) {
                j--;
            }
            // 连续0的段数加一
            cnt++;
            i = j;
        }
    }

    return ans;
};
```

