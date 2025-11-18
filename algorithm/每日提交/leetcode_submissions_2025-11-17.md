### 2025-11-17

#### [1466. 重新规划路线](https://leetcode.cn/problems/reorder-routes-to-make-all-paths-lead-to-the-city-zero/description/)

`n` 座城市，从 `0` 到 `n-1` 编号，其间共有 `n-1` 条路线。因此，要想在两座不同城市之间旅行只有唯一一条路线可供选择（路线网形成一颗树）。去年，交通运输部决定重新规划路线，以改变交通拥堵的状况。

路线用 `connections` 表示，其中 `connections[i] = [a, b]` 表示从城市 `a` 到 `b` 的一条有向路线。

今年，城市 0 将会举办一场大型比赛，很多游客都想前往城市 0 。

请你帮助重新规划路线方向，使每个城市都可以访问城市 0 。返回需要变更方向的最小路线数。

题目数据 **保证** 每个城市在重新规划路线方向后都能到达城市 0 。

**示例 1：**

**![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/05/30/sample_1_1819.png)**

```
输入：n = 6, connections = [[0,1],[1,3],[2,3],[4,0],[4,5]]
输出：3
解释：更改以红色显示的路线的方向，使每个城市都可以到达城市 0 。
```

**示例 2：**

**![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/05/30/sample_2_1819.png)**

```
输入：n = 5, connections = [[1,0],[1,2],[3,2],[3,4]]
输出：2
解释：更改以红色显示的路线的方向，使每个城市都可以到达城市 0 。
```

**示例 3：**

```
输入：n = 3, connections = [[1,0],[2,0]]
输出：0
```

**提示：**

* `2 <= n <= 5 * 10^4`
* `connections.length == n-1`
* `connections[i].length == 2`
* `0 <= connections[i][0], connections[i][1] <= n-1`
* `connections[i][0] != connections[i][1]`

##### 建无向图时记录边的方向

```js
/**
 * @param {number} n
 * @param {number[][]} connections
 * @return {number}
 */
var minReorder = function (n, connections) {
    // 双向图
    const graph = Array.from({ length: n }, () => []);
    let ans = 0;
    for (let [x, y] of connections) {
        // 记录边的方向
        graph[x].push([y, 1]), graph[y].push([x, -1]);
    }

    // 从0到各个节点
    const dfs = (fa, node) => {
        for (let [ch, d] of graph[node]) {
            if (ch !== fa) {
                // 需要逆序
                if (d == 1) {
                    ans++;
                }
                dfs(node, ch);
            }
        }
    }

    dfs(-1, 0);

    return ans;
};
```

##### 建图递归，记录单向路径，判断是否需要改变方向

```js
/**
 * @param {number} n
 * @param {number[][]} connections
 * @return {number}
 */
var minReorder = function (n, connections) {
    // 双向图
    const graph = Array.from({ length: n }, () => []);
    // 单向路径，判断是否需要改变方向
    const path = Array.from({ length: n }, () => new Set());
    let ans = 0;
    for (let [x, y] of connections) {
        path[x].add(y)
        graph[x].push(y), graph[y].push(x);
    }
    
    // 从0到各个节点
    const dfs = (fa, node) => {
        for (let ch of graph[node]) {
            if (ch !== fa) {
                // 需要逆序
                if (path[node].has(ch)) {
                    ans++;
                }
                dfs(node, ch);
            }
        }
    }

    dfs(-1, 0);

    return ans;
};
```

#### [2368. 受限条件下可到达节点的数目](https://leetcode.cn/problems/reachable-nodes-with-restrictions/description/)

现有一棵由 `n` 个节点组成的无向树，节点编号从 `0` 到 `n - 1` ，共有 `n - 1` 条边。

给你一个二维整数数组 `edges` ，长度为 `n - 1` ，其中 `edges[i] = [ai, bi]` 表示树中节点 `ai` 和 `bi` 之间存在一条边。另给你一个整数数组 `restricted` 表示 **受限** 节点。

在不访问受限节点的前提下，返回你可以从节点`0`到达的 **最多** 节点数目*。*

注意，节点 `0` **不** 会标记为受限节点。

**示例 1：**

![](https://assets.leetcode.com/uploads/2022/06/15/ex1drawio.png)

```
输入：n = 7, edges = [[0,1],[1,2],[3,1],[4,0],[0,5],[5,6]], restricted = [4,5]
输出：4
解释：上图所示正是这棵树。
在不访问受限节点的前提下，只有节点 [0,1,2,3] 可以从节点 0 到达。
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2022/06/15/ex2drawio.png)

```
输入：n = 7, edges = [[0,1],[0,2],[0,5],[0,4],[3,2],[6,5]], restricted = [4,2,1]
输出：3
解释：上图所示正是这棵树。
在不访问受限节点的前提下，只有节点 [0,5,6] 可以从节点 0 到达。
```

**提示：**

* `2 <= n <= 105`
* `edges.length == n - 1`
* `edges[i].length == 2`
* `0 <= ai, bi < n`
* `ai != bi`
* `edges` 表示一棵有效的树
* `1 <= restricted.length < n`
* `1 <= restricted[i] < n`
* `restricted` 中的所有值 **互不相同**

##### dfs

```js
/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {number[]} restricted
 * @return {number}
 */
var reachableNodes = function(n, edges, restricted) {
    const graph = Array.from({length: n}, () => []), restrictedSet = new Set(restricted);
    for (let [x, y] of edges) {
        graph[x].push(y), graph[y].push(x);
    }
    let ans = 0;
    const dfs = (node, fa) => {
        ans++;
        for (let ch of graph[node]) {
            if (ch == fa || restrictedSet.has(ch)) continue;
            dfs(ch, node);
        }
    }
    dfs(0, -1);
    return ans;
};
```

##### bfs

```js
/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {number[]} restricted
 * @return {number}
 */
var reachableNodes = function(n, edges, restricted) {
    const graph = Array.from({length: n}, () => []);
    for (let [x, y] of edges) {
        graph[x].push(y), graph[y].push(x);
    }
    const seen = Array(n).fill(false), restrictedSet = new Set(restricted);
    seen[0] = true;
    const q = [0];
    let ans = 0;
    while (q.length) {
        const curr = q.shift();
        ans++;
        for (let ch of graph[curr]) {
            if (!seen[ch] && !restrictedSet.has(ch)) {
                seen[ch] = true;
                q.push(ch);
            }
        }
    }
    return ans;
};
```

#### [297. 二叉树的序列化与反序列化](https://leetcode.cn/problems/serialize-and-deserialize-binary-tree/description/)

序列化是将一个数据结构或者对象转换为连续的比特位的操作，进而可以将转换后的数据存储在一个文件或者内存中，同时也可以通过网络传输到另一个计算机环境，采取相反方式重构得到原数据。

请设计一个算法来实现二叉树的序列化与反序列化。这里不限定你的序列 / 反序列化算法执行逻辑，你只需要保证一个二叉树可以被序列化为一个字符串并且将这个字符串反序列化为原始的树结构。

**提示:** 输入输出格式与 LeetCode 目前使用的方式一致，详情请参阅 [LeetCode 序列化二叉树的格式](https://support.leetcode.cn/hc/kb/article/1567641/)。你并非必须采取这种方式，你也可以采用其他的方法解决这个问题。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/09/15/serdeser.jpg)

```
输入：root = [1,2,3,null,null,4,5]
输出：[1,2,3,null,null,4,5]
```

**示例 2：**

```
输入：root = []
输出：[]
```

**示例 3：**

```
输入：root = [1]
输出：[1]
```

**示例 4：**

```
输入：root = [1,2]
输出：[1,2]
```

**提示：**

* 树中结点数在范围 `[0, 104]` 内
* `-1000 <= Node.val <= 1000`

##### 前序遍历

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function (root) {
    if (!root) return "";
    let serialization = [];
    const dfs = (node) => {
        if (!node) {
            serialization.push("null");
            return;
        }
        serialization.push(node.val);
        dfs(node.left), dfs(node.right);
    }
    dfs(root);
    return serialization.join(",");
};

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function (data) {
    if (data == "") return null;
    const deserialization = data.split(",");
    const root = new TreeNode(+deserialization[0]);
    let i = 1;
    const dfs = (fa) => {
        if (i < deserialization.length) {
            const left = deserialization[i] == "null" ? null : new TreeNode(+deserialization[i]);
            fa.left = left;
            i++;
            if (left) dfs(left);
        }
        if (i < deserialization.length) {
            const right = deserialization[i] == "null" ? null : new TreeNode(+deserialization[i]);
            fa.right = right;
            i++;
            if (right) dfs(right);
        }
    }
    dfs(root);
    return root;
};

/**
 * Your functions will be called as such:
 * deserialize(serialize(root));
 */
```

##### 层序遍历

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function (root) {
    const serialization = [];
    const q = [root];
    while (q.length) {
        const size = q.length;
        for (let i = 0; i < size; i++) {
            const node = q.shift();
            if (!node) {
                serialization.push(null);
            } else {
                serialization.push(node.val);
                q.push(node.left), q.push(node.right);
            }
        }
    }
    while (serialization.length && serialization[serialization.length - 1] == null) {
        serialization.pop();
    }
    return JSON.stringify(serialization)
};

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function (data) {
    const deserialization = JSON.parse(data);
    const n = deserialization.length;
    if (n == 0) return null;
    const root = new TreeNode(deserialization[0]);
    const q = [root];
    let i = 1;
    while (q.length) {
        const size = q.length;
        for (let j = 0; j < size; j++) {
            const node = q.shift();
            if (i < n) {
                const left = deserialization[i] == null ? deserialization[i++] : new TreeNode(deserialization[i++]);
                node.left = left;
                if (left) q.push(left);
            }
            if (i < n) {
                const right = deserialization[i] == null ? deserialization[i++] : new TreeNode(deserialization[i++]);
                node.right = right;
                if (right) q.push(right);
            }
        }
    }
    return root;
};

/**
 * Your functions will be called as such:
 * deserialize(serialize(root));
 */
```

#### [429. N 叉树的层序遍历](https://leetcode.cn/problems/n-ary-tree-level-order-traversal/description/)

给定一个 N 叉树，返回其节点值的*层序遍历*。（即从左到右，逐层遍历）。

树的序列化输入是用层序遍历，每组子节点都由 null 值分隔（参见示例）。

**示例 1：**

![](https://assets.leetcode.com/uploads/2018/10/12/narytreeexample.png)

```
输入：root = [1,null,3,2,4,null,5,6]
输出：[[1],[3,2,4],[5,6]]
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2019/11/08/sample_4_964.png)

```
输入：root = [1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]
输出：[[1],[2,3,4,5],[6,7,8,9,10],[11,12,13],[14]]
```

**提示：**

* 树的高度不会超过 `1000`
* 树的节点总数在 `[0, 104]` 之间

##### bfs

```js
/**
 * // Definition for a _Node.
 * function _Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

/**
 * @param {_Node|null} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
    if (!root) return [];
    const ans = [], q = [root];
    while (q.length) {
        const size = q.length;
        ans.push([]);
        for (let i = 0; i < size; i++) {
            const node = q.shift();
            ans[ans.length - 1].push(node.val);
            q.push(...(node.children ?? []))
        }
    }

    return ans;
};
```

#### [559. N 叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-n-ary-tree/description/)

给定一个 N 叉树，找到其最大深度。

最大深度是指从根节点到最远叶子节点的最长路径上的节点总数。

N 叉树输入按层序遍历序列化表示，每组子节点由空值分隔（请参见示例）。

**示例 1：**

![](https://assets.leetcode.com/uploads/2018/10/12/narytreeexample.png)

```
输入：root = [1,null,3,2,4,null,5,6]
输出：3
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2019/11/08/sample_4_964.png)

```
输入：root = [1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]
输出：5
```

**提示：**

* 树的深度不会超过 `1000` 。
* 树的节点数目位于 `[0, 104]` 之间。

##### dfs

```js
/**
 * // Definition for a _Node.
 * function _Node(val,children) {
 *    this.val = val === undefined ? null : val;
 *    this.children = children === undefined ? null : children;
 * };
 */

/**
 * @param {_Node|null} root
 * @return {number}
 */
var maxDepth = function(root) {
    const dfs = (node) => {
        if (!node) return 0;
        let res = 0;
        for (let ch of (node.children ?? [])) {
            res = Math.max(res, dfs(ch));
        }
        return res + 1;
    }

    return dfs(root);
};
```

#### [590. N 叉树的后序遍历](https://leetcode.cn/problems/n-ary-tree-postorder-traversal/description/)

给定一个 n 叉树的根节点 `root` ，返回 *其节点值的 **后序遍历*** 。

n 叉树 在输入中按层序遍历进行序列化表示，每组子节点由空值 `null` 分隔（请参见示例）。

**示例 1：**

![](https://assets.leetcode.com/uploads/2018/10/12/narytreeexample.png)

```
输入：root = [1,null,3,2,4,null,5,6]
输出：[5,6,3,2,4,1]
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2019/11/08/sample_4_964.png)

```
输入：root = [1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]
输出：[2,6,14,11,7,3,12,8,4,13,9,10,5,1]
```

**提示：**

* 节点总数在范围 `[0, 104]` 内
* `0 <= Node.val <= 104`
* n 叉树的高度小于或等于 `1000`

**进阶：**递归法很简单，你可以使用迭代法完成此题吗?

##### dfs

```js
/**
 * // Definition for a _Node.
 * function _Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

/**
 * @param {_Node|null} root
 * @return {number[]}
 */
var postorder = function(root) {
    const ans = [];
    const dfs = (node) => {
        if (!node) return;
        for (let ch of (node.children ?? [])) {
            dfs(ch);
        }
        ans.push(node.val);
    }
    dfs(root);
    return ans;
};
```

#### [589. N 叉树的前序遍历](https://leetcode.cn/problems/n-ary-tree-preorder-traversal/description/)

给定一个 n 叉树的根节点  `root` ，返回 *其节点值的 **前序遍历*** 。

n 叉树 在输入中按层序遍历进行序列化表示，每组子节点由空值 `null` 分隔（请参见示例）。

**示例 1：**

![](https://assets.leetcode.com/uploads/2018/10/12/narytreeexample.png)

```
输入：root = [1,null,3,2,4,null,5,6]
输出：[1,3,5,6,2,4]
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2019/11/08/sample_4_964.png)

```
输入：root = [1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]
输出：[1,2,3,6,7,11,14,4,8,12,5,9,13,10]
```

**提示：**

* 节点总数在范围 `[0, 104]`内
* `0 <= Node.val <= 104`
* n 叉树的高度小于或等于 `1000`

**进阶：**递归法很简单，你可以使用迭代法完成此题吗?

##### dfs

```js
/**
 * // Definition for a _Node.
 * function _Node(val, children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

/**
 * @param {_Node|null} root
 * @return {number[]}
 */
var preorder = function(root) {
    const ans = [];
    const dfs = (node) => {
        if (!node) return;
        ans.push(node.val);
        if (node.children) {
            for (let child of node.children) {
                dfs(child);
            }
        }
    }
    dfs(root);
    return ans;
};
```

#### [109. 有序链表转换二叉搜索树](https://leetcode.cn/problems/convert-sorted-list-to-binary-search-tree/description/)

给定一个单链表的头节点  `head` ，其中的元素 **按升序排序** ，将其转换为 平衡 二叉搜索树。

**示例 1:**

![](https://assets.leetcode.com/uploads/2020/08/17/linked.jpg)

```
输入: head = [-10,-3,0,5,9]
输出: [0,-3,9,-10,null,5]
解释: 一个可能的答案是[0，-3,9，-10,null,5]，它表示所示的高度平衡的二叉搜索树。
```

**示例 2:**

```
输入: head = []
输出: []
```

**提示:**

* `head` 中的节点数在`[0, 2 * 104]` 范围内
* `-105 <= Node.val <= 105`

##### 根据链表长度构建没有val的树，然后中序遍历填充val

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {ListNode} head
 * @return {TreeNode}
 */
var sortedListToBST = function (head) {
    let listSize = 0;
    for (let node = head; node; node = node.next) {
        listSize++;
    }
    const root = buildTree(0, listSize - 1);
    let node = head;
    const dfs = (root) => {
        if (!root || !node) return;
        dfs(root.left);
        root.val = node.val;
        node = node.next;
        dfs(root.right);
    }
    dfs(root);
    return root;
};
const buildTree = (l, r) => {
    if (l > r) return null;
    if (l == r) return new TreeNode();
    let m = Math.floor((r - l) / 2) + l;
    return new TreeNode(0, buildTree(l, m - 1), buildTree(m + 1, r));
}
```

##### 找到链表中间节点递归

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {ListNode} head
 * @return {TreeNode}
 */
var sortedListToBST = function (head) {
    if (!head) return null;
    const [middlwNode, prevNode] = getMiddleNode(head);
    const root = new TreeNode(middlwNode.val);
    if (prevNode) {
        prevNode.next = null;
        root.left = sortedListToBST(head);
        root.right = sortedListToBST(middlwNode.next);
        prevNode.next = middlwNode;
    }
    return root;
};

const getMiddleNode = (head) => {
    let fast = head, slow = head, prev = null;
    while (fast?.next) {
        prev = slow;
        slow = slow.next;
        fast = fast.next.next;
    }
    return [slow, prev];
}
```

#### [1367. 二叉树中的链表](https://leetcode.cn/problems/linked-list-in-binary-tree/description/)

给你一棵以 `root` 为根的二叉树和一个 `head` 为第一个节点的链表。

如果在二叉树中，存在一条一直向下的路径，且每个点的数值恰好一一对应以 `head` 为首的链表中每个节点的值，那么请你返回 `True` ，否则返回 `False` 。

一直向下的路径的意思是：从树中某个节点开始，一直连续向下的路径。

**示例 1：**

**![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/02/29/sample_1_1720.png)**

```
输入：head = [4,2,8], root = [1,4,4,null,2,2,null,1,null,6,8,null,null,null,null,1,3]
输出：true
解释：树中蓝色的节点构成了与链表对应的子路径。
```

**示例 2：**

**![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/02/29/sample_2_1720.png)**

```
输入：head = [1,4,2,6], root = [1,4,4,null,2,2,null,1,null,6,8,null,null,null,null,1,3]
输出：true
```

**示例 3：**

```
输入：head = [1,4,2,6,8], root = [1,4,4,null,2,2,null,1,null,6,8,null,null,null,null,1,3]
输出：false
解释：二叉树中不存在一一对应链表的路径。
```

**提示：**

* 二叉树和链表中的每个节点的值都满足 `1 <= node.val <= 100` 。
* 链表包含的节点数目在 `1` 到 `100` 之间。
* 二叉树包含的节点数目在 `1` 到 `2500` 之间。

#### [114. 二叉树展开为链表](https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/description/)

给你二叉树的根结点 `root` ，请你将它展开为一个单链表：

* 展开后的单链表应该同样使用 `TreeNode` ，其中 `right` 子指针指向链表中下一个结点，而左子指针始终为 `null` 。
* 展开后的单链表应该与二叉树 [**先序遍历**](https://baike.baidu.com/item/%E5%85%88%E5%BA%8F%E9%81%8D%E5%8E%86/6442839?fr=aladdin) 顺序相同。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/01/14/flaten.jpg)

```
输入：root = [1,2,5,3,4,null,6]
输出：[1,null,2,null,3,null,4,null,5,null,6]
```

**示例 2：**

```
输入：root = []
输出：[]
```

**示例 3：**

```
输入：root = [0]
输出：[0]
```

**提示：**

* 树中结点数在范围 `[0, 2000]` 内
* `-100 <= Node.val <= 100`

**进阶：**你可以使用原地算法（`O(1)` 额外空间）展开这棵树吗？

##### 找到左节点的最右节点mostRight，将mostRight.right指向curr.right，curr.right =  curr.left

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
var flatten = function (root) {
    let node = root;
    while (node) {
        let mostRight = node.left;
        if (mostRight) {
            while (mostRight.right) {
                mostRight = mostRight.right;
            }
            mostRight.right = node.right;
            node.right = node.left;
            node.left = null;
        }
        node = node.right;
    }

    return root;
};
```

##### 前序遍历 栈

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
var flatten = function(root) {
    if (!root) return null;
    const stack = [root];
    let prev;
    while (stack.length) {
        const node = stack.pop();
        if (node.right) stack.push(node.right);
        if (node.left) stack.push(node.left);
        node.left = null;
        if (prev) {
            prev.right = node;
        }
        prev = node;
    }
    return root;
};
```

#### [1437. 是否所有 1 都至少相隔 k 个元素](https://leetcode.cn/problems/check-if-all-1s-are-at-least-length-k-places-away/description/)

给你一个由若干 `0` 和 `1` 组成的数组 `nums` 以及整数 `k`。如果所有 `1` 都至少相隔 `k` 个元素，则返回 true ；否则，返回 `false` 。

**示例 1：**

**![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/05/03/sample_1_1791.png)**

```
输入：nums = [1,0,0,0,1,0,0,1], k = 2
输出：true
解释：每个 1 都至少相隔 2 个元素。
```

**示例 2：**

**![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/05/03/sample_2_1791.png)**

```
输入：nums = [1,0,0,1,0,1], k = 2
输出：false
解释：第二个 1 和第三个 1 之间只隔了 1 个元素。
```

**提示：**

* `1 <= nums.length <= 105`
* `0 <= k <= nums.length`
* `nums[i]` 的值为 `0` 或 `1`

