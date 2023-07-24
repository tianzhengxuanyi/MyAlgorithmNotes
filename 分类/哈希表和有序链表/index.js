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

function reverseList(node) {
    
}