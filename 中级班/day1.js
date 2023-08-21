function coverMaxPoint(arr, L) {
    let res = 1;
    for (let i = 0; i < arr.length; i++) {
        let index = nearestIndex(arr, i, arr[i] - L);
        res = res > i - index + 1 ? res : i - index + 1;
    }
    return res;
}

function nearestIndex(arr, R, value) {
    let left = 0;
    let index = R;

    while (left < R) {
        let mid = left + ((R - left) >> 1);
        if (arr[mid] >= value) {
            index = mid
            R = mid - 1
        } else {
            left = mid + 1
        }
    }

    return index;
}

console.log("coverMaxPoint", coverMaxPoint([0,13,24,35,46,57,60,72,87], 6))