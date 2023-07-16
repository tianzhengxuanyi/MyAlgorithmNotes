function win(arr) {
    // 先手函数
    // 在L到R范围上先手可以获得的最大分数
    function f(arr, L, R) {
        if (L === R) {
            // base case 只有一个数，先手直接拿走
            return arr[L]
        }
        // 先手拿L获得的最大分为 arr[L]加上后手在L+1到R上的最大值
        let LMax = arr[L] + s(arr, L + 1, R)
        // 先手拿R获得的最大分为 arr[R]加上后手在L到R-1上的最大值
        let RMax = arr[R] + s(arr, L, R - 1)
        return Math.max(LMax, RMax)
    }
    // 在L到R范围上后手可以获得的最大分数
    function s(arr, L, R) {
        if (L === R) {
            // base case 如果只剩一个数，后手没有数可拿，返回0
            return 0
        }
        // 后手的情况下，对手先手拿到最优的值，自己则会拿到最小的值
        return Math.min(f(arr, L+1, R), f(arr, L, R -1))
    }

    return Math.max(f(arr, 0, arr.length - 1), s(arr, 0, arr.length -1))
}

console.log(win([1,2,100,4]))
console.log(win([1,100,4]))
console.log(win([1,100,4, 5]))
