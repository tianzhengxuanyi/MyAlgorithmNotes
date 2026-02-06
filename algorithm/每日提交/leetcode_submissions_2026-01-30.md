### 2026-01-30

#### [2977. 转换字符串的最小成本 II](https://leetcode.cn/problems/minimum-cost-to-convert-string-ii/description/)

给你两个下标从 **0** 开始的字符串 `source` 和 `target` ，它们的长度均为 `n` 并且由 **小写** 英文字母组成。

另给你两个下标从 **0** 开始的字符串数组 `original` 和 `changed` ，以及一个整数数组 `cost` ，其中 `cost[i]` 代表将字符串 `original[i]` 更改为字符串 `changed[i]` 的成本。

你从字符串 `source` 开始。在一次操作中，**如果** 存在 **任意** 下标 `j` 满足 `cost[j] == z`  、`original[j] == x` 以及 `changed[j] == y` ，你就可以选择字符串中的 **子串** `x` 并以 `z` 的成本将其更改为 `y` 。 你可以执行 **任意数量** 的操作，但是任两次操作必须满足 **以下两个** 条件 **之一** ：

* 在两次操作中选择的子串分别是 `source[a..b]` 和 `source[c..d]` ，满足 `b < c`  **或** `d < a` 。换句话说，两次操作中选择的下标 **不相交** 。
* 在两次操作中选择的子串分别是 `source[a..b]` 和 `source[c..d]` ，满足 `a == c` **且** `b == d` 。换句话说，两次操作中选择的下标 **相同** 。

返回将字符串 `source` 转换为字符串 `target` 所需的 **最小** 成本。如果不可能完成转换，则返回 `-1` 。

**注意**，可能存在下标 `i` 、`j` 使得 `original[j] == original[i]` 且 `changed[j] == changed[i]` 。

**示例 1：**

```
输入：source = "abcd", target = "acbe", original = ["a","b","c","c","e","d"], changed = ["b","c","b","e","b","e"], cost = [2,5,5,1,2,20]
输出：28
解释：将 "abcd" 转换为 "acbe"，执行以下操作：
- 将子串 source[1..1] 从 "b" 改为 "c" ，成本为 5 。
- 将子串 source[2..2] 从 "c" 改为 "e" ，成本为 1 。
- 将子串 source[2..2] 从 "e" 改为 "b" ，成本为 2 。
- 将子串 source[3..3] 从 "d" 改为 "e" ，成本为 20 。
产生的总成本是 5 + 1 + 2 + 20 = 28 。 
可以证明这是可能的最小成本。
```

**示例 2：**

```
输入：source = "abcdefgh", target = "acdeeghh", original = ["bcd","fgh","thh"], changed = ["cde","thh","ghh"], cost = [1,3,5]
输出：9
解释：将 "abcdefgh" 转换为 "acdeeghh"，执行以下操作：
- 将子串 source[1..3] 从 "bcd" 改为 "cde" ，成本为 1 。
- 将子串 source[5..7] 从 "fgh" 改为 "thh" ，成本为 3 。可以执行此操作，因为下标 [5,7] 与第一次操作选中的下标不相交。
- 将子串 source[5..7] 从 "thh" 改为 "ghh" ，成本为 5 。可以执行此操作，因为下标 [5,7] 与第一次操作选中的下标不相交，且与第二次操作选中的下标相同。
产生的总成本是 1 + 3 + 5 = 9 。
可以证明这是可能的最小成本。
```

**示例 3：**

```
输入：source = "abcdefgh", target = "addddddd", original = ["bcd","defgh"], changed = ["ddd","ddddd"], cost = [100,1578]
输出：-1
解释：无法将 "abcdefgh" 转换为 "addddddd" 。
如果选择子串 source[1..3] 执行第一次操作，以将 "abcdefgh" 改为 "adddefgh" ，你无法选择子串 source[3..7] 执行第二次操作，因为两次操作有一个共用下标 3 。
如果选择子串 source[3..7] 执行第一次操作，以将 "abcdefgh" 改为 "abcddddd" ，你无法选择子串 source[1..3] 执行第二次操作，因为两次操作有一个共用下标 3 。
```

**提示：**

* `1 <= source.length == target.length <= 1000`
* `source`、`target` 均由小写英文字母组成
* `1 <= cost.length == original.length == changed.length <= 100`
* `1 <= original[i].length == changed[i].length <= source.length`
* `original[i]`、`changed[i]` 均由小写英文字母组成
* `original[i] != changed[i]`
* `1 <= cost[i] <= 106`

##### 字典树 + Floyd最短路径 + 动态规划 + 迭代

```js
/**
 * @param {string} source
 * @param {string} target
 * @param {string[]} original
 * @param {string[]} changed
 * @param {number[]} cost
 * @return {number}
 */
var minimumCost = function (source, target, original, changed, cost) {
    const n = source.length, m = original.length;
    const root = new TireNode(-1); // 字典树
    const idx = { value: 0 } // 将original和target转为字典树中的节点id
    // 添加字典树节点，并为每个end node 填加自增id
    const addNode = (word) => {
        let node = root;
        for (let chr of word) {
            const code = chr.charCodeAt() - 97;
            if (!node.next[code]) {
                node.next[code] = new TireNode(chr);
            }
            node = node.next[code];
        }
        if (node.id < 0) {
            node.id = idx.value++;
        }
        return node.id;
    }
    const nodeCnt = 2 * m; // 节点总数
    const graph = Array.from({ length: nodeCnt }, () => Array(nodeCnt).fill(Infinity));
    for (let i = 0; i < nodeCnt; i++) {
        graph[i][i] = 0; // 初始化自身转换的cost为0
    }
    for (let i = 0; i < original.length; i++) {
        const id1 = addNode(original[i]);
        const id2 = addNode(changed[i]);
        // 建图
        graph[id1][id2] = Math.min(graph[id1][id2], cost[i]);
    }

    // Folyd多源最短路
    for (let k = 0; k < nodeCnt; k++) {
        for (let i = 0; i < nodeCnt; i++) {
            if (graph[i][k] == Infinity) continue;
            for (let j = 0; j < nodeCnt; j++) {
                graph[i][j] = Math.min(graph[i][j], graph[i][k] + graph[k][j]);
            }
        }
    }

    // 动态规划 从i开始source变为target需要的最小花费
    const f = Array(n + 1).fill(Infinity);
    f[n] = 0;
    for (let i = n - 1; i >= 0; i--) {
        // 如果source[i] == target[i]
        // 可以直接从i+1开始转换
        if (source[i] == target[i]) {
            f[i] = f[i + 1];
        }
        // 尝试将source[i, j]转换
        for (let j = i, p = root, q = root; j < n; j++) {
            p = p.next[source[j].charCodeAt() - 97];
            q = q.next[target[j].charCodeAt() - 97];
            // 如果字典树中不存在source[i, j]或target[i, j]
            // 说明original和changed转换不了
            if (!p || !q) break;
            if (p.id >= 0 && q.id >= 0) {
                f[i] = Math.min(f[i], f[j+1] + graph[p.id][q.id]);
            }
        }
    }
    return f[0] == Infinity ? -1 : f[0];
};

function TireNode(val) {
    this.val = val;
    this.next = Array(26);
    this.id = -1;
}
```

##### 字典树 + Floyd最短路径 + 动态规划

```js
/**
 * @param {string} source
 * @param {string} target
 * @param {string[]} original
 * @param {string[]} changed
 * @param {number[]} cost
 * @return {number}
 */
var minimumCost = function (source, target, original, changed, cost) {
    const n = source.length,
        m = original.length;
    const graphMap = new Map();
    const nodes = new Set();
    for (let i = 0; i < m; i++) {
        const changedCosts = graphMap.get(original[i]) ?? new Map();
        const changedCost = changedCosts.get(changed[i]) ?? Infinity;
        changedCosts.set(original[i], 0); // origin -> origin
        changedCosts.set(changed[i], Math.min(cost[i], changedCost)); // origin -> cost
        graphMap.set(original[i], changedCosts);
        (nodes.add(original[i]), nodes.add(changed[i]));
    }
    for (let k of nodes.values()) {
        const kMap = graphMap.get(k) ?? new Map();
        for (let i of nodes.values()) {
            const iMap = graphMap.get(i) ?? new Map();
            if (!iMap.get(k) || iMap.get(k) == Infinity) continue;
            for (let j of nodes.values()) {
                let w = iMap?.get(j) ?? Infinity;
                w = Math.min(
                    w,
                    (iMap?.get(k) ?? Infinity) +
                    (kMap?.get(j) ?? Infinity),
                );
                iMap.set(j, w);
            }
            graphMap.set(i, iMap);
        }
    }

    const tree = new TrieNode(-1);
    for (let word of original) {
        let node = tree;
        let str = ""
        for (let chr of word) {
            str += chr;
            let code = chr.charCodeAt() - 97;
            if (!node.next[code]) {
                node.next[code] = new TrieNode(str);
            }
            node = node.next[code];
        }
        node.end = true;
    }

    for (let word of changed) {
        let node = tree;
        let str = ""
        for (let chr of word) {
            str += chr;
            let code = chr.charCodeAt() - 97;
            if (!node.next[code]) {
                node.next[code] = new TrieNode(str);
            }
            node = node.next[code];
        }
        node.end = true;
    }
    const memo = Array(n).fill(-1);
    const dfs = (i) => {
        if (i >= n) return 0;
        if (memo[i] >= 0) return memo[i];
        let node = tree, nodeTarget = tree;
        let mnCost = Infinity;
        if (source[i] == target[i]) {
            mnCost = dfs(i + 1);
        }
        for (let j = i; j < n; j++) {
            node = node.next[source[j].charCodeAt() - 97], nodeTarget = nodeTarget.next[target[j].charCodeAt() - 97];
            if (!node || !nodeTarget) break;
            const w = graphMap.get(node.val)?.get(nodeTarget.val) ?? Infinity
            if (w < Infinity) mnCost = Math.min(mnCost, dfs(j + 1) + w);
        }
        return memo[i] = mnCost;
    }

    dfs(0);
    return memo[0] == Infinity ? -1 : memo[0];
};

function TrieNode(val) {
    this.val = val;
    this.next = Array(26);
    this.end = false;
}
```

