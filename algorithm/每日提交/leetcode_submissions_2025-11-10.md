### 2025-11-10

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

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/01/09/e1.png)

```
输入：head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
输出：[[7,null],[13,0],[11,4],[10,2],[1,0]]
```

**示例 2：**

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/01/09/e2.png)

```
输入：head = [[1,1],[2,1]]
输出：[[1,1],[2,1]]
```

**示例 3：**

**![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/01/09/e3.png)**

```
输入：head = [[3,null],[3,0],[3,null]]
输出：[[3,null],[3,0],[3,null]]
```

**提示：**

* `0 <= n <= 1000`
* `-104 <= Node.val <= 104`
* `Node.random` 为 `null` 或指向链表中的节点。

##### 在原节点后面插入节点，random指向原节点的random，然后遍历copy节点，将random指向next节点（原节点的复制节点），最后将原节点和复制节点分离

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
    if (!head) return null;
    for (let node = head; node; node = node.next.next) {
        const next = node.next, random = node.random;
        node.next = new _Node(node.val, next, random);
    }
    for (let node = head.next; node; node = node.next?.next) {
        node.random = node.random?.next ?? null;
    }
    let node1 = head;
    let copyHead = head.next, node2 = copyHead;
    while (node1) {
        const node1Next = node1.next?.next;
        const node2Next = node2.next?.next;
        node1.next = node1Next ?? null, node2.next = node2Next ?? null;
        node1 = node1Next, node2 = node2Next;
    }

    return copyHead;
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

##### 双向链表，添加dummy，简化处理

```js
function ListNode(key, val, prev, next) {
    this.key = key;
    this.val = val;
    this.next = next ? next : null;
    this.prev = prev ? prev : null;
}

/**
 * @param {number} capacity
 */
var LRUCache = function (capacity) {
    this.keyToNode = new Map();
    this.capacity = capacity;
    this.dummy = new ListNode(-1, -1);
    this.dummy.next = this.dummy;
    this.dummy.prev = this.dummy;
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function (key) {
    if (!this.keyToNode.has(key)) return -1;
    const node = this.keyToNode.get(key);
    this.remove(node);
    this.pushFront(node);
    return node.val;
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function (key, value) {
    if (this.keyToNode.has(key)) {
        const node = this.keyToNode.get(key);
        node.val = value;
        this.remove(node);
        this.pushFront(node);
    } else {
        if (this.keyToNode.size >= this.capacity) {
            const LRUNode = this.dummy.prev;
            this.keyToNode.delete(LRUNode.key);
            this.remove(LRUNode);
        }
        const newNode = new ListNode(key, value, this.tail);
        this.keyToNode.set(key, newNode);
        this.pushFront(newNode);
    }
};

LRUCache.prototype.pushFront = function (node) {
    node.prev = this.dummy;
    node.next = this.dummy.next;
    this.dummy.next.prev = node;
    this.dummy.next = node;
}

LRUCache.prototype.remove = function (node) {
    const next = node.next, prev = node.prev;
    prev.next = next, next.prev = prev;
    node.next = null, node.prev = null;
}

/** 
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
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

##### dummy哨兵节点

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
    const dummy = new ListNode(0);
    let curr = dummy;
    while (list1 && list2) {
        if (list1.val < list2.val) {
            curr.next = list1;
            list1 = list1.next;
        } else {
            curr.next = list2;
            list2 = list2.next;
        }
        curr = curr.next;
    }
    curr.next = list1 ? list1 : list2;
    return dummy.next;
};
```

#### [445. 两数相加 II](https://leetcode.cn/problems/add-two-numbers-ii/description/)

给你两个 **非空** 链表来代表两个非负整数。数字最高位位于链表开始位置。它们的每个节点只存储一位数字。将这两数相加会返回一个新的链表。

你可以假设除了数字 0 之外，这两个数字都不会以零开头。

**示例1：**

![](https://pic.leetcode-cn.com/1626420025-fZfzMX-image.png)

```
输入：l1 = [7,2,4,3], l2 = [5,6,4]
输出：[7,8,0,7]
```

**示例2：**

```
输入：l1 = [2,4,3], l2 = [5,6,4]
输出：[8,0,7]
```

**示例3：**

```
输入：l1 = [0], l2 = [0]
输出：[0]
```

**提示：**

* 链表的长度范围为 `[1, 100]`
* `0 <= node.val <= 9`
* 输入数据保证链表代表的数字无前导 0

**进阶：**如果输入链表不能翻转该如何解决？

##### 栈

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
var addTwoNumbers = function(l1, l2) {
    const st1 = [], st2 = [];
    while (l1) {
        st1.push(l1);
        l1 = l1.next;
    }
    while (l2) {
        st2.push(l2);
        l2 = l2.next;
    }

    let carry = 0, next = null;
    while (st1.length || st2.length || carry) {
        let val = carry;
        if (st1.length) {
            val += st1.pop().val;
        }
        if (st2.length) {
            val += st2.pop().val;
        }
        carry = val >= 10 ? 1 :0;
        next = new ListNode(val % 10, next);
    }

    return next;
};
```

##### 翻转链表 + 两数相加

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
var addTwoNumbers = function(l1, l2) {
    l1 = reverseNode(l1), l2 = reverseNode(l2);
    const dummy = new ListNode(0);
    let node1 = l1, node2 = l2, carry = 0, curr = dummy;
    while (node1 || node2 || carry) {
        let val = carry;
        if (node1) {
            val += node1.val;
            node1 = node1.next;
        }
        if (node2) {
            val += node2.val;
            node2 = node2.next;
        }
        carry = val >= 10 ? 1 : 0;
        curr.next = new ListNode(val % 10);
        curr = curr.next;
    }

    return reverseNode(dummy.next)
};

const reverseNode = (head) => {
    let curr = head, prev = null;
    while (curr) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}
```

#### [2. 两数相加](https://leetcode.cn/problems/add-two-numbers/description/)

给你两个 **非空** 的链表，表示两个非负的整数。它们每位数字都是按照 **逆序** 的方式存储的，并且每个节点只能存储 **一位** 数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

**示例 1：**

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2021/01/02/addtwonumber1.jpg)

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

##### 新建节点

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
var addTwoNumbers = function(l1, l2) {
    const dummy = new ListNode(0);
    let node1 = l1, node2 = l2, curr = dummy, carry = 0;
    while (node1 || node2 || carry) {
        let val = carry;
        if (node1) {
            val += node1.val;
            node1 = node1.next;
        }
        if (node2) {
            val += node2.val;
            node2 = node2.next;
        }
        carry = val >= 10 ? 1 : 0;
        curr.next = new ListNode(val % 10);
        curr = curr.next;
    }

    return dummy.next;
};
```

##### 原地修改

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
    const newHead = l1;
    let node1 = l1, node2 = l2, addOne = 0, prev;

    for (; node1 && node2; prev = node1, node1 = node1.next, node2 = node2.next) {
        let newVal = node1.val + (node2?.val ?? 0) + addOne;
        addOne = newVal >= 10 ? 1 : 0;
        node1.val = newVal % 10;
    }

    if (node1) {
        for (; node1; prev = node1, node1 = node1.next) {
            let newVal = node1.val + addOne;
            addOne = newVal >= 10 ? 1 : 0;
            node1.val = newVal % 10;
        }
    }

    if (node2) {
        prev.next = node2;
        for (; node2; prev = node2, node2 = node2.next) {
            let newVal = node2.val + addOne;
            addOne = newVal >= 10 ? 1 : 0;
            node2.val = newVal % 10;
        }
    }

    if (addOne) {
        prev.next = new ListNode(1)
    }

    return newHead;

};
```

#### [86. 分隔链表](https://leetcode.cn/problems/partition-list/description/)

给你一个链表的头节点 `head` 和一个特定值`x` ，请你对链表进行分隔，使得所有 **小于** `x` 的节点都出现在 **大于或等于** `x` 的节点之前。

你应当 **保留** 两个分区中每个节点的初始相对位置。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/01/04/partition.jpg)

```
输入：head = [1,4,3,2,5,2], x = 3
输出：[1,2,2,4,3,5]
```

**示例 2：**

```
输入：head = [2,1], x = 2
输出：[1,2]
```

**提示：**

* 链表中节点的数目在范围 `[0, 200]` 内
* `-100 <= Node.val <= 100`
* `-200 <= x <= 200`

##### 双指针模拟，small和larger

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
 * @param {number} x
 * @return {ListNode}
 */
var partition = function (head, x) {
    if (!head || !head.next) return head;
    let smallHead = null, largerHead = null;
    let small = null, larger = null;
    let curr = head;
    while (curr) {
        const next = curr.next;
        curr.next = null;
        if (curr.val < x) {
            if (!smallHead) {
                smallHead = small = curr;
            } else {
                small.next = curr
                small = curr;
            }
        } else {
            if (!largerHead) {
                largerHead = larger = curr;
            } else {
                larger.next = curr;
                larger = curr;
            }
        }
        curr = next;
    }
    if (smallHead) {
        small.next = largerHead;
    }

    return smallHead ? smallHead : largerHead;
};
```

#### [3542. 将所有元素变为 0 的最少操作次数](https://leetcode.cn/problems/minimum-operations-to-convert-all-elements-to-zero/description/)

给你一个大小为 `n` 的 **非负** 整数数组 `nums` 。你的任务是对该数组执行若干次（可能为 0 次）操作，使得 **所有**元素都变为 0。

在一次操作中，你可以选择一个子数组 `[i, j]`（其中 `0 <= i <= j < n`），将该子数组中所有 **最小的非负整数**的设为 0。

返回使整个数组变为 0 所需的**最少**操作次数。

一个 **子数组**是数组中的一段连续元素。

**示例 1：**

**输入:** nums = [0,2]

**输出:** 1

**解释:**

* 选择子数组 `[1,1]`（即 `[2]`），其中最小的非负整数是 2。将所有 2 设为 0，结果为 `[0,0]`。
* 因此，所需的最少操作次数为 1。

**示例 2：**

**输入:** nums = [3,1,2,1]

**输出:** 3

**解释:**

* 选择子数组 `[1,3]`（即 `[1,2,1]`），最小非负整数是 1。将所有 1 设为 0，结果为 `[3,0,2,0]`。
* 选择子数组 `[2,2]`（即 `[2]`），将 2 设为 0，结果为 `[3,0,0,0]`。
* 选择子数组 `[0,0]`（即 `[3]`），将 3 设为 0，结果为 `[0,0,0,0]`。
* 因此，最少操作次数为 3。

**示例 3：**

**输入:** nums = [1,2,1,2,1,2]

**输出:** 4

**解释:**

* 选择子数组 `[0,5]`（即 `[1,2,1,2,1,2]`），最小非负整数是 1。将所有 1 设为 0，结果为 `[0,2,0,2,0,2]`。
* 选择子数组 `[1,1]`（即 `[2]`），将 2 设为 0，结果为 `[0,0,0,2,0,2]`。
* 选择子数组 `[3,3]`（即 `[2]`），将 2 设为 0，结果为 `[0,0,0,0,0,2]`。
* 选择子数组 `[5,5]`（即 `[2]`），将 2 设为 0，结果为 `[0,0,0,0,0,0]`。
* 因此，最少操作次数为 4。

**提示:**

* `1 <= n == nums.length <= 105`
* `0 <= nums[i] <= 105`

##### 单调栈

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var minOperations = function(nums) {
    const st = [];
    let ans = 0;
    for (let x of nums) {
        // 栈顶元素左侧和右侧都有比其小的元素，需要操作
        while (st.length && x < st[st.length - 1]) {
            st.pop();
            ans++;
        }
        if (x != st[st.length - 1]) { // 跳过相同的元素
            st.push(x);
        }
    }

    // 栈中的元素都需要操作一次，0除外
    return ans + st.length - (st[0] == 0);
};
```

##### 树状数组

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var minOperations = function (nums) {
    const n = nums.length;
    const sorted = Array.from({ length: n }, (_, i) => i).sort((a, b) => nums[a] - nums[b]);
    const fenwick = new Fenwick(n); // 记录元素为0的树状数组，o(1)判断区间最小值是否为0
    let op = 0;
    for (let i = 0; i < n; i++) {
        let j = i, x = nums[sorted[i]];
        if (x == 0) { // 跳过一开始为0的位置
            fenwick.update(sorted[j], 1);
            continue;
        }
        let prev = sorted[i];
        while (nums[sorted[j]] == x) { // 遍历相等的元素
            if (fenwick.sumRange(prev, sorted[j]) > 1) { // 如果两个相等元素下标间有0，则操作数需要加一
                op++;
            }
            fenwick.update(sorted[j], 1); // 更新元素为0
            prev = sorted[j];
            j++;
        }
        op++;
        i = j - 1;
    }

    return op;
};

class Fenwick {
    constructor(n) {
        this.tree = Array(n + 1).fill(0);
    }

    update(index, val) {
        for (let i = index + 1; i < this.tree.length; i += (i & -i)) {
            this.tree[i] += val;
        }
    }

    prefixSum(i) {
        let sum = 0;
        for (; i >= 1; i &= i - 1) {
            sum += this.tree[i];
        }
        return sum;
    }

    sumRange(i, j) {
        return this.prefixSum(j + 1) - this.prefixSum(i);
    }
}
```

