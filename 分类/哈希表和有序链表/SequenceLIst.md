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

class Node implements NodeType {
    constructor(value: any, next: NodeType) {
        this.value = value;
        this.next = next;
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

class Node implements NodeType {
    constructor(value: any, next: NodeType, last: NodeType) {
        this.value = value;
        this.next = next;
        this.last = last;
    }
}
```

由以上结构的节点依次连接起来所形成的链叫双链表结构。

单链表和双链表结构只需要给定一个头部节点 head，就可以找到剩下的所有的节点

**面试时链表解题的方法论**

1. 对于笔试，不用太在乎空间复杂度，一切为了时间复杂度

2. 对于面试，时间复杂度依然放在第一位，但是一定要找到空间最省的方法

**重要技巧：**

1. 额外数据结构记录（哈希表等）

2. 快慢指针

### 反转单向和双向链表

【题目】 分别实现反转单向链表和反转双向链表的函数

【要求】 如果链表长度为`N`，时间复杂度要求为`O(N)`，额外空间复杂度要求为`O(1)`

**反转单向链表： 迭代**

```js
function reverseList(head) {
    if (head === null || head.next === null) {
        return head;
    }

    let prev = null;
    let curr = head;
    let next = null;

    while (curr) {
        next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }

    return prev;
}
```

**反转单向链表： 递归**

```js
function reverseListRecursive(head) {
    if (head === null || head.next === null) {
        return head;
    }
    let newHead = reverseListRecursive(head.next);
    head.next.next = head;
    head.next = null;

    return newHead;
}
```

### 打印两个有序链表的公共部分

【题目】 给定两个有序链表的头指针 head1 和 head2，打印两个链表的公共部分。

【要求】 如果两个链表的长度之和为 N，时间复杂度要求为 O(N)，额外空间复 杂度要求为 O(1)

### 判断一个链表是否为回文结构

【题目】给定一个单链表的头节点 head，请判断该链表是否为回文结构。

【例子】1->2->1，返回 true； 1->2->2->1，返回 true；15->6->15，返回 true； 1->2->3，返回 false。

【要求】如果链表长度为 N，时间复杂度达到 O(N)，额外空间复杂度达到 O(1)。

### 将单向链表按某值划分成左边小、中间相等、右边大的形式

【题目】给定一个单链表的头节点 head，节点的值类型是整型，再给定一个整 数 pivot。实现一个调整链表的函数，将链表调整为左部分都是值小于 pivot 的 节点，中间部分都是值等于 pivot 的节点，右部分都是值大于 pivot 的节点。

【进阶】在实现原问题功能的基础上增加如下的要求

【要求】调整后所有小于 pivot 的节点之间的相对顺序和调整前一样

【要求】调整后所有等于 pivot 的节点之间的相对顺序和调整前一样

【要求】调整后所有大于 pivot 的节点之间的相对顺序和调整前一样

【要求】时间复杂度请达到 O(N)，额外空间复杂度请达到 O(1)。

把链表里面的数放到**Node 类型的**数组里面去，然后对数组玩 partition, 然后再把数组里面的数放回链表就行了

### 复制含有随机指针节点的链表

【题目】一种特殊的单链表节点类描述如下

```ts
interface NodeType {
    value: number;
    next: NodeType;
    rand: NodeType;
}
class Node implements NodeType {
    constructor(value: number, next: NodeType, rand: NodeType) {
        this.value = value;
        this.next = next;
        this.rand = rand;
    }
}
```

rand 指针是单链表节点结构中新增的指针，rand 可能指向链表中的任意一个节 点，也可能指向 null。给定一个由 Node 节点类型组成的无环单链表的头节点 head，请实现一个函数完成这个链表的复制，并返回复制的新链表的头节点。

【要求】时间复杂度 O(N)，额外空间复杂度 O(1)
