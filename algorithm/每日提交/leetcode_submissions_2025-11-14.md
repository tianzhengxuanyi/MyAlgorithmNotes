### 2025-11-14

#### [998. 最大二叉树 II](https://leetcode.cn/problems/maximum-binary-tree-ii/description/)

**最大树** 定义：一棵树，并满足：其中每个节点的值都大于其子树中的任何其他值。

给你最大树的根节点 `root` 和一个整数 `val` 。

就像 [之前的问题](https://leetcode.cn/problems/maximum-binary-tree/) 那样，给定的树是利用 `Construct(a)` 例程从列表 `a`（`root = Construct(a)`）递归地构建的：

* 如果 `a` 为空，返回 `null` 。
* 否则，令 `a[i]` 作为 `a` 的最大元素。创建一个值为 `a[i]` 的根节点 `root` 。
* `root` 的左子树将被构建为 `Construct([a[0], a[1], ..., a[i - 1]])` 。
* `root` 的右子树将被构建为 `Construct([a[i + 1], a[i + 2], ..., a[a.length - 1]])` 。
* 返回 `root` 。

请注意，题目没有直接给出 `a` ，只是给出一个根节点 `root = Construct(a)` 。

假设 `b` 是 `a` 的副本，并在末尾附加值 `val`。题目数据保证 `b` 中的值互不相同。

返回 `Construct(b)` 。

**示例 1：**

**![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/02/23/maximum-binary-tree-1-1.png)![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/02/23/maximum-binary-tree-1-2.png)**

```
输入：root = [4,1,3,null,null,2], val = 5
输出：[5,4,null,1,3,null,null,2]
解释：a = [1,4,2,3], b = [1,4,2,3,5]
```

**示例 2：  
![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/02/23/maximum-binary-tree-2-1.png)![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/02/23/maximum-binary-tree-2-2.png)**

```
输入：root = [5,2,4,null,1], val = 3
输出：[5,2,4,null,1,null,3]
解释：a = [2,1,5,4], b = [2,1,5,4,3]
```

**示例 3：  
![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/02/23/maximum-binary-tree-3-1.png)![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/02/23/maximum-binary-tree-3-2.png)**

```
输入：root = [5,2,3,null,1], val = 4
输出：[5,2,4,null,1,3]
解释：a = [2,1,5,3], b = [2,1,5,3,4]
```

**提示：**

* 树中节点数目在范围 `[1, 100]` 内
* `1 <= Node.val <= 100`
* 树中的所有值 **互不相同**
* `1 <= val <= 100`

##### 递归右子树

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
var insertIntoMaxTree = function (root, val) {
    if (!root) return new TreeNode(val);
    if (val > root.val) {
        return new TreeNode(val, root);
    }
    root.right = insertIntoMaxTree(root.right, val);
    return root;
};
```

#### [654. 最大二叉树](https://leetcode.cn/problems/maximum-binary-tree/description/)

给定一个不重复的整数数组 `nums` 。 **最大二叉树** 可以用下面的算法从 `nums` 递归地构建:

1. 创建一个根节点，其值为 `nums` 中的最大值。
2. 递归地在最大值 **左边** 的 **子数组前缀上** 构建左子树。
3. 递归地在最大值 **右边** 的 **子数组后缀上** 构建右子树。

返回 *`nums` 构建的* ***最大二叉树*** 。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/12/24/tree1.jpg)

```
输入：nums = [3,2,1,6,0,5]
输出：[6,3,5,null,2,0,null,null,1]
解释：递归调用如下所示：
- [3,2,1,6,0,5] 中的最大值是 6 ，左边部分是 [3,2,1] ，右边部分是 [0,5] 。
    - [3,2,1] 中的最大值是 3 ，左边部分是 [] ，右边部分是 [2,1] 。
        - 空数组，无子节点。
        - [2,1] 中的最大值是 2 ，左边部分是 [] ，右边部分是 [1] 。
            - 空数组，无子节点。
            - 只有一个元素，所以子节点是一个值为 1 的节点。
    - [0,5] 中的最大值是 5 ，左边部分是 [0] ，右边部分是 [] 。
        - 只有一个元素，所以子节点是一个值为 0 的节点。
        - 空数组，无子节点。
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2020/12/24/tree2.jpg)

```
输入：nums = [3,2,1]
输出：[3,null,2,null,1]
```

**提示：**

* `1 <= nums.length <= 1000`
* `0 <= nums[i] <= 1000`
* `nums` 中的所有整数 **互不相同**

##### 线段树（TODO）

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
 * @param {number[]} nums
 * @return {TreeNode}
 */
var constructMaximumBinaryTree = function(nums) {
    const stack = [];
    for (let val of nums) {
        const node = new TreeNode(val);
        while (stack.length && val > stack[stack.length - 1].val) {
            const pop = stack.pop();
            if (!stack.length || stack[stack.length - 1].val > val) {
                node.left = pop;
            } else {
                stack[stack.length - 1].right = pop;
            }
        }
        stack.push(node);
    }
    while (stack.length > 1) {
        const pop = stack.pop();
        stack[stack.length - 1].right = pop;
    }

    return stack[0];
};
```

##### 单调栈

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
 * @param {number[]} nums
 * @return {TreeNode}
 */
var constructMaximumBinaryTree = function(nums) {
    const stack = [];
    for (let val of nums) {
        const node = new TreeNode(val);
        while (stack.length && val > stack[stack.length - 1].val) {
            const pop = stack.pop();
            if (!stack.length || stack[stack.length - 1].val > val) {
                node.left = pop;
            } else {
                stack[stack.length - 1].right = pop;
            }
        }
        stack.push(node);
    }
    while (stack.length > 1) {
        const pop = stack.pop();
        stack[stack.length - 1].right = pop;
    }

    return stack[0];
};
```

##### dfs递归 + 暴力查找最大值

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
 * @param {number[]} nums
 * @return {TreeNode}
 */
var constructMaximumBinaryTree = function(nums) {
    const dfs = (l, r) => {
        if (l > r) return null;
        if (l == r) return new TreeNode(nums[l]);
        let maxIdx = l, max = nums[l];
        for (let i = l + 1; i <= r; i++) {
            if (nums[i] > max) {
                max = nums[i];
                maxIdx = i;
            }
        }
        return new TreeNode(nums[maxIdx], dfs(l, maxIdx - 1), 
            dfs(maxIdx + 1, r));
    }

    return dfs(0, nums.length - 1);
};
```

#### [108. 将有序数组转换为二叉搜索树](https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/description/)

给你一个整数数组 `nums` ，其中元素已经按 **升序** 排列，请你将其转换为一棵 平衡 二叉搜索树。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/02/18/btree1.jpg)

```
输入：nums = [-10,-3,0,5,9]
输出：[0,-3,9,-10,null,5]
解释：[0,-10,5,null,-3,null,9] 也将被视为正确答案：
![](https://assets.leetcode.com/uploads/2021/02/18/btree2.jpg)
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2021/02/18/btree.jpg)

```
输入：nums = [1,3]
输出：[3,1]
解释：[1,null,3] 和 [3,1] 都是高度平衡二叉搜索树。
```

**提示：**

* `1 <= nums.length <= 104`
* `-104 <= nums[i] <= 104`
* `nums` 按 **严格递增** 顺序排列

##### 在[l,r]中找到中间下标m，创建中间节点m，然后[l, m-1]和[m+1, r]递归返回左、右子树

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
 * @param {number[]} nums
 * @return {TreeNode}
 */
var sortedArrayToBST = function (nums) {
    const dfs = (l, r) => {
        if (l > r) return null;
        if (l == r) {
            return new TreeNode(nums[l]);
        }
        const m = Math.floor((r - l) / 2) + l;
        return new TreeNode(nums[m], dfs(l, m - 1), dfs(m + 1, r));
    }

    return dfs(0, nums.length - 1);
};
```

#### [99. 恢复二叉搜索树](https://leetcode.cn/problems/recover-binary-search-tree/description/)

给你二叉搜索树的根节点 `root` ，该树中的 **恰好** 两个节点的值被错误地交换。*请在不改变其结构的情况下，恢复这棵树*。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/10/28/recover1.jpg)

```
输入：root = [1,3,null,null,2]
输出：[3,1,null,null,2]
解释：3 不能是 1 的左孩子，因为 3 > 1 。交换 1 和 3 使二叉搜索树有效。
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2020/10/28/recover2.jpg)

```
输入：root = [3,1,4,null,null,2]
输出：[2,1,4,null,null,3]
解释：2 不能在 3 的右子树中，因为 2 < 3 。交换 2 和 3 使二叉搜索树有效。
```

**提示：**

* 树上节点的数目在范围 `[2, 1000]` 内
* `-231 <= Node.val <= 231 - 1`

**进阶：**使用 `O(n)` 空间复杂度的解法很容易实现。你能想出一个只使用 `O(1)` 空间的解决方案吗？

##### 中序遍历，记录顺序不对的节点对，如果有一个节点对交换，如果右两个节点对[ai,ai+1],[aj,aj+1]，交换ai和aj+1

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
 * @return {void} Do not return anything, modify root in-place instead.
 */
var recoverTree = function (root) {
    let prevNode;
    const reversePair = [];
    const dfs = (node) => {
        if (!node) return;
        dfs(node.left);
        if (prevNode && node.val < prevNode.val) {
            reversePair.push([prevNode, node]);
        }
        prevNode = node;
        dfs(node.right);
    }

    dfs(root);

    if (reversePair.length == 1) {
        const [n1, n2] = reversePair[0];
        [n1.val, n2.val] = [n2.val, n1.val];
    } else {
        const n1 = reversePair[0][0], n2 = reversePair[1][1];
        [n1.val, n2.val] = [n2.val, n1.val];
    }

};
```

#### [98. 验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/description/)

给你一个二叉树的根节点 `root` ，判断其是否是一个有效的二叉搜索树。

**有效** 二叉搜索树定义如下：

* 节点的左子树只包含**严格小于** 当前节点的数。
* 节点的右子树只包含 **严格大于** 当前节点的数。
* 所有左子树和右子树自身必须也是二叉搜索树。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/12/01/tree1.jpg)

```
输入：root = [2,1,3]
输出：true
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2020/12/01/tree2.jpg)

```
输入：root = [5,1,4,null,null,3,6]
输出：false
解释：根节点的值是 5 ，但是右子节点的值是 4 。
```

**提示：**

* 树中节点数目范围在`[1, 104]` 内
* `-231 <= Node.val <= 231 - 1`

##### 前序遍历，传递子树的左右边界

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
var isValidBST = function (root, left = -Infinity, right = Infinity) {
    if (!root) return true;

    return (root.val > left && root.val < right) && isValidBST(root.left, left, root.val)
        && isValidBST(root.right, root.val, right);
};
```

##### 中序遍历判断前一个节点值是否大于当前节点值

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
var isValidBST = function(root) {
    let prev = -Infinity;
    // 中序遍历判断前一个节点值是否大于当前节点值
    const dfs = (node) => {
        if (!node) return true; // 空节点默认为二叉搜索树
        if (!dfs(node.left)) return false; // 左子树不是，直接返回
        if (prev >= node.val) return false; // 前一个节点值大于当前节点值,不是二叉搜索树，返回false
        prev = node.val; // 更新prev
        return dfs(node.right); // 返回右子树结果
    }

    return dfs(root);
};
```

##### 后续遍历，递归返回[以当前节点为头的子树是否为二叉搜索树， 子树最小值， 子树最大值]

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
var isValidBST = function (root) {
    const dfs = (node) => {
        if (!node) return [true, Infinity, -Infinity]
        const [lIsVal, lMin, lMax] = dfs(node.left);
        const [rIsVal, rMin, rMax] = dfs(node.right);
        const isVal = lIsVal && rIsVal && (node.val > lMax && node.val < rMin);
        const min = Math.min(lMin, rMin, node.val), max = Math.max(lMax, rMax, node.val);
        return [isVal, min, max];
    }

    return dfs(root)[0];
};
```

#### [2536. 子矩阵元素加 1](https://leetcode.cn/problems/increment-submatrices-by-one/description/)

给你一个正整数 `n` ，表示最初有一个 `n x n` 、下标从 **0** 开始的整数矩阵 `mat` ，矩阵中填满了 0 。

另给你一个二维整数数组 `query` 。针对每个查询 `query[i] = [row1i, col1i, row2i, col2i]` ，请你执行下述操作：

* 找出 **左上角** 为 `(row1i, col1i)` 且 **右下角** 为 `(row2i, col2i)` 的子矩阵，将子矩阵中的 **每个元素** 加 `1` 。也就是给所有满足 `row1i <= x <= row2i` 和 `col1i <= y <= col2i` 的 `mat[x][y]` 加 `1` 。

返回执行完所有操作后得到的矩阵 `mat` 。

**示例 1：**

![](https://assets.leetcode.com/uploads/2022/11/24/p2example11.png)

```
输入：n = 3, queries = [[1,1,2,2],[0,0,1,1]]
输出：[[1,1,0],[1,2,1],[0,1,1]]
解释：上图所展示的分别是：初始矩阵、执行完第一个操作后的矩阵、执行完第二个操作后的矩阵。
- 第一个操作：将左上角为 (1, 1) 且右下角为 (2, 2) 的子矩阵中的每个元素加 1 。 
- 第二个操作：将左上角为 (0, 0) 且右下角为 (1, 1) 的子矩阵中的每个元素加 1 。
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2022/11/24/p2example22.png)

```
输入：n = 2, queries = [[0,0,1,1]]
输出：[[1,1],[1,1]]
解释：上图所展示的分别是：初始矩阵、执行完第一个操作后的矩阵。 
- 第一个操作：将矩阵中的每个元素加 1 。
```

**提示：**

* `1 <= n <= 500`
* `1 <= queries.length <= 104`
* `0 <= row1i <= row2i < n`
* `0 <= col1i <= col2i < n`

