问题一：如何在一个有序数组中找某个是否存在？

**思路：** 遍历，时间复杂度O(N) , 二分法

经典二分：

![](../../image/day1-2.jpg)

```js
function BSexist(arr, num) {
    let L = 0;
    let R = arr.length - 1;
    let mid = 0;
    while(L <= R) {
        mid = L + (L - R) / 2;
        if (arr[mid] == num) {
            return true;
        } else if (arr[mid] < num) {
            L = mid + 1;
        } else {
            R = mid - 1;
        }
	}
    return arr[L] == num;
}
```



问题二：在有序数组中找大于等于某个数最左侧的位置

![](../../image/day1-3.jpeg)

```js
function BSfindLeftMax(arr, num) {
    let L = 0;
    let R = arr.length - 1;
    let mid = 0;
    let leftMaxIndex = -1;
    while (L < R) {
		mid = L + (L - R) / 2;
        if (arr[mid] >= num) {
            leftMaxIndex = mid;
            R = mid - 1;
        } else {
            L = mid + 1;
        }
    }
    return leftMaxIndex;
}
```

 

问题三：局部最小值，在一个无序数组中，任意两个相邻的元素不相等，定义一个局部最小

![](../../image/day1-4.jpg)

```js
function BSFindMin(arr) {
    // 无序数组中寻找到任意一个局部最小值
    if (arr.length < 1 || arr === null) return;
    let L = 0;
    let R = arr.length - 1;
    let mid = 0;
    if (arr[L] < arr[L + 1]) {
        return arr[L];
    } else if (arr[R] < arr[R - 1]) {
        return arr[R];
    }
    while (L <= R) {
        mid = L + ((R - L) >> 1);

        if (arr[mid - 1] > arr[mid] && arr[mid + 1] > arr[mid]) {
            return mid;
        } else if (arr[mid - 1] < arr[mid]) {
            R = mid - 1;
        } else if (arr[mid + 1] < arr[mid]) {
            L = mid + 1;
        }
    }
    return arr[L];
}
```