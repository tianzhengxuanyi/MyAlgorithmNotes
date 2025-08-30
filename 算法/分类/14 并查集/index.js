function countIslands(matrix) {
    if (matrix === null || matrix[0] === null) {
        return 0;
    }
    const n = matrix.length;
    const m = matrix[0].length;
    let res = 0;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            if (matrix[i][j] === 1) {
                infect(matrix, i, j, n, m);
                res++;
            }
        }
    }
    return res;
}

function infect(matrix, i, j, n, m) {
    if (i < 0 || i >= n || j < 0 || j >= m || matrix[i][j] !== 1) {
        return;
    }
    matrix[i][j] = 2;
    infect(matrix, i - 1, j, n, m);
    infect(matrix, i + 1, j, n, m);
    infect(matrix, i, j - 1, n, m);
    infect(matrix, i, j + 1, n, m);
}

const matrix = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0, 0, 0, 1, 0],
    [0, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

console.log(countIslands(matrix));

class Element {
    constructor(value) {
        this.value = value;
    }
}

class UnionFindSet {
    constructor(arr) {
        this.elementMap = new Map();
        this.fatherMap = new Map();
        this.rankMap = new Map();

        for (let item of arr) {
            let element = new Element(item);
            this.elementMap.set(item, element);
            this.fatherMap.set(element, element);
            this.rankMap.set(element, 1);
        }
    }

    findHead(el) {
        const stack = [];
        while (el !== this.fatherMap.get(el)) {
            stack.push(el);
            el = this.fatherMap.get(el);
        }

        while (stack.length > 0) {
            this.fatherMap.set(stack.pop(), el);
        }
        return el;
    }

    isSameSet(a, b) {
        if (!this.elementMap.has(a) || !this.elementMap.has(b)) {
            return false;
        }
        const father1 = this.fatherMap(this.elementMap.get(a));
        const father2 = this.fatherMap(this.elementMap.get(b));

        return father1 === father2;
    }

    union(a, b) {
        if (!this.elementMap.has(a) || !this.elementMap.has(b)) {
            return;
        }
        const father1 = this.fatherMap(this.elementMap.get(a));
        const father2 = this.fatherMap(this.elementMap.get(b));
        const rank1 = this.rankMap(father1);
        const rank2 = this.rankMap(father2);

        let maxRank = rank1 > rank2 ? father1 : father2;
        let minRank = rank1 <= rank2 ? father1 : father2;

        this.fatherMap.set(minRank, maxRank);
        this.rankMap(maxRank, rank1 + rank2);
        this.rankMap.delete(minRank);
    }
}
