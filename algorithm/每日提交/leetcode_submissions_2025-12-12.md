### 2025-12-12

#### [560. 和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/description/)

给你一个整数数组 `nums` 和一个整数 `k` ，请你统计并返回 *该数组中和为 `k`的子数组的个数*。

子数组是数组中元素的连续非空序列。

**示例 1：**

```
输入：nums = [1,1,1], k = 2
输出：2
```

**示例 2：**

```
输入：nums = [1,2,3], k = 3
输出：2
```

**提示：**

* `1 <= nums.length <= 2 * 104`
* `-1000 <= nums[i] <= 1000`
* `-107 <= k <= 107`

##### 枚举右维护前缀和 + 哈希

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function(nums, k) {
    const n = nums.length;
    let ans = 0, sum = 0, cnt = new Map([[0, 1]])
    for (let x of nums) {
        sum += x;
        if (cnt.has(sum - k)) ans += cnt.get(sum - k);
        cnt.set(sum, (cnt.get(sum) ?? 0) + 1);
    }
    return ans;
};
```

#### [438. 找到字符串中所有字母异位词](https://leetcode.cn/problems/find-all-anagrams-in-a-string/description/)

给定两个字符串 `s` 和 `p`，找到 `s`中所有 `p`的 **异位词**的子串，返回这些子串的起始索引。不考虑答案输出的顺序。

**示例 1:**

```
输入: s = "cbaebabacd", p = "abc"
输出: [0,6]
解释:
起始索引等于 0 的子串是 "cba", 它是 "abc" 的异位词。
起始索引等于 6 的子串是 "bac", 它是 "abc" 的异位词。
```

**示例 2:**

```
输入: s = "abab", p = "ab"
输出: [0,1,2]
解释:
起始索引等于 0 的子串是 "ab", 它是 "ab" 的异位词。
起始索引等于 1 的子串是 "ba", 它是 "ab" 的异位词。
起始索引等于 2 的子串是 "ab", 它是 "ab" 的异位词。
```

**提示:**

* `1 <= s.length, p.length <= 3 * 104`
* `s` 和 `p` 仅包含小写字母

##### 定长滑动窗口

```js
/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function(s, p) {
    const n = s.length, m = p.length;
    if (n < m) return [];
    const ans = [];
    const cnt = Array(26).fill(0);
    for (let x of p) {
        cnt[x.charCodeAt() - 97] += 1;
    }
    let diff = 0;
    for (let c of cnt) {
        if (c > 0) diff++;
    }
    for (let i = 0; i < n; i++) {
        // 入
        let code = s[i].charCodeAt() - 97;
        cnt[code] -= 1;
        if (cnt[code] == 0) {
            diff--;
        }
        if (i < m - 1) continue;
        if (diff == 0) ans.push(i - m + 1);
        // 出
        let lCode = s[(i - m + 1)].charCodeAt() - 97;
        cnt[lCode] += 1;
        if (cnt[lCode] == 1) {
            diff++;
        }
    }

    return ans;
};
```

#### [3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/description/)

给定一个字符串 `s` ，请你找出其中不含有重复字符的 **最长 子串**的长度。

**示例 1:**

```
输入: s = "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。注意 "bca" 和 "cab" 也是正确答案。
```

**示例 2:**

```
输入: s = "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
```

**示例 3:**

```
输入: s = "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
```

**提示：**

* `0 <= s.length <= 5 * 104`
* `s` 由英文字母、数字、符号和空格组成

##### 不定长滑动窗口

```js
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    const cnt = new Map();
    let ans = 0;
    for (let l = 0, r = 0; r < s.length; r++) {
        // 入
        let x = s[r];
        cnt.set(x, (cnt.get(x) ?? 0) + 1);
        while (cnt.get(x) > 1) {
            // 出
            cnt.set(s[l], cnt.get(s[l]) - 1)
            l++;
        }
        ans = Math.max(ans, r - l + 1);
    }
    return ans;
};
```

#### [3433. 统计用户被提及情况](https://leetcode.cn/problems/count-mentions-per-user/description/)

给你一个整数 `numberOfUsers` 表示用户总数，另有一个大小为 `n x 3` 的数组 `events` 。

每个 `events[i]` 都属于下述两种类型之一：

1. **消息事件（Message Event）：**`["MESSAGE", "timestampi", "mentions_stringi"]`
   * 事件表示在 `timestampi` 时，一组用户被消息提及。
   * `mentions_stringi` 字符串包含下述标识符之一：
     + `id<number>`：其中 `<number>` 是一个区间 `[0,numberOfUsers - 1]` 内的整数。可以用单个空格分隔 **多个** id ，并且 id 可能重复。此外，这种形式可以提及离线用户。
     + `ALL`：提及 **所有** 用户。
     + `HERE`：提及所有 **在线** 用户。
2. **离线事件（Offline Event）：**`["OFFLINE", "timestampi", "idi"]`
   * 事件表示用户 `idi` 在 `timestampi` 时变为离线状态 **60 个单位时间**。用户会在 `timestampi + 60` 时自动再次上线。

返回数组 `mentions` ，其中 `mentions[i]` 表示  id 为  `i` 的用户在所有 `MESSAGE` 事件中被提及的次数。

最初所有用户都处于在线状态，并且如果某个用户离线或者重新上线，其对应的状态变更将会在所有相同时间发生的消息事件之前进行处理和同步。

**注意** 在单条消息中，同一个用户可能会被提及多次。每次提及都需要被 **分别** 统计。

**示例 1：**

**输入：**numberOfUsers = 2, events = [["MESSAGE","10","id1 id0"],["OFFLINE","11","0"],["MESSAGE","71","HERE"]]

**输出：**[2,2]

**解释：**

最初，所有用户都在线。

时间戳 10 ，`id1` 和 `id0` 被提及，`mentions = [1,1]`

时间戳 11 ，`id0` **离线** 。

时间戳 71 ，`id0` 再次 **上线** 并且 `"HERE"` 被提及，`mentions = [2,2]`

**示例 2：**

**输入：**numberOfUsers = 2, events = [["MESSAGE","10","id1 id0"],["OFFLINE","11","0"],["MESSAGE","12","ALL"]]

**输出：**[2,2]

**解释：**

最初，所有用户都在线。

时间戳 10 ，`id1` 和 `id0` 被提及，`mentions = [1,1]`

时间戳 11 ，`id0` **离线** 。

时间戳 12 ，`"ALL"` 被提及。这种方式将会包括所有离线用户，所以 `id0` 和 `id1` 都被提及，`mentions = [2,2]`

**示例 3：**

**输入：**numberOfUsers = 2, events = [["OFFLINE","10","0"],["MESSAGE","12","HERE"]]

**输出：**[0,1]

**解释：**

最初，所有用户都在线。

时间戳 10 ，`id0` **离线** **。**

时间戳 12 ，`"HERE"` 被提及。由于 `id0` 仍处于离线状态，其将不会被提及，`mentions = [0,1]`

**提示：**

* `1 <= numberOfUsers <= 100`
* `1 <= events.length <= 100`
* `events[i].length == 3`
* `events[i][0]` 的值为 `MESSAGE` 或 `OFFLINE` 。
* `1 <= int(events[i][1]) <= 105`
* 在任意 `"MESSAGE"` 事件中，以 `id<number>` 形式提及的用户数目介于 `1` 和 `100` 之间。
* `0 <= <number> <= numberOfUsers - 1`
* 题目保证 `OFFLINE` 引用的用户 id 在事件发生时处于 **在线** 状态。

```js
/**
 * @param {number} numberOfUsers
 * @param {string[][]} events
 * @return {number[]}
 */
var countMentions = function(numberOfUsers, events) {
    events.sort((a, b) => (+a[1]) - (+b[1]) || (mentionType[b[0]] - mentionType[a[0]]));
    const ans = Array(numberOfUsers).fill(0);
    const nextOnline = Array(numberOfUsers).fill(-1);
    let mentionAll = 0;

    for (let [event, ts, ids] of events) {
        ts = Number(ts);
        if (event == "OFFLINE") {
            nextOnline[ids] = ts + 60;
        } else {
            if (ids == 'ALL') {
                mentionAll++;
            } else if (ids == 'HERE') {
                for (let i = 0; i < numberOfUsers; i++) {
                    if (nextOnline[i] <= ts) {
                        ans[i]++;
                    }
                }
            } else {
                ids = ids.split(" ");
                for (let id of ids) {
                    ans[id.slice(2)]++;
                }
            }
        }
    }

    for (let i = 0; i < numberOfUsers; i++) {
        ans[i] += mentionAll;
    }

    return ans;
};

const mentionType = {
    "OFFLINE": 1,
    "MESSAGE": 0
}
```
