# 有序表

**有序表的简单介绍**

1. 有序表在使用层面上可以理解为一种集合结构
2. 如果只有 key，没有伴随数据 value，可以使用 TreeSet 结构(C++中叫 OrderedSet)
3. 如果既有 key，又有伴随数据 value，可以使用 TreeMap 结构(C++中叫 OrderedMap)
4. 有无伴随数据，是 TreeSet 和 TreeMap 唯一的区别，底层的实际结构是一回事
5. 有序表和哈希表的区别是，有序表把 key 按照顺序组织起来，而哈希表完全不组织
6. 红黑树、AVL 树、size-balance-tree 和跳表等都属于有序表结构，只是底层具体实现不同
7. 放入哈希表的东西，如果是基础类型，内部按值传递，内存占用就是这个东西的大小
8. 放入哈希表的东西，如果不是基础类型，必须提供比较器，内部按引用传递，内存占用是这个东西内存地址的大小
9. 不管是什么底层具体实现，只要是有序表，都有以下固定的基本功能和固定的时间复杂度

**有序表的固定操作**

1. `put(K:key, V:value): void`：将一个（key，value）记录加入到表中，或者将 key 的记录更新成 value。
2. `get(K:key): value`：根据给定的 key，查询 value 并返回。
3. `remove(K:key): void`：移除 key 的记录。
4. `containsKey(K:key): boolean`：询问是否有关于 key 的记录。
5. `firstKey(): key`：返回所有键值的排序结果中，最左（最小）的那个。
6. `lastKey(): key`：返回所有键值的排序结果中，最右（最大）的那个。
7. `floorKey(K:key): key`：如果表中存入过 key，返回 key；否则返回所有键值的排序结果中，key 的前一个。
8. `ceilingKey(K:key): key`：如果表中存入过 key，返回 key；否则返回所有键值的排序结果中，key 的后一个。

以上所有操作时间复杂度都是`O(logN)`，N 为有序表含有的记录数。

## 链表

**单链表的节点结构**

```ts
interface NodeType {
    value: any;
    next: NodeType;
}

class Node implements NodeType{
    constructor(value: any, next: NodeType) {
        this.value = value
        this.next = next
    }
}
```

由以上结构的节点依次连接起来所形成的链叫单链表结构。

**双链表的节点结构**

```ts
interface NodeType {
    value: any;
    next: NodeType;
    last: NodeType;
}

class Node implements NodeType{
    constructor(value: any, next: NodeType, last: NodeType) {
        this.value = value
        this.next = next
        this.last = last
    }
}
```

由以上结构的节点依次连接起来所形成的链叫双链表结构。

单链表和双链表结构只需要给定一个头部节点 head，就可以找到剩下的所有的节点

### 反转单向和双向链表

【题目】 分别实现反转单向链表和反转双向链表的函数

【要求】 如果链表长度为`N`，时间复杂度要求为`O(N)`，额外空间复杂度要求为`O(1)`


