### 2025-12-02

#### [374. 猜数字大小](https://leetcode.cn/problems/guess-number-higher-or-lower/description/)

我们正在玩猜数字游戏。猜数字游戏的规则如下：

我会从 `1` 到 `n` 随机选择一个数字。 请你猜选出的是哪个数字。（我选的数字在整个游戏中保持不变）。

如果你猜错了，我会告诉你，我选出的数字比你猜测的数字大了还是小了。

你可以通过调用一个预先定义好的接口 `int guess(int num)` 来获取猜测结果，返回值一共有三种可能的情况：

* `-1`：你猜的数字比我选出的数字大 （即 `num > pick`）。
* `1`：你猜的数字比我选出的数字小 （即 `num < pick`）。
* `0`：你猜的数字与我选出的数字相等。（即 `num == pick`）。

返回我选出的数字。

**示例 1：**

```
输入：n = 10, pick = 6
输出：6
```

**示例 2：**

```
输入：n = 1, pick = 1
输出：1
```

**示例 3：**

```
输入：n = 2, pick = 1
输出：1
```

**提示：**

* `1 <= n <= 231 - 1`
* `1 <= pick <= n`

##### 二分

```js
/** 
 * Forward declaration of guess API.
 * @param {number} num   your guess
 * @return 	     -1 if num is higher than the picked number
 *			      1 if num is lower than the picked number
 *               otherwise return 0
 * var guess = function(num) {}
 */

/**
 * @param {number} n
 * @return {number}
 */
var guessNumber = function(n) {
    let l = 1, r = n;
    while (l <= r) {
        let m = Math.floor((r - l) / 2) + l;
        if (guess(m) > 0) {
            l = m + 1;
        } else {
            r = m - 1;
        }
    }
    return l;
};
```

#### [278. 第一个错误的版本](https://leetcode.cn/problems/first-bad-version/description/)

你是产品经理，目前正在带领一个团队开发新的产品。不幸的是，你的产品的最新版本没有通过质量检测。由于每个版本都是基于之前的版本开发的，所以错误的版本之后的所有版本都是错的。

假设你有 `n` 个版本 `[1, 2, ..., n]`，你想找出导致之后所有版本出错的第一个错误的版本。

你可以通过调用 `bool isBadVersion(version)` 接口来判断版本号 `version` 是否在单元测试中出错。实现一个函数来查找第一个错误的版本。你应该尽量减少对调用 API 的次数。

**示例 1：**

```
输入：n = 5, bad = 4
输出：4
解释：
调用 isBadVersion(3) -> false 
调用 isBadVersion(5) -> true 
调用 isBadVersion(4) -> true
所以，4 是第一个错误的版本。
```

**示例 2：**

```
输入：n = 1, bad = 1
输出：1
```

**提示：**

* `1 <= bad <= n <= 231 - 1`

##### 二分

```js
/**
 * Definition for isBadVersion()
 * 
 * @param {integer} version number
 * @return {boolean} whether the version is bad
 * isBadVersion = function(version) {
 *     ...
 * };
 */

/**
 * @param {function} isBadVersion()
 * @return {function}
 */
var solution = function(isBadVersion) {
    /**
     * @param {integer} n Total versions
     * @return {integer} The first bad version
     */
    return function(n) {
        let l = 1, r = n;
        while (l <= r) {
            let m = Math.floor((r - l) / 2) + l;
            if (!isBadVersion(m)) {
                l = m + 1;
            } else {
                r = m - 1;
            }
        }
        return l;
    };
};
```

#### [942. 增减字符串匹配](https://leetcode.cn/problems/di-string-match/description/)

由范围 `[0,n]` 内所有整数组成的 `n + 1` 个整数的排列序列可以表示为长度为 `n` 的字符串 `s` ，其中:

* 如果 `perm[i] < perm[i + 1]` ，那么 `s[i] == 'I'`
* 如果 `perm[i] > perm[i + 1]` ，那么 `s[i] == 'D'`

给定一个字符串 `s` ，重构排列 `perm` 并返回它。如果有多个有效排列perm，则返回其中 **任何一个** 。

**示例 1：**

```
输入：s = "IDID"
输出：[0,4,1,3,2]
```

**示例 2：**

```
输入：s = "III"
输出：[0,1,2,3]
```

**示例 3：**

```
输入：s = "DDI"
输出：[3,2,0,1]
```

**提示：**

* `1 <= s.length <= 105`
* `s` 只包含字符 `"I"` 或 `"D"`

##### 贪心： 维护lo和hi，“I“取lo，“D“取hi

```js
/**
 * @param {string} s
 * @return {number[]}
 */
var diStringMatch = function(s) {
    const n = s.length, ans = Array(n + 1).fill(0);
    let lo = 0, hi = n;
    for (let i = 0; i < n; i++) {
        if (s[i] == "I") {
            ans[i] = lo++;
        } else {
            ans[i] = hi--;
        }
    }
    ans[n] = lo;
    return ans;
};
```

##### 用mn和mx维护最大和最小，遇到I，i+1取mx，++mx

```js
/**
 * @param {string} s
 * @return {number[]}
 */
var diStringMatch = function(s) {
    const n = s.length, ans = Array(n + 1).fill(0);
    let mn = 0, mx = 0;
    for (let i = 0; i < n; i++) {
        if (s[i] == "I") {
            ans[i + 1] = ++mx;
        } else {
            ans[i + 1] = --mn;
        }
    }
    for (let i = 0; i <= n; i++) {
        ans[i] -= mn;
    }
    return ans;
};
```

#### [2914. 使二进制字符串变美丽的最少修改次数](https://leetcode.cn/problems/minimum-number-of-changes-to-make-binary-string-beautiful/description/)

给你一个长度为偶数下标从 **0** 开始的二进制字符串 `s` 。

如果可以将一个字符串分割成一个或者更多满足以下条件的子字符串，那么我们称这个字符串是 **美丽的** ：

* 每个子字符串的长度都是 **偶数** 。
* 每个子字符串都 **只** 包含 `1` 或 **只** 包含 `0` 。

你可以将 `s` 中任一字符改成 `0` 或者 `1` 。

请你返回让字符串 `s` 美丽的**最少** 字符修改次数。

**示例 1：**

```
输入：s = "1001"
输出：2
解释：我们将 s[1] 改为 1 ，且将 s[3] 改为 0 ，得到字符串 "1100" 。
字符串 "1100" 是美丽的，因为我们可以将它分割成 "11|00" 。
将字符串变美丽最少需要 2 次修改。
```

**示例 2：**

```
输入：s = "10"
输出：1
解释：我们将 s[1] 改为 1 ，得到字符串 "11" 。
字符串 "11" 是美丽的，因为它已经是美丽的。
将字符串变美丽最少需要 1 次修改。
```

**示例 3：**

```
输入：s = "0000"
输出：0
解释：不需要进行任何修改，字符串 "0000" 已经是美丽字符串。
```

**提示：**

* `2 <= s.length <= 105`
* `s` 的长度为偶数。
* `s[i]` 要么是 `'0'` ，要么是 `'1'` 。

##### 美丽字符串等价于对于所有偶数下标 i，有s[i]=s[i+1]如果不满足上式，修改其中一个字母即可。

```js
/**
 * @param {string} s
 * @return {number}
 */
var minChanges = function(s) {
    let ans = 0;
    for (let i = 0; i < s.length; i += 2) {
        if (s[i] != s[i + 1]) {
            ans++;
        }
    }
    return ans;
};
```

#### [780. 到达终点](https://leetcode.cn/problems/reaching-points/description/)

给定四个整数 `sx` , `sy` ，`tx` 和 `ty`，如果通过一系列的**转换**可以从起点 `(sx, sy)` 到达终点 `(tx, ty)`，则返回 `true`，否则返回 `false`。

从点 `(x, y)` 可以**转换**到 `(x, x+y)`  或者 `(x+y, y)`。

**示例 1:**

```
输入: sx = 1, sy = 1, tx = 3, ty = 5
输出: true
解释:
可以通过以下一系列转换从起点转换到终点：
(1, 1) -> (1, 2)
(1, 2) -> (3, 2)
(3, 2) -> (3, 5)
```

**示例 2:**

```
输入: sx = 1, sy = 1, tx = 2, ty = 2 
输出: false
```

**示例 3:**

```
输入: sx = 1, sy = 1, tx = 1, ty = 1 
输出: true
```

**提示:**

* `1 <= sx, sy, tx, ty <= 109`

##### 反向计算，辗转相除

```js
/**
 * @param {number} sx
 * @param {number} sy
 * @param {number} tx
 * @param {number} ty
 * @return {boolean}
 */
var reachingPoints = function(sx, sy, tx, ty) {
    while (tx > sx && ty > sy && tx != ty) {
        if (tx > ty) {
            tx = tx % ty;
        } else {
            ty = ty % tx;
        }
    }
    if (sx == tx && sy == ty) {
        return true;
    } else if (sx == tx) {
        return ty > sy && (ty - sy) % sx == 0 ? true : false;
    } else if (sy == ty) {
        return tx > sx && (tx - sx) % sy == 0 ? true : false;
    }
    return false;
};
```

#### [3623. 统计梯形的数目 I](https://leetcode.cn/problems/count-number-of-trapezoids-i/description/)

给你一个二维整数数组 `points`，其中 `points[i] = [xi, yi]` 表示第 `i` 个点在笛卡尔平面上的坐标。

**水平梯形** 是一种凸四边形，具有 **至少一对**水平边（即平行于 x 轴的边）。两条直线平行当且仅当它们的斜率相同。

返回可以从 `points` 中任意选择四个不同点组成的 **水平梯形** 数量。

由于答案可能非常大，请返回结果对 `109 + 7` 取余数后的值。

**示例 1：**

**输入：** points = [[1,0],[2,0],[3,0],[2,2],[3,2]]

**输出：** 3

**解释：**

![](https://assets.leetcode.com/uploads/2025/05/01/desmos-graph-6.png) ![](https://assets.leetcode.com/uploads/2025/05/01/desmos-graph-7.png) ![](https://assets.leetcode.com/uploads/2025/05/01/desmos-graph-8.png)

有三种不同方式选择四个点组成一个水平梯形：

* 使用点 `[1,0]`、`[2,0]`、`[3,2]` 和 `[2,2]`。
* 使用点 `[2,0]`、`[3,0]`、`[3,2]` 和 `[2,2]`。
* 使用点 `[1,0]`、`[3,0]`、`[3,2]` 和 `[2,2]`。

**示例 2：**

**输入：** points = [[0,0],[1,0],[0,1],[2,1]]

**输出：** 1

**解释：**

![](https://assets.leetcode.com/uploads/2025/04/29/desmos-graph-5.png)

只有一种方式可以组成一个水平梯形。

**提示：**

* `4 <= points.length <= 105`
* `–108 <= xi, yi <= 108`
* 所有点两两不同。

##### 排序 + 哈希表 + 枚举

```js
/**
 * @param {number[][]} points
 * @return {number}
 */
var countTrapezoids = function (points) {
    const cnt = new Map();
    let ans = 0, xlines = 0;
    for (let [x, y] of points) {
        if (cnt.has(y)) {
            let cnty = cnt.get(y);
            let p = cnty * (cnty - 1) / 2;
            ans = (ans + ((xlines - p + MOD) % MOD) * cnt.get(y) % MOD) % MOD;
            xlines = (xlines + cnt.get(y)) % MOD;
        }
        cnt.set(y, ((cnt.get(y) ?? 0) + 1) % MOD)
    }

    return ans;
};

const MOD = 1e9 + 7;
```