### 2025-11-24

#### [3457. 吃披萨](https://leetcode.cn/problems/eat-pizzas/description/)

给你一个长度为 `n` 的整数数组 `pizzas`，其中 `pizzas[i]` 表示第 `i` 个披萨的重量。每天你会吃 **恰好** 4 个披萨。由于你的新陈代谢能力惊人，当你吃重量为 `W`、`X`、`Y` 和 `Z` 的披萨（其中 `W <= X <= Y <= Z`）时，你只会增加 1 个披萨的重量！体重增加规则如下：

* 在 **奇数天**（按 **1 开始计数**）你会增加 `Z` 的重量。
* 在 **偶数天**，你会增加 `Y` 的重量。

请你设计吃掉 **所有**披萨的最优方案，并计算你可以增加的 **最大**总重量。

**注意：**保证 `n` 是 4 的倍数，并且每个披萨只吃一次。

**示例 1：**

**输入：** pizzas = [1,2,3,4,5,6,7,8]

**输出：** 14

**解释：**

* 第 1 天，你吃掉下标为 `[1, 2, 4, 7] = [2, 3, 5, 8]` 的披萨。你增加的重量为 8。
* 第 2 天，你吃掉下标为 `[0, 3, 5, 6] = [1, 4, 6, 7]` 的披萨。你增加的重量为 6。

吃掉所有披萨后，你增加的总重量为 `8 + 6 = 14`。

**示例 2：**

**输入：** pizzas = [2,1,1,1,1,1,1,1]

**输出：** 3

**解释：**

* 第 1 天，你吃掉下标为 `[4, 5, 6, 0] = [1, 1, 1, 2]` 的披萨。你增加的重量为 2。
* 第 2 天，你吃掉下标为 `[1, 2, 3, 7] = [1, 1, 1, 1]` 的披萨。你增加的重量为 1。

吃掉所有披萨后，你增加的总重量为 `2 + 1 = 3`。

**提示：**

* `4 <= n == pizzas.length <= 2 * 105`
* `1 <= pizzas[i] <= 105`
* `n` 是 4 的倍数。

##### 贪心

```js
/**
 * @param {number[]} pizzas
 * @return {number}
 */
var maxWeight = function(pizzas) {
    const n = pizzas.length;
    let odd = Math.ceil(n / 8), even = Math.floor(n / 8);
    pizzas.sort((a, b) => b - a);
    let sum = 0;
    for (let i = 0; i < odd; i++) {
        sum += pizzas[i];
    }
    for (let i = odd + 1; i < odd + 2 * even; i += 2) {
        sum += pizzas[i];
    }
    return sum;
};
```

#### [2895. 最小处理时间](https://leetcode.cn/problems/minimum-processing-time/description/)

你有 `n` 颗处理器，每颗处理器都有 `4` 个核心。现有 `n * 4` 个待执行任务，每个核心只执行 **一次** 任务。

给你一个下标从 **0** 开始的整数数组 `processorTime` ，表示每颗处理器最早空闲时间。另给你一个下标从 **0** 开始的整数数组 `tasks` ，表示执行每个任务所需的时间。返回所有任务都执行完毕需要的 **最小时间** 。

注意：每个核心独立执行任务。

**示例 1：**

```
输入：processorTime = [8,10], tasks = [2,2,3,1,8,7,4,5]
输出：16
解释：
最优的方案是将下标为 4, 5, 6, 7 的任务分配给第一颗处理器（最早空闲时间 time = 8），下标为 0, 1, 2, 3 的任务分配给第二颗处理器（最早空闲时间 time = 10）。 
第一颗处理器执行完所有任务需要花费的时间 = max(8 + 8, 8 + 7, 8 + 4, 8 + 5) = 16 。
第二颗处理器执行完所有任务需要花费的时间 = max(10 + 2, 10 + 2, 10 + 3, 10 + 1) = 13 。
因此，可以证明执行完所有任务需要花费的最小时间是 16 。
```

**示例 2：**

```
输入：processorTime = [10,20], tasks = [2,3,1,2,5,8,4,3]
输出：23
解释：
最优的方案是将下标为 1, 4, 5, 6 的任务分配给第一颗处理器（最早空闲时间 time = 10），下标为 0, 2, 3, 7 的任务分配给第二颗处理器（最早空闲时间 time = 20）。 
第一颗处理器执行完所有任务需要花费的时间 = max(10 + 3, 10 + 5, 10 + 8, 10 + 4) = 18 。 
第二颗处理器执行完所有任务需要花费的时间 = max(20 + 2, 20 + 1, 20 + 2, 20 + 3) = 23 。 
因此，可以证明执行完所有任务需要花费的最小时间是 23 。
```

**提示：**

* `1 <= n == processorTime.length <= 25000`
* `1 <= tasks.length <= 105`
* `0 <= processorTime[i] <= 109`
* `1 <= tasks[i] <= 109`
* `tasks.length == 4 * n`

##### 贪心： 交换论证

```js
/**
 * @param {number[]} processorTime
 * @param {number[]} tasks
 * @return {number}
 */
var minProcessingTime = function (processorTime, tasks) {
    tasks.sort((a, b) => b - a);
    processorTime.sort((a, b) => a - b);
    let ans = processorTime[0] + tasks[0];
    for (let i = 1; i < processorTime.length; i++) {
        ans = Math.max(ans, processorTime[i] + tasks[i * 4]);
    }
    return ans;
};
```

#### [3085. 成为 K 特殊字符串需要删除的最少字符数](https://leetcode.cn/problems/minimum-deletions-to-make-string-k-special/description/)

给你一个字符串 `word` 和一个整数 `k`。

如果 `|freq(word[i]) - freq(word[j])| <= k` 对于字符串中所有下标 `i` 和 `j`  都成立，则认为 `word` 是 **k 特殊字符串**。

此处，`freq(x)` 表示字符 `x` 在 `word` 中的出现频率，而 `|y|` 表示 `y` 的绝对值。

返回使 `word` 成为 **k 特殊字符串** 需要删除的字符的最小数量。

**示例 1：**

**输入：**word = "aabcaba", k = 0

**输出：**3

**解释：**可以删除 `2` 个 `"a"` 和 `1` 个 `"c"` 使 `word` 成为 `0` 特殊字符串。`word` 变为 `"baba"`，此时 `freq('a') == freq('b') == 2`。

**示例 2：**

**输入：**word = "dabdcbdcdcd", k = 2

**输出：**2

**解释：**可以删除 `1` 个 `"a"` 和 `1` 个 `"d"` 使 `word` 成为 `2` 特殊字符串。`word` 变为 `"bdcbdcdcd"`，此时 `freq('b') == 2`，`freq('c') == 3`，`freq('d') == 4`。

**示例 3：**

**输入：**word = "aaabaaa", k = 2

**输出：**1

**解释：**可以删除1 个 `"b"` 使 `word` 成为 `2`特殊字符串。因此，`word` 变为 `"aaaaaa"`，此时每个字母的频率都是 `6`。

**提示：**

* `1 <= word.length <= 105`
* `0 <= k <= 105`
* `word` 仅由小写英文字母组成。

##### 贪心：统计词频后排序，枚举i，二分得到大于等于cnt[i]的位置j，用前缀和计算[i,j]的和，[j, n)的留下的频次和为(26-j) * (cnt[i] + k)。统计最大留下的频次和，最小拿走的数目为总数减去这个和

```js
/**
 * @param {string} word
 * @param {number} k
 * @return {number}
 */
var minimumDeletions = function(word, k) {
    const cnt = Array(26).fill(0);
    for (let x of word) {
        cnt[x.charCodeAt() - 97] += 1;
    }
    cnt.sort((a, b) => a - b);
    const prefix = Array(27).fill(0);
    for (let i = 0; i < 26; i++) {
        prefix[i + 1] = prefix[i] + cnt[i];
    }
    let maxRemain = 0;
    for (let i = 0; i < 26; i++) {
        let nx = lowerBound(cnt, cnt[i] + k);
        maxRemain = Math.max(maxRemain, prefix[nx] - prefix[i] + (26 - nx) * (cnt[i] + k));
    }
    return prefix[26] - maxRemain;
};

function lowerBound(nums, target) {
    let l = 0, r = nums.length - 1;
    while (l <= r) {
        let m = Math.floor((r - l) / 2) + l;
        if (nums[m] < target) {
            l = m + 1;
        } else {
            r = m - 1;
        }
    }
    return l;
}
```

#### [2171. 拿出最少数目的魔法豆](https://leetcode.cn/problems/removing-minimum-number-of-magic-beans/description/)

给定一个 **正整数**数组 `beans` ，其中每个整数表示一个袋子里装的魔法豆的数目。

请你从每个袋子中 **拿出** 一些豆子（也可以**不拿出**），使得剩下的 **非空** 袋子中（即 **至少还有一颗** 魔法豆的袋子）魔法豆的数目 **相等**。一旦把魔法豆从袋子中取出，你不能再将它放到任何袋子中。

请返回你需要拿出魔法豆的 **最少数目**。

**示例 1：**

```
输入：beans = [4,1,6,5]
输出：4
解释：
- 我们从有 1 个魔法豆的袋子中拿出 1 颗魔法豆。
  剩下袋子中魔法豆的数目为：[4,0,6,5]
- 然后我们从有 6 个魔法豆的袋子中拿出 2 个魔法豆。
  剩下袋子中魔法豆的数目为：[4,0,4,5]
- 然后我们从有 5 个魔法豆的袋子中拿出 1 个魔法豆。
  剩下袋子中魔法豆的数目为：[4,0,4,4]
总共拿出了 1 + 2 + 1 = 4 个魔法豆，剩下非空袋子中魔法豆的数目相等。
没有比取出 4 个魔法豆更少的方案。
```

**示例 2：**

```
输入：beans = [2,10,3,2]
输出：7
解释：
- 我们从有 2 个魔法豆的其中一个袋子中拿出 2 个魔法豆。
  剩下袋子中魔法豆的数目为：[0,10,3,2]
- 然后我们从另一个有 2 个魔法豆的袋子中拿出 2 个魔法豆。
  剩下袋子中魔法豆的数目为：[0,10,3,0]
- 然后我们从有 3 个魔法豆的袋子中拿出 3 个魔法豆。
  剩下袋子中魔法豆的数目为：[0,10,0,0]
总共拿出了 2 + 2 + 3 = 7 个魔法豆，剩下非空袋子中魔法豆的数目相等。
没有比取出 7 个魔法豆更少的方案。
```

**提示：**

* `1 <= beans.length <= 105`
* `1 <= beans[i] <= 105`

##### 贪心： 正难则反  求剩余的最大的数量

```js
/**
 * @param {number[]} beans
 * @return {number}
 */
var minimumRemoval = function(beans) {
    beans.sort((a, b) => a - b);
    let sum = 0, // beans的总数
        maxRemain = 0, // 拿走豆子剩余的最大的数量
        n = beans.length;
    for (let i = 0; i < n; i++) {
        sum += beans[i];
        // 每个袋子的数目都为beans[i], 剩余的数量
        maxRemain = Math.max(maxRemain, beans[i] * (n - i));
    }
    return sum - maxRemain; // 需要拿出的最少数目
};
```

#### [2405. 子字符串的最优划分](https://leetcode.cn/problems/optimal-partition-of-string/description/)

给你一个字符串 `s` ，请你将该字符串划分成一个或多个 **子字符串** ，并满足每个子字符串中的字符都是 **唯一** 的。也就是说，在单个子字符串中，字母的出现次数都不超过 **一次** 。

满足题目要求的情况下，返回 **最少** 需要划分多少个子字符串*。*

注意，划分后，原字符串中的每个字符都应该恰好属于一个子字符串。

**示例 1：**

```
输入：s = "abacaba"
输出：4
解释：
两种可行的划分方法分别是 ("a","ba","cab","a") 和 ("ab","a","ca","ba") 。
可以证明最少需要划分 4 个子字符串。
```

**示例 2：**

```
输入：s = "ssssss"
输出：6
解释：
只存在一种可行的划分方法 ("s","s","s","s","s","s") 。
```

**提示：**

* `1 <= s.length <= 105`
* `s` 仅由小写英文字母组成

##### 贪心：重复出现字符就分割

```js
/**
 * @param {string} s
 * @return {number}
 */
var partitionString = function(s) {
   let mask = 0, ans = 0;
   for (let x of s) {
        let bit = 1 << (x.charCodeAt() - 97);
        if (mask & bit) {
            ans++;
            mask = bit;
        }  else {
            mask |= bit;
        }
   } 
   return ans + 1;
};
```

#### [1221. 分割平衡字符串](https://leetcode.cn/problems/split-a-string-in-balanced-strings/description/)

**平衡字符串** 中，`'L'` 和 `'R'` 字符的数量是相同的。

给你一个平衡字符串 `s`，请你将它分割成尽可能多的子字符串，并满足：

* 每个子字符串都是平衡字符串。

返回可以通过分割得到的平衡字符串的 **最大数量** **。**

**示例 1：**

```
输入：s = "RLRRLLRLRL"
输出：4
解释：s 可以分割为 "RL"、"RRLL"、"RL"、"RL" ，每个子字符串中都包含相同数量的 'L' 和 'R' 。
```

**示例 2：**

```
输入：s = "RLRRRLLRLL"
输出：2
解释：s 可以分割为 "RL"、"RRRLLRLL"，每个子字符串中都包含相同数量的 'L' 和 'R' 。
注意，s 无法分割为 "RL"、"RR"、"RL"、"LR"、"LL" 因为第 2 个和第 5 个子字符串不是平衡字符串。
```

**示例 3：**

```
输入：s = "LLLLRRRR"
输出：1
解释：s 只能保持原样 "LLLLRRRR" 。
```

**提示：**

* `2 <= s.length <= 1000`
* `s[i] = 'L' 或 'R'`
* `s` 是一个 **平衡** 字符串

##### 贪心： 最小分割点

```js
/**
 * @param {string} s
 * @return {number}
 */
var balancedStringSplit = function(s) {
    let ans = 0, lCnt = 0, rCnt = 0;
    for (let x of s) {
        if (x == "L") {
            lCnt++;
        } else {
            rCnt++;
        }
        if (lCnt == rCnt) {
            ans++;
            lCnt = rCnt = 0;
        }
    }
    return ans;
};
```

#### [605. 种花问题](https://leetcode.cn/problems/can-place-flowers/description/)

假设有一个很长的花坛，一部分地块种植了花，另一部分却没有。可是，花不能种植在相邻的地块上，它们会争夺水源，两者都会死去。

给你一个整数数组 `flowerbed` 表示花坛，由若干 `0` 和 `1` 组成，其中 `0` 表示没种植花，`1` 表示种植了花。另有一个数 `n`，能否在不打破种植规则的情况下种入 `n`朵花？能则返回 `true` ，不能则返回 `false` 。

**示例 1：**

```
输入：flowerbed = [1,0,0,0,1], n = 1
输出：true
```

**示例 2：**

```
输入：flowerbed = [1,0,0,0,1], n = 2
输出：false
```

**提示：**

* `1 <= flowerbed.length <= 2 * 104`
* `flowerbed[i]` 为 `0` 或 `1`
* `flowerbed` 中不存在相邻的两朵花
* `0 <= n <= flowerbed.length`

##### 贪心：能种花就立刻种花

```js
/**
 * @param {number[]} flowerbed
 * @param {number} n
 * @return {boolean}
 */
var canPlaceFlowers = function(flowerbed, n) {
    for (let i = 0; i < flowerbed.length; i++) {
        if (flowerbed[i] == 0 &&  (i == 0 || flowerbed[i - 1] == 0) && (i == flowerbed.length - 1 ||  flowerbed[i + 1] == 0)) {
            flowerbed[i] = 1;
            n--;
        }
        if (n <= 0) return true;
    }
    return false;
};
```

#### [1827. 最少操作使数组递增](https://leetcode.cn/problems/minimum-operations-to-make-the-array-increasing/description/)

给你一个整数数组 `nums` （**下标从 0 开始**）。每一次操作中，你可以选择数组中一个元素，并将它增加 `1` 。

* 比方说，如果 `nums = [1,2,3]` ，你可以选择增加 `nums[1]` 得到 `nums = [1,3,3]` 。

请你返回使 `nums` **严格递增** 的 **最少** 操作次数。

我们称数组 `nums` 是 **严格递增的** ，当它满足对于所有的 `0 <= i < nums.length - 1` 都有 `nums[i] < nums[i+1]` 。一个长度为 `1` 的数组是严格递增的一种特殊情况。

**示例 1：**

```
输入：nums = [1,1,1]
输出：3
解释：你可以进行如下操作：
1) 增加 nums[2] ，数组变为 [1,1,2] 。
2) 增加 nums[1] ，数组变为 [1,2,2] 。
3) 增加 nums[2] ，数组变为 [1,2,3] 。
```

**示例 2：**

```
输入：nums = [1,5,2,4,1]
输出：14
```

**示例 3：**

```
输入：nums = [8]
输出：0
```

**提示：**

* `1 <= nums.length <= 5000`
* `1 <= nums[i] <= 104`

##### 贪心

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var minOperations = function(nums) {
    let ans = 0;
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] <= nums[i - 1]) {
            ans += nums[i - 1] - nums[i] + 1;
            nums[i] = nums[i - 1] + 1;
        }
    }
    return ans;
};
```

#### [826. 安排工作以达到最大收益](https://leetcode.cn/problems/most-profit-assigning-work/description/)

你有 `n` 个工作和 `m` 个工人。给定三个数组： `difficulty`, `profit` 和 `worker` ，其中:

* `difficulty[i]` 表示第 `i` 个工作的难度，`profit[i]` 表示第 `i` 个工作的收益。
* `worker[i]` 是第 `i` 个工人的能力，即该工人只能完成难度小于等于 `worker[i]` 的工作。

每个工人 **最多** 只能安排 **一个** 工作，但是一个工作可以 **完成多次** 。

* 举个例子，如果 3 个工人都尝试完成一份报酬为 `$1` 的同样工作，那么总收益为 `$3` 。如果一个工人不能完成任何工作，他的收益为 `$0` 。

返回 *在把工人分配到工作岗位后，我们所能获得的最大利润*。

**示例 1：**

```
输入: difficulty = [2,4,6,8,10], profit = [10,20,30,40,50], worker = [4,5,6,7]
输出: 100 
解释: 工人被分配的工作难度是 [4,4,6,6] ，分别获得 [20,20,30,30] 的收益。
```

**示例 2:**

```
输入: difficulty = [85,47,57], profit = [24,66,99], worker = [40,25,25]
输出: 0
```

**提示:**

* `n == difficulty.length`
* `n == profit.length`
* `m == worker.length`
* `1 <= n, m <= 104`
* `1 <= difficulty[i], profit[i], worker[i] <= 105`

##### 贪心，work排序，[difficulty, profit]按difficulty排序，遍历work解锁能完成的diffcult，计算已解锁profit的最大值max，当前work的最大收益为max

```js
/**
 * @param {number[]} difficulty
 * @param {number[]} profit
 * @param {number[]} worker
 * @return {number}
 */
var maxProfitAssignment = function (difficulty, profit, worker) {
    const n = difficulty.length, m = worker.length;
    worker.sort((a, b) => a - b);
    const sortedProfit = Array.from({ length: n }, (_, i) => [difficulty[i], profit[i]]).sort((a, b) => a[0] - b[0]);
    let l = 0, max = 0, ans = 0;
    for (let i = 0; i < m; i++) {
        const w = worker[i];
        if (sortedProfit[l][0] > w) {
            ans += max;
            continue;
        }
        while (l < n && sortedProfit[l][0] <= w) {
            max = Math.max(max, sortedProfit[l++][1])
        }
        if (l == n) {
            ans += max * (m - i)
            break;
        }
        ans += max;
    }

    return ans;
};
```

#### [870. 优势洗牌](https://leetcode.cn/problems/advantage-shuffle/description/)

给定两个长度相等的数组 `nums1` 和 `nums2`，`nums1` 相对于 `nums2` 的*优势*可以用满足 `nums1[i] > nums2[i]` 的索引 `i` 的数目来描述。

返回 `nums1` 的 **任意**排列，使其相对于 `nums2` 的优势最大化。

**示例 1：**

```
输入：nums1 = [2,7,11,15], nums2 = [1,10,4,11]
输出：[2,11,7,15]
```

**示例 2：**

```
输入：nums1 = [12,24,8,32], nums2 = [13,25,32,11]
输出：[24,32,8,12]
```

**提示：**

* `1 <= nums1.length <= 105`
* `nums2.length == nums1.length`
* `0 <= nums1[i], nums2[i] <= 109`

##### 贪心：田忌赛马 双指针

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var advantageCount = function(nums1, nums2) {
    nums1.sort((a, b) => a - b);
    const n = nums1.length;
    const sorted = Array.from({length: n}, (_, i) => i).sort((a, b) => nums2[a] - nums2[b]);
    const ans = Array(n);
    for (let i = 0, l = 0, r = n - 1; i < n; i++) {
        if (nums1[i] > nums2[sorted[l]]) {
            ans[sorted[l++]] = nums1[i]
        } else {
            ans[sorted[r--]] = nums1[i];
        }
    }

    return ans;
};
```

#### [1018. 可被 5 整除的二进制前缀](https://leetcode.cn/problems/binary-prefix-divisible-by-5/description/)

给定一个二进制数组 `nums` ( **索引从0开始**)。

我们将`xi` 定义为其二进制表示形式为子数组 `nums[0..i]` (从最高有效位到最低有效位)。

* 例如，如果 `nums =[1,0,1]` ，那么 `x0 = 1`, `x1 = 2`, 和 `x2 = 5`。

返回布尔值列表 `answer`，只有当 `xi`可以被 `5` 整除时，答案 `answer[i]` 为 `true`，否则为 `false`。

**示例 1：**

```
输入：nums = [0,1,1]
输出：[true,false,false]
解释：
输入数字为 0, 01, 011；也就是十进制中的 0, 1, 3 。只有第一个数可以被 5 整除，因此 answer[0] 为 true 。
```

**示例 2：**

```
输入：nums = [1,1,1]
输出：[false,false,false]
```

**提示：**

* `1 <= nums.length <= 105`
* `nums[i]` 仅为 `0` 或 `1`

##### 模拟 对5取模

```js
/**
 * @param {number[]} nums
 * @return {boolean[]}
 */
var prefixesDivBy5 = function(nums) {
    const n = nums.length;
    const ans = Array(n);
    let mask = 0;
    for (let i = 0; i < n; i++) {
        mask = ((mask << 1) | nums[i]) % 5;
        ans[i] = mask % 5 == 0
    }
    return ans;
};

const MOD= 1e9 + 7;
```

