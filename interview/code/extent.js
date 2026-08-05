function Parent(name){
  this.name = name;
}
Parent.prototype.sayName = function(){console.log(this.name)};

function Child(name){
  // 模拟super：父构造生成this
  const thisObj = Reflect.construct(Parent, [name], new.target);
  return thisObj;
}
// 原型链
Child.prototype = Object.create(Parent.prototype);
// 设置constructor为不可枚举，模拟class行为
Object.defineProperty(Child.prototype, 'constructor', {
  value: Child,
  writable: true,
  configurable: true,
  enumerable: false
})
// 继承静态方法！extends自动做，手写必须补
Object.setPrototypeOf(Child, Parent);