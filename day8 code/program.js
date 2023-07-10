// 从早上8点到下午18点
function Program(start, end) {
    this.start = start;
    this.end = end;
}

let program = [];
program.push(new Program(8,12))
program.push(new Program(8,9))
program.push(new Program(10,11))
program.push(new Program(9,14))
program.push(new Program(12,14))
program.push(new Program(15,18))
program.push(new Program(16,17))
program.push(new Program(17,18))

function bestArrange(program, start = 0) {
    program.sort((a,b) => a.end  - b.end)
    let result = 0;
    for (let i = 0; i < program.length; i++) {
        if (program[i].start >= start) {
            result++
            start = program[i].start
        }
    }
    console.log(program)
    return result
}

console.log(bestArrange(program))