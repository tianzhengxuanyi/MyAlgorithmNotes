function Graph() {
    this.nodes = new Map();
    this.edges = new Set();
}

function Node(val) {
    this.val = val;
    this.in = 0;
    this.out = 0;
    this.nexts = [];
    this.edges = [];
}

function Edge(wight, from, to) {
    this.wight = wight;
    this.from = from;
    this.to = to;
}

const G = new Graph();
G.nodes;

let node1 = new Node(1);

let node2 = new Node(2);
let node3 = new Node(3);
let node4 = new Node(4);
let node5 = new Node(5);
let node6 = new Node(6);
let node7 = new Node(7);

let edge1 = new Edge(12, node1, node2);
let edge2 = new Edge(13, node1, node3);
let edge3 = new Edge(24, node2, node4);
let edge4 = new Edge(46, node4, node6);
let edge5 = new Edge(35, node3, node5);
let edge6 = new Edge(37, node3, node7);

node1.in = 0;
node1.out = 2;
node1.nexts.push(node2);
node1.nexts.push(node3);
node1.edges.push(edge1);
node1.edges.push(edge2);

node2.in = 1;
node2.out = 1;
node2.nexts.push(node4);
node2.edges.push(edge3);

node3.in = 1;
node3.out = 2;
node3.nexts.push(node5);
node3.nexts.push(node7);
node3.edges.push(edge5);
node3.edges.push(edge6);

node4.in = 1;
node4.out = 1;
node4.nexts.push(node6);
node4.edges.push(edge4);

node5.in = 1;
node5.out = 0;

node6.in = 1;
node6.out = 0;

node7.in = 1;
node7.out = 0;

G.nodes.set(1, node1);
G.nodes.set(2, node2);
G.nodes.set(3, node3);
G.nodes.set(4, node4);
G.nodes.set(5, node5);
G.nodes.set(6, node6);
G.nodes.set(7, node7);

G.edges.add(edge1);
G.edges.add(edge2);
G.edges.add(edge3);
G.edges.add(edge4);
G.edges.add(edge5);
G.edges.add(edge6);

function sortedTopology(G) {
    let hashMap = new Map();
    let queen = [];
    // 将全部节点加入hashMap并记录节点入度，如果节点入度为0加入队列中
    for (let node of G.nodes.values()) {
        hashMap.set(node, node.in);
        if (node.in === 0) {
            queen.push(node);
        }
    }

    let result = [];
    let curr;
    while (queen.length !== 0) {
        curr = queen.shift();
        result.push(curr);

        for (let next of curr.nexts) {
            hashMap.set(next, hashMap.get(next) - 1);
            console.log(next, hashMap.get(next))
            if (hashMap.get(next) === 0) {
                queen.push(next);
            }
        }
    }
    return result;
}

console.log(sortedTopology(G))
