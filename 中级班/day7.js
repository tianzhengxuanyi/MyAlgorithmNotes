function lightNums(light) {
    const arr = light.split("");
    // 从i开始后续最少需要多少盏灯，0~i-1不会对i位置的安排产生印象；
    function process(arr, i) {
        if (i >= arr.length) {
            return 0;
        }
        let res = 0;
        if (arr[i] === "x") {
            res = process(arr, i+1);
        } else {
            if (arr[i+1] === ".") {
                res = process(arr, i+3) + 1;
            } else {
                res = process(arr, i+2) + 1;
            }
        }
        return res;
    }
    return process(arr, 0);
}
console.log("lightNums", lightNums("...x....x.."))

function getPosArr(pre, inArr) {
    const inMap = new Map();
    inArr.forEach((node, index) => {
        inMap.set(node, index)
    })
    const pos = new Array(pre.length);
    const process = (preStart, preEnd, inStart, inEnd, posStart, posEnd) => {
        if (posStart <= posEnd && posStart >= 0) {
            pos[posEnd] = pre[preStart];
        }
        let inMidIndex = inMap.get(pre[preStart]);
        let inLeftStart = inStart, inLeftEnd = inMidIndex - 1, inRightStart = inMidIndex + 1, inRightEnd = inEnd;
        let preLeftStart = preStart + 1, preLeftEnd = preLeftStart + inLeftEnd - inLeftStart, preRightStart = preLeftEnd + 1, preRightEnd = preEnd;
        let posLeftStart = posStart, posLeftEnd = posStart + preLeftEnd - preLeftStart, posRightStart = posLeftEnd + 1, posRightEnd = posEnd - 1;
  
        if (preLeftStart <= preLeftEnd) {
            process(preLeftStart, preLeftEnd, inLeftStart, inLeftEnd, posLeftStart, posLeftEnd)
        }
        if (preRightStart <= preRightEnd) {
            process(preRightStart, preRightEnd, inRightStart, inRightEnd, posRightStart, posRightEnd)
        }
    }

    process(0, pre.length-1, 0, inArr.length-1, 0, pos.length-1)
    return pos;
}

const pre = [1,2,4,5,3,6,7];
const inArr = [4,2,5,1,6,3,7]
console.log("getPosArr", getPosArr(pre, inArr))


function getCTNodeNum(head) {
    if (head === null) {
        return 0;
    }
    let h = getCTHeight(head);
    let num = 0;

    return num;
}

function getCTHeight(head) {
    if (head === null) {
        return 0;
    }
    let height = 1;
    while (head.left) {
        height++;
        head = head.left;
    }
    return height;
}

function Node(val) {
    this.val = val;
    this.left = null;
    this.right = null;
}

const head = new Node(1);
head.left = new Node(2);
head.right = new Node(3);
head.left.left = new Node(4);
head.left.right = new Node(5);
head.right.left = new Node(6);

console.log("getCTHeight", getCTHeight(head));