### 2026-01-31

#### [22. 括号生成](https://leetcode.cn/problems/generate-parentheses/description/)

数字 `n` 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 **有效的** 括号组合。

**示例 1：**

```
输入：n = 3
输出：["((()))","(()())","(())()","()(())","()()()"]
```

**示例 2：**

```
输入：n = 1
输出：["()"]
```

**提示：**

* `1 <= n <= 8`

##### [ 用时: -3 d -1 hrs -51 m -22 s ]

```js
/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function (n) {
    const ans = [];
    const dfs = (leftCnt, rightCnt, path) => {
        if (leftCnt < rightCnt || leftCnt > n) return;
        if (leftCnt == rightCnt && leftCnt == n) {
            ans.push(path);
            return;
        }
        dfs(leftCnt + 1, rightCnt, path + "(");
        dfs(leftCnt, rightCnt + 1, path + ")");
    }

    dfs(0, 0, "");
    return ans;
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

#### [199. 二叉树的右视图](https://leetcode.cn/problems/binary-tree-right-side-view/description/)

给定一个二叉树的 **根节点** `root`，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。

**示例 1：**

**输入：**root = [1,2,3,null,5,null,4]

**输出：**[1,3,4]

**解释：**

![](https://assets.leetcode.com/uploads/2024/11/24/tmpd5jn43fs-1.png)

**示例 2：**

**输入：**root = [1,2,3,4,null,null,null,5]

**输出：**[1,3,4,5]

**解释：**

![](https://assets.leetcode.com/uploads/2024/11/24/tmpkpe40xeh-1.png)

**示例 3：**

**输入：**root = [1,null,3]

**输出：**[1,3]

**示例 4：**

**输入：**root = []

**输出：**[]

**提示:**

* 二叉树的节点个数的范围是 `[0,100]`
* `-100 <= Node.val <= 100`

#### [230. 二叉搜索树中第 K 小的元素](https://leetcode.cn/problems/kth-smallest-element-in-a-bst/description/)

给定一个二叉搜索树的根节点 `root` ，和一个整数 `k` ，请你设计一个算法查找其中第 `k`小的元素（`k` 从 1 开始计数）。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/01/28/kthtree1.jpg)

```
输入：root = [3,1,4,null,2], k = 1
输出：1
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2021/01/28/kthtree2.jpg)

```
输入：root = [5,3,6,2,4,null,null,1], k = 3
输出：3
```

**提示：**

* 树中的节点数为 `n` 。
* `1 <= k <= n <= 104`
* `0 <= Node.val <= 104`

**进阶：**如果二叉搜索树经常被修改（插入/删除操作）并且你需要频繁地查找第 `k` 小的值，你将如何优化算法？

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

##### [ 用时: -3 d -1 hrs -42 m -48 s ]

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
    const dfs = (node1, node2) => {
        if (!node1 && !node2) return true;
        if (!node1 || !node2 || node1.val !== node2.val) return false;
        return dfs(node1.left, node2.right) && dfs(node1.right, node2.left);
    }

    return dfs(root.left, root.right);
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

#### [148. 排序链表](https://leetcode.cn/problems/sort-list/description/)

给你链表的头结点 `head` ，请将其按 **升序** 排列并返回 **排序后的链表** 。



**示例 1：**

![](https://assets.leetcode.com/uploads/2020/09/14/sort_list_1.jpg)

```
输入：head = [4,2,1,3]
输出：[1,2,3,4]
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2020/09/14/sort_list_2.jpg)

```
输入：head = [-1,5,3,4,0]
输出：[-1,0,3,4,5]
```

**示例 3：**

```
输入：head = []
输出：[]
```

**提示：**

* 链表中节点的数目在范围 `[0, 5 * 104]` 内
* `-105 <= Node.val <= 105`

**进阶：**你可以在 `O(n log n)` 时间复杂度和常数级空间复杂度下，对链表进行排序吗？

##### 迭代空间复杂度O(1)

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var sortList = function(head) {
    if (!head || !head.next) return head;
    const n = getListLength(head);
    const dummy = new ListNode(-1, head);
    for (let step = 1; step < n; step *= 2) {
        let newTail = dummy, curr = newTail.next;
        while (curr) {
            let head1 = curr, head2 = splitList(head1, step);
            curr = splitList(head2, step);
            let [h, t] = merge(head1, head2)
            newTail.next = h;
            t.next = curr;
            newTail = t;
        }
    }
    return dummy.next;
};

const getListLength = (head) => {
    let len = 0;
    while (head) {
        head = head.next;
        len++;
    }
    return len;
}

const splitList = (head, k) => {
    let node = head;
    for (let i = 0; i < k - 1; i++) {
        node = node?.next;
    }
    let head2 = node?.next ?? null;
    if (head2) node.next = null;
    return head2;
}

const merge = (head1, head2) => {
    const dummy = new ListNode(-1);
    let node1 = head1, node2 = head2, node = dummy;
    while (node1 && node2) {
        if (node1.val <= node2.val) {
            node.next = node1;
            node1 = node1.next;
        } else {
            node.next = node2;
            node2 = node2.next;
        }
        node = node.next;
    }
    if (node1) {
        node.next = node1;
    }
    if (node2) {
        node.next = node2;
    }
    while (node.next) {
        node = node.next;
    }
    return [dummy.next, node];
}
```

##### 归并排序

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var sortList = function(head) {
    if (!head || !head.next) return head;
    const len = getListLength(head);
    let [node1, node2] = splitList(head, Math.floor(len / 2));
    node1 = sortList(node1), node2 = sortList(node2);
    return merge(node1, node2);
};

const getListLength = (head) => {
    let len = 0;
    while (head) {
        head = head.next;
        len++;
    }
    return len;
}

const splitList = (head, k) => {
    let node = head;
    for (let i = 0; i < k - 1; i++) {
        node = node.next;
    }
    let head2 = node.next;
    node.next = null;
    return [head, head2];
}

const merge = (head1, head2) => {
    const dummy = new ListNode(-1);
    let node1 = head1, node2 = head2, node = dummy;
    while (node1 && node2) {
        if (node1.val <= node2.val) {
            node.next = node1;
            node1 = node1.next;
        } else {
            node.next = node2;
            node2 = node2.next;
        }
        node = node.next;
    }
    if (node1) {
        node.next = node1;
    }
    if (node2) {
        node.next = node2;
    }
    return dummy.next;
}
```

#### [744. 寻找比目标字母大的最小字母](https://leetcode.cn/problems/find-smallest-letter-greater-than-target/description/)

给你一个字符数组 `letters`，该数组按**非递减顺序**排序，以及一个字符 `target`。`letters` 里**至少有两个不同**的字符。

返回 `letters` 中大于 `target` 的最小的字符。如果不存在这样的字符，则返回 `letters` 的第一个字符。

**示例 1：**

```
输入: letters = ['c', 'f', 'j']，target = 'a'
输出: 'c'
解释：letters 中字典上比 'a' 大的最小字符是 'c'。
```

**示例 2:**

```
输入: letters = ['c','f','j'], target = 'c'
输出: 'f'
解释：letters 中字典顺序上大于 'c' 的最小字符是 'f'。
```

**示例 3:**

```
输入: letters = ['x','x','y','y'], target = 'z'
输出: 'x'
解释：letters 中没有一个字符在字典上大于 'z'，所以我们返回 letters[0]。
```

**提示：**

* `2 <= letters.length <= 104`
* `letters[i]` 是一个小写字母
* `letters` 按**非递减顺序**排序
* `letters` 最少包含两个不同的字母
* `target` 是一个小写字母

