const HashSet = new Set();
HashSet.add(1)
HashSet.delete(1)
HashSet.has(1)
HashSet.clear()

const HashMap = new Map();
HashMap.set('1', 1)
HashMap.delete('1')
HashMap.has("1")
HashMap.get("1")
HashMap.clear()

class Node {
    constructor(value, next) {
        this.value = value
        this.next = next ? next : null
    }
}

const head = new Node(1)
head.next = new Node(2)
head.next.next = new Node(3)

// 迭代
function reverseList(head) {
    let prev = null
    let curr = head
    let next = null

    while (curr) {
        next = curr.next
        curr.next = prev
        prev = curr
        curr = next
    }
    return prev
}

console.log(reverseList(head))

// 递归
// 将当前node.next指向node，
function reverseListRecursive(head) {
    if (head === null || head.next === null) {
        return head;
    }
    let newHead = reverseListRecursive(head.next)
    head.next.next = head;
    head.next = null;

    return newHead;
}

console.log(reverseListRecursive(head))

class Node {
    constructor(value, next, last) {
        this.value = value;
        this.next = next;
        this.last = last;
    }
}