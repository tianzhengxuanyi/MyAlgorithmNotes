### 2025-12-24

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

##### mirror遍历

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
    const ans = [];
    let curr = root, mostRight;
    while (curr) {
        mostRight = curr.left;
        if (mostRight) { // 找到最右节点
            while (mostRight.right && mostRight.right !== curr) {
                mostRight = mostRight.right;
            }
            if (!mostRight.right) {
                // 第一次遍历curr
                mostRight.right = curr;
                curr = curr.left;
            } else {
                // 第二次遍历curr
                ans.push(curr.val);
                mostRight.right = null;
                curr = curr.right;
            }
        } else {
            // 没有左节点，只会遍历到一次
            ans.push(curr.val);
            curr = curr.right;
        }
    }
    return ans;
};
```

##### 递归+栈

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
    const st = [], ans = [];
    let curr = root;
    while (st.length || curr) {
        if (curr) {
            st.push(curr);
            curr = curr.left;
        } else {
            curr = st.pop();
            ans.push(curr.val);
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
        dfs(node.left);
        ans.push(node.val);
        dfs(node.right);
    }
    dfs(root);
    return ans;
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

##### dfs: 自底向上

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
    let left = maxDepth(root.left);
    let right = maxDepth(root.right);
    return Math.max(left, right) + 1;
};
```

##### bfs

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
    let ans = 0;
    const q = [[root, 1]];
    while (q.length) {
        const [node, d] = q.shift();
        ans = Math.max(ans, d)
        if (node.left) q.push([node.left, d + 1])
        if (node.right) q.push([node.right, d + 1])
    }
    return ans;
};
```

##### dfs: 自顶向下

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
    let ans = 0;
    const dfs = (node, d) => {
        if (!node) return;
        ans = Math.max(ans, d);
        dfs(node.left, d + 1);
        dfs(node.right, d + 1);
    }
    dfs(root, 1);
    return ans;
};
```

#### [146. LRU 缓存](https://leetcode.cn/problems/lru-cache/description/)

请你设计并实现一个满足  [LRU (最近最少使用) 缓存](https://baike.baidu.com/item/LRU) 约束的数据结构。

实现 `LRUCache` 类：

* `LRUCache(int capacity)` 以 **正整数** 作为容量 `capacity` 初始化 LRU 缓存
* `int get(int key)` 如果关键字 `key` 存在于缓存中，则返回关键字的值，否则返回 `-1` 。
* `void put(int key, int value)` 如果关键字 `key` 已经存在，则变更其数据值 `value` ；如果不存在，则向缓存中插入该组 `key-value` 。如果插入操作导致关键字数量超过 `capacity` ，则应该 **逐出** 最久未使用的关键字。

函数 `get` 和 `put` 必须以 `O(1)` 的平均时间复杂度运行。

**示例：**

```
输入
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
输出
[null, null, null, 1, null, -1, null, -1, 3, 4]

解释
LRUCache lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // 缓存是 {1=1}
lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}
lRUCache.get(1);    // 返回 1
lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
lRUCache.get(2);    // 返回 -1 (未找到)
lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
lRUCache.get(1);    // 返回 -1 (未找到)
lRUCache.get(3);    // 返回 3
lRUCache.get(4);    // 返回 4
```

**提示：**

* `1 <= capacity <= 3000`
* `0 <= key <= 10000`
* `0 <= value <= 105`
* 最多调用 `2 * 105` 次 `get` 和 `put`

##### 双向链表

```js
function ListNode(key, val, prev, next) {
    this.key = key ?? 0;
    this.val = val ?? 0;
    this.prev = prev ?? null;
    this.next = next ?? null;
}

/**
 * @param {number} capacity
 */
var LRUCache = function (capacity) {
    this.capacity = capacity;
    this.dummy = new ListNode(-1, -1);
    this.dummy.next = this.dummy, this.dummy.prev = this.dummy;
    this.cache = new Map();
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function (key) {
    const node = this.getNode(key);
    return node ? node.val : -1;
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function (key, value) {
    if (!this.cache.has(key)) {
        if (this.cache.size >= this.capacity) {
            const removeNode = this.dummy.prev;
            this.cache.delete(removeNode.key);
            this.remove(removeNode);
        }
        const node = new ListNode(key, value);
        this.pushFront(node);
        this.cache.set(key, node);
    } else {
        const node = this.getNode(key);
        node.val = value;
    }

};

LRUCache.prototype.remove = function (node) {
    const prev = node.prev, next = node.next;
    prev.next = next, next.prev = prev;
    node.next = node.prev = null;
};

LRUCache.prototype.pushFront = function (node) {
    node.prev = this.dummy, node.next = this.dummy.next;
    this.dummy.next.prev = node, this.dummy.next = node;
};

LRUCache.prototype.getNode = function (key) {
    if (!this.cache.has(key)) return null;
    const node = this.cache.get(key);
    this.remove(node);
    this.pushFront(node);
    return node;
};

/** 
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
```

#### [3074. 重新分装苹果](https://leetcode.cn/problems/apple-redistribution-into-boxes/description/)

给你一个长度为 `n` 的数组 `apple` 和另一个长度为 `m` 的数组 `capacity` 。

一共有 `n` 个包裹，其中第 `i` 个包裹中装着 `apple[i]` 个苹果。同时，还有 `m` 个箱子，第 `i` 个箱子的容量为 `capacity[i]` 个苹果。

请你选择一些箱子来将这 `n` 个包裹中的苹果重新分装到箱子中，返回你需要选择的箱子的 **最小** 数量。

**注意**，同一个包裹中的苹果可以分装到不同的箱子中。

**示例 1：**

```
输入：apple = [1,3,2], capacity = [4,3,1,5,2]
输出：2
解释：使用容量为 4 和 5 的箱子。
总容量大于或等于苹果的总数，所以可以完成重新分装。
```

**示例 2：**

```
输入：apple = [5,5,5], capacity = [2,4,2,7]
输出：4
解释：需要使用所有箱子。
```

**提示：**

* `1 <= n == apple.length <= 50`
* `1 <= m == capacity.length <= 50`
* `1 <= apple[i], capacity[i] <= 50`
* 输入数据保证可以将包裹中的苹果重新分装到箱子中。

##### 排序贪心

```js
/**
 * @param {number[]} apple
 * @param {number[]} capacity
 * @return {number}
 */
var minimumBoxes = function(apple, capacity) {
    let total = _.sum(apple);
    capacity.sort((a, b) => b - a);
    let i = 0;
    while (total > 0) {
        total -= capacity[i++];
    }
    return i;
};
```

