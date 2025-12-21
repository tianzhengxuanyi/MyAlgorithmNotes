### 2025-12-18

#### [141. 环形链表](https://leetcode.cn/problems/linked-list-cycle/description/)

给你一个链表的头节点 `head` ，判断链表中是否有环。

如果链表中有某个节点，可以通过连续跟踪 `next` 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 `pos` 来表示链表尾连接到链表中的位置（索引从 0 开始）。**注意：`pos` 不作为参数进行传递**。仅仅是为了标识链表的实际情况。

*如果链表中存在环* ，则返回 `true` 。 否则，返回 `false` 。

**示例 1：**

![](https://assets.leetcode.cn/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist.png)

```
输入：head = [3,2,0,-4], pos = 1
输出：true
解释：链表中有一个环，其尾部连接到第二个节点。
```

**示例 2：**

![](https://assets.leetcode.cn/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist_test2.png)

```
输入：head = [1,2], pos = 0
输出：true
解释：链表中有一个环，其尾部连接到第一个节点。
```

**示例 3：**

![](https://assets.leetcode.cn/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist_test3.png)

```
输入：head = [1], pos = -1
输出：false
解释：链表中没有环。
```

**提示：**

* 链表中节点的数目范围是 `[0, 104]`
* `-105 <= Node.val <= 105`
* `pos` 为 `-1` 或者链表中的一个 **有效索引** 。

**进阶：**你能用 `O(1)`（即，常量）内存解决此问题吗？

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
 * @return {boolean}
 */
var hasCycle = function(head) {
    let fast = head?.next?.next, slow = head?.next;
    while (fast != slow) {
        fast = fast?.next?.next;
        slow = slow?.next;
    }

    return !!slow;
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

#### [3652. 按策略买卖股票的最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-using-strategy/description/)

给你两个整数数组 `prices` 和 `strategy`，其中：

* `prices[i]` 表示第 `i` 天某股票的价格。
* `strategy[i]` 表示第 `i` 天的交易策略，其中：
  + `-1` 表示买入一单位股票。
  + `0` 表示持有股票。
  + `1` 表示卖出一单位股票。

同时给你一个 **偶数**整数 `k`，你可以对 `strategy` 进行 **最多一次**修改。一次修改包括：

* 选择 `strategy` 中恰好 `k` 个 **连续**元素。
* 将前 `k / 2` 个元素设为 `0`（持有）。
* 将后 `k / 2` 个元素设为 `1`（卖出）。

**利润**定义为所有天数中 `strategy[i] * prices[i]` 的 **总和**。

返回你可以获得的 **最大**可能利润。

**注意：** 没有预算或股票持有数量的限制，因此所有买入和卖出操作均可行，无需考虑过去的操作。

**示例 1：**

**输入：** prices = [4,2,8], strategy = [-1,0,1], k = 2

**输出：** 10

**解释：**

| 修改 | 策略 | 利润计算 | 利润 |
| --- | --- | --- | --- |
| 原始 | [-1, 0, 1] | (-1 × 4) + (0 × 2) + (1 × 8) = -4 + 0 + 8 | 4 |
| 修改 [0, 1] | [0, 1, 1] | (0 × 4) + (1 × 2) + (1 × 8) = 0 + 2 + 8 | 10 |
| 修改 [1, 2] | [-1, 0, 1] | (-1 × 4) + (0 × 2) + (1 × 8) = -4 + 0 + 8 | 4 |

因此，最大可能利润是 10，通过修改子数组 `[0, 1]` 实现。

**示例 2：**

**输入：** prices = [5,4,3], strategy = [1,1,0], k = 2

**输出：** 9

**解释：**

| 修改 | 策略 | 利润计算 | 利润 |
| --- | --- | --- | --- |
| 原始 | [1, 1, 0] | (1 × 5) + (1 × 4) + (0 × 3) = 5 + 4 + 0 | 9 |
| 修改 [0, 1] | [0, 1, 0] | (0 × 5) + (1 × 4) + (0 × 3) = 0 + 4 + 0 | 4 |
| 修改 [1, 2] | [1, 0, 1] | (1 × 5) + (0 × 4) + (1 × 3) = 5 + 0 + 3 | 8 |

因此，最大可能利润是 9，无需任何修改即可达成。

**提示：**

* `2 <= prices.length == strategy.length <= 105`
* `1 <= prices[i] <= 105`
* `-1 <= strategy[i] <= 1`
* `2 <= k <= prices.length`
* `k` 是偶数

##### 滑动窗口

```js
/**
 * @param {number[]} prices
 * @param {number[]} strategy
 * @param {number} k
 * @return {number}
 */
var maxProfit = function (prices, strategy, k) {
    const n = prices.length;
    let total = 0;
    for (let i = 0; i < n; i++) {
        total += prices[i] * strategy[i];
    }
    let ans = total, diff = 0; // diff为修改后newTotal - total的差值
    // 初始长度为k窗口
    for (let i = 0; i < k; i++) {
        if (i < k / 2) {
            diff += prices[i] * (0 - strategy[i]); // 修改后为0
        } else {
            diff += prices[i] * (1 - strategy[i]); // 修改后为1
        }
    }
    ans = Math.max(ans, total + diff);
    for (let i = k; i < n; i++) {
        diff += (prices[i - k] * (strategy[i - k]) // i-k出窗口，撤销修改
            - prices[i - k/2] // 窗口内的i - k/2从1变为0，newTotal减少preices[i - k/2]
            + prices[i] * (1 - strategy[i])); // i进入窗口
        ans = Math.max(ans, total + diff);
    }
    return ans;
};
```

