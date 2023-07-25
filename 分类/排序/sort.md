# 排序

## 冒泡排序

**时间复杂度：** `O(N^2)`

**空间复杂度：** `O(1)`

**稳定性：** 稳定

**算法步骤：**

- 遍历数组待排序部分
- 比较当前位置和相邻下个位置数字大小，如果当前位置大，交换两个位置的数
- 遍历完成后，待排序部分最右侧的值为待排序部分的最大值，待排序长度-1
- 重复上述步骤

```js
function bubbleSort(arr) {
  if (arr === null || arr.length < 2) {
    return;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
      }
    }
  }
}
function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}
```

## 选择排序

**时间复杂度：** `O(N^2)`

**空间复杂度：** `O(1)`

**稳定性：** 不稳定

**算法步骤：**

- 遍历待排序部分
- 选择出待排序部分最小值与待排序部分第一个值交换，待排序部分起始下标+1
- 重复上述步骤

```js
function selectSort(arr) {
  if (arr === null || arr.length < 2) {
    return;
  }
  //  边界条件需要注意
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    swap(arr, i, minIndex);
  }
}
```

## 插入排序

**时间复杂度：** `O(N^2)`

**空间复杂度：** `O(1)`

**稳定性：** 稳定

**算法步骤：**

- 将待排序序列第一个元素看做一个有序序列，把第二个元素到最后一个元素当成是未排序序列。
- 从头到尾依次扫描未排序序列，将扫描到的每个元素插入有序序列的适当位置。（如果待插入的元素与有序序列中的某个元素相等，则将待插入元素插入到相等元素的后面。）

```js
function insertSort(arr) {
  if (arr === null || arr.length < 2) {
    return;
  }
  for (let i = 1; i < arr.length; i++) {
    let currIndex = i;
    for (let j = i - 1; j >= 0; j--) {
      if (arr[currIndex] < arr[j]) {
        swap(arr, currIndex, j);
        currIndex = j;
      } else {
        break;
      }
    }
  }
}
```

## 归并排序

**时间复杂度：** `O(N*logN)`

**空间复杂度：** `O(N)`

**稳定性：** 稳定

**算法步骤(递归)：**

- 申请空间，使其大小为两个已经排序序列之和，该空间用来存放合并后的序列；
- 递归序列左侧部分使其有序；
- 递归序列右侧部分使其有序；
- 利用额外空间将左侧和右侧合并，并使合并后的序列有序；
- 将合并序列复制到原序列。

```js
function mergeSort(arr) {
  if (arr === null || arr.length < 2) {
    return;
  }
  process(arr, 0, arr.length - 1);
}
function process(arr, L, R) {
  if (L === R) {
    return;
  }
  let mid = ((R - L) >> 1) + L;
  process(arr, L, mid);
  process(arr, mid + 1, R);
  merge(arr, L, mid, R);
}
function merge(arr, L, mid, R) {
  let help = new Array(R - L + 1);
  let left1 = L;
  let left2 = mid + 1;
  let i = 0;
  while (left1 <= mid && left2 <= R) {
    help[i++] = arr[left1] < arr[left2] ? arr[left1++] : arr[left2++];
  }
  while (left1 <= mid) {
    help[i++] = arr[left1++];
  }
  while (left2 <= R) {
    help[i++] = arr[left2++];
  }
  for (i = 0; i < help.length; i++) {
    arr[L + i] = help[i];
  }
}
```

## 快速排序

**时间复杂度：** `O(N*logN)`

**空间复杂度：** `O(logN)`

**稳定性：** 不稳定

**算法步骤：**

- 随机选取数列中的一个元素与最后一个元素交换，此时最后一个元素为"基准"(pivot);
- 设立双指针分别指向下标-1(left)和数列末尾(right)，代表小于基准的分区和大于基准的分区；
- 遍历数列，如果当前值小于基准，则与 left 指针下一位交换位置，left 指针+1；
- 如果当前值等于基准，继续遍历；
- 如果当前值大于基准，则与 right 指针前一位交换位置，right 指针-1，交换后的当前位置再与基准进行比较；
- 当前遍历位置与 right 指针相遇，终止遍历，返回当前的 left 和 right 指针；
- 根据返回的 left 和 right 指针，将小于基准的分区和大于基准的分区按照上述步骤递归排序；

```js
function quickSort(arr) {
  if (arr === null || arr.length < 2) {
    return;
  }
  function process(arr, L, R) {
    if (L < R) {
      swap(arr, Math.floor((R - L + 1) * Math.random() + L), R);
      const p = partition(arr, L, R);
      process(arr, L, p[0] - 1);
      process(arr, p[1] + 1, R);
    }
  }
  function partition(arr, L, R) {
    let left = L - 1;
    let right = R;
    while (L < right) {
      if (arr[L] < arr[R]) {
        swap(arr, ++left, L++);
      } else if (arr[L] > arr[R]) {
        swap(arr, --right, L);
      } else {
        L++;
      }
    }
    swap(arr, right, R)
    return [left + 1, right];
  }
  process(arr, 0, arr.length - 1);
}
```

## 堆排序

**时间复杂度：** `O(N*logN)`

**空间复杂度：** `O(1)`

**稳定性：** 不稳定

**算法步骤：**

- 将数组利用heapInsert或者heapfiy变成大根堆，此时数组中最大值在堆顶，堆size为数组长度
- 将数组第一项和最后一项交换，堆size减一，并对堆从第一项进行heapfiy；
- 循环执行直到堆size为0
  
```js
function heapSort(arr) {
  if (arr === null || arr.length < 2) {
    return;
  }
  for (let i = 0; i < arr.length; i++) {
    heapInsert(arr, i);
  }
  let heapSize = arr.length;
  swap(arr, 0, --heapSize);

  while (heapSize > 0) {
    heapfiy(arr, 0, heapSize);
    swap(arr, 0, --heapSize);
  }
}

function heapInsert(arr, i) {
  while (arr[i] > arr[(i - 1) >> 1]) {
    swap(arr, i, (i - 1) >> 1);
    i = (i - 1) >> 1;
  }
}

function heapfiy(arr, i, heapSize) {
  let left = 2 * i + 1;

  while (left < heapSize) {
    let maxIndex =
      left + 1 < heapSize && arr[left + 1] > arr[left] ? left + 1 : left;
    if (arr[i] > arr[maxIndex]) {
      break;
    }
    swap(arr, i, maxIndex);
    i = maxIndex;
    left = 2 * i + 1;
  }
}
```

## 排序总结

|             | 时间复杂度  | 空间复杂度 | 稳定性 |
| :---------: | ----------- | ---------- | ------ |
|  选择排序   | `O(N^2)`    | `O(1) `    | ×      |
|  冒泡排序   | `O(N^2)`    | `O(1) `    | √      |
|  插入排序   | `O(N^2)`    | `O(1)`     | √      |
|  归并排序   | `O(N*logN)` | `O(N)`     | √      |
| 快排（3.0） | `O(N*logN)` | `O(logN)`  | ×      |
|   堆排序    | `O(N*logN)` | `O(1) `    | ×      |

