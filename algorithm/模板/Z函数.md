### z 函数模板

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

### 相关题单
- [2223. 构造字符串的总得分和](https://leetcode.cn/problems/sum-of-scores-of-built-strings/description/)