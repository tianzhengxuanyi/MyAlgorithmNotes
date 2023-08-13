## Manacher算法

**解决的问题**

字符串str中，最长回文子串的长度如何求解？

如何做到时间复杂度O(N)完成？



**思路(暴力破解)：**

1. 在每个字符前后添加特殊字符(abba -> #a#b#b#a#)；
2. 遍历处理后的每个字符，从当前字符同时向两边扩的位置进行比对
   - 如果左右两边字符相等，继续向两边扩展；
   - 如果不相等，记录下当前回文长度，停止扩展，循环到下个位置；

```js
var longestPalindrome = function (s) {
    if (s.length === 1) {
        return s
    }

    const charArr = manacherString(s);
    let longest = charArr[1];

    for (let i = 0; i < charArr.length; i++) {
        let left = i - 1;
        let right = i + 1;
        while (left >= 0 && right < charArr.length && charArr[left] === charArr[right]) {
            left--;
            right++;
        }

        left++;
        right--;
        if (longest.length < ((right - left) / 2)) {
            longest = ''
            for (let j = left; j <= right; j++) {
                if (j % 2 !== 0) {
                    longest += charArr[j]
                }
            }
        }
    }

    return longest;
};

var manacherString = function (s) {
    const arr = s.split('');
    const res = new Array(s.length * 2 + 1);

    for (let i = 0; i < res.length; i++) {
        if (i % 2 === 0) {
            res[i] = '#';
        } else {
            res[i] = arr[(i - 1) / 2]
        }
    }

    return res;
}
```

**思路(Manacher)：**

- 最长回文直径：从当前字符向外扩所能得到的最大回文字符串的长度
- 最长回文半径：Math.ceil(最长回文直径 / 2) 
- 回文半径数组: 每个位置字符的最长回文半径所组成的数组
- 之前扩的所有位置中所达到的最右回文右边界R
- 中心点C：之前扩的所有位置中所达到的最右回文右边界R所对应的中心点
  
1. 在每个字符前后添加特殊字符(abba -> #a#b#b#a#)；
2. 遍历处理后的每个字符，从当前字符同时向两边扩的位置进行比对，假设当前遍历到i位置：
   1. i位置经由C的对称位置记为i'
   2. i'位置的最长回文半径所形成的区域[L',R']
      - 如果`i > R`，则从i位置同时向两边扩逐位比对，无加速；
      - 如果[L',R']包含在[2c-R,R]内，则i位置与i'位置的最长回文半径相等；
      - 如果一部分落在[2C-R,R]内(`L' < 2C-R < R' < R` )，则i位置的最长回文半径为`R - i`
      - 如果`L' = 2C-R`，则以i为中心从R'位置同时向两边扩逐位比对


```js
function maxLcpsLength(s) {
    if (s.length === 1) {
        return 1
    }

    const charArr = manacherString(s);
    const pArr = new Array(charArr.length).fill(0)
    let R = -1;
    let C = -1;
    let max = -Infinity;
    for (let i = 0; i < charArr.length; i++) {
        // 判断加速多少位置
        pArr[i] = R > i ? Math.min(pArr[2*C - i], R - i) : 1;
        while (i +  pArr[i] < charArr.length && i -  pArr[i] > -1) {
            if (charArr[i +  pArr[i]] === charArr[i - pArr[i]]) {
                pArr[i] = pArr[i] + 1
            } else {
                break;
            }
        }
        if (i + pArr[i] > R) {
            R = i + pArr[i]
            C = i
        }
        max = Math.max(max, pArr[i])
    }
    return max - 1
}
```


![](../../image/manancher-1.png)

```js
var longestPalindrome = function (s) {
    if (s.length === 1) {
        return s
    }

    const charArr = manacherString(s);
    let longest = charArr[1];

    for (let i = 0; i < charArr.length; i++) {
        let left = i - 1;
        let right = i + 1;
        while (left >= 0 && right < charArr.length && charArr[left] === charArr[right]) {
            left--;
            right++;
        }

        left++;
        right--;
        if (longest.length < ((right - left) / 2)) {
            longest = ''
            for (let j = left; j <= right; j++) {
                if (j % 2 !== 0) {
                    longest += charArr[j]
                }
            }
        }
    }

    return longest;
};

var manacherString = function (s) {
    const arr = s.split('');
    const res = new Array(s.length * 2 + 1);

    for (let i = 0; i < res.length; i++) {
        if (i % 2 === 0) {
            res[i] = '#';
        } else {
            res[i] = arr[(i - 1) / 2]
        }
    }

    return res;
}
```