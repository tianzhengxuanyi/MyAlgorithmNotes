# 最近公共祖先LCA

## 递归解法

**时间复杂度：** O(h)
**最差时间复杂度：** O(n) （当树退化为链表时）

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

## [倍增](https://leetcode.cn/problems/kth-ancestor-of-a-tree-node/submissions/)

整体复杂度稳定为 $O(n\log n + Q\log n)$：
- $O(n\log n)$：预处理深度数组、倍增祖先表的开销；
- $O(Q\log n)$：$Q$ 次查询，单次查询最多跳跃 $\log n$ 层。

### 整体思路

**1. 预处理阶段**
- 遍历整棵树，记录每个节点的深度 `depth`；
- 构建倍增祖先表 `parent`，`parent[x][k]` 代表节点 $x$ 向上跳 $2^k$ 步到达的祖先；
- 递推公式：`parent[x][k] = parent[ parent[x][k-1] ][k-1]`
- 含义：向上跳 $2^k$ 步 = 先跳 $2^{k-1}$ 步，再跳 $2^{k-1}$ 步；无祖先则记为 `-1`。

**2. 查询两节点 x、y 的 LCA 流程**
- 深度对齐：保证 $x$ 深度更小，将更深的 $y$ 向上跳 `depth[y]-depth[x]` 步，使两点深度一致；
- 对跳跃步数做二进制拆分，从低位到高位遍历二进制位，位为 1 则执行对应步数跳跃；
- 对齐后若两节点相等，说明一方是另一方祖先，直接返回该节点；
- 从最大倍增层数倒序枚举每一层：
  - 若两点当前层祖先不相等，说明 LCA 仍在上方，更新两点为各自该层祖先；
  - 若两点当前层祖先相等，说明 LCA 在当前层或更下层，跳过本层继续缩小跳跃步长；
- 循环结束后，$x$、$y$ 的直接父节点 `parent[x][0]` 即为最近公共祖先。

```js
var lowestCommonAncestorQuery = function(edges, queries) {
    const n = edges.length + 1;
    const m = 32 - Math.clz32(n);
    const g = Array.from({length: n + 1}, () => []);
    const depth = Array(n + 1).fill(0);
    const parent = Array.from({length: n + 1}, () => Array(m).fill(-1));

    for (let [u, v] of edges) {
        g[u].push(v), g[v].push(u);
    }

    const dfs = (x, fa, d) => {
        depth[x] = d;
        parent[x][0] = fa;
        for (let ch of g[x]) {
            if (ch != fa) {
                dfs(ch, x, d + 1);
            }
        }
    }

    dfs(1, -1, 1);
    
    for (let i = 1; i < m; i++) {
        for (let x = 1; x <= n; x++) {
            parent[x][i] = parent[x][i-1] >= 0 ? parent[parent[x][i-1]][i-1] : -1;
        }
    }

    const getKthAncestor = (x, k) => {
        const bitCount = 32 - Math.clz32(k);
        for (let i = 0; i < bitCount; i++) {
            if (k & (1 << i)) {
                x = parent[x][i];
                if (x < 0) break;
            }
        }
        return x;
    }

    const getLCA = (x, y) => {
        if (depth[x] > depth[y]) {
            [x, y] = [y, x];
        }
        y = getKthAncestor(y, depth[y] - depth[x]);
        if (x == y) return x;
        // i = parent[x].length
        for (let i = parent[x].length; i >= 0; i--) {
            let px = parent[x][i], py = parent[y][i];
            if (px != py) {
                x = px, y = py;
            }
        }

        return parent[x][0];
    }

    return queries.map(([x, y]) => getLCA(x, y));
};
```