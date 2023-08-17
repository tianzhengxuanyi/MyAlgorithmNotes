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
    dp[i] = new Array(N + 1).fill(-1);
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
          process(N, P, rest - 1, cur - 1) + process(N, P, rest - 1, cur + 1);
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
    dp[i] = new Array(N + 1).fill(0);
  }
  dp[0][P] = 1;
  for (let i = 1; i <= K; i++) {
    for (let j = 1; j <= N; j++) {
      if (j === 1) {
        dp[i][j] = dp[i - 1][j + 1];
      } else if (j === N) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = dp[i - 1][j + 1] + dp[i - 1][j - 1];
      }
    }
  }
  return dp[K][M];
}

console.log("RobotWalk", RobotWalk(5, 2, 3, 3));
console.log("RobotWalk", RobotWalk2(5, 2, 3, 3));
console.log("RobotWalk", RobotWalk3(5, 2, 3, 3));

// 暴力尝试
function CoinsMin(arr, aim) {
  function process(index, rest) {
    if (index == arr.length) {
      return rest === 0 ? 0 : -1;
    }
    let res = -1;
    for (let i = 0; i * arr[index] <= rest; i++) {
      let next = process(index + 1, rest - i * arr[index]);
      if (next !== -1) {
        res = res === -1 ? next + i : Math.min(res, next + i);
      }
    }

    return res;
  }
  return process(0, aim);
}

// 记忆搜索优化
function CoinsMin2(arr, aim) {
  const dp = new Array(arr.length + 1);
  for (let i = 0; i < dp.length; i++) {
    dp[i] = new Array(aim + 1).fill(-2);
  }
  function process(index, rest) {
    if (index === arr.length) {
      return rest === 0 ? 0 : -1;
    }
    if (dp[index][rest] !== -2) {
      return dp[index][rest];
    }
    let res = -1;
    for (let i = 0; i * arr[index] <= rest; i++) {
      let next = process(index + 1, rest - i * arr[index]);
      if (next !== -1) {
        res = res === -1 ? next + i : Math.min(res, next + i);
      }
    }
    dp[index][rest] = res;
    return res;
  }
  return process(0, aim);
}

function CoinsMin3(arr, aim) {
  const dp = new Array(arr.length + 1);
  for (let i = 0; i < dp.length; i++) {
    dp[i] = new Array(aim + 1).fill(-1);
  }
  dp[arr.length][0] = 0;

  // 从下往上计算
  for (let i = arr.length - 1; i >= 0; i--) {
    // 从左往右
    for (let rest = 0; rest <= aim; rest++) {
      if (dp[i + 1][rest] !== -1) {
        dp[i][rest] = dp[i + 1][rest];
      }
      if (rest - arr[i] >= 0 && dp[i][rest - arr[i]] !== -1) {
        if (dp[i][rest] === -1) {
          dp[i][rest] = dp[i][rest - arr[i]] + 1;
        } else {
          dp[i][rest] = Math.min(dp[i][rest - arr[i]] + 1, dp[i][rest]);
        }
      }
    }
  }

  return dp[0][aim];
}
console.log("CoinsMin", CoinsMin([5, 2, 3], 20));
console.log("CoinsMin", CoinsMin2([5, 2, 3], 20));
console.log("CoinsMin", CoinsMin3([5, 2, 3], 20));
// console.log('CoinsMin', CoinsMin([5,2,3], 0))
// console.log('CoinsMin', CoinsMin([3,5], 2))

function CardsInLine(arr) {
  // 先手
  function f(i, j) {
    if (i === j) {
      return arr[i];
    }
    return Math.max(arr[i] + s(i + 1, j), arr[j] + s(i, j - 1));
  }

  // 后手
  function s(i, j) {
    if (i === j) {
      return 0;
    }

    return Math.min(f(i + 1, j), f(i, j - 1));
  }

  return Math.max(f(0, arr.length - 1), s(0, arr.length - 1));
}

// 动态规划
function CardsInLine2(arr) {
  const dpf = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    dpf[i] = new Array(arr.length);
    dpf[i][i] = arr[i];
  }
  const dps = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    dps[i] = new Array(arr.length);
    dps[i][i] = 0;
  }
  let col = 1,
    row = 0;
  while (col < arr.length) {
    let i = row,
      j = col;
    while (i < arr.length && j < arr.length) {
      dpf[i][j] = Math.max(arr[i] + dps[i + 1][j], arr[j] + dps[i][j - 1]);
      dps[i][j] = Math.min(dpf[i + 1][j], dpf[i][j - 1]);
      i++;
      j++;
    }
    col++;
  }
  return Math.max(dpf[0][arr.length - 1], dps[0][arr.length - 1]);
}
console.log("CardsInLine", CardsInLine([1, 2, 100, 4]));
console.log("CardsInLine", CardsInLine2([1, 2, 100, 4]));

// 暴力递归
function HorseJump(x, y, k) {
  function process(x, y, k) {
    if (x < 0 || x > 8 || y < 0 || y > 9) {
      return 0;
    }
    if (k === 0) {
      return x === 0 && y === 0 ? 1 : 0;
    }

    let ways =
      process(x - 1, y + 2, k - 1) +
      process(x - 2, y + 1, k - 1) +
      process(x - 2, y - 1, k - 1) +
      process(x - 1, y - 2, k - 1) +
      process(x + 1, y - 2, k - 1) +
      process(x + 2, y - 1, k - 1) +
      process(x + 2, y + 1, k - 1) +
      process(x + 1, y + 2, k - 1);

    return ways;
  }

  return process(x, y, k);
}

// 记忆搜索优化
function HorseJump2(x, y, k) {
  const dp = new Array(9);
  for (let i = 0; i < 9; i++) {
    dp[i] = new Array(10);
    for (let j = 0; j < 10; j++) {
      dp[i][j] = new Array(k + 1);
      for (let m = 0; m < k + 1; m++) {
        dp[i][j][m] = -1;
      }
    }
  }

  function process(x, y, k) {
    if (x < 0 || x > 8 || y < 0 || y > 9) {
      return 0;
    }
    if (k === 0) {
      dp[x][y][k] = x === 0 && y === 0 ? 1 : 0;
      return x === 0 && y === 0 ? 1 : 0;
    }
    if (dp[x][y][k] !== -1) {
      return dp[x][y][k];
    }

    dp[x][y][k] =
      process(x - 1, y + 2, k - 1) +
      process(x - 2, y + 1, k - 1) +
      process(x - 2, y - 1, k - 1) +
      process(x - 1, y - 2, k - 1) +
      process(x + 1, y - 2, k - 1) +
      process(x + 2, y - 1, k - 1) +
      process(x + 2, y + 1, k - 1) +
      process(x + 1, y + 2, k - 1);
    return dp[x][y][k];
  }

  return process(x, y, k);
}

// 动态规划
function HorseJump3(x, y, k) {
  const dp = new Array(9);
  for (let i = 0; i < 9; i++) {
    dp[i] = new Array(10);
    for (let j = 0; j < 10; j++) {
      dp[i][j] = new Array(k + 1);
      for (let m = 0; m < k + 1; m++) {
        dp[i][j][m] = 0;
      }
    }
  }
  dp[0][0][0] = 1;

  // m从1开始
  for (let m = 1; m < k + 1; m++) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 10; j++) {
        dp[i][j][m] =
          getValue(i - 1, j + 2, m - 1) +
          getValue(i - 2, j + 1, m - 1) +
          getValue(i - 2, j - 1, m - 1) +
          getValue(i - 1, j - 2, m - 1) +
          getValue(i + 1, j - 2, m - 1) +
          getValue(i + 2, j - 1, m - 1) +
          getValue(i + 2, j + 1, m - 1) +
          getValue(i + 1, j + 2, m - 1);
      }
    }
  }

  function getValue(x, y, k) {
    if (x < 0 || x > 8 || y < 0 || y > 9) {
      return 0;
    }
    return dp[x][y][k];
  }

  return dp[x][y][k];
}

let prevTime = Date.now();
// console.log('HorseJump', HorseJump(3,2,15))
let time1 = Date.now();
console.log(time1 - prevTime);
console.log("HorseJump", HorseJump2(3, 2, 15));
console.log(Date.now() - time1);
console.log("HorseJump", HorseJump3(3, 2, 15));


function BobDie(N, M, i, j, K) {
    // 从(i,j)剩余K步，Bob的存活的可能路径数
    function process(i, j, rest) {
        if (i < 0 || i >= N || j < 0 || j >= M ) {
            return 0;
        }
        if (rest === 0) {
            return 1;
        }
        return process(i-1,j,rest-1) +
            process(i+1,j,rest-1) +
            process(i,j-1,rest-1) +
            process(i,j+1,rest-1) ;
    }

    let live = process(i, j, K);
    let all = Math.pow(4, K);
    return `${live}/${all}`
}

console.log('BobDie', BobDie(10, 10, 3, 2, 5))