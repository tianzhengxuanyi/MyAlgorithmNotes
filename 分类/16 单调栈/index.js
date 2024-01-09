/**
 * @param {number[]} arr
 * @return {number[][]} [[leftMaxIndex, rightMaxIndex]]
 */
function leftAndRightMaxIndex(arr) {
    const stack = [];
    const res = new Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
        while (stack.length !== 0 && arr[stack[stack.length - 1]] <= arr[i]) {
            let index = stack.pop();
            res[index] = [
                stack.length - 1 >= 0 ? stack[stack.length - 1] : -1,
                i,
            ];
        }
        stack.push(i);
    }
    while (stack.length !== 0) {
        let index = stack.pop();
        res[index] = [stack.length - 1 >= 0 ? stack[stack.length - 1] : -1, -1];
    }
    return res;
}

let arr = [2, 4, 6, 1, 3, 7];

console.log(leftAndRightMaxIndex(arr));

/**
 * @param {number[]} arr
 * @return {number[][]} [[leftMaxIndex, rightMaxIndex]]
 */
function leftAndRightMaxIndex2(arr) {
    const stack = [];
    const res = new Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
        while (stack.length !== 0 && arr[stack[stack.length - 1][0]] < arr[i]) {
            // 不断弹出比arr[i]小的位置
            let indexList = stack.pop();
            for (let index of indexList) {
                // 组织返回值
                res[index] = [
                    stack.length - 1 >= 0
                        ? stack[stack.length - 1][
                              stack[stack.length - 1].length - 1
                          ]
                        : -1,
                    i,
                ];
            }
        }
        if (stack.length > 0 && arr[stack[stack.length - 1][0]] === arr[i]) {
            // 如果有重复值直接加入到末尾
            stack[stack.length - 1].push(i);
        } else {
            stack.push([i]);
        }
    }
    // 弹出栈中剩余的位置
    while (stack.length !== 0) {
        let indexList = stack.pop();
        for (let index of indexList) {
            res[index] = [
                stack.length - 1 >= 0
                    ? stack[stack.length - 1][stack[stack.length - 1].length - 1]
                    : -1,
                -1,
            ];
        }
    }
    return res;
}

let arr2 = [2, 4, 2, 6, 1, 3, 6, 7];

console.log(leftAndRightMaxIndex2(arr2));

/**
 * @param {number[]} arr
 * @return {number[][]} [[leftMaxIndex, rightMaxIndex]]
 */
function leftAndRightMinIndex(arr) {
  const stack = [];
  const res = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
      while (stack.length !== 0 && arr[stack[stack.length - 1][0]] > arr[i]) {
          // 不断弹出比arr[i]大的位置
          let indexList = stack.pop();
          for (let index of indexList) {
              // 组织返回值
              res[index] = [
                  stack.length - 1 >= 0
                      ? stack[stack.length - 1][
                            stack[stack.length - 1].length - 1
                        ]
                      : -1,
                  i,
              ];
          }
      }
      if (stack.length > 0 && arr[stack[stack.length - 1][0]] === arr[i]) {
          // 如果有重复值直接加入到末尾
          stack[stack.length - 1].push(i);
      } else {
          stack.push([i]);
      }
  }
  // 弹出栈中剩余的位置
  while (stack.length !== 0) {
      let indexList = stack.pop();
      for (let index of indexList) {
          res[index] = [
              stack.length - 1 >= 0
                  ? stack[stack.length - 1][stack[stack.length - 1].length - 1]
                  : -1,
              -1,
          ];
      }
  }
  return res;
}
let arr3 = [2, 4, 2, 6, 1, 3, 6, 7];
console.log(leftAndRightMinIndex(arr3));


function maxA(arr) {
  let maxA = - Infinity;
  const minRange = leftAndRightMinIndex(arr);
  for (let i = 0; i < arr.length; i++) {
    let [left, right] = minRange[i];
    let sum = 0;
    left = left === -1 ? i : left + 1;
    right = right === -1 ? i : right - 1;
    for (; left <= right; left++) {
      sum += arr[left]
    }
    maxA = maxA > sum * arr[i] ? maxA :  sum * arr[i]
  }
  return maxA;
}

let arr4 = [5,3,2,1,6,7,8,4];
console.log(maxA(arr4));