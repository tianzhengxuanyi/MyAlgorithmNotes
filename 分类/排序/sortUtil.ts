class Sort {
  // 1.选择排序 选择出待排序部分最小值与待排序部分第一个值交换，待排序部分起始下标+1
  static selectSort(arr: number[]) {
    const len = arr.length;
    for (let i = 0; i < len - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < len; j++) {
        minIndex = arr[minIndex] > arr[j] ? j : minIndex;
      }
      Sort.swap(arr, i, minIndex);
    }
    return arr;
  }
  // 2.冒泡排序
  static bubbleSort(arr: number[]) {
    const len = arr.length;
    for (let i = len - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        if (arr[j] > arr[j + 1]) {
          Sort.swap(arr, j, j + 1);
        }
      }
    }
    return arr;
  }
  // 3.插入排序
  static insertSort(arr: number[]) {
    const len = arr.length;
    for (let i = 1; i < len; i++) {
      let swapIndex = i;
      for (let j = i - 1; j >= 0; j--) {
        if (arr[i] >= arr[j]) {
          break;
        } else {
          swapIndex = j;
        }
      }
      Sort.swap(arr, swapIndex, i);
    }
    return arr;
  }
  // 4.归并排序
  static mergeSort(arr: number[]) {
    const len = arr.length;
    const process = (arr: number[], left: number, right: number) => {
      if (left >= right) {
        return arr;
      }
      // 获取中间下标
      const mid =  ((right - left) >> 1) + left;
      // 左部分排序
      process(arr, left, mid);
      // 右部分排序
      process(arr, mid + 1, right);
      // 左右排序合并
      merge(arr, left, mid, right);
      return arr;
    };
    const merge = (arr: number[], left: number, mid: number, right: number) => {
      const help = new Array(arr.length);
      let index = left;
      let l = left;
      let l2 = mid + 1;
      while (l <= mid && l2 <= right) {
        help[index++] = arr[l] < arr[l2] ? arr[l++] : arr[l2++];
      }
      while (l <= mid) {
        help[index++] = arr[l++];
      }
      while (l2 <= right) {
        help[index++] = arr[l2++];
      }
      for (let i = left; i <= right; i++) {
        arr[i] = help[i];
      }
    };
    return process(arr, 0, len - 1);
  }
  // 5.快速排序
  static quickSort(arr: number[]) {
    // 从数组中选取任意下标位置为中间值mid，交换到数组最后
    // 设定左右指针，划定小于mid、等于mid、大于mid三个区域，遍历将数组按照规定区域划分
    // 小于mid、大于mid区域递归排序
    const process = (arr: number[], left:number, right:number) => {
      if (left >= right) {
        return;
      }
      // 从数组中选取任意下标位置为中间值mid，交换到数组最后
      Sort.swap(arr, right, Math.floor(Math.random() * (right -  left + 1) + left));
      // 数组最后一位为基准
      const pivot = arr[right];
      // 小于区右边界指针
      let l = left - 1;
      // 大于区左边界指针
      let r = right;
      // 遍历下标
      let i = left;
      while (i < r) {
        if (arr[i] > pivot) {
          // 如果大于基准，与大于区前一个交换，当前下标不变
          this.swap(arr, i, --r)
        } else if (arr[i] < pivot) {
          // 如果小于基准，与小于区后一个交换，当前下标+1
          this.swap(arr, i++, ++l)
        } else {
          // 等于基准，当前下标+1
          i++
        }
      }
      // 交换基准和大于区指针
      this.swap(arr, right, r);
      process(arr, left, l);
      process(arr, r+1, right);
    }
    process(arr, 0, arr.length - 1)
    return arr;
  }
  // 6.堆排序
  static heapSort(arr: number[]) {
    
  }
  // 7.计数排序
  static countingSort(arr: number[]) {}
  // 8.桶排序
  static bucketSort(arr: number[]) {}
  // 9.基数排序
  static radixSort(arr: number[]) {}

  static swap(arr: number[], i: number, j: number) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}

const arr = [8,2, 1, 8, 3, 7, 4, 9, 3,1];
// console.log(Sort.selectSort(arr));
// console.log(Sort.bubbleSort(arr))
// console.log(Sort.insertSort(arr));
// console.log(Sort.mergeSort(arr));
console.log(Sort.quickSort(arr));
