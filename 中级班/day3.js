var findNumberIn2DArray = function (matrix, target) {
    // 1. 从右上角开始寻找,如果cur小于target，j++，如果cur大于target，i--
    if (matrix.length === 0 || matrix[0]?.length === 0) {
        return false;
    }
    let row = 0;
    let col = matrix[0].length - 1;
    while (row < matrix.length && col >= 0) {
        if (target === matrix[row][col]) {
            return true;
        } else if (target > matrix[row][col]) {
            row++;
        } else {
            col--;
        }
    }

    return false;
};

let matrix = [
  [1, 4, 7, 11, 15],
  [2, 5, 8, 12, 19],
  [3, 6, 9, 16, 22],
  [10, 13, 14, 17, 24],
  [18, 21, 23, 26, 30],
];
console.log("findNumberIn2DArray", findNumberIn2DArray(matrix, 20));

function findMaxRow(matrix) {
    if (matrix.length === 0 || matrix[0]?.length === 0) {
        return -1;
    }
    let maxRowOneCount = 0;
    let maxRow = -1;
    let col = matrix[0].length - 1;
    for (let row = 0; row < matrix.length; row++) {
        let ans = matrix[0].length - 1 - col;
        while (matrix[row][col] === 1) {
            ans++;
            if (col > 0 && matrix[row][col-1] === 0) {
                break;
            }
            col--;
        }
        maxRow = maxRowOneCount > ans ? maxRow : row;
        maxRowOneCount = maxRowOneCount > ans ? maxRowOneCount : ans;
    }
    return [maxRow, maxRowOneCount]
}

let maxRowMatrix = [
    [0,0,0,0,0,1,1,1,1],
    [0,0,0,0,0,0,0,1,1],
    [0,0,0,0,1,1,1,1,1],
    [0,0,0,0,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1],
    [0,0,0,0,1,1,1,1,1],
]
console.log("findMaxRow", findMaxRow(maxRowMatrix))


function packingMachine(arr) {
    if (arr === null || arr.length === 0) {
        return -1;
    }
    let sum = 0;
    let sumArr = [];
    let res = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
        sumArr.push(sum)
    }
    if (sum % arr.length !== 0) {
        return -1;
    }
    let avg = sum / arr.length;

    for (let i = 0; i < arr.length; i++) {
        let leftMore = i === 0 ? 0 : sumArr[i-1] - avg * (i - 1);
        let rightMore = i === arr.length - 1 ? 0 : sum - sumArr[i] - avg * (arr.length - i - 1);
        if (leftMore < 0 && rightMore < 0) {
            res = Math.max(res, Math.abs(leftMore+rightMore));
        } else {
            res = Math.max(res, Math.max(Math.abs(leftMore), Math.abs(rightMore)));
        }
    }
    return res;
}

console.log("packingMachine", packingMachine([1,0,5]))
console.log("packingMachine", packingMachine([2,2,3]))

function zigzag(matrix) {
    let row = matrix.length;
    let col = matrix[0].length;

    let ar = 0;
    let ac = 0;
    let br = 0;
    let bc = 0;
    let deg = false;

    while (ac !== col) {
        printZigZag(ar, ac, br, bc, deg)
        ac = ar === row - 1 ? ac + 1 : ac;
        ar = ar === row - 1 ? ar : ar + 1;
        br = bc === col - 1 ? br + 1 : br;
        bc = bc === col - 1 ? bc : bc + 1;
        deg = !deg;
    }

    function printZigZag(ar, ac, br, bc, deg) {
        if (deg) {
            while (bc >= ac) {
                console.log(matrix[br++][bc--])
            }
        } else {
            while (ar >= br) {
                console.log(matrix[ar--][ac++])
            }
        }
    }
}

let zigzagMatrix = [
    [0,1,2,3],
    [4,5,6,7],
    [8,9,10,11]
]

zigzag(zigzagMatrix)

function rotateMatrix(matrix) {
    let row = matrix.length;
    let col = matrix[0].length;

    let ar = 0;
    let ac = 0;
    let br = row - 1;
    let bc = col - 1;
    debugger
    while (ar <= br && ac <= bc) {
        printEdge(ar++, ac++, br--, bc--)
    }

    function printEdge(ar, ac, br, bc) {
        if (ar === br) {
            for (let i = ac; i <= bc; i++) {
                console.log(matrix[ar][i])
            }
        } else if (ac === bc) {
            for (let i = ar; i <= br; i++) {
                console.log(matrix[i][ac])
            }
        } else {
           let curR = ar;
           let curC = ac;
        }
    }
}

let rotate = [
    [0, 1, 2,  3],
    [4, 5, 6,  7],
    [8, 9, 10, 11],
]
console.log("rotateMatrix")
rotateMatrix(rotate)