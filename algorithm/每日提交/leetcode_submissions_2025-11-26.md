### 2025-11-26

#### [2285. 道路的最大总重要性](https://leetcode.cn/problems/maximum-total-importance-of-roads/description/)

给你一个整数  `n` ，表示一个国家里的城市数目。城市编号为  `0`  到  `n - 1` 。

给你一个二维整数数组  `roads` ，其中  `roads[i] = [ai, bi]`  表示城市  `ai`  和  `bi`  之间有一条  **双向**  道路。

你需要给每个城市安排一个从 `1`  到 `n`  之间的整数值，且每个值只能被使用 **一次** 。道路的 **重要性**  定义为这条道路连接的两座城市数值 **之和** 。

请你返回在最优安排下，**所有道路重要性** 之和 **最大**  为多少。

**示例 1：**

![](https://assets.leetcode.com/uploads/2022/04/07/ex1drawio.png)

```
输入：n = 5, roads = [[0,1],[1,2],[2,3],[0,2],[1,3],[2,4]]
输出：43
解释：上图展示了国家图和每个城市被安排的值 [2,4,5,3,1] 。
- 道路 (0,1) 重要性为 2 + 4 = 6 。
- 道路 (1,2) 重要性为 4 + 5 = 9 。
- 道路 (2,3) 重要性为 5 + 3 = 8 。
- 道路 (0,2) 重要性为 2 + 5 = 7 。
- 道路 (1,3) 重要性为 4 + 3 = 7 。
- 道路 (2,4) 重要性为 5 + 1 = 6 。
所有道路重要性之和为 6 + 9 + 8 + 7 + 7 + 6 = 43 。
可以证明，重要性之和不可能超过 43 。
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2022/04/07/ex2drawio.png)

```
输入：n = 5, roads = [[0,3],[2,4],[1,3]]
输出：20
解释：上图展示了国家图和每个城市被安排的值 [4,3,2,5,1] 。
- 道路 (0,3) 重要性为 4 + 5 = 9 。
- 道路 (2,4) 重要性为 2 + 1 = 3 。
- 道路 (1,3) 重要性为 3 + 5 = 8 。
所有道路重要性之和为 9 + 3 + 8 = 20 。
可以证明，重要性之和不可能超过 20 。
```

**提示：**

- `2 <= n <= 5 * 104`
- `1 <= roads.length <= 5 * 104`
- `roads[i].length == 2`
- `0 <= ai, bi <= n - 1`
- `ai != bi`
- 没有重复道路。

##### 统计节点度，按照度排序分配

```js
/**
 * @param {number} n
 * @param {number[][]} roads
 * @return {number}
 */
var maximumImportance = function (n, roads) {
  const deg = Array(n).fill(0);
  for (let [x, y] of roads) {
    deg[x]++, deg[y]++;
  }
  deg.sort((a, b) => a - b);
  let ans = 0;
  for (let i = 0; i < n; i++) {
    ans += deg[i] * (i + 1);
  }

  return ans;
};
```

#### [628. 三个数的最大乘积](https://leetcode.cn/problems/maximum-product-of-three-numbers/description/)

给你一个整型数组 `nums` ，在数组中找出由三个数组成的最大乘积，并输出这个乘积。

**示例 1：**

```
输入：nums = [1,2,3]
输出：6
```

**示例 2：**

```
输入：nums = [1,2,3,4]
输出：24
```

**示例 3：**

```
输入：nums = [-1,-2,-3]
输出：-6
```

**提示：**

- `3 <= nums.length <= 104`
- `-1000 <= nums[i] <= 1000`

##### 最大三个数和最小三个数

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maximumProduct = function (nums) {
  let max = -1001,
    pmax = -1001,
    tmax = -1001;
  let min = 1001,
    pmin = 1001,
    tmin = 1001;
  for (let x of nums) {
    if (x >= max) {
      (tmax = pmax), (pmax = max), (max = x);
    } else if (x >= pmax) {
      (tmax = pmax), (pmax = x);
    } else if (x >= tmax) {
      tmax = x;
    }

    if (x <= min) {
      (tmin = pmin), (pmin = min), (min = x);
    } else if (x <= pmin) {
      (tmin = pmin), (pmin = x);
    } else if (x <= tmin) {
      tmin = x;
    }
  }

  return Math.max(max * pmax * tmax, min * pmin * tmin, max * min * pmin);
};
```

#### [2578. 最小和分割](https://leetcode.cn/problems/split-with-minimum-sum/description/)

给你一个正整数  `num` ，请你将它分割成两个非负整数  `num1` 和  `num2` ，满足：

- `num1` 和  `num2`  直接连起来，得到  `num`  各数位的一个排列。
  - 换句话说，`num1` 和  `num2`  中所有数字出现的次数之和等于  `num`  中所有数字出现的次数。
- `num1` 和  `num2`  可以包含前导 0 。

请你返回  `num1` 和 `num2`  可以得到的和的 **最小** 值。

**注意：**

- `num`  保证没有前导 0 。
- `num1` 和  `num2`  中数位顺序可以与  `num`  中数位顺序不同。

**示例 1：**

```
输入：num = 4325
输出：59
解释：我们可以将 4325 分割成 num1 = 24 和 num2 = 35 ，和为 59 ，59 是最小和。
```

**示例 2：**

```
输入：num = 687
输出：75
解释：我们可以将 687 分割成 num1 = 68 和 num2 = 7 ，和为最优值 75 。
```

**提示：**

- `10 <= num <= 109`

##### 排序： 奇偶分组

```js
/**
 * @param {number} num
 * @return {number}
 */
var splitNum = function (num) {
  const digits = [];
  while (num) {
    digits.push(num % 10);
    num = Math.floor(num / 10);
  }
  digits.sort((a, b) => a - b);
  let num1 = 0,
    num2 = 0;
  for (let i = digits.length - 1, multi = 1; i >= 0; i -= 2, multi *= 10) {
    num1 = digits[i] * multi + num1;
    if (i - 1 >= 0) {
      num2 = digits[i - 1] * multi + num2;
    }
  }
  return num1 + num2;
};
```

#### [2160. 拆分数位后四位数字的最小和](https://leetcode.cn/problems/minimum-sum-of-four-digit-number-after-splitting-digits/description/)

给你一个四位  **正**  整数  `num` 。请你使用 `num`  中的 **数位** ，将  `num`  拆成两个新的整数  `new1`  和  `new2` 。`new1` 和  `new2`  中可以有  **前导 0** ，且  `num`  中 **所有**  数位都必须使用。

- 比方说，给你  `num = 2932` ，你拥有的数位包括：两个  `2` ，一个  `9`  和一个  `3` 。一些可能的  `[new1, new2]`  数对为  `[22, 93]`，`[23, 92]`，`[223, 9]` 和  `[2, 329]` 。

请你返回可以得到的  `new1`  和 `new2`  的 **最小**  和。

**示例 1：**

```
输入：num = 2932
输出：52
解释：可行的 [new1, new2] 数对为 [29, 23] ，[223, 9] 等等。
最小和为数对 [29, 23] 的和：29 + 23 = 52 。
```

**示例 2：**

```
输入：num = 4009
输出：13
解释：可行的 [new1, new2] 数对为 [0, 49] ，[490, 0] 等等。
最小和为数对 [4, 9] 的和：4 + 9 = 13 。
```

**提示：**

- `1000 <= num <= 9999`

##### 贪心： 最小化十位数字

```js
/**
 * @param {number} num
 * @return {number}
 */
var minimumSum = function (num) {
  const digit = String(num).split("").map(Number);
  digit.sort((a, b) => a - b);
  return digit[0] * 10 + digit[1] * 10 + digit[2] + digit[3];
};
```

#### [409. 最长回文串](https://leetcode.cn/problems/longest-palindrome/description/)

给定一个包含大写字母和小写字母的字符串  `s` ，返回  \*通过这些字母构造成的 **最长的 回文串\***  的长度。

在构造过程中，请注意 **区分大小写** 。比如  `"Aa"`  不能当做一个回文字符串。

**示例 1:**

```
输入:s = "abccccdd"
输出:7
解释:
我们可以构造的最长的回文串是"dccaccd", 它的长度是 7。
```

**示例 2:**

```
输入:s = "a"
输出:1
解释：可以构造的最长回文串是"a"，它的长度是 1。
```

**提示:**

- `1 <= s.length <= 2000`
- `s`  只由小写 **和/或** 大写英文字母组成

##### 贪心

```js
/**
 * @param {string} s
 * @return {number}
 */
var longestPalindrome = function (s) {
  if (s.length == 1) return 1;
  const cnt = new Map();
  for (let x of s) {
    cnt.set(x, (cnt.get(x) ?? 0) + 1);
  }
  let ans = 0,
    odd = 0;
  for (let [_, n] of cnt.entries()) {
    if (n % 2) {
      odd = 1;
      ans += n - 1;
    } else {
      ans += n;
    }
  }
  return ans + odd;
};
```

#### [738. 单调递增的数字](https://leetcode.cn/problems/monotone-increasing-digits/description/)

当且仅当每个相邻位数上的数字  `x`  和  `y`  满足  `x <= y`  时，我们称这个整数是**单调递增**的。

给定一个整数 `n` ，返回 \*小于或等于 `n` 的最大数字，且数字呈 **单调递增\*** 。

**示例 1:**

```
输入: n = 10
输出: 9
```

**示例 2:**

```
输入: n = 1234
输出: 1234
```

**示例 3:**

```
输入: n = 332
输出: 299
```

**提示:**

- `0 <= n <= 109`

##### 贪心：从低位向高位比较，如果不是单调递增，后续所有数变成 99..99，当前数减一

```js
/**
 * @param {number} n
 * @return {number}
 */
var monotoneIncreasingDigits = function (n) {
  let last = 10,
    ans = 0,
    multi = 1;
  while (n) {
    let m = n % 10;
    if (m > last) {
      // 如果不是单调递增，后续所有数变成99..99，当前数减一
      m = m - 1;
      ans = m * multi + multi - 1;
    } else {
      ans = m * multi + ans;
    }
    last = m;
    multi *= 10;
    n = Math.floor(n / 10);
  }

  return ans;
};
```

#### [3216. 交换后字典序最小的字符串](https://leetcode.cn/problems/lexicographically-smallest-string-after-a-swap/description/)

给你一个仅由数字组成的字符串 `s`，在最多交换一次 **相邻** 且具有相同 **奇偶性** 的数字后，返回可以得到的字典序最小的字符串。

如果两个数字都是奇数或都是偶数，则它们具有相同的奇偶性。例如，5 和 9、2 和 4 奇偶性相同，而 6 和 9 奇偶性不同。

**示例 1：**

**输入：** s = "45320"

**输出：** "43520"

**解释：**

`s[1] == '5'` 和 `s[2] == '3'` 都具有相同的奇偶性，交换它们可以得到字典序最小的字符串。

**示例 2：**

**输入：** s = "001"

**输出：** "001"

**解释：**

无需进行交换，因为 `s` 已经是字典序最小的。

**提示：**

- `2 <= s.length <= 100`
- `s` 仅由数字组成。

##### 从左向右扫描

```js
/**
 * @param {string} s
 * @return {string}
 */
var getSmallestString = function (s) {
  let ans = "";
  for (let i = 0; i < s.length; i++) {
    if (+s[i] % 2 == +s[i + 1] % 2 && +s[i] > +s[i + 1]) {
      ans += s[i + 1] + s[i] + s.slice(i + 2);
      return ans;
    }
    ans += s[i];
  }
  return s;
};
```

#### [1288. 删除被覆盖区间](https://leetcode.cn/problems/remove-covered-intervals/description/)

给你一个区间列表，请你删除列表中被其他区间所覆盖的区间。

只有当  `c <= a`  且  `b <= d`  时，我们才认为区间  `[a,b)` 被区间  `[c,d)` 覆盖。

在完成所有删除操作后，请你返回列表中剩余区间的数目。

**示例：**

```
输入：intervals = [[1,4],[3,6],[2,8]]
输出：2
解释：区间 [3,6] 被区间 [2,8] 覆盖，所以它被删除了。
```

**提示：**​​​​​​

- `1 <= intervals.length <= 1000`
- `0 <= intervals[i][0] < intervals[i][1] <= 10^5`
- 对于所有的  `i != j`：`intervals[i] != intervals[j]`

##### 贪心：排序

```js
/**
 * @param {number[][]} intervals
 * @return {number}
 */
var removeCoveredIntervals = function (intervals) {
  intervals.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  let ans = 0,
    l = -1,
    r = -1;
  for (let [s, e] of intervals) {
    if (e <= r) {
      continue;
    }
    r = e;
    ans++;
  }
  return ans;
};
```

#### [2435. 矩阵中和能被 K 整除的路径](https://leetcode.cn/problems/paths-in-matrix-whose-sum-is-divisible-by-k/description/)

给你一个下标从 **0**  开始的  `m x n`  整数矩阵  `grid`  和一个整数  `k` 。你从起点  `(0, 0)`  出发，每一步只能往 **下**  或者往 **右** ，你想要到达终点  `(m - 1, n - 1)` 。

请你返回路径和能被 `k`  整除的路径数目，由于答案可能很大，返回答案对  `109 + 7` **取余**  的结果。

**示例 1：**

![](https://assets.leetcode.com/uploads/2022/08/13/image-20220813183124-1.png)

```
输入：grid = [[5,2,4],[3,0,5],[0,7,2]], k = 3
输出：2
解释：有两条路径满足路径上元素的和能被 k 整除。
第一条路径为上图中用红色标注的路径，和为 5 + 2 + 4 + 5 + 2 = 18 ，能被 3 整除。
第二条路径为上图中用蓝色标注的路径，和为 5 + 3 + 0 + 5 + 2 = 15 ，能被 3 整除。
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2022/08/17/image-20220817112930-3.png)

```
输入：grid = [[0,0]], k = 5
输出：1
解释：红色标注的路径和为 0 + 0 = 0 ，能被 5 整除。
```

**示例 3：**

![](https://assets.leetcode.com/uploads/2022/08/12/image-20220812224605-3.png)

```
输入：grid = [[7,3,4,9],[2,3,6,2],[2,3,7,0]], k = 1
输出：10
解释：每个数字都能被 1 整除，所以每一条路径的和都能被 k 整除。
```

**提示：**

- `m == grid.length`
- `n == grid[i].length`
- `1 <= m, n <= 5 * 104`
- `1 <= m * n <= 5 * 104`
- `0 <= grid[i][j] <= 100`
- `1 <= k <= 50`

##### 递推 + 空间压缩

```js
/**
 * @param {number[][]} grid
 * @param {number} k
 * @return {number}
 */
var numberOfPaths = function (grid, k) {
  const m = grid.length,
    n = grid[0].length;
  const dp = Array.from({ length: 2 }, () =>
    Array.from({ length: n + 1 }, () => Array(k).fill(0))
  );
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (i == m - 1 && j == n - 1) {
        dp[i % 2][j][grid[i][j] % k] = 1;
        continue;
      }
      for (let mod = 0; mod < k; mod++) {
        let cm = grid[i][j] % k;
        let nm = (mod - cm + k) % k;
        dp[i % 2][j][mod] =
          (dp[(i + 1) % 2][j][nm] + dp[i % 2][j + 1][nm]) % MOD;
      }
    }
  }
  return dp[0][0][0];
};

const MOD = 1e9 + 7;
```

##### dfs+记忆化缓存

```js
/**
 * @param {number[][]} grid
 * @param {number} k
 * @return {number}
 */
var numberOfPaths = function (grid, k) {
  const m = grid.length,
    n = grid[0].length;
  const memo = Array.from({ length: m }, () =>
    Array.from({ length: n }, () => Array(k).fill(-1))
  );
  const dfs = (i, j, mod) => {
    if (i < 0 || i >= m || j < 0 || j >= n) {
      return 0;
    }
    if (i == m - 1 && j == n - 1) {
      return (memo[i][j][mod] = grid[i][j] % k == mod ? 1 : 0);
    }
    if (memo[i][j][mod] >= 0) return memo[i][j][mod];
    let cm = grid[i][j] % k;
    let nm = (mod - cm + k) % k;
    return (memo[i][j][mod] = (dfs(i + 1, j, nm) + dfs(i, j + 1, nm)) % MOD);
  };
  return dfs(0, 0, 0);
};

const MOD = 1e9 + 7;
```
