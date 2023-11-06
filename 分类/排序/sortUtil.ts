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
  static mergeSort(arr: number[]) {}
  // 5.快速排序
  static quickSort(arr: number[]) {}
  // 6.堆排序
  static heapSort(arr: number[]) {}
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

const arr = [2, 1, 8, 3, 7, 4, 9, 3];
// console.log(Sort.selectSort(arr));
// console.log(Sort.bubbleSort(arr))
console.log(Sort.insertSort(arr));
