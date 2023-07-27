class RandomPool {
  constructor() {
    this.keyMap = new Map();
    this.indexMap = new Map();
    this.size = 0;
  }
  insert(key) {
    if (!this.keyMap.has(key)) {
      this.keyMap.set(key, this.size);
      this.indexMap.set(this.size++, key);
    }
  }
  delete(key) {
    if (this.keyMap.has(key)) {
      // 获取key对应的index
      const index = this.keyMap.get(key);
      // 获取最后的index
      const lastIndex = --this.size;
      // 获取最后一个key
      const keyLast = this.indexMap.get(lastIndex);
      // 将keyLast的index设置成key的index
      this.keyMap.set(keyLast, index);
      // 将index对应的key换成keyLast
      this.indexMap.set(index, keyLast);
      // 删除key
      this.keyMap.delete(key);
      // 删除最后的index
      this.indexMap.delete(lastIndex);
    }
  }
  getRandom() {
    if (this.size === 0) {
      return null;
    }
    const index = parseInt(Math.random() * this.size);
    return this.indexMap.get(index);
  }
}

const pool = new RandomPool();

pool.insert("a");
pool.insert("b");
pool.insert("c");
pool.insert("a");
pool.insert("d");
pool.insert("e");

console.log(pool.indexMap);
console.log(pool.keyMap);

console.log(pool.getRandom());
console.log(pool.getRandom());
console.log(pool.getRandom());
console.log(pool.getRandom());
console.log(pool.getRandom());
console.log(pool.getRandom());

pool.delete("e");
console.log(pool.indexMap);
console.log(pool.keyMap);

console.log(pool.getRandom());
console.log(pool.getRandom());
console.log(pool.getRandom());
console.log(pool.getRandom());
console.log(pool.getRandom());
console.log(pool.getRandom());
