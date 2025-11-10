### 2025-11-07

#### [19. 删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/description/)

给你一个链表，删除链表的倒数第 `n`个结点，并且返回链表的头结点。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/10/03/remove_ex1.jpg)

```
输入：head = [1,2,3,4,5], n = 2
输出：[1,2,3,5]
```

**示例 2：**

```
输入：head = [1], n = 1
输出：[]
```

**示例 3：**

```
输入：head = [1,2], n = 1
输出：[1]
```

**提示：**

* 链表中结点的数目为 `sz`
* `1 <= sz <= 30`
* `0 <= Node.val <= 100`
* `1 <= n <= sz`

**进阶：**你能尝试使用一趟扫描实现吗？

##### 两个指针，差n - 1个节点，first节点到结尾，second节点为倒数第n+1个节点

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
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function (head, n) {
    if (!head || !head.next) return null;
    let dummy = new ListNode(-1, head);
    let first = dummy, second = dummy;

    for (let i = 0; i < n; i++) {
        first = first.next;
    }
    while (first?.next) {
        first = first.next;
        second = second.next;
    }
    second.next = second?.next?.next ?? null;
    return dummy.next;
};
```

##### 先遍历出链表长度，再删除节点

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
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function(head, n) {
    if (!head || !head.next) return null;
    const dummy = new ListNode(-1, head);
    let cnt = 0;
    for (let node = dummy; node; node = node.next) {
        cnt++;
    }
    let curr = dummy;
    for (let i = 0; i < cnt - n - 1; i++) {
        curr = curr.next;
    }
    curr.next = curr?.next?.next ?? null;
    return dummy.next;
};
```

#### [92. 反转链表 II](https://leetcode.cn/problems/reverse-linked-list-ii/description/)

给你单链表的头指针 `head` 和两个整数 `left` 和 `right` ，其中 `left <= right` 。请你反转从位置 `left` 到位置 `right` 的链表节点，返回 **反转后的链表** 。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/02/19/rev2ex2.jpg)

```
输入：head = [1,2,3,4,5], left = 2, right = 4
输出：[1,4,3,2,5]
```

**示例 2：**

```
输入：head = [5], left = 1, right = 1
输出：[5]
```

**提示：**

* 链表中节点数目为 `n`
* `1 <= n <= 500`
* `-500 <= Node.val <= 500`
* `1 <= left <= right <= n`

**进阶：** 你可以使用一趟扫描完成反转吗？

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
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
var reverseBetween = function (head, left, right) {
    const dummy = new ListNode(-501, head);
    let curr = dummy, leftTail;
    let i = 0;
    for (; i < left; i++) {
        leftTail = curr;
        curr = curr.next;
    }

    let reverseHead = null, reverseTail = curr;
    for (; i <= right; i++) {
        const next = curr.next;
        curr.next = reverseHead; // 将当前节点连接已反转的头部
        reverseHead = curr; // 当前节点作为已反转的头部
        curr = next;
    }
    leftTail.next = reverseHead; // 左侧连接反转后的头
    reverseTail.next = curr; // 反转后的尾部连接curr

    return dummy.next;
};
```

#### [206. 反转链表](https://leetcode.cn/problems/reverse-linked-list/description/)

给你单链表的头节点 `head` ，请你反转链表，并返回反转后的链表。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/02/19/rev1ex1.jpg)

```
输入：head = [1,2,3,4,5]
输出：[5,4,3,2,1]
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2021/02/19/rev1ex2.jpg)

```
输入：head = [1,2]
输出：[2,1]
```

**示例 3：**

```
输入：head = []
输出：[]
```

**提示：**

* 链表中节点的数目范围是 `[0, 5000]`
* `-5000 <= Node.val <= 5000`

**进阶：**链表可以选用迭代或递归方式完成反转。你能否用两种方法解决这道题？

##### 递归

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
var reverseList = function (head) {
    if (!head || !head.next) return head;
    const dfs = (node) => {
        if (!node.next) return [node, node];
        const [newHead, newTail] = dfs(node.next);
        newTail.next = node;
        node.next = null;
        return [newHead, node];
    }

    return dfs(head)[0];
};
```

##### 模拟 迭代

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
var reverseList = function (head) {
    if (!head || !head.next) return head;

    let tail = null, curr = head;
    while (curr) {
        const next = curr.next;
        curr.next = tail;
        tail = curr;
        curr = next;
    }

    return tail;
};
```

#### [147. 对链表进行插入排序](https://leetcode.cn/problems/insertion-sort-list/description/)

给定单个链表的头 `head` ，使用 **插入排序** 对链表进行排序，并返回 *排序后链表的头* 。

**插入排序** 算法的步骤:

1. 插入排序是迭代的，每次只移动一个元素，直到所有元素可以形成一个有序的输出列表。
2. 每次迭代中，插入排序只从输入数据中移除一个待排序的元素，找到它在序列中适当的位置，并将其插入。
3. 重复直到所有输入数据插入完为止。

下面是插入排序算法的一个图形示例。部分排序的列表(黑色)最初只包含列表中的第一个元素。每次迭代时，从输入数据中删除一个元素(红色)，并就地插入已排序的列表中。

对链表进行插入排序。

![](https://pic.leetcode.cn/1724130387-qxfMwx-Insertion-sort-example-300px.gif)

**示例 1：**

![](https://pic.leetcode.cn/1724130414-QbPAjl-image.png)

```
输入: head = [4,2,1,3]
输出: [1,2,3,4]
```

**示例 2：**

![](https://pic.leetcode.cn/1724130432-zoOvdI-image.png)

```
输入: head = [-1,5,3,4,0]
输出: [-1,0,3,4,5]
```

**提示：**

* 列表中的节点数在 `[1, 5000]`范围内
* `-5000 <= Node.val <= 5000`

##### 模拟插入排序，需记录lastSorted、curr、next三个节点，每次从dummy遍历查找插入点

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
var insertionSortList = function (head) {
    const dummy = new ListNode(-5001, head);
    let lastSorted = dummy, // 已排序部分的最后一个节点
        curr = lastSorted.next, // 当前待排节点
        next = curr.next;
    while (curr) {
        if (curr.val >= lastSorted.val) { // 待排节点大于最后一个已排序节点，不需要插入
            lastSorted = curr, curr = next, next = next?.next;
            continue;
        }
        for (let node = dummy; node != curr; node = node.next) { // 从头查找插入点
            if (node.next.val >= curr.val && node.next !== curr) { // 找到插入点
                let insertNext = node.next; // 存储插入点的下一个节点
                node.next = curr;
                curr.next = insertNext; // 将待排节点插入 插入点和插入点下一个节点中间
                lastSorted.next = next; // 补上待排节点的位置
                break;
            }
        }
        curr = next, next = next?.next;
    }
    return dummy.next;
};
```

#### [2807. 在链表中插入最大公约数](https://leetcode.cn/problems/insert-greatest-common-divisors-in-linked-list/description/)

给你一个链表的头 `head` ，每个结点包含一个整数值。

在相邻结点之间，请你插入一个新的结点，结点值为这两个相邻结点值的 **最大公约数** 。

请你返回插入之后的链表。

两个数的 **最大公约数** 是可以被两个数字整除的最大正整数。

**示例 1：**

![](https://assets.leetcode.com/uploads/2023/07/18/ex1_copy.png)

```
输入：head = [18,6,10,3]
输出：[18,6,6,2,10,1,3]
解释：第一幅图是一开始的链表，第二幅图是插入新结点后的图（蓝色结点为新插入结点）。
- 18 和 6 的最大公约数为 6 ，插入第一和第二个结点之间。
- 6 和 10 的最大公约数为 2 ，插入第二和第三个结点之间。
- 10 和 3 的最大公约数为 1 ，插入第三和第四个结点之间。
所有相邻结点之间都插入完毕，返回链表。
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2023/07/18/ex2_copy1.png)

```
输入：head = [7]
输出：[7]
解释：第一幅图是一开始的链表，第二幅图是插入新结点后的图（蓝色结点为新插入结点）。
没有相邻结点，所以返回初始链表。
```

**提示：**

* 链表中结点数目在 `[1, 5000]` 之间。
* `1 <= Node.val <= 1000`

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
 * @param {ListNode} head
 * @return {ListNode}
 */
var insertGreatestCommonDivisors = function(head) {
    let node = head;
    while (node.next) {
        const next = node.next;
        const newVal = gcd(node.val, next.val);
        node.next = new ListNode(newVal, next);
        node = next;
    }

    return head;
};

const gcd = (x, y) => {
    while (y) {
        let t = x % y;
        x = y; y = t;
    }

    return x;
}
```

#### [237. 删除链表中的节点](https://leetcode.cn/problems/delete-node-in-a-linked-list/description/)

有一个单链表的 `head`，我们想删除它其中的一个节点 `node`。

给你一个需要删除的节点 `node` 。你将 **无法访问** 第一个节点  `head`。

链表的所有值都是 **唯一的**，并且保证给定的节点 `node` 不是链表中的最后一个节点。

删除给定的节点。注意，删除节点并不是指从内存中删除它。这里的意思是：

* 给定节点的值不应该存在于链表中。
* 链表中的节点数应该减少 1。
* `node` 前面的所有值顺序相同。
* `node` 后面的所有值顺序相同。

**自定义测试：**

* 对于输入，你应该提供整个链表 `head` 和要给出的节点 `node`。`node` 不应该是链表的最后一个节点，而应该是链表中的一个实际节点。
* 我们将构建链表，并将节点传递给你的函数。
* 输出将是调用你函数后的整个链表。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/09/01/node1.jpg)

```
输入：head = [4,5,1,9], node = 5
输出：[4,1,9]
解释：指定链表中值为 5 的第二个节点，那么在调用了你的函数之后，该链表应变为 4 -> 1 -> 9
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2020/09/01/node2.jpg)

```
输入：head = [4,5,1,9], node = 1
输出：[4,5,9]
解释：指定链表中值为 1 的第三个节点，那么在调用了你的函数之后，该链表应变为 4 -> 5 -> 9
```

**提示：**

* 链表中节点的数目范围是 `[2, 1000]`
* `-1000 <= Node.val <= 1000`
* 链表中每个节点的值都是 **唯一** 的
* 需要删除的节点 `node` 是 **链表中的节点** ，且 **不是末尾节点**

##### 修改node.val为下一个节点，并删除下一个节点

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} node
 * @return {void} Do not return anything, modify node in-place instead.
 */
var deleteNode = function (node) {
    node.val = node.next.val;
    node.next = node.next.next;
};
```

##### 迭代修改节点val为下一个节点

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} node
 * @return {void} Do not return anything, modify node in-place instead.
 */
var deleteNode = function (node) {
    while (node.next) {
        node.val = node.next.val;
        if (!node.next.next) {
            node.next = null;
            return;
        }
        node = node.next;
    }

};
```

#### [2528. 最大化城市的最小电量](https://leetcode.cn/problems/maximize-the-minimum-powered-city/description/)

给你一个下标从 **0** 开始长度为 `n` 的整数数组 `stations` ，其中 `stations[i]` 表示第 `i` 座城市的供电站数目。

每个供电站可以在一定 **范围** 内给所有城市提供电力。换句话说，如果给定的范围是 `r` ，在城市 `i` 处的供电站可以给所有满足 `|i - j| <= r` 且 `0 <= i, j <= n - 1` 的城市 `j` 供电。

* `|x|` 表示 `x` 的 **绝对值** 。比方说，`|7 - 5| = 2` ，`|3 - 10| = 7` 。

一座城市的 **电量** 是所有能给它供电的供电站数目。

政府批准了可以额外建造 `k` 座供电站，你需要决定这些供电站分别应该建在哪里，这些供电站与已经存在的供电站有相同的供电范围。

给你两个整数 `r` 和 `k` ，如果以最优策略建造额外的发电站，返回所有城市中，最小电量的最大值是多少。

这 `k` 座供电站可以建在多个城市。

**示例 1：**

```
输入：stations = [1,2,4,5,0], r = 1, k = 2
输出：5
解释：
最优方案之一是把 2 座供电站都建在城市 1 。
每座城市的供电站数目分别为 [1,4,4,5,0] 。
- 给城市 0 供电的供电站数目为 1 + 4 = 5 。
- 给城市 1 供电的供电站数目为 1 + 4 + 4 = 9 。
- 给城市 2 供电的供电站数目为 4 + 4 + 5 = 13 。
- 给城市 3 供电的供电站数目为 5 + 4 = 9 。
- 给城市 4 供电的供电站数目为 5 + 0 = 5 。
供电站数目最少是 5 。
无法得到更优解，所以我们返回 5 。
```

**示例 2：**

```
输入：stations = [4,4,4,4], r = 0, k = 3
输出：4
解释：
无论如何安排，总有一座城市的供电站数目是 4 ，所以最优解是 4 。
```

**提示：**

* `n == stations.length`
* `1 <= n <= 105`
* `0 <= stations[i] <= 105`
* `0 <= r <= n - 1`
* `0 <= k <= 109`

##### 二分、前缀和、贪心、差分数组

```js
/**
 * @param {number[]} stations
 * @param {number} r
 * @param {number} k
 * @return {number}
 */
var maxPower = function (stations, r, k) {
    const n = stations.length;
    let mx = 0, mn = Infinity, sum = 0, power = Array(n).fill(0);
    for (let i = 0; i < n + r; i++) {
        sum += stations[i] ?? 0;
        mx = Math.max(mx, sum);
        if (i >= r) {
            power[i - r] = sum;
            mn = Math.min(mn, sum);
        }
        if (i >= 2 * r) {
            sum -= stations[i - 2 * r];
        }
    }

    let left = mn, right = mx + k;

    const check = (m) => {
        const diff = Array(n + 2).fill(0);
        for (let i = 0; i < n; i++) {
            diff[i] += power[i];
            diff[i + 1] -= power[i];
        }
        let need = 0, prefix = 0;
        for (let i = 0; i < n; i++) {
            prefix += diff[i];
            if (prefix < m) {
                let d = m - prefix;
                diff[i] += d;
                diff[Math.min(i + 2 * r + 1, n)] -= d;
                need += d;
                prefix = m;
            }
            if (need > k) return false;
        }
        return need <= k;
    }

    while (left <= right) {
        let m = Math.floor((right - left) / 2) + left;
        if (check(m)) {
            left = m + 1;
        } else {
            right = m - 1;
        }
    }

    return right;
};
```

