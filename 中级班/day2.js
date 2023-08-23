function subvalueEqualK(arr, k) {
    const set = new Set();
    const res = [];
    for (let i = 0; i < arr.length; i++) {
        set.add(arr[i]);
    }
    for (let cur of set) {
        if (set.has(cur+k)) {
            res.push([cur, cur+k]);
        }
    }
    return res;
}

console.log("subvalueEqualK", subvalueEqualK([2,6,8,10,10,12,0,24,22], 2))

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

console.log("magicOp", magicOp([1,2,5], [2,3,4,5,6]))

function NumsToStringWays(num) {
    const arr = num.toString().split("");
    function process(index) {
        if (index === arr.length) {
            return 1
        }
        let cur = parseInt(arr[index])
        if (cur === 0) {
            return 0;
        }
        if (index === arr.length - 1) {
            return 1;
        }
        let res = 0;
        if (cur * 10 + parseInt(arr[index+1]) < 27) {
            res = process(index + 1) + process(index + 2)
        } else {
            res = process(index + 1)
        }

        return res;
    }
    return process(0)
}

// 动态规划
function NumsToStringWays2(num) {
    const arr = num.toString().split("");
    const dp = new Array(arr.length+1);
    dp[arr.length] = 1
    dp[arr.length - 1] = arr[arr.length - 1] === "0" ? 0 : 1;

    for (let i = arr.length - 2; i >= 0; i--) {
        let cur = parseInt(arr[i])
        if (cur === 0) {
            dp[i] = 0
        } else {
            if (cur * 10 +  parseInt(arr[i+1]) < 27) {
                dp[i] = dp[i + 1] + dp[i+2]
            } else {
                dp[i] = dp[i+1]
            }
        }
    }

    return dp[0]
}

console.log("NumsToStringWays", NumsToStringWays(12218))
console.log("NumsToStringWays", NumsToStringWays2(12218))

function parenthesesDeep(str) {
    const arr = str.split("");
    let count = 0;
    let res= 0;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === "(") {
            count++;
            res = Math.max(res, count)
        } else {
            count--;
        }
    }

    return res;
}

console.log("parenthesesDeep", parenthesesDeep("()()()"))
console.log("parenthesesDeep", parenthesesDeep("((()))"))