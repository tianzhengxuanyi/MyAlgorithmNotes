---
lang: zh-CN
title: ts
description: ts面试题
---

# ts

## 1、优缺点，使用场景
::: details 详情
优点
- 静态类型，减少类型错误。
- 有错误会在编译时提醒，而非运行时报错 —— 解释“编译时”和“运行时”。
- 智能提示，提高开发效率。

缺点
- 学习成本高。
- 某些场景下，类型定义会过于混乱，可读性不好，如下代码。
- 使用不当会变成 anyScript。

使用场景
- 大型项目，需要严格控制类型。
- 逻辑性高的代码，比如前端的组件库。
- 长期维护的项目。
:::

## 2、ts 类型有哪些
::: details 详情
1️⃣ 原始类型
- `number`
  > 表示数字类型，包括整数和浮点数。
```ts
let age: number = 25;
let pi: number = 3.14;
```
- `string`
  > 表示字符串类型。
```ts
let name: string = "胖虎";
```
- `boolean`
  > 表示布尔类型，true 或 false。
```ts
let isActive: boolean = true;
```
- `null` 和 `undefined`
  > 表示空值或未定义的值。
```ts
let empty: null = null;
let notAssigned: undefined = undefined;
```
- `symbol`
  > 表示唯一的值，通常用于对象的唯一属性键。
```ts
let uniqueKey: symbol = Symbol("key");
```
- `bigint`
  > 表示大整数类型。
```ts
let bigNumber: bigint = 12345678901234567890n;
```
2️⃣ 引用类型
- `object`
  > 表示非原始类型的对象。
```ts
let person: object = { name: "胖虎", age: 18 };
```
- 数组（`Array`）
  > 表示一组相同类型的值。
```ts
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ["a", "b", "c"];
```
- 元组（`Tuple`）
  > 表示固定长度的数组，每个元素可以是不同的类型。
```ts
let tuple: [string, number] = ["胖虎", 18];
```
3️⃣ 特殊类型
- `any`
  > 表示任意类型，关闭类型检查。
```ts
let value: any = 42;
value = "Hello"; // 允许重新赋值为不同类型
```
- `unknown`
  > 表示未知类型，类似于 `any`，但更安全。
```ts
let value: unknown = "Hello";
if (typeof value === "string") {
  console.log(value.toUpperCase());
}
```
- `void`
  > 表示没有返回值的函数。
```ts
function logMessage(message: string): void {
  console.log(message);
}
```
- `never`
  > 表示永远不会有返回值的类型（如抛出错误或死循环）。
```ts
function throwError(message: string): never {
  throw new Error(message);
}
```
4️⃣ 联合类型和交叉类型
- 联合类型（`Union`）
  > 表示一个变量可以是多种类型之一。
```ts
let value: string | number = "Hello";
value = 42;
```
- 交叉类型（`Intersection`）
  > 表示一个变量同时具有多种类型的特性。
```ts
type A = { name: string };
type B = { age: number };
let person: A & B = { name: "胖虎", age: 18 };
```
5️⃣ 类型别名（`type`）和接口（`interface`）
- 类型别名（`type`）
  > 用于定义自定义类型。
```ts
type Point = { x: number; y: number };
let point: Point = { x: 10, y: 20 };
```
- 接口（`interface`）
  > 用于定义对象的结构。
```ts
interface User {
  id: number;
  name: string;
}
let user: User = { id: 1, name: "胖虎" };
```
6️⃣ 枚举类型（`enum`）
  > 用于定义一组常量。
```ts
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
let dir: Direction = Direction.Up;
```
:::

## 3、keyof 和 typeof 有什么区别
- `typeof` 是 js 运算符，用于获取变量的类型。
- `keyof` 是 ts 运算符，用于获取对象类型的键的联合类型。
::: details 详情
`typeof` 在 js 中
```js
const name = "John";
console.log(typeof name); // 输出: "string"
```
`typeof` 在 ts 中
```ts
const person = {
  name: "胖虎",
  age: 18,
};

type PersonType = typeof person;
// 等价于:
// type PersonType = { name: string; age: number; }
```
`keyof`
```ts
interface Person {
  name: string;
  age: number;
}

type Keys = keyof Person;
// 等价于: type Keys = "name" | "age";
```
`keyof` 和 `typeof` 的结合使用
```ts
const person = {
  name: "胖虎",
  age: 18,
};

type PersonKeys = keyof typeof person;
// 等价于: type PersonKeys = "name" | "age";
```
总结
|特性|`typeof`|`keyof`|
|----|------|------|
|作用|获取变量或对象的静态类型|获取对象类型的键的联合类型|
|使用场景|用于推断变量的类型|用于动态访问对象的键|
|适用范围|变量、对象|对象类型|
|示例|type T = typeof obj;|type K = keyof T;|
:::

## 4、ts 中有哪些内置工具类型
::: details 详情
- `Partial<T>`
  > 将对象的所有属性设置为可选。
```ts
interface User {
  name: string;
  age: number;
}

type PartialUser = Partial<User>;
// 等同于
// type PartialUser = {
//   name?: string;
//   age?: number;
// }
```
- `Required<T>`
  > 将对象的所有属性设置为必填。
```ts
type RequiredUser = Required<User>;
// 等同于
// type RequiredUser = {
//   name: string;
//   age: number;
// }
```
- `Readonly<T>`
  > 将对象的所有属性设置为只读。
```ts
type ReadonlyUser = Readonly<User>;
// 等同于
// type ReadonlyUser = {
//   readonly name: string;
//   readonly age: number;
// }
```
- `Record<K, T>`
  > 创建一个对象类型，其中键为 `K`，值为 `T`。
```ts
type PageRoles = "admin" | "user" | "guest";
type Roles = Record<PageRoles, string>;

const roles: Roles = {
  admin: "Administrator",
  user: "Regular User",
  guest: "Guest User"
};
```
- `Pick<T, K>`
  > 从类型 `T` 中选择部分属性 `K` 构造新类型。
```ts
type UserName = Pick<User, "name">;
// 等同于
// type UserName = {
//   name: string;
// }
```
- `Omit<T, K>`
  > 从类型 `T` 中排除部分属性 `K` 构造新类型。
```ts
type UserWithoutAge = Omit<User, "age">;
// 等同于
// type UserWithoutAge = {
//   name: string;
// }
```
- `Exclude<T, U>`
  > 从类型 `T` 中排除类型 `U` 构造新类型。
```ts
type A = "a" | "b" | "c";
type NotA = Exclude<A, "a">; // "b" | "c"
```
- `Extract<T, U>`
  > 从类型 `T` 中提取类型 `U` 构造新类型。
```ts
type A = "a" | "b" | "c";
type OnlyA = Extract<A, "a">; // "a"
```
- `NonNullable<T>`
  > 从类型 `T` 中排除 `null` 和 `undefined` 构造新类型。
```ts
type MaybeNull = string | null | undefined;
type NonNull = NonNullable<MaybeNull>; // string
```
- `ReturnType<T>`
  > 获取函数类型的返回类型。
```ts
function getUser() {
  return { name: "张三", age: 30 };
}

type UserReturnType = ReturnType<typeof getUser>;
// 等同于
// type UserReturnType = {
//   name: string;
//   age: number;
// }
```
- `InstanceType<T>`
  > 获取构造函数类型的实例类型。
```ts
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

type PersonInstance = InstanceType<typeof Person>; // Person
```
- `ThisParameterType<T>`
  > 获取函数类型 `T` 的 `this` 参数类型。
```ts
function greet(this: { name: string }) {
  return `Hello, ${this.name}`;
}

type ThisType = ThisParameterType<typeof greet>; // { name: string }
```
- `ThisReturnType<T>` (TypeScript 4.3+)
  > 获取函数类型 `T` 在考虑 `this` 参数后的返回类型。
```ts
function getThisName(this: { name: string }): string {
  return this.name;
}

type ThisReturn = ThisReturnType<typeof getThisName>; // string
```
- `Parameters<T>`
  > 获取函数类型 `T` 的参数类型元组。
```ts
function add(a: number, b: number): number {
  return a + b;
}

type AddParams = Parameters<typeof add>; // [number, number]
```
- `ConstructorParameters<T>`
  > 获取构造函数类型 `T` 的参数类型元组。
```ts
class Person {
  constructor(public name: string, public age: number) {}
}

type PersonCtorParams = ConstructorParameters<typeof Person>; // [string, number]
```
:::

## 5、ts 中访问修饰符 public protected private # 有什么作用
::: details 详情
- `public` 公开的，谁都能用 （默认）。
  > 适用于需要对外公开的属性和方法，如类的公共接口。
- `protected` 成员仅在类的内部和其子类中可访问，不能通过类的实例直接访问。
  > 适用于需要在子类中继承和使用的属性和方法，但不希望外部直接访问。
- `private` 成员仅在类的内部可访问，不能在子类或类的实例中访问。
  > 适用于类的内部实现细节，不希望被继承或外部访问（注意：仅编译时保护）。
- `#` 真正意义上的私有成员，不仅在编译时，而且在运行时也限制访问。只能在类的内部访问，不能被子类或类的实例访问（私有字段，ES2022 引入）。
  > 适用于需要真正私有的成员，确保在运行时也无法被外部或子类访问。
```ts
class Animal {
  public name: string;
  protected species: string;
  private age: number;
  #sound: string;

  constructor(name: string, species: string, age: number, sound: string) {
    this.name = name;
    this.species = species;
    this.age = age;
    this.#sound = sound;
  }

  public speak(): void {
    console.log(`${this.name} makes a ${this.#sound} sound.`);
    this.makeSound();
  }

  protected makeSound(): void {
    console.log(`Internal sound logic for ${this.species}.`);
  }

  private getAge(): number {
    return this.age;
  }
}

class Dog extends Animal {
  constructor(name: string, age: number) {
    super(name, "Dog", age, "bark");
  }

  public describe(): void {
    console.log(`This is ${this.name}, a ${this.species}.`);
    // console.log(this.age); // 错误：'age' 是 private 成员
    // console.log(this.#sound); // 错误：'#sound' 是私有字段
    this.makeSound(); // 可以访问 protected 方法
  }
}

const dog = new Dog("Buddy", 5);
console.log(dog.name); // 可以访问 public 属性
// console.log(dog.species); // 错误：'species' 是 protected 成员
// console.log(dog.age); // 错误：'age' 是 private 成员
// console.log(dog.#sound); // 错误：'#sound' 是私有字段
dog.speak(); // 正常执行
dog.describe(); // 正常执行
```
:::

## 6、type 和 interface 共同和区别，如何选择
type 和 interface 有很多相同之处，很多人因此而产生“选择困难症”，这也是 TS 热议的话题。

共同点
::: details 详情
- 定义对象形状。
  > 两者都可以用来描述对象的属性及其类型。
```ts
// 使用 interface
interface Person {
  name: string;
  age: number;
}

// 使用 type
type PersonType = {
  name: string;
  age: number;
};
```
- 扩展（继承）​
  > 两者都可以用来扩展已有的类型。
```ts
// Interface 扩展
interface Animal {
  species: string;
}

interface Dog extends Animal {
  breed: string;
}

// Type 交叉
type AnimalType = {
  species: string;
};

type DogType = AnimalType & {
  breed: string;
};
```
- 都可以用于类的类型约束
```ts
interface Animal {
  name: string;
}

type AnimalType = {
  name: string;
};

class Dog implements Animal {
  name = "Buddy";
}

class Cat implements AnimalType {
  name = "Kitty";
}
```
:::

区别
::: details 详情
- ​声明方式
  - `interface` 使用 `interface` 关键字声明。
  - `type` 使用 `type` 关键字声明，并可以赋值为对象类型、联合类型、交叉类型等。
```ts
interface PersonInterface {
  name: string;
}

type PersonType = {
  name: string;
};
```
- 扩展与合并
  - `interface` 可以被多次声明并自动合并。
  ```ts
  interface Person {
  name: string;
  }

  interface Person {
    age: number;
  }

  // 合并后的 Person 接口
  // interface Person {
  //   name: string;
  //   age: number;
  // }
  ```
  - `type` 只能被声明一次，声明后无法被再次声明。
  ```ts
  type PersonType = {
    name: string;
  };

  // 下面的代码会导致错误
  // type PersonType = {
  //   age: number;
  // };
  ```
- 支持的功能
  - `type` 更加灵活，可以表示更多类型，如联合类型、交叉类型、元组、字面量类型等。
  ```ts
  // 联合类型
  type ID = string | number;

  // 字面量类型
  type Status = "success" | "error";

  // 元组
  type Point = [number, number];
  ```
  - `interface` 主要用于定义对象的形状，虽然也可以通过交叉类型实现一些复杂类型，但不如 type 直观和灵活。
:::

如何选择
::: details 详情
- 定义对象类型时优先考虑 `interface`。
- 需要声明模块级别的类型或全局类型时使用 `interface`。
  > `interface` 更适合用于声明可扩展的全局类型或模块级别的类型，因为它的声明合并特性在全局范围内非常有用。
- 需要表示联合类型、交叉类型或其他复杂类型时使用 `type`。
- 需要定义函数类型时使用 `type`。
  > 虽然 `interface` 和 `type` 都可以用来定义函数类型，但 `type` 更加简洁和常用。
  ```ts
  // 使用 type 定义函数类型
  type Callback = (data: string) => void;

  // 使用 interface 定义函数类型（不常见）
  interface Callback {
    (data: string): void;
  }
  ```
总结

根据社区的使用习惯，优先使用 `interface` ，定义复杂类型则使用 `type`。
:::

## 7、什么是泛型，泛型有什么用
泛型是 ts 的核心特性之一，提供了代码复用、类型安全和灵活性。通过泛型函数、类、接口和约束，可以编写更通用、更健壮的代码。在实际开发中，合理使用泛型可以显著提升代码的可维护性和可扩展性。
::: details 详情
泛型的优点
- 代码复用
  > 泛型允许编写适用于多种类型的代码，减少重复。
- 类型安全
  > 泛型在编译时进行类型检查，避免运行时的类型错误。
- 灵活
  > 泛型支持动态传递类型参数，适用于复杂的类型场景。

泛型的使用场景
- 泛型函数
```ts
function identity<T>(arg: T): T {
    return arg;
}

let output1 = identity<string>("Hello"); // output1 的类型是 string
let output2 = identity<number>(42);      // output2 的类型是 number
```
- 泛型类
```ts
class Box<T> {
    private value: T;

    constructor(value: T) {
        this.value = value;
    }

    getValue(): T {
        return this.value;
    }
}

let box1 = new Box<number>(123); // box1 的类型是 Box<number>
let box2 = new Box<string>("Hello"); // box2 的类型是 Box<string>
```
- 泛型接口
```ts
interface KeyValuePair<K, V> {
    key: K;
    value: V;
}

let pair1: KeyValuePair<number, string> = { key: 1, value: "One" };
let pair2: KeyValuePair<string, boolean> = { key: "isTrue", value: true };
```
- 泛型的约束
```ts
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length); // 现在我们知道 arg 具有 length 属性
    return arg;
}

loggingIdentity("Hello"); // 合法，因为字符串有 length 属性
loggingIdentity(42);      // 错误，数字没有 length 属性
```
- 泛型的默认类型
```ts
function createArray<T = string>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

const arr1 = createArray(3, "hello"); // 推断为 string[]
const arr2 = createArray<number>(3, 42); // 显式指定为 number[]
```
- 泛型的多类型参数
```ts
function map<K, V>(keys: K[], callback: (key: K) => V): V[] {
  return keys.map(callback);
}

const result = map([1, 2, 3], (key) => key * 2); // 推断为 number[]
```
:::

## 8、什么是交叉类型和联合类型
- 交叉类型 T1 & T2
  > 交叉类型是将多个类型合并为一个类型，包含了所需的所有类型的特性。例如 T1 & T2 & T3。
::: details 详情
示例
```ts
interface U1 {
  name: string
  city: string
}
interface U2 {
  name: string
  age: number
}
type UserType1 = U1 & U2
const userA: UserType1 = { name: 'x', age: 20, city: 'beijing' }

// 可在 userA 获取所有属性，相当于“并集”
userA.name
userA.age
userA.city
```
注意事项
  - 两个类型的相同属性，如果类型不同（冲突了），则该属性是 never 类型。
  ```ts
  // 如上代码
  // U1 name:string ，U2 name: number
  // 则 UserType1 name 是 never
  ```
  - 基础类型没办法交叉，会返回 never。
  ```ts
  type T = string & number // never
  ```
:::
- 联合类型 T1 | T2
  > 联合类型是将多个类型合并为一个类型，只要满足其中一个类型即可。例如 T1 | T2 | T3。
::: details 详情
示例
```ts
interface U1 {
  name: string
  city: string
}
interface U2 {
  name: string
  age: number
}

function fn(): U1 | U2 {
  return {
    name: 'x',
    age: 20,
  }
}
```
注意事项
- 基础类型可以联合。
```ts
type T = string | number
const a: T = 'x'
const b: T = 100
```
- 如果未赋值的情况下，联合类型无法使用 string 或 number 的方法。
```ts
function fn(x: string | number) {
  console.log(x.length) // 报错
}
```
:::

## 9、ts 这些符号 `?` `?.` `??` `!` `_` `&` `|` `#` 分别什么意思
::: details 详情
- `?`
  > 表示可选属性，表示属性可以不存在。
```ts
interface User {
  name: string
  age?: number
}
const u: User = { name: 'xx' } // age 可写 可不写

function fn(a: number, b?: number) {
  console.log(a, b)
}
fn(10) // 第二个参数可不传
```
- `?.`
  > 表示可选链，表示属性可能不存在，可以链式调用。
```ts
const user: any = {
  info: {
    city: '北京',
  },
}
// const c = user && user.info && user.info.city
const c = user?.info?.city
console.log(c)
```
- `??`
  > 表示空值合并运算符，表示如果左侧的值为 null 或 undefined，则返回右侧的值，否则返回左侧的值。
```ts
const user: any = {
  // name: '张三'
  index: 0,
}
// const n1 = user.name ?? '暂无姓名'
const n2 = user.name || '暂无姓名' // 某些情况可用 || 代替
console.log('name', n2)

const i1 = user.index ?? '暂无 index'
const i2 = user.index || '暂无 index' // 当是 0 （或 false 空字符串等）时，就不能直接用 || 代替
console.log('index', i1)
```
- `!`
  > 表示非空断言，表示变量一定存在，检查忽略 undefined null，自己把控风险。
```ts
function fn(a?: string) {
  return a!.length // 加 ! 表示忽略 undefined 情况
}
```
- `_`
  > 表示数字分隔符，分割数字，增加可读性。
```ts
const million = 1_000_000
const phone = 173_1777_7777

// 编译出 js 就是普通数字
```
- `&`
  > 表示交叉类型，表示多个类型合并为一个类型，包含了所需的所有类型的特性。
```ts
interface U1 {
  name: string
  city: string
}
interface U2 {
  name: string
  age: number
}
type UserType1 = U1 & U2
```
- `|`
  > 表示联合类型，表示多个类型合并为一个类型，只要满足其中一个类型即可。
```ts
interface U1 {
  name: string
  city: string
}
interface U2 {
   name: string
   age: number
}
type UserType1 = U1 | U2
```
- `#`
  > 表示私有属性，表示属性只能在类内部使用，不能在类外使用。
```ts
class User {
  #name: string
  constructor(name: string) {
    this.#name = name
  }
}
const u = new User('x')
console.log(u.#name) // 报错
```
:::

## 10、什么是抽象类 abstract class
抽象类是 ts 中的一种特殊类，不能直接被实例化，必须通过继承派生子类才能使用。抽象类可以包含具体实现的方法，也可以定义抽象方法，要求子类必须实现这些方法。
::: details 详情
抽象类的特点
- 抽象类不能被实例化，只能被继承。
- 抽象类中的抽象方法必须被实现，否则报错。
- 子类可以直接继承抽象类中已实现的方法。
- 抽象类可以定义属性和构造函数，子类可以继承这些属性。

示例
```ts
abstract class Animal {
  abstract makeSound(): void
  move(): void {
    console.log('roaming the earch...')
  }
}

// const a = new Animal() // 直接实例化，报错

class Dog extends Animal {
  // 必须要实现 Animal 中的抽象方法，否则报错
  makeSound() {
    console.log('wang wang')
  }
}

const d = new Dog()
d.makeSound()
d.move()
```
:::

## 11、如何扩展 window 属性，如何定义第三方模块的类型
::: details 详情
- 扩展 `window` 属性
```ts
// 如果不使用 declare global，扩展的属性可能只在当前模块中有效。
declare interface Window {
    appConfig: {
      apiUrl: string;
      version: string;
    };
}

// 使用 declare global 确保扩展的属性在全局作用域中生效。
declare global {
  interface Window {
    appConfig: {
      apiUrl: string;
      version: string;
    };
  }
}

window.appConfig = {
  apiUrl: "https://api.example.com",
  version: "1.0.0",
};

console.log(window.appConfig.apiUrl); // 输出: https://api.example.com
```
- 定义第三方模块的类型  
  > 当使用的第三方库没有提供类型定义文件时，可以通过 declare module 手动定义类型。
```ts
declare module "custom-library" {
  export function doSomething(param: string): void;
}

import { doSomething } from "custom-library";
doSomething("Hello");
```
:::

## 12、谈谈你对 ts 中装饰器的理解
装饰器是一种特殊类型的声明，可以附加到类声明、方法、访问器、属性或参数上。装饰器使用 `@expression` 的形式，其中 expression 必须是一个函数，该函数在运行时被调用，并携带有关被装饰的声明的信息。
::: details 详情
- 使用装饰器
  > 需要在 tsconfig.json 中启用 experimentalDecorators 选项。
  ```json
  {
    "compilerOptions": {
      "target": "ES5",
      "experimentalDecorators": true,
      "emitDecoratorMetadata": true
    }
  }
  ```
  注意：emitDecoratorMetadata 选项用于支持装饰器的元数据功能，通常与 reflect-metadata 库一起使用。
- 装饰器的类型
  - 类装饰器
    > 应用于类声明，可以用来观察、修改或替换类定义。类装饰器的表达式将在运行时作为函数被调用，类的构造函数作为其唯一的参数。
  ```ts
  // 例如声明一个函数 addAge 去给 Class 的属性 age 添加年龄
  function addAge(constructor: Function) {
    constructor.prototype.age = 18;
  }

  @addAge
  class Person{
    name: string;
    age!: number;
    constructor() {
      this.name = '胖虎';
    }
  }

  let person = new Person();

  console.log(person.age); // 18
  // 上述代码，实际等同于以下形式：
  // Person = addAge(function Person() { ... });
  ```
  - 方法装饰器
    > 应用于类的方法，可以用来观察、修改或替换方法定义。方法装饰器的表达式将在运行时作为函数被调用，接收三个参数：
    > 1. 对于静态成员来说是类的构造函数，对于实例成员来说是类的原型对象。
    > 2. 成员的名字。
    > 3. 成员的属性描述符。
  ```ts
  // 定义一个方法装饰器，用于在方法调用前后输出日志
  function logMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value; // 保存原方法

    descriptor.value = function (...args: any[]) {
      console.log(`方法 ${propertyKey} 被调用，参数: ${JSON.stringify(args)}`);
      const result = originalMethod.apply(this, args); // 调用原方法
      console.log(`方法 ${propertyKey} 返回结果: ${result}`);
      return result;
    };

    return descriptor;
  }

  class Calculator {
    @logMethod
    add(a: number, b: number): number {
      return a + b;
    }
  }

  const calculator = new Calculator();
  console.log(calculator.add(5, 3));
  // 控制台输出:
  // 方法 add 被调用，参数: [5,3]
  // 方法 add 返回结果: 8
  // 8
  ```
  - 属性装饰器
    > 应用于类的属性，可以用来观察或修改属性的定义。属性装饰器的表达式将在运行时作为函数被调用，接收两个参数：
    > 1. 对于静态成员来说是类的构造函数，对于实例成员来说是类的原型对象。
    > 1. 成员的名字。

    > **注意**：​ 属性装饰器无法直接修改属性的值，但可以通过修改类的构造函数或原型对象来间接实现。
  ```ts
  // 定义一个属性装饰器，用于在控制台输出属性的名称和初始值
  function logProperty(target: any, propertyKey: string) {
    let value: any;

    // 定义属性的 getter
    const getter = function () {
      console.log(`获取属性 ${propertyKey} 的值: ${value}`);
      return value;
    };

    // 定义属性的 setter
    const setter = function (newVal: any) {
      console.log(`设置属性 ${propertyKey} 的值为: ${newVal}`);
      value = newVal;
    };

    // 删除原有的属性
    if (delete target[propertyKey]) {
      // 重新定义属性，使用 getter 和 setter
      Object.defineProperty(target, propertyKey, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true,
      });
    }
  }

  class User {
    @logProperty
    public username: string;

    constructor(username: string) {
      this.username = username;
    }
  }

  const user = new User("李四");
  console.log(user.username);
  user.username = "王五";
  // 控制台输出:
  // 设置属性 username 的值为: 李四
  // 获取属性 username 的值: 李四
  // 李四
  // 设置属性 username 的值为: 王五
  // 获取属性 username 的值: 王五
  // 王五
  ```
  - 访问器装饰器
    > 应用于类的访问器（getter 和 setter），类似于方法装饰器，但专门用于访问器。访问器装饰器的表达式将在运行时作为函数被调用，接收三个参数：
    > 1. 对于静态成员来说是类的构造函数，对于实例成员来说是类的原型对象。
    > 2. 成员的名字。
    > 3. 成员的属性描述符。
  ```ts
  // 定义一个访问器装饰器，用于在访问器和修改器调用时输出日志
  function logAccessor(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalGetter = descriptor.get;
    const originalSetter = descriptor.set;

    descriptor.get = function () {
      console.log(`调用 getter 获取 ${propertyKey}`);
      return originalGetter?.apply(this);
    };

    descriptor.set = function (value: any) {
      console.log(`调用 setter 设置 ${propertyKey} 为 ${value}`);
      originalSetter?.apply(this, [value]);
    };

    return descriptor;
  }

  class Product {
    private _price: number;

    constructor(price: number) {
      this._price = price;
    }

    @logAccessor
    get price(): number {
      return this._price;
    }

    set price(value: number) {
      if (value >= 0) {
        this._price = value;
      } else {
        throw new Error("价格不能为负数");
      }
    }
  }

  const product = new Product(100);
  console.log(product.price);
  product.price = 200;
  console.log(product.price);
  // 控制台输出:
  // 调用 getter 获取 price
  // 100
  // 调用 setter 设置 price 为 200
  // 调用 getter 获取 price
  // 200
  ```
  - 参数装饰器
    > 应用于类构造函数或方法的参数，可以用来观察或修改参数的元数据。参数装饰器的表达式将在运行时作为函数被调用，接收三个参数：
    > 1. 对于静态成员来说是类的构造函数，对于实例成员来说是类的原型对象。
    > 2. 成员的名字。
    > 3. 参数在参数列表中的索引。

    > **注意**：​ 参数装饰器无法直接修改参数，通常用于与反射元数据结合使用，以获取参数的元信息。
  ```ts
  // 定义一个参数装饰器，用于在控制台输出参数的索引和名称
  function logParameter(target: any, propertyKey: string, parameterIndex: number) {
    console.log(`方法 ${propertyKey} 的第 ${parameterIndex} 个参数被装饰。`);
  }

  class Calculator {
    add(@logParameter a: number, @logParameter b: number): number {
      return a + b;
    }
  }

  // 创建类的实例
  const calculator = new Calculator();
  calculator.add(5, 3);
  // 控制台输出:
  // 方法 add 的第 0 个参数被装饰。
  // 方法 add 的第 1 个参数被装饰。
  ```
:::

## 13、请简述 ts 中的 infer
在 ts 中，`infer` 是一个关键字，常用于条件类型中，用来推断类型变量的具体类型。它的作用是从某些类型中提取或推断出具体的类型信息。
::: details 详情
- `infer` 语法
```ts
T extends U ? infer R : never
```
- `infer` 使用场景
  - 提取函数的返回类型
  ```ts
  type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

  // 示例
  type Fn = () => string;
  type ReturnTypeOfFn = GetReturnType<Fn>; // 推断为 string
  ```
  - 提取数组元素的类型
  ```ts
  type ElementType<T> = T extends (infer U)[] ? U : never;

  // 示例
  type ArrayType = number[];
  type ItemType = ElementType<ArrayType>; // 推断为 number
  ```
  - 提取 Promise 的返回类型
  ```ts
  type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

  // 示例
  type P = Promise<string>;
  type ResolvedType = UnwrapPromise<P>; // 推断为 string
  ```
  - 提取构造函数的实例类型
  ```ts
  type InstanceType<T> = T extends new (...args: any[]) => infer R ? R : never;

  // 示例
  class Person {
    name: string = "John";
  }

  type PersonInstance = InstanceType<typeof Person>; // 推断为 Person
  ```
- `infer` 注意事项
  - 只能在条件类型中使用，不能在普通类型中使用。
    ```ts
    // 错误用法
    // type Invalid = infer T;
    ```
  - 推断失败时返回 never。
    ```ts
    type Test<T> = T extends string ? infer U : never;
    type Result = Test<number>; // 推断为 never
    ```
:::

## 14、ts 中什么是协变与逆变
协变（Covariance）和逆变（Contravariance）是类型系统中的一个概念，用于描述在继承关系中，子类型是否可以替换父类型。
::: details 详情
- 协变
  > 协变表示子类型关系在某种上下文中保持一致的方向。具体来说，如果类型 A 是类型 B 的子类型，那么在协变的情况下，A 的对应类型也是 B 对应类型的子类型。

示例：数组的协变

在 ts 中，数组是协变的。这意味着如果 `Dog` 是 `Animal` 的子类型，那么 `Dog[]` 也是 `Animal[]` 的子类型。
```ts
class Animal {}
class Dog extends Animal {}

const dogs: Dog[] = [new Dog()];
const animals: Animal[] = dogs; // 协变，Dog[] 可以赋值给 Animal[]
```
注意：虽然数组是协变的，但在某些情况下可能会导致运行时错误，因为你可以向 animals 数组添加一个 Cat 实例，而这会破坏 dogs 数组的类型安全。

- 逆变
  > 逆变表示子类型关系在某种上下文中反转方向。具体来说，如果类型 A 是类型 B 的子类型，那么在逆变的情况下，B 的对应类型是 A 对应类型的子类型。

示例：函数参数的逆变

在 ts 中，函数的参数类型是逆变的。这意味着如果 `Dog` 是 `Animal` 的子类型，那么 `(animal: Animal) => void` 可以赋值给 `(dog: Dog) => void`。
```ts
type Handler<T> = (animal: T) => void;

const animalHandler: Handler<Animal> = (animal) => {
  console.log(animal);
};

const dogHandler: Handler<Dog> = animalHandler; // 逆变，Handler<Animal> 可以赋值给 Handler<Dog>
```
:::

## 15、如何实现 ts 中的 Partial
描述：`Partial` 是一个类型工具，用于将一个类型的所有属性变为可选的。
::: details 详情
```ts
// 1. keyof T：获取类型 T 的所有键（属性名称）的联合类型。
// 2. P in keyof T：遍历 T 的每一个属性名 P。
// 3. ?：在映射类型中，通过在属性名后添加 ?，将每个属性变为可选的。
// 4. T[P]：对于每一个属性 P，其类型仍然是 T[P]，即原类型 T 中对应属性的类型。
type Partial<T> = {
  [P in keyof T]?: T[P];
}
```
:::

## 16、如何实现 ts 中的 Required
描述：`Required` 是一个类型工具，用于将一个类型的所有属性变为必填的。
::: details 详情
```ts
// 1. keyof T：获取类型 T 的所有键（属性名称）的联合类型。
// 2. P in keyof T：遍历类型 T 的每一个属性名 P。
// 3. -?：在映射类型中，通过 -? 移除可选属性标记，将属性变为必选。
// 4. T[P]：对于每一个属性 P，其类型仍然是 T[P]，即原类型 T 中对应属性的类型。
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```
:::

## 17、如何实现 ts 中的 Readonly
描述：`Readonly` 是一个类型工具，用于将一个类型的所有属性变为只读的。
::: details 详情
```ts
// 1. keyof T：获取类型 T 的所有键（属性名称）的联合类型。
// 2. P in keyof T：遍历 T 的每一个属性名 P。
// 3. readonly：在映射类型中，通过在属性名前添加 readonly，将每个属性变为只读。
// 4. T[P]：对于每一个属性 P，其类型仍然是 T[P]，即原类型 T 中对应属性的类型。
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```
:::

## 18、如何实现 ts 中的 Record
描述：`Record` 是一个类型工具，用于创建一个对象类型，该对象类型具有一组键（属性名称）和值（属性类型）的组合。
::: details 详情
```ts
// 1. K extends keyof any：确保 K 是一个可以作为对象键的类型（如 string、number 或 symbol）。
// 2. P in K：遍历 K 中的每一个键。
// 3. T：将每个键的值类型设置为 T。
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```
:::

## 19、如何实现 ts 中的 Pick
描述：`Pick` 是一个类型工具，用于从类型 T 中选择一组键（属性名称）并创建一个新的类型。
::: details 详情
```ts
// 1. T：表示原始类型。
// 2. K extends keyof T：确保 K 是 T 的键的子集。
// 3. P in K：遍历 K 中的每一个属性名。
// 4. T[P]：对于每一个属性 P，其类型仍然是 T[P]，即原类型 T 中对应属性的类型。
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```
:::

## 20、如何实现 ts 中的 Omit
描述：`Omit` 是一个类型工具，用于从类型 T 中排除一组键（属性名称）并创建一个新的类型。
::: details 详情
```ts
// 1. T：表示原始类型。
// 2. K extends keyof T：确保 K 是 T 的键的子集。
// 3. Exclude<keyof T, K>：从 T 的键中排除 K，得到剩余的键。
// 4. P in Exclude<keyof T, K>：遍历排除后的键集合。
// 5. T[P]：对于每一个属性 P，其类型仍然是 T[P]，即原类型 T 中对应属性的类型。
type Omit<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P];
};
```
:::

## 21、如何实现 ts 中的 Exclude
描述：`Exclude` 是一个类型工具，用于从类型 T 中排除一组类型（类型别名）并创建一个新的类型。
::: details 详情
```ts
// 1. T：表示原始类型。
// 2. U：表示需要排除的类型。
// 3. T extends U ? never : T：遍历 T 中的每个类型，如果该类型可以分配给 U，则排除（返回 never）；否则保留（返回 T）。
type Exclude<T, U> = T extends U ? never : T;
```
:::

## 22、如何实现 ts 中的 Extract
描述：`Extract` 是一个类型工具，用于从类型 `T` 中提取出可以分配给类型 `U` 的部分，并创建一个新的类型。
::: details 详情
```ts
// 1. T：表示原始类型。
// 2. U：表示需要提取的类型。
// 3. T extends U ? T : never：遍历 T 中的每个类型，如果该类型可以分配给 U，则保留（返回 T）；否则排除（返回 never）。
type Extract<T, U> = T extends U ? T : never;
```
:::

## 23、如何实现 ts 中的 NonNullable
描述：`NonNullable` 是一个类型工具，用于从类型 `T` 中排除 `null` 和 `undefined`，并创建一个新的类型。
::: details 详情
```ts
// 1. T：表示原始类型。
// 2. null 和 undefined：需要排除的类型。
// 3. T extends null | undefined ? never : T：遍历 T 中的每个类型，如果该类型是 null 或 undefined，则排除（返回 never）；否则保留（返回 T）。
type NonNullable<T> = T extends null | undefined ? never : T;
```
:::

## 24、如何实现 ts 中的 Parameters
描述：`Parameters` 是一个类型工具，用于获取函数类型 `T` 的参数类型，并将其构造成一个元组类型。
::: details 详情
```ts
// 1. T：表示函数类型。
// 2. T extends (...args: infer P) => any：判断 T 是否为函数类型，并使用 infer 推断其参数类型 P。
// 3. P：如果 T 是函数类型，则返回参数类型元组 P；否则返回 never。
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
```
:::

## 25、如何实现 ts 中的 ConstructorParameters
描述：`ConstructorParameters` 是一个类型工具，用于获取构造函数类型 `T` 的参数类型，并将其构造成一个元组类型。
::: details 详情
```ts
// 1. T：表示构造函数类型。
// 2. T extends abstract new (...args: infer P) => any：判断 T 是否为构造函数类型，并使用 infer 推断其参数类型 P。
// 3. P：如果 T 是构造函数类型，则返回参数类型元组 P；否则返回 never。
type ConstructorParameters<T extends abstract new (...args: any) => any> = T extends abstract new (...args: infer P) => any ? P : never;
```
:::

## 26、如何实现 ts 中的 ReturnType
描述：`ReturnType` 是一个类型工具，用于获取函数类型 `T` 的返回值类型。
::: details 详情
```ts
// 1. T：表示函数类型。
// 2. T extends (...args: any[]) => infer R：判断 T 是否为函数类型，并使用 infer 推断其返回值类型 R。
// 3. R：如果 T 是函数类型，则返回其返回值类型 R；否则返回 never。
type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : never;
```
:::

## 27、如何实现 ts 中的 InstanceType
描述：`InstanceType` 是一个类型工具，用于获取构造函数类型 `T` 的实例类型。
::: details 详情
```ts
// 1. T：表示构造函数类型。
// 2. T extends abstract new (...args: any[]) => infer R：判断 T 是否为构造函数类型，并使用 infer 推断其实例类型 R。
// 3. R：如果 T 是构造函数类型，则返回其实例类型 R；否则返回 never。
type InstanceType<T extends abstract new (...args: any[]) => any> = T extends abstract new (...args: any[]) => infer R ? R : never;
```
:::

## 28、说说对 ts 中命名空间与模块的理解
在 ts 中命名空间（Namespaces）​和模块（Modules）​都是用于组织和管理代码的工具。
::: details 详情
**命名空间**
- 命名空间是一个用于组织代码的机制，它允许开发者将相关代码分组到一个命名空间中，并使用名称空间来避免命名冲突。
  ```ts
  namespace MyNamespace {
    export class MyClass {
      public static sayHello(): void {
        console.log("Hello from MyClass!");
      }
    }

    export interface MyInterface {
      name: string;
    }
  }

  // 使用命名空间中的成员
  MyNamespace.MyClass.sayHello();

  const obj: MyNamespace.MyInterface = { name: "Alice" };
  ```
- 特点
  - 全局作用域：命名空间内的成员通过命名空间名称访问，避免了全局变量污染。
  - 嵌套命名空间：可以在一个命名空间内嵌套另一个命名空间。
  - 合并声明：同一个命名空间可以在多个文件中声明，ts 会自动将其合并。

**模块**
- 模块通过 `import` 和 `export` 关键字实现代码的封装和复用，每个模块都有自己的作用域，避免了全局命名冲突。

  导出：
  ```ts
  // utils.ts
  export function add(a: number, b: number): number {
    return a + b;
  }

  export class Calculator {
    public static multiply(a: number, b: number): number {
      return a * b;
    }
  }

  export default function greet(name: string): string {
    return `Hello, ${name}!`;
  }
  ```
  导入：
  ```ts
  // main.ts
  // 在一个 import 语句中，默认导出必须放在前面，后面跟随命名导入，用逗号分隔 或者 分两条导入。
  import greet, { add, Calculator } from './utils';

  console.log(add(2, 3)); // 输出: 5
  console.log(Calculator.multiply(2, 3)); // 输出: 6
  console.log(greet("胖虎")); // 输出: Hello, 胖虎!
  ```
- 特点
  - 作用域隔离：每个模块都有自己的作用域，内部的变量和函数不会污染全局作用域。
  - 静态解析：模块的导入和导出在编译时静态解析，有利于优化和静态分析工具的支持。
  - 支持默认导出：除了命名导出，模块还支持默认导出，允许模块导出一个主要的成员。

**区别**
|特性|命名空间（Namespaces）|模块（Modules）|
|---|--------|--------|
|​作用域|通过命名空间名称访问，避免全局污染|每个模块有独立的作用域，通过 import/export 管理依赖|
|​语法|使用 `namespace` 关键字定义，通过 `export` 导出成员|	使用 `export` `导出成员，import` 导入其他模块的成员|
|​组织方式|适用于将相关代码封装在一起，避免命名冲突|适用于大型项目，支持代码拆分、懒加载和按需导入|
|​现代性|主要用于 ts 早期，逐渐被模块系统取代|现代 js 和 ts 推荐使用模块系统|
|​工具支持|支持命名空间合并，但在模块化项目中不常用|完全支持 ES6 模块语法，与现代构建工具（如 Webpack）兼容|
|​可维护性|在大型项目中，命名空间可能导致代码组织混乱|模块化有助于代码的清晰组织和维护，提高可读性和可维护性|
|​兼容性|可以与 js 的 IIFE 等模式结合使用|与现代 js 模块系统（CommonJS、ES6 Modules）兼容|
:::

## 29、ts 中 `readonly` 和 `as const` 的区别
::: details 详情
|特性|`readonly`|`as const`|
|----|--------|--------|
|用途|类型层面的只读声明|变量层面的常量断言，使变量及其成员尽可能具体和只读|
|应用范围|类属性、接口属性、类型别名|变量声明（常量、对象、数组等）|
|赋值时机|只能在声明时或构造函数中赋值（对类属性而言）|必须在声明时初始化，之后不能更改|
|影响深度|仅使属性标记为只读，不改变属性的类型推断|使整个对象或数组变为只读，并将类型细化为具体字面量类型|
|类型推断|不改变变量的具体类型，只是限制赋值操作|精确推断变量及其成员的具体类型，生成最具体的字面量类型|
|可变性控制|允许在声明后通过构造函数或其他授权方式赋初值|不允许任何形式的重新赋值或修改|
|适用场景|需要在类型层面表达属性不可变的场景，如类和接口设计|需要将变量及其成员具体化，并确保其不可变的场景|

**总结**
- `readonly​​` 是一个类型修饰符，用于在类型层面表达属性的不可变性，适用于类、接口和类型别名，具有浅层只读的特性。
- `as const`​​ 是一个常量断言，用于在变量声明时将变量及其嵌套成员具体化并标记为只读，具有深层只读和类型细化的特性。
:::

## 30、简述一下 ts 中函数重载
::: details 详情
**什么是函数重载**
- 函数重载是指在 ts 中，允许为同一个函数定义多个函数签名（声明），以支持不同的参数类型或数量。
- 函数重载的目的是让函数能够根据不同的调用方式执行不同的逻辑。

---

**函数重载的语法**
- 函数重载由多个签名（声明）和一个通用实现组成。
```ts
function 函数名(参数1: 类型, 参数2: 类型): 返回值类型; // 签名1
function 函数名(参数1: 类型): 返回值类型; // 签名2
function 函数名(...args: any[]): any {
   // 通用实现
}
```

---

**示例**
- 函数示例：定义一个函数，根据参数类型返回不同的结果。
```ts
// 定义函数签名
function add(a: number, b: number): number;
function add(a: string, b: string): string;

// 通用实现
function add(a: any, b: any): any {
  return a + b;
}

// 使用
console.log(add(1, 2)); // 输出: 3
console.log(add("Hello, ", "World!")); // 输出: Hello, World!
```
- 类方法重载
```ts
class Calculator {
  // 方法签名
  calculate(a: number, b: number): number;
  calculate(a: string, b: string): string;

  // 通用实现
  calculate(a: any, b: any): any {
    if (typeof a === "number" && typeof b === "number") {
      return a + b;
    } else if (typeof a === "string" && typeof b === "string") {
      return a.concat(b);
    }
  }
}

const calc = new Calculator();
console.log(calc.calculate(10, 20)); // 输出: 30
console.log(calc.calculate("Hello, ", "TypeScript!")); // 输出: Hello, TypeScript!
```

---

**注意事项**
- 签名顺序
  > 重载签名的顺序很重要，最具体的签名应该放在最前面，最通用的签名放在最后。
```ts
function example(a: number): number;
function example(a: any): any; // 通用签名
function example(a: any): any {
  return a;
}
```
- 实现必须兼容所有签名
  > 通用实现的参数和返回值类型必须兼容所有定义的签名。
- 不能直接调用通用实现
  > ts 只允许调用符合签名的重载方法，而不能直接调用通用实现。
:::