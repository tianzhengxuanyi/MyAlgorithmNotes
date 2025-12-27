### 2025-12-27

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

##### 栈+迭代

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
    const root = new TreeNode(preorder[0]);
    const st = [root];
    let index = 0;
    //         3
    //        / \
    //       9  20
    //      /  /  \
    //     8  15   7
    //    / \
    //   5  10
    //  /
    // 4

    // preorder = [3, 9, 8, 5, 4, 10, 20, 15, 7]
    // inorder = [4, 5, 8, 10, 9, 3, 15, 20, 7]
    for (let i = 1; i < preorder.length; i++) {
        const node = new TreeNode(preorder[i]);
        let parent;
        while (st.length && st[st.length - 1].val == inorder[index]) {
            parent = st.pop(), index++;
        }
        if (parent) {
            parent.right = node;
        } else if (!parent && st.length) {
            st[st.length - 1].left = node;
        }
        st.push(node);
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
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function (preorder, inorder) {
    const idx = new Map(), n = preorder.length;
    for (let i = 0; i < n; i++) {
        idx.set(inorder[i], i);
    }
    const build = (preLeft, preRight, inLeft, inRight) => {
        if (preLeft > preRight) return null;
        if (preLeft == preRight) return new TreeNode(preorder[preLeft]);
        let inRootIdx = idx.get(preorder[preLeft]);
        let leftSize = inRootIdx - inLeft;
        return new TreeNode(preorder[preLeft],
            build(preLeft + 1, preLeft + leftSize, inLeft, inRootIdx - 1),
            build(preLeft + leftSize + 1, preRight, inRootIdx + 1, inRight));
    }
    return build(0, n - 1, 0, n - 1);
};
```

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

##### 空间复杂度O(1):左节点的最右子节点

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
        while (mostRight && mostRight.right) {
            mostRight = mostRight.right;
        }
        if (mostRight) {
            mostRight.right = node.right;
            node.right = node.left;
            node.left = null;
        }
        node = node.right;
    }
};
```

##### 前序遍历

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
    if (!root) return root;
    const st = [root];
    let dummy = new TreeNode(), node = dummy;
    while (st.length) {
        let curr = st.pop();
        if (curr.right) {
            st.push(curr.right);
            curr.right = null;
        }
        if (curr.left) {
            st.push(curr.left);
            curr.left = null;
        }
        node.right = curr, node = node.right;
    }
    return dummy.right;
};
```

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

##### dfs:每次先遍历右子树

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
var rightSideView = function(root) {
    const ans = [];
    const dfs = (node, d) => {
        if (!node) return;
        if (d == ans.length) {
            ans.push(node.val);
        }
        dfs(node.right, d + 1);
        dfs(node.left, d + 1);
    }
    dfs(root, 0);
    return ans;
};
```

##### 层序遍历

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
var rightSideView = function(root) {
    if (!root) return [];
    const q = [root], ans = [];
    while (q.length) {
        let len = q.length;
        ans.push(q[len - 1].val);
        for (let i = 0; i < len; i++) {
            let node = q.shift();
            if (node.left) q.push(node.left);
            if (node.right) q.push(node.right);
        }
    }
    return ans;
};
```

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

##### dfs左右子树的节点数

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
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function (root, k) {
    let leftCnt = countNode(root.left);
    if (leftCnt < k - 1) {
        return kthSmallest(root.right, k - leftCnt - 1)
    } else if (leftCnt == k - 1) {
        return root.val;
    } else {
        return kthSmallest(root.left, k);
    }
};

function countNode(node) {
    if (!node) return 0;
    if (node.cnt) return node.cnt;

    return node.cnt = countNode(node.left) + countNode(node.right) + 1;
}
```

##### 迭代中序遍历的第k个

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
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function(root, k) {
    const st = [];
    let node = root, cnt = 0, ans;
    while (st.length || node) {
        while (node) {
            st.push(node);
            node = node.left;
        }
        node = st.pop();
        ans = node.val, cnt++;
        if (cnt == k) return ans;
        node = node.right;
    }
};
```

#### [2402. 会议室 III](https://leetcode.cn/problems/meeting-rooms-iii/description/)

给你一个整数 `n` ，共有编号从 `0` 到 `n - 1` 的 `n` 个会议室。

给你一个二维整数数组 `meetings` ，其中 `meetings[i] = [starti, endi]` 表示一场会议将会在 **半闭** 时间区间 `[starti, endi)` 举办。所有 `starti` 的值 **互不相同** 。

会议将会按以下方式分配给会议室：

1. 每场会议都会在未占用且编号 **最小** 的会议室举办。
2. 如果没有可用的会议室，会议将会延期，直到存在空闲的会议室。延期会议的持续时间和原会议持续时间 **相同** 。
3. 当会议室处于未占用状态时，将会优先提供给原 **开始** 时间更早的会议。

返回举办最多次会议的房间 **编号** 。如果存在多个房间满足此条件，则返回编号 **最小** 的房间。

**半闭区间** `[a, b)` 是 `a` 和 `b` 之间的区间，**包括** `a` 但 **不包括** `b` 。

**示例 1：**

```
输入：n = 2, meetings = [[0,10],[1,5],[2,7],[3,4]]
输出：0
解释：
- 在时间 0 ，两个会议室都未占用，第一场会议在会议室 0 举办。
- 在时间 1 ，只有会议室 1 未占用，第二场会议在会议室 1 举办。
- 在时间 2 ，两个会议室都被占用，第三场会议延期举办。
- 在时间 3 ，两个会议室都被占用，第四场会议延期举办。
- 在时间 5 ，会议室 1 的会议结束。第三场会议在会议室 1 举办，时间周期为 [5,10) 。
- 在时间 10 ，两个会议室的会议都结束。第四场会议在会议室 0 举办，时间周期为 [10,11) 。
会议室 0 和会议室 1 都举办了 2 场会议，所以返回 0 。
```

**示例 2：**

```
输入：n = 3, meetings = [[1,20],[2,10],[3,5],[4,9],[6,8]]
输出：1
解释：
- 在时间 1 ，所有三个会议室都未占用，第一场会议在会议室 0 举办。
- 在时间 2 ，会议室 1 和 2 未占用，第二场会议在会议室 1 举办。
- 在时间 3 ，只有会议室 2 未占用，第三场会议在会议室 2 举办。
- 在时间 4 ，所有三个会议室都被占用，第四场会议延期举办。 
- 在时间 5 ，会议室 2 的会议结束。第四场会议在会议室 2 举办，时间周期为 [5,10) 。
- 在时间 6 ，所有三个会议室都被占用，第五场会议延期举办。 
- 在时间 10 ，会议室 1 和 2 的会议结束。第五场会议在会议室 1 举办，时间周期为 [10,12) 。 
会议室 1 和会议室 2 都举办了 2 场会议，所以返回 1 。
```

**提示：**

* `1 <= n <= 100`
* `1 <= meetings.length <= 105`
* `meetings[i].length == 2`
* `0 <= starti < endi <= 5 * 105`
* `starti` 的所有值 **互不相同**

##### 双堆模拟

```js
/**
 * @param {number} n
 * @param {number[][]} meetings
 * @return {number}
 */
var mostBooked = function (n, meetings) {
    // [房间编号，最早空闲时间]
    const meeting = new MinPriorityQueue({ compare: (a, b) => a[1] - b[1] || a[0] - b[0] });
    const rest = new MinPriorityQueue();
    for (let i = 0; i < n; i++) {
        rest.enqueue(i);
    }
    const cnt = Array(n).fill(0);
    let maxCnt = 0, ans = 0;
    meetings.sort((a, b) => a[0] - b[0]);
    for (let [s, e] of meetings) {
        // 当前时间s时已经结束的会议室
        while (!meeting.isEmpty() && meeting.front()[1] <= s) {
            rest.enqueue(meeting.dequeue()[0]);
        }
        // 空闲的房间和下次最早空闲时间
        let room, endTime;
        if (!rest.isEmpty()) {
            room = rest.dequeue();
            endTime = e;
        } else {
            // 获取正在会议中最早空闲且编号最小的房间
            [room, endTime] = meeting.dequeue();
            // 会议延迟后的结束时间
            endTime = Math.max(0, endTime - s) + e;
        }
        cnt[room]++;
        // 使用次数大于或等于当前最大
        if (cnt[room] > maxCnt) {
            maxCnt = cnt[room];
            ans = room;
        } else if (cnt[room] == maxCnt && room < ans) {
            ans = room;
        }
        meeting.enqueue([room, endTime]);
    }
    return ans;
};
```

