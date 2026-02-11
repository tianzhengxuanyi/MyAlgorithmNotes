/**
 * 线段树（Segment Tree）实现
 * 用于高效处理区间查询和单点更新操作
 * 时间复杂度：
 *   - 构建：O(n)
 *   - 查询：O(log n)
 *   - 更新：O(log n)
 */
class SegmentTree {
    /**
     * 构造函数
     * @param {Array} arr - 原始数组
     * 时间复杂度：O(n)
     */
    constructor(arr) {
        this.arr = arr; // 原始数组
        this.n = arr.length; // 数组长度
        // 计算线段树大小：2 * 2^ceil(log2(n))，确保足够存储
        this.tree = Array(2 << (32 - Math.clz32(this.n - 1))).fill(0);
        // 构建线段树，从根节点（索引1）开始，区间[0, n-1]
        this.build(1, 0, this.n - 1);
    }

    /**
     * 构建线段树（递归方法）
     * @param {number} o - 当前节点在数组中的索引（从1开始）
     * @param {number} l - 当前节点表示的区间左边界
     * @param {number} r - 当前节点表示的区间右边界
     * 时间复杂度：O(n)
     */
    build(o, l, r) {
        // 递归终止条件：叶子节点（区间长度为1）
        if (l === r) {
            this.tree[o] = this.arr[l]; // 叶子节点直接存储数组元素值
            return;
        }
        
        // 计算区间中点（使用位运算优化除法）
        const m = l + ((r - l) >> 1);
        
        // 递归构建左子树（区间[l, m]）
        this.build(o * 2, l, m);
        // 递归构建右子树（区间[m+1, r]）
        this.build(o * 2 + 1, m + 1, r);
        
        // 维护当前节点的值（根据左右子树的值计算）
        this.maintain(o);
    }

    /**
     * 更新数组指定位置的元素值
     * @param {number} i - 要更新的数组索引
     * @param {number} val - 新的值
     * 时间复杂度：O(log n)
     */
    update(i, val) {
        this._update(1, 0, this.n - 1, i, val);
    }

    /**
     * 查询区间[ql, qr]的聚合值
     * @param {number} ql - 查询区间左边界
     * @param {number} qr - 查询区间右边界
     * @returns {number} 区间聚合值
     * 时间复杂度：O(log n)
     */
    query(ql, qr) {
        return this._query(1, 0, this.n - 1, ql, qr);
    }

    /**
     * 维护节点值（根据左右子节点计算当前节点值）
     * @param {number} o - 节点索引
     * 时间复杂度：O(1)
     */
    maintain(o) {
        this.tree[o] = this.mergeVal(this.tree[o * 2], this.tree[o * 2 + 1]);
    }

    /**
     * 合并两个值的函数（可重写以支持不同操作）
     * @param {number} a - 第一个值
     * @param {number} b - 第二个值
     * @returns {number} 合并后的值
     * 时间复杂度：O(1)
     */
    mergeVal(a, b) {
        return Math.max(a, b); // 根据题目需求修改合并函数（最大值、最小值、求和等）
    }

    /**
     * 内部更新方法（递归实现）
     * @param {number} o - 当前节点索引
     * @param {number} l - 当前节点区间左边界
     * @param {number} r - 当前节点区间右边界
     * @param {number} i - 要更新的数组索引
     * @param {number} val - 新的值
     * 时间复杂度：O(log n)
     */
    _update(o, l, r, i, val) {
        // 到达叶子节点，直接更新
        if (l == r) {
            this.tree[o] = val;
            return;
        }
        
        // 计算中点，决定向左子树还是右子树递归
        const m = l + ((r - l) >> 1);
        if (i <= m) {
            this._update(o * 2, l, m, i, val); // 目标在左子树
        } else {
            this._update(o * 2 + 1, m + 1, r, i, val); // 目标在右子树
        }
        
        // 更新后维护当前节点的值
        this.maintain(o);
    }

    /**
     * 内部查询方法（递归实现）
     * @param {number} o - 当前节点索引
     * @param {number} l - 当前节点区间左边界
     * @param {number} r - 当前节点区间右边界
     * @param {number} ql - 查询区间左边界
     * @param {number} qr - 查询区间右边界
     * @returns {number} 区间聚合值
     * 时间复杂度：O(log n)
     */
    _query(o, l, r, ql, qr) {
        // 完全包含：当前节点区间完全在查询区间内，直接返回节点值
        if (ql <= l && r <= qr) {
            return this.tree[o];
        }
        
        const m = l + ((r - l) >> 1);
        
        // 查询区间完全在左子树
        if (qr <= m) {
            return this._query(o * 2, l, m, ql, qr);
        }
        
        // 查询区间完全在右子树
        if (ql >= m + 1) {
            return this._query(o * 2 + 1, m + 1, r, ql, qr);
        }
        
        // 查询区间跨越左右子树，需要合并结果
        return this.mergeVal(
            this._query(o * 2, l, m, ql, qr),      // 左子树查询结果
            this._query(o * 2 + 1, m + 1, r, ql, qr) // 右子树查询结果
        );
    }
}