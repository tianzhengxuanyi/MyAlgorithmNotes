### 2025-11-12

#### [538. 把二叉搜索树转换为累加树](https://leetcode.cn/problems/convert-bst-to-greater-tree/description/)

给出二叉 **搜索** 树的根节点，该树的节点值各不相同，请你将其转换为累加树（Greater Sum Tree），使每个节点 `node` 的新值等于原树中大于或等于 `node.val` 的值之和。

提醒一下，二叉搜索树满足下列约束条件：

* 节点的左子树仅包含键 **小于** 节点键的节点。
* 节点的右子树仅包含键 **大于** 节点键的节点。
* 左右子树也必须是二叉搜索树。

**注意：**本题和 1038: <https://leetcode-cn.com/problems/binary-search-tree-to-greater-sum-tree/> 相同

**示例 1：**

**![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/05/03/tree.png)**

```
输入：[4,1,6,0,2,5,7,null,null,null,3,null,null,null,8]
输出：[30,36,21,36,35,26,15,null,null,null,33,null,null,null,8]
```

**示例 2：**

```
输入：root = [0,null,1]
输出：[1,null,1]
```

**示例 3：**

```
输入：root = [1,0,2]
输出：[3,3,2]
```

**示例 4：**

```
输入：root = [3,2,4,1]
输出：[7,9,4,10]
```

**提示：**

* 树中的节点数介于 `0` 和 `104`之间。
* 每个节点的值介于 `-104` 和 `104` 之间。
* 树中的所有值 **互不相同** 。
* 给定的树为二叉搜索树。

##### 搜索树遍历，用一个全局变量记录累加和

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
var convertBST = function(root) {
    let s = 0;
    const dfs = (node) => {
        if (!node) return;
        dfs(node.right);
        s += node.val;
        node.val = s; // 此时 s 就是 >= node.val 的所有数之和
        dfs(node.left);
    }
    dfs(root);
    return root;
};
```

#### [1325. 删除给定值的叶子节点](https://leetcode.cn/problems/delete-leaves-with-a-given-value/description/)

给你一棵以 `root` 为根的二叉树和一个整数 `target` ，请你删除所有值为 `target` 的 **叶子节点** 。

注意，一旦删除值为 `target` 的叶子节点，它的父节点就可能变成叶子节点；如果新叶子节点的值恰好也是 `target` ，那么这个节点也应该被删除。

也就是说，你需要重复此过程直到不能继续删除。

**示例 1：**

**![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/01/16/sample_1_1684.png)**

```
输入：root = [1,2,3,2,null,2,4], target = 2
输出：[1,null,3,null,4]
解释：
上面左边的图中，绿色节点为叶子节点，且它们的值与 target 相同（同为 2 ），它们会被删除，得到中间的图。
有一个新的节点变成了叶子节点且它的值与 target 相同，所以将再次进行删除，从而得到最右边的图。
```

**示例 2：**

**![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/01/16/sample_2_1684.png)**

```
输入：root = [1,3,3,3,2], target = 3
输出：[1,3,null,null,2]
```

**示例 3：**

**![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/01/16/sample_3_1684.png)**

```
输入：root = [1,2,null,2,null,2], target = 2
输出：[1]
解释：每一步都删除一个绿色的叶子节点（值为 2）。
```

**提示：**

* 树中节点数量的范围是 `[1, 3000]`。
* `1 <= Node.val, target <= 1000`

##### 后续遍历

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
 * @param {number} target
 * @return {TreeNode}
 */
var removeLeafNodes = function(root, target) {
    if (!root) return null;
    root.left = removeLeafNodes(root.left, target);
    root.right = removeLeafNodes(root.right, target);
    if (!root.left && !root.right && root.val == target) {
        return null;
    }
    return root;
};
```

#### [814. 二叉树剪枝](https://leetcode.cn/problems/binary-tree-pruning/description/)

给你二叉树的根结点 `root` ，此外树的每个结点的值要么是 `0` ，要么是 `1` 。

返回移除了所有不包含 `1` 的子树的原二叉树。

节点 `node` 的子树为 `node` 本身加上所有 `node` 的后代。

**示例 1：**

![](https://s3-lc-upload.s3.amazonaws.com/uploads/2018/04/06/1028_2.png)

```
输入：root = [1,null,0,0,1]
输出：[1,null,0,null,1]
解释：
只有红色节点满足条件“所有不包含 1 的子树”。 右图为返回的答案。
```

**示例 2：**

![](https://s3-lc-upload.s3.amazonaws.com/uploads/2018/04/06/1028_1.png)

```
输入：root = [1,0,1,0,0,0,1]
输出：[1,null,1,null,1]
```

**示例 3：**

![](https://s3-lc-upload.s3.amazonaws.com/uploads/2018/04/05/1028.png)

```
输入：root = [1,1,0,1,1,0,1,0]
输出：[1,1,0,1,1,null,1]
```

**提示：**

* 树中节点的数目在范围 `[1, 200]` 内
* `Node.val` 为 `0` 或 `1`

##### 后续遍历

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
var pruneTree = function(root) {
    if (!root) return root;
    root.left = pruneTree(root.left);
    root.right = pruneTree(root.right);
    if (!root.right && !root.left && root.val == 0) {
        return null;
    }
    return root;
};
```

#### [617. 合并二叉树](https://leetcode.cn/problems/merge-two-binary-trees/description/)

给你两棵二叉树： `root1` 和 `root2` 。

想象一下，当你将其中一棵覆盖到另一棵之上时，两棵树上的一些节点将会重叠（而另一些不会）。你需要将这两棵树合并成一棵新二叉树。合并的规则是：如果两个节点重叠，那么将这两个节点的值相加作为合并后节点的新值；否则，**不为** null 的节点将直接作为新二叉树的节点。

返回合并后的二叉树。

**注意:** 合并过程必须从两个树的根节点开始。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/02/05/merge.jpg)

```
输入：root1 = [1,3,2,5], root2 = [2,1,3,null,4,null,7]
输出：[3,4,5,5,4,null,7]
```

**示例 2：**

```
输入：root1 = [1], root2 = [1,2]
输出：[2,2]
```

**提示：**

* 两棵树中的节点数目在范围 `[0, 2000]` 内
* `-104 <= Node.val <= 104`

##### dfs,，将tree2合并到tree1

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
 * @param {TreeNode} root1
 * @param {TreeNode} root2
 * @return {TreeNode}
 */
var mergeTrees = function(root1, root2) {
    if (!root1 && !root2) {
        return null;
    }
    if (root1 && root2) {
        root1.val = root1.val + root2.val;
        root1.left = mergeTrees(root1.left, root2.left);
        root1.right = mergeTrees(root1.right, root2.right);
        return root1;
    }
    return root1 || root2;
};
```

#### [110. 平衡二叉树](https://leetcode.cn/problems/balanced-binary-tree/description/)

给定一个二叉树，判断它是否是 平衡二叉树

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/10/06/balance_1.jpg)

```
输入：root = [3,9,20,null,null,15,7]
输出：true
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2020/10/06/balance_2.jpg)

```
输入：root = [1,2,2,3,3,null,null,4,4]
输出：false
```

**示例 3：**

```
输入：root = []
输出：true
```

**提示：**

* 树中的节点数在范围 `[0, 5000]` 内
* `-104 <= Node.val <= 104`

##### dfs，只记录depth，如果不是平衡二叉树返回-1，如果是则返回正确depth。最后判断是否为-1

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
var isBalanced = function(root) {
    return dfs(root) != -1;
};

const dfs = (root) => {
    if (!root) return 0;
    const ldepth = dfs(root.left);
    const rdepth = dfs(root.right);
    if (ldepth == -1 || rdepth == -1 || Math.abs(ldepth - rdepth) > 1) {
        return -1;
    }
    return Math.max(ldepth, rdepth) + 1;
}
```

##### dfs，记录isBalanced和depth深度信息

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
var isBalanced = function(root) {
    const dfs = (node) => {
        if (!node) return [true, 0];
        const [leftIsBalanced, leftDepth] = dfs(node.left);
        const [rightIsBalanced, rightDepth] = dfs(node.right);
        const isBalanced = leftIsBalanced && rightIsBalanced && Math.abs(leftDepth - rightDepth) <= 1;
        const depth = Math.max(leftDepth, rightDepth) + 1;
        return [isBalanced, depth];
    }

    return dfs(root)[0];
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

##### 递归，判断node1和node2是否相等，然后在判断node1.left和node2.right、node1.right和node2.left

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
    if (!root) return true;
    return check(root.left, root.right);
};

const check = (node1, node2) => {
    if (!node1 && !node2) return true;
    if ((!node1 || !node2) || node1.val != node2.val) return false;
    return check(node1.left, node2.right) && check(node1.right, node2.left);
}
```

#### [965. 单值二叉树](https://leetcode.cn/problems/univalued-binary-tree/description/)

如果二叉树每个节点都具有相同的值，那么该二叉树就是*单值*二叉树。

只有给定的树是单值二叉树时，才返回 `true`；否则返回 `false`。

**示例 1：**

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/29/screen-shot-2018-12-25-at-50104-pm.png)

```
输入：[1,1,1,1,1,null,1]
输出：true
```

**示例 2：**

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/29/screen-shot-2018-12-25-at-50050-pm.png)

```
输入：[2,2,2,5,2]
输出：false
```

**提示：**

1. 给定树的节点数范围是 `[1, 100]`。
2. 每个节点的值都是整数，范围为 `[0, 99]` 。

##### dfs 自底向上

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
var isUnivalTree = function (root) {
    const dfs = (node) => {
        if (!node) return true;
        if (node.left && node.left.val != node.val || (node.right && node.right.val != node.val)) {
            return false;
        }
        return dfs(node.left) && dfs(node.right);
    }

    return dfs(root);
};
```

#### [112. 路径总和](https://leetcode.cn/problems/path-sum/description/)

给你二叉树的根节点 `root` 和一个表示目标和的整数 `targetSum` 。判断该树中是否存在 **根节点到叶子节点** 的路径，这条路径上所有节点值相加等于目标和 `targetSum` 。如果存在，返回 `true` ；否则，返回 `false` 。

**叶子节点** 是指没有子节点的节点。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/01/18/pathsum1.jpg)

```
输入：root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22
输出：true
解释：等于目标和的根节点到叶节点路径如上图所示。
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2021/01/18/pathsum2.jpg)

```
输入：root = [1,2,3], targetSum = 5
输出：false
解释：树中存在两条根节点到叶子节点的路径：
(1 --> 2): 和为 3
(1 --> 3): 和为 4
不存在 sum = 5 的根节点到叶子节点的路径。
```

**示例 3：**

```
输入：root = [], targetSum = 0
输出：false
解释：由于树是空的，所以不存在根节点到叶子节点的路径。
```

**提示：**

* 树中节点的数目在范围 `[0, 5000]` 内
* `-1000 <= Node.val <= 1000`
* `-1000 <= targetSum <= 1000`

##### dfs 自底向上

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
 * @return {boolean}
 */
var hasPathSum = function (root, targetSum) {
    if (!root) return false;
    if (!root.left && !root.right) {
        return root.val == targetSum;
    }
    return hasPathSum(root.left, targetSum - root.val) || hasPathSum(root.right, targetSum - root.val);
};
```

#### [111. 二叉树的最小深度](https://leetcode.cn/problems/minimum-depth-of-binary-tree/description/)

给定一个二叉树，找出其最小深度。

最小深度是从根节点到最近叶子节点的最短路径上的节点数量。

**说明：**叶子节点是指没有子节点的节点。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/10/12/ex_depth.jpg)

```
输入：root = [3,9,20,null,null,15,7]
输出：2
```

**示例 2：**

```
输入：root = [2,null,3,null,4,null,5,null,6]
输出：5
```

**提示：**

* 树中节点数的范围在 `[0, 105]` 内
* `-1000 <= Node.val <= 1000`

##### dfs 自顶向下

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
var minDepth = function (root) {
    if (!root) return 0;
    let ans = Infinity;
    const dfs = (node, d) => {
        if (!node) return;
        if (!node.left && !node.right) {
            ans = Math.min(ans, d);
            return;
        }
        if (d >= ans) return;
        dfs(node.left, d + 1);
        dfs(node.right, d + 1);
    }
    dfs(root, 1);
    return ans;
};
```

##### dfs 自底向上

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
var minDepth = function (root) {
    if (!root) return 0;
    const dfs = (node) => {
        if (!node.left && !node.right) return 1;
        let left = Infinity, right = Infinity;
        if (node.left) {
            left = dfs(node.left);
        }
        if (node.right) {
            right = dfs(node.right);
        }
        return Math.min(left, right) + 1;
    }
    const ans = dfs(root)
    return ans == Infinity ? 0 : ans;
};
```

#### [104. 二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/description/)

给定一个二叉树 `root` ，返回其最大深度。

二叉树的 **最大深度** 是指从根节点到最远叶子节点的最长路径上的节点数。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/11/26/tmp-tree.jpg)

```
输入：root = [3,9,20,null,null,15,7]
输出：3
```

**示例 2：**

```
输入：root = [1,null,2]
输出：2
```

**提示：**

* 树中节点的数量在 `[0, 104]` 区间内。
* `-100 <= Node.val <= 100`

##### BFS

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
var maxDepth = function(root) {
    if (!root) return 0;
    const q = [[root, 1]];
    let depth = 0;
    while (q.length) {
        const [node, d] = q.pop();
        depth = Math.max(depth, d);
        if (node.left) q.push([node.left, d + 1]);
        if (node.right) q.push([node.right, d + 1]);
    }

    return depth;
};
```

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
var maxDepth = function(root) {
    const dfs = (node) => {
        if (!node) return 0;
        const left = dfs(node.left);
        const right = dfs(node.right);
        return Math.max(left, right) + 1;
    }

    return dfs(root);
};
```

#### [2654. 使数组所有元素变成 1 的最少操作次数](https://leetcode.cn/problems/minimum-number-of-operations-to-make-all-array-elements-equal-to-1/description/)

给你一个下标从 **0** 开始的 **正** 整数数组 `nums` 。你可以对数组执行以下操作 **任意** 次：

* 选择一个满足 `0 <= i < n - 1` 的下标 `i` ，将 `nums[i]` 或者 `nums[i+1]` 两者之一替换成它们的最大公约数。

请你返回使数组 `nums` 中所有元素都等于 `1` 的 **最少** 操作次数。如果无法让数组全部变成 `1` ，请你返回 `-1` 。

两个正整数的最大公约数指的是能整除这两个数的最大正整数。

**示例 1：**

```
输入：nums = [2,6,3,4]
输出：4
解释：我们可以执行以下操作：
- 选择下标 i = 2 ，将 nums[2] 替换为 gcd(3,4) = 1 ，得到 nums = [2,6,1,4] 。
- 选择下标 i = 1 ，将 nums[1] 替换为 gcd(6,1) = 1 ，得到 nums = [2,1,1,4] 。
- 选择下标 i = 0 ，将 nums[0] 替换为 gcd(2,1) = 1 ，得到 nums = [1,1,1,4] 。
- 选择下标 i = 2 ，将 nums[3] 替换为 gcd(1,4) = 1 ，得到 nums = [1,1,1,1] 。
```

**示例 2：**

```
输入：nums = [2,10,6,14]
输出：-1
解释：无法将所有元素都变成 1 。
```

**提示：**

* `2 <= nums.length <= 50`
* `1 <= nums[i] <= 106`

##### 如果存在任意一个1，就可以经过n - 1次操作全部变为1。所以双重遍历找到公约数为1的最短子数组长度

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var minOperations = function (nums) {
    const n = nums.length;
    let cnt1 = 0;
    for (let x of nums) {
        if (x == 1) cnt1++;
    }
    // 如果已经存在1，直接将1相邻的元素变为1
    if (cnt1 > 0) return n - cnt1;
    let g = nums[0];
    for (let i = 1; i < n; i++) {
        g = gcd(g, nums[i]);
    }
    // 如果所有元素的最大公约数不为1，无法达成要求
    if (g != 1) return -1;
    let ops = n;
    // 双重遍历 找到公约数为1的最短子组数长度
    for (let i = 0; i < n; i++) {
        let g = nums[i];
        for (let j = i + 1; j < n; j++) {
            g = gcd(g, nums[j]);
            if (g == 1) {
                ops = Math.min(ops, j - i);
                break;
            }
        }
    }
    return n - 1 + ops;
};

const gcd = (x, y) => {
    while (y) {
        let t = x % y;
        x = y, y = t;
    }
    return x;
}
```

