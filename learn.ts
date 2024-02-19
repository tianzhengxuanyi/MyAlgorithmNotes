class Singleton {
  name: string;
  static instance: Singleton;
  constructor(name: string) {
    this.name = name;
  }
  getName(): string {
    return this.name;
  }
  static getInstance(name: string) {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton(name);
    }

    return Singleton.instance;
  }
}

let instance_1 = Singleton.getInstance("instance_1");
let instance_2 = Singleton.getInstance("instance_2");

// console.log(instance_1.getName()) // instance_1
// console.log(instance_2.getName()) // instance_1
// console.log(instance_1 === instance_1) // true

namespace MinimumRemoval {
  var minimumRemoval = function (beans: number[]) {
    let ans = Infinity;
    beans.sort((a, b) => a - b);
    let info = new Array(beans.length);
    let sum = 0;
    for (let i = 0; i < beans.length; i++) {
      if (beans[i] == beans[i - 1]) {
        info[i] = info[i - 1];
      } else {
        info[i] = {
          lowSum: sum,
          lowNum: i,
        };
      }
      sum += beans[i];
    }
    for (let i = beans.length - 1; i >= 0; i--) {
      if (beans[i] == beans[i + 1]) {
        info[i] = info[i + 1];
      } else {
        info[i] = {
          ...info[i],
          highSum: sum - beans[i] * (i - info[i].lowNum + 1) - info[i].lowSum,
          highNum: beans.length - 1 - i,
        };
      }
    }

    for (let i = 0; i < beans.length; i++) {
      let num = info[i].lowSum + info[i].highSum - info[i].highNum * beans[i];

      ans = Math.min(ans, num);
    }
    return ans;
  };

  console.log(
    "🚀 ~ minimumRemoval ~ minimumRemoval([2,10,3,2]):",
    minimumRemoval([2, 10, 3, 2])
  ); // 7
  //   console.log(
  //     "🚀 ~ minimumRemoval ~ minimumRemoval([2,10,3,2]):",
  //     minimumRemoval([6, 8, 9, 12, 13, 1, 32, 4])
  //   );

  // 1 4 5 6

  //  < 4 1   > 4 11
  //  < 1 0   > 1 15
  //  < 6 10  > 6 0
  //  < 1 5   > 5 10
}
