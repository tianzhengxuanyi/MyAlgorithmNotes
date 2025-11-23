### 2025-11-22

#### [881. 救生艇](https://leetcode.cn/problems/boats-to-save-people/description/)

给定数组 `people` 。`people[i]`表示第 `i`个人的体重 ，**船的数量不限**，每艘船可以承载的最大重量为 `limit`。

每艘船最多可同时载两人，但条件是这些人的重量之和最多为 `limit`。

返回 *承载所有人所需的最小船数* 。

**示例 1：**

```
输入：people = [1,2], limit = 3
输出：1
解释：1 艘船载 (1, 2)
```

**示例 2：**

```
输入：people = [3,2,2,1], limit = 3
输出：3
解释：3 艘船分别载 (1, 2), (2) 和 (3)
```

**示例 3：**

```
输入：people = [3,5,3,4], limit = 5
输出：4
解释：4 艘船分别载 (3), (3), (4), (5)
```

**提示：**

* `1 <= people.length <= 5 * 104`
* `1 <= people[i] <= limit <= 3 * 104`

##### 贪心：最大和最小组合

```js
/**
 * @param {number[]} people
 * @param {number} limit
 * @return {number}
 */
var numRescueBoats = function (people, limit) {
    people.sort((a, b) =>  a - b);
    let cnt = 0;
    let i = 0, j = people.length - 1;
    while (i <= j) {
        if (people[i] + people[j] <= limit) {
            i++, j--;
        } else {
            j--;
        }
        cnt++;
    }
    return cnt;
};
```

#### [561. 数组拆分](https://leetcode.cn/problems/array-partition/description/)

给定长度为 `2n`的整数数组 `nums` ，你的任务是将这些数分成 `n`对, 例如 `(a1, b1), (a2, b2), ..., (an, bn)` ，使得从 `1` 到 `n` 的 `min(ai, bi)` 总和最大。

返回该 **最大总和** 。

**示例 1：**

```
输入：nums = [1,4,3,2]
输出：4
解释：所有可能的分法（忽略元素顺序）为：
1. (1, 4), (2, 3) -> min(1, 4) + min(2, 3) = 1 + 2 = 3
2. (1, 3), (2, 4) -> min(1, 3) + min(2, 4) = 1 + 2 = 3
3. (1, 2), (3, 4) -> min(1, 2) + min(3, 4) = 1 + 3 = 4
所以最大总和为 4
```

**示例 2：**

```
输入：nums = [6,2,6,5,1,2]
输出：9
解释：最优的分法为 (2, 1), (2, 5), (6, 6). min(2, 1) + min(2, 5) + min(6, 6) = 1 + 2 + 6 = 9
```

**提示：**

* `1 <= n <= 104`
* `nums.length == 2 * n`
* `-104 <= nums[i] <= 104`

##### 贪心： 排序后选偶数下标

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var arrayPairSum = function(nums) {
    nums.sort((a, b) => a - b);
    let sum = 0;
    for (let i = 0; i < nums.length; i += 2) {
        sum += nums[i];
    }
    return sum;
};
```

#### [3545. 不同字符数量最多为 K 时的最少删除数](https://leetcode.cn/problems/minimum-deletions-for-at-most-k-distinct-characters/description/)

给你一个字符串 `s`（由小写英文字母组成）和一个整数 `k`。

你的任务是删除字符串中的一些字符（可以不删除任何字符），使得结果字符串中的 **不同字符数量**最多为 `k`。

返回为达到上述目标所需删除的 **最小**字符数量。

**示例 1：**

**输入：** s = "abc", k = 2

**输出：** 1

**解释：**

* `s` 有三个不同的字符：`'a'`、`'b'` 和 `'c'`，每个字符的出现频率为 1。
* 由于最多只能有 `k = 2` 个不同字符，需要删除某一个字符的所有出现。
* 例如，删除所有 `'c'` 后，结果字符串中的不同字符数最多为 `k`。因此，答案是 1。

**示例 2：**

**输入：** s = "aabb", k = 2

**输出：** 0

**解释：**

* `s` 有两个不同的字符（`'a'` 和 `'b'`），它们的出现频率分别为 2 和 2。
* 由于最多可以有 `k = 2` 个不同字符，不需要删除任何字符。因此，答案是 0。

**示例 3：**

**输入：** s = "yyyzz", k = 1

**输出：** 2

**解释：**

* `s` 有两个不同的字符（`'y'` 和 `'z'`），它们的出现频率分别为 3 和 2。
* 由于最多只能有 `k = 1` 个不同字符，需要删除某一个字符的所有出现。
* 删除所有 `'z'` 后，结果字符串中的不同字符数最多为 `k`。因此，答案是 2。

**提示：**

* `1 <= s.length <= 16`
* `1 <= k <= 16`
* `s` 仅由小写英文字母组成。

##### 贪心

```js
/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var minDeletion = function(s, k) {
    const cnt = new Map();
    for (let x of s) {
        cnt.set(x, (cnt.get(x) ?? 0) + 1);
    }
    const size = cnt.size;
    const vals = Array.from(cnt.values()).sort((a, b) => a - b);
    let ans = 0;
    for (let i = 0; i < size - k; i++) {
        ans += vals[i];
    }
    return ans;
};
```

#### [3074. 重新分装苹果](https://leetcode.cn/problems/apple-redistribution-into-boxes/description/)

给你一个长度为 `n` 的数组 `apple` 和另一个长度为 `m` 的数组 `capacity` 。

一共有 `n` 个包裹，其中第 `i` 个包裹中装着 `apple[i]` 个苹果。同时，还有 `m` 个箱子，第 `i` 个箱子的容量为 `capacity[i]` 个苹果。

请你选择一些箱子来将这 `n` 个包裹中的苹果重新分装到箱子中，返回你需要选择的箱子的 **最小** 数量。

**注意**，同一个包裹中的苹果可以分装到不同的箱子中。

**示例 1：**

```
输入：apple = [1,3,2], capacity = [4,3,1,5,2]
输出：2
解释：使用容量为 4 和 5 的箱子。
总容量大于或等于苹果的总数，所以可以完成重新分装。
```

**示例 2：**

```
输入：apple = [5,5,5], capacity = [2,4,2,7]
输出：4
解释：需要使用所有箱子。
```

**提示：**

* `1 <= n == apple.length <= 50`
* `1 <= m == capacity.length <= 50`
* `1 <= apple[i], capacity[i] <= 50`
* 输入数据保证可以将包裹中的苹果重新分装到箱子中。

##### 贪心

```js
/**
 * @param {number[]} apple
 * @param {number[]} capacity
 * @return {number}
 */
var minimumBoxes = function(apple, capacity) {
    capacity.sort((a, b) => b - a);
    let cnt = apple.reduce((a, b) => a + b, 0);
    let ans = 0;
    for (let i = 0; cnt > 0; i++) {
        cnt -= capacity[i];
        ans++;
    }
    return ans;
};
```

#### [187. 重复的DNA序列](https://leetcode.cn/problems/repeated-dna-sequences/description/)

**DNA序列** 由一系列核苷酸组成，缩写为 `'A'`, `'C'`, `'G'` 和 `'T'`.。

* 例如，`"ACGAATTCCG"` 是一个 **DNA序列** 。

在研究 **DNA** 时，识别 DNA 中的重复序列非常有用。

给定一个表示 **DNA序列** 的字符串 `s` ，返回所有在 DNA 分子中出现不止一次的 **长度为 `10`** 的序列(子字符串)。你可以按 **任意顺序** 返回答案。

**示例 1：**

```
输入：s = "AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"
输出：["AAAAACCCCC","CCCCCAAAAA"]
```

**示例 2：**

```
输入：s = "AAAAAAAAAAAAA"
输出：["AAAAAAAAAA"]
```

**提示：**

* `0 <= s.length <= 105`
* `s[i]``==``'A'`、`'C'`、`'G'` or `'T'`

##### 哈希表

```js
/**
 * @param {string} s
 * @return {string[]}
 */
var findRepeatedDnaSequences = function(s) {
    const cnt = new Map(), n = s.length;
    const ans = [];
    for (let i = 0; i <= n - 10; i++) {
        let sub = s.slice(i, i + 10);
        cnt.set(sub, (cnt.get(sub) ?? 0) + 1);
        if (cnt.get(sub) == 2) {
            ans.push(sub);
        }
    }

    return ans;
};
```

#### [2156. 查找给定哈希值的子串](https://leetcode.cn/problems/find-substring-with-given-hash-value/description/)

给定整数 `p` 和 `m` ，一个长度为 `k` 且下标从 **0** 开始的字符串 `s` 的哈希值按照如下函数计算：

* `hash(s, p, m) = (val(s[0]) * p0 + val(s[1]) * p1 + ... + val(s[k-1]) * pk-1) mod m`.

其中 `val(s[i])` 表示 `s[i]` 在字母表中的下标，从 `val('a') = 1` 到 `val('z') = 26` 。

给你一个字符串 `s` 和整数 `power`，`modulo`，`k` 和 `hashValue` 。请你返回 `s` 中 **第一个** 长度为 `k` 的 **子串** `sub` ，满足`hash(sub, power, modulo) == hashValue` 。

测试数据保证一定 **存在** 至少一个这样的子串。

**子串** 定义为一个字符串中连续非空字符组成的序列。

**示例 1：**

```
输入：s = "leetcode", power = 7, modulo = 20, k = 2, hashValue = 0
输出："ee"
解释："ee" 的哈希值为 hash("ee", 7, 20) = (5 * 1 + 5 * 7) mod 20 = 40 mod 20 = 0 。
"ee" 是长度为 2 的第一个哈希值为 0 的子串，所以我们返回 "ee" 。
```

**示例 2：**

```
输入：s = "fbxzaad", power = 31, modulo = 100, k = 3, hashValue = 32
输出："fbx"
解释："fbx" 的哈希值为 hash("fbx", 31, 100) = (6 * 1 + 2 * 31 + 24 * 312) mod 100 = 23132 mod 100 = 32 。
"bxz" 的哈希值为 hash("bxz", 31, 100) = (2 * 1 + 24 * 31 + 26 * 312) mod 100 = 25732 mod 100 = 32 。
"fbx" 是长度为 3 的第一个哈希值为 32 的子串，所以我们返回 "fbx" 。
注意，"bxz" 的哈希值也为 32 ，但是它在字符串中比 "fbx" 更晚出现。
```

**提示：**

* `1 <= k <= s.length <= 2 * 104`
* `1 <= power, modulo <= 109`
* `0 <= hashValue < modulo`
* `s` 只包含小写英文字母。
* 测试数据保证一定 **存在** 满足条件的子串。

##### 哈希字符串

```js
/**
 * @param {string} s
 * @param {number} power
 * @param {number} modulo
 * @param {number} k
 * @param {number} hashValue
 * @return {string}
 */
var subStrHash = function (s, power, modulo, k, hashValue) {
    const n = s.length;
    const MOD = BigInt(modulo), p = BigInt(power), value = BigInt(hashValue);
    // hash(s[i], p, m) = (val(s[i]) * p0 + val(s[i + 1]) * p1 + ... + val(s[i+k-1]) * pk-1) mod m
    // hash(s[i + 1], p, m) = (val(s[i + 1]) * p0 + val(s[i + 2]) * p1 + ... + val(s[i+k]) * pk-1) mod m
    // hash(s[i], p, m) = val(s[i]) + hash(s[i + 1], p, m) * p - val(s[i+k]) * pk-1
    let hash = 0n, pk = 1n;
    for (let i = n - k; i < n; i++) {
        hash = (hash + BigInt(s[i].charCodeAt() - 97 + 1) * pk % MOD) % MOD;
        pk = (pk * p) % MOD;
    }
    
    let start = hash == value ? n - k : 0;
    for (i = n - k - 1; i >= 0; i--) {
        hash = ((BigInt(s[i].charCodeAt() - 97 + 1) + hash * p % MOD
            - BigInt(s[i + k].charCodeAt() - 97 + 1) * pk % MOD) + MOD) % MOD;
        if (hash == value) start = i;
    }
    return s.slice(start, start + k);
};
```

#### [647. 回文子串](https://leetcode.cn/problems/palindromic-substrings/description/)

给你一个字符串 `s` ，请你统计并返回这个字符串中 **回文子串** 的数目。

**回文字符串** 是正着读和倒过来读一样的字符串。

**子字符串** 是字符串中的由连续字符组成的一个序列。

**示例 1：**

```
输入：s = "abc"
输出：3
解释：三个回文子串: "a", "b", "c"
```

**示例 2：**

```
输入：s = "aaa"
输出：6
解释：6个回文子串: "a", "a", "a", "aa", "aa", "aaa"
```

**提示：**

* `1 <= s.length <= 1000`
* `s` 由小写英文字母组成

##### Manacher算法

```js
/**
 * @param {string} s
 * @return {number}
 */
var countSubstrings = function (s) {
    const str = manacherStr(s);
    const n = str.length;
    const halfLen = Array(n).fill(0);
    let R = -1, C = -1;
    let cnt = 0;
    for (let i = 0; i < n; i++) {
        halfLen[i] = R > i ? Math.min(halfLen[2 * C - i], R - i) : 1;

        while (i - halfLen[i] >= 0 && i + halfLen[i] < n &&
            str[i - halfLen[i]] == str[i + halfLen[i]]) {
            halfLen[i] += 1;
        }

        if (i + halfLen[i] > R) {
            R = i + halfLen[i];
            C = i;
        }
        // 回文半径中字母的数量
        if (str[i] !== "#") {
            cnt += Math.ceil(halfLen[i] / 2);
        } else {
            cnt += Math.ceil((halfLen[i] - 1) / 2);
        }
    }
    return cnt;
};

const manacherStr = (s) => {
    let str = "#";
    for (let ch of s) {
        str += ch + "#";
    }
    return str;
}
```

#### [5. 最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/description/)

给你一个字符串 `s`，找到 `s` 中最长的 回文 子串。

**示例 1：**

```
输入：s = "babad"
输出："bab"
解释："aba" 同样是符合题意的答案。
```

**示例 2：**

```
输入：s = "cbbd"
输出："bb"
```

**提示：**

* `1 <= s.length <= 1000`
* `s` 仅由数字和英文字母组成

##### Manacher 算法

```js
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
    const str = manacherStr(s);
    const n = str.length;
    const halfLen = Array(n).fill(0); // 回文半径数组
    let R = -1, // 已经扩出来的回文的最右的右边界##的下一个位置##，这样i+halfLen[i]就直接是R
        C = -1; // R对应的回文的回文中心下标
    let maxHalfLen = 1, maxC = 0;
    for (let i = 0; i < n; i++) {
        // 1. 如果i在R的右侧，需要暴力扩展
        // 2. i 在 R的左侧，i关于C的对称点为i'(2*C - i)
            // 2.1 i'的回文区间在C的回文区间内  => i的回文半径跟i'一样
            // 2.2 i'的回文区间超过了C的回文区间  => i的回文半径为R - i
            // 2.3 i'的回文区间的左边界与C的左边界重合  => i的回文半径至少为R - i，需要暴力扩展判断能否更大
        halfLen[i] = R > i ? Math.min(halfLen[2 * C - i] ?? 0, R - i) : 1;

        // 暴力扩展
        while (i + halfLen[i] < n && i - halfLen[i] >= 0 &&
            str[i + halfLen[i]] == str[i - halfLen[i]]) {
                halfLen[i] += 1;
        }
        // 更新R和C
        if (i + halfLen[i] > R) {
            R = i + halfLen[i];
            C = i;
        }
        if (halfLen[i] > maxHalfLen) {
            maxHalfLen = halfLen[i];
            maxC = i;
        }
    }
    // [maxC - maxHalfLen + 1, maxC + maxHalfLen - 1] 为最长的回文串
    // 但是maxC - maxHalfLen + 1和maxC + maxHalfLen - 1一定都是#
    // 所以真实的回文串在str中的左右边界为maxC - maxHalfLen + 2和maxC + maxHalfLen - 2
    // s中下标i的字母在str中的下标为 2*i + 1
    // 所以转换过来s中最长回文串的边界为[(maxC - maxHalfLen + 1) / 2, (maxC + maxHalfLen - 3) / 2]
    return s.slice((maxC - maxHalfLen + 1) / 2, ((maxC + maxHalfLen - 3) / 2) + 1)
};

const manacherStr = (s) => {
    let str = "#";
    for (let i = 0; i < s.length; i++) {
        str += s[i] + "#";
    }

    return str;
}
```

##### 中心扩展算法，奇数和偶数一起

```js
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
    let maxLen = 1, maxI = 0, n = s.length;
    // 枚举[0, 2*n - 1]相当于在之前的每个数中间插入了一个分割的数
    // 如果i为偶数，等于扩展奇数长度的回文数
        // 此时l和r为floor(i / 2)
    // 如果i为奇数，等于枚举到了中间的分割点，等于扩展偶数长度的回文数
        // 此时l和r为floor(i / 2)和ceil(i/ 2)
    for (let i = 0; i <= 2*n - 1; i++) {
        let l = Math.floor(i / 2), r = Math.ceil(i / 2);
        while (l >= 0 && r < n && s[l] == s[r]) {
            l--, r++;
        }
        if (r - l - 1 > maxLen) {
            maxLen = r - l - 1;
            maxI = l + 1;
        }
    }

    return s.slice(maxI, maxI + maxLen);
};
```

##### 中心扩展算法，奇数和偶数长度分开

```js
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
    let maxLen = 1, maxI = 0, n = s.length;
    // 扩展奇数的回文
    for (let i = 1; i < n - 1; i++) {
        let l = i, r = i;
        while (l >= 0 && r < n && s[l] == s[r]) {
            l--, r++;
        }
        if (r - l - 1 > maxLen) {
            maxLen = r - l - 1;
            maxI = l + 1;
        }
    }
    // 扩展偶数的回文
    for (let i = 0; i < n; i++) {
        let l = i, r = i + 1;
        while (l >= 0 && r < n && s[l] == s[r]) {
            l--, r++;
        }
        if (r - l - 1 > maxLen) {
            maxLen = r - l - 1;
            maxI = l + 1;
        }
    }

    return s.slice(maxI, maxI + maxLen);
};
```

##### 动态规划

```js
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    const n = s.length;
    const isPalindrome = Array.from({length: n}, () => Array(n).fill(false));
    let maxLen = 1, maxI = 0;
    for (let i = n - 1; i >= 0; i--) {
        isPalindrome[i][i] = true;
        for (let j = i + 1; j < n; j++) {
            isPalindrome[i][j] = s[i] == s[j] && (j - i == 1 || isPalindrome[i + 1][j - 1]);
            if (isPalindrome[i][j] && (j - i + 1 > maxLen)) {
                maxLen = j - i + 1, maxI = i;
            }
        }
    }
    return s.slice(maxI, maxI + maxLen)
};
```

#### [2430. 对字母串可执行的最大删除数](https://leetcode.cn/problems/maximum-deletions-on-a-string/description/)

给你一个仅由小写英文字母组成的字符串 `s` 。在一步操作中，你可以：

* 删除 **整个字符串** `s` ，或者
* 对于满足 `1 <= i <= s.length / 2` 的任意 `i` ，如果 `s` 中的 **前** `i` 个字母和接下来的 `i` 个字母 **相等** ，删除 **前** `i` 个字母。

例如，如果 `s = "ababc"` ，那么在一步操作中，你可以删除 `s` 的前两个字母得到 `"abc"` ，因为 `s` 的前两个字母和接下来的两个字母都等于 `"ab"` 。

返回删除 `s` 所需的最大操作数。

**示例 1：**

```
输入：s = "abcabcdabc"
输出：2
解释：
- 删除前 3 个字母（"abc"），因为它们和接下来 3 个字母相等。现在，s = "abcdabc"。
- 删除全部字母。
一共用了 2 步操作，所以返回 2 。可以证明 2 是所需的最大操作数。
注意，在第二步操作中无法再次删除 "abc" ，因为 "abc" 的下一次出现并不是位于接下来的 3 个字母。
```

**示例 2：**

```
输入：s = "aaabaab"
输出：4
解释：
- 删除第一个字母（"a"），因为它和接下来的字母相等。现在，s = "aabaab"。
- 删除前 3 个字母（"aab"），因为它们和接下来 3 个字母相等。现在，s = "aab"。 
- 删除第一个字母（"a"），因为它和接下来的字母相等。现在，s = "ab"。
- 删除全部字母。
一共用了 4 步操作，所以返回 4 。可以证明 4 是所需的最大操作数。
```

**示例 3：**

```
输入：s = "aaaaa"
输出：5
解释：在每一步操作中，都可以仅删除 s 的第一个字母。
```

**提示：**

* `1 <= s.length <= 4000`
* `s` 仅由小写英文字母组成

##### 动态规划 lcp(最长公共前缀)

```js
/**
 * @param {string} s
 * @return {number}
 */
var deleteString = function (s) {
    const n = s.length;
    // lcp[i][j]为s[i:]与s[j:]的最长公共前缀长度
    const lcp = Array.from({ length: n }, () => Array(n).fill(0));
    lcp[n - 1][n - 1] = 1;
    for (let i = n - 2; i >= 0; i--) {
        if (s[i] == s[n - 1]) lcp[i][n-1] = 1;
        for (let j = i; j < n - 1; j++) {
            lcp[i][j] = s[i] == s[j] ? lcp[i + 1][j + 1] + 1 : 0
        }
    }
    const f = Array(n).fill(1);
    for (let i = n - 2; i >= 0; i--) {
        for (let j = 1; j < ((n - i) / 2) + 1; j++) { // 枚举删除的字符数
            if (lcp[i][i + j] >= j) { // s[i:]与s[i+j:]的最长公共子串的长度大于要删除的字符数
                f[i] = Math.max(f[i], f[i + j] + 1);
            }
        }
    }
    return f[0];
};
```

#### [2223. 构造字符串的总得分和](https://leetcode.cn/problems/sum-of-scores-of-built-strings/description/)

你需要从空字符串开始 **构造** 一个长度为 `n` 的字符串 `s` ，构造的过程为每次给当前字符串 **前面** 添加 **一个** 字符。构造过程中得到的所有字符串编号为 `1` 到 `n` ，其中长度为 `i` 的字符串编号为 `si` 。

* 比方说，`s = "abaca"` ，`s1 == "a"` ，`s2 == "ca"` ，`s3 == "aca"` 依次类推。

`si` 的 **得分** 为 `si` 和 `sn` 的 **最长公共前缀** 的长度（注意 `s == sn` ）。

给你最终的字符串 `s` ，请你返回每一个`si` 的 **得分之和** 。

**示例 1：**

```
输入：s = "babab"
输出：9
解释：
s1 == "b" ，最长公共前缀是 "b" ，得分为 1 。
s2 == "ab" ，没有公共前缀，得分为 0 。
s3 == "bab" ，最长公共前缀为 "bab" ，得分为 3 。
s4 == "abab" ，没有公共前缀，得分为 0 。
s5 == "babab" ，最长公共前缀为 "babab" ，得分为 5 。
得分和为 1 + 0 + 3 + 0 + 5 = 9 ，所以我们返回 9 。
```

**示例 2 ：**

```
输入：s = "azbazbzaz"
输出：14
解释：
s2 == "az" ，最长公共前缀为 "az" ，得分为 2 。
s6 == "azbzaz" ，最长公共前缀为 "azb" ，得分为 3 。
s9 == "azbazbzaz" ，最长公共前缀为 "azbazbzaz" ，得分为 9 。
其他 si 得分均为 0 。
得分和为 2 + 3 + 9 = 14 ，所以我们返回 14 。
```

**提示：**

* `1 <= s.length <= 105`
* `s` 只包含小写英文字母。

##### z 函数模板

```js
/**
 * @param {string} s
 * @return {number}
 */
var sumScores = function(s) {
    const n = s.length;
    const z = Array(n).fill(0);
    z[0] = n;
    let ans = n;
    let left = right = 0; // z-box
    for (let i = 1; i < n; i++) {
        if (i < right) { // z 函数核心
            // 如果i在z-box中
            // 窗口内的最长匹配的前缀长度为min(i-left的z函数值, i到right的长度)
            z[i] = Math.min(z[i - left], right - i + 1);
        }
        // 暴力匹配
        while (i + z[i] < n && (s[i + z[i]] == s[z[i]])) {
            left = i, right = i + z[i];
            z[i] += 1;
        }
        ans += z[i];
    }
    return ans;
};
```

#### [796. 旋转字符串](https://leetcode.cn/problems/rotate-string/description/)

给定两个字符串, `s` 和 `goal`。如果在若干次旋转操作之后，`s` 能变成 `goal` ，那么返回 `true` 。

`s` 的 **旋转操作** 就是将 `s` 最左边的字符移动到最右边。

* 例如, 若 `s = 'abcde'`，在旋转一次之后结果就是`'bcdea'` 。

**示例 1:**

```
输入: s = "abcde", goal = "cdeab"
输出: true
```

**示例 2:**

```
输入: s = "abcde", goal = "abced"
输出: false
```

**提示:**

* `1 <= s.length, goal.length <= 100`
* `s` 和 `goal` 由小写英文字母组成

##### 拼接s+s,使用KMP搜索goal

```js
/**
 * @param {string} s
 * @param {string} goal
 * @return {boolean}
 */
var rotateString = function(s, goal) {
    if (s.length !== goal.length) {
        return false;
    }
    return KMP(s + s, goal) != -1;
};

const KMP = (str1, str2) => {
    const next = getNextArray(str2);
    let i1 = 0, i2 = 0;
    while (i1 < str1.length && i2 < str2.length) {
        if (str1[i1] == str2[i2]) {
            i1++, i2++;
        } else if (i2 == 0) {
            i1++;
        } else {
            i2 = next[i2];
        }
    }
    return i2 == str2.length ? i1 - i2 : -1;
}

const getNextArray = (str) => {
    const n = str.length;
    if (n == 1) return [-1];
    const next = Array(n);
    next[0] = -1, next[1] = 0;
    let i = 2, cn = 0;
    while (i < n) {
        if (str[i - 1] == str[cn]) {
            next[i++] = ++cn;
        } else if (cn == 0) {
            next[i++] = 0;
        } else {
            cn = next[cn];
        }
    }
    return next;
}
```

##### 枚举移动的次数

```js
/**
 * @param {string} s
 * @param {string} goal
 * @return {boolean}
 */
var rotateString = function(s, goal) {
    if (s.length !== goal.length) {
        return false;
    }
    if (s == goal) return true;
    const n = s.length;
    for (let i = 1; i < n; i++) {
        if (s.slice(0, i) == goal.slice(n - i) && s.slice(i) == goal.slice(0, n - i)) {
            return true;
        }
    }
    return false;
};
```

#### [28. 找出字符串中第一个匹配项的下标](https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string/description/)

给你两个字符串 `haystack` 和 `needle` ，请你在 `haystack` 字符串中找出 `needle` 字符串的第一个匹配项的下标（下标从 0 开始）。如果 `needle` 不是 `haystack` 的一部分，则返回  `-1`。

**示例 1：**

```
输入：haystack = "sadbutsad", needle = "sad"
输出：0
解释："sad" 在下标 0 和 6 处匹配。
第一个匹配项的下标是 0 ，所以返回 0 。
```

**示例 2：**

```
输入：haystack = "leetcode", needle = "leeto"
输出：-1
解释："leeto" 没有在 "leetcode" 中出现，所以返回 -1 。
```

**提示：**

* `1 <= haystack.length, needle.length <= 104`
* `haystack` 和 `needle` 仅由小写英文字符组成

##### KMP算法模板

```js
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
    const next = getNextArray(needle);
    let i1 = 0, i2 = 0;
    while (i1 < haystack.length && i2 < needle.length) {
        if (haystack[i1] == needle[i2]) {
            i1++, i2++;
        } else if (i2 == 0) {
            i1++;
        } else {
            i2 = next[i2];
        }
    }
    return i2 == needle.length ? i1 - i2 : -1;
};

const getNextArray = (str) => {
    const n = str.length;
    const next = Array(n);
    next[0] = -1, next[1] = 0;
    let i = 2, cn = 0;
    while (i < n) {
        if (str[i - 1] == str[cn]) {
            next[i++] = ++cn;
        } else if (cn == 0) {
            next[i++] = 0;
        } else {
            cn = next[cn];
        }
    }
    return next;
}
```

#### [3537. 填充特殊网格](https://leetcode.cn/problems/fill-a-special-grid/description/)

给你一个非负整数 `N`，表示一个 `2N x 2N` 的网格。你需要用从 0 到 `22N - 1` 的整数填充网格，使其成为一个 **特殊**网格。一个网格当且仅当满足以下 **所有**条件时，才能称之为 **特殊** 网格：

* 右上角象限中的所有数字都小于右下角象限中的所有数字。
* 右下角象限中的所有数字都小于左下角象限中的所有数字。
* 左下角象限中的所有数字都小于左上角象限中的所有数字。
* 每个象限也都是一个特殊网格。

返回一个 `2N x 2N` 的特殊网格。

**注意：**任何 1x1 的网格都是特殊网格。

**示例 1：**

**输入：** N = 0

**输出：** [[0]]

**解释：**

唯一可以放置的数字是 0，并且网格中只有一个位置。

**示例 2：**

**输入：** N = 1

**输出：** [[3,0],[2,1]]

**解释：**

每个象限的数字如下：

* 右上角：0
* 右下角：1
* 左下角：2
* 左上角：3

由于 `0 < 1 < 2 < 3`，该网格满足给定的约束条件。

**示例 3：**

**输入：** N = 2

**输出：** [[15,12,3,0],[14,13,2,1],[11,8,7,4],[10,9,6,5]]

**解释：**

![](https://pic.leetcode.cn/1746289512-jpANZH-4123example3p1drawio.png)

每个象限的数字如下：

* 右上角：3, 0, 2, 1
* 右下角：7, 4, 6, 5
* 左下角：11, 8, 10, 9
* 左上角：15, 12, 14, 13
* `max(3, 0, 2, 1) < min(7, 4, 6, 5)`
* `max(7, 4, 6, 5) < min(11, 8, 10, 9)`
* `max(11, 8, 10, 9) < min(15, 12, 14, 13)`

这满足前三个要求。此外，每个象限也是一个特殊网格。因此，这是一个特殊网格。

**提示：**

* `0 <= N <= 10`

##### dfs
```js
/**
 * @param {number} n
 * @return {number[][]}
 */
var specialGrid = function(n) {
    const rows = 1 << n; // 总行数
    const grid = Array.from({length: rows}, () => Array(rows));
    let val = 0;
    const dfs = (t, b, l, r) => {
        if (t > b || l > r) return;
        if (t == b && l == r) {
            grid[t][l] = val++;
            return;
        }
        let my = Math.floor((t + b) / 2), mx = Math.floor((l + r) / 2);
        dfs(t, my, mx + 1, r ); // 右上
        dfs(my + 1, b, mx + 1, r ) // 右下
        dfs(my + 1, b, l, mx ) // 左下
        dfs(t, my, l, mx ) // 左上
    }
    dfs(0, rows - 1, 0, rows - 1 );
    return grid;
};
```
