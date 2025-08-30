function TreeNode(val) {
    this.val = val;
    this.parent = this.left = this.right = null;
}

function getSuccessorNode(head) {
    if (head === null) {
        return null;
    }
    // 判断head是否有右节点
    if (head.right !== null) {
        // 返回右子树中最深的左节点
        return getLeftNode(head.right)
    }
    let parent = head.parent
    // 无右节点，则需要向上找到第一个为父亲节点左节点的节点
    while (parent !== null && head !== parent.left) {
        head = parent
        parent = head.parent;
    }
    return parent
}

function getLeftNode(head) {
    if (head === null) {
        return null;
    }
    if (head.left !== null) {
        return getLeftNode(head.left);
    } else {
        return head;
    }
}

let head = new TreeNode(6);
head.parent = null;
head.left = new TreeNode(3);
head.left.parent = head;
head.left.left = new TreeNode(1);
head.left.left.parent = head.left;
head.left.left.right = new TreeNode(2);
head.left.left.right.parent = head.left.left;
head.left.right = new TreeNode(4);
head.left.right.parent = head.left;
head.left.right.right = new TreeNode(5);
head.left.right.right.parent = head.left.right;
head.right = new TreeNode(9);
head.right.parent = head;
head.right.left = new TreeNode(8);
head.right.left.parent = head.right;
head.right.left.left = new TreeNode(7);
head.right.left.left.parent = head.right.left;
head.right.right = new TreeNode(10);
head.right.right.parent = head.right;

// console.log(head);
console.log(getSuccessorNode(head.left.right.right));
