### 2025-12-19

#### [2. 两数相加](https://leetcode.cn/problems/add-two-numbers/description/)

给你两个 **非空** 的链表，表示两个非负的整数。它们每位数字都是按照 **逆序** 的方式存储的，并且每个节点只能存储 **一位** 数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

**示例 1：**

![](https://assets.leetcode.cn/aliyun-lc-upload/uploads/2021/01/02/addtwonumber1.jpg)

```
输入：l1 = [2,4,3], l2 = [5,6,4]
输出：[7,0,8]
解释：342 + 465 = 807.
```

**示例 2：**

```
输入：l1 = [0], l2 = [0]
输出：[0]
```

**示例 3：**

```
输入：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
输出：[8,9,9,9,0,0,0,1]
```

**提示：**

* 每个链表中的节点数在范围 `[1, 100]` 内
* `0 <= Node.val <= 9`
* 题目数据保证列表表示的数字不含前导零

##### 模拟

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
    const dummy = new ListNode();
    let node1 = l1, node2 = l2, node = dummy,
        carry = 0; // 进位
    while (node1 || node2 || carry) {
        let val = (node1?.val ?? 0) + (node2?.val ?? 0) + carry;
        carry = val >= 10 ? 1 : 0;
        val = val % 10;
        node.next = new ListNode(val);
        node = node.next;
        node1 = node1?.next, node2 = node2?.next;
    }
    return dummy.next;
};
```

#### [21. 合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/description/)

将两个升序链表合并为一个新的 **升序** 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/10/03/merge_ex1.jpg)

```
输入：l1 = [1,2,4], l2 = [1,3,4]
输出：[1,1,2,3,4,4]
```

**示例 2：**

```
输入：l1 = [], l2 = []
输出：[]
```

**示例 3：**

```
输入：l1 = [], l2 = [0]
输出：[0]
```

**提示：**

* 两个链表的节点数目范围是 `[0, 50]`
* `-100 <= Node.val <= 100`
* `l1` 和 `l2` 均按 **非递减顺序** 排列

##### 双指针

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function(list1, list2) {
    const dummy = new ListNode();
    let node1 = list1, node2 = list2, node = dummy;
    while (node1 && node2) {
        // 较小值的节点为next
        if (node1.val <= node2.val) {
            node.next = node1;
            node1 = node1.next;
        } else {
            node.next = node2;
            node2 = node2.next;
        }
        node = node.next;
    }
    // 剩余的节点
    node.next = node1 ? node1 : node2;
    return dummy.next;
};
```

#### [142. 环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/description/)

给定一个链表的头节点  `head` ，返回链表开始入环的第一个节点。 *如果链表无环，则返回 `null`。*

如果链表中有某个节点，可以通过连续跟踪 `next` 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 `pos` 来表示链表尾连接到链表中的位置（**索引从 0 开始**）。如果 `pos` 是 `-1`，则在该链表中没有环。**注意：`pos` 不作为参数进行传递**，仅仅是为了标识链表的实际情况。

**不允许修改** 链表。



**示例 1：**

![](https://assets.leetcode.com/uploads/2018/12/07/circularlinkedlist.png)

```
输入：head = [3,2,0,-4], pos = 1
输出：返回索引为 1 的链表节点
解释：链表中有一个环，其尾部连接到第二个节点。
```

**示例 2：**

![](https://assets.leetcode.cn/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist_test2.png)

```
输入：head = [1,2], pos = 0
输出：返回索引为 0 的链表节点
解释：链表中有一个环，其尾部连接到第一个节点。
```

**示例 3：**

![](https://assets.leetcode.cn/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist_test3.png)

```
输入：head = [1], pos = -1
输出：返回 null
解释：链表中没有环。
```

**提示：**

* 链表中节点的数目范围在范围 `[0, 104]` 内
* `-105 <= Node.val <= 105`
* `pos` 的值为 `-1` 或者链表中的一个有效索引

**进阶：**你是否可以使用 `O(1)` 空间解决此题？

##### 快慢指针

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var detectCycle = function(head) {
    let fast = head?.next?.next, slow = head?.next;
    while (fast != slow) {
        slow = slow?.next;
        fast = fast?.next?.next;
    }
    if (!fast) return null;
    fast = head;
    while (fast != slow) {
        fast = fast.next;
        slow = slow.next;
    }

    return fast;
};
```

##### 哈希

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var detectCycle = function(head) {
    const st = new Set();
    let node = head;
    while (node) {
        if (st.has(node)) return node;
        st.add(node);
        node = node.next;
    }
    return null;
};
```

#### [2092. 找出知晓秘密的所有专家](https://leetcode.cn/problems/find-all-people-with-secret/description/)

给你一个整数 `n` ，表示有 `n` 个专家从 `0` 到 `n - 1` 编号。另外给你一个下标从 0 开始的二维整数数组 `meetings` ，其中 `meetings[i] = [xi, yi, timei]` 表示专家 `xi` 和专家 `yi` 在时间 `timei` 要开一场会。一个专家可以同时参加 **多场会议** 。最后，给你一个整数 `firstPerson` 。

专家 `0` 有一个 **秘密** ，最初，他在时间 `0` 将这个秘密分享给了专家 `firstPerson` 。接着，这个秘密会在每次有知晓这个秘密的专家参加会议时进行传播。更正式的表达是，每次会议，如果专家 `xi` 在时间 `timei` 时知晓这个秘密，那么他将会与专家 `yi` 分享这个秘密，反之亦然。

秘密共享是 **瞬时发生** 的。也就是说，在同一时间，一个专家不光可以接收到秘密，还能在其他会议上与其他专家分享。

在所有会议都结束之后，返回所有知晓这个秘密的专家列表。你可以按 **任何顺序** 返回答案。

**示例 1：**

```
输入：n = 6, meetings = [[1,2,5],[2,3,8],[1,5,10]], firstPerson = 1
输出：[0,1,2,3,5]
解释：
时间 0 ，专家 0 将秘密与专家 1 共享。
时间 5 ，专家 1 将秘密与专家 2 共享。
时间 8 ，专家 2 将秘密与专家 3 共享。
时间 10 ，专家 1 将秘密与专家 5 共享。
因此，在所有会议结束后，专家 0、1、2、3 和 5 都将知晓这个秘密。
```

**示例 2：**

```
输入：n = 4, meetings = [[3,1,3],[1,2,2],[0,3,3]], firstPerson = 3
输出：[0,1,3]
解释：
时间 0 ，专家 0 将秘密与专家 3 共享。
时间 2 ，专家 1 与专家 2 都不知晓这个秘密。
时间 3 ，专家 3 将秘密与专家 0 和专家 1 共享。
因此，在所有会议结束后，专家 0、1 和 3 都将知晓这个秘密。
```

**示例 3：**

```
输入：n = 5, meetings = [[3,4,2],[1,2,1],[2,3,1]], firstPerson = 1
输出：[0,1,2,3,4]
解释：
时间 0 ，专家 0 将秘密与专家 1 共享。
时间 1 ，专家 1 将秘密与专家 2 共享，专家 2 将秘密与专家 3 共享。
注意，专家 2 可以在收到秘密的同一时间分享此秘密。
时间 2 ，专家 3 将秘密与专家 4 共享。
因此，在所有会议结束后，专家 0、1、2、3 和 4 都将知晓这个秘密。
```

**提示：**

* `2 <= n <= 105`
* `1 <= meetings.length <= 105`
* `meetings[i].length == 3`
* `0 <= xi, yi <= n - 1`
* `xi != yi`
* `1 <= timei <= 105`
* `1 <= firstPerson <= n - 1`

##### dfs

```js
/**
 * @param {number} n
 * @param {number[][]} meetings
 * @param {number} firstPerson
 * @return {number[]}
 */
var findAllPeople = function (n, meetings, firstPerson) {
    const tsToGraph = new Map();
    for (let [x, y, t] of meetings) {
        const g = tsToGraph.get(t) ?? new Map();
        const xnode = g.get(x) ?? [], ynode = g.get(y) ?? [];
        xnode.push(y), ynode.push(x);
        g.set(x, xnode), g.set(y, ynode);
        tsToGraph.set(t, g);
    }
    const ts = Array.from(tsToGraph.keys()).sort((a, b) => a - b);
    const ans = new Set([0, firstPerson]);
    const visited = new Set();
    const dfs = (i, fa, g) => {
        if (ans.size == n) return;
        visited.add(i);
        const next = g.get(i) ?? [];
        for (let y of next) {
            if (y == fa || visited.has(y)) continue;
            ans.add(y);
            dfs(y, i, g);
        }
    }

    for (let t of ts) {
        visited.clear();
        const g = tsToGraph.get(t);
        for (let i of ans.values()) {
            if (visited.has(i)) continue;
            dfs(i, -1, g);
        }
        if (ans.size == n) break;;
    }

    return Array.from(ans);
};
```

