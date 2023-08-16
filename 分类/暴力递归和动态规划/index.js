// 暴力尝试
function RobotWalk(N, M, K, P) {
    if (N < 2 || K < 1 || M < 1 || M > N || P < 1 || P > N) {
        return 0;
    }
    function process(cur, P, rest) {
        if (rest === 0) {
            return cur === P ? 1 : 0;
        }

        if (cur === 1) {
            return process(cur + 1, P, rest - 1);
        }

        if (cur === N) {
            return process(cur - 1, P, rest - 1);
        }

        return process(cur + 1, P, rest - 1) + process(cur - 1, P, rest - 1);
    }

    return process(M, P, K);
}

// 记忆缓存
function RobotWalk2(N, M, K, P) {
    if (N < 2 || K < 1 || M < 1 || M > N || P < 1 || P > N) {
        return 0;
    }
    const dp = new Array(K + 1);
    for (let i = 0; i < K + 1; i++) {
        dp[i] = new Array(N+1).fill(-1)
    }
    function process(N, P, rest, cur) {
        if (dp[rest][cur] != -1) {
            return dp[rest][cur];
        }
        //缓存没命中
        if (rest == 0) {
            dp[rest][cur] = cur == P ? 1 : 0;
        } else {
            //rest > 0 还有路可以走
            if (cur == 1) {
                // 1 - > 2
                dp[rest][cur] = process(N, P, rest - 1, 2);
            } else if (cur == N) {
                // N -> N -1
                dp[rest][cur] = process(N, P, rest - 1, N - 1);
            } else {
                //中间位置
                dp[rest][cur] =
                    process(N, P, rest - 1, cur - 1) +
                    process(N, P, rest - 1, cur + 1);
            }
        }

        return dp[rest][cur];
    }

    return process(N, P, K, M);
}

// 严格表结构
function RobotWalk3(N, M, K, P) {
    if (N < 2 || K < 1 || M < 1 || M > N || P < 1 || P > N) {
        return 0;
    }
    const dp = new Array(K + 1);
    for (let i = 0; i < K + 1; i++) {
        dp[i] = new Array(N+1).fill(0)
    }
    dp[0][P] = 1
    for (let i = 1; i <= K; i++) {
        for (let j = 1; j <= N; j++) {
            if (j === 1) {
                dp[i][j] = dp[i-1][j+1];
            } else if (j === N) {
                dp[i][j] = dp[i-1][j-1];
            } else {
                dp[i][j] = dp[i-1][j+1] + dp[i-1][j-1]
            }
        }
    }
    return dp[K][M];
}

console.log("RobotWalk", RobotWalk(5, 2, 3, 3));
console.log("RobotWalk", RobotWalk2(5, 2, 3, 3));
console.log("RobotWalk", RobotWalk3(5, 2, 3, 3));


function CoinsMin(arr, aim) {
    function process(index, rest) {
        if (index == arr.length) {
            return rest === 0 ? 0 : -1;
        }
        let res = -1;
        for (let i = 0; i * arr[index] <= rest; i++) {
            let next = process(index + 1, rest - i * arr[index])
            if (next !== -1) {
                res = res === -1 ? next + i : Math.min(res, next + i)
            }
        }

        return res;
    }
    return process(0, aim)
}

console.log('CoinsMin', CoinsMin([5,2,3], 20))
console.log('CoinsMin', CoinsMin([5,2,3], 0))
console.log('CoinsMin', CoinsMin([3,5], 2))