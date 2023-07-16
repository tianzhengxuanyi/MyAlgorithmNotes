function reverseStack(stack) {
    function reverse(stack) {
        if (stack.length === 0) {
            return 
        }
        // 弹出栈底元素
        let result = f(stack)
        // 将剩下的元素逆序
        reverse(stack)
        // 将栈底元素压栈
        stack.unshift(result)
    }
    // 只弹出栈底元素 stack= [1,2,3] f(stack) 返回3，stack变为[1,2]
    function f(stack) {
        let result = stack.shift()
        if (stack.length === 0) {
            return result
        } else {
            let last = f(stack)
            stack.unshift(result)
            return last
        }
        
    }
    reverse(stack)
}

let stack = [1,2,3,4,5,6,7,6,5,32]
console.log(reverseStack(stack))
console.log(stack)