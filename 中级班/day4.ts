class Pet {
    type: string;
    constructor(type: string) {
        this.type = type;
    }
    getPetType() {
        return this.type;
    }
}

class Dog extends Pet {
    constructor() {
        super("dog");
    }
}

class Cat extends Pet {
    constructor() {
        super("cat");
    }
}

class DogCatQueue {
    dogQueue: Array<Dog>
    catQueue: Array<Cat>
    queue: Array<Cat|Dog>
    constructor() {
        this.dogQueue = [];
        this.catQueue = [];
        this.queue = [];
    }
    add(instance: Cat|Dog): void {
        this.queue.push(instance);
        if (instance instanceof Dog) {
            this.dogQueue.push(instance);
        } else {
            this.catQueue.push(instance);
        }
    }
    pollAll(): void {
        while (this.queue.length !== 0) {
            console.log(this.queue.shift());
        }
    }
    pollDog(): void {

    }
    isEmpty(): boolean {
        return !this.queue.length;
    }
    isDogEmpty(): boolean {
        return !this.dogQueue.length;
    }
    isCatEmpty(): boolean {
        return !this.catQueue.length;
    }
}

class MinStack {
    stack: number[];
    minStack: number[];
    constructor() {
        this.stack = [];
        this.minStack = [];
    }
    push(num: number): void {
        this.stack.push(num);
        if (this.minStack.length === 0 || this.minStack[this.minStack.length - 1] > num) {
            this.minStack.push(num);
        }
    }
    pop(): number|null {
        let res = this.stack.length > 0 ? (this.stack.pop() as number) : null
        if (res === this.minStack[this.minStack.length - 1]) {
            this.minStack.pop();
        }
        return res
    }
    getMin(): number|null {
        return this.minStack.length > 0 ? this.minStack[this.minStack.length - 1] : null
    }
}

// const minStack = new MinStack();
// minStack.push(2)
// console.log(minStack.getMin())
// minStack.push(8)
// console.log(minStack.getMin())
// minStack.push(1)
// console.log(minStack.getMin())
// minStack.pop()
// console.log(minStack.getMin())
// minStack.push(30) 
// console.log(minStack.getMin())
// minStack.push(0)
// console.log(minStack.getMin())
// minStack.pop()
// console.log(minStack.getMin())


class TwoQueueStack {
    queueA: any[];
    queueB: any[];
    curQueue: boolean;
    constructor() {
        this.queueA = [];
        this.queueB = [];
        this.curQueue = true;
    }
    push(data:any) {
        if (this.curQueue) {
            this.queueA.push(data);
        } else {
            this.queueB.push(data);
        }
    }
    pop(): any {
        let cur = this.curQueue ? this.queueA : this.queueB;
        let anotherQueue = !this.curQueue ? this.queueA : this.queueB;
        while (cur.length > 1) {
            anotherQueue.push(cur.shift())
        }
        this.curQueue = !this.curQueue;
        return cur.shift();
    }
}

// let twoQueueStack = new TwoQueueStack();

// twoQueueStack.push(1)
// twoQueueStack.push(2)
// twoQueueStack.push(3)
// twoQueueStack.push(4)
// console.log(twoQueueStack.pop())
// twoQueueStack.push(5)
// console.log(twoQueueStack.pop())

class TwoStackQueue {
    pushStack: any[];
    popStack: any[];
    constructor() {
        this.pushStack = [];
        this.popStack = [];
    }

    push(data: any) {
        this.pushStack.push(data);
        if (this.popStack.length === 0) {
            while (this.pushStack.length !== 0) {
                this.popStack.push(this.pushStack.pop());
            }
        }
    }

    pop() {
        if (this.popStack.length === 0) {
            while (this.pushStack.length !== 0) {
                this.popStack.push(this.pushStack.pop());
            }
        }
        return this.popStack.length === 0 ? null : this.popStack.pop();
    }
}

const twoStackQueue = new TwoStackQueue();

twoStackQueue.push(1)
twoStackQueue.push(2)
console.log("twoStackQueue", twoStackQueue.pop())
twoStackQueue.push(3)
twoStackQueue.push(4)
twoStackQueue.push(5)
console.log("twoStackQueue", twoStackQueue.pop())
