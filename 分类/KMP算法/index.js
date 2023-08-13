function getIndexOf(str1, str2) {
    const str1Arr = str1.split("");
    const str2Arr = str2.split("");
    const next = getNextArr(str2Arr);
    // str1Arr下标
    let i1 = 0;
    // str2Arr下标
    let i2 = 0;

    while (i1 < str1Arr.length && i2 < str2Arr.length) {
        if (str1Arr[i1] === str2Arr[i2]) {
            i1 += 1;
            i2 += 1;
        } else if (i2 === 0) {
            i1 += 1;
        } else {
            i2 = next[i2]
        }
    }

    return i2 === str2Arr.length ? i1 - i2 : -1;
}

function getNextArr(arr) {
    if (arr.length < 2) {
        return [-1];
    }
    const next = new Array(arr.length);
    next[0] = -1;
    next[1] = 0;

    let prev = 0;
    let currIndex = 2;

    while (currIndex < arr.length) {
        if (arr[currIndex - 1] === arr[prev]) {
            next[currIndex++] = ++prev;
        } else if (prev > 0) {
            prev = next[prev];
        } else {
            next[currIndex++] = 0;
        }
    }

    return next;
}


const str1 = "qcvasdasasabcdefghijklmabcdefgbnsdsas";
// const str2 = "aaaa";
const str2 = "abcdefghijklmabcdefg";

console.log(getIndexOf(str1, str2));
