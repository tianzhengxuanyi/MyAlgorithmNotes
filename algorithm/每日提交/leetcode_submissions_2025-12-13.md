### 2025-12-13

#### [53. 最大子数组和](https://leetcode.cn/problems/maximum-subarray/description/)

给你一个整数数组 `nums` ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

**子数组** 是数组中的一个连续部分。

**示例 1：**

```
输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
输出：6
解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
```

**示例 2：**

```
输入：nums = [1]
输出：1
```

**示例 3：**

```
输入：nums = [5,4,-1,7,8]
输出：23
```

**提示：**

* `1 <= nums.length <= 105`
* `-104 <= nums[i] <= 104`

**进阶：**如果你已经实现复杂度为 `O(n)` 的解法，尝试使用更为精妙的 **分治法** 求解。

##### 分治 递归

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
    const n = nums.length;
    const dfs = (l, r) => {
        if (l == r) {
            return [nums[l], nums[l], nums[l], nums[l]];
        }
        let m = Math.floor((r - l) / 2) + l;
        const [lsum1, rsum1, msum1, tsum1] = dfs(l, m);
        const [lsum2, rsum2, msum2, tsum2] = dfs(m + 1, r);
        let lsum = Math.max(lsum1, tsum1 + lsum2); // 以l为左端点的最大和
        let rsum = Math.max(rsum2, tsum2 + rsum1); // 以r为右端点的最大和
        let tsum = tsum1 + tsum2; // 区间[l, r]的和
        // 区间[l, r]内子数组的最大和
        // 1. msum的区间出现在[l, m]中且右端点不跨越m，最大和msum1
        // 2. msum的区间出现在[m+1, r]中且左端点不跨越m+1，最大和msum2
        // 3. msum的区间跨越m，最大和为rums1+lsum2
        let msum = Math.max(msum1, msum2, rsum1 + lsum2); 
        return [lsum, rsum, msum, tsum];
    }

    return dfs(0, n - 1)[2];
};
```

##### 前缀和

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    let n = nums.length;
    let ans = -Infinity, prefix = 0, mnPrefix = 0;
    for (let x of nums) {
        prefix += x;
        ans = Math.max(ans, prefix - mnPrefix);
        mnPrefix = Math.min(mnPrefix, prefix);
    }
    return ans;
};
```

##### 动态规划

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
    let ans = -Infinity, dp = 0;
    // dp为以nums[i - 1]为结尾的子数组的最大和
    for (let x of nums) {
        // dp_i: 1. 如果dp_i-1小于0，则子数组中只有nums[i]时和最大
        //       2. 如果dp_i-1大于0，则dp_i = dp_i-1 + nums[i]
        dp = Math.max(dp + x, x);
        ans = Math.max(ans, dp);
    }
    return ans;
};
```

#### [76. 最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/description/)

给定两个字符串 `s` 和 `t`，长度分别是 `m` 和 `n`，返回 s 中的 **最短窗口 子串**，使得该子串包含 `t` 中的每一个字符（**包括重复字符**）。如果没有这样的子串，返回空字符串`""`。

测试用例保证答案唯一。

**示例 1：**

```
输入：s = "ADOBECODEBANC", t = "ABC"
输出："BANC"
解释：最小覆盖子串 "BANC" 包含来自字符串 t 的 'A'、'B' 和 'C'。
```

**示例 2：**

```
输入：s = "a", t = "a"
输出："a"
解释：整个字符串 s 是最小覆盖子串。
```

**示例 3:**

```
输入: s = "a", t = "aa"
输出: ""
解释: t 中两个字符 'a' 均应包含在 s 的子串中，
因此没有符合条件的子字符串，返回空字符串。
```

**提示：**

* `m == s.length`
* `n == t.length`
* `1 <= m, n <= 105`
* `s` 和 `t` 由英文字母组成

**进阶：**你能设计一个在 `O(m + n)` 时间内解决此问题的算法吗？

##### 不定长滑动窗口，维护字符差异map 同438. 找到字符串中所有字母异位词

```js
/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function(s, t) {
    const m = s.length, n = t.length;
    if (m < n) return "";
    // t和s的字符差异
    const cnt = new Map();
    for (let c of t) {
        cnt.set(c, (cnt.get(c) ?? 0) + 1);
    }
    // 字符差异的种类数
    let diff = cnt.size;
    let mnLen = m, mnL = -1;
    for (let l = 0, r = 0; r < m; r++) {
        // r入窗口
        let c = s[r];
        cnt.set(c, (cnt.get(c) ?? 0) - 1);
        // 字符频次从1到0，差异消失
        if (cnt.get(c) == 0) {
            diff--;
        }
        // s子串包含了t的所有字符
        if (diff == 0) {
            // l右移寻找最小的窗口
            while (diff == 0 && l <= r) {
                // l出窗口
                let lc = s[l];
                cnt.set(lc, cnt.get(lc) + 1);
                // 字符频次从0到1，出现差异
                if (cnt.get(lc) == 1) {
                    diff++;
                }
                l++;
            }
            if (r - l + 2 <= mnLen) {
                mnLen = r - l + 2;
                mnL = l - 1;
            }
        }
    }
    return s.slice(mnL, mnL + mnLen)
};
```

#### [239. 滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/description/)

给你一个整数数组 `nums`，有一个大小为 `k`的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口内的 `k` 个数字。滑动窗口每次只向右移动一位。

返回 *滑动窗口中的最大值* 。

**示例 1：**

```
输入：nums = [1,3,-1,-3,5,3,6,7], k = 3
输出：[3,3,5,5,6,7]
解释：
滑动窗口的位置                最大值
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7
```

**示例 2：**

```
输入：nums = [1], k = 1
输出：[1]
```

**提示：**

* `1 <= nums.length <= 105`
* `-104 <= nums[i] <= 104`
* `1 <= k <= nums.length`

##### 数组模拟双端队列

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function(nums, k) {
    const n = nums.length;
    const q = Array(n), ans = Array(n - k + 1);
    let head = 0, tail = -1;
    for (let i = 0; i < n; i++) {
        // 入
        while (head <= tail && nums[i] >= nums[q[tail]]) {
            tail--;
        }
        q[++tail] = i;

        if (i < k - 1) continue;
        ans[i - k + 1] = nums[q[head]];
        // 出
        while (q[head] <= i - k + 1) {
            head++;
        }
    }
    return ans;
};
```

#### [3606. 优惠券校验器](https://leetcode.cn/problems/coupon-code-validator/description/)

给你三个长度为 `n` 的数组，分别描述 `n` 个优惠券的属性：`code`、`businessLine` 和 `isActive`。其中，第 `i` 个优惠券具有以下属性：

* `code[i]`：一个 **字符串**，表示优惠券的标识符。
* `businessLine[i]`：一个 **字符串**，表示优惠券所属的业务类别。
* `isActive[i]`：一个 **布尔值**，表示优惠券是否当前有效。

当以下所有条件都满足时，优惠券被认为是 **有效的**：

1. `code[i]` 不能为空，并且仅由字母数字字符（a-z、A-Z、0-9）和下划线（`_`）组成。
2. `businessLine[i]` 必须是以下四个类别之一：`"electronics"`、`"grocery"`、`"pharmacy"`、`"restaurant"`。
3. `isActive[i]` 为 **true**。

返回所有 **有效优惠券的标识符**组成的数组，按照以下规则排序：

* 先按照其 **businessLine** 的顺序排序：`"electronics"`、`"grocery"`、`"pharmacy"`、`"restaurant"`。
* 在每个类别内，再按照 **标识符的字典序（升序）**排序。

**示例 1：**

**输入：** code = ["SAVE20","","PHARMA5","SAVE@20"], businessLine = ["restaurant","grocery","pharmacy","restaurant"], isActive = [true,true,true,true]

**输出：** ["PHARMA5","SAVE20"]

**解释：**

* 第一个优惠券有效。
* 第二个优惠券的标识符为空（无效）。
* 第三个优惠券有效。
* 第四个优惠券的标识符包含特殊字符 `@`（无效）。

**示例 2：**

**输入：** code = ["GROCERY15","ELECTRONICS\_50","DISCOUNT10"], businessLine = ["grocery","electronics","invalid"], isActive = [false,true,true]

**输出：** ["ELECTRONICS\_50"]

**解释：**

* 第一个优惠券无效，因为它未激活。
* 第二个优惠券有效。
* 第三个优惠券无效，因为其业务类别无效。

**提示：**

* `n == code.length == businessLine.length == isActive.length`
* `1 <= n <= 100`
* `0 <= code[i].length, businessLine[i].length <= 100`
* `code[i]` 和 `businessLine[i]` 由可打印的 ASCII 字符组成。
* `isActive[i]` 的值为 `true` 或 `false`。

##### 分组 + 组内排序

```js
/**
 * @param {string[]} code
 * @param {string[]} businessLine
 * @param {boolean[]} isActive
 * @return {string[]}
 */
var validateCoupons = function (code, businessLine, isActive) {
    const valid = {
        "electronics": [], "grocery": [], "pharmacy": [], "restaurant": []
    };
    for (let i = 0; i < code.length; i++) {
        if (isActive[i] && isValidCode(code[i]) && isValidBusiness(businessLine[i])) {
            valid[businessLine[i]].push(code[i]);
        }
    }
    valid["electronics"].sort()
    valid["grocery"].sort()
    valid["pharmacy"].sort()
    valid["restaurant"].sort()
    return [...valid["electronics"], ...valid["grocery"],
    ...valid["pharmacy"], ...valid["restaurant"]];
};

const reg = /^[a-zA-Z0-9_]+$/
const isValidCode = (code) => {
    return reg.test(code);
}

const businesses = {
    "electronics": 1, "grocery": 2, "pharmacy": 3, "restaurant": 4
}
const isValidBusiness = (business) => {
    return !!businesses[business];
}
```

