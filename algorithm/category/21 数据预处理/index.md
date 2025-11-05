
### 题目三（预处理数据）

牛牛有一些排成一行的正方形。每个正方形已经被染成红色或者绿色。牛牛现在可以选择任意一个正方形然后用这两种颜色的任意一种进行染色,这个正方形的颜色将会被覆盖。牛牛的目标是在完成染色之后,每个红色 R 都比每个绿色 G 距离最左侧近。牛牛想知道他最少需要涂染几个正方形。

如样例所示: s = RGRGR。我们涂染之后变成 RRRGG 满足要求了,涂染的个数为 2,没有比这个更好的涂染方案。

**思路1：**

1. 将字符串转成数组；
2. 遍历数组，以当前下标i为分界，分成左边和右边；
3. 左边的全部染成R，右边的染成G。遍历0~i-1统计有多少G需要染成R，i~n有多少R需要染成G，两者相加则是以当前下标i为界的结果；
4. 遍历完成返回最小值；

```js
function colorLeftRight(s) {
    // 字符串转成数组
    const arr = s.split("");
    let res = Infinity;
    for (let i = 0; i < arr.length; i++) {
        let temp = 0;
        // 0~i-1统计有多少G需要染成R
        for (let left = 0; left < i; left++) {
            if (arr[left] === "G") {
                temp++;
            }
        }
        // i~n有多少R需要染成G
        for (let right = i; right < arr.length; right++) {
            if (arr[right] === "R") {
                temp++;
            }
        }
        // 返回较小值
        res = Math.min(temp, res);
    }
    return res;
}
```

**思路2：（预处理）**

1. 生成两个数组分别记录以当前下标i为界左边有多少个G，右边有多少个R；
2. 统计有多少G需要染成R（R需要染成G）直接查找数组，减少遍历的时间复杂度；

```js
function colorLeftRight2(s) {
    const arr = s.split("");
    let res = Infinity;
    // 记录0~i范围内有多少个R
    let leftGList = [];
    let rightRList = [];
    // 包括i
    leftGList[0] = arr[0] === "G" ? 1 : 0;
    // 不包括i
    rightRList[arr.length - 1] = 0;
    for (let i = 1; i < arr.length; i++) {
        leftGList[i] = arr[i] === "G" ? leftGList[i - 1] + 1 : leftGList[i - 1];
    }
    for (let i = arr.length - 2; i >= 0; i--) {
        rightRList[i] =
            arr[i + 1] === "R" ? rightRList[i + 1] + 1 : rightRList[i + 1];
    }
    for (let i = 0; i < arr.length - 1; i++) {
        let temp = leftGList[i] + rightRList[i];
        res = Math.min(temp, res);
    }
    return res;
}
```

### 题目四（预处理）

给定一个 N*N 的矩阵 matrix，只有 0 和 1 两种值，返回边框全是 1 的最大正方形的边
长长度。
例如:
```
01111
01001
01001
01111
01011
```
其中边框全是 1 的最大正方形的大小为 4*4，所以返回 4。

**思路1：**

1. 遍历整个矩阵，假设当前位置为（i，j）；
2. 遍历所有可能的border形成以当前位置为左上角点的正方形；
3. 遍历正方形的四条边，判断是否都是1；
4. 返回最大的border；
5. 时间复杂度O(n^4)

```js
function maxOneBorderSize(matrix) {
    let res = 0;
    let N = matrix.length;
    // 遍历矩阵
    for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
            // 遍历可能的border
            for (let border = 1; row + border - 1 < N && col + border - 1 < N; border++) {
                let flag = true;
                // 上
                for (let i = col; i <= col + border - 1; i++) {
                    if (matrix[row][i] === 0) {
                        flag = false
                        break
                    }
                }
                // 下
                for (let i = col; i <= col + border - 1; i++) {
                    if (matrix[row+border-1][i] === 0) {
                        flag = false
                        break
                    }
                }
                // 左
                for (let i = row; i <= row + border - 1; i++) {
                    if (matrix[i][col] === 0) {
                        flag = false
                        break
                    }
                }
                // 右
                for (let i = row; i <= row + border - 1; i++) {
                    if (matrix[i][col+border-1] === 0) {
                        flag = false
                        break
                    }
                }
                if (flag) {
                    res = Math.max(res, border)
                }
            }
        }
    }
    return res;
}
```

**思路2：（预处理）**

1. 用两个N*N的矩阵right和down分别记录从当前位置（i，j）往右和往下所连续1的个数（包含i和j位置）；
2. 判断正方形边是否都是1时，从顶点处获取right和down中值，判断是否大于等于border，如果是则表明边上都是1；
3. 时间复杂度O(n^3)

```js
function maxOneBorderSize2(matrix) {
    let res = 0;
    const N = matrix.length;
    const right = new Array(N);
    for (let i = 0; i < N; i++) {
        right[i] = new Array(N);
        for (let j = N - 1; j >= 0; j--) {
            if (j === N - 1) {
                right[i][j] = matrix[i][j]
            } else {
                right[i][j] = matrix[i][j] === 0 ? 0 : matrix[i][j] + right[i][j+1]
            }
        }
    }
    const down = new Array(N);
    for (let i = 0; i < N; i++) {
        down[i] = new Array(N);
    }
    for (let j = 0; j < N; j++) {
        for (let i = N - 1; i >= 0; i--) {
            if (i === N - 1) {
                down[i][j] = matrix[i][j]
            } else {
                down[i][j] = matrix[i][j] === 0 ? 0 : matrix[i][j] + down[i+1][j]
            }
        }
    }
    
    // 遍历矩阵
    for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
            // 遍历border
            for (let border = 1; row + border - 1 < N && col + border - 1 < N; border++) {
                // 判断边是否为1
                if (
                    right[row][col] < border || 
                    right[row + border - 1][col] < border || 
                    down[row][col] < border || 
                    down[row][col + border - 1] < border) {
                    continue;
                }
                res = Math.max(res, border);
            }
        }
    }
    return res;
}
```