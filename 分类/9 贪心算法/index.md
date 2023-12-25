## 贪心算法

在某一个标准下，优先考虑最满足标准的样本，然后考虑最不满足的样本，最终得到一个答案的算法，叫做贪心算法。
即不从整体最优上加以考虑，所做出的是在某种意义上的**局部最优解**

**解题套路：**

1. 实现一个不依靠贪心策略的解法 x，可以用最暴力的尝试

2. 脑补出贪心策略

3. 用解法 X 和对数器，验证每一个贪心策略，用实验得到正确解

**tips：**

- 贪心算法中堆和排序是最常用的两个技巧

### **会议安排**

- [贪心算法 3： 会议安排](https://blog.csdn.net/yanyanwenmeng/article/details/83009649)

一些项目要占用一个会议室宣讲，会议室不能同时容纳俩个项目，给出项目的起始时间和截止时间，如何安排最多的项目。

**策略：截止时间早**
以截至时间排序，选择截至时间在前的会议。每当选择一个会议时，以这个会议的 end 为时间点判断接下来的会议是否满足条件

```ts
function Program(start, end) {
  this.start = start;
  this.end = end;
}

function bestArrange(program: Program[]) {
  program.sort((a, b) => a.end - b.end);
  let lastEnd = program[0].end;
  let result = 1;
  for (let i = 1; i < program.length; i++) {
    if (program[i].start >= lastEnd) {
      result++;
      lastEnd = program[i].end;
    }
  }
  return result;
}
```

### **金条问题**

一块金条切成两半，是需要花费和长度数值一样的铜板的。比如长度为 20 的金条，不管切成长度多大的两半，都要花费 20 个铜板。

一群人想整分整块金条，怎么分最省铜板？

例如,给定数组{10,20,30}，代表一共三个人，整块金条长度为 10+20+30=60. 金条要分成 10,20,30 三个部分。

如果先把长度 60 的金条分成 10 和 50，花费 60 再把长度 50 的金条分成 20 和 30，花费 50，一共花费 110 铜板。

但是如果先把长度 60 的金条分成 30 和 30，花费 60；再把长度 30 金条分成 10 和 20，花费 30；一共花费 90 铜板。

输入一个数组，返回分割的最小代价。

**思路：**

1. 将给定数组全部加入小根堆中；
2. 从小根堆中弹出堆顶的两个元素，将它们相加并计入sum，然后将相加的值insert入小根堆；
3. 重复步骤2直到小根堆size小于等于1；

```ts
namespace LessMoney {
  class Heap {
    heap: any[];
    cmp: (a: any, b: any) => any;
    constructor(arr?: number[], cmp = (a: any, b: any) => a - b) {
      this.heap = [];
      this.cmp = cmp;
      if (arr) {
        arr.forEach((item) => {
          this.insert(item);
        });
      }
    }
    insert(data: any) {
      this.heap.push(data);
      let current = this.getSize() - 1;
      let parentIndex = (current - 1) >> 1;
      while (
        parentIndex >= 0 &&
        this.cmp(this.heap[current], this.heap[parentIndex]) > 0
      ) {
        this.swap(current, parentIndex);
        current = parentIndex;
        parentIndex = (current - 1) >> 1;
      }
    }
    heapify(index: number) {
      let size = this.getSize() - 1;
      let current = index;
      let left = 2 * current + 1;
      while (left <= size) {
        let maxIndex =
          left + 1 <= size && this.heap[left + 1] > this.heap[left]
            ? left + 1
            : left;
        if (this.cmp(this.heap[maxIndex], this.heap[current]) > 0) {
          this.swap(maxIndex, current);
          current = maxIndex;
          left = 2 * current + 1;
        } else {
          break;
        }
      }
    }
    pop() {
      let size = this.getSize() - 1;
      this.swap(0, size);
      let ret = this.heap.pop();
      this.heapify(0);
      return ret;
    }
    getSize() {
      return this.heap.length;
    }
    swap(i: number, j: number) {
      const temp = this.heap[i];
      this.heap[i] = this.heap[j];
      this.heap[j] = temp;
    }
  }
  function lessMoney(arr: number[]): number {
    let ans = 0;
    let heap = new Heap(arr, (a, b) => b - a); // 小根堆
    while (heap.getSize() > 1) {
      ans += heap.pop() + heap.pop();
      heap.insert(ans);
    }

    return ans;
  }
}
```

### **IPO**

给定初始资金和最多做几个项目，最大化资本

![IPO](../../image/day8-2.png)

**思路：**
先给定一个花费组织排序的小根堆，锁住，在给定一个大根堆，以利润组织

1. 先对所有项目以最小资本升序排序，如果最小资本相同的利润大的放在前面；
2. 将当前资本所能够解锁的项目弹出，放入大根堆中以利润组织；
3. 从大根堆中弹出堆顶，为当前能做的利润最大的项目，更新当前资本，循环 2~3；
4. 如果步骤 2 过后，大根堆中无项目表示当前资本无能力解锁项目，提前退出；
5.

```js
class Heap {
  constructor(cmp = (x, y) => x - y) {
    this.heap = [];
    this.cmp = cmp;
  }
  insert(data) {
    const { heap, cmp, swap } = this;
    heap.push(data);
    let index = this.size() - 1;
    while (index) {
      let parentIndex = (index - 1) >> 1;
      if (!cmp(heap[index], heap[parentIndex])) return;
      swap(heap, index, parentIndex);
      index = parentIndex;
    }
  }
  pop() {
    const { heap, swap } = this;
    if (!this.size()) {
      return null;
    }
    swap(heap, 0, this.size() - 1);
    let res = heap.pop();

    let len = this.size();
    // 有可能没有右孩子但是又左孩子，所以以左孩子进行判断
    let index = 0,
      left = index * 2 + 1;

    while (left < len) {
      let largestIndex =
        left + 1 < len && this.cmp(heap[left + 1], heap[left])
          ? left + 1
          : left;
      if (this.cmp(heap[index], heap[largestIndex])) {
        break;
      }
      swap(heap, index, largestIndex);
      index = largestIndex;
      left = index * 2 + 1;
    }

    return res;
  }
  swap(arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  size() {
    return this.heap.length;
  }
  peak() {
    return this.heap[0];
  }
  isEmpty() {
    return !this.heap.length;
  }
}
var findMaximizedCapital = function (k, w, profits, capital) {
  let n = capital.length;
  let minCosts = [];
  let maxProfit = new Heap();
  for (let i = 0; i < n; i++) {
    minCosts.push([profits[i], capital[i]]);
  }
  minCosts.sort((a, b) => a[1] - b[1]);
  let curr = 0;
  for (let i = 0; i < k; i++) {
    while (curr < n && minCosts[curr][1] <= w) {
      maxProfit.insert(minCosts[curr++][0]);
    }
    if (!maxProfit.size()) {
      return w;
    }
    w += maxProfit.pop();
  }
  return w;
};
```
