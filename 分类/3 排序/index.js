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
        swap(arr, right, R);
        return [left + 1, right];
    }
    process(arr, 0, arr.length - 1);
}
// function quickSort(arr, L, R) {
//   if (L < R) {
//       swap(arr, Math.floor((R - L + 1) * Math.random() + L), R);
//       let p = partition(arr, L, R);
//       quickSort(arr, L, p[0] - 1);
//       quickSort(arr, p[1] + 1, R);
//   }
// }

// function partition(arr, L, R) {
//   let left = L - 1;
//   let right = R;

//   while (L < right) {
//       if (arr[L] < arr[R]) {
//           swap(arr, ++left, L++);
//       } else if (arr[L] >  arr[R]) {
//           swap(arr, --right, L);
//       } else {
//         L++;
//       }
//   }
//   swap(arr, right, R)
//   return [left + 1, right];
// }

let quickSortArr = [2, 1, 5, 3, 6, 1, 4];
quickSort(quickSortArr);
// quickSort(quickSortArr, 0, 6);

console.log("quickSort", quickSortArr);

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

let heapSortArr = [2, 1, 5, 3, 6, 1, 4];
heapSort(heapSortArr);

console.log("heapSort", heapSortArr);

function countingSort(arr, maxValue) {
    const buket = new Array(maxValue + 1).fill(0);
    let sortLen = 0;
    for (let i = 0; i < arr.length; i++) {
        buket[arr[i]]++;
    }

    for (let j = 0; j < buket.length; j++) {
        while (buket[j] > 0) {
            arr[sortLen++] = j;
            buket[j]--;
        }
    }
    return arr;
}

console.log("countingSort", countingSort([100, 5, 2, 7, 90, 55, 12], 100));

function smallSum(arr) {
    if (arr.length < 2) {
        return 0;
    }
    let ans = 0;
    for (let i = 1; i < arr.length; i++) {
        for (let j = 0; j < i; j++) {
            if (arr[j] < arr[i]) {
                ans += arr[j];
            }
        }
    }
    return ans;
}

console.log("smallSum", smallSum([1, 3, 4, 2, 5]));

function smallSum2(arr) {
    if (arr.length < 2) {
        return 0;
    }
    function process(arr, left, right) {
        if (left >= right) {
            return 0;
        }
        let mid = ((right - left) >> 1) + left;
        return (
            process(arr, left, mid) +
            process(arr, mid + 1, right) +
            merge(arr, left, mid, right)
        );
    }

    function merge(arr, left, mid, right) {
      let help = new Array(right - left + 1);
      let l1 = left
      let l2 = mid + 1;
      let res = 0;
      let index = 0;
      while (l1 <= mid && l2 <= right) {
        res += arr[l1] < arr[l2] ? (right - l2 + 1) * arr[l1] : 0;
        help[index++] = arr[l1] < arr[l2] ? arr[l1++] : arr[l2++];
      }
      while (l1 <= mid) {
        help[index++] = arr[l1++];
      }
      while (l2 <= right) {
        help[index++] = arr[l2++];
      }
      for (let i = 0; i < help.length; i++) {
        arr[left + i] = help[i];
      }
      return res;
    }

    return process(arr, 0, arr.length - 1);
}

console.log("smallSum", smallSum2([1, 3, 4, 2, 5]));
