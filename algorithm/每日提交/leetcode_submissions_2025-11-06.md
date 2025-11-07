### 2025-11-06

#### [82. 删除排序链表中的重复元素 II](https://leetcode.cn/problems/remove-duplicates-from-sorted-list-ii/description/)

给定一个已排序的链表的头 `head` ， *删除原始链表中所有重复数字的节点，只留下不同的数字* 。返回 *已排序的链表* 。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/01/04/linkedlist1.jpg)

```
输入：head = [1,2,3,3,4,4,5]
输出：[1,2,5]
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2021/01/04/linkedlist2.jpg)

```
输入：head = [1,1,1,2,3]
输出：[2,3]
```

**提示：**

* 链表中节点数目在范围 `[0, 300]` 内
* `-100 <= Node.val <= 100`
* 题目数据保证链表已经按升序 **排列**

##### 迭代，删除链表

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
var deleteDuplicates = function (head) {
    const dummy = new ListNode(-101, head);
    let node = dummy;

    while (node && node.next) {
        let next = node.next;
        if (next.next && next.val == next.next.val) {
            while (next.next && next.val == next.next.val) {
                next = next.next;
            }
            node.next = next.next;
        } else {
            node = next;
        }
    }

    return dummy.next;
};
```

#### [83. 删除排序链表中的重复元素](https://leetcode.cn/problems/remove-duplicates-from-sorted-list/description/)

给定一个已排序的链表的头 `head` ， *删除所有重复的元素，使每个元素只出现一次* 。返回 *已排序的链表* 。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/01/04/list1.jpg)

```
输入：head = [1,1,2]
输出：[1,2]
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2021/01/04/list2.jpg)

```
输入：head = [1,1,2,3,3]
输出：[1,2,3]
```

**提示：**

* 链表中节点数目在范围 `[0, 300]` 内
* `-100 <= Node.val <= 100`
* 题目数据保证链表已经按升序 **排列**

##### 迭代

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
var deleteDuplicates = function(head) {
    let node = head;
    while (node && node.next) {
        let next = node.next;
        if (node.val == next.val) {
            node.next = next.next;
        } else {
            node = next;
        }
    }

    return head;
};
```

#### [203. 移除链表元素](https://leetcode.cn/problems/remove-linked-list-elements/description/)

给你一个链表的头节点 `head` 和一个整数 `val` ，请你删除链表中所有满足 `Node.val == val` 的节点，并返回 **新的头节点** 。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/03/06/removelinked-list.jpg)

```
输入：head = [1,2,6,3,4,5,6], val = 6
输出：[1,2,3,4,5]
```

**示例 2：**

```
输入：head = [], val = 1
输出：[]
```

**示例 3：**

```
输入：head = [7,7,7,7], val = 7
输出：[]
```

**提示：**

* 列表中的节点数目在范围 `[0, 104]` 内
* `1 <= Node.val <= 50`
* `0 <= val <= 50`

##### 迭代

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
 * @param {number} val
 * @return {ListNode}
 */
var removeElements = function(head, val) {
    const dummy = new ListNode(-1, head);
    let node = dummy;
    while (node.next) {
        let next = node.next;
        if (next.val == val)  {
            node.next = next.next;
        } else {
            node = next;
        }
    }

    return dummy.next;
};
```

#### [817. 链表组件](https://leetcode.cn/problems/linked-list-components/description/)

给定链表头结点 `head`，该链表上的每个结点都有一个 **唯一的整型值** 。同时给定列表 `nums`，该列表是上述链表中整型值的一个子集。

返回列表 `nums` 中组件的个数，这里对组件的定义为：链表中一段最长连续结点的值（该值必须在列表 `nums` 中）构成的集合。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/07/22/lc-linkedlistcom1.jpg)

```
输入: head = [0,1,2,3], nums = [0,1,3]
输出: 2
解释: 链表中,0 和 1 是相连接的，且 nums 中不包含 2，所以 [0, 1] 是 nums 的一个组件，同理 [3] 也是一个组件，故返回 2。
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2021/07/22/lc-linkedlistcom2.jpg)

```
输入: head = [0,1,2,3,4], nums = [0,3,1,4]
输出: 2
解释: 链表中，0 和 1 是相连接的，3 和 4 是相连接的，所以 [0, 1] 和 [3, 4] 是两个组件，故返回 2。
```

**提示：**

* 链表中节点数为`n`
* `1 <= n <= 104`
* `0 <= Node.val < n`
* `Node.val` 中所有值 **不同**
* `1 <= nums.length <= n`
* `0 <= nums[i] < n`
* `nums` 中所有值 **不同**

##### 组件的起始位置时ans加一，最后结束时要判断last是否有值额外再加1

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
 * @param {number[]} nums
 * @return {number}
 */
var numComponents = function(head, nums) {
    const set = new Set(nums);
    let ans = 0, last;
    for (let node = head; node; node = node.next) {
        const val = node.val;
        if (set.has(val)) {
            last = node;
        } else {
            if (last) {
                ans++;
                last = null;
            }
        }
    }
    if (last) {
        ans++;
    }

    return ans;
};
```

#### [725. 分隔链表](https://leetcode.cn/problems/split-linked-list-in-parts/description/)

给你一个头结点为 `head` 的单链表和一个整数 `k` ，请你设计一个算法将链表分隔为 `k` 个连续的部分。

每部分的长度应该尽可能的相等：任意两部分的长度差距不能超过 1 。这可能会导致有些部分为 null 。

这 `k` 个部分应该按照在链表中出现的顺序排列，并且排在前面的部分的长度应该大于或等于排在后面的长度。

返回一个由上述 `k` 部分组成的数组。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/06/13/split1-lc.jpg)

```
输入：head = [1,2,3], k = 5
输出：[[1],[2],[3],[],[]]
解释：
第一个元素 output[0] 为 output[0].val = 1 ，output[0].next = null 。
最后一个元素 output[4] 为 null ，但它作为 ListNode 的字符串表示是 [] 。
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2021/06/13/split2-lc.jpg)

```
输入：head = [1,2,3,4,5,6,7,8,9,10], k = 3
输出：[[1,2,3,4],[5,6,7],[8,9,10]]
解释：
输入被分成了几个连续的部分，并且每部分的长度相差不超过 1 。前面部分的长度大于等于后面部分的长度。
```

**提示：**

* 链表中节点的数目在范围 `[0, 1000]`
* `0 <= Node.val <= 1000`
* `1 <= k <= 50`

##### 模拟，链表长度与k的余数为m，前m个长度加一

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
 * @return {ListNode[]}
 */
var splitListToParts = function (head, k) {
    let len = 0, node = head;
    while (node) {
        node = node.next;
        len++;
    }
    let m = len % k, int = Math.floor(len / k);
    const ans = Array(k).fill(null);
    node = head
    for (let i = 0; i < k; i++) {
        let cnt = m > 0 ? int + 1 : int;
        if (cnt == 0) {
            break;
        }
        ans[i] = node;
        for (let j = 1; j < cnt; j++) {
            node = node.next;
        }
        let next = node.next;
        node.next = null;
        node = next;
        m--;
    }

    return ans;
};
```

#### [3607. 电网维护](https://leetcode.cn/problems/power-grid-maintenance/description/)

给你一个整数 `c`，表示 `c` 个电站，每个电站有一个唯一标识符 `id`，从 1 到 `c` 编号。

这些电站通过 `n` 条 **双向**电缆互相连接，表示为一个二维数组 `connections`，其中每个元素 `connections[i] = [ui, vi]` 表示电站 `ui` 和电站 `vi` 之间的连接。直接或间接连接的电站组成了一个 **电网**。

最初，**所有**电站均处于在线（正常运行）状态。

另给你一个二维数组 `queries`，其中每个查询属于以下 **两种类型之一**：

* `[1, x]`：请求对电站 `x` 进行维护检查。如果电站 `x` 在线，则它自行解决检查。如果电站 `x` 已离线，则检查由与 `x` 同一 **电网**中 **编号最小**的在线电站解决。如果该电网中 **不存在**任何 **在线**电站，则返回 -1。
* `[2, x]`：电站 `x` 离线（即变为非运行状态）。

返回一个整数数组，表示按照查询中出现的顺序，所有类型为 `[1, x]` 的查询结果。

**注意：**电网的结构是固定的；离线（非运行）的节点仍然属于其所在的电网，且离线操作不会改变电网的连接性。

**示例 1：**

**输入：** c = 5, connections = [[1,2],[2,3],[3,4],[4,5]], queries = [[1,3],[2,1],[1,1],[2,2],[1,2]]

**输出：** [3,2,3]

**解释：**

![](https://assets.leetcode.com/uploads/2025/04/15/powergrid.jpg)

* 最初，所有电站 `{1, 2, 3, 4, 5}` 都在线，并组成一个电网。
* 查询 `[1,3]`：电站 3 在线，因此维护检查由电站 3 自行解决。
* 查询 `[2,1]`：电站 1 离线。剩余在线电站为 `{2, 3, 4, 5}`。
* 查询 `[1,1]`：电站 1 离线，因此检查由电网中编号最小的在线电站解决，即电站 2。
* 查询 `[2,2]`：电站 2 离线。剩余在线电站为 `{3, 4, 5}`。
* 查询 `[1,2]`：电站 2 离线，因此检查由电网中编号最小的在线电站解决，即电站 3。

**示例 2：**

**输入：** c = 3, connections = [], queries = [[1,1],[2,1],[1,1]]

**输出：** [1,-1]

**解释：**

* 没有连接，因此每个电站是一个独立的电网。
* 查询 `[1,1]`：电站 1 在线，且属于其独立电网，因此维护检查由电站 1 自行解决。
* 查询 `[2,1]`：电站 1 离线。
* 查询 `[1,1]`：电站 1 离线，且其电网中没有其他电站，因此结果为 -1。

**提示：**

* `1 <= c <= 105`
* `0 <= n == connections.length <= min(105, c * (c - 1) / 2)`
* `connections[i].length == 2`
* `1 <= ui, vi <= c`
* `ui != vi`
* `1 <= queries.length <= 2 * 105`
* `queries[i].length == 2`
* `queries[i][0]` 为 1 或 2。
* `1 <= queries[i][1] <= c`

##### 并查集维护联通块，优先队列维护每个联通块中最小的编号，offline set维护离线电站做懒删除标记

```js
/**
 * @param {number} c
 * @param {number[][]} connections
 * @param {number[][]} queries
 * @return {number[]}
 */
var processQueries = function (c, connections, queries) {
    const uf = new UnionFind(c + 1);
    for (const [x, y] of connections) {
        uf.union(x, y);
    }
    const rootToPq = new Map();
    for (let i = 1; i <= c; i++) {
        const root = uf.find(i);
        const pq =  rootToPq.get(root) ?? new MinPriorityQueue();
        pq.enqueue(i);
        rootToPq.set(root, pq);
    }
    const offline = new Set(), ans = [];
    for (let [type, x] of queries) {
        if (type == 1) {
            if (offline.has(x)) {
                const pq = rootToPq.get(uf.find(x));
                while (!pq.isEmpty() && offline.has(pq.front())) { // 删除已经离线的电站
                    pq.dequeue();
                }
                if (pq.isEmpty()) { // 联通块中所有电站都离线
                    ans.push(-1);
                } else { // 最小编号的电站处理
                    ans.push(pq.front());
                }
            } else { // 当前电站没有离线，自己处理
                ans.push(x);
            }
        } else {
            offline.add(x); // 懒删除标记
        }
    }

    return ans;
};

class UnionFind {
    constructor(n) {
        this.fa = Array.from({length: n}, (_, i) => i);
    }

    find(x) {
        if (x !== this.fa[x]) {
            this.fa[x] = this.find(this.fa[x]);
        }
        return this.fa[x];
    }

    union(x, y) {
        let fx = this.find(x), fy = this.find(y);
        if (fx == fy) return;
        if (fx < fy) {
            this.fa[fy] = fx;
        } else {
            this.fa[fx] = fy;
        }
    }
}
```

