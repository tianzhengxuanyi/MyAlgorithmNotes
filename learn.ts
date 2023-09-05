class Singleton {
    name: string;
    static instance: Singleton;
    constructor(name: string) {
        this.name = name
    }
    getName(): string {
        return this.name;
    }
    static getInstance(name: string)  {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton(name);
        }

        return Singleton.instance;
    }
}

let instance_1 = Singleton.getInstance("instance_1");
let instance_2 = Singleton.getInstance("instance_2");

console.log(instance_1.getName()) // instance_1
console.log(instance_2.getName()) // instance_1
console.log(instance_1 === instance_1) // true
