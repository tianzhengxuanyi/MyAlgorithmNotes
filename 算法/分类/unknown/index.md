
### 1

给定一个函数 f，可以 1 ～ 5 的数字等概率返回一个。请加工出 1 ～ 7 的数字等概率返回一个的函数 g。

**思路：**

1. 将f函数加工为等概率返回0 1的函数r；
2. 用三位二进制表示返回结果，每一位上的0 1用函数r决定，如果结果为7从头重新决定；

```js
function f() {
    return Math.floor(Math.random() * 5) + 1;
}

function rand5ToRand7(f) {
    // 将f函数改成0 1发生器
    function r() {
        let res = 0;
        do {
            res = f();
        } while (res === 3)
        return res < 3 ? 0 : 1;
    }
    function g() {
        let res = 0;
        do {
            res = (r() << 2) + (r() << 1) + r()
        } while (res === 7)
        return res + 1;
    }
    return g;
}
```

给定一个函数 f，可以 a ～ b 的数字等概率返回一个。请加工出 c ～ d 的数字等概率返回一个的函数 g。

**思路：**

1. 将函数f加工成等概率生成0 1的函数r，；
2. 

给定一个函数 f，以 p 概率返回 0，以 1-p 概率返回 1。请加工出等概率返回 0 和 1 的函数 g

**思路：**

1. 用两位二进制进行辅助，每一位分别用f确定；
2. 00概率p^2，11概率（1-p）^2，01和10等概率p(1-p);
3. 01返回0，10返回1，其他值重新确定；

### 2

一个完整的括号字符串定义规则如下:
1. 空字符串是完整的。
2. 如果 s 是完整的字符串，那么(s)也是完整的。
3. 如果 s 和 t 是完整的字符串，将它们连接起来形成的 st 也是完整的。
   
例如，"(()())", ""和"(())()"是完整的括号字符串，"())(", "()(" 和 ")" 是不完整的括号字符串。

牛牛有一个括号字符串 s,现在需要在其中任意位置尽量少地添加括号,将其转化
为一个完整的括号字符串。请问牛牛至少需要添加多少个括号。

**思路：**

1. 将字符串转化为数组，用变量count辅助记录，遍历数组，如果当前为“(” count加一，如果为“)” count减一；
2. 如果遍历过程中count变为-1，则说明需要在此下标前加入“(”配对，res加一，并将count重置为0；
3. 如果遍历结束count大于0，则说明需要在结尾加入count个“)”，res加count；

```js
function needParentheses(str) {
    let arr = str.split('');
    let count = 0;
    let res = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === "(") {
            count++
        } else {
            count--
        }
        if (count < 0) {
            res++
            count = 0
        }
    }
    return count + res;
}
```

### 3

给一个包含n个整数元素的集合a，一个包含m个整数元素的集合b。

定义magic操作为，从一个集合中取出一个元素，放到另一个集合里，且操作过后每个集合的平均值都大大于于操作前。

注意以下两点：
1. 不可以把一个集合的元素取空，这样就没有平均值了
2. 值为x的元素从集合b取出放入集合a，但集合a中已经有值为x的元素，则a的平均值不变（因为集合元素不会重复），b的平均值可能会改变（因为x被取出了）
   
问最多可以进行多少次magic操作？

**思路：**

1. 分别计算集合a和b的平均值，avgA和avgB;
2. magic操作有以下几种可能：
   1. 如果avgA = avgB，无论如何操作都不符合；
   2. 从较小平均值(假设为avgA)中取值x放入b中
      1. 如果x < avgA < avgB会导致avgA变大、avgB变小；
      2. 如果avgA < x < avgB会导致avgA变小、avgB变小；
      3. 如果avgA < avgB < x会导致avgA变小、avgB变大；
   3. 从较大平均值(假设为avgB)中取值x放入a中
      1. 如果x < avgA < avgB会导致avgA变小、avgB变大；
      2. 如果avgA < x < avgB会导致avgA变大、avgB变大；
      3. 如果avgA < avgB < x会导致avgA变大、avgB变小；
3. 只有从较大平均值的集合中取值为两个集合平均值之间的数才符合条件；
4. 将两个集合从小到大排序，拿满足要求最小的数字，会使得较大的平均值最大幅度上升，较小的平均值最小幅度上升，使得magic的次数尽量多；
5. 可证从较大平均值中选两个平均值间的数不会导致较小的平均值大于较大平均值，因此只需要一直从较大平均值的集合取值；

```js
function magicOp(arr1, arr2) {
    let sum1 = 0;
    for (let i = 0; i < arr1.length; i++) {
        sum1 += arr1[i]
    }
    let sum2 = 0;
    for (let i = 0; i < arr2.length; i++) {
        sum2 += arr2[i]
    }
    // 如果平均值相等返回0
    if (avg(sum1, arr1.length) === avg(sum2, arr2.length)) {
        return 0;
    }
    let arrMore = null;
    let arrLess = null;
    let sumMore = 0;
    let sumless = 0;

    if (avg(sum1, arr1.length) > avg(sum2, arr2.length)) {
        arrMore = arr1;
        arrLess = arr2;
        sumMore = sum1;
        sumless = sum2;
    } else {
        arrMore = arr2;
        arrLess = arr1;
        sumMore = sum2;
        sumless = sum1;
    }
    arrMore.sort();
    let set = new Set();
    for (let i = 0; i < arrLess.length; i++) {
        set.add(arrLess[i])
    }
    let moreSize = arrMore.length;
    let lessSize = arrLess.length;
    let res = 0;
    for (let i = 0; i < arrMore.length; i++) {
        let cur = arrMore[i]
        if (cur < avg(sumMore, moreSize) && cur > avg(sumless, lessSize) && !set.has(cur)) {
            sumMore -= cur;
            moreSize -= 1;
            sumless += cur;
            lessSize++;
            set.add(cur);
            res++;
        }
    }
    return res;
}

function avg(sum, length) {
    return sum / length
}
```