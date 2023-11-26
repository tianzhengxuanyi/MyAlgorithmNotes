## 哈希表
HashSet <key> 由增（add）、删（remove）、查（contains）

HashMap<key,value> value是伴随数据，排序组织以key来

HashMap由增/更新（add）、删（remove）、查（containkey）、拿（get）key的value

哈希表的时间复杂度是常数级别的，能实现增删改查功能

`javascript`中哈希表的实现有**map和set**



## 有序表
有序表的性能比哈希表差，是和哈希表一样，分为TreeSet和TreeMap，内部按照Key来组织排序

注意：当放如有序表的东西是基本数据类型的时候，可以实现比较。当放入有序表的东西不是基本数据类型时，要提供比较器。

操作：

1. `put（k key， V value）` :将（key，value）加入表中，也可实现将key更新成value

2. `V get（k key）` ：根据key查询value返回

3. `remove（k key）` ：删去key的记录

4. `boolean containskey（k key）` ：查

5. `k firstkey` ：所有键值的排序结果中，最小（左）的那个

6. `k lastkey` ：所有键值的排序中，最大（右）的那个

7. `k floorkey（k key）` ：如果表中存过key，则返回key，否则返回所有键值的排序结果中，key的前一个（小于等于）

8. `k ceilingkey（k key）` ：大于等于（后一个）