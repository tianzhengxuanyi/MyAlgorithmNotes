### 2025-11-25

#### [1024. 视频拼接](https://leetcode.cn/problems/video-stitching/description/)

你将会获得一系列视频片段，这些片段来自于一项持续时长为 `time` 秒的体育赛事。这些片段可能有所重叠，也可能长度不一。

使用数组 `clips` 描述所有的视频片段，其中 `clips[i] = [starti, endi]` 表示：某个视频片段开始于 `starti` 并于 `endi` 结束。

甚至可以对这些片段自由地再剪辑：

* 例如，片段 `[0, 7]` 可以剪切成 `[0, 1] + [1, 3] + [3, 7]` 三部分。

我们需要将这些片段进行再剪辑，并将剪辑后的内容拼接成覆盖整个运动过程的片段（`[0, time]`）。返回所需片段的最小数目，如果无法完成该任务，则返回 `-1` 。

**示例 1：**

```
输入：clips = [[0,2],[4,6],[8,10],[1,9],[1,5],[5,9]], time = 10
输出：3
解释：
选中 [0,2], [8,10], [1,9] 这三个片段。
然后，按下面的方案重制比赛片段：
将 [1,9] 再剪辑为 [1,2] + [2,8] + [8,9] 。
现在手上的片段为 [0,2] + [2,8] + [8,10]，而这些覆盖了整场比赛 [0, 10]。
```

**示例 2：**

```
输入：clips = [[0,1],[1,2]], time = 5
输出：-1
解释：
无法只用 [0,1] 和 [1,2] 覆盖 [0,5] 的整个过程。
```

**示例 3：**

```
输入：clips = [[0,1],[6,8],[0,2],[5,6],[0,4],[0,3],[6,7],[1,3],[4,7],[1,4],[2,5],[2,6],[3,4],[4,5],[5,7],[6,9]], time = 9
输出：3
解释： 
选取片段 [0,4], [4,7] 和 [6,9] 。
```

**提示：**

* `1 <= clips.length <= 100`
* `0 <= starti <= endi <= 100`
* `1 <= time <= 100`

##### 贪心：记录每个左端点的最远右端点，依次枚举寻找能覆盖的区间

```js
/**
 * @param {number[][]} clips
 * @param {number} time
 * @return {number}
 */
var videoStitching = function (clips, time) {
    // 记录每个左端点的最远右端点
    const maxRight = Array(time + 1).fill(0);
    for (let [s, e] of clips) {
        if (s < time) {
            maxRight[s] = Math.max(maxRight[s], e)
        }
    }
    let ans = 0, pre = 0, // 当前片段的右端点
     last = 0;
    for (let i = 0; i < time; i++) {
        last = Math.max(last, maxRight[i]); // 更新最远右端点
        if (i == last) { // 下一个位置无法被覆盖
            return -1;
        }
        if (i == pre) { // 完成一个片段
            pre = last; // 下个片段的最右端点
            ans++;
        }
    }

    return ans;

};
```

##### 贪心：排序，每个片段中选择右端点最大的为下一个片段

```js
/**
 * @param {number[][]} clips
 * @param {number} time
 * @return {number}
 */
var videoStitching = function (clips, time) {
    clips.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
    if (clips[0][0] > 0) return -1;
    let [s, e] = clips[0];
    let maxE = e, i = 1, ans = 1;
    // 第一个区间选择[0, 右端点最大]
    // 后续选择第一区间中右端点最大的区间最为下一个片段
    while (i < clips.length && maxE < time) {
        while (i < clips.length && clips[i][0] <= e) {
            if (clips[i][1] > maxE) { // 选择右端点更大的区间
                maxE = clips[i][1];
            }
            i++
        }
        e = maxE;
        ans++; // 选中这个片段
        if (i < clips.length && clips[i][0] > e) {
            // 存在断点
            return -1;
        }
    }
    return maxE < time ? -1 : ans;
};
```

#### [452. 用最少数量的箭引爆气球](https://leetcode.cn/problems/minimum-number-of-arrows-to-burst-balloons/description/)

有一些球形气球贴在一堵用 XY 平面表示的墙面上。墙面上的气球记录在整数数组 `points` ，其中`points[i] = [xstart, xend]` 表示水平直径在 `xstart` 和 `xend`之间的气球。你不知道气球的确切 y 坐标。

一支弓箭可以沿着 x 轴从不同点 **完全垂直** 地射出。在坐标 `x` 处射出一支箭，若有一个气球的直径的开始和结束坐标为 `xstart`，`xend`， 且满足  `xstart ≤ x ≤ xend`，则该气球会被 **引爆** 。可以射出的弓箭的数量 **没有限制** 。 弓箭一旦被射出之后，可以无限地前进。

给你一个数组 `points` ，*返回引爆所有气球所必须射出的 **最小** 弓箭数*。

**示例 1：**

```
输入：points = [[10,16],[2,8],[1,6],[7,12]]
输出：2
解释：气球可以用2支箭来爆破:
-在x = 6处射出箭，击破气球[2,8]和[1,6]。
-在x = 11处发射箭，击破气球[10,16]和[7,12]。
```

**示例 2：**

```
输入：points = [[1,2],[3,4],[5,6],[7,8]]
输出：4
解释：每个气球需要射出一支箭，总共需要4支箭。
```

**示例 3：**

```
输入：points = [[1,2],[2,3],[3,4],[4,5]]
输出：2
解释：气球可以用2支箭来爆破:
- 在x = 2处发射箭，击破气球[1,2]和[2,3]。
- 在x = 4处射出箭，击破气球[3,4]和[4,5]。
```

**提示:**

* `1 <= points.length <= 105`
* `points[i].length == 2`
* `-231 <= xstart < xend <= 231 - 1`

##### 贪心： 根据右端点排序，每次选右端点

```js
/**
 * @param {number[][]} points
 * @return {number}
 */
var findMinArrowShots = function(points) {
    points.sort((a, b) => a[1] - b[1]);
    const n = points.length;
    let ans = 0, r = -Infinity;
    for (let [s, e] of points) {
        if (s <= r) {
            continue;
        }
        r = e;
        ans++;
    }
    return ans;
};
```

#### [435. 无重叠区间](https://leetcode.cn/problems/non-overlapping-intervals/description/)

给定一个区间的集合 `intervals` ，其中 `intervals[i] = [starti, endi]` 。返回 *需要移除区间的最小数量，使剩余区间互不重叠*。

**注意** 只在一点上接触的区间是 **不重叠的**。例如 `[1, 2]` 和 `[2, 3]` 是不重叠的。

**示例 1:**

```
输入: intervals = [[1,2],[2,3],[3,4],[1,3]]
输出: 1
解释: 移除 [1,3] 后，剩下的区间没有重叠。
```

**示例 2:**

```
输入: intervals = [ [1,2], [1,2], [1,2] ]
输出: 2
解释: 你需要移除两个 [1,2] 来使剩下的区间没有重叠。
```

**示例 3:**

```
输入: intervals = [ [1,2], [2,3] ]
输出: 0
解释: 你不需要移除任何区间，因为它们已经是无重叠的了。
```

**提示:**

* `1 <= intervals.length <= 105`
* `intervals[i].length == 2`
* `-5 * 104 <= starti < endi <= 5 * 104`

##### 贪心： 计算留下来最多的区间，每次选右端点最小的区间，

```js
/**
 * @param {number[][]} intervals
 * @return {number}
 */
var eraseOverlapIntervals = function(intervals) {
    intervals.sort((a, b) => a[1] - b[1]);
    let cnt = 0, n = intervals.length;
    let r = -Infinity;
    for (let i = 0; i < n; i++) {
        if (intervals[i][0] < r) continue;
        cnt += 1;
        r = intervals[i][1];
    }
    return n - cnt;
};
```

#### [767. 重构字符串](https://leetcode.cn/problems/reorganize-string/description/)

给定一个字符串 `s` ，检查是否能重新排布其中的字母，使得两相邻的字符不同。

返回 *`s` 的任意可能的重新排列。若不可行，返回空字符串 `""`* 。

**示例 1:**

```
输入: s = "aab"
输出: "aba"
```

**示例 2:**

```
输入: s = "aaab"
输出: ""
```

**提示:**

* `1 <= s.length <= 500`
* `s` 只包含小写字母

##### 贪心： 按照词频顺序，先填偶数下标再填奇数下标

```js
/**
 * @param {string} s
 * @return {string}
 */
var reorganizeString = function(s) {
    const cnt = new Map(), n = s.length;
    for (let x of s) {
        cnt.set(x, (cnt.get(x) ?? 0) + 1);
    }
    const paris = Array.from(cnt.entries());
    paris.sort((a, b) => a[1] - b[1]);
    const len = paris.length;
    if (paris[len - 1][1] > n - paris[len - 1][1] + 1) return "";
    const ans = Array(n);
    let idx = len - 1;
    for (let i = 0; i < n; i+= 2) {
        ans[i] = paris[idx][0];
        paris[idx][1] -= 1;
        if (paris[idx][1] == 0) {
            idx--;
        };
    }
    for (let i = 1; i < n; i+= 2) {
        ans[i] = paris[idx][0];
        paris[idx][1] -= 1;
        if (paris[idx][1] == 0) {
            idx--;
        };
    }
    return ans.join("")
};
```

#### [2335. 装满杯子需要的最短总时长](https://leetcode.cn/problems/minimum-amount-of-time-to-fill-cups/description/)

现有一台饮水机，可以制备冷水、温水和热水。每秒钟，可以装满 `2` 杯 **不同** 类型的水或者 `1` 杯任意类型的水。

给你一个下标从 **0** 开始、长度为 `3` 的整数数组 `amount` ，其中 `amount[0]`、`amount[1]` 和 `amount[2]` 分别表示需要装满冷水、温水和热水的杯子数量。返回装满所有杯子所需的 **最少** 秒数。

**示例 1：**

```
输入：amount = [1,4,2]
输出：4
解释：下面给出一种方案：
第 1 秒：装满一杯冷水和一杯温水。
第 2 秒：装满一杯温水和一杯热水。
第 3 秒：装满一杯温水和一杯热水。
第 4 秒：装满一杯温水。
可以证明最少需要 4 秒才能装满所有杯子。
```

**示例 2：**

```
输入：amount = [5,4,4]
输出：7
解释：下面给出一种方案：
第 1 秒：装满一杯冷水和一杯热水。
第 2 秒：装满一杯冷水和一杯温水。
第 3 秒：装满一杯冷水和一杯温水。
第 4 秒：装满一杯温水和一杯热水。
第 5 秒：装满一杯冷水和一杯热水。
第 6 秒：装满一杯冷水和一杯温水。
第 7 秒：装满一杯热水。
```

**示例 3：**

```
输入：amount = [5,0,0]
输出：5
解释：每秒装满一杯冷水。
```

**提示：**

* `amount.length == 3`
* `0 <= amount[i] <= 100`

##### 贪心： 邻项消除

```js
/**
 * @param {number[]} amount
 * @return {number}
 */
var fillCups = function(amount) {
    amount.sort((a, b) => a - b);
    if (amount[2] >= amount[0] + amount[1]) {
        return amount[2];
    } else {
        return Math.ceil((amount[0] + amount[1] + amount[2]) / 2);
    }

};
```

#### [1015. 可被 K 整除的最小整数](https://leetcode.cn/problems/smallest-integer-divisible-by-k/description/)

给定正整数 `k` ，你需要找出可以被 `k` 整除的、仅包含数字 `1` 的最 **小** 正整数 `n` 的长度。

返回 `n` 的长度。如果不存在这样的 `n` ，就返回-1。

**注意：** `n` 可能不符合 64 位带符号整数。

**示例 1：**

```
输入：k = 1
输出：1
解释：最小的答案是 n = 1，其长度为 1。
```

**示例 2：**

```
输入：k = 2
输出：-1
解释：不存在可被 2 整除的正整数 n 。
```

**示例 3：**

```
输入：k = 3
输出：3
解释：最小的答案是 n = 111，其长度为 3。
```

**提示：**

* `1 <= k <= 105`

##### 根据余数推出下一个余数

```js
/**
 * @param {number} k
 * @return {number}
 */
var smallestRepunitDivByK = function(k) {
    if (k == 1) return 1;
    if (k % 2 == 0 || k % 5 == 0) return -1;
    let resid = 1 % k, i = 1;
    while (resid) {
        resid = (resid * 10 + 1) % k
        i++;
    }
    return i
};
```

