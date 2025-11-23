### KMP算法模板

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

### 相关题单
- [28. 找出字符串中第一个匹配项的下标](https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string/description/)