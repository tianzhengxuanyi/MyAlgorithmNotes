### 2025-12-23

#### [2054. 两个最好的不重叠活动](https://leetcode.cn/problems/two-best-non-overlapping-events/description/)

给你一个下标从 **0** 开始的二维整数数组 `events` ，其中 `events[i] = [startTimei, endTimei, valuei]` 。第 `i` 个活动开始于 `startTimei` ，结束于 `endTimei` ，如果你参加这个活动，那么你可以得到价值 `valuei` 。你 **最多** 可以参加 **两个时间不重叠** 活动，使得它们的价值之和 **最大** 。

请你返回价值之和的 **最大值** 。

注意，活动的开始时间和结束时间是 **包括** 在活动时间内的，也就是说，你不能参加两个活动且它们之一的开始时间等于另一个活动的结束时间。更具体的，如果你参加一个活动，且结束时间为 `t` ，那么下一个活动必须在 `t + 1` 或之后的时间开始。

**示例 1:**

![](https://assets.leetcode.com/uploads/2021/09/21/picture5.png)

```
输入：events = [[1,3,2],[4,5,2],[2,4,3]]
输出：4
解释：选择绿色的活动 0 和 1 ，价值之和为 2 + 2 = 4 。
```

**示例 2：**

![Example 1 Diagram](https://assets.leetcode.com/uploads/2021/09/21/picture1.png)

```
输入：events = [[1,3,2],[4,5,2],[1,5,5]]
输出：5
解释：选择活动 2 ，价值和为 5 。
```

**示例 3：**

![](https://assets.leetcode.com/uploads/2021/09/21/picture3.png)

```
输入：events = [[1,5,3],[1,5,1],[6,6,5]]
输出：8
解释：选择活动 0 和 2 ，价值之和为 3 + 5 = 8 。
```

**提示：**

* `2 <= events.length <= 105`
* `events[i].length == 3`
* `1 <= startTimei <= endTimei <= 109`
* `1 <= valuei <= 106`

##### 二分+单调栈

```js
/**
 * @param {number[][]} events
 * @return {number}
 */
var maxTwoEvents = function(events) {
    events.sort((a,b) => a[1] - b[1]);
    const st = [[0,0]]; // 结束时间比当前大且价值比当前大才能入栈
    let ans = 0;
    for (let [s, e, v] of events) {
        // 小于开始时间
        let i = lowerBound(st, s) - 1;
        if (i < st.length) ans = Math.max(ans, v + st[i][1]);
        if (v > st[st.length - 1][1]) {
            st.push([e, v]);
        }
    }
    return ans;
};

const lowerBound = (st, target) => {
    let l = 0, r = st.length - 1;
    while (l <= r) {
        let m = Math.floor((r - l) / 2) + l;
        if (st[m][0] < target) {
            l = m + 1;
        } else {
            r = m - 1;
        }
    }
    return l;
}
```

##### 优先队列维护小于结束时间小于当前开始时间的所有event

```js
/**
 * @param {number[][]} events
 * @return {number}
 */
var maxTwoEvents = function (events) {
    const startSorted = [...events].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const endSorted = [...events].sort((a, b) => a[1] - b[1] || a[0] - b[0]);
    
    const q = new MaxPriorityQueue((q) => q[2]);
    let ans = 0;
    for (let i = 0, j = 0; i < events.length; i++) {
        let [s, e, v] = startSorted[i];
        while (j < i && endSorted[j][1] < s) {
            q.enqueue(endSorted[j++]);
        }
        ans = Math.max(ans, v + (q.front()?.[2] ?? 0))
    }
    return ans;
};
```

#### [23. 合并 K 个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists/description/)

给你一个链表数组，每个链表都已经按升序排列。

请你将所有链表合并到一个升序链表中，返回合并后的链表。

**示例 1：**

```
输入：lists = [[1,4,5],[1,3,4],[2,6]]
输出：[1,1,2,3,4,4,5,6]
解释：链表数组如下：
[
  1->4->5,
  1->3->4,
  2->6
]
将它们合并到一个有序链表中得到。
1->1->2->3->4->4->5->6
```

**示例 2：**

```
输入：lists = []
输出：[]
```

**示例 3：**

```
输入：lists = [[]]
输出：[]
```

**提示：**

* `k == lists.length`
* `0 <= k <= 10^4`
* `0 <= lists[i].length <= 500`
* `-10^4 <= lists[i][j] <= 10^4`
* `lists[i]` 按 **升序** 排列
* `lists[i].length` 的总和不超过 `10^4`

##### 分治合并：迭代

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function (lists) {
    const n = lists.length;
    // 两两合并：把 lists[0] 和 lists[1] 合并，合并后的链表保存在 lists[0] 中；把 lists[2] 和 lists[3] 合并，合并后的链表保存在 lists[2] 中；依此类推。
    // 四四合并：把 lists[0] 和 lists[2] 合并（相当于合并前四条链表），合并后的链表保存在 lists[0] 中；把 lists[4] 和 lists[6] 合并，合并后的链表保存在 lists[4] 中；依此类推。
    // 八八合并：把 lists[0] 和 lists[4] 合并（相当于合并前八条链表），合并后的链表保存在 lists[0] 中；把 lists[8] 和 lists[12] 合并，合并后的链表保存在 lists[8] 中；依此类推。
    // 依此类推，直到所有链表都合并到 lists[0] 中。最后返回 lists[0]。
    for (let step = 1; step < n; step *= 2) {
        for (let i = 0; i < n - step; i += step * 2) {
            lists[i] = mergeList(lists[i], lists[i + step]);
        }
    }
    return lists[0] ?? null;
};

const mergeList = (list1, list2) => {
    const dummy = new ListNode(0);
    let node1 = list1, node2 = list2, node = dummy;
    while (node1 && node2) {
        if (node1.val < node2.val) {
            node.next = node1;
            node1 = node1.next;
        } else {
            node.next = node2;
            node2 = node2.next;
        }
        node = node.next;
    }
    if (node1) node.next = node1;
    if (node2) node.next = node2;
    return dummy.next;
}
```

##### 分治合并

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function(lists) {
    // 分治合并
    const dfs = (i, j) => {
        if (i > j) return null;
        if (j == i) return lists[i];
        let m = Math.floor((j - i) / 2) + i;
        const left = dfs(i, m);
        const right = dfs(m + 1, j);
        return mergeList(left, right);
    }

    return dfs(0, lists.length - 1);
};

const mergeList = (list1, list2) => {
    const dummy = new ListNode(0);
    let node1 = list1, node2 = list2, node = dummy;
    while (node1 && node2) {
        if (node1.val < node2.val) {
            node.next = node1;
            node1 = node1.next;
        } else {
            node.next = node2;
            node2 = node2.next;
        }
        node = node.next;
    }
    if (node1) node.next = node1;
    if (node2) node.next = node2;
    return dummy.next;
}
```

##### 小根堆

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function(lists) {
    const dummy = new ListNode(0);
    const q = new MinPriorityQueue(q => q.val);
    for (let node of lists) {
        if (node) q.enqueue(node);
    }
    let curr = dummy;
    while (!q.isEmpty()) {
        const node = q.dequeue();
        curr.next = node;
        curr = curr.next;
        if (node?.next) {
            q.enqueue(node.next);
        }
    }
    return dummy.next;
};
```

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

##### 迭代：自底向上

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
var sortList = function (head) {
    if (!head || !head.next) return head;
    const len = getListLength(head); // 获取链表的长度
    const dummy = new ListNode(0, head);
    let step = 1; // 每次合并节点的步长
    while (step < len) {
        let newTail = dummy; // 新节点尾部，连接后续处理的节点
        let curr = dummy.next;
        while (curr) {
            let head1 = curr, head2 = splitList(curr, step); // 获取合并的节点头
            curr = splitList(head2, step); // 下一次循环的节点
            let [head, tail] = mergeList(head1, head2); // 归并两个链表
            newTail.next = head; // 将其与新链表连接
            newTail = tail;
        }
        step *= 2;
    }
    return dummy.next;
};

const getListLength = (list) => {
    let len = 0;
    while (list) {
        list = list.next;
        len++;
    }
    return len;
}

const splitList = (list, index) => {
    let node = list;
    for (let i = 0; i < index - 1; i++) {
        node = node?.next
    }
    let newHead = node?.next;
    if (node) node.next = null;
    return newHead
}

const mergeList = (list1, list2) => {
    const dummy = new ListNode(0);
    let node1 = list1, node2 = list2, node = dummy;
    while (node1 && node2) {
        if (node1.val < node2.val) {
            node.next = node1;
            node1 = node1.next;
        } else {
            node.next = node2;
            node2 = node2.next;
        }
        node = node.next;
    }
    if (node1) node.next = node1;
    if (node2) node.next = node2;
    while (node.next) {
        node = node.next;
    }
    return [dummy.next, node];
}
```

##### 归并排序：dfs

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
var sortList = function (head) {
    if (!head || !head.next) return head;
    const len = getListLength(head);
    const [head1, head2] = splitList(head, Math.floor(len / 2));
    const newHead1 = sortList(head1);
    const newHead2 = sortList(head2);
    return mergeList(newHead1, newHead2);
};

const getListLength = (list) => {
    let len = 0;
    while (list) {
        list = list.next;
        len++;
    }
    return len;
}

const splitList = (list, index) => {
    let node = list;
    for (let i = 0; i < index - 1; i++) {
        node = node.next
    }
    let head2 = node.next;
    node.next = null;
    return [list, head2]
}

const mergeList = (list1, list2) => {
    const dummy = new ListNode(0);
    let node1 = list1, node2 = list2, node = dummy;
    while (node1 && node2) {
        if (node1.val < node2.val) {
            node.next = node1;
            node1 = node1.next;
        } else {
            node.next = node2;
            node2 = node2.next;
        }
        node = node.next;
    }
    if (node1) node.next = node1;
    if (node2) node.next = node2;
    return dummy.next;
}
```

#### [138. 随机链表的复制](https://leetcode.cn/problems/copy-list-with-random-pointer/description/)

给你一个长度为 `n` 的链表，每个节点包含一个额外增加的随机指针 `random` ，该指针可以指向链表中的任何节点或空节点。

构造这个链表的 **[深拷贝](https://baike.baidu.com/item/深拷贝/22785317?fr=aladdin)**。 深拷贝应该正好由 `n` 个 **全新** 节点组成，其中每个新节点的值都设为其对应的原节点的值。新节点的 `next` 指针和 `random` 指针也都应指向复制链表中的新节点，并使原链表和复制链表中的这些指针能够表示相同的链表状态。**复制链表中的指针都不应指向原链表中的节点** 。

例如，如果原链表中有 `X` 和 `Y` 两个节点，其中 `X.random --> Y` 。那么在复制链表中对应的两个节点 `x` 和 `y` ，同样有 `x.random --> y` 。

返回复制链表的头节点。

用一个由 `n` 个节点组成的链表来表示输入/输出中的链表。每个节点用一个 `[val, random_index]` 表示：

* `val`：一个表示 `Node.val` 的整数。
* `random_index`：随机指针指向的节点索引（范围从 `0` 到 `n-1`）；如果不指向任何节点，则为  `null` 。

你的代码 **只** 接受原链表的头节点 `head` 作为传入参数。

**示例 1：**

![](https://assets.leetcode.cn/aliyun-lc-upload/uploads/2020/01/09/e1.png)

```
输入：head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
输出：[[7,null],[13,0],[11,4],[10,2],[1,0]]
```

**示例 2：**

![](https://assets.leetcode.cn/aliyun-lc-upload/uploads/2020/01/09/e2.png)

```
输入：head = [[1,1],[2,1]]
输出：[[1,1],[2,1]]
```

**示例 3：**

**![](https://assets.leetcode.cn/aliyun-lc-upload/uploads/2020/01/09/e3.png)**

```
输入：head = [[3,null],[3,0],[3,null]]
输出：[[3,null],[3,0],[3,null]]
```

**提示：**

* `0 <= n <= 1000`
* `-104 <= Node.val <= 104`
* `Node.random` 为 `null` 或指向链表中的节点。

##### 原节点后插入节点

```js
/**
 * // Definition for a _Node.
 * function _Node(val, next, random) {
 *    this.val = val;
 *    this.next = next;
 *    this.random = random;
 * };
 */

/**
 * @param {_Node} head
 * @return {_Node}
 */
var copyRandomList = function(head) {
    if (!head) return head;
    // 在每个节点后面插入一个复制节点
    for (let node = head; node; node = node.next.next) {
        node.next = new ListNode(node.val, node.next);
    }
    // 复制节点random
    for (let node = head; node; node = node.next.next) {
        node.next.random = node.random?.next ?? null;
    }
    // 分离节点
    let node = head, newHead = node.next, prev;
    while (node) {
        let next = node.next;
        node.next = next.next;
        if (prev) {
            prev.next = next;
        }
        prev = next;
        node = node.next;
    }
    return newHead;
};
```

