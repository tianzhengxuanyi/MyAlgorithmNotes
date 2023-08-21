function coverMaxPoint(arr, L) {
    let res = 1;
    for (let i = 0; i < arr.length; i++) {
        let index = nearestIndex(arr, i, arr[i] - L);
        res = res > i - index + 1 ? res : i - index + 1;
    }
    return res;
}

function nearestIndex(arr, R, value) {
    let left = 0;
    let index = R;

    while (left < R) {
        let mid = left + ((R - left) >> 1);
        if (arr[mid] >= value) {
            index = mid;
            R = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    return index;
}

function coverMaxPoint2(arr, L) {
    let left = 0;
    let right = 0;
    let res = 0;
    while (left < arr.length) {
        // 窗口在L范围内，right++
        if (right < arr.length && arr[right + 1] - arr[left] <= L) {
            right++;
        } else {
            // 窗口要超过L，left++
            res = Math.max(res, right - left + 1);
            left++;
        }
    }
    return res;
}

console.log(
    "coverMaxPoint",
    coverMaxPoint([0, 13, 24, 35, 46, 57, 60, 72, 87], 6)
);
console.log(
    "coverMaxPoint",
    coverMaxPoint2([0, 13, 24, 35, 46, 57, 60, 72, 87], 6)
);

function appleMinBags(n) {
    if (n <= 0) {
        return -1;
    }
    let rest = n % 8;
    let count8 = Math.floor(n / 8);
    while (count8 >= 0 && rest < 24) {
        if (rest % 6 === 0) {
            return count8 + rest / 6;
        } else {
            count8--;
            rest = n - count8 * 8;
        }
    }
    return -1;
}

function appleMinBags2(n) {
    // 奇数为-1
    if (n % 2 !== 0) {
        return -1;
    }
    if (n < 18) {
        return n === 6 || n === 8
            ? 1
            : n === 12 || n === 14 || n === 16
            ? 2
            : -1;
    }

    return parseInt((n - 18) / 8) + 3;
}

console.log("appleMinBags", appleMinBags(102));
for (let i = 0; i < 500; i++) {
    // console.log('appleMinBags' + i, appleMinBags(i))
    // console.log('appleMinBags' + i, appleMinBags2(i))
    if (appleMinBags(i) !== appleMinBags2(i)) {
        console.log("break", i, appleMinBags(i), appleMinBags2(i));
        break;
    }
}

function winner(n) {
    // 0  1  2  3  4
    // 后 先 后 先 先
    if (n < 5) {
        return n == 0 || n == 2 ? "后手" : "先手";
    }
    //n >= 5时
    let base = 1; //先手决定吃的草
    //有问题
    while (base <= n) {
        //当前一共n份草，先手吃掉的是base份，n-base是留给后手的草
        //母过程 先手 在子过程是后手
        if (winner(n - base) === "后手") {
            return "先手";
        }
        if (base > n / 4) {
            // 防止base*4之后溢出
            break;
        }
        base *= 4;
    }
    return "后手";
}

function winner2(n) {
    if (n % 5 === 0 || n % 5 === 2) {
        return "后手";
    } else {
        return "先手";
    }
}
console.log("winner", winner(10));

// for (let i = 0; i < 80; i++) {
//     if (winner(i) !== winner2(i)) {
//         console.log("break", i, winner(i), winner2(i));
//     }
// }

function colorLeftRight(s) {
    const arr = s.split("");
    let res = Infinity;
    for (let i = 0; i < arr.length; i++) {
        let temp = 0;
        for (let left = 0; left < i; left++) {
            if (arr[left] === "G") {
                temp++;
            }
        }
        for (let right = i; right < arr.length; right++) {
            if (arr[right] === "R") {
                temp++;
            }
        }
        res = Math.min(temp, res);
    }
    return res;
}

function colorLeftRight2(s) {
    const arr = s.split("");
    let res = Infinity;
    // 记录0~i范围内有多少个R
    let leftGList = [];
    let rightRList = [];
    leftGList[0] = arr[0] === "G" ? 1 : 0;
    rightRList[arr.length - 1] = 0;
    // rightRList[arr.length - 1] = arr[arr.length - 1] === "R" ? 1 : 0;
    for (let i = 1; i < arr.length; i++) {
        leftGList[i] = arr[i] === "G" ? leftGList[i - 1] + 1 : leftGList[i - 1];
    }
    for (let i = arr.length - 2; i >= 0; i--) {
        rightRList[i] =
            arr[i + 1] === "R" ? rightRList[i + 1] + 1 : rightRList[i + 1];
    }
    for (let i = 0; i < arr.length - 1; i++) {
        let temp = leftGList[i] + rightRList[i];
        res = Math.min(temp, res);
    }
    console.log(leftGList)
    console.log(rightRList)
    return res;
}

console.log("colorLeftRight", colorLeftRight("RGRGR"));
console.log("colorLeftRight", colorLeftRight2("RGRGR"));
