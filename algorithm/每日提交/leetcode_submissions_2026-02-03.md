### 2026-02-03

#### [31. 下一个排列](https://leetcode.cn/problems/next-permutation/description/)

整数数组的一个 **排列**  就是将其所有成员以序列或线性顺序排列。

* 例如，`arr = [1,2,3]` ，以下这些都可以视作 `arr` 的排列：`[1,2,3]`、`[1,3,2]`、`[3,1,2]`、`[2,3,1]` 。

整数数组的 **下一个排列** 是指其整数的下一个字典序更大的排列。更正式地，如果数组的所有排列根据其字典顺序从小到大排列在一个容器中，那么数组的 **下一个排列** 就是在这个有序容器中排在它后面的那个排列。如果不存在下一个更大的排列，那么这个数组必须重排为字典序最小的排列（即，其元素按升序排列）。

* 例如，`arr = [1,2,3]` 的下一个排列是 `[1,3,2]` 。
* 类似地，`arr = [2,3,1]` 的下一个排列是 `[3,1,2]` 。
* 而 `arr = [3,2,1]` 的下一个排列是 `[1,2,3]` ，因为 `[3,2,1]` 不存在一个字典序更大的排列。

给你一个整数数组 `nums` ，找出 `nums` 的下一个排列。

必须 **[原地](https://baike.baidu.com/item/%E5%8E%9F%E5%9C%B0%E7%AE%97%E6%B3%95)** 修改，只允许使用额外常数空间。

**示例 1：**

```
输入：nums = [1,2,3]
输出：[1,3,2]
```

**示例 2：**

```
输入：nums = [3,2,1]
输出：[1,2,3]
```

**示例 3：**

```
输入：nums = [1,1,5]
输出：[1,5,1]
```

**提示：**

* `1 <= nums.length <= 100`
* `0 <= nums[i] <= 100`

#### [75. 颜色分类](https://leetcode.cn/problems/sort-colors/description/)

给定一个包含红色、白色和蓝色、共 `n`个元素的数组 `nums` ，**[原地](https://baike.baidu.com/item/%E5%8E%9F%E5%9C%B0%E7%AE%97%E6%B3%95)**对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。

我们使用整数 `0`、 `1` 和 `2` 分别表示红色、白色和蓝色。



必须在不使用库内置的 sort 函数的情况下解决这个问题。

**示例 1：**

```
输入：nums = [2,0,2,1,1,0]
输出：[0,0,1,1,2,2]
```

**示例 2：**

```
输入：nums = [2,0,1]
输出：[0,1,2]
```

**提示：**

* `n == nums.length`
* `1 <= n <= 300`
* `nums[i]` 为 `0`、`1` 或 `2`

**进阶：**

* 你能想出一个仅使用常数空间的一趟扫描算法吗？

#### [169. 多数元素](https://leetcode.cn/problems/majority-element/description/)

给定一个大小为 `n`的数组 `nums` ，返回其中的多数元素。多数元素是指在数组中出现次数 **大于** `⌊ n/2 ⌋` 的元素。

你可以假设数组是非空的，并且给定的数组总是存在多数元素。

**示例 1：**

```
输入：nums = [3,2,3]
输出：3
```

**示例 2：**

```
输入：nums = [2,2,1,1,1,2,2]
输出：2
```

**提示：**

* `n == nums.length`
* `1 <= n <= 5 * 104`
* `-109 <= nums[i] <= 109`
* 输入保证数组中一定有一个多数元素。

**进阶：**尝试设计时间复杂度为 O(n)、空间复杂度为 O(1) 的算法解决此问题。

#### [72. 编辑距离](https://leetcode.cn/problems/edit-distance/description/)

给你两个单词 `word1` 和 `word2`， *请返回将 `word1` 转换成 `word2` 所使用的最少操作数*  。

你可以对一个单词进行如下三种操作：

* 插入一个字符
* 删除一个字符
* 替换一个字符

**示例 1：**

```
输入：word1 = "horse", word2 = "ros"
输出：3
解释：
horse -> rorse (将 'h' 替换为 'r')
rorse -> rose (删除 'r')
rose -> ros (删除 'e')
```

**示例 2：**

```
输入：word1 = "intention", word2 = "execution"
输出：5
解释：
intention -> inention (删除 't')
inention -> enention (将 'i' 替换为 'e')
enention -> exention (将 'n' 替换为 'x')
exention -> exection (将 'n' 替换为 'c')
exection -> execution (插入 'u')
```

**提示：**

* `0 <= word1.length, word2.length <= 500`
* `word1` 和 `word2` 由小写英文字母组成

#### [3637. 三段式数组 I](https://leetcode.cn/problems/trionic-array-i/description/)

给你一个长度为 `n` 的整数数组 `nums`。

如果存在索引 `0 < p < q < n − 1`，使得数组满足以下条件，则称其为 **三段式数组（trionic）**：

* `nums[0...p]` **严格** 递增，
* `nums[p...q]` **严格** 递减，
* `nums[q...n − 1]` **严格** 递增。

如果 `nums` 是三段式数组，返回 `true`；否则，返回 `false`。

**示例 1:**

**输入:** nums = [1,3,5,4,2,6]

**输出:** true

**解释:**

选择 `p = 2`, `q = 4`：

* `nums[0...2] = [1, 3, 5]` 严格递增 (`1 < 3 < 5`)。
* `nums[2...4] = [5, 4, 2]` 严格递减 (`5 > 4 > 2`)。
* `nums[4...5] = [2, 6]` 严格递增 (`2 < 6`)。

**示例 2:**

**输入:** nums = [2,1,3]

**输出:** false

**解释:**

无法选出能使数组满足三段式要求的 `p` 和 `q` 。

**提示:**

* `3 <= n <= 100`
* `-1000 <= nums[i] <= 1000`

##### 统计拐点数量

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var isTrionic = function(nums) {
    if (nums[1] <= nums[0]) return false;
    let increase = true;
    let cnt = 1;
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] == nums[i - 1]) return false;
        if ((increase && nums[i] <= nums[i - 1]) || (!increase && nums[i] >= nums[i - 1])) {
            increase = !increase;
            cnt++;
        }
    }
    return cnt == 3;
};

```

