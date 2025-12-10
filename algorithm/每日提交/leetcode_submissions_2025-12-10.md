### 2025-12-10

#### [283. 移动零](https://leetcode.cn/problems/move-zeroes/description/)

给定一个数组 `nums`，编写一个函数将所有 `0` 移动到数组的末尾，同时保持非零元素的相对顺序。

**请注意** ，必须在不复制数组的情况下原地对数组进行操作。

**示例 1:**

```
输入: nums = [0,1,0,3,12]
输出: [1,3,12,0,0]
```

**示例 2:**

```
输入: nums = [0]
输出: [0]
```

**提示**:

* `1 <= nums.length <= 104`
* `-231 <= nums[i] <= 231 - 1`

**进阶：**你能尽量减少完成的操作次数吗？

##### 双指针

```js
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums) {
    let l = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] != 0) {
            [nums[i], nums[l]] = [nums[l], nums[i]];
            l++;
        }
    }
};
```

##### 原地栈

```js
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums) {
    let p = 0;
    for (let x of nums) {
        if (x == 0) continue;
        nums[p++] = x;
    }
    for (let i = p; i < nums.length; i++) {
        nums[i] = 0;
    }
};
```

#### [128. 最长连续序列](https://leetcode.cn/problems/longest-consecutive-sequence/description/)

给定一个未排序的整数数组 `nums` ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。

请你设计并实现时间复杂度为 `O(n)`的算法解决此问题。

**示例 1：**

```
输入：nums = [100,4,200,1,3,2]
输出：4
解释：最长数字连续序列是 [1, 2, 3, 4]。它的长度为 4。
```

**示例 2：**

```
输入：nums = [0,3,7,2,5,8,4,6,0,1]
输出：9
```

**示例 3：**

```
输入：nums = [1,0,1,2]
输出：3
```

**提示：**

* `0 <= nums.length <= 105`
* `-109 <= nums[i] <= 109`

##### 从连续区间的左端点开始枚举，如果set中存在x-1(不是左端点)跳过

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function (nums) {
    const set = new Set(nums);
    let ans = 0;
    for (const x of set) {
        if (set.has(x - 1)) continue;
        let y = x + 1;
        while (set.has(y)) {
            y++;
        }
        ans = Math.max(y - x, ans);
    }
    return ans;
};
```

##### 维护连续区间左右端点的映射

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function (nums) {
    const set = new Set(nums);
    // 连续递增区间左右端点映射
    const l2r = new Map();
    const r2l = new Map();

    let ans = 0;
    for (let x of set) {
        let len = 1, l = x, r = x;
        // 右边存在连续区间
        if (l2r.has(x + 1)) {
            // 合并后新的右端点
            r = l2r.get(x + 1);
        }
        // 左边存在连续区间
        if (r2l.has(x - 1)) {
            // 合并后新的左端点
            l = r2l.get(x - 1);
        }
        // 维护新区间端点映射
        l2r.set(l, r), r2l.set(r, l);
        ans = Math.max(ans, r - l + 1);
    }
    return ans;
};
```

#### [49. 字母异位词分组](https://leetcode.cn/problems/group-anagrams/description/)

给你一个字符串数组，请你将 字母异位词 组合在一起。可以按任意顺序返回结果列表。

**示例 1:**

**输入:** strs = ["eat", "tea", "tan", "ate", "nat", "bat"]

**输出:** [["bat"],["nat","tan"],["ate","eat","tea"]]

**解释：**

* 在 strs 中没有字符串可以通过重新排列来形成 `"bat"`。
* 字符串 `"nat"` 和 `"tan"` 是字母异位词，因为它们可以重新排列以形成彼此。
* 字符串 `"ate"` ，`"eat"` 和 `"tea"` 是字母异位词，因为它们可以重新排列以形成彼此。

**示例 2:**

**输入:** strs = [""]

**输出:** [[""]]

**示例 3:**

**输入:** strs = ["a"]

**输出:** [["a"]]

**提示：**

* `1 <= strs.length <= 104`
* `0 <= strs[i].length <= 100`
* `strs[i]` 仅包含小写字母

##### 哈希+排序

```js
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function(strs) {
    const map = new Map();
    for (let str of strs) {
       let sorted = str.split("").sort().join();
       let g = map.get(sorted) ?? [];
       g.push(str);
       map.set(sorted, g);
    }
    return Array.from(map.values());
};
```

##### 哈希+计数

```js
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function(strs) {
    const map = {};
    for (let str of strs) {
        const cnt = Array(26).fill(0);
        for (let s of str) {
            cnt[s.charCodeAt() - 97] += 1;
        }
        if (!map[cnt]) {
            map[cnt] = [];
        }
        map[cnt].push(str);
    }
    return Array.from(Object.values(map));
};
```

#### [1. 两数之和](https://leetcode.cn/problems/two-sum/description/)

给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出 **和为目标值** *`target`*  的那 **两个** 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。

你可以按任意顺序返回答案。

**示例 1：**

```
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
```

**示例 2：**

```
输入：nums = [3,2,4], target = 6
输出：[1,2]
```

**示例 3：**

```
输入：nums = [3,3], target = 6
输出：[0,1]
```

**提示：**

* `2 <= nums.length <= 104`
* `-109 <= nums[i] <= 109`
* `-109 <= target <= 109`
* **只会存在一个有效答案**

**进阶：**你可以想出一个时间复杂度小于 `O(n2)` 的算法吗？

##### 哈希

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        if (map.has(nums[i])) {
            return [map.get(nums[i]), i];
        }
        map.set(target - nums[i], i)
    }
};
```

#### [3577. 统计计算机解锁顺序排列数](https://leetcode.cn/problems/count-the-number-of-computer-unlocking-permutations/description/)

给你一个长度为 `n` 的数组 `complexity`。

在房间里有 `n` 台 **上锁的**计算机，这些计算机的编号为 0 到 `n - 1`，每台计算机都有一个 **唯一**的密码。编号为 `i` 的计算机的密码复杂度为 `complexity[i]`。

编号为 0 的计算机密码已经 **解锁**，并作为根节点。其他所有计算机必须通过它或其他已经解锁的计算机来解锁，具体规则如下：

* 可以使用编号为 `j` 的计算机的密码解锁编号为 `i` 的计算机，其中 `j` 是任何小于 `i` 的整数，且满足 `complexity[j] < complexity[i]`（即 `j < i` 并且 `complexity[j] < complexity[i]`）。
* 要解锁编号为 `i` 的计算机，你需要事先解锁一个编号为 `j` 的计算机，满足 `j < i` 并且 `complexity[j] < complexity[i]`。

求共有多少种 `[0, 1, 2, ..., (n - 1)]` 的排列方式，能够表示从编号为 0 的计算机（唯一初始解锁的计算机）开始解锁所有计算机的有效顺序。

由于答案可能很大，返回结果需要对 **109 + 7** 取余数。

**注意：**编号为 0 的计算机的密码已解锁，而 **不是**排列中第一个位置的计算机密码已解锁。

**排列**是一个数组中所有元素的重新排列。

**示例 1：**

**输入：** complexity = [1,2,3]

**输出：** 2

**解释：**

有效的排列有：

* [0, 1, 2]
  + 首先使用根密码解锁计算机 0。
  + 使用计算机 0 的密码解锁计算机 1，因为 `complexity[0] < complexity[1]`。
  + 使用计算机 1 的密码解锁计算机 2，因为 `complexity[1] < complexity[2]`。
* [0, 2, 1]
  + 首先使用根密码解锁计算机 0。
  + 使用计算机 0 的密码解锁计算机 2，因为 `complexity[0] < complexity[2]`。
  + 使用计算机 0 的密码解锁计算机 1，因为 `complexity[0] < complexity[1]`。

**示例 2：**

**输入：** complexity = [3,3,3,4,4,4]

**输出：** 0

**解释：**

没有任何排列能够解锁所有计算机。

**提示：**

* `2 <= complexity.length <= 105`
* `1 <= complexity[i] <= 109`

##### 脑筋急转弯

```js
/**
 * @param {number[]} complexity
 * @return {number}
 */
var countPermutations = function(complexity) {
    const n = complexity.length;
    const s = complexity[0];
    let ans = 1;
    for (let i = 1; i < n; i++) {
        if (complexity[i] <= s) {
            return 0;
        }
        ans = (ans * i) % MOD;
    }
    return ans;
};

const MOD = 1e9 + 7;
```

