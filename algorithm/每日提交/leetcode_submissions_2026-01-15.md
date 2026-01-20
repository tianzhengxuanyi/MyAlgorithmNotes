### 2026-01-15

#### [2943. 最大化网格图中正方形空洞的面积](https://leetcode.cn/problems/maximize-area-of-square-hole-in-grid/description/)

给你两个整数 `n` 和 `m`，以及两个整数数组 `hBars` 和 `vBars`。网格由 `n + 2` 条水平线和 `m + 2` 条竖直线组成，形成 1x1 的单元格。网格中的线条从 `1` 开始编号。

你可以从 `hBars` 中 **删除** 一些水平线条，并从 `vBars` 中删除一些竖直线条。注意，其他线条是固定的，无法删除。

返回一个整数表示移除一些线条（可以不移除任何线条）后，网格中**正方形空洞的最大面积**。

**示例 1：**

![](https://assets.leetcode.com/uploads/2023/11/05/screenshot-from-2023-11-05-22-40-25.png)

**输入:** n = 2, m = 1, hBars = [2,3], vBars = [2]

**输出:** 4

**解释:**

左侧图片展示了网格的初始状态。水平线是 `[1,2,3,4]`，竖直线是 `[1,2,3]`。

构造最大正方形空洞的一种方法是移除水平线 2 和竖直线 2。

**示例 2：**

![](https://assets.leetcode.com/uploads/2023/11/04/screenshot-from-2023-11-04-17-01-02.png)

**输入:** n = 1, m = 1, hBars = [2], vBars = [2]

**输出:** 4

**解释:**

移除水平线 2 和竖直线 2，可以得到最大正方形空洞。

**示例 3：**

![](https://assets.leetcode.com/uploads/2024/03/12/unsaved-image-2.png)

**输入:** n = 2, m = 3, hBars = [2,3], vBars = [2,4]

**输出:** 4

**解释:**

构造最大正方形空洞的一种方法是移除水平线 3 和竖直线 4。

**提示：**

* `1 <= n <= 109`
* `1 <= m <= 109`
* `1 <= hBars.length <= 100`
* `2 <= hBars[i] <= n + 1`
* `1 <= vBars.length <= 100`
* `2 <= vBars[i] <= m + 1`
* `hBars` 中所有值互不相同。
* `vBars` 中所有值互不相同。

##### 请bars中连续的长度：集合

```js
/**
 * @param {number} n
 * @param {number} m
 * @param {number[]} hBars
 * @param {number[]} vBars
 * @return {number}
 */
var maximizeSquareHoleArea = function (n, m, hBars, vBars) {
    const mxW = Math.min(getMaxWidth(hBars), getMaxWidth(vBars))
    return mxW * mxW;
};

function getMaxWidth(bars) {
    const st = new Set(bars);
    let mx = 1;
    for (let x of bars) {
        if (st.has(x - 1)) continue;
        let j = x;
        while (st.has(j + 1)) {
            j++;
        }
        mx = Math.max(j - x + 2, mx);
    }
    return mx;
}
```

##### 求bars中连续的长度：排序

```js
/**
 * @param {number} n
 * @param {number} m
 * @param {number[]} hBars
 * @param {number[]} vBars
 * @return {number}
 */
var maximizeSquareHoleArea = function (n, m, hBars, vBars) {
    const mxW = Math.min(getMaxWidth(hBars), getMaxWidth(vBars))
    return mxW * mxW;
};

function getMaxWidth(bars) {
    bars.sort((a, b) => a - b);
    const n = bars.length;
    let mx = 2, i = 0;
    while (i < n) {
        let j = i;
        while (j < n && bars[j] == bars[j + 1] - 1) {
            j++;
        }
        mx = Math.max(mx, j - i + 2);
        i = j + 1;
    }
    return mx;
}
```

