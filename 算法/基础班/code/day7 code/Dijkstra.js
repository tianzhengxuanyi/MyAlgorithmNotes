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

// function dijkstra(head) {
//     let hashMap = new Map();
//     let hashSet = new Set();

//     hashMap.set(head, 0);
//     let minNode = getMinDistanceAndUmSelectNode(hashMap, hashSet);
//     while (minNode !== null) {
//         let currDistance = hashMap.get(minNode);

//         let edges = minNode.edges;
//         for (let edge of edges) {
//             if (!hashMap.has(edge.to)) {
//                 hashMap.set(edge.to, currDistance + edge.weight);
//             }

//             let distance = hashMap.get(edge.to);
//             hashMap.set(edge.to, Math.min(distance, currDistance + edge.weight));
//         }
//         hashSet.add(minNode)
//         minNode = getMinDistanceAndUmSelectNode(hashMap, hashSet)
//     }
//     return hashMap;
// }

// function getMinDistanceAndUmSelectNode(hashMap, hashSet) {
//     let minDistance = Infinity;
//     let minNode = null;

//     for (let node of hashMap.keys()) {
//         if (hashMap.get(node) < minDistance && !hashSet.has(node)) {
//             minNode = node;
//         }
//     }

//     return minNode;
// }

function dijkstra(head) {
    // 记录节点和最小路径
    let hashMap = new Map();
    // 记录锁定的节点
    let hashSet = new Set();
    hashMap.set(head, 0);

    let curr = head;

    while (curr) {
        let distance =hashMap.get(curr)
        for (let edge of curr.edges) {
            let toNode = edge.to
            // 未加入map，此时路径为无穷大
            if (!hashMap.has(toNode)) {
                hashMap.set(toNode, distance + edge.weight)
            } else {
                hashMap.set(toNode, Math.min(distance + edge.weight, hashMap.get(toNode)))
            }
        }
        hashSet.add(curr)
        curr = getMinDistanceAndUnSelectNode(hashMap, hashSet)
    }

    return hashMap;
}

function getMinDistanceAndUnSelectNode(hashMap, hashSet) {
    let minDistance = Infinity;
    let minNode;

    for (let node of hashMap.keys()) {
        if (!hashSet.has(node) && hashMap.get(node) < minDistance) {
            minNode = node;
            minDistance = hashMap.get(node)
        }
    }

    return minNode;
}

class NodeRecord {
    constructor(node, distance) {
        this.node = node;
        this.distance = distance;
    }
}
// 小根堆
class Heap {
    constructor() {
        this.heap = []
        // 记录节点在heap中的index
        this.heapIndexMap = new Map();
        // 记录节点的distance
        this.distanceMap =  new Map();
    }
    addOrUpdateOrIgore(node, distance) {
        if (this.inHeap(node)) {
            this.distanceMap.set(node, Math.min(this.distanceMap.get(node), distance))
            this.insertHeapify(node, this.heapIndexMap.get(node))
        }
        if (!this.isEntered(node)) {
            this.heap.push(node)
            this.heapIndexMap.set(node, this.size()-1)
            this.distanceMap.set(node, distance)
            this.insertHeapify(node, this.size()-1)
        }
    }
    pop() {
        this.swap(0, this.size() - 1)
        let node = this.heap.pop()
        let nodeRecord = new NodeRecord(node, this.distanceMap.get(node))
        this.heapIndexMap.set(node, -1)
        this.heapify(0, this.size())
        return nodeRecord
    }
    // 在指定位置插入时向上调整
    insertHeapify(node, index) {
        while (this.distanceMap.get(node) < this.distanceMap.get(this.heap[(index-1)>>1])) {
            this.swap(index, (index - 1) >> 1)
            index = (index - 1) >> 1
        }
    }
    // 向下调整
    heapify(index, size) {
        let left = index * 2 + 1
        while (left < size) {
            let minIndex = left + 1 < size && this.distanceMap.get(this.heap[left+1]) < this.distanceMap.get(this.heap[left]) ? left + 1 : left
            if (this.distanceMap.get(this.heap[index]) > this.distanceMap.get(this.heap[minIndex])) {
                break
            }
            this.swap(index, minIndex)
            index = minIndex
            left = index * 2 + 1
        }
    }
    // heap的长度
    size() {
        return this.heap.length
    }
    // heap是否为空
    isEmpty() {
        return this.heap.length === 0
    }
    // 节点是否进入过heap
    isEntered(node) {
        return this.heapIndexMap.has(node)
    }
    // 节点是否在heap上
    inHeap(node) {
        return this.heapIndexMap.has(node) && this.heapIndexMap.get(node) !== -1
    }
    swap(i, j) {
        // 交换heapIndexMap中记录的节点位置
        this.heapIndexMap.set(this.heap[i], j)
        this.heapIndexMap.set(this.heap[j], i)
        // 交换heap中的记录
        let temp = this.heap[i]
        this.heap[i] = this.heap[j]
        this.heap[j] = temp
        // [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]

    }
}

function dijkstra2(node) {
    let heap = new Heap();
    heap.addOrUpdateOrIgore(node, 0)

    let result = new Map()
    while (!heap.isEmpty()) {
        let curr = heap.pop()
        console.log(curr, 'curr')
        let node = curr.node
        let distance = curr.distance
        for (let edge of node.edges) {
            heap.addOrUpdateOrIgore(edge.to, edge.weight + distance)
        }
        result.set(node, distance)
    }
    return result
}
console.log('dijkstra',dijkstra(node1));
console.log('dijkstra2',dijkstra2(node1));
