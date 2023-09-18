type matrix = number[][];
function muliMatrix(m1: matrix, m2: matrix): matrix {
    if (m1[0].length !== m2.length) {
        throw new Error("长度不匹配");
    }

    const m = m1.length;
    const p = m2.length;
    const n = m2[0].length;

    const mat = new Array(m).fill(0).map(arr => new Array(n).fill(0));
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            for (let k = 0; k < p; k++) {
                mat[i][j] += m1[i][k] * m2[k][j];
            }
        }
    }

    return mat;
}
function matrixPower(mat: matrix, n: number): matrix {
    const m = mat.length;
    let res = new Array(m).fill(0).map((arr, index) =>{
        let temp =  new Array(m).fill(0)
        temp[index] = 1;
        return temp;
    });

    while (n > 0) {
        if (n & 1) {
            res = muliMatrix(res, mat);
        }
        mat = muliMatrix(mat, mat);
        n = n  >> 1;
    }

    return res;
}

function fib(n: number): number {
    if (n < 2) {
        return n;
    }

    let a= 0, b = 0, dp = 1;
    for (let i = 2; i <= n; i++) {
        a = b;
        b = dp;
        dp = a + b;
    }

    return dp;
}

function fib2(n: number): number {
    if (n < 2) {
        return n
    }

    const mat = [[1,1],[1,0]];
    const matPower = matrixPower(mat, n -2);
    const resultMat = muliMatrix([[1,1]],matPower)
    return resultMat[0][0]
}

const m1 = [[1,2,3],[1,1,1],[3,2,1]]
const m2 = [[1,2,3],[1,1,1],[3,2,1]]
console.log("muliMatrix", muliMatrix(m1,m2))
console.log("matrixPower", matrixPower(m1,3))

console.log("fib", fib(30))
console.log("fib", fib2(30))

function genStr(n: number): string[] {
    if (n === 1) {
        return ["1", "0"]
    }
    const set: Set<string> = new Set();
    const nextRes = genStr(n-1);
    for (let str of nextRes) {
        set.add('1' + str);
        set.add('0' + str);
        set.add(str + '1');
        set.add(str + '0');
    }
    const res = Array.from(set)
    return res;
}

function standardStrNum(n: number): number {
    if (n < 2) {
        return n;
    }
    let res = 0;
    const allStr = genStr(n);

    for (let str of allStr) {
        let prev = str[0];
        let falg = true;
        for (let s of str) {
            if (s === "0" && prev !== "1") {
                falg = false;
                break
            }
            prev = s;
        }
        res = falg ? res + 1 : res;
    }

    return res;
}

console.log("genStr", genStr(3))
// for (let i = 0; i < 20; i++) {
//     console.log("standardStrNum", standardStrNum(i))
// }


function compriseWays1(arr: number[], w: number): number {
    if (arr == null || arr.length == 0 || w < 0) {
        return 0;
    }
    // dp[i][j]表示用0~i的食物刚好装满j的背包的方法数
    // const dp:number[][] = new Array(arr.length).fill(0).map(arr => (new Array(w+1) as number[]).fill(0));
    const dp:number[][] = new Array(arr.length).fill(0).map(arr => new Array(w+1).fill(0));;
    for (let i = 0; i < arr.length; i++) {
        dp[i][0]  = 1;
    }
    for (let j = 0; j <= w; j++) {
        dp[0][j] = arr[0] <= j ? 2 : 1;
    }
    
    for (let i = 1; i < arr.length; i++) {
        for (let j = 1; j <= w; j++) {
            dp[i][j] = dp[i-1][j] + (j-arr[i] >= 0 ? dp[i-1][j-arr[i]] : 0);
        }
    }
    console.log(dp)
    return dp[arr.length-1][w];
}

console.log("compriseWays", compriseWays1([4,3,2,9], 8))

class Job {
    money: number; // 该工作的报酬
    hard: number; // 该工作的难度
    constructor(hard: number, money: number) {
        this.money = money;
        this.hard = hard;
    }
}

function ChooseWork(job: Job[], ability: number): Job {
    const ableJob = job.filter(item => item.hard <= ability);
    ableJob.sort((a, b) => a.money - b.money);
    return ableJob[ableJob.length - 1];
}
const jobArr = [new Job(1, 100), new Job(10, 1000), new Job(2, 1001), new Job(3, 500), new Job(20, 20000)]
console.log("ChooseWork", ChooseWork(jobArr, 5))
console.log("ChooseWork", ChooseWork(jobArr, 50))