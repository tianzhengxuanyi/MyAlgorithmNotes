function getOdd(arr) {
    let res = 0;
    for (let i of arr) {
        res ^= i;
    }
    return res;
}


function getOdd2(arr) {
    let res = 0;
    for (let i of arr) {
        res ^= i;
    }
    let rightOne = res & (~res + 1);
    let ans = 0;
    for (let i of arr) {
        if ((rightOne & i) === 0) {
            ans ^= i;
        }
    }
    return [ans, res ^ ans]
}

let arr2 = [1,2,3,4,5,2,3,4,1,5,5,1];
console.log(getOdd2(arr2))