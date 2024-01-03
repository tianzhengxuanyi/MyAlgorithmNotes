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
    // 包括i
    leftGList[0] = arr[0] === "G" ? 1 : 0;
    // 不包括i
    rightRList[arr.length - 1] = 0;
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
    return res;
}

console.log("colorLeftRight", colorLeftRight("RGRGR"));
console.log("colorLeftRight", colorLeftRight2("RGRGR"));

function maxOneBorderSize(matrix) {
    let res = 0;
    let N = matrix.length;
    // 遍历矩阵
    for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
            // 遍历可能的border
            for (
                let border = 1;
                row + border - 1 < N && col + border - 1 < N;
                border++
            ) {
                let flag = true;
                // 上
                for (let i = col; i <= col + border - 1; i++) {
                    if (matrix[row][i] === 0) {
                        flag = false;
                        break;
                    }
                }
                // 下
                for (let i = col; i <= col + border - 1; i++) {
                    if (matrix[row + border - 1][i] === 0) {
                        flag = false;
                        break;
                    }
                }
                // 左
                for (let i = row; i <= row + border - 1; i++) {
                    if (matrix[i][col] === 0) {
                        flag = false;
                        break;
                    }
                }
                // 右
                for (let i = row; i <= row + border - 1; i++) {
                    if (matrix[i][col + border - 1] === 0) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    res = Math.max(res, border);
                }
            }
        }
    }
    return res;
}

function maxOneBorderSize2(matrix) {
    let res = 0;
    const N = matrix.length;
    const right = new Array(N);
    for (let i = 0; i < N; i++) {
        right[i] = new Array(N);
        for (let j = N - 1; j >= 0; j--) {
            if (j === N - 1) {
                right[i][j] = matrix[i][j];
            } else {
                right[i][j] =
                    matrix[i][j] === 0 ? 0 : matrix[i][j] + right[i][j + 1];
            }
        }
    }
    const down = new Array(N);
    for (let i = 0; i < N; i++) {
        down[i] = new Array(N);
    }
    for (let j = 0; j < N; j++) {
        for (let i = N - 1; i >= 0; i--) {
            if (i === N - 1) {
                down[i][j] = matrix[i][j];
            } else {
                down[i][j] =
                    matrix[i][j] === 0 ? 0 : matrix[i][j] + down[i + 1][j];
            }
        }
    }

    // 遍历矩阵
    for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
            // 遍历border
            for (
                let border = 1;
                row + border - 1 < N && col + border - 1 < N;
                border++
            ) {
                // 判断边是否为1
                if (
                    right[row][col] < border ||
                    right[row + border - 1][col] < border ||
                    down[row][col] < border ||
                    down[row][col + border - 1] < border
                ) {
                    continue;
                }
                res = Math.max(res, border);
            }
        }
    }
    return res;
}

console.log(
    "maxOneBorderSize",
    maxOneBorderSize([
        [0, 1, 1, 1, 1],
        [0, 1, 0, 0, 1],
        [0, 1, 0, 0, 1],
        [0, 1, 1, 1, 1],
        [0, 1, 0, 1, 1],
    ])
);
console.log(
    "maxOneBorderSize",
    maxOneBorderSize2([
        [0, 1, 1, 1, 1],
        [0, 1, 0, 0, 1],
        [0, 1, 0, 0, 1],
        [0, 1, 1, 1, 1],
        [0, 1, 0, 1, 1],
    ])
);

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
const g = rand5ToRand7(f)
// let map = new Map();
// for (let i = 0; i < 10000; i++) {
    
//     let rand = g();
//     if (map.has(rand)) {
//         map.set(rand, map.get(rand) + 1)
//     } else {
//         map.set(rand, 0)
//     }
// }
// console.log(map)

function uniqueBST(n) {
    function process(n) {
        if (n < 0) {
            return 0;
        }
        if (n === 0 || n === 1) {
            return 1;
        }
        if (n === 2) {
            return 2;
        }
        let res = 0;
        for (let i = 0; i < n; i++) {
            let leftWays = process(i);
            let rightWays =  process(n-i-1);
            res += leftWays * rightWays
        }
        return res;
    }
    return process(n)
}

// 动态规划
function uniqueBST2(n) {
    const dp = new Array(n+1).fill(0);
    dp[0] = 1;
    for (let i = 1; i <= n; i++) {
        // 左子树的节点个数 0 ~ i- 1
        for (let j = 0; j < i; j++) {
            dp[i] += dp[j] * dp[i-j-1]
        }
    }
    return dp[n]
}

console.log("uniqueBST", uniqueBST(10))
console.log("uniqueBST", uniqueBST2(10))

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

console.log("needParentheses", needParentheses("((())()(((("))