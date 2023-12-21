### 前缀树
何为前缀树? 如何生成前缀树?

例子: 一个字符串类型的数组arr1，另一个字符串类型的数组arr2。

arr2中有哪些字符，是arr1中出现的？请打印。

arr2中有哪些字符，是作为arr1中某个字符串前缀出现的？请打印。

arr2中有哪些字符，是作为arr1中某个字符串前缀出现的？请打印 

arr2中出现次数最大的前缀

### [实现 Trie (前缀树)](https://leetcode.cn/problems/implement-trie-prefix-tree/)
![生成前缀树](../../image/day8-1.png)
**思路：**
1. 将字符放在edge上，用长度为26的数组记录可能出现的字符，根据字符的code值判断在数组中的位置
2. 记录字符路过的数量p和以当前字符为结尾的个数e
```js
/**
 * Initialize your data structure here.
 */
var Trie = function() {
    this.p = 0;
    this.e = 0;
    this.next = Array.from({length: 26});
};

/**
 * Inserts a word into the trie. 
 * @param {string} word
 * @return {void}
 */
Trie.prototype.insert = function(word) {
    if (word === null) return;
    let arr = word.split('')
    let node = this;
    let index = 0;
    node.p++
    for (let i = 0; i < arr.length; i++) {
        index = arr[i].charCodeAt() - 'a'.charCodeAt();
        if (!node.next[index]) {
            node.next[index] = new Trie();
        }
        node = node.next[index]
        node.p++
    }
    node.e++
};

/**
 * Returns if the word is in the trie. 
 * @param {string} word
 * @return {boolean}
 */
Trie.prototype.search = function(word) {
    if (word === null) return true;
    let arr = word.split('');
    let node = this;
    let index = 0;

    for (let i = 0; i < arr.length; i++) {
        index = arr[i].charCodeAt() - 'a'.charCodeAt();
        if (!node.next[index]) {
            return false;
        }
        node = node.next[index];
    }
    if (node.e === 0) return false
    return true
};

/**
 * Returns if there is any word in the trie that starts with the given prefix. 
 * @param {string} prefix
 * @return {boolean}
 */
Trie.prototype.startsWith = function(prefix) {
     if (prefix === null) return true;
    let arr = prefix.split('');
    let node = this;
    let index = 0;

    for (let i = 0; i < arr.length; i++) {
        index = arr[i].charCodeAt() - 'a'.charCodeAt();
        if (!node.next[index]) {
            return false;
        }
        node = node.next[index];
    }
    return true
};

/**
 * Your Trie object will be instantiated and called as such:
 * var obj = new Trie()
 * obj.insert(word)
 * var param_2 = obj.search(word)
 * var param_3 = obj.startsWith(prefix)
 */
```

虽然数组化哈希很常用，但如果题目给出的字符串是Unicode形式，那还是要实现成基于哈希表的前缀树。

【解法一：基于哈希表的前缀树】

本题考查前缀树的实现。在了解前缀树的结构和作用后，其实现是简单而直接的。前缀树问题一般都是在同一棵树上求解。树的根为非前缀，前缀从根的儿子开始。树结点类通常写作Trie。每一个结点的儿子结点数量，与「构成前缀的基本元素的种类数」相关。本题的插入和搜索方法也是一般前缀树的基本方法。

insert：从root开始按输入的word的字符依次向下延伸，若无代表次字符的结点，创建之。
search：向下寻找word，若找到，则末尾字符处判断是否为单词。因此，Trie类还需维护一个isEnd属性，用以标记到该节点为止的前缀是否为单词。
startsWith：向下寻找prefix。某一字符找不到则立即返回false，否则返回true。
其中，2，3动作类似，可以另外给出一个searchPrefix方法，寻找输入的字符串是否在前缀树上，找到则返回最后一个结点，否则返回null。于是2和3就可以通过调用searchPrefix，以一条返回语句完成方法。

时间复杂度：初始化为O(1)，每次操作为O(N)，N为插入或查找的字符串的长度。
空间复杂度：O(N)，N表示Trie结点数量。N基本上等于所有插入字符的长度之和。（说基本上是因为如果插入单词的有部分前缀相同，那么结点数量要减去这些前缀的长度）。
```java
class Trie {
    Map<Character, Trie> next;
    boolean isEnd;
    public Trie() {
        this.next = new HashMap<>();
        this.isEnd = false;
    }
    public void insert(String word) {
        Trie cur = this; // 得到根结点
        for(char c : word.toCharArray()){
            if(cur.next.get(c) == null){ // 若当前无此字符，添加之
                cur.next.put(c, new Trie());
            }
            cur = cur.next.get(c); // 向下考察
        }
        cur.isEnd = true; // 置末尾字符节点isEnd为true
    }
    public boolean search(String word) {
        Trie end = searchPrefix(word);
        return end != null && end.isEnd;
    }
    public boolean startsWith(String prefix) {
        return searchPrefix(prefix) != null;
    }
    private Trie searchPrefix(String prefix){
        Trie cur = this;
        for(char c : prefix.toCharArray()){
            if(cur.next.get(c) == null){
                return null; // 无此前缀，返回null
            }
            cur = cur.next.get(c);
        }
        return cur;
    }
}
```
【解法二：基于数组化哈希的前缀树】

前缀树通常被用来解决字符相关的问题（因此也称为字典树），多数典型问题中，字符为英文字母。若题目声明字符集为英文小写字母，那么每一个结点儿子数量为26。于是每一个结点中维护的子结点哈希表可以替换为大小为26的Trie数组。实际上，这是我们更常看到的做法。

时间复杂度：初始化为O(1)，每次操作为O(N)，N为插入或查找的字符串的长度。
空间复杂度：O(26*N)，N表示Trie结点数量。
```java
class Trie {
    Trie[] next;
    boolean isEnd;
    public Trie() {
        this.next = new Trie[26];
        this.isEnd = false;
    }
    public void insert(String word) {
        Trie cur = this; // 得到根结点
        for(char c : word.toCharArray()){
            int idx = c - 'a';
            if(cur.next[idx] == null){ // 若当前无此字符，添加之
                cur.next[idx] = new Trie();
            }
            cur = cur.next[idx]; // 向下考察
        }
        cur.isEnd = true; // 置末尾字符节点isEnd为true
    }
    public boolean search(String word) {
        Trie end = searchPrefix(word);
        return end != null && end.isEnd;
    }
    public boolean startsWith(String prefix) {
        return searchPrefix(prefix) != null;
    }
    private Trie searchPrefix(String prefix){
        Trie cur = this;
        for(char c : prefix.toCharArray()){
            int idx = c - 'a';
            if(cur.next[idx] == null){
                return null; // 无此前缀，返回null
            }
            cur = cur.next[idx];
        }
        return cur;
    }
}
```

### 题目
习题解析：

208. 实现 Trie (前缀树)：本题直接套用前缀树的模板就好了。

211. 添加与搜索单词 - 数据结构设计：本题的解法为前缀树+dfs，遇到字符点.，然后利用dfs遍历next的26个链接中的有效节点，看能不能找到有效字符串就好了。

212. 单词搜索 II：本题的解法为前缀树+dfs，每个坐标点的四周进行dfs，将存在于字典树的坐标字符记录为’#’，等找到满足题目意思的单词后，回溯就好了。

336. 回文对：本题使用hashmap代替手动实现前缀树，建立hashmap用来存放<单词，下标>，建立set表用来存放单词单词（方便马拉车算法用的），换言之，本题使用的前缀树+马拉车算法。

421. 数组中两个数的最大异或值：本题将每个数字转换为二进制数存入前缀树中，然后利用异或的最大值temp为max|2^i，便可解题。

472. 连接词：本题在前缀树的基础上，稍微变化一点细节问题。

648. 单词替换：本题与其使用前缀树，我们倒不如直接比较数组中元素第一个字符和单词的第一个字符效率来的快。

676. 实现一个魔法字典：本题使用前缀树+dfs解题，不过只有一次机会去替换没有的字符，具体可看题解。

677. 键值映射：本题使用前缀树解法稍复杂，每个节点除了要存放单词中的字符外，还要存储累计value的总和，尾节点要存放该字符串的value值。使用map思路就很清晰了，用map来代替前缀树节点，利用map的自排序功能，遍历map来查找前缀，累加和为reuslt。

692. 前K个高频单词：本题使用map代替前缀树，若手动实现前缀树感觉费力不讨好，最后还是要将<string, int>装到vector进行排序，所以直接用map就好啦。排序后的<string, int>是按单词的频率（相同频率，按单词单词的弱序排列）排列，所有我们直接将前k个高频单词push到result中就好了。

720. 词典中最长的单词：本题将前缀树模板稍微改进以下就好了，最长的单词在字典树中的每个节点都能表示一个字符串，然后返回最长的就好了。

745. 前缀和后缀搜索：本题建立两个字典树就好了，建立前缀树和后缀树（后缀树就是将前缀树反着过来，也就是将每个单词反向后建立的前缀树就是后缀树了），前缀树用来查前缀，后缀树用来查后缀，并且节点记录访达权值，查找的时候排除边缘条件后对比权值就行。

1023. 驼峰式匹配：本题不知道和前缀树有啥关系，有大写字符换能建立前缀树？所以本题我们使用暴力解题，指针i、j分别用来遍历查询项和模式串，匹配就添加true，不匹配就返回false。

1032. 字符流：本题使用前缀树导致内存爆了，遂将字符串反向之后建立后缀树，然后在查询的时候将每个字符头插到一个用来存放所有查询字符的字符串，判断该字符串的前缀是否在后缀树就行了。
