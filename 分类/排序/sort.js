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

let bubbleSortArr = [2, 1, 5, 3, 6, 1, 4];
bubbleSort(bubbleSortArr);

console.log("bubbleSort", bubbleSortArr);

function selectSort(arr) {
  if (arr === null || arr.length < 2) {
    return;
  }
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

let selectSortArr = [2, 1, 5, 3, 6, 1, 4];
selectSort(selectSortArr);

console.log("selectSort", selectSortArr);

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

let insertSortArr = [2, 1, 5, 3, 6, 1, 4];
insertSort(insertSortArr);

console.log("insertSort", insertSortArr);

function mergeSort(arr) {
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
  if (arr === null || arr.length < 2) {
    return;
  }
  process(arr, 0, arr.length - 1);
}

let mergeSortArr = [2, 1, 5, 3, 6, 1, 4];
mergeSort(mergeSortArr);

console.log("mergeSort", mergeSortArr);

function quickSort(arr) {
  if (arr === null || arr.length < 2) {
    return;
  }
  function process(arr, L, R) {
    if (L < R) {
      swap(arr, R, parseInt(Math.random() * (R - L + 1) + L));
      const { left, right } = partition(arr, L, R);
      process(arr, L, left);
      process(arr, right, R);
    }
  }
  function partition(arr, L, R) {
    let left = L - 1;
    let right = R + 1;
    let pivot = arr[R];
    let i = L;
    while (i < right) {
      if (arr[i] < pivot) {
        swap(arr, ++left, i++);
      }
      if (arr[i] === pivot) {
        i++;
      }
      if (arr[i] > pivot) {
        swap(arr, --right, i);
      }
    }

    return { left, right };
  }
  process(arr, 0, arr.length - 1);
}

let quickSortArr = [2, 1, 5, 3, 6, 1, 4];
quickSort(quickSortArr);

console.log("quickSort", quickSortArr);
