### 2025-11-11

#### [145. 二叉树的后序遍历](https://leetcode.cn/problems/binary-tree-postorder-traversal/description/)

给你一棵二叉树的根节点 `root` ，返回其节点值的 **后序遍历** 。

**示例 1：**

**输入：**root = [1,null,2,3]

**输出：**[3,2,1]

**解释：**

![](https://assets.leetcode.com/uploads/2024/08/29/screenshot-2024-08-29-202743.png)

**示例 2：**

**输入：**root = [1,2,3,4,5,null,8,null,null,6,7,9]

**输出：**[4,6,7,5,2,9,8,3,1]

**解释：**

![](https://assets.leetcode.com/uploads/2024/08/29/tree_2.png)

**示例 3：**

**输入：**root = []

**输出：**[]

**示例 4：**

**输入：**root = [1]

**输出：**[1]

**提示：**

* 树中节点的数目在范围 `[0, 100]` 内
* `-100 <= Node.val <= 100`

**进阶：**递归算法很简单，你可以通过迭代算法完成吗？

##### morris遍历

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
 * @return {number[]}
 */
var postorderTraversal = function(root) {
    if (!root) return [];
    const ans = [];
    const reverseNode = (node) => {
        if (!node) return;
        let prev = null, curr = node;
        while (curr) {
            let right = curr.right;
            curr.right = prev;
            prev = curr;
            curr = right;
        }
        return prev;
    }

    const addNode = (node) => {
        const newNode = reverseNode(node);
        let curr = newNode;
        while (curr) {
            ans.push(curr.val);
            curr = curr.right;
        }
        reverseNode(newNode);
    }

    let curr = root, mostRight;
    while (curr) {
        mostRight = curr.left;
        if (mostRight) {
            while (mostRight.right && mostRight.right != curr) {
                mostRight = mostRight.right;
            }

            if (!mostRight.right) {
                // 第一次遍历到当前节点
                mostRight.right = curr;
                curr = curr.left;
            } else {
                // 第二次遍历到当前节点
                mostRight.right = null; // 先解除mostRight的right
                addNode(curr.left); // 添加左节点的右边界
                curr = curr.right;
            }
        } else {
            curr = curr.right;
        }
    }
    addNode(root);

    return ans;
};
```

##### 栈，类似前序遍历得到curr，curr.right, curr.left的顺序，最后逆序结果

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
 * @return {number[]}
 */
var postorderTraversal = function(root) {
    if (!root) return [];
    const stack = [root];
    const collect = [];
    while (stack.length) {
        let curr = stack.pop();
        collect.push(curr.val);
        if (curr.left) stack.push(curr.left);
        if (curr.right) stack.push(curr.right);
    }

    return collect.reverse();
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
 * @return {number[]}
 */
var postorderTraversal = function(root) {
    const ans = [];
    const dfs = (node) => {
        if (!node) return;
        if (node.left) dfs(node.left);
        if (node.right) dfs(node.right);
        ans.push(node.val);
    }
    dfs(root);
    return ans;
};
```

#### [94. 二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal/description/)

给定一个二叉树的根节点 `root` ，返回 *它的 **中序** 遍历* 。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/09/15/inorder_1.jpg)

```
输入：root = [1,null,2,3]
输出：[1,3,2]
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

**提示：**

* 树中节点数目在范围 `[0, 100]` 内
* `-100 <= Node.val <= 100`

**进阶:** 递归算法很简单，你可以通过迭代算法完成吗？

##### morris遍历

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
 * @return {number[]}
 */
var inorderTraversal = function (root) {
    let curr = root, mostRight = null;
    const ans = [];
    while (curr) {
        mostRight = curr.left;
        if (mostRight) {
            // 不断遍历最右节点
            while (mostRight.right && mostRight.right != curr) {
                mostRight = mostRight.right;
            }
            if (!mostRight.right) { // 第一次遍历
                mostRight.right = curr;
                curr = curr.left;
            } else { // 第二次遍历
                ans.push(curr.val) // 左侧节点遍历完了，记录当前节点
                mostRight.right = null;
                curr = curr.right;
            }
        } else {
            // 左节点不存在，直接移动到右节点
            ans.push(curr.val); // 左侧节点遍历完了，记录当前节点
            curr = curr.right;
        }
    }

    return ans;
};
```

##### 递归 + 栈，不断的将左节点入栈，当curr为空时，出栈，记录，curr移动到出栈节点的右节点

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
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    if (!root) return [];
    const stack = [], ans = [];
    let curr = root;
    while (stack.length || curr) {
        if (curr) { // 不断的向左遍历
            stack.push(curr);
            curr = curr.left;
        } else {
            // 栈顶为最左节点，弹出记录
            curr = stack.pop();
            ans.push(curr.val);
            // 移动到右侧
            curr = curr.right;
        }
    }

    return ans;
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
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    const ans = [];
    const dfs = (node) => {
        if (!node) return;
        if (node.left) dfs(node.left);
        ans.push(node.val);
        if (node.right) dfs(node.right);
    }
    dfs(root);
    return ans;
};
```

#### [144. 二叉树的前序遍历](https://leetcode.cn/problems/binary-tree-preorder-traversal/description/)

给你二叉树的根节点 `root` ，返回它节点值的 **前序**遍历。

**示例 1：**

**输入：**root = [1,null,2,3]

**输出：**[1,2,3]

**解释：**

![](https://assets.leetcode.com/uploads/2024/08/29/screenshot-2024-08-29-202743.png)

**示例 2：**

**输入：**root = [1,2,3,4,5,null,8,null,null,6,7,9]

**输出：**[1,2,4,5,6,7,3,8,9]

**解释：**

![](https://assets.leetcode.com/uploads/2024/08/29/tree_2.png)

**示例 3：**

**输入：**root = []

**输出：**[]

**示例 4：**

**输入：**root = [1]

**输出：**[1]

**提示：**

* 树中节点数目在范围 `[0, 100]` 内
* `-100 <= Node.val <= 100`

**进阶：**递归算法很简单，你可以通过迭代算法完成吗？

##### Morris遍历

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
 * @return {number[]}
 */
var preorderTraversal = function(root) {
    let curr = root, mostRight = null;
    const ans = [];
    while (curr) {
        mostRight = curr.left;
        if (mostRight) { // 左节点存在
            // 寻找左节点的最右节点
            while (mostRight.right && mostRight.right != curr) {
                mostRight = mostRight.right;
            }
            if (!mostRight.right) { // 第一次遍历到curr
                ans.push(curr.val) // 前序遍历
                mostRight.right = curr; // 最右节点连接curr
                curr = curr.left;
            } else { // 第二次遍历到curr
                mostRight.right = null;
                curr = curr.right;
            }
        } else {
            ans.push(curr.val); // 前序遍历
            curr = curr.right;
        }
    }

    return ans;
};
```

##### 迭代 + 栈

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
 * @return {number[]}
 */
var preorderTraversal = function (root) {
    const stack = [root];
    const ans = [];
    while (stack.length) {
        const node = stack.pop();
        if (!node) continue;
        ans.push(node.val);
        if (node.right) stack.push(node.right);
        if (node.left) stack.push(node.left);
    }
    return ans;
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
 * @return {number[]}
 */
var preorderTraversal = function(root) {
    const ans = [];
    const dfs = (node) => {
        if (!node) return;
        ans.push(node.val);
        if (node.left) dfs(node.left);
        if (node.right) dfs(node.right);
    }
    dfs(root);
    return ans;
};
```

#### [430. 扁平化多级双向链表](https://leetcode.cn/problems/flatten-a-multilevel-doubly-linked-list/description/)

你会得到一个双链表，其中包含的节点有一个下一个指针、一个前一个指针和一个额外的 **子指针** 。这个子指针可能指向一个单独的双向链表，也包含这些特殊的节点。这些子列表可以有一个或多个自己的子列表，以此类推，以生成如下面的示例所示的 **多层数据结构** 。

给定链表的头节点 head ，将链表 **扁平化** ，以便所有节点都出现在单层双链表中。让 `curr` 是一个带有子列表的节点。子列表中的节点应该出现在**扁平化列表**中的 `curr` **之后** 和 `curr.next` **之前** 。

返回 *扁平列表的 `head` 。列表中的节点必须将其 **所有** 子指针设置为 `null` 。*

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/11/09/flatten11.jpg)

```
输入：head = [1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]
输出：[1,2,3,7,8,11,12,9,10,4,5,6]
解释：输入的多级列表如上图所示。
扁平化后的链表如下图：
![](https://assets.leetcode.com/uploads/2021/11/09/flatten12.jpg)
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2021/11/09/flatten2.1jpg)

```
输入：head = [1,2,null,3]
输出：[1,3,2]
解释：输入的多级列表如上图所示。
扁平化后的链表如下图：
![](https://assets.leetcode.com/uploads/2021/11/24/list.jpg)
```

**示例 3：**

```
输入：head = []
输出：[]
说明：输入中可能存在空列表。
```

**提示：**

* 节点数目不超过 `1000`
* `1 <= Node.val <= 105`

**如何表示测试用例中的多级链表？**

以 **示例 1** 为例：

```
 1---2---3---4---5---6--NULL
         |
         7---8---9---10--NULL
             |
             11--12--NULL
```

序列化其中的每一级之后：

```
[1,2,3,4,5,6,null]
[7,8,9,10,null]
[11,12,null]
```

为了将每一级都序列化到一起，我们需要每一级中添加值为 null 的元素，以表示没有节点连接到上一级的上级节点。

```
[1,2,3,4,5,6,null]
[null,null,7,8,9,10,null]
[null,11,12,null]
```

合并所有序列化结果，并去除末尾的 null 。

```
[1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]
```

##### 递归展开子节点，把展开后的子节点插入node和node.next之间

```js
/**
 * // Definition for a _Node.
 * function _Node(val,prev,next,child) {
 *    this.val = val;
 *    this.prev = prev;
 *    this.next = next;
 *    this.child = child;
 * };
 */

/**
 * @param {_Node} head
 * @return {_Node}
 */
var flatten = function (head) {
    const dfs = (head) => {
        let node = head, tail = head;
        while (node) {
            const next = node.next;
            if (node.child) {
                // 展开子节点
                const [flattenHead, flattenTail] = dfs(node.child);
                // 重新链接
                node.next = flattenHead;
                flattenHead.prev = node;
                flattenTail.next = next;
                if (next) next.prev = flattenTail;
                // 置空子节点
                node.child = null;
                // 尾部应该为展开后的子节点的尾部
                tail = flattenTail;
            } else {
                tail = node;
            }

            node = next;
        }
        return [head, tail];
    }
    dfs(head);
    return head;
};
```

#### [460. LFU 缓存](https://leetcode.cn/problems/lfu-cache/description/)

请你为 [最不经常使用（LFU）](https://baike.baidu.com/item/%E7%BC%93%E5%AD%98%E7%AE%97%E6%B3%95)缓存算法设计并实现数据结构。

实现 `LFUCache` 类：

* `LFUCache(int capacity)` - 用数据结构的容量 `capacity` 初始化对象
* `int get(int key)` - 如果键 `key` 存在于缓存中，则获取键的值，否则返回 `-1` 。
* `void put(int key, int value)` - 如果键 `key` 已存在，则变更其值；如果键不存在，请插入键值对。当缓存达到其容量 `capacity` 时，则应该在插入新项之前，移除最不经常使用的项。在此问题中，当存在平局（即两个或更多个键具有相同使用频率）时，应该去除 **最久未使用** 的键。

为了确定最不常使用的键，可以为缓存中的每个键维护一个 **使用计数器** 。使用计数最小的键是最久未使用的键。

当一个键首次插入到缓存中时，它的使用计数器被设置为 `1` (由于 put 操作)。对缓存中的键执行 `get` 或 `put` 操作，使用计数器的值将会递增。

函数 `get` 和 `put` 必须以 `O(1)` 的平均时间复杂度运行。

**示例：**

```
输入：
["LFUCache", "put", "put", "get", "put", "get", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [3], [4, 4], [1], [3], [4]]
输出：
[null, null, null, 1, null, -1, 3, null, -1, 3, 4]

解释：
// cnt(x) = 键 x 的使用计数
// cache=[] 将显示最后一次使用的顺序（最左边的元素是最近的）
LFUCache lfu = new LFUCache(2);
lfu.put(1, 1);   // cache=[1,_], cnt(1)=1
lfu.put(2, 2);   // cache=[2,1], cnt(2)=1, cnt(1)=1
lfu.get(1);      // 返回 1
                 // cache=[1,2], cnt(2)=1, cnt(1)=2
lfu.put(3, 3);   // 去除键 2 ，因为 cnt(2)=1 ，使用计数最小
                 // cache=[3,1], cnt(3)=1, cnt(1)=2
lfu.get(2);      // 返回 -1（未找到）
lfu.get(3);      // 返回 3
                 // cache=[3,1], cnt(3)=2, cnt(1)=2
lfu.put(4, 4);   // 去除键 1 ，1 和 3 的 cnt 相同，但 1 最久未使用
                 // cache=[4,3], cnt(4)=1, cnt(3)=2
lfu.get(1);      // 返回 -1（未找到）
lfu.get(3);      // 返回 3
                 // cache=[3,4], cnt(4)=1, cnt(3)=3
lfu.get(4);      // 返回 4
                 // cache=[3,4], cnt(4)=2, cnt(3)=3
```

**提示：**

* `1 <= capacity <= 104`
* `0 <= key <= 105`
* `0 <= value <= 109`
* 最多调用 `2 * 105` 次 `get` 和 `put` 方法

##### 用hashMap维护每个频次的LRU链表，并用minCnt维护最小频次（应为cnt是连续的，如果get后最小频次变了，一定是加一。put新节点时，minCnt变为1）

```js
function ListNode(key, val, prev, next) {
    this.key = key;
    this.val = val;
    this.cnt = 1;
    this.prev = this.prev ?? null;
    this.next = this.next ?? null;
}

/**
 * @param {number} capacity
 */
var LFUCache = function (capacity) {
    this.capacity = capacity;
    const dummy = new ListNode();
    dummy.next = dummy, dummy.prev = dummy;
    this.cntToDummy = new Map([[1, dummy]]);
    this.keyToNode = new Map();
    this.minCnt = 1;
};

/** 
 * @param {number} key
 * @return {number}
 */
LFUCache.prototype.get = function (key) {
    const node = this.getNode(key);
    return node ? node.val : -1;
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LFUCache.prototype.put = function (key, value) {
    if (this.keyToNode.has(key)) {
        const node = this.getNode(key);
        node.val = value;
        return;
    }
    if (this.keyToNode.size >= this.capacity) {
        const dummy = this.cntToDummy.get(this.minCnt);
        const LFUNode = dummy.prev; // 最久未使用，在dummy的尾部
        this.remove(LFUNode);
        this.keyToNode.delete(LFUNode.key);
    }
    const newNode = new ListNode(key, value);
    this.pushFront(this.cntToDummy.get(1), newNode);
    this.keyToNode.set(key, newNode);
    this.minCnt = 1;
};

LFUCache.prototype.getNode = function (key) {
    if (!this.keyToNode.has(key)) return null;
    const node = this.keyToNode.get(key);
    const cnt = node.cnt, newCnt = cnt + 1;
    // 从原本频次的链表中移除节点
    this.remove(node);
    // 如果移除的节点的频次等于minCnt，且移除后对应的dummy为空，minCnt加一
    const oldDummy = this.cntToDummy.get(cnt);
    if (this.minCnt == cnt && oldDummy.next == oldDummy) {
        this.minCnt += 1;
    }
    node.cnt = newCnt; // 更新频次
    let dummy = this.cntToDummy.get(newCnt);
    if (!dummy) { // 如果不存在对应频次的dummy则新建
        dummy = new ListNode();
        dummy.prev = dummy, dummy.next = dummy;
        this.cntToDummy.set(newCnt, dummy);
    }
    // 将节点push到链表的头部，表示最新使用了
    this.pushFront(dummy, node);

    return node;
};

LFUCache.prototype.remove = function (node) {
    const prev = node.prev, next = node.next;
    prev.next = next, next.prev = prev;
    node.prev = node.next = null;
};

LFUCache.prototype.pushFront = function (head, node) {
    node.prev = head, node.next = head.next;
    head.next.prev = node, head.next = node;
};


/** 
 * Your LFUCache object will be instantiated and called as such:
 * var obj = new LFUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
```

#### [474. 一和零](https://leetcode.cn/problems/ones-and-zeroes/description/)

给你一个二进制字符串数组 `strs` 和两个整数 `m` 和 `n` 。

请你找出并返回 `strs` 的最大子集的长度，该子集中 **最多** 有 `m` 个 `0` 和 `n` 个 `1` 。

如果 `x` 的所有元素也是 `y` 的元素，集合 `x` 是集合 `y` 的 **子集** 。

**示例 1：**

```
输入：strs = ["10", "0001", "111001", "1", "0"], m = 5, n = 3
输出：4
解释：最多有 5 个 0 和 3 个 1 的最大子集是 {"10","0001","1","0"} ，因此答案是 4 。
其他满足题意但较小的子集包括 {"0001","1"} 和 {"10","1","0"} 。{"111001"} 不满足题意，因为它含 4 个 1 ，大于 n 的值 3 。
```

**示例 2：**

```
输入：strs = ["10", "0", "1"], m = 1, n = 1
输出：2
解释：最大的子集是 {"0", "1"} ，所以答案是 2 。
```

**提示：**

* `1 <= strs.length <= 600`
* `1 <= strs[i].length <= 100`
* `strs[i]` 仅由 `'0'` 和 `'1'` 组成
* `1 <= m, n <= 100`

##### 空间压缩

```js
/**
 * @param {string[]} strs
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var findMaxForm = function (strs, m, n) {
    const len = strs.length;
    const cnt = Array(len);
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
    for (let i = 0; i < len; i++) {
        let c = [0, 0];
        for (let s of strs[i]) {
            c[s] += 1;
        }
        cnt[i] = c;
    }
    for (let i = len - 1; i >= 0; i--) {
        const [c0, c1] = cnt[i];
        for (let rm = m; rm >= 0; rm--) {
            for (let rn = n; rn >= 0; rn--) {
                if (c0 <= rm && c1 <= rn) {
                    dp[rm][rn] = Math.max((dp[rm - c0]?.[rn - c1] ?? 0) + 1, dp[rm][rn])
                }
            }
        }
    }
    return dp[m][n];
};
```

##### 迭代

```js
/**
 * @param {string[]} strs
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var findMaxForm = function (strs, m, n) {
    const len = strs.length;
    const cnt = Array(len);
    for (let i = 0; i < len; i++) {
        let c = [0, 0];
        for (let s of strs[i]) {
            c[s] += 1;
        }
        cnt[i] = c;
    }
    const dp = Array.from({ length: len + 1 }, () => Array.from({ length: m + 1 }, () =>
        Array(n + 1).fill(0)))
    for (let i = len - 1; i >= 0; i--) {
        const [c0, c1] = cnt[i];
        for (let rm = 0; rm <= m; rm++) {
            for (let rn = 0; rn <= n; rn++) {
                if (c0 <= rm && c1 <= rn) {
                    dp[i][rm][rn] = (dp[i + 1][rm - c0]?.[rn - c1] ?? 0) + 1
                }
                dp[i][rm][rn] = Math.max(dp[i][rm][rn], dp[i + 1][rm][rn]);
            }
        }
    }
    return dp[0][m][n];
};
```

##### dfs背包

```js
/**
 * @param {string[]} strs
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var findMaxForm = function (strs, m, n) {
    const len = strs.length;
    const cnt = Array(len);
    for (let i = 0; i < len; i++) {
        let c = [0, 0];
        for (let s of strs[i]) {
            c[s] += 1;
        }
        cnt[i] = c;
    }
    const memo = Array.from({ length: len }, () => Array.from({ length: m + 1 }, () =>
        Array(n + 1).fill(-1)))
    const dfs = (i, rm, rn) => {
        if (i >= len || rm < 0 || rn < 0) return 0;
        if (memo[i][rm][rn] >= 0) return memo[i][rm][rn];
        let res = 0;
        const [c0, c1] = cnt[i];
        if (c0 <= rm && c1 <= rn) {
            res = dfs(i + 1, rm - c0, rn - c1) + 1;
        }
        return memo[i][rm][rn] = Math.max(dfs(i + 1, rm, rn), res);
    }

    return dfs(0, m, n)
};
```

