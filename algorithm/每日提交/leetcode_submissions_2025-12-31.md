### 2025-12-31

#### [39. 组合总和](https://leetcode.cn/problems/combination-sum/description/)

给你一个 **无重复元素** 的整数数组 `candidates` 和一个目标整数 `target` ，找出 `candidates` 中可以使数字和为目标数 `target` 的 所有**不同组合** ，并以列表形式返回。你可以按 **任意顺序** 返回这些组合。

`candidates` 中的 **同一个** 数字可以 **无限制重复被选取** 。如果至少一个数字的被选数量不同，则两种组合是不同的。

对于给定的输入，保证和为 `target` 的不同组合数少于 `150` 个。

**示例 1：**

```
输入：candidates = [2,3,6,7], target = 7
输出：[[2,2,3],[7]]
解释：
2 和 3 可以形成一组候选，2 + 2 + 3 = 7 。注意 2 可以使用多次。
7 也是一个候选， 7 = 7 。
仅有这两种组合。
```

**示例 2：**

```
输入: candidates = [2,3,5], target = 8
输出: [[2,2,2,2],[2,3,3],[3,5]]
```

**示例 3：**

```
输入: candidates = [2], target = 1
输出: []
```

**提示：**

* `1 <= candidates.length <= 30`
* `2 <= candidates[i] <= 40`
* `candidates` 的所有元素 **互不相同**
* `1 <= target <= 40`

##### 回溯：枚举选哪个 + 剪枝

```js
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function(candidates, target) {
    candidates.sort((a, b) => a - b);
    const n = candidates.length;
    const ans = [], path = []
    const dfs = (i, rest) => {
        if (rest == 0) {
            ans.push(path.slice());
            return;
        }
        if (candidates[i] > rest || i >= n) return;
        for (let j = i; j < n; j++) {
            if (candidates[j] > rest) break;
            path.push(candidates[j]);
            dfs(j, rest - candidates[j]);
            path.pop();
        }
    }
    dfs(0, target);
    return ans;
};
```

##### 回溯：选或不选

```js
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function(candidates, target) {
    const n = candidates.length;
    const ans = [];
    const dfs = (i, sum, path) => {
        if (sum == target) {
            ans.push(path.slice());
            return;
        }
        if (sum > target || i >= n) return;
        // 不选i
        dfs(i + 1, sum, path);
        // 选i
        path.push(candidates[i]);
        dfs(i, sum + candidates[i], path);
        path.pop();
    }
    dfs(0, 0, []);
    return ans;
};
```

#### [17. 电话号码的字母组合](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/description/)

给定一个仅包含数字 `2-9` 的字符串，返回所有它能表示的字母组合。答案可以按 **任意顺序** 返回。

给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。

![](https://pic.leetcode.cn/1752723054-mfIHZs-image.png)

**示例 1：**

```
输入：digits = "23"
输出：["ad","ae","af","bd","be","bf","cd","ce","cf"]
```

**示例 2：**

```
输入：digits = "2"
输出：["a","b","c"]
```

**提示：**

* `1 <= digits.length <= 4`
* `digits[i]` 是范围 `['2', '9']` 的一个数字。

##### 回溯

```js
/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function (digits) {
    const ans = [], n = digits.length;

    const dfs = (i, path) => {
        if (i == n) {
            ans.push(path);
            return;
        }
        for (let s of map[digits[i]]) {
            dfs(i+1, path + s);
        }
    }

    dfs(0, "");
    return ans;
};

const map = {
    2: ["a", "b", "c"],
    3: ["d", "e", "f"],
    4: ["g", "h", "i"],
    5: ["j", "k", "l"],
    6: ["m", "n", "o"],
    7: ["p", "q", "r", "s"],
    8: ["t", "u", "v"],
    9: ["w", "x", "y", "z"],
}
```

#### [78. 子集](https://leetcode.cn/problems/subsets/description/)

给你一个整数数组 `nums` ，数组中的元素 **互不相同** 。返回该数组所有可能的子集（幂集）。

解集 **不能** 包含重复的子集。你可以按 **任意顺序** 返回解集。

**示例 1：**

```
输入：nums = [1,2,3]
输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
```

**示例 2：**

```
输入：nums = [0]
输出：[[],[0]]
```

**提示：**

* `1 <= nums.length <= 10`
* `-10 <= nums[i] <= 10`
* `nums` 中的所有元素 **互不相同**

##### 二进制枚举

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function(nums) {
    const n = nums.length;
    const ans = [], mask = (1 << n) - 1;
    for (let bit = 0; bit <= mask; bit++) {
        const sub = [];
        for (let i = 0; i < n; i++) {
            if ((bit >> i) & 1) {
                sub.push(nums[i]);
            }
        }
        ans.push(sub);
    }
    return ans;
};
```

##### 回溯

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function(nums) {
    const ans = [];
    const n = nums.length, path = [];

    const dfs = (i) => {
        if (i == n) {
            ans.push(path.slice());
            return;
        }
        // 不选第i个数
        dfs(i + 1);
        // 选第i个数
        path.push(nums[i]);
        dfs(i+1);
        path.pop();
    }

    dfs(0);
    return ans;
};
```

#### [46. 全排列](https://leetcode.cn/problems/permutations/description/)

给定一个不含重复数字的数组 `nums` ，返回其 *所有可能的全排列* 。你可以 **按任意顺序** 返回答案。

**示例 1：**

```
输入：nums = [1,2,3]
输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

**示例 2：**

```
输入：nums = [0,1]
输出：[[0,1],[1,0]]
```

**示例 3：**

```
输入：nums = [1]
输出：[[1]]
```

**提示：**

* `1 <= nums.length <= 6`
* `-10 <= nums[i] <= 10`
* `nums` 中的所有整数 **互不相同**

##### 回溯

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function(nums) {
    const ans = [];
    const n = nums.length, vis = Array(n).fill(false);
    const dfs = (path) => {
        if (path.length == n) {
            ans.push([...path]);
            return;
        }
        for (let i = 0; i < n; i++) {
            if (vis[i]) continue;
            vis[i] = true;
            path.push(nums[i]);
            dfs(path);
            path.pop();
            vis[i] = false;
        }
    }
    dfs([]);
    return ans;
};
```

#### [208. 实现 Trie (前缀树)](https://leetcode.cn/problems/implement-trie-prefix-tree/description/)

**[Trie](https://baike.baidu.com/item/字典树/9825209?fr=aladdin)**（发音类似 "try"）或者说 **前缀树** 是一种树形数据结构，用于高效地存储和检索字符串数据集中的键。这一数据结构有相当多的应用情景，例如自动补全和拼写检查。

请你实现 Trie 类：

* `Trie()` 初始化前缀树对象。
* `void insert(String word)` 向前缀树中插入字符串 `word` 。
* `boolean search(String word)` 如果字符串 `word` 在前缀树中，返回 `true`（即，在检索之前已经插入）；否则，返回 `false` 。
* `boolean startsWith(String prefix)` 如果之前已经插入的字符串 `word` 的前缀之一为 `prefix` ，返回 `true` ；否则，返回 `false` 。

**示例：**

```
输入
["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]
输出
[null, null, true, false, true, null, true]

解释
Trie trie = new Trie();
trie.insert("apple");
trie.search("apple");   // 返回 True
trie.search("app");     // 返回 False
trie.startsWith("app"); // 返回 True
trie.insert("app");
trie.search("app");     // 返回 True
```

**提示：**

* `1 <= word.length, prefix.length <= 2000`
* `word` 和 `prefix` 仅由小写英文字母组成
* `insert`、`search` 和 `startsWith` 调用次数 **总计** 不超过 `3 * 104` 次

##### 字典树

```js

var Trie = function () {
    this.tree = new TrieNode();
};

function TrieNode() {
    this.next = Array(26);
    this.end = false;
}

/** 
 * @param {string} word
 * @return {void}
 */
Trie.prototype.insert = function (word) {
    let node = this.tree;
    for (let s of word) {
        let code = s.charCodeAt() - 97;
        if (!node.next[code]) {
            node.next[code] = new TrieNode();
        }
        node = node.next[code];
    }
    node.end = true;
};

/** 
 * @param {string} word
 * @return {boolean}
 */
Trie.prototype.search = function (word) {
    let node = this.tree;
    for (let s of word) {
        let code = s.charCodeAt() - 97;
        if (!node.next[code]) {
            return false;
        }
        node = node.next[code];
    }
    return node.end;
};

/** 
 * @param {string} prefix
 * @return {boolean}
 */
Trie.prototype.startsWith = function (prefix) {
    let node = this.tree;
    for (let s of prefix) {
        let code = s.charCodeAt() - 97;
        if (!node.next[code]) {
            return false;
        }
        node = node.next[code];
    }
    return true;
};

/** 
 * Your Trie object will be instantiated and called as such:
 * var obj = new Trie()
 * obj.insert(word)
 * var param_2 = obj.search(word)
 * var param_3 = obj.startsWith(prefix)
 */
```

#### [1970. 你能穿过矩阵的最后一天](https://leetcode.cn/problems/last-day-where-you-can-still-cross/description/)

给你一个下标从 **1** 开始的二进制矩阵，其中 `0` 表示陆地，`1` 表示水域。同时给你 `row` 和 `col` 分别表示矩阵中行和列的数目。

一开始在第 `0` 天，**整个** 矩阵都是 **陆地** 。但每一天都会有一块新陆地被 **水** 淹没变成水域。给你一个下标从 **1** 开始的二维数组 `cells` ，其中 `cells[i] = [ri, ci]` 表示在第 `i` 天，第 `ri` 行 `ci` 列（下标都是从 **1** 开始）的陆地会变成 **水域** （也就是 `0` 变成 `1` ）。

你想知道从矩阵最 **上面** 一行走到最 **下面** 一行，且只经过陆地格子的 **最后一天** 是哪一天。你可以从最上面一行的 **任意** 格子出发，到达最下面一行的 **任意** 格子。你只能沿着 **四个** 基本方向移动（也就是上下左右）。

请返回只经过陆地格子能从最 **上面** 一行走到最 **下面** 一行的 **最后一天** 。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/07/27/1.png)

```
输入：row = 2, col = 2, cells = [[1,1],[2,1],[1,2],[2,2]]
输出：2
解释：上图描述了矩阵从第 0 天开始是如何变化的。
可以从最上面一行到最下面一行的最后一天是第 2 天。
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2021/07/27/2.png)

```
输入：row = 2, col = 2, cells = [[1,1],[1,2],[2,1],[2,2]]
输出：1
解释：上图描述了矩阵从第 0 天开始是如何变化的。
可以从最上面一行到最下面一行的最后一天是第 1 天。
```

**示例 3：**

![](https://assets.leetcode.com/uploads/2021/07/27/3.png)

```
输入：row = 3, col = 3, cells = [[1,2],[2,1],[3,3],[2,2],[1,1],[1,3],[2,3],[3,2],[3,1]]
输出：3
解释：上图描述了矩阵从第 0 天开始是如何变化的。
可以从最上面一行到最下面一行的最后一天是第 3 天。
```

**提示：**

* `2 <= row, col <= 2 * 104`
* `4 <= row * col <= 2 * 104`
* `cells.length == row * col`
* `1 <= ri <= row`
* `1 <= ci <= col`
* `cells` 中的所有格子坐标都是 **唯一** 的。

##### 时间回溯 + 并查集

```js
/**
 * @param {number} row
 * @param {number} col
 * @param {number[][]} cells
 * @return {number}
 */
var latestDayToCross = function (row, col, cells) {
    const t = cells.length;
    const uf = new UnionFind(t + 2);
    const grid = Array.from({ length: row }, () => Array(col).fill(1));
    for (let i = t - 1; i >= 0; i--) {
        const [r, c] = [cells[i][0] - 1, cells[i][1] - 1];
        const pos = (r) * col + c;
        grid[r][c] = 0;
        for (let [di, dj] of direction) {
            let ni = r + di, nj = c + dj;
            if (nj < 0 || nj >= col) continue;
            if (ni < 0) {
                uf.union(pos, t);
                continue;
            }
            if (ni >= row) {
                uf.union(pos, t + 1);
                continue;
            }
            if (grid[ni][nj] == 0) {
                uf.union(pos, ni * col + nj);
            }
        }
        if (uf.isUnion(t, t + 1)) return i;
    }

};

const direction = [[1, 0], [-1, 0], [0, 1], [0, -1]];

class UnionFind {
    constructor(n) {
        this.fa = Array.from({ length: n }, (_, i) => i);
    }

    find(x) {
        if (x != this.fa[x]) this.fa[x] = this.find(this.fa[x]);
        return this.fa[x];
    }

    isUnion(x, y) {
        let fx = this.find(x), fy = this.find(y);
        return fx == fy;
    }

    union(x, y) {
        let fx = this.find(x), fy = this.find(y);
        if (fx == fy) return false;
        this.fa[fx] = fy;
        return true;
    }
}
```

