"use strict";
class Pet {
    constructor(type) {
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
    constructor() {
        this.dogQueue = [];
        this.catQueue = [];
        this.queue = [];
    }
    add(instance) {
        this.queue.push(instance);
        if (instance instanceof Dog) {
            this.dogQueue.push(instance);
        }
        else {
            this.catQueue.push(instance);
        }
    }
    pollAll() {
        while (this.queue.length !== 0) {
            console.log(this.queue.shift());
        }
    }
    pollDog() {
    }
    isEmpty() {
        return !this.queue.length;
    }
    isDogEmpty() {
        return !this.dogQueue.length;
    }
    isCatEmpty() {
        return !this.catQueue.length;
    }
}
class MinStack {
    constructor() {
        this.stack = [];
        this.minStack = [];
    }
    push(num) {
        this.stack.push(num);
        if (this.minStack.length === 0 || this.minStack[this.minStack.length - 1] > num) {
            this.minStack.push(num);
        }
    }
    pop() {
        let res = this.stack.length > 0 ? this.stack.pop() : null;
        if (res === this.minStack[this.minStack.length - 1]) {
            this.minStack.pop();
        }
        return res;
    }
    getMin() {
        return this.minStack.length > 0 ? this.minStack[this.minStack.length - 1] : null;
    }
}
const minStack = new MinStack();
minStack.push(2);
console.log(minStack.getMin());
minStack.push(8);
console.log(minStack.getMin());
minStack.push(1);
console.log(minStack.getMin());
minStack.pop();
console.log(minStack.getMin());
minStack.push(30);
console.log(minStack.getMin());
minStack.push(0);
console.log(minStack.getMin());
minStack.pop();
console.log(minStack.getMin());
console.log(111);
