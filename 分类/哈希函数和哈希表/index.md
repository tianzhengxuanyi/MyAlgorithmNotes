## 哈希函数
Hash，一般翻译做"散列"，也有直接音译为"哈希"的，就是把任意长度的输入（又叫做预映射， pre-image），通过散列算法，变换成固定长度的输出，该输出就是散列值。
**性质：**
- 输入可以是无穷大，输出是有限范围内
- 同样的输入，同样的输出
- 不同输入可能会有同样的输出(哈希碰撞)
- 输出均匀的，离散的，分散在哈希表
- 将输出取模m，得到的数据均匀的分布在0~m-1

**问题：** 给一个范围`0~2^32-1`的无符号整数，一共有40亿个，给定1G内存，返回出现次数最多的数。


## 哈希表

哈希表在使用层面上可以理解为一种集合结构

哈希表的时间复杂度是**常数级别**的，能实现增删改查功能

**哈希表的基础实现原理**

## JS中哈希表的实现
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

## 设计RandomPool结构
**【题目】**

设计一种结构，在该结构中有如下三个功能:

insert(key):将某个key加入到该结构，做到不重复加入

delete(key):将原本在结构中的某个key移除

getRandom(): 等概率随机返回结构中的任何一个key。

**【要求】**

Insert、delete和getRandom方法的时间复杂度都是O(1)

**思路：**

- 结构中包含KeyMap<{key:index}>、IndexMap<{index:key}>、size。其中index是key的插入顺序，size是Map的长度；
- 插入时，分别在KeyMap和IndexMap中插入对应记录，size加1；
- 删除key1时，将index 等于 size - 1的key在KeyMap和IndexMap中更改index为要删除key1的index，然后删除key1；
- 返回随机key，随机生成0~size-1的整数，返回对应index的key；

