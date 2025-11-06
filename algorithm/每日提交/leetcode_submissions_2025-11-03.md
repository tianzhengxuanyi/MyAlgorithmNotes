### 2025-11-05

#### [611. 有效三角形的个数](https://leetcode.cn/problems/valid-triangle-number/description/)

给定一个包含非负整数的数组 `nums` ，返回其中可以组成三角形三条边的三元组个数。

**示例 1:**

```
输入: nums = [2,2,3,4]
输出: 3
解释:有效的组合是: 
2,3,4 (使用第一个 2)
2,3,4 (使用第二个 2)
2,2,3
```

**示例 2:**

```
输入: nums = [4,2,3,4]
输出: 4
```

**提示:**

* `1 <= nums.length <= 1000`
* `0 <= nums[i] <= 1000`

##### 优化相向双指针

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var triangleNumber = function(nums) {
    const n = nums.length;
    nums.sort((a, b) => a - b);
    let ans = 0;
    for (let i = n - 1; i >= 2; i--) {
        const c = nums[i];
        // 此时任意两个数相加都大于c，表示任意两个数相加都大于任意[0, i]中的数
        // 所以从k+1中任意选取3个数
        if (nums[0] + nums[1] > c) {
            ans += (i + 1) * (i - 1) * i / 6;
            break;
        }
        if (nums[i - 2] + nums[i - 1] <= c) {
            continue;
        }
        let l = 0, r = i - 1;
        while (l < r) {
            if (nums[l] + nums[r] > c) {
                ans += r - l;
                r--;
            } else {
                l++;
            }
        }
    }
    return ans;
};
```

##### 两数之和大于一个数，相向双指针

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var triangleNumber = function(nums) {
    const n = nums.length;
    nums.sort((a, b) => a - b);
    let ans = 0;
    for (let i = n - 1; i >= 2; i--) {
        const c = nums[i];
        let l = 0, r = i - 1;
        while (l < r) {
            if (nums[l] + nums[r] > c) {
                ans += r - l;
                r--;
            } else {
                l++;
            }
        }
    }
    return ans;
};
```

#### [3443. K 次修改后的最大曼哈顿距离](https://leetcode.cn/problems/maximum-manhattan-distance-after-k-changes/description/)

给你一个由字符 `'N'`、`'S'`、`'E'` 和 `'W'` 组成的字符串 `s`，其中 `s[i]` 表示在无限网格中的移动操作：

* `'N'`：向北移动 1 个单位。
* `'S'`：向南移动 1 个单位。
* `'E'`：向东移动 1 个单位。
* `'W'`：向西移动 1 个单位。

初始时，你位于原点 `(0, 0)`。你 **最多** 可以修改 `k` 个字符为任意四个方向之一。

请找出在 **按顺序** 执行所有移动操作过程中的 **任意时刻** ，所能达到的离原点的 **最大曼哈顿距离**。

**曼哈顿距离**定义为两个坐标点 `(xi, yi)` 和 `(xj, yj)` 的横向距离绝对值与纵向距离绝对值之和，即 `|xi - xj| + |yi - yj|`。

**示例 1：**

**输入：**s = "NWSE", k = 1

**输出：**3

**解释：**

将 `s[2]` 从 `'S'` 改为 `'N'` ，字符串 `s` 变为 `"NWNE"` 。

| 移动操作 | 位置 (x, y) | 曼哈顿距离 | 最大值 |
| --- | --- | --- | --- |
| s[0] == 'N' | (0, 1) | 0 + 1 = 1 | 1 |
| s[1] == 'W' | (-1, 1) | 1 + 1 = 2 | 2 |
| s[2] == 'N' | (-1, 2) | 1 + 2 = 3 | 3 |
| s[3] == 'E' | (0, 2) | 0 + 2 = 2 | 3 |

执行移动操作过程中，距离原点的最大曼哈顿距离是 3 。

**示例 2：**

**输入：**s = "NSWWEW", k = 3

**输出：**6

**解释：**

将 `s[1]` 从 `'S'` 改为 `'N'` ，将 `s[4]` 从 `'E'` 改为 `'W'` 。字符串 `s` 变为 `"NNWWWW"` 。

执行移动操作过程中，距离原点的最大曼哈顿距离是 6 。

**提示：**

* `1 <= s.length <= 105`
* `0 <= k <= s.length`
* `s` 仅由 `'N'`、`'S'`、`'E'` 和 `'W'` 。

##### 将两个方向较小字符当作整体

```js
/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var maxDistance = function (s, k) {
    let x = 0, y = 0;
    let ans = 0;
    for (let i = 0; i < s.length; i++) {
        switch (s[i]) {
            case "N":
                y++;
                break;
            case "S":
                y--;
                break;
            case "W":
                x++;
                break;
            case "E":
                x--;
                break;
        }
        // 将两个方向上较少的字母当作整体
        // 若整体大于k，则修改任意k个较小方向上的字母，距离增加 2 * k
        // 若整体小于k，则修改较小方向的所有字母，字符的距离为字符的长度
        ans = Math.max(ans, Math.min(Math.abs(x) + Math.abs(y) + 2 * k, i + 1));
    }

    return ans;
};
```

##### x和y单独计算

```js
/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var maxDistance = function (s, k) {
    const dict = { "N": 0, "S": 0, "E": 0, "W": 0 };
    let ans = 0;
    for (let d of s) {
        dict[d] += 1;
        let opx = Math.min(k, Math.min(dict.N, dict.S));
        let opy = Math.min(Math.max(k - opx, 0), Math.min(dict.E, dict.W));
        ans = Math.max(ans, Math.abs(dict.N - dict.S) + 2 * opx + 2 * opy + Math.abs(dict.E - dict.W));
    }
    return ans;
};
```

#### [343. 整数拆分](https://leetcode.cn/problems/integer-break/description/)

给定一个正整数 `n` ，将其拆分为 `k` 个 **正整数** 的和（ `k >= 2` ），并使这些整数的乘积最大化。

返回 *你可以获得的最大乘积* 。

**示例 1:**

```
输入: n = 2
输出: 1
解释: 2 = 1 + 1, 1 × 1 = 1。
```

**示例 2:**

```
输入: n = 10
输出: 36
解释: 10 = 3 + 3 + 4, 3 × 3 × 4 = 36。
```

**提示:**

* `2 <= n <= 58`

##### 动态规划

```js
/**
 * @param {number} n
 * @return {number}
 */
var integerBreak = function (n) {
    if (n == 2) return 1;
    // 将n至少拆分成两个数的最大乘积
    const dp = Array(n + 1).fill(0);
    for (let i = 2; i <= n; i++) {
        for (let j = 1; j < i; j++) {
            dp[i] = Math.max(dp[i], j * (i - j), j * dp[i - j]);
        }
    }
    return dp[n];
};
```

##### 数学，拆解出更多的3

```js
/**
 * @param {number} n
 * @return {number}
 */
var integerBreak = function (n) {
    if (n == 2) return 1;
    if (n == 3) return 2;
    if (n == 4) return 4;
    const m = n % 3;
    if (m == 0) {
        return Math.pow(3, n / 3);
    } else if (m == 1) {
        return 4 * Math.pow(3, (n - 4) / 3);
    } else {
        return 2 * Math.pow(3, (n - 2) / 3);
    }
};
```

#### [2217. 找到指定长度的回文数](https://leetcode.cn/problems/find-palindrome-with-fixed-length/description/)

给你一个整数数组 `queries` 和一个 **正** 整数 `intLength` ，请你返回一个数组 `answer` ，其中 `answer[i]` 是长度为 `intLength` 的 **正回文数** 中第`queries[i]` 小的数字，如果不存在这样的回文数，则为 `-1` 。

**回文数** 指的是从前往后和从后往前读一模一样的数字。回文数不能有前导 0 。

**示例 1：**

```
输入：queries = [1,2,3,4,5,90], intLength = 3
输出：[101,111,121,131,141,999]
解释：
长度为 3 的最小回文数依次是：
101, 111, 121, 131, 141, 151, 161, 171, 181, 191, 202, ...
第 90 个长度为 3 的回文数是 999 。
```

**示例 2：**

```
输入：queries = [2,4,6], intLength = 4
输出：[1111,1331,1551]
解释：
长度为 4 的前 6 个回文数是：
1001, 1111, 1221, 1331, 1441 和 1551 。
```

**提示：**

* `1 <= queries.length <= 5 * 104`
* `1 <= queries[i] <= 109`
* `1 <= intLength <= 15`

##### 只看左半部分，长度为l的第q个回文数的左半部分为10^a + q - 1, a为ceil(l/2)。再反转拼接回文数

```js
/**
 * @param {number[]} queries
 * @param {number} intLength
 * @return {number[]}
 */
var kthPalindrome = function (queries, intLength) {
    const odd = intLength % 2;
    const base = Math.pow(10, Math.ceil(intLength / 2) - 1);
    const ans = Array(queries.length).fill(-1);
    for (let i = 0; i < queries.length; i++) {
        let k = base + queries[i] - 1;
        if (k >= base * 10) {
            continue;
        }
        ans[i] = genPalindrome(k, odd);
    }

    return ans;
};

const genPalindrome = (i, odd) => {
    let x = odd ? Math.floor(i / 10) : i, p = i;
    while (x) {
        p = p * 10 + x % 10;
        x = Math.floor(x / 10);
    }
    return p;
}
```

#### [2396. 严格回文的数字](https://leetcode.cn/problems/strictly-palindromic-number/description/)

如果一个整数 `n` 在 `b` 进制下（`b` 为 `2` 到 `n - 2` 之间的所有整数）对应的字符串 **全部** 都是 **回文的** ，那么我们称这个数 `n` 是 **严格回文** 的。

给你一个整数 `n` ，如果 `n` 是 **严格回文** 的，请返回 `true` ，否则返回`false` 。

如果一个字符串从前往后读和从后往前读完全相同，那么这个字符串是 **回文的** 。

**示例 1：**

```
输入：n = 9
输出：false
解释：在 2 进制下：9 = 1001 ，是回文的。
在 3 进制下：9 = 100 ，不是回文的。
所以，9 不是严格回文数字，我们返回 false 。
注意在 4, 5, 6 和 7 进制下，n = 9 都不是回文的。
```

**示例 2：**

```
输入：n = 4
输出：false
解释：我们只考虑 2 进制：4 = 100 ，不是回文的。
所以我们返回 false 。
```

**提示：**

* `4 <= n <= 105`

##### n的n-2进制为12，不是回文数，且4也不是严格回文数，对任意n直接返回false

```js
/**
 * @param {number} n
 * @return {boolean}
 */
var isStrictlyPalindromic = function(n) {
    return false;
};
```

##### 任意进制回文数

```js
/**
 * @param {number} n
 * @return {boolean}
 */
var isStrictlyPalindromic = function(n) {
    for (let b = 2; b <= n - 2; b++) {
        let x = n, rev = 0;
        while (x) {
            rev = rev * b + x % b;
            x = Math.floor(x / b);
        }
        if (rev !== n) return false;
    }

    return true;
};
```

#### [9. 回文数](https://leetcode.cn/problems/palindrome-number/description/)

给你一个整数 `x` ，如果 `x` 是一个回文整数，返回 `true` ；否则，返回 `false` 。

回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。

* 例如，`121` 是回文，而 `123` 不是。

**示例 1：**

```
输入：x = 121
输出：true
```

**示例 2：**

```
输入：x = -121
输出：false
解释：从左向右读, 为 -121 。 从右向左读, 为 121- 。因此它不是一个回文数。
```

**示例 3：**

```
输入：x = 10
输出：false
解释：从右向左读, 为 01 。因此它不是一个回文数。
```

**提示：**

* `-231 <= x <= 231 - 1`

**进阶：**你能不将整数转为字符串来解决这个问题吗？

##### 如果可被10整除，且不为0直接返回false；
翻转一半数字，判断前后否相等

```js
/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
    if (x < 0 || (x % 10 == 0 && x != 0)) return false;
    let rev = 0;
    while (x > rev) {
        rev = rev * 10 + x % 10;
        x = Math.floor(x / 10);
    }

    return x == rev || Math.floor(rev / 10) == x;
};
```

#### [1968. 构造元素不等于两相邻元素平均值的数组](https://leetcode.cn/problems/array-with-elements-not-equal-to-average-of-neighbors/description/)

给你一个 **下标从 0 开始** 的数组 `nums` ，数组由若干 **互不相同的** 整数组成。你打算重新排列数组中的元素以满足：重排后，数组中的每个元素都 **不等于** 其两侧相邻元素的 **平均值** 。

更公式化的说法是，重新排列的数组应当满足这一属性：对于范围 `1 <= i < nums.length - 1` 中的每个 `i` ，`(nums[i-1] + nums[i+1]) / 2` **不等于** `nums[i]` 均成立 。

返回满足题意的任一重排结果。

**示例 1：**

```
输入：nums = [1,2,3,4,5]
输出：[1,2,4,5,3]
解释：
i=1, nums[i] = 2, 两相邻元素平均值为 (1+4) / 2 = 2.5
i=2, nums[i] = 4, 两相邻元素平均值为 (2+5) / 2 = 3.5
i=3, nums[i] = 5, 两相邻元素平均值为 (4+3) / 2 = 3.5
```

**示例 2：**

```
输入：nums = [6,2,0,9,7]
输出：[9,7,6,2,0]
解释：
i=1, nums[i] = 7, 两相邻元素平均值为 (9+6) / 2 = 7.5
i=2, nums[i] = 6, 两相邻元素平均值为 (7+2) / 2 = 4.5
i=3, nums[i] = 2, 两相邻元素平均值为 (6+0) / 2 = 3
```

**提示：**

* `3 <= nums.length <= 105`
* `0 <= nums[i] <= 105`

##### 贪心： 排序后，将数据从floor((n + 1) / 2)分为两部分，偶数填前一半，奇数填后一半

```js
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var rearrangeArray = function (nums) {
    const n = nums.length;
    nums.sort((a, b) => a - b);
    const ans = Array(n);
    let left = 0, right = Math.floor((n + 1) / 2);
    for (let i = 0; i < n; i++) {
        if (i % 2 == 0) {
            ans[i] = nums[left++];
        } else {
            ans[i] = nums[right++];
        }
    }

    return ans;
};
```

#### [519. 随机翻转矩阵](https://leetcode.cn/problems/random-flip-matrix/description/)

给你一个 `m x n` 的二元矩阵 `matrix` ，且所有值被初始化为 `0` 。请你设计一个算法，随机选取一个满足 `matrix[i][j] == 0` 的下标 `(i, j)` ，并将它的值变为 `1` 。所有满足 `matrix[i][j] == 0` 的下标 `(i, j)` 被选取的概率应当均等。

尽量最少调用内置的随机函数，并且优化时间和空间复杂度。

实现 `Solution` 类：

* `Solution(int m, int n)` 使用二元矩阵的大小 `m` 和 `n` 初始化该对象
* `int[] flip()` 返回一个满足 `matrix[i][j] == 0` 的随机下标 `[i, j]` ，并将其对应格子中的值变为 `1`
* `void reset()` 将矩阵中所有的值重置为 `0`

**示例：**

```
输入
["Solution", "flip", "flip", "flip", "reset", "flip"]
[[3, 1], [], [], [], [], []]
输出
[null, [1, 0], [2, 0], [0, 0], null, [2, 0]]

解释
Solution solution = new Solution(3, 1);
solution.flip();  // 返回 [1, 0]，此时返回 [0,0]、[1,0] 和 [2,0] 的概率应当相同
solution.flip();  // 返回 [2, 0]，因为 [1,0] 已经返回过了，此时返回 [2,0] 和 [0,0] 的概率应当相同
solution.flip();  // 返回 [0, 0]，根据前面已经返回过的下标，此时只能返回 [0,0]
solution.reset(); // 所有值都重置为 0 ，并可以再次选择下标返回
solution.flip();  // 返回 [2, 0]，此时返回 [0,0]、[1,0] 和 [2,0] 的概率应当相同
```

**提示：**

* `1 <= m, n <= 104`
* 每次调用`flip` 时，矩阵中至少存在一个值为 0 的格子。
* 最多调用 `1000` 次 `flip` 和 `reset` 方法。

##### 随机一个数，然后左右找未加入set的数返回

```js
/**
 * @param {number} m
 * @param {number} n
 */
var Solution = function (m, n) {
    this.fliped = new Set();
    this.cnt = m * n;
    this.m = m, this.n = n;
};

/**
 * @return {number[]}
 */
Solution.prototype.flip = function () {
    let a = Math.floor(Math.random() * this.cnt), b = a;
    while (a >= 0 && this.fliped.has(a)) a--;
    while (a < 0 && b < this.cnt && this.fliped.has(b)) b++;
    let c = a < 0 ? b : a;
    this.fliped.add(c);
    return [Math.floor(c / this.n), c % this.n];
};

/**
 * @return {void}
 */
Solution.prototype.reset = function () {
    this.fliped.clear();
};

/** 
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(m, n)
 * var param_1 = obj.flip()
 * obj.reset()
 */
```

##### 拒绝采样

```js
/**
 * @param {number} m
 * @param {number} n
 */
var Solution = function (m, n) {
    this.fliped = new Set();
    this.cnt = m * n;
    this.m = m, this.n = n;
};

/**
 * @return {number[]}
 */
Solution.prototype.flip = function () {
    while (true) {
        const rand = Math.floor(Math.random() * this.cnt);
        if (!this.fliped.has(rand)) {
            this.fliped.add(rand);
            return [Math.floor(rand / this.n), rand % this.n];
        }
    }
};

/**
 * @return {void}
 */
Solution.prototype.reset = function () {
    this.fliped.clear();
};

/** 
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(m, n)
 * var param_1 = obj.flip()
 * obj.reset()
 */
```

#### [497. 非重叠矩形中的随机点](https://leetcode.cn/problems/random-point-in-non-overlapping-rectangles/description/)

给定一个由非重叠的轴对齐矩形的数组 `rects` ，其中 `rects[i] = [ai, bi, xi, yi]` 表示 `(ai, bi)` 是第 `i` 个矩形的左下角点，`(xi, yi)` 是第 `i` 个矩形的右上角点。设计一个算法来随机挑选一个被某一矩形覆盖的整数点。矩形周长上的点也算做是被矩形覆盖。所有满足要求的点必须等概率被返回。

在给定的矩形覆盖的空间内的任何整数点都有可能被返回。

**请注意**，整数点是具有整数坐标的点。

实现 `Solution` 类:

* `Solution(int[][] rects)` 用给定的矩形数组 `rects` 初始化对象。
* `int[] pick()` 返回一个随机的整数点 `[u, v]` 在给定的矩形所覆盖的空间内。



**示例 1：**

![](https://assets.leetcode.com/uploads/2021/07/24/lc-pickrandomrec.jpg)

```
输入: 
["Solution", "pick", "pick", "pick", "pick", "pick"]
[[[[-2, -2, 1, 1], [2, 2, 4, 6]]], [], [], [], [], []]
输出: 
[null, [1, -2], [1, -1], [-1, -2], [-2, -2], [0, 0]]

解释：
Solution solution = new Solution([[-2, -2, 1, 1], [2, 2, 4, 6]]);
solution.pick(); // 返回 [1, -2]
solution.pick(); // 返回 [1, -1]
solution.pick(); // 返回 [-1, -2]
solution.pick(); // 返回 [-2, -2]
solution.pick(); // 返回 [0, 0]
```

**提示：**

* `1 <= rects.length <= 100`
* `rects[i].length == 4`
* `-109 <= ai < xi <= 109`
* `-109 <= bi < yi <= 109`
* `xi - ai <= 2000`
* `yi - bi <= 2000`
* 所有的矩形不重叠。
* `pick` 最多被调用 `104` 次。

##### 根据矩阵中的点的数量确定权重，前缀和；先随机矩阵，在随机矩阵中的点

```js
/**
 * @param {number[][]} rects
 */
var Solution = function(rects) {
    const n = rects.length;
    this.rects = rects;
    this.areas = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        const [a, b, x, y] = rects[i];
        // 根据矩阵内的点数而不是面积
        this.areas[i] = (this.areas[i - 1] ?? 0) + (x - a + 1) * (y - b + 1);
    }
};

/**
 * @return {number[]}
 */
Solution.prototype.pick = function() {
    const n = this.rects.length;
    const areaBound = this.areas[n - 1];
    const randArea = Math.floor(Math.random() * areaBound) + 1;
    let l = 0, r = n - 1;
    while (l <= r) {
        let m = Math.floor((r - l) / 2) + l;
        if (this.areas[m] < randArea) {
            l = m + 1;
        } else {
            r = m - 1;
        }
    }
    const [a, b, x, y] = this.rects[l];
    const w = x - a, h = y - b;
    const randX = Math.floor(Math.random() * (w + 1));
    const randY = Math.floor(Math.random() * (h + 1));
    return [a + randX, b + randY];
};


/** 
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(rects)
 * var param_1 = obj.pick()
 */
```

#### [1578. 使绳子变成彩色的最短时间](https://leetcode.cn/problems/minimum-time-to-make-rope-colorful/description/)

Alice 把 `n` 个气球排列在一根绳子上。给你一个下标从 **0** 开始的字符串 `colors` ，其中 `colors[i]` 是第 `i` 个气球的颜色。

Alice 想要把绳子装扮成 **五颜六色的** ，且她不希望两个连续的气球涂着相同的颜色，所以她喊来 Bob 帮忙。Bob 可以从绳子上移除一些气球使绳子变成 **彩色** 。给你一个 **下标从 0 开始**的整数数组 `neededTime` ，其中 `neededTime[i]` 是 Bob 从绳子上移除第 `i` 个气球需要的时间（以秒为单位）。

返回 Bob 使绳子变成 **彩色** 需要的 **最少时间** 。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/12/13/ballon1.jpg)

```
输入：colors = "abaac", neededTime = [1,2,3,4,5]
输出：3
解释：在上图中，'a' 是蓝色，'b' 是红色且 'c' 是绿色。
Bob 可以移除下标 2 的蓝色气球。这将花费 3 秒。
移除后，不存在两个连续的气球涂着相同的颜色。总时间 = 3 。
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2021/12/13/balloon2.jpg)

```
输入：colors = "abc", neededTime = [1,2,3]
输出：0
解释：绳子已经是彩色的，Bob 不需要从绳子上移除任何气球。
```

**示例 3：**

![](https://assets.leetcode.com/uploads/2021/12/13/balloon3.jpg)

```
输入：colors = "aabaa", neededTime = [1,2,3,4,1]
输出：2
解释：Bob 会移除下标 0 和下标 4 处的气球。这两个气球各需要 1 秒来移除。
移除后，不存在两个连续的气球涂着相同的颜色。总时间 = 1 + 1 = 2 。
```

**提示：**

* `n == colors.length == neededTime.length`
* `1 <= n <= 105`
* `1 <= neededTime[i] <= 104`
* `colors` 仅由小写英文字母组成

##### 贪心 每段保留最大

```js
/**
 * @param {string} colors
 * @param {number[]} neededTime
 * @return {number}
 */
var minCost = function(colors, neededTime) {
    let ans = 0, n = colors.length;
    for (let i = 0; i < n; i++) {
        let j = i, total = neededTime[i], max = neededTime[i];
        while (j < n && colors[j] == colors[j + 1]) {
            j++;
            total += neededTime[j];
            max = Math.max(max, neededTime[j]);
        }
        ans += (total - max);
        i = j;
    }
    return ans;
};
```

