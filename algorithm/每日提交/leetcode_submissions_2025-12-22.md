### 2025-12-22

#### [25. K 个一组翻转链表](https://leetcode.cn/problems/reverse-nodes-in-k-group/description/)

给你链表的头节点 `head` ，每 `k`个节点一组进行翻转，请你返回修改后的链表。

`k` 是一个正整数，它的值小于或等于链表的长度。如果节点总数不是 `k`的整数倍，那么请将最后剩余的节点保持原有顺序。

你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/10/03/reverse_ex1.jpg)

```
输入：head = [1,2,3,4,5], k = 2
输出：[2,1,4,3,5]
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2020/10/03/reverse_ex2.jpg)

```
输入：head = [1,2,3,4,5], k = 3
输出：[3,2,1,4,5]
```

**提示：**

* 链表中的节点数目为 `n`
* `1 <= k <= n <= 5000`
* `0 <= Node.val <= 1000`

**进阶：**你可以设计一个只用 `O(1)` 额外内存空间的算法解决此问题吗？

#### [24. 两两交换链表中的节点](https://leetcode.cn/problems/swap-nodes-in-pairs/description/)

给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/10/03/swap_ex1.jpg)

```
输入：head = [1,2,3,4]
输出：[2,1,4,3]
```

**示例 2：**

```
输入：head = []
输出：[]
```

**示例 3：**

```
输入：head = [1]
输出：[1]
```

**提示：**

* 链表中节点的数目在范围 `[0, 100]` 内
* `0 <= Node.val <= 100`

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
var swapPairs = function(head) {
    if (!head || !head.next) return head;
    const dummy = new ListNode(-1, head);
    let node = head, prev = dummy;
    while (node && node.next) {
        // dummy -> 1 -> 2 -> 3
        // prev: dummy, node: 1, next: 2
        let next = node.next;
        // 链接 dummy -> 2
        prev.next = next;
        // 链接 1 -> 3
        node.next = next.next;
        // 链接 dummy -> 2 -> 1 -> 3
        next.next = node;
        prev = node, node = node.next;
    }
    return dummy.next;
};
```

##### dfs

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
var swapPairs = function(head) {
    if (!head || !head.next) return head;
    let newHead = head.next;
    head.next = swapPairs(newHead.next), newHead.next = head;
    return newHead;
};
```

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

##### 前后指针

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
    const dummy = new ListNode(-1, head);
    let node = dummy;
    let p1 = dummy;
    for (let i = 0; i < n; i++) {
        p1 = p1?.next;
    }
    while (p1?.next) {
        p1 = p1.next;
        node = node.next;
    }
    node.next = node?.next?.next ?? null;
    return dummy.next;
};
```

#### [960. 删列造序 III](https://leetcode.cn/problems/delete-columns-to-make-sorted-iii/description/)

给定由 `n` 个小写字母字符串组成的数组 `strs` ，其中每个字符串长度相等。

选取一个删除索引序列，对于 `strs` 中的每个字符串，删除对应每个索引处的字符。

比如，有 `strs = ["abcdef","uvwxyz"]` ，删除索引序列 `{0, 2, 3}` ，删除后为 `["bef", "vyz"]` 。

假设，我们选择了一组删除索引 `answer` ，那么在执行删除操作之后，最终得到的数组的行中的 **每个元素** 都是按**字典序**排列的（即 `(strs[0][0] <= strs[0][1] <= ... <= strs[0][strs[0].length - 1])` 和 `(strs[1][0] <= strs[1][1] <= ... <= strs[1][strs[1].length - 1])` ，依此类推）。

请返回*`answer.length` 的最小可能值* 。

**示例 1：**

```
输入：strs = ["babca","bbazb"]
输出：3
解释：
删除 0、1 和 4 这三列后，最终得到的数组是 strs = ["bc", "az"]。
这两行是分别按字典序排列的（即，strs[0][0] <= strs[0][1] 且 strs[1][0] <= strs[1][1]）。
注意，strs[0] > strs[1] —— 数组 strs 不一定是按字典序排列的。
```

**示例 2：**

```
输入：strs = ["edcba"]
输出：4
解释：如果删除的列少于 4 列，则剩下的行都不会按字典序排列。
```

**示例 3：**

```
输入：strs = ["ghi","def","abc"]
输出：0
解释：所有行都已按字典序排列。
```

**提示：**

* `n == strs.length`
* `1 <= n <= 100`
* `1 <= strs[i].length <= 100`
* `strs[i]` 由小写英文字母组成

##### 最长递增子序列：迭代优化，只需要比对第i列和第j列，不需要记录第j列后续的递增子序列

```js
/**
 * @param {string[]} strs
 * @return {number}
 */
var minDeletionSize = function (strs) {
    const n = strs.length, m = strs[0].length;
    let ans = 1;
    // 只需要存每一列为首的最长递增子序列的最大长度
    // 比对时只要比对两列就可以
    const f = Array(m).fill(1);
    for (let i = m - 2; i >= 0; i--) {
        outer: for (let j = i + 1; j < m; j++) {
            // 第j列的递增序列长度大于先前遍历的的长度
            if (f[j] + 1 > f[i]) {
                // 判断追加后每一行是否递增
                // ⭐️只需要判断第j行和第i行就可以，不需要记录第j行后续的递增子序列
                for (let r = 0; r < n; r++) {
                    if (strs[r][i] > strs[r][j]) {
                        continue outer;
                    }
                }
                // 更新最大长度
                f[i] = f[j] + 1;
            }
        }
        ans = Math.max(ans, f[i]);
    }
    return m - ans;
};
```

##### 迭代

```js
/**
 * @param {string[]} strs
 * @return {number}
 */
var minDeletionSize = function (strs) {
    const n = strs.length, m = strs[0].length;
    let ans = 1;
    const f = Array(m);
    f[m - 1] = strs.map(s => s[m - 1]);
    for (let i = m - 2; i >= 0; i--) {
        f[i] = strs.map(s => s[i]);
        let maxSuffLen = 0, maxSuff;
        outer: for (let j = i + 1; j < m; j++) {
            // 第j列的递增序列长度大于先前遍历的的长度
            if (f[j][0].length > maxSuffLen) {
                // 判断追加后每一行是否递增
                for (let r = 0; r < n; r++) {
                    if (f[i][r] > f[j][r]) {
                        continue outer;
                    }
                }
                // 更新最大长度
                maxSuffLen = f[j][0].length, maxSuff = j;
            }
        }
        // 存在后缀递增序列
        if (maxSuff) {
            for (let r = 0; r < n; r++) {
                f[i][r] += f[maxSuff][r] ?? "";
            }
        }
        ans = Math.max(ans, f[i][0].length);
    }
    return m - ans;
};
```

##### dfs

```js
/**
 * @param {string[]} strs
 * @return {number}
 */
var minDeletionSize = function (strs) {
    const n = strs.length, m = strs[0].length;
    let ans = 1;
    const memo = Array(m);
    // 以第i列为首的数组strs
    const dfs = (i) => {
        if (i == m - 1) {
            return memo[i] = strs.map(s => s[m - 1]);
        }
        if (memo[i]) return memo[i];
        let res = strs.map(s => s[i]);
        let maxSuffLen = 0, maxSuff = [];
        outer: for (let j = i + 1; j < m; j++) {
            let suff = dfs(j);
            if (suff[0].length > maxSuffLen) {
                for (let r = 0; r < n; r++) {
                    if (res[r] > suff[r]) {
                        continue outer;
                    }
                }
                maxSuffLen = suff[0].length, maxSuff = suff;
            }

        }
        for (let r = 0; r < n; r++) {
            res[r] += maxSuff[r] ?? "";
        }
        ans = Math.max(ans, res[0].length);
        return memo[i] = res;
    }
    dfs(0);
    return m - ans;
};
```

