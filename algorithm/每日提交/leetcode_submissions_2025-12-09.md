### 2025-12-09

#### [3583. 统计特殊三元组](https://leetcode.cn/problems/count-special-triplets/description/)

给你一个整数数组 `nums`。

**特殊三元组** 定义为满足以下条件的下标三元组 `(i, j, k)`：

* `0 <= i < j < k < n`，其中 `n = nums.length`
* `nums[i] == nums[j] * 2`
* `nums[k] == nums[j] * 2`

返回数组中 **特殊三元组**的总数。

由于答案可能非常大，请返回结果对 `109 + 7` 取余数后的值。

**示例 1：**

**输入：** nums = [6,3,6]

**输出：** 1

**解释：**

唯一的特殊三元组是 `(i, j, k) = (0, 1, 2)`，其中：

* `nums[0] = 6`, `nums[1] = 3`, `nums[2] = 6`
* `nums[0] = nums[1] * 2 = 3 * 2 = 6`
* `nums[2] = nums[1] * 2 = 3 * 2 = 6`

**示例 2：**

**输入：** nums = [0,1,0,0]

**输出：** 1

**解释：**

唯一的特殊三元组是 `(i, j, k) = (0, 2, 3)`，其中：

* `nums[0] = 0`, `nums[2] = 0`, `nums[3] = 0`
* `nums[0] = nums[2] * 2 = 0 * 2 = 0`
* `nums[3] = nums[2] * 2 = 0 * 2 = 0`

**示例 3：**

**输入：** nums = [8,4,2,8,4]

**输出：** 2

**解释：**

共有两个特殊三元组：

* `(i, j, k) = (0, 1, 3)`
  + `nums[0] = 8`, `nums[1] = 4`, `nums[3] = 8`
  + `nums[0] = nums[1] * 2 = 4 * 2 = 8`
  + `nums[3] = nums[1] * 2 = 4 * 2 = 8`
* `(i, j, k) = (1, 2, 4)`
  + `nums[1] = 4`, `nums[2] = 2`, `nums[4] = 4`
  + `nums[1] = nums[2] * 2 = 2 * 2 = 4`
  + `nums[4] = nums[2] * 2 = 2 * 2 = 4`

**提示：**

* `3 <= n == nums.length <= 105`
* `0 <= nums[i] <= 105`

##### 枚举右，一次遍历

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var specialTriplets = function (nums) {
    const cnt1 = new Map(), cnt12 = new Map();
    let ans = 0;
    for (let x of nums) {
        // i < j < k
        // 枚举k,寻找左边(i, j)二元数组
        if (x % 2 == 0) {
            ans = (ans + (cnt12.get(x) ?? 0)) % MOD;
        }
        // 委会(i, j):枚举j,寻找左边(i)
        cnt12.set(2 * x, ((cnt12.get(2 * x) ?? 0) + (cnt1.get(2 * x) ?? 0)) % MOD);
        // 维护i
        cnt1.set(x, ((cnt1.get(x) ?? 0) + 1) % MOD);
    }
    return ans % MOD;
};

const MOD = 1e9 + 7
```

##### 枚举中间

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var specialTriplets = function (nums) {
    const tCnt = new Map();
    for (let x of nums) {
        tCnt.set(x, (tCnt.get(x) ?? 0) + 1);
    }
    const lCnt = new Map();
    let ans = 0;
    for (let x of nums) {
        let target = x * 2;
        // 左侧个数
        let l = lCnt.get(target) ?? 0;
        // x进左侧窗口
        lCnt.set(x, (lCnt.get(x) ?? 0) + 1);
        // 右侧个数
        let r = tCnt.has(target) ? tCnt.get(target) - (lCnt.get(target) ?? 0) : 0;
        ans = (ans + l * r % MOD) % MOD;
    }
    return ans;
};

const MOD = 1e9 + 7;
```

