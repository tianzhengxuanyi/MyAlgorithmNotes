class Node {
    constructor(val, todo) {
        this.val = val;
        this.todo = todo;
    }
}

class LazySegmentTree {
    TODO_INIT = 0;

    constructor(arr) {
        this.arr = arr;
        this.n = arr.length;
        this.tree = Array(2 << (32 - Math.clz32(this.n - 1))).fill(0);
        this.build(1, 0, this.n - 1);
    }

    build(o, l, r) {
        this.tree[o] = new Node();
        this.tree[o].todo = this.TODO_INIT;
        if (l == r) {
            this.tree[o].val = this.arr[l];
            return;
        }
        const m = l + ((r - l) >> 1);
        this.build(2 * o, l, m);
        this.build(2 * o + 1, m + 1, r);
        this.maintain(o);
    }

    apply(o, l, r, todo) {
        let cur = this.tree[o];
        cur.val += todo * (r - l + 1); // 根据题意修改
        cur.todo = this.mergeTodo(todo, cur.todo);
    }

    spread(o, l, r) {
        let todo = this.tree[o].todo;
        if (todo == this.TODO_INIT) {
            return;
        }
        const m = l + ((r - l) >> 2);
        this.apply(2 * o, l, m, todo);
        this.apply(2 * o + 1, m + 1, r, todo);
        this.tree[o].todo = this.TODO_INIT;
    }

    update(i, val) {
        return this._update(1, 0, this.n - 1, i, val);
    }

    query(ql, qr) {
        return this._query(1, 0, this.n - 1, ql, qr);
    }

    maintain(o) {
        this.tree[o].val = this.mergeVal(this.tree[2 * o].val, this.tree[2 * o + 1].val);
    }

    mergeVal(a, b) {
        return a + b; // 根据题意修改
    }

    mergeTodo(a, b) {
        return a + b; // 根据题意修改
    }

    _update(o, l, r, i, val) {
        if (l == r) {
            this.apply(o, l, r, val);
            return;
        }
        this.spread(o, l, r);
        const m = l + ((r - l) >> 1);
        if (i <= m) {
            this._update(2 * o, l, m, i, val);
        } else {
            this._update(2 * o + 1, m + 1, r, i, val);
        }
        this.maintain(o);
    }

    _query(o, l, r, ql, qr) {
        if (ql <= l && qr >= r) {
            return this.tree[o].val;
        }
        this.spread(o, l, r);
        const m = l + ((r - l) >> 1);
        if (qr <= m) {
            return this._query(2 * o, l, m, ql, qr);
        }
        if (ql >= m + 1) {
            return this._query(2 * o + 1, m + 1, r, ql, qr);
        }

        return this.mergeVal(
            this._query(2 * o, l, m, ql, qr),
            this._query(2 * o + 1, m + 1, r, ql, qr),
        );
    }
}
