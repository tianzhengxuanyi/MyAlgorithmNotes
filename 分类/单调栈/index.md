## 单调栈

在数组中想找到一个数，左边和右边比这个数大、且离这个数最近的位置。

如果对每一个数都想求这样的信息，能不能整体代价达到 O(N)？（借助单调栈）

**1. 数组中无重复值**

**思路：**

1. 创建单调栈存储数组下标，以下标对应值组织严格保持单调性（栈顶（小）->栈底（大））；
2. 将数组下标（`i`）依次加入单调栈，每次加入时与栈顶下标对应值比较，如果当前下标对应值大于或等于栈顶所对应值，则将栈顶下标弹出。组织弹出下标的返回值，`{leftMax: 栈顶, rightMax: i}`。当前下标继续与栈顶位置比较，直到将其放置在合适位置严格保证单调性；
3. 数组遍历完成后，将单调栈下标依次弹出，此时每个被弹出下标的返回值`{leftMax: 栈顶, rightMax: -1}`（-1 表示无比这个数大的位置）；

```js
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
```

**2. 数组中有重复值**

**思路：** 同上，重复值下标以数组方式存储在单调栈中

```js
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
                    ? stack[stack.length - 1][stack[stack.length - 1].length]
                    : -1,
                -1,
            ];
        }
    }
    return res;
}
```

**3. 应用**

数组中累积和与最小值的乘积，假设叫做指标 A。给定一个数组，请返回**子数组**中，指标 A 最大的值。

如：5 3 2 1 6，指标 A 为`17 * 1 = 17`

**思路：**

-   遍历整个数组，求以当前遍历的值为最小值所能组成的最大长度子数组的指标 A，选出所有指标 A 中最大值；
-   找到当前遍历的值为最小值所能组成的最大长度子数组：套用单调栈寻找左右两侧最近比当前值小的位置，两者之间即为所寻找的数组；

```js
/**
 * @param {number[]} arr
 * @return {number[][]} [[leftMinIndex, rightMinIndex]]
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

function maxA(arr) {
    let maxA = -Infinity;
    const minRange = leftAndRightMinIndex(arr);
    for (let i = 0; i < arr.length; i++) {
        let [left, right] = minRange[i];
        let sum = 0;
        left = left === -1 ? i : left + 1;
        right = right === -1 ? i : right - 1;
        for (; left <= right; left++) {
            sum += arr[left];
        }
        maxA = maxA > sum * arr[i] ? maxA : sum * arr[i];
    }
    return maxA;
}
```
