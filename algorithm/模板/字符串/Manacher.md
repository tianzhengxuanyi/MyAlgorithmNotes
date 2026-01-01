### Manacher 算法

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

### 相关题单
- [5. 最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/description/)