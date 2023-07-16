function printAllSubsquences(str) {
    function process(subsquences, i) {
        if (i === str.length) {
            return result.push(subsquences)
        }
        // 前1-i子序列不加上第i个字符
        process(subsquences, i + 1)
        subsquences += str[i]
        // 前1-i子序列加上第i个字符
        process(subsquences, i + 1)
    }
    let result = []
    subsquences = ''
    process(subsquences, 0)
    return result
}

console.log(printAllSubsquences('abs'))