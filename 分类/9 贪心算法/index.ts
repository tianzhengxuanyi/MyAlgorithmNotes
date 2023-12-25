namespace BestArrange {
  class Program {
    start: number;
    end: number;

    constructor(start: number, end: number) {
      this.start = start;
      this.end = end;
    }
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

  const time = [
    [3, 6],
    [1, 4],
    [5, 7],
    [2, 5],
    [5, 9],
    [3, 8],
    [8, 11],
    [6, 10],
    [8, 12],
    [12, 14],
  ];
  const program: Program[] = time.map((item) => {
    return new Program(item[0], item[1]);
  });
  console.log(
    "🚀 ~ file: index.ts:32 ~ bestArrange(program):",
    bestArrange(program)
  );
}

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
  console.log("🚀 ~ file: index.ts:101 ~ lessMoney ~ lessMoney:", lessMoney([10, 20, 40, 30]));
}
