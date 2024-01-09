function maxValue(weights, values, n) {
    function process(weights, values, n, i, alreadyWight) {
        if (alreadyWight + weights[i] > n) {
            return 0
        }
        if (i === weights.length) {
            return 0
        }
        return Math.max(
            values[i] + process(weights, values, n, i + 1, alreadyWight + weights[i]),
            process(weights, values, n, i + 1, alreadyWight)
        )
    }
    return process(weights, values, n, 0, 0)
}

console.log(maxValue([1,2,3,4,5], [8,5,3,1,5], 4))