

const arr =[1,2,3,4];
// const obj = {a:1,b:2};
const fun = function() {};
const set = new Set();
const map = new Map();
console.log(typeof arr); // object
// console.log(typeof obj); // object
console.log(typeof fun); // function
console.log(typeof set); // object
console.log(typeof map); // object
console.log(fun instanceof Object); // true

class Person {
    constructor(name) {
        this.name = name;
    }
}

const man = new Person("Bob")
console.log(man)


console.log(typeof 1); //number
console.log(typeof "a"); //string
console.log(typeof false); //boolean
console.log(typeof undefined); //undefined
console.log(typeof null); //object
console.log(typeof BigInt(1000)); //bigint
console.log(typeof Symbol("key")); //symbol

const obj = {a: "a"};

console.log(obj.valueOf()); // {a: "a"}
console.log(obj.hasOwnProperty("a")) // true
console.log(obj.hasOwnProperty("hasOwnProperty")) // false
console.log(obj.hasOwnProperty === Object.prototype.hasOwnProperty) // true
console.log(obj.hasOwnProperty("valueOf")) // false