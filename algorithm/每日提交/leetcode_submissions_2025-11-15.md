### 2025-11-15

#### [623. 在二叉树中增加一行](https://leetcode.cn/problems/add-one-row-to-tree/description/)

给定一个二叉树的根 `root` 和两个整数 `val` 和 `depth` ，在给定的深度 `depth` 处添加一个值为 `val` 的节点行。

注意，根节点 `root` 位于深度 `1` 。

加法规则如下:

* 给定整数 `depth`，对于深度为 `depth - 1` 的每个非空树节点 `cur` ，创建两个值为 `val` 的树节点作为 `cur` 的左子树根和右子树根。
* `cur` 原来的左子树应该是新的左子树根的左子树。
* `cur` 原来的右子树应该是新的右子树根的右子树。
* 如果 `depth == 1` 意味着 `depth - 1` 根本没有深度，那么创建一个树节点，值 `val` 作为整个原始树的新根，而原始树就是新根的左子树。

**示例 1:**

![](https://assets.leetcode.com/uploads/2021/03/15/addrow-tree.jpg)

```
输入: root = [4,2,6,3,1,5], val = 1, depth = 2
输出: [4,1,1,2,null,null,6,3,1,5]
```

**示例 2:**

![](https://assets.leetcode.com/uploads/2021/03/11/add2-tree.jpg)

```
输入: root = [4,2,null,3,1], val = 1, depth = 3
输出:  [4,2,null,1,1,3,null,null,1]
```

**提示:**

* 节点数在 `[1, 104]` 范围内
* 树的深度在 `[1, 104]`范围内
* `-100 <= Node.val <= 100`
* `-105 <= val <= 105`
* `1 <= depth <= the depth of tree + 1`

##### BFS层序遍历

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
 * @param {number} depth
 * @return {TreeNode}
 */
var addOneRow = function (root, val, depth) {
    if (depth == 1) {
        return new TreeNode(val, root);
    }
    const q = [root];
    for (let d = 1; d < depth - 1; d++) {
        const size = q.length;
        for (let i = 0; i < size; i++) {
            const node = q.shift();
            if (node.left) q.push(node.left);
            if (node.right) q.push(node.right);
        }
    }
    for (let node of q) {
        node.left = new TreeNode(val, node.left);
        node.right = new TreeNode(val, null, node.right);
    }

    return root;
};
```

#### [102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/description/)

给你二叉树的根节点 `root` ，返回其节点值的 **层序遍历** 。 （即逐层地，从左到右访问所有节点）。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/02/19/tree1.jpg)

```
输入：root = [3,9,20,null,null,15,7]
输出：[[3],[9,20],[15,7]]
```

**示例 2：**

```
输入：root = [1]
输出：[[1]]
```

**示例 3：**

```
输入：root = []
输出：[]
```

**提示：**

* 树中节点数目在范围 `[0, 2000]` 内
* `-1000 <= Node.val <= 1000`

##### 广度优先搜索BFS

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
 * @return {number[][]}
 */
var levelOrder = function (root) {
    if (!root) return [];
    let q = [root], ans = [];
    while (q.length) {
        ans.push([]);
        let len = q.length
        for (let i = 0; i < len; i++) {
            let node = q.shift();
            ans[ans.length - 1].push(node.val);
            if (node.left) q.push(node.left);
            if (node.right) q.push(node.right);
        }
    }

    return ans;
};
```

#### [LCP 10. 二叉树任务调度](https://leetcode.cn/problems/er-cha-shu-ren-wu-diao-du/description/)

任务调度优化是计算机性能优化的关键任务之一。在任务众多时，不同的调度策略可能会得到不同的总体执行时间，因此寻求一个最优的调度方案是非常有必要的。

通常任务之间是存在依赖关系的，即对于某个任务，你需要先**完成**他的前导任务（如果非空），才能开始执行该任务。**我们保证任务的依赖关系是一棵二叉树，**其中 `root` 为根任务，`root.left` 和 `root.right` 为他的两个前导任务（可能为空），`root.val` 为其自身的执行时间。

在一个 CPU 核执行某个任务时，我们可以在任何时刻暂停当前任务的执行，并保留当前执行进度。在下次继续执行该任务时，会从之前停留的进度开始继续执行。暂停的时间可以不是整数。

现在，系统有**两个** CPU 核，即我们可以同时执行两个任务，但是同一个任务不能同时在两个核上执行。给定这颗任务树，请求出所有任务执行完毕的最小时间。

**示例 1：**

> ![image.png](https://pic.leetcode-cn.com/3522fbf8ce4ebb20b79019124eb9870109fdfe97fe9da99f6c20c07ceb1c60b3-image.png)
>
> 输入：root = [47, 74, 31]
>
> 输出：121
>
> 解释：根节点的左右节点可以并行执行31分钟，剩下的43+47分钟只能串行执行，因此总体执行时间是121分钟。

**示例 2：**

> ![image.png](https://pic.leetcode-cn.com/13accf172ee4a660d241e25901595d55b759380b090890a17e6e7bd51a143e3f-image.png)
>
> 输入：root = [15, 21, null, 24, null, 27, 26]
>
> 输出：87

**示例 3：**

> ![image.png](https://pic.leetcode-cn.com/bef743a12591aafb9047dd95d335b8083dfa66e8fdedc63f50fd406b4a9d163a-image.png)
>
> 输入：root = [1,3,2,null,null,4,4]
>
> 输出：7.5

**限制：**

* `1 <= 节点数量 <= 1000`
* `1 <= 单节点执行时间 <= 1000`

##### 树形DP  [图解](https://leetcode.cn/problems/er-cha-shu-ren-wu-diao-du/solutions/1/jian-ji-jie-lun-zheng-ming-tu-jie-by-new-3jz0/)

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
 * @return {number}
 */
var minimalExecTime = function (root) {
    const dfs = (node) => {
        if (!node) return [0, 0];
        const [S1, T1] = dfs(node.left);
        const [S2, T2] = dfs(node.right);

        return [node.val + S1 + S2, node.val + Math.max((S1 + S2) / 2, Math.max(T1, T2))];
    }

    return dfs(root)[1];
};
```

#### [669. 修剪二叉搜索树](https://leetcode.cn/problems/trim-a-binary-search-tree/description/)

给你二叉搜索树的根节点 `root` ，同时给定最小边界`low` 和最大边界 `high`。通过修剪二叉搜索树，使得所有节点的值在`[low, high]`中。修剪树 **不应该** 改变保留在树中的元素的相对结构 (即，如果没有被移除，原有的父代子代关系都应当保留)。 可以证明，存在 **唯一的答案** 。

所以结果应当返回修剪好的二叉搜索树的新的根节点。注意，根节点可能会根据给定的边界发生改变。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/09/09/trim1.jpg)

```
输入：root = [1,0,2], low = 1, high = 2
输出：[1,null,2]
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2020/09/09/trim2.jpg)

```
输入：root = [3,0,4,null,2,null,null,1], low = 1, high = 3
输出：[3,2,null,1]
```

**提示：**

* 树中节点数在范围 `[1, 104]` 内
* `0 <= Node.val <= 104`
* 树中每个节点的值都是 **唯一** 的
* 题目数据保证输入是一棵有效的二叉搜索树
* `0 <= low <= high <= 104`

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
 * @param {number} low
 * @param {number} high
 * @return {TreeNode}
 */
var trimBST = function (root, low, high) {
    if (!root) return null;
    if (root.val >= low && root.val <= high) {
        root.right = trimBST(root.right, low, high);
        root.left = trimBST(root.left, low, high);
        return root;
    } else if (root.val < low) {
        return trimBST(root.right, low, high);
    } else {
        return trimBST(root.left, low, high);
    };
};
```

#### [450. 删除二叉搜索树中的节点](https://leetcode.cn/problems/delete-node-in-a-bst/description/)

给定一个二叉搜索树的根节点 **root** 和一个值 **key**，删除二叉搜索树中的 **key**对应的节点，并保证二叉搜索树的性质不变。返回二叉搜索树（有可能被更新）的根节点的引用。

一般来说，删除节点可分为两个步骤：

1. 首先找到需要删除的节点；
2. 如果找到了，删除它。

**示例 1:**

![](https://assets.leetcode.com/uploads/2020/09/04/del_node_1.jpg)

```
输入：root = [5,3,6,2,4,null,7], key = 3
输出：[5,4,6,2,null,null,7]
解释：给定需要删除的节点值是 3，所以我们首先找到 3 这个节点，然后删除它。
一个正确的答案是 [5,4,6,2,null,null,7], 如下图所示。
另一个正确答案是 [5,2,6,null,4,null,7]。

![](https://assets.leetcode.com/uploads/2020/09/04/del_node_supp.jpg)
```

**示例 2:**

```
输入: root = [5,3,6,2,4,null,7], key = 0
输出: [5,3,6,2,4,null,7]
解释: 二叉树不包含值为 0 的节点
```

**示例 3:**

```
输入: root = [], key = 0
输出: []
```

**提示:**

* 节点数的范围 `[0, 104]`.
* `-105 <= Node.val <= 105`
* 节点值唯一
* `root` 是合法的二叉搜索树
* `-105 <= key <= 105`

**进阶：** 要求算法时间复杂度为 O(h)，h 为树的高度。

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
 * @param {number} key
 * @return {TreeNode}
 */
var deleteNode = function (root, key) {
    let node = root, parent;
    while (node) {
        if (node.val > key) { // 向左找
            parent = node;
            node = node.left
        } else if (node.val < key) { // 向右找
            parent = node;
            node = node.right;
        } else {
            // 找到要删除的节点
            let pos;
            if (parent) { // 从父节点删除，记录位置
                if (parent.left?.val == node.val) {
                    parent.left = null;
                    pos = "left";
                } else {
                    parent.right = null;
                    pos = "right"
                }
            }
            const left = node.left, right = node.right;
            if (!left && !right) { // 删除节点没有子节点，返回root或者null
                return parent ? root : null;
            }
            if (left && right) { // 删除节点左右节点都在，将left插入right中，并将right与parent连接
                insertNode(right, left);
                if (parent) {
                    parent[pos] = right;
                }
                return parent ? root : right;

            }
            // 只存在一侧节点，直接与parent连接
            if (parent) {
                parent[pos] = left ?? right;
            }
            return parent ? root : (left ?? right);
        }
    }

    return root;
};

function insertNode(root, node) {
    let curr = root, parent;
    while (curr) {
        parent = curr;
        if (curr.val > node.val) {
            curr = curr.left;
        } else {
            curr = curr.right;
        }
    }
    if (parent.val > node.val) {
        parent.left = node;
    } else {
        parent.right = node;
    }
}
```

#### [701. 二叉搜索树中的插入操作](https://leetcode.cn/problems/insert-into-a-binary-search-tree/description/)

给定二叉搜索树（BST）的根节点 `root` 和要插入树中的值 `value` ，将值插入二叉搜索树。 返回插入后二叉搜索树的根节点。 输入数据 **保证** ，新值和原始二叉搜索树中的任意节点值都不同。

**注意**，可能存在多种有效的插入方式，只要树在插入后仍保持为二叉搜索树即可。 你可以返回 **任意有效的结果** 。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/10/05/insertbst.jpg)

```
输入：root = [4,2,7,1,3], val = 5
输出：[4,2,7,1,3,5]
解释：另一个满足题目要求可以通过的树是：
![](https://assets.leetcode.com/uploads/2020/10/05/bst.jpg)
```

**示例 2：**

```
输入：root = [40,20,60,10,30,50,70], val = 25
输出：[40,20,60,10,30,50,70,null,null,25]
```

**示例 3：**

```
输入：root = [4,2,7,1,3,null,null,null,null,null,null], val = 5
输出：[4,2,7,1,3,5]
```

**提示：**

* 树中的节点数将在 `[0, 104]`的范围内。
* `-108 <= Node.val <= 108`
* 所有值 `Node.val` 是 **独一无二** 的。
* `-108 <= val <= 108`
* **保证** `val` 在原始BST中不存在。

##### 迭代要插入的位置

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
var insertIntoBST = function(root, val) {
    if (!root) return new TreeNode(val);
    let parent, node = root;
    while (node) {
        parent = node;
        if (node.val < val) {
            node = node.right;
        } else {
            node = node.left;
        }
    }
    if (parent.val > val) {
        parent.left = new TreeNode(val);
    } else {
        parent.right = new TreeNode(val);
    }

    return root;
};
```

#### [106. 从中序与后序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-inorder-and-postorder-traversal/description/)

给定两个整数数组 `inorder` 和 `postorder` ，其中 `inorder` 是二叉树的中序遍历， `postorder` 是同一棵树的后序遍历，请你构造并返回这颗 *二叉树* 。

**示例 1:**

![](https://assets.leetcode.com/uploads/2021/02/19/tree.jpg)

```
输入：inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]
输出：[3,9,20,null,null,15,7]
```

**示例 2:**

```
输入：inorder = [-1], postorder = [-1]
输出：[-1]
```

**提示:**

* `1 <= inorder.length <= 3000`
* `postorder.length == inorder.length`
* `-3000 <= inorder[i], postorder[i] <= 3000`
* `inorder` 和 `postorder` 都由 **不同** 的值组成
* `postorder` 中每一个值都在 `inorder` 中
* `inorder` **保证**是树的中序遍历
* `postorder` **保证**是树的后序遍历

##### 栈：同105题

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
 * @param {number[]} inorder
 * @param {number[]} postorder
 * @return {TreeNode}
 */
var buildTree = function (inorder, postorder) {
    const n = inorder.length;
    const root = new TreeNode(postorder[n - 1]);
    const stack = [root];
    let index = n - 1;
    for (let i = n - 2; i >= 0; i--) {
        const node = new TreeNode(postorder[i]);
        let parent;
        while (stack.length && stack[stack.length - 1].val == inorder[index]) {
            parent = stack.pop(), index--;
        }
        if (parent) {
            parent.left = node;
        } else {
            if (stack.length) {
                stack[stack.length - 1].right = node;
            }
        }
        stack.push(node);
    }

    return root;
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
 * @param {number[]} inorder
 * @param {number[]} postorder
 * @return {TreeNode}
 */
var buildTree = function (inorder, postorder) {
    const inValToIdx = new Map(), n = inorder.length;
    for (let i = 0; i < n; i++) {
        inValToIdx.set(inorder[i], i);
    }

    const build = (inLeft, inRight, postLeft, postRight) => {
        if (inLeft > inRight) return null;
        if (inLeft == inRight) return new TreeNode(inorder[inLeft]);
        const rootVal = postorder[postRight], inRootIdx = inValToIdx.get(rootVal);
        const leftCnt = inRootIdx - inLeft, rightCnt = inRight - inRootIdx;

        return new TreeNode(rootVal, build(inLeft, inRootIdx - 1, postLeft, postLeft + leftCnt - 1),
            build(inRootIdx + 1, inRight, postLeft + leftCnt, postRight - 1));
    }

    return build(0, n - 1, 0, n - 1);
};
```

#### [889. 根据前序和后序遍历构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-postorder-traversal/description/)

给定两个整数数组，`preorder` 和 `postorder` ，其中 `preorder` 是一个具有 **无重复** 值的二叉树的前序遍历，`postorder` 是同一棵树的后序遍历，重构并返回二叉树。

如果存在多个答案，您可以返回其中 **任何** 一个。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/07/24/lc-prepost.jpg)

```
输入：preorder = [1,2,4,5,3,6,7], postorder = [4,5,2,6,7,3,1]
输出：[1,2,3,4,5,6,7]
```

**示例 2:**

```
输入: preorder = [1], postorder = [1]
输出: [1]
```

**提示：**

* `1 <= preorder.length <= 30`
* `1 <= preorder[i] <= preorder.length`
* `preorder` 中所有值都 **不同**
* `postorder.length == preorder.length`
* `1 <= postorder[i] <= postorder.length`
* `postorder` 中所有值都 **不同**
* 保证 `preorder` 和 `postorder` 是同一棵二叉树的前序遍历和后序遍历

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
 * @param {number[]} preorder
 * @param {number[]} postorder
 * @return {TreeNode}
 */
var constructFromPrePost = function (preorder, postorder) {
    const postValToIdx = new Map(), n = postorder.length;
    for (let i = 0; i < n; i++) {
        postValToIdx.set(postorder[i], i);
    }

    const build = (preLeft, preRight, postLeft, postRight) => {
        if (preLeft > preRight) return null;
        if (preLeft == preRight) return new TreeNode(preorder[preLeft]);
        const leftRootVal = preorder[preLeft + 1], postLeftRootIdx = postValToIdx.get(leftRootVal);
        const leftCnt = postLeftRootIdx - postLeft + 1, rightCnt = postRight - 1 - (postLeftRootIdx + 1) + 1;

        return new TreeNode(preorder[preLeft], build(preLeft + 1, preLeft + leftCnt, postLeft, postLeftRootIdx),
            build(preLeft + leftCnt + 1, preRight, postLeftRootIdx + 1, postRight - 1));
    }

    return build(0, n - 1, 0, n - 1);
};
```

#### [105. 从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/description/)

给定两个整数数组 `preorder` 和 `inorder` ，其中 `preorder` 是二叉树的**先序遍历**， `inorder` 是同一棵树的**中序遍历**，请构造二叉树并返回其根节点。

**示例 1:**

![](https://assets.leetcode.com/uploads/2021/02/19/tree.jpg)

```
输入: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
输出: [3,9,20,null,null,15,7]
```

**示例 2:**

```
输入: preorder = [-1], inorder = [-1]
输出: [-1]
```

**提示:**

* `1 <= preorder.length <= 3000`
* `inorder.length == preorder.length`
* `-3000 <= preorder[i], inorder[i] <= 3000`
* `preorder` 和 `inorder` 均 **无重复** 元素
* `inorder` 均出现在 `preorder`
* `preorder` **保证** 为二叉树的前序遍历序列
* `inorder` **保证** 为二叉树的中序遍历序列

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
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function (preorder, inorder) {
    const inValToIdx = new Map();
    const n = inorder.length;
    for (let i = 0; i < n; i++) {
        inValToIdx.set(inorder[i], i);
    }
    const build = (preLeft, preRight, inLeft, inRight) => {
        // 如果越界返回null
        if (preLeft > preRight || inLeft > inRight) return;
        // 如果指针相遇为叶子节点，生成节点返回
        if (preLeft == preRight) {
            return new TreeNode(preorder[preLeft]);
        }
        // 先序遍历第一个元素为根节点，找到中序遍历中根节点的位置
        const inRootIdx = inValToIdx.get(preorder[preLeft]);
        // 中序遍历左侧为左子树，左子树的节点数量，用于确定先序遍历中左右子树的边界位置
        const leftCnt = inRootIdx - inLeft;
        // 中序遍历右侧为右子树，右子树的节点数量
        const rightCnt = inRight - inRootIdx;
        // 递归构建
        return new TreeNode(preorder[preLeft], build(preLeft + 1, preLeft + leftCnt, inLeft, inRootIdx - 1),
            build(preLeft + leftCnt + 1, preRight, inRootIdx + 1, inRight));
    }

    return build(0, n - 1, 0, n - 1);
};
```

##### 栈：根据前序和中序特定

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
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function(preorder, inorder) {
    if (!preorder.length) return null;
    const root = new TreeNode(preorder[0]);
    const stack = [root], n = inorder.length;
    let index = 0;
    // 前序遍历的下一个节点：1、左节点 2、祖先节点的右节点
    // 栈中维护所有没有考虑右节点的节点
    // 中序遍历的第一个节点为当前子树最左的节点，当栈顶元素等于最左节点后，不断弹出考虑是否把当前节点最为右节点
    for (let i = 1; i < n; i++) {
        const node = new TreeNode(preorder[i]);
        let parent;
        while (stack.length && stack[stack.length - 1].val == inorder[index]) {
            parent = stack.pop(), index++;
        }
        if (parent) {
            parent.right = node;
        } else {
            if (stack.length) {
                stack[stack.length - 1].left = node;
            }
        }
        stack.push(node);
    }
    return root;
};
```

#### [3234. 统计 1 显著的字符串的数量](https://leetcode.cn/problems/count-the-number-of-substrings-with-dominant-ones/description/)

给你一个二进制字符串 `s`。

请你统计并返回其中 **1 显著**  的 子字符串 的数量。

如果字符串中 1 的数量 **大于或等于** 0 的数量的 **平方**，则认为该字符串是一个 **1 显著** 的字符串 。

**示例 1：**

**输入：**s = "00011"

**输出：**5

**解释：**

1 显著的子字符串如下表所示。

| i | j | s[i..j] | 0 的数量 | 1 的数量 |
| --- | --- | --- | --- | --- |
| 3 | 3 | 1 | 0 | 1 |
| 4 | 4 | 1 | 0 | 1 |
| 2 | 3 | 01 | 1 | 1 |
| 3 | 4 | 11 | 0 | 2 |
| 2 | 4 | 011 | 1 | 2 |

**示例 2：**

**输入：**s = "101101"

**输出：**16

**解释：**

1 不显著的子字符串如下表所示。

总共有 21 个子字符串，其中 5 个是 1 不显著字符串，因此有 16 个 1 显著子字符串。

| i | j | s[i..j] | 0 的数量 | 1 的数量 |
| --- | --- | --- | --- | --- |
| 1 | 1 | 0 | 1 | 0 |
| 4 | 4 | 0 | 1 | 0 |
| 1 | 4 | 0110 | 2 | 2 |
| 0 | 4 | 10110 | 2 | 3 |
| 1 | 5 | 01101 | 2 | 3 |

**提示：**

* `1 <= s.length <= 4 * 104`
* `s` 仅包含字符 `'0'` 和 `'1'`。

##### 枚举右端点，按照0的数量分段计算可能的左端点数量

```js
/**
 * @param {string} s
 * @return {number}
 */
var numberOfSubstrings = function (s) {
    const pos0 = [-1];
    let total0 = 0, total1 = 0;;
    let ans = 0, n = s.length;
    for (let r = 0; r < n; r++) { // 枚举右端点
        if (s[r] == 1) {
            total1++;
        } else {
            pos0.push(r);
            total0++;
        }
        for (let cnt0 = 0; cnt0 * cnt0 <= total1 && cnt0 <= total0; cnt0++) {
            // 当l属于区间(p,q]时，s在区间[l, r]中0的数量为cnt0
            let p = pos0[total0 - cnt0], q = pos0[total0 - cnt0 + 1] ?? r;
            // 计算(q, r]中1的数量cnt1
            let cnt1 = r - q - cnt0 + 1;
            // 1. 如果(q, r]中1的数量cnt1大于等于cnt0^2，表明区间(p,q]的任意一点都可以为左端点l，一共有q - p
            if (cnt1 >= cnt0 * cnt0) {
                ans += q - p;
            } else {
                // 2. 如果(q, r]中1的数量cnt1小于cnt0^2
                // 区间(p,q]中还需要cnt0^2 - cnt1个1
                // 所以左端点的可能最小值为p+1，最大值为q - (cnt0^2 - cnt1) （为了让1的个数满足条件）
                // 所以左端点的可能数为 q - (cnt0^2 - cnt1) - (p + 1) + 1 = q - (cnt0^2 - cnt1) - p
                // q - (cnt0^2 - cnt1) - p可能小于0，所以要与0取最大值
                ans += Math.max(0, q - (cnt0 * cnt0 - cnt1) - p)
            }
        }
    }
    return ans;
};
```

