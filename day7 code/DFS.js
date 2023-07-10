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

let edge1 = new Edge(3, node1, node2);
let edge2 = new Edge(4, node1, node3);
let edge3 = new Edge(8, node3, node2);
let edge4 = new Edge(1, node2, node4);
let edge5 = new Edge(6, node4, node6);
let edge6 = new Edge(7, node6, node5);
let edge7 = new Edge(5, node5, node3);

node1.in = 0;
node1.out = 2;
node1.nexts.push(node2);
node1.nexts.push(node3);
node1.edges.push(edge1);
node1.edges.push(edge2);

node2.in = 2;
node2.out = 1;
node2.nexts.push(node4);
node2.edges.push(edge4);

node3.in = 2;
node3.out = 1;
node3.nexts.push(node2);
node3.edges.push(edge3);

node4.in = 1;
node4.out = 1;
node4.nexts.push(node6);
node4.edges.push(edge5);

node5.in = 1;
node5.out = 1;
node5.nexts.push(node3);
node5.edges.push(edge7);

node6.in = 1;
node6.out = 1;
node6.nexts.push(node5);
node6.edges.push(edge6);

G.nodes.set(1, node1);
G.nodes.set(2, node2);
G.nodes.set(3, node3);
G.nodes.set(4, node4);
G.nodes.set(5, node5);
G.nodes.set(6, node6);

G.edges.add(edge1);
G.edges.add(edge2);
G.edges.add(edge3);
G.edges.add(edge4);
G.edges.add(edge5);
G.edges.add(edge6);
G.edges.add(edge7);

// console.log(G);

function dfs(node) {
    if (node === null) return null;

    let stack = [];
    let set = new Set();
    stack.push(node);
    set.add(node);
    let curr = node;

    console.log('dfs',curr.val, curr.nexts);
    while (stack.length !== 0) {
        curr = stack.pop();
        
        for (let next of curr.nexts) {
            if (!set.has(next)) {
                // 将当前节点和下个节点都压回栈中
                stack.push(curr);
                stack.push(next);
                set.add(next);
                console.log(next.val);
                break;
            }
        }
    }
}

dfs(node1)