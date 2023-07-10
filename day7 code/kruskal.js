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

function Edge(weight, from, to) {
    this.weight = weight;
    this.from = from;
    this.to = to;
}


const G = new Graph();

let node1 = new Node(1);

let node2 = new Node(2);
let node3 = new Node(3);
let node4 = new Node(4);
let node5 = new Node(5);


let edge1 = new Edge(7, node1, node2);
let edge2 = new Edge(2, node1, node3);
let edge3 = new Edge(100, node1, node4);
let edge4 = new Edge(4, node3, node4);
let edge5 = new Edge(1000, node2, node4);
let edge6 = new Edge(10000, node2, node5);

node1.nexts.push(node2);
node1.nexts.push(node3);
node1.nexts.push(node4);
node1.edges.push(edge1);
node1.edges.push(edge2);
node1.edges.push(edge3);

node2.nexts.push(node4);
node2.nexts.push(node5);
node2.edges.push(edge5);
node2.edges.push(edge6);

node3.nexts.push(node4);
node3.edges.push(edge4);


G.nodes.set(1, node1);
G.nodes.set(2, node2);
G.nodes.set(3, node3);
G.nodes.set(4, node4);
G.nodes.set(5, node5);


G.edges.add(edge1);
G.edges.add(edge2);
G.edges.add(edge3);
G.edges.add(edge4);
G.edges.add(edge5);
G.edges.add(edge6);



class MySets {
    constructor(graph) {
        this.graph = graph;
        this.nodes = graph.nodes;
        this.setMap = new Map();
        this.mySets(this.nodes);
    }
    mySets(nodes) {
        for (let node of nodes.values()) {
            let set = new Set();
            set.add(node);
            this.setMap.set(node, set);
        }
    }
    isSameSet(from, to) {
        let fromSet = this.setMap.get(from);
        let toSet = this.setMap.get(to);
        return fromSet === toSet;
    }
    union(from, to) {
        let fromSet = this.setMap.get(from);
        let toSet = this.setMap.get(to);
        for (let node of toSet) {
            fromSet.add(node);

            this.setMap.set(node, fromSet);
        }
    }
}

function kruskalMST(graph) {
    let unionFind = new MySets(graph)

    let queue = []
    for (let edge of graph.edges) {
        queue.push(edge)
    }
    queue.sort((a, b) =>  a.weight - b.weight)
    // console.log(queue)
    let result = new Set()
    for (let edge of queue) {
        let fromNode = edge.from
        let toNode = edge.to
        if (!unionFind.isSameSet(fromNode, toNode)) {
            result.add(edge)
            unionFind.union(fromNode, toNode)
        }
    }

    return result
}

console.log(kruskalMST(G))

