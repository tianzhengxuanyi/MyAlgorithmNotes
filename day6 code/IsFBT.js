function TreeNode(val) {
    this.val = val;
    this.left = this.right = null;
}

function isFBTProcess(root) {
    if (root === null) {
        return {
            N: 0,
            L: 0
        }
    }
    let leftData = isFBTProcess(root.left);
    let rightData = isFBTProcess(root.right);

    return {
        N: leftData.N + rightData.N + 1,
        L: Math.max(leftData.L, rightData.L) +  1
    }
}
function isFBT(root) {
    // 满二叉树需的节点数和深度需满足 N = 2 ^ L - 1
    // 递归 左子树的深度和节点数 右子树的深度和节点数
    if (root === null) {
        return true
    }
    let {N, L} = isFBTProcess(root)
    return N === 2 ** L - 1
}



let fullBT = new TreeNode(1)
fullBT.left = new TreeNode(2)
fullBT.right = new TreeNode(3)
fullBT.left.left = new TreeNode(4)
fullBT.left.right = new TreeNode(5)
fullBT.right.left = new TreeNode(6)
fullBT.right.right = new TreeNode(7)

let notFullBT = new TreeNode(1)
notFullBT.left = new TreeNode(2)
notFullBT.right = new TreeNode(3)
notFullBT.left.left = new TreeNode(4)
notFullBT.left.right = new TreeNode(5)
notFullBT.right.left = new TreeNode(6)
notFullBT.right.right = new TreeNode(7)
notFullBT.left.left.left = new TreeNode(8)
notFullBT.right.right.left = new TreeNode(9)

console.log(isFBT(fullBT));
console.log(isFBT(notFullBT));