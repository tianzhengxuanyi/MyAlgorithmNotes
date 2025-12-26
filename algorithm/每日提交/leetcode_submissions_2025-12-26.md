### 2025-12-26

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

##### 中序遍历迭代

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
    const st = [];
    let prev = -Infinity, node = root;
    while (st.length || node) {
        while (node) {
            st.push(node);
            node = node.left;
        }
        node = st.pop();
        if (node.val <= prev) return false;
        prev = node.val;
        node = node.right;
    }
    return true;
};
```

##### 前序遍历，根据子树边界判断

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
var isValidBST = function (root, l = -Infinity, r = Infinity) {
    if (!root) return true;
    return (root.val > l && root.val < r) && isValidBST(root.left, l, root.val)
        && isValidBST(root.right, root.val, r);
};
```

##### 中序遍历dfs

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
    const dfs = (node) => {
        if (!node) return true;
        if (!dfs(node.left)) return false;
        if (prev >= node.val) return false;
        prev = node.val;
        if (!dfs(node.right)) return false;
        return true;
    }
    return dfs(root);
};
```

##### 后续遍历 树形DP

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
    if (!root) return true;
    const dfs = (node) => {
        if (!node) return [true, -Infinity, Infinity];
        const [lIsBst, lMx, lMn] = dfs(node.left);
        const [rIsBst, rMx, rMn] = dfs(node.right);
        const isBst = lIsBst && rIsBst && (lMx < node.val && rMn > node.val);
        const mx = Math.max(lMx, rMx, node.val), mn = Math.min(lMn, rMn, node.val);
        return [isBst, mx, mn];
    }
    return dfs(root)[0];
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
 * @param {number[]} nums
 * @return {TreeNode}
 */
var sortedArrayToBST = function (nums) {
    const dfs = (l, r) => {
        if (l > r) return null;
        if (l == r) return new TreeNode(nums[l]);
        let m = Math.floor((r - l) / 2) + l;
        return new TreeNode(nums[m], dfs(l, m - 1), dfs(m + 1, r))
    }
    return dfs(0, nums.length - 1);
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
 * @return {number[][]}
 */
var levelOrder = function(root) {
    if (!root) return [];
    const ans = [];
    const q = [root];
    while (q.length) {
        let len = q.length, vals = []
        for (let i = 0; i < len; i++) {
            const node = q.shift();
            vals.push(node.val);
            if (node.left) q.push(node.left);
            if (node.right) q.push(node.right);
        }
        ans.push(vals);
    }
    return ans;
};
```

#### [2483. 商店的最少代价](https://leetcode.cn/problems/minimum-penalty-for-a-shop/description/)

给你一个顾客访问商店的日志，用一个下标从 **0** 开始且只包含字符 `'N'` 和 `'Y'` 的字符串 `customers` 表示：

* 如果第 `i` 个字符是 `'Y'` ，它表示第 `i` 小时有顾客到达。
* 如果第 `i` 个字符是 `'N'` ，它表示第 `i` 小时没有顾客到达。

如果商店在第 `j` 小时关门（`0 <= j <= n`），代价按如下方式计算：

* 在开门期间，如果某一个小时没有顾客到达，代价增加 `1` 。
* 在关门期间，如果某一个小时有顾客到达，代价增加 `1` 。

请你返回在确保代价 **最小** 的前提下，商店的 **最早** 关门时间。

注意，商店在第 `j` 小时关门表示在第 `j` 小时以及之后商店处于关门状态。

**示例 1：**

```
输入：customers = "YYNY"
输出：2
解释：
- 第 0 小时关门，总共 1+1+0+1 = 3 代价。
- 第 1 小时关门，总共 0+1+0+1 = 2 代价。
- 第 2 小时关门，总共 0+0+0+1 = 1 代价。
- 第 3 小时关门，总共 0+0+1+1 = 2 代价。
- 第 4 小时关门，总共 0+0+1+0 = 1 代价。
在第 2 或第 4 小时关门代价都最小。由于第 2 小时更早，所以最优关门时间是 2 。
```

**示例 2：**

```
输入：customers = "NNNNN"
输出：0
解释：最优关门时间是 0 ，因为自始至终没有顾客到达。
```

**示例 3：**

```
输入：customers = "YYYY"
输出：4
解释：最优关门时间是 4 ，因为每一小时均有顾客到达。
```

**提示：**

* `1 <= customers.length <= 105`
* `customers` 只包含字符 `'Y'` 和 `'N'` 。

##### 前后缀分解优化：一次遍历

```js
/**
 * @param {string} customers
 * @return {number}
 */
var bestClosingTime = function (customers) {
    const n = customers.length;
    let ans = n, minCost = n, cost = 0;
    for (let i = 0; i <= n; i++) {
        if (cost < minCost) {
            ans = i;
            minCost = cost;
        }
        cost += customers[i] == "Y" ? -1 : 1;
    }
    return ans;
};
```

##### 前后缀分解优化：省去数组

```js
/**
 * @param {string} customers
 * @return {number}
 */
var bestClosingTime = function (customers) {
    const n = customers.length;
    let ans = n, cntN = 0, minCost = n, totoalY = 0, cntY = 0;
    for (let c of customers) {
        if (c == "Y") totoalY++;
    }
    for (let i = 0; i <= n; i++) {
        let cost = totoalY - cntY + cntN;
        if (cost < minCost) {
            ans = i;
            minCost = cost;
        }
        if (customers[i] == "Y") {
            cntY++;
        } else {
            cntN++;
        }
    }
    return ans;
};
```

##### 前后缀分解

```js
/**
 * @param {string} customers
 * @return {number}
 */
var bestClosingTime = function (customers) {
    const n = customers.length;
    const suffix = Array(n + 1).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        suffix[i] = suffix[i + 1] + (customers[i] == "Y" ? 1 : 0);
    }
    let ans = n, cntN = 0, minCost = n;
    for (let i = 0; i <= n; i++) {
        let cost = suffix[i] + cntN;
        if (cost < minCost) {
            ans = i;
            minCost = cost;
        }
        cntN += (customers[i] == "N" ? 1 : 0);
    }
    return ans;
};
```

