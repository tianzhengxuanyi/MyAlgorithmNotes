const arr =[1,2,3,4];
const obj = {a:1,b:2};
const fun = function() {};
const set = new Set();
const map = new Map();
const big = BigInt(100000000000)
console.log(typeof arr);
console.log(typeof obj);
console.log(typeof fun);
console.log(typeof set);
console.log(typeof map);
console.log(typeof null);
console.log(typeof big);
console.log(fun instanceof Object);

class Person {
    constructor(name) {
        this.name = name;
    }
}

const man = new Person("Bob")
console.log(man)


console.log(obj.valueOf()); // {a: "a"}
console.log(obj.hasOwnProperty("a")) // true
console.log(obj.hasOwnProperty("hasOwnProperty")) // false
console.log(obj.hasOwnProperty === Object.prototype.hasOwnProperty) // true
console.log(obj.hasOwnProperty("valueOf")) // false