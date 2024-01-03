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


function isRotation(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    a = a + a;
    return isSubstring(a, b);
}

// 判断是否为字串
function isSubstring(a, b) {
    if (a.length < b.length) {
        return false;
    }
    const str1Arr  = a.split("");
    const str2Arr  = b.split("");

    const next = getNextArr(b);

    let i1 = 0, i2 = 0;
    while (i1 < str1Arr.length && i2 < str2Arr.length) {
        if (str1Arr[i1] === str2Arr[i2]) {
            i1++;
            i2++
        } else if (i2 === 0) {
            i1++;
        } else {
            i2 = next[i2];
        }
    }
    return i2 === str2Arr.length;
}

// 前缀和后缀最长的相等长度
function getNextArr(str) {
    const arr = str.split("");
    const next = new Array(arr.length);
    next[0] = -1;
    next[1] = 0;

    let currIndex = 2;
    let prev = 0;

    while (currIndex < arr.length) {
        if (arr[currIndex] === arr[prev]) {
            next[currIndex++] = ++prev;
        } else if (prev !== 0) {
            prev = next[prev];
        } else {
            next[currIndex++] = 0;
        }
    }

    return next;
}

console.log("isRotation", isRotation("cdab", "abcd"))
console.log("isRotation", isRotation("1ab2", "ab12"))
console.log("isRotation", isRotation("2ab1", "ab12"))
console.log("isRotation", isRotation("12345", "51234"))