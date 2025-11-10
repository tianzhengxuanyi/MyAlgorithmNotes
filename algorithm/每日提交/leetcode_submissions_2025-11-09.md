### 2025-11-09

#### [328. 奇偶链表](https://leetcode.cn/problems/odd-even-linked-list/description/)

给定单链表的头节点 `head` ，将所有索引为奇数的节点和索引为偶数的节点分别分组，保持它们原有的相对顺序，然后把偶数索引节点分组连接到奇数索引节点分组之后，返回重新排序的链表。

**第一个**节点的索引被认为是 **奇数** ， **第二个**节点的索引为 **偶数** ，以此类推。

请注意，偶数组和奇数组内部的相对顺序应该与输入时保持一致。

你必须在 `O(1)` 的额外空间复杂度和 `O(n)` 的时间复杂度下解决这个问题。

**示例 1:**

![](https://assets.leetcode.com/uploads/2021/03/10/oddeven-linked-list.jpg)

```
输入: head = [1,2,3,4,5]
输出: [1,3,5,2,4]
```

**示例 2:**

![](https://assets.leetcode.com/uploads/2021/03/10/oddeven2-linked-list.jpg)

```
输入: head = [2,1,3,5,6,4,7]
输出: [2,3,6,7,1,5,4]
```

**提示:**

* `n ==` 链表中的节点数
* `0 <= n <= 104`
* `-106 <= Node.val <= 106`

##### 双指针模拟

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
var oddEvenList = function (head) {
    if (!head || !head.next) return head;
    let oddHead = head, evenHead = head.next;
    let odd = oddHead, even = evenHead;
    while (odd.next && even.next) {
        odd.next = odd.next?.next;
        odd = odd.next;
        even.next = even.next?.next;
        even = even.next;
    }
    odd.next = evenHead;
    return oddHead;
};
```

#### [234. 回文链表](https://leetcode.cn/problems/palindrome-linked-list/description/)

给你一个单链表的头节点 `head` ，请你判断该链表是否为回文链表。如果是，返回 `true` ；否则，返回 `false` 。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/03/03/pal1linked-list.jpg)

```
输入：head = [1,2,2,1]
输出：true
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2021/03/03/pal2linked-list.jpg)

```
输入：head = [1,2]
输出：false
```

**提示：**

* 链表中节点数目在范围`[1, 105]` 内
* `0 <= Node.val <= 9`

**进阶：**你能否用 `O(n)` 时间复杂度和 `O(1)` 空间复杂度解决此题？

##### 快慢指针找到中间节点 + 反转链表

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
 * @return {boolean}
 */
var isPalindrome = function(head) {
    const m = middleNode(head); // 找到中间节点
    const reverseHead = reverseNode(m); // 反转后半部分
    let node = head, rNode = reverseHead;
    while (node && rNode) {
        if (node.val !== rNode.val) {
            return false;
        }
        node = node.next, rNode = rNode.next;
    }
    return true;
};

const middleNode = (head) => {
    let fast = slow = head;
    while (fast && fast.next) {
        fast = fast.next.next;
        slow = slow.next;
    }

    return slow;
}

const reverseNode = (head) => {
    let node = head, prev = null;

    while (node.next) {
        let next = node.next;
        node.next = prev;
        prev = node, node = next;
    }

    node.next = prev;

    return node;
}
```

#### [876. 链表的中间结点](https://leetcode.cn/problems/middle-of-the-linked-list/description/)

给你单链表的头结点 `head` ，请你找出并返回链表的中间结点。

如果有两个中间结点，则返回第二个中间结点。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/07/23/lc-midlist1.jpg)

```
输入：head = [1,2,3,4,5]
输出：[3,4,5]
解释：链表只有一个中间结点，值为 3 。
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2021/07/23/lc-midlist2.jpg)

```
输入：head = [1,2,3,4,5,6]
输出：[4,5,6]
解释：该链表有两个中间结点，值分别为 3 和 4 ，返回第二个结点。
```

**提示：**

* 链表的结点数范围是 `[1, 100]`
* `1 <= Node.val <= 100`

##### 快慢指针

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
var middleNode = function(head) {
    let fast = head, slow = head;
    while (fast?.next){
        fast = fast.next?.next;
        slow = slow.next;
    }

    return slow;
};
```

#### [61. 旋转链表](https://leetcode.cn/problems/rotate-list/description/)

给你一个链表的头节点 `head` ，旋转链表，将链表每个节点向右移动 `k`个位置。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/11/13/rotate1.jpg)

```
输入：head = [1,2,3,4,5], k = 2
输出：[4,5,1,2,3]
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2020/11/13/roate2.jpg)

```
输入：head = [0,1,2], k = 4
输出：[2,0,1]
```

**提示：**

* 链表中节点的数目在范围 `[0, 500]` 内
* `-100 <= Node.val <= 100`
* `0 <= k <= 2 * 109`

##### 将头和尾部连接，然后再newHead的前一个节点位置(n - 1 - (n % k))断开

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
 * @param {number} k
 * @return {ListNode}
 */
var rotateRight = function (head, k) {
    if (!head || !head.next) return head;
    let node = head;
    let tail, n = 0;
    while (node.next) {
        n++;
        node = node.next;
    }
    tail = node, n++;
    tail.next = head; // 于head形成环
    let idx = n - 1 - (k % n); // newHead的上一个节点
    node = head
    for (let i = 0; i < idx; i++) {
        node = node.next;
    }
    let newHead = node.next;
    node.next = null;
    return newHead;
};
```

##### 向前移动n-(k %n)次

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
 * @param {number} k
 * @return {ListNode}
 */
var rotateRight = function (head, k) {
    if (!head || !head.next) return head;
    let newHead = head, tail, len = 0;
    let node = head;
    while (node.next) {
        len++;
        node = node.next;
    }
    tail = node, len++;
    k = k % len;
    for (let i = 0; i < len - k; i++) {
        let next = newHead.next;
        newHead.next = null, tail.next = newHead;
        tail = newHead, newHead = next;
    }
    return newHead;
};
```

#### [2169. 得到 0 的操作数](https://leetcode.cn/problems/count-operations-to-obtain-zero/description/)

给你两个 **非负** 整数 `num1` 和 `num2` 。

每一步 **操作** 中，如果 `num1 >= num2` ，你必须用 `num1` 减 `num2` ；否则，你必须用 `num2` 减 `num1` 。

* 例如，`num1 = 5` 且 `num2 = 4` ，应该用 `num1` 减 `num2` ，因此，得到 `num1 = 1` 和 `num2 = 4` 。然而，如果 `num1 = 4`且 `num2 = 5` ，一步操作后，得到 `num1 = 4` 和 `num2 = 1` 。

返回使 `num1 = 0` 或 `num2 = 0` 的 **操作数** 。

**示例 1：**

```
输入：num1 = 2, num2 = 3
输出：3
解释：
- 操作 1 ：num1 = 2 ，num2 = 3 。由于 num1 < num2 ，num2 减 num1 得到 num1 = 2 ，num2 = 3 - 2 = 1 。
- 操作 2 ：num1 = 2 ，num2 = 1 。由于 num1 > num2 ，num1 减 num2 。
- 操作 3 ：num1 = 1 ，num2 = 1 。由于 num1 == num2 ，num1 减 num2 。
此时 num1 = 0 ，num2 = 1 。由于 num1 == 0 ，不需要再执行任何操作。
所以总操作数是 3 。
```

**示例 2：**

```
输入：num1 = 10, num2 = 10
输出：1
解释：
- 操作 1 ：num1 = 10 ，num2 = 10 。由于 num1 == num2 ，num1 减 num2 得到 num1 = 10 - 10 = 0 。
此时 num1 = 0 ，num2 = 10 。由于 num1 == 0 ，不需要再执行任何操作。
所以总操作数是 1 。
```

**提示：**

* `0 <= num1, num2 <= 105`

##### 辗转相除：假设固定num1大于num2，一直减去num2，直到num1小于num2，一共减去floor(num1 / num2)个num2，然后交换num1和num2。可以用辗转相除

```js
/**
 * @param {number} num1
 * @param {number} num2
 * @return {number}
 */
var countOperations = function(num1, num2) {
    let ans = 0;
    while (num2) {
        ans +=  Math.floor(num1 / num2);
        let t = num1 % num2;
        num1 = num2, num2 = t;
    }

    return ans;
};
```

