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
      res[index] = [stack.length - 1 >= 0 ? stack[stack.length - 1] : -1, i];
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
            ? stack[stack.length - 1][stack[stack.length - 1].length - 1]
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

- 遍历整个数组，求以当前遍历的值为最小值所能组成的最大长度子数组的指标 A，选出所有指标 A 中最大值；
- 找到当前遍历的值为最小值所能组成的最大长度子数组：套用单调栈寻找左右两侧最近比当前值小的位置，两者之间即为所寻找的数组；

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
            ? stack[stack.length - 1][stack[stack.length - 1].length - 1]
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

### [美丽塔 Ⅱ](https://leetcode.cn/problems/beautiful-towers-ii)

给你一个长度为 n 下标从 0 开始的整数数组 maxHeights 。

你的任务是在坐标轴上建 n 座塔。第 i 座塔的下标为 i ，高度为 heights[i] 。

如果以下条件满足，我们称这些塔是 美丽 的：

- 1 <= heights[i] <= maxHeights[i]
- heights 是一个 山脉 数组。

如果存在下标 i 满足以下条件，那么我们称数组 heights 是一个 山脉 数组：

- 对于所有 0 < j <= i ，都有 heights[j - 1] <= heights[j]
- 对于所有 i <= k < n - 1 ，都有 heights[k + 1] <= heights[k]

请你返回满足 美丽塔 要求的方案中，高度和的最大值 。

### [2487. 从链表中移除节点](https://leetcode.cn/problems/remove-nodes-from-linked-list/description/)

给你一个链表的头节点 head 。

移除每个右侧有一个更大数值的节点。

返回修改后链表的头节点 head 。

### [739. 每日温度]

**从左向右**

```js
/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
var dailyTemperatures = function (temperatures) {
    const st = [];
    const ans = new Array(temperatures.length).fill(0);
    for (let i = 0; i < temperatures.length; i++) {
        while (st.length !== 0 && temperatures[i] > temperatures[st[st.length - 1]]) {
            let j = st.pop();
            ans[j] = i - j;
        }
        st.push(i);
    }
    return ans;
};
```

**从右向左**

```js
/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
var dailyTemperatures = function (temperatures) {
    const st = [];
    const ans = [];
    for (let i = temperatures.length - 1; i >= 0; i--) {
        while (st.length !== 0 && temperatures[st[st.length - 1]] <= temperatures[i]) {
            st.pop();
        }
        ans[i] = st.length ? st[st.length - 1] - i : 0;
        st.push(i);
    }
    return ans;
};
```

### 题单

单调栈原理讲解 739. 每日温度 1475. 商品折扣后的最终价格 1212 496. 下一个更大元素 I 503. 下一个更大元素 II 1019. 链表中的下一个更大节点 1571 962. 最大宽度坡 1608 901. 股票价格跨度 1709 42. 接雨水 \*也有其它做法 1124. 表现良好的最长时间段 1908 1793. 好子数组的最大分数 1946 456. 132 模式 ~2000 2866. 美丽塔 II 2072 2454. 下一个更大元素 IV 2175 2289. 使数组按非递减顺序排列 2482 1776. 车队 II 2531 2832. 每个元素为最大值的最大范围（会员题）

2833. 下一个更大元素 I（单调栈模板题）
2834. 下一个更大元素 II
2835. 下一个更大元素 IV
2836. 132 模式
2837. 每日温度
2838. 股票价格跨度
2839. 链表中的下一个更大节点
2840. 表现良好的最长时间段
2841. 商品折扣后的最终价格
2842. 使数组按非递减顺序排列

2843. 队列中可以看到的人数

作者：灵茶山艾府
链接：https://leetcode.cn/problems/beautiful-towers-ii/submissions/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
