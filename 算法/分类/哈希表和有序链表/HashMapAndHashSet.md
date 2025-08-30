# 哈希表和有序链表

### 哈希表

哈希表在使用层面上可以理解为一种集合结构

哈希表的时间复杂度是**常数级别**的，能实现增删改查功能

HashSet `<key>`: 只有key，没有伴随数据value。

```js
const HashSet = new Set();
// 增
HashSet.add(1)
// 删
HashSet.delete(1)
// 查
HashSet.has(1)
// 清空
HashSet.clear()
```

HashMap `<key,value>`: 既有key，又有伴随数据value，以key来排序组织。key可以是基础类型也可以是**引用类型**。

```js
const HashMap = new Map();
// 增
HashMap.set('1', 1)
// 删
HashMap.delete('1')
// 查
HashMap.has("1")
// 改
HashMap.get("1")
// 清空
HashMap.clear()
```
