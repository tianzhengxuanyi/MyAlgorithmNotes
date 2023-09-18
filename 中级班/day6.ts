namespace day6 {
    class Node {
        val: number;
        left: Node | null;
        right: Node | null;
        constructor(val: number, left?: Node, right?: Node) {
            this.val = val;
            this.left = left ? left : null;
            this.right = right ? right : null;
        }
    }

    class MaxBSTNumInfo {
        max: number;
        min: number;
        maxBSTNum: number;
        maxBSTHead: Node | null;
        constructor(max: number, min: number, maxBSTNum: number, maxBSTHead: Node | null) {
            this.max = max;
            this.min = min;
            this.maxBSTNum = maxBSTNum;
            this.maxBSTHead = maxBSTHead;
        }
    }
    function getMaxBSTNum(head: Node): number {
        if (head === null) {
            return 0;
        }
        function process(head: Node | null): MaxBSTNumInfo {
            if (head === null) {
                return new MaxBSTNumInfo(-Infinity, Infinity, 0, null)
            }
            const leftInfo = process(head.left);
            const rightInfo = process(head.right);
            let min = Math.min(head.val, Math.min(leftInfo.min, rightInfo.min));
            let max = Math.max(head.val, Math.max(leftInfo.max, rightInfo.max));
            let maxBSTNum = Math.max(leftInfo.maxBSTNum, rightInfo.maxBSTNum);
            let maxBSTHead = leftInfo.maxBSTNum > rightInfo.maxBSTNum ? leftInfo.maxBSTHead : rightInfo.maxBSTHead;

            if (leftInfo.maxBSTHead === head.left && rightInfo.maxBSTHead === head.right && head.val > leftInfo.max && head.val < rightInfo.min) {
                maxBSTNum = leftInfo.maxBSTNum + 1 + rightInfo.maxBSTNum;
                maxBSTHead = head;
            }
            return new MaxBSTNumInfo(max, min, maxBSTNum,maxBSTHead)
        }

        return process(head).maxBSTNum;
    }

    let head = new Node(6);
    head.left = new Node(1);
    head.left.left = new Node(0);
    head.left.right = new Node(3);
    head.right = new Node(12);
    head.right.left = new Node(10);
    head.right.left.left = new Node(4);
    head.right.left.left.left = new Node(2);
    head.right.left.left.right = new Node(5);
    head.right.left.right = new Node(14);
    head.right.left.right.left = new Node(11);
    head.right.left.right.right = new Node(15);
    head.right.right = new Node(13);
    head.right.right.left = new Node(20);
    head.right.right.right = new Node(16);

    console.log("getMaxBSTNum",getMaxBSTNum(head))

    function maxSum(arr: number[]): number {
        let max = -Infinity;
        let cur = 0;
        for (let score of arr) {
            cur += score;
            max = Math.max(max, cur);
            cur = Math.max(cur, 0);
        }

        return max;
    }

    console.log("maxSum", maxSum([-2, -3, -5, 40, -10, -10, 100, 1]))

    function getSubMatrixMaxSum(matrix: number[][]): number {
        let max = -Infinity;
        let cur = 0;

        for (let i = 0; i < matrix.length; i++) {
            let arr = new Array(matrix.length).fill(0);
            for (let j = i; j < matrix.length; j++) {
                cur = 0;
                for (let index = 0; index < arr.length; index++) {
                    arr[index] += matrix[j][index];
                    cur += arr[index];
                    max =  Math.max(max, cur);
                    cur = Math.max(0, cur)
                }
            }
        }

        return max;
    }
    
    console.log("getSubMatrixMaxSum", getSubMatrixMaxSum([[-90,48,78],[64,-40,64],[-81,-7,66]]))
}
