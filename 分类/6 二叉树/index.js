function Node(value, left, right) {
    this.value = value;
    this.left = typeof left === "undefined" ? null : left;
    this.right = typeof left === "undefined" ? null : right;
}

let head = new Node(1);
head.left = new Node(2);
head.left.left = new Node(4);
head.left.left.left = new Node(7);
head.left.left.right = new Node(8);
head.left.right = new Node(5);
head.left.right.left = new Node(9);
head.left.right.right = new Node(10);
head.right = new Node(3);
head.right.right = new Node(6);

function getMaxDistance(head) {
    // 返回值结构
    function Info(maxDistance, height) {
        this.maxDistance = maxDistance;
        this.height = height;
    }
    // base case
    if (head === null) {
        return new Info(0, 0);
    }
    const { maxDistance: leftDistance, height: leftHeight } = getMaxDistance(
        head.left
    );
    const { maxDistance: rightDistance, height: rightHeight } = getMaxDistance(
        head.right
    );

    let height = Math.max(leftHeight, rightHeight) + 1;
    let maxDistance = Math.max(
        leftHeight + rightHeight + 1,
        Math.max(leftDistance, rightDistance)
    );

    return new Info(maxDistance, height);
}

console.log(getMaxDistance(head));

function Employee(happy) {
    this.happy = happy;
    this.subordinates = [];
}

let employer = new Employee(10);
let employee1 = new Employee(2);
employee1.subordinates.push(new Employee(20));
let employee2 = new Employee(4);
employee2.subordinates.push(new Employee(2));
let employee3 = new Employee(5);
employee3.subordinates.push(new Employee(60));
employer.subordinates.push(employee1);
employer.subordinates.push(employee2);
employer.subordinates.push(employee3);

// console.log(employer, employee1, employee2, employee3)

function getMaxHappiness(head) {
    function Info(headNotIn, headIn) {
        // headNotIn: 头节点不参与整个树的最大快乐值
        // headIn: 头节点参与整个树的最大快乐值
        this.headNotIn = headNotIn;
        this.headIn = headIn;
    }
    function process(head) {
        if (head === null) {
            return new Info(0, 0);
        }

        let headNotInMaxHappiness = 0,
            headInMaxHappiness = head.happy;

        for (let i = 0; i < head.subordinates.length; i++) {
            const { headNotIn, headIn } = process(head.subordinates[i]);
            headNotInMaxHappiness += Math.max(headNotIn, headIn);
            headInMaxHappiness += headNotIn;
        }

        return new Info(headNotInMaxHappiness, headInMaxHappiness);
    }

    const { headNotIn, headIn } = process(head);

    return Math.max(headNotIn, headIn);
}

console.log(getMaxHappiness(employer));

function morris(head) {
    if (head === null) {
        return;
    }
    let cur = head;
    let mostRight = null;

    while (cur !== null) {
        // morris序
        console.log(cur.value);
        mostRight = cur.left;
        if (mostRight !== null) {
            // cur有左孩子

            // 找到左孩子的最右节点
            while (mostRight.right !== null && mostRight.right !== cur) {
                mostRight = mostRight.right;
            }

            if (mostRight.right === null) {
                // 第一次经过cur
                mostRight.right = cur;
                cur = cur.left;
            } else {
                // 第二次经过cur
                mostRight.right = null;
                cur = cur.right;
            }
        } else {
            // cur没有左孩子
            cur = cur.right;
        }
    }
}

// 前序
function morrisPre(head) {
    if (head === null) {
        return;
    }
    let cur = head;
    let mostRight = null;

    while (cur !== null) {
        mostRight = cur.left;
        if (mostRight !== null) {
            // cur有左孩子

            // 找到左孩子的最右节点
            while (mostRight.right !== null && mostRight.right !== cur) {
                mostRight = mostRight.right;
            }

            if (mostRight.right === null) {
                // 第一次经过cur
                console.log(cur.value);
                mostRight.right = cur;
                cur = cur.left;
            } else {
                // 第二次经过cur
                mostRight.right = null;
                cur = cur.right;
            }
        } else {
            // cur没有左孩子
            console.log(cur.value)
            cur = cur.right;
        }
    }
}

// 中序
function morrisIn(head) {
    if (head === null) {
        return;
    }
    let cur = head;
    let mostRight = null;

    while (cur !== null) {
        mostRight = cur.left;
        if (mostRight !== null) {
            // cur有左孩子

            // 找到左孩子的最右节点
            while (mostRight.right !== null && mostRight.right !== cur) {
                mostRight = mostRight.right;
            }

            if (mostRight.right === null) {
                // 第一次经过cur
                mostRight.right = cur;
                cur = cur.left;
            } else {
                // 第二次经过cur
                console.log(cur.value);
                mostRight.right = null;
                cur = cur.right;
            }
        } else {
            // cur没有左孩子
            console.log(cur.value)
            cur = cur.right;
        }
    }
}

// 后序
function reverseNode(head) {
    if (head === null) {
        return null;
    }
    let prev = null;
    let cur = head;
    let right = null;
    while (cur !== null) {
        right = cur.right;
        cur.right = prev;
        prev = cur;
        cur = right;
    }
    return prev;
}
function printEdge(head) {
    let cur = reverseNode(head);
    while (cur !== null) {
        console.log(cur.value);
        cur = cur.right;
    }
    reverseNode(head);
}
function morrisPos(head) {
    if (head === null) {
        return;
    }
    let cur = head;
    let mostRight = null;

    while (cur !== null) {
        mostRight = cur.left;
        if (mostRight !== null) {
            // cur有左孩子

            // 找到左孩子的最右节点
            while (mostRight.right !== null && mostRight.right !== cur) {
                mostRight = mostRight.right;
            }

            if (mostRight.right === null) {
                // 第一次经过cur
                mostRight.right = cur;
                cur = cur.left;
            } else {
                // 第二次经过cur
                mostRight.right = null;
                printEdge(cur.left)
                cur = cur.right;
            }
        } else {
            // cur没有左孩子
            cur = cur.right;
        }
    }
    printEdge(head)
    // cur = head
    // while (cur !== null) {
    //     console.log(cur.value);
    //     cur = cur.right
    // }
}

console.log('morris序')
morris(head) // 1 2 4 7 4 8 2 5 9 5 10 1 3 6
console.log('前序')
morrisPre(head) // 1 2 4 7 8 5 9 10 3 6
console.log('中序')
morrisIn(head) // 7 4 8 2 9 5 10 1 3 6
console.log('后序')
morrisPos(head) // 7 8 4 9 10 5 2 6 3 1