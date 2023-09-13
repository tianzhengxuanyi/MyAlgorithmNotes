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
