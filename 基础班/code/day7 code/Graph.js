export function Graph() {
    this.nodes = new Map();
    this.edges = new Set();
}

export function Node(val) {
    this.val = val;
    this.in = 0;
    this.out = 0;
    this.nexts = [];
    this.edges = [];
}

export function Edge(wight, from, to) {
    this.wight = wight;
    this.from = from;
    this.to = to;
}
