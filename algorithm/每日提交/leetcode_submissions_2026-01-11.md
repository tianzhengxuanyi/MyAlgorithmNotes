### 2026-01-11

#### [85. 最大矩形](https://leetcode.cn/problems/maximal-rectangle/description/)

给定一个仅包含 `0` 和 `1` 、大小为 `rows x cols` 的二维二进制矩阵，找出只包含 `1` 的最大矩形，并返回其面积。

**示例 1：**

![](https://pic.leetcode.cn/1722912576-boIxpm-image.png)

```
输入：matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]
输出：6
解释：最大矩形如上图所示。
```

**示例 2：**

```
输入：matrix = [["0"]]
输出：0
```

**示例 3：**

```
输入：matrix = [["1"]]
输出：1
```

**提示：**

* `rows == matrix.length`
* `cols == matrix[0].length`
* `1 <= rows, cols <= 200`
* `matrix[i][j]` 为 `'0'` 或 `'1'`

##### 单调栈

```js
/**
 * @param {character[][]} matrix
 * @return {number}
 */
var maximalRectangle = function(matrix) {
    const m = matrix.length, n = matrix[0].length;
    const height = Array(n).fill(0);
    height.push(-1);
    let ans = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] == 0) {
                height[j] = 0;
            } else {
                height[j] += 1;
            }
        }
        ans = Math.max(ans, largestRectangleArea(height));
    }
    return ans;
};

function largestRectangleArea(heights) {
    const n = heights.length;
    const st = [-1];
    let ans = 0;
    for (let i = 0; i < n; i++) {
        while (st.length && heights[i] <= heights[st[st.length - 1]]) {
            let j = st.pop();
            ans = Math.max(ans, heights[j] * (i - st[st.length - 1] - 1));
        }
        st.push(i);
    }
    return ans;
}
```

