/**
 * @description 获取A中未出现的整数
 * @param {number[]} A
 * @returns {number[]}
 */
function findAbsenceNum(A) {
  const ans = [];
  const len = A.length;
  const map = new Map();
  for (let i = 1; i <= len; i++) {
    map.set(i, 0);
  }
  for (let i of A) {
    map.set(i, map.get(i) + 1);
  }
  for (let key of map.keys()) {
    if (!map.get(key)) {
      ans.push(key);
    }
  }
  return ans;
}

/**
 * @description 获取A中未出现的整数
 * @param {number[]} A
 * @returns {number[]}
 */
function findAbsenceNum2(A) {
  const ans = [];
  const len = A.length;

  const swap = (i, j) => {
    let temp = A[i];
    A[i] = A[j];
    A[j] = temp;
  };

  for (let i = 0; i < len; i++) {
    let index = i;
    let next = A[index] - 1;
    // 不断交换位置，将数组中值i+1放在下标i处
    while (next !== i) {
      // 已经有重复的值占位，此时index位置置空
      if (A[next] == A[index]) {
        A[index] = undefined;
        break;
      }
      swap(index, next);
      next = A[index] - 1;
    }
  }

  // 数组中空缺的值就是结果
  for (let i = 0; i < len; i++) {
    if (A[i] == undefined) ans.push(i + 1);
  }
  return ans;
}

let A = [3, 2, 1, 6, 2, 7, 5, 1, 8, 3];

console.log("🚀 ~ findAbsenceNum(A)", findAbsenceNum(A));
console.log("🚀 ~ findAbsenceNum(A)", findAbsenceNum2([...A]));
