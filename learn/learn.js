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

/**
 * 
 * @param {number} n 正n边形
 * @param {number} a 中心点坐标x
 * @param {number} b 中心点坐标y
 * @param {number} r 外接圆的半径
 */
function getPosition(n, a = 0, b = 0, r = 50) {
    for (i = 0; i < n; i++) {
        console.log(a + r * Math.cos(2 * Math.PI * i / n), b+ r * Math.sin(2 * Math.PI * i / n));
      }
}

getPosition(4, 0, 0, 2 * Math.sqrt(2))