### 2025-11-23

#### [455. 分发饼干](https://leetcode.cn/problems/assign-cookies/description/)

假设你是一位很棒的家长，想要给你的孩子们一些小饼干。但是，每个孩子最多只能给一块饼干。

对每个孩子 `i`，都有一个胃口值 `g[i]`，这是能让孩子们满足胃口的饼干的最小尺寸；并且每块饼干 `j`，都有一个尺寸 `s[j]`。如果 `s[j] >= g[i]`，我们可以将这个饼干 `j` 分配给孩子 `i` ，这个孩子会得到满足。你的目标是满足尽可能多的孩子，并输出这个最大数值。

**示例 1:**

```
输入: g = [1,2,3], s = [1,1]
输出: 1
解释: 
你有三个孩子和两块小饼干，3 个孩子的胃口值分别是：1,2,3。
虽然你有两块小饼干，由于他们的尺寸都是 1，你只能让胃口值是 1 的孩子满足。
所以你应该输出 1。
```

**示例 2:**

```
输入: g = [1,2], s = [1,2,3]
输出: 2
解释: 
你有两个孩子和三块小饼干，2 个孩子的胃口值分别是 1,2。
你拥有的饼干数量和尺寸都足以让所有孩子满足。
所以你应该输出 2。
```

**提示：**

* `1 <= g.length <= 3 * 104`
* `0 <= s.length <= 3 * 104`
* `1 <= g[i], s[j] <= 231 - 1`

**注意：**本题与 [2410. 运动员和训练师的最大匹配数](https://leetcode.cn/problems/maximum-matching-of-players-with-trainers/) 题相同。

##### 贪心

```js
/**
 * @param {number[]} g
 * @param {number[]} s
 * @return {number}
 */
var findContentChildren = function(g, s) {
    g.sort((a, b) => a - b);
    s.sort((a, b) => a - b);
    let ans = 0;
    for (let i = 0, j = 0; i < s.length && j < g.length; i++) {
        if (s[i] >= g[j]) {
            ans++;
            j++;
        }
    }
    return ans;
};
```

#### [792. 匹配子序列的单词数](https://leetcode.cn/problems/number-of-matching-subsequences/description/)

给定字符串 `s` 和字符串数组 `words`, 返回  *`words[i]` 中是`s`的子序列的单词个数* 。

字符串的 **子序列** 是从原始字符串中生成的新字符串，可以从中删去一些字符(可以是none)，而不改变其余字符的相对顺序。

* 例如， `“ace”` 是 `“abcde”` 的子序列。

**示例 1:**

```
输入: s = "abcde", words = ["a","bb","acd","ace"]
输出: 3
解释: 有三个是 s 的子序列的单词: "a", "acd", "ace"。
```

**Example 2:**

```
输入: s = "dsahjpjauf", words = ["ahjpjau","ja","ahbwzgqnuk","tnmlanowax"]
输出: 2
```

**提示:**

* `1 <= s.length <= 5 * 104`
* `1 <= words.length <= 5000`
* `1 <= words[i].length <= 50`
* `words[i]`和 s 都只由小写字母组成。

​​​​

##### 每个字符出现的位置 + 二分

```js
/**
 * @param {string} s
 * @param {string[]} words
 * @return {number}
 */
var numMatchingSubseq = function (s, words) {
    const n = s.length;
    const map = new Map();
    for (let i = 0; i < n; i++) {
        let idx = map.get(s[i]) ?? [];
        idx.push(i);
        map.set(s[i], idx);
    }
    let ans = 0;
    outer: for (let word of words) {
        let i = 0;
        for (let x of word) {
            let idx = map.get(x);
            if (!idx || idx[idx.length - 1] < i) continue outer;
            i = idx[lowerBound(idx, i)] + 1;
        }
        ans++;
    }
    return ans;
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

##### 预处理每个i右侧各个字符第一次出现的下标

```js
/**
 * @param {string} s
 * @param {string[]} words
 * @return {number}
 */
var numMatchingSubseq = function (s, words) {
    const n = s.length;
    const right = Array(n);
    const dict = Array(26).fill(-1);
    for (let i = n - 1; i >= 0; i--) {
        right[i + 1] = [...dict];
        let code = s[i].charCodeAt() - 97;
        dict[code] = i;
    }
    right[0] = dict;
    let ans = 0;
    outer: for (let word of words) {
        let k = 0;
        for (let i = 0; i < word.length; i++) {
            let code = word[i].charCodeAt() - 97;
            if (right[k][code] >= 0) {
                k = right[k][code] + 1;
            } else {
                continue outer;
            }
        }
        ans++;
    }
    return ans;
};
```

#### [1032. 字符流](https://leetcode.cn/problems/stream-of-characters/description/)

设计一个算法：接收一个字符流，并检查这些字符的后缀是否是字符串数组 `words` 中的一个字符串。

例如，`words = ["abc", "xyz"]` 且字符流中逐个依次加入 4 个字符 `'a'`、`'x'`、`'y'` 和 `'z'` ，你所设计的算法应当可以检测到 `"axyz"` 的后缀 `"xyz"` 与 `words` 中的字符串 `"xyz"` 匹配。

按下述要求实现 `StreamChecker` 类：

* `StreamChecker(String[] words)` ：构造函数，用字符串数组 `words` 初始化数据结构。
* `boolean query(char letter)`：从字符流中接收一个新字符，如果字符流中的任一非空后缀能匹配 `words` 中的某一字符串，返回 `true` ；否则，返回 `false`。

**示例：**

```
输入：
["StreamChecker", "query", "query", "query", "query", "query", "query", "query", "query", "query", "query", "query", "query"]
[[["cd", "f", "kl"]], ["a"], ["b"], ["c"], ["d"], ["e"], ["f"], ["g"], ["h"], ["i"], ["j"], ["k"], ["l"]]
输出：
[null, false, false, false, true, false, true, false, false, false, false, false, true]

解释：
StreamChecker streamChecker = new StreamChecker(["cd", "f", "kl"]);
streamChecker.query("a"); // 返回 False
streamChecker.query("b"); // 返回 False
streamChecker.query("c"); // 返回n False
streamChecker.query("d"); // 返回 True ，因为 'cd' 在 words 中
streamChecker.query("e"); // 返回 False
streamChecker.query("f"); // 返回 True ，因为 'f' 在 words 中
streamChecker.query("g"); // 返回 False
streamChecker.query("h"); // 返回 False
streamChecker.query("i"); // 返回 False
streamChecker.query("j"); // 返回 False
streamChecker.query("k"); // 返回 False
streamChecker.query("l"); // 返回 True ，因为 'kl' 在 words 中
```

**提示：**

* `1 <= words.length <= 2000`
* `1 <= words[i].length <= 200`
* `words[i]` 由小写英文字母组成
* `letter` 是一个小写英文字母
* 最多调用查询 `4 * 104` 次

##### words倒序构建字典树

```js
/**
 * @param {string[]} words
 */
var StreamChecker = function(words) {
    this.tree = new TireNode();
    for (let word of words) {
        let node = this.tree;
        for (let i = word.length - 1; i >= 0; i--) {
            let code = word[i].charCodeAt() - 97;
            if (!node.next[code]) {
                node.next[code] = new TireNode();
            }
            node = node.next[code];
        }
        node.end = true;
    }
    this.s = "";
};

/** 
 * @param {character} letter
 * @return {boolean}
 */
StreamChecker.prototype.query = function(letter) {
    this.s += letter;
    let node = this.tree;
    for (let i = this.s.length - 1; i >= 0; i--) {
        let code = this.s[i].charCodeAt() - 97;
        if (!node.next[code]) {
            return false;
        }
        node = node.next[code];
        if (node.end) {
            return true;
        }
    }
    return false;
};

/** 
 * Your StreamChecker object will be instantiated and called as such:
 * var obj = new StreamChecker(words)
 * var param_1 = obj.query(letter)
 */

const TireNode = function () {
    this.next = Array(26);
    this.end = false;
}
```

#### [899. 有序队列](https://leetcode.cn/problems/orderly-queue/description/)

给定一个字符串 `s` 和一个整数 `k` 。你可以从 `s` 的前 `k` 个字母中选择一个，并把它加到字符串的末尾。

返回 *在应用上述步骤的任意数量的移动后，字典序最小的字符串*。

**示例 1：**

```
输入：s = "cba", k = 1
输出："acb"
解释：
在第一步中，我们将第一个字符（“c”）移动到最后，获得字符串 “bac”。
在第二步中，我们将第一个字符（“b”）移动到最后，获得最终结果 “acb”。
```

**示例 2：**

```
输入：s = "baaca", k = 3
输出："aaabc"
解释：
在第一步中，我们将第一个字符（“b”）移动到最后，获得字符串 “aacab”。
在第二步中，我们将第三个字符（“c”）移动到最后，获得最终结果 “aaabc”。
```

**提示：**

* `1 <= k <= S.length <= 1000`
* `s` 只由小写字母组成。

##### k > 1排序, k = 1最小表示法

```js
/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */
var orderlyQueue = function(s, k) {
    // 如果k > 1可以构造任意字符串
    if (k > 1) {
        return s.split("").sort().join("");
    }
    // 最小表示法
    let i = 0, j = 1, n = s.length;
    s = s + s;
    while (j < n) {
        let k = 0;
        while (j + k < 2 * n && s[i + k] == s[j + k]) {
            k++;
        }
        if (j + k < 2 * n && s[i + k] > s[j + k]) {
            i = i + k + 1;
            if (i >= j) {
                j = i + 1;
            }
        } else {
            j = j + k + 1;
        }
    }
    return s.slice(i, i + n)
};
```

#### [1163. 按字典序排在最后的子串](https://leetcode.cn/problems/last-substring-in-lexicographical-order/description/)

给你一个字符串 `s` ，找出它的所有子串并按字典序排列，返回排在最后的那个子串。

**示例 1：**

```
输入：s = "abab"
输出："bab"
解释：我们可以找出 7 个子串 ["a", "ab", "aba", "abab", "b", "ba", "bab"]。按字典序排在最后的子串是 "bab"。
```

**示例 2：**

```
输入：s = "leetcode"
输出："tcode"
```

**提示：**

* `1 <= s.length <= 4 * 105`
* `s` 仅含有小写英文字符。

##### 最小表示法模板 [双指针比较【图解】](https://leetcode.cn/problems/last-substring-in-lexicographical-order/submissions/)

```js
/**
 * @param {string} s
 * @return {string}
 */
var lastSubstring = function (s) {
    const n = s.length;
    let i = 0, j = 1;
    while (j < n) {
        let k = 0;
        while (j + k < n && s[i + k] == s[j + k]) {
            // s[i + k] == s[j + k]，当前比较字符相同，k后移一位，比较下一位。
            k++;
        }
        if (j + k < n && s[i + k] < s[j + k]) {
            // s[i + k] < s[j + k]，说明子串[i,..,i + k]的字典序小于子串[j,...,j + k]，
            // 并且[i,..,i + k]中任意的字符构成的后缀都是小于子串[j,...,j + k]构成的后缀。
            // 因为在后缀中一定存在s[i + k] < s[j + k]。因此[i,..,i + k]部分不会存在目标子串，直接跳过处理
            i = i + k + 1;
            // 如果更新后的i >= j，那么说明j也是包含在[i,..,i + k]中的，j更新为当前i的下一位查找新的子串。
            if (i >= j) {
                j = i + 1;
            }
        } else {
            // s[i + k] > s[j + k]，说明子串[i,..,i + k]的字典序大于子串[j,...,j + k]
            // 并且[i,..,i + k]中任意的字符构成的后缀都是大于子串[j,...,j + k]构成的后缀
            // 因此[j,..,j + k]部分不会存在目标子串，直接跳过处理，更新j = j + k + 1
            j = j + k + 1;
        }
    }

    return s.slice(i)
};
```

##### 比较后缀子串的字典序

```js
/**
 * @param {string} s
 * @return {string}
 */
var lastSubstring = function(s) {
    const n = s.length;
    let ans = s;
    for (let i = 1; i < n; i++) {
        let si = s.slice(i);
        if (si > ans) {
            ans = si;
        }
    }
    return ans;
};
```

#### [1262. 可被三整除的最大和](https://leetcode.cn/problems/greatest-sum-divisible-by-three/description/)

给你一个整数数组 `nums`，请你找出并返回能被三整除的元素 **最大和**。



**示例 1：**

```
输入：nums = [3,6,5,1,8]
输出：18
解释：选出数字 3, 6, 1 和 8，它们的和是 18（可被 3 整除的最大和）。
```

**示例 2：**

```
输入：nums = [4]
输出：0
解释：4 不能被 3 整除，所以无法选出数字，返回 0。
```

**示例 3：**

```
输入：nums = [1,2,3,4,4]
输出：12
解释：选出数字 1, 3, 4 以及 4，它们的和是 12（可被 3 整除的最大和）。
```

**提示：**

* `1 <= nums.length <= 4 * 104`
* `1 <= nums[i] <= 104`

##### 迭代 + 滚动数组

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSumDivThree = function (nums) {
    const n = nums.length;
    const f = Array.from({ length: 2 }, () => Array(3))
    f[n % 2][0] = 0, f[n % 2][1] = f[n % 2][2] = -Infinity;
    for (let i = n - 1; i >= 0; i--) {
        for (let m = 0; m < 3; m++) {
            f[i % 2][m] = Math.max(f[(i + 1) % 2][m], f[(i+1) % 2][(m - nums[i] % 3 + 3) % 3] + nums[i]);
        }
    };
    return f[0][0] <= -Infinity ? 0 : f[0][0];
};
```

##### dfs + 记忆化缓存

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSumDivThree = function (nums) {
    const n = nums.length;
    const memo = Array.from({ length: n }, () => Array(3))
    const dfs = (i, m) => {
        if (i == n - 1) {
            if (nums[i] % 3 == m) {
                return memo[i][m] = nums[i];
            } else {
                return memo[i][m] = m == 0 ? 0 : -Infinity;
            }
        }
        if (typeof memo[i][m] != "undefined") return memo[i][m];
        return memo[i][m] = Math.max(dfs(i + 1, m), dfs(i + 1, (m - nums[i] % 3 + 3) % 3) + nums[i]);
    }
    dfs(0, 0);
    return memo[0][0] <= -Infinity ? 0 : memo[0][0];
};
```

##### 贪心

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSumDivThree = function (nums) {
    let minMod1 = Infinity, pMinMod1 = Infinity;
    let minMod2 = Infinity, pMinMod2 = Infinity;
    let sum = 0;
    for (let x of nums) {
        sum += x;
        if (x % 3 == 1) {
            if (x <= minMod1) {
                pMinMod1 = minMod1, minMod1 = x;
            } else if (x < pMinMod1) {
                pMinMod1 = x;
            }
        } else if (x % 3 == 2) {
            if (x <= minMod2) {
                pMinMod2 = minMod2, minMod2 = x;
            } else if (x < pMinMod2) {
                pMinMod2 = x;
            }
        }
    }
    if (sum % 3 == 1) {
        sum -= Math.min(minMod1, minMod2 + pMinMod2)
    } else if (sum % 3 == 2) {
        sum -= Math.min(minMod2, minMod1 + pMinMod1)
    }

    return sum < -Infinity ? 0 : sum;
};
```

