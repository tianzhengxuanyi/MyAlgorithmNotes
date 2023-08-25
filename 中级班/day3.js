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
      if (col > 0 && matrix[row][col - 1] === 0) {
        break;
      }
      col--;
    }
    maxRow = maxRowOneCount > ans ? maxRow : row;
    maxRowOneCount = maxRowOneCount > ans ? maxRowOneCount : ans;
  }
  return [maxRow, maxRowOneCount];
}

let maxRowMatrix = [
  [0, 0, 0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 1, 1, 1, 1],
];
console.log("findMaxRow", findMaxRow(maxRowMatrix));

function packingMachine(arr) {
  if (arr === null || arr.length === 0) {
    return -1;
  }
  let sum = 0;
  let sumArr = [];
  let res = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    sumArr.push(sum);
  }
  if (sum % arr.length !== 0) {
    return -1;
  }
  let avg = sum / arr.length;

  for (let i = 0; i < arr.length; i++) {
    let leftMore = i === 0 ? 0 : sumArr[i - 1] - avg * (i - 1);
    let rightMore =
      i === arr.length - 1 ? 0 : sum - sumArr[i] - avg * (arr.length - i - 1);
    if (leftMore < 0 && rightMore < 0) {
      res = Math.max(res, Math.abs(leftMore + rightMore));
    } else {
      res = Math.max(res, Math.max(Math.abs(leftMore), Math.abs(rightMore)));
    }
  }
  return res;
}

console.log("packingMachine", packingMachine([1, 0, 5]));
console.log("packingMachine", packingMachine([2, 2, 3]));

function zigzag(matrix) {
  let row = matrix.length;
  let col = matrix[0].length;

  let ar = 0;
  let ac = 0;
  let br = 0;
  let bc = 0;
  let deg = false;

  while (ac !== col) {
    printZigZag(ar, ac, br, bc, deg);
    ac = ar === row - 1 ? ac + 1 : ac;
    ar = ar === row - 1 ? ar : ar + 1;
    br = bc === col - 1 ? br + 1 : br;
    bc = bc === col - 1 ? bc : bc + 1;
    deg = !deg;
  }

  function printZigZag(ar, ac, br, bc, deg) {
    if (deg) {
      while (bc >= ac) {
        console.log(matrix[br++][bc--]);
      }
    } else {
      while (ar >= br) {
        console.log(matrix[ar--][ac++]);
      }
    }
  }
}

let zigzagMatrix = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
];

zigzag(zigzagMatrix);

function rotateMatrix(matrix) {
  let row = matrix.length;
  let col = matrix[0].length;

  let ar = 0;
  let ac = 0;
  let br = row - 1;
  let bc = col - 1;
  while (ar <= br && ac <= bc) {
    printEdge(ar++, ac++, br--, bc--);
  }

  function printEdge(ar, ac, br, bc) {
    if (ar === br) {
      for (let i = ac; i <= bc; i++) {
        console.log(matrix[ar][i]);
      }
    } else if (ac === bc) {
      for (let i = ar; i <= br; i++) {
        console.log(matrix[i][ac]);
      }
    } else {
      let curR = ar;
      let curC = ac;
      //  向右
      while (curC < bc) {
        console.log(matrix[curR][curC++]);
      }
      //  向下
      while (curR < br) {
        console.log(matrix[curR++][curC]);
      }
      // 向左
      while (curC > 0) {
        console.log(matrix[curR][curC--]);
      }
      // 向上
      while (curR > 0) {
        console.log(matrix[curR--][curC]);
      }
    }
  }
}

let rotate = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
];
console.log("rotateMatrix");
rotateMatrix(rotate);

function printMatrixSpiralOrder(matrix) {
  const row = matrix.length;
  const col = matrix[0].length;

  let ar = 0;
  let ac = 0;
  let br = row - 1;
  let bc = col - 1;

  while (ar <= br) {
    spiralOrder(ar++, ac++, br--, bc--);
  }

  console.log(matrix);

  function spiralOrder(ar, ac, br, bc) {
    let step = br - ar;
    for (let i = 0; i < step; i++) {
      let temp = matrix[ar][ac + i];
      matrix[ar][ac + i] = matrix[br - i][ac];
      matrix[br - i][ac] = matrix[br][bc - i];
      matrix[br][bc - i] = matrix[ar + i][bc];
      matrix[ar + i][bc] = temp;
    }
  }
}

let spiralMatrix = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15],
];
console.log("printMatrixSpiralOrder");
printMatrixSpiralOrder(spiralMatrix);

function splitNbySm(n) {
  if (n < 2) {
    return 0;
  }
  if (isPrim(n)) {
    return n - 1;
  }
  const { sum, count } = divSumAndCount(n);
  return sum - count;
}

// 判断一个数是否是质数
function isPrim(n) {
  if (n < 2) {
    return false;
  }
  let max = Math.sqrt(n);
  for (let i = 2; i <= max; i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
}

/**
 *
 * @param {number} n 质数
 * @returns {object} sum: 因子和 count: 因子个数
 */
function divSumAndCount(n) {
  let sum = 0;
  let count = 0;
  for (let i = 2; i <= n; i++) {
    while (n % i === 0) {
      sum += i;
      count++;
      n = n / i;
    }
  }
  return { sum, count };
}

console.log("splitNbySm", splitNbySm(4));


class Heap {
  constructor(cmp = (x, y) => x >= y) {
    this.cmp = cmp;
    this.heap = [];
  }
  insert(data) {
    const { cmp, heap } = this;
    heap.push(data);
    let index = this.size() - 1;
    let parentIndex = (index - 1) >> 1;
    while (index > 0 && cmp(heap[index], heap[parentIndex])) {
      this.swap(parentIndex, index);
      index = parentIndex;
      parentIndex = (index - 1) >> 1;
    }
  }
  pop() {
    const { heap } = this;
    if (this.isEmpty()) {
      return null;
    }
    this.swap(0, this.size() - 1);
    let res = heap.pop();
    this.heapfiy(0);

    return res;
  }
  heapfiy(index) {
    const { heap, cmp } = this;

    let left = 2 * index + 1;

    while (left < this.size()) {
      let maxIndex =
        left + 1 < this.size() && cmp(heap[left + 1], heap[left]) ? left + 1 : left;
      if (cmp(heap[maxIndex], heap[index])) {
        this.swap(maxIndex, index);
        index = maxIndex;
        left = 2 * index + 1;
      }
    }
  }
  size() {
    return this.heap.length;
  }
  isEmpty() {
    return !this.heap.length;
  }
  peek() {
    return this.heap[0];
  }
  swap(i, j) {
    let temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }
}

function TimesNode(str, times) {
  this.str = str;
  this.times = times;
}

function TopKTimes(arr, k) {
  const hashMap = new Map();
  for (let i = 0; i < arr.length; i++) {
    if (hashMap.has(arr[i])) {
      hashMap.set(arr[i], hashMap.get(arr[i])  + 1);
    } else {
      hashMap.set(arr[i], 1);
    }
  }
  let heap = new Heap((x, y) => x.times >= y.times)
  for (let key of hashMap.keys()) {
    let node = new TimesNode(key, hashMap.get(key));
    heap.insert(node);
  }
  let res = [];
  for (let i = 0; i < k; i++) {
    res.push(heap.pop())
  }
  return res;
}

let topKTimesArr = ["a","b","c","a","x","y","a","b","c", "x", "x", "x"]
console.log(TopKTimes(topKTimesArr, 3))


