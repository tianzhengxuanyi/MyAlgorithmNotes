# LeetCode Hot100 刷题笔记



--------
## [两数之和](https://leetcode.cn/problems/two-sum/)

**标签：** `` ``
给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target 的那 两个 整数，并返回它们的数组下标。 你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。 你可以按任意顺序返回答案。


--------
## [字母异位词分组](https://leetcode.cn/problems/group-anagrams/)

**标签：** `` `` `` ``
给你一个字符串数组，请你将 字母异位词 组合在一起。可以按任意顺序返回结果列表。


--------
## [最长连续序列](https://leetcode.cn/problems/longest-consecutive-sequence/)

**标签：** `` `` ``
给定一个未排序的整数数组 nums ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。 请你设计并实现时间复杂度为 O(n) 的算法解决此问题。


--------
## [移动零](https://leetcode.cn/problems/move-zeroes/)

**标签：** `` ``
给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。 请注意 ，必须在不复制数组的情况下原地对数组进行操作。


--------
## [盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)

**标签：** `` `` ``
给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i]) 。 找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。 返回容器可以储存的最大水量。 说明：你不能倾斜容器。


--------
## [三数之和](https://leetcode.cn/problems/3sum/)

**标签：** `` `` ``
给你一个整数数组 nums ，判断是否存在三元组 [nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k ，同时还满足 nums[i] + nums[j] + nums[k] == 0 。请你返回所有和为 0 且不重复的三元组。 注意：答案中不可以包含重复的三元组。


--------
## [接雨水](https://leetcode.cn/problems/trapping-rain-water/)

**标签：** `` `` `` `` ``
给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。


--------
## [无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)

**标签：** `` `` ``
给定一个字符串 s ，请你找出其中不含有重复字符的 最长 子串 的长度。


--------
## [找到字符串中所有字母异位词](https://leetcode.cn/problems/find-all-anagrams-in-a-string/)

**标签：** `` `` ``
给定两个字符串 s 和 p，找到 s 中所有 p 的 异位词 的子串，返回这些子串的起始索引。不考虑答案输出的顺序。


--------
## [和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/)

**标签：** `` `` ``
给你一个整数数组 nums 和一个整数 k ，请你统计并返回 该数组中和为 k 的子数组的个数 。 子数组是数组中元素的连续非空序列。


--------
## [滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/)

**标签：** `` `` `` `` ``
给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位。 返回 滑动窗口中的最大值 。


--------
## [最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/)

**标签：** `` `` ``
给定两个字符串 s 和 t，长度分别是 m 和 n，返回 s 中的 最短窗口 子串，使得该子串包含 t 中的每一个字符（包括重复字符）。如果没有这样的子串，返回空字符串 ""。 测试用例保证答案唯一。


--------
## [最大子数组和](https://leetcode.cn/problems/maximum-subarray/)

**标签：** `` `` ``
给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。 子数组 是数组中的一个连续部分。


--------
## [合并区间](https://leetcode.cn/problems/merge-intervals/)

**标签：** `` ``
以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回 一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间 。


--------
## [轮转数组](https://leetcode.cn/problems/rotate-array/)

**标签：** `` `` ``
给定一个整数数组 nums，将数组中的元素向右轮转 k 个位置，其中 k 是非负数。


--------
## [除了自身以外数组的乘积](https://leetcode.cn/problems/product-of-array-except-self/)

**标签：** `` ``
给你一个整数数组 nums，返回 数组 answer ，其中 answer[i] 等于 nums 中除了 nums[i] 之外其余各元素的乘积 。 题目数据 保证 数组 nums之中任意元素的全部前缀元素和后缀的乘积都在 32 位 整数范围内。 请 不要使用除法，且在 O(n) 时间复杂度内完成此题。


--------
## [缺失的第一个正数](https://leetcode.cn/problems/first-missing-positive/)

**标签：** `` ``
给你一个未排序的整数数组 nums ，请你找出其中没有出现的最小的正整数。 请你实现时间复杂度为 O(n) 并且只使用常数级别额外空间的解决方案。


--------
## [矩阵置零](https://leetcode.cn/problems/set-matrix-zeroes/)

**标签：** `` `` ``
给定一个 m x n 的矩阵，如果一个元素为 0 ，则将其所在行和列的所有元素都设为 0 。请使用 原地 算法。


--------
## [螺旋矩阵](https://leetcode.cn/problems/spiral-matrix/)

**标签：** `` `` ``
给你一个 m 行 n 列的矩阵 matrix ，请按照 顺时针螺旋顺序 ，返回矩阵中的所有元素。


--------
## [旋转图像](https://leetcode.cn/problems/rotate-image/)

**标签：** `` `` ``
给定一个 n × n 的二维矩阵 matrix 表示一个图像。请你将图像顺时针旋转 90 度。 你必须在 原地 旋转图像，这意味着你需要直接修改输入的二维矩阵。请不要 使用另一个矩阵来旋转图像。


--------
## [搜索二维矩阵 II](https://leetcode.cn/problems/search-a-2d-matrix-ii/)

**标签：** `` `` `` ``
编写一个高效的算法来搜索 m x n 矩阵 matrix 中的一个目标值 target 。该矩阵具有以下特性： 每行的元素从左到右升序排列。 每列的元素从上到下升序排列。


--------
## [相交链表](https://leetcode.cn/problems/intersection-of-two-linked-lists/)

**标签：** `` `` ``
给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 null 。 图示两个链表在节点 c1 开始相交： 题目数据 保证 整个链式结构中不存在环。 注意，函数返回结果后，链表必须 保持其原始结构 。 自定义评测： 评测系统 的输入如下（你设计的程序 不适用 此输入）： intersectVal - 相交的起始节点的值。如果不存在相交节点，这一值为 0 listA - 第一个链表 listB - 第二个链表 skipA - 在 listA 中（从头节点开始）跳到交叉节点的节点数 skipB - 在 listB 中（从头节点开始）跳到交叉节点的节点数 评测系统将根据这些输入创建链式数据结构，并将两个头节点 headA 和 headB 传递给你的程序。如果程序能够正确返回相交节点，那么你的解决方案将被 视作正确答案 。


--------
## [反转链表](https://leetcode.cn/problems/reverse-linked-list/)

**标签：** `` ``
给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。


--------
## [回文链表](https://leetcode.cn/problems/palindrome-linked-list/)

**标签：** `` `` `` ``
给你一个单链表的头节点 head ，请你判断该链表是否为回文链表。如果是，返回 true ；否则，返回 false 。


--------
## [环形链表](https://leetcode.cn/problems/linked-list-cycle/)

**标签：** `` `` ``
给你一个链表的头节点 head ，判断链表中是否有环。 如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。注意：pos 不作为参数进行传递 。仅仅是为了标识链表的实际情况。 如果链表中存在环 ，则返回 true 。 否则，返回 false 。


--------
## [环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/)

**标签：** `` `` ``
给定一个链表的头节点 head ，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。 如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。如果 pos 是 -1，则在该链表中没有环。注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。 不允许修改 链表。


--------
## [合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/)

**标签：** `` ``
将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。


--------
## [两数相加](https://leetcode.cn/problems/add-two-numbers/)

**标签：** `` `` ``
给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。 请你将两个数相加，并以相同形式返回一个表示和的链表。 你可以假设除了数字 0 之外，这两个数都不会以 0 开头。


--------
## [删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)

**标签：** `` ``
给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。


--------
## [两两交换链表中的节点](https://leetcode.cn/problems/swap-nodes-in-pairs/)

**标签：** `` ``
给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。


--------
## [K 个一组翻转链表](https://leetcode.cn/problems/reverse-nodes-in-k-group/)

**标签：** `` ``
给你链表的头节点 head ，每 k 个节点一组进行翻转，请你返回修改后的链表。 k 是一个正整数，它的值小于或等于链表的长度。如果节点总数不是 k 的整数倍，那么请将最后剩余的节点保持原有顺序。 你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。


--------
## [随机链表的复制](https://leetcode.cn/problems/copy-list-with-random-pointer/)

**标签：** `` ``
给你一个长度为 n 的链表，每个节点包含一个额外增加的随机指针 random ，该指针可以指向链表中的任何节点或空节点。 构造这个链表的 深拷贝。 深拷贝应该正好由 n 个 全新 节点组成，其中每个新节点的值都设为其对应的原节点的值。新节点的 next 指针和 random 指针也都应指向复制链表中的新节点，并使原链表和复制链表中的这些指针能够表示相同的链表状态。复制链表中的指针都不应指向原链表中的节点 。 例如，如果原链表中有 X 和 Y 两个节点，其中 X.random --&gt; Y 。那么在复制链表中对应的两个节点 x 和 y ，同样有 x.random --&gt; y 。 返回复制链表的头节点。 用一个由 n 个节点组成的链表来表示输入/输出中的链表。每个节点用一个 [val, random_index] 表示： val：一个表示 Node.val 的整数。 random_index：随机指针指向的节点索引（范围从 0 到 n-1）；如果不指向任何节点，则为 null 。 你的代码 只 接受原链表的头节点 head 作为传入参数。


--------
## [排序链表](https://leetcode.cn/problems/sort-list/)

**标签：** `` `` `` `` ``
给你链表的头结点 head ，请将其按 升序 排列并返回 排序后的链表 。


--------
## [合并 K 个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists/)

**标签：** `` `` `` ``
给你一个链表数组，每个链表都已经按升序排列。 请你将所有链表合并到一个升序链表中，返回合并后的链表。


--------
## [LRU 缓存](https://leetcode.cn/problems/lru-cache/)

**标签：** `` `` `` ``
请你设计并实现一个满足 LRU (最近最少使用) 缓存 约束的数据结构。 实现 LRUCache 类： LRUCache(int capacity) 以 正整数 作为容量 capacity 初始化 LRU 缓存 int get(int key) 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1 。 void put(int key, int value) 如果关键字 key 已经存在，则变更其数据值 value ；如果不存在，则向缓存中插入该组 key-value 。如果插入操作导致关键字数量超过 capacity ，则应该 逐出 最久未使用的关键字。 函数 get 和 put 必须以 O(1) 的平均时间复杂度运行。


--------
## [二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal/)

**标签：** `` `` `` ``
给定一个二叉树的根节点 root ，返回 它的 中序 遍历 。


--------
## [二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)

**标签：** `` `` `` ``
给定一个二叉树 root ，返回其最大深度。 二叉树的 最大深度 是指从根节点到最远叶子节点的最长路径上的节点数。


--------
## [翻转二叉树](https://leetcode.cn/problems/invert-binary-tree/)

**标签：** `` `` `` ``
给你一棵二叉树的根节点 root ，翻转这棵二叉树，并返回其根节点。


--------
## [对称二叉树](https://leetcode.cn/problems/symmetric-tree/)

**标签：** `` `` `` ``
给你一个二叉树的根节点 root ， 检查它是否轴对称。


--------
## [二叉树的直径](https://leetcode.cn/problems/diameter-of-binary-tree/)

**标签：** `` `` ``
给你一棵二叉树的根节点，返回该树的 直径 。 二叉树的 直径 是指树中任意两个节点之间最长路径的 长度 。这条路径可能经过也可能不经过根节点 root 。 两节点之间路径的 长度 由它们之间边数表示。


--------
## [二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)

**标签：** `` `` ``
给你二叉树的根节点 root ，返回其节点值的 层序遍历 。 （即逐层地，从左到右访问所有节点）。


--------
## [将有序数组转换为二叉搜索树](https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/)

**标签：** `` `` `` `` ``
给你一个整数数组 nums ，其中元素已经按 升序 排列，请你将其转换为一棵 平衡 二叉搜索树。


--------
## [验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/)

**标签：** `` `` `` ``
给你一个二叉树的根节点 root ，判断其是否是一个有效的二叉搜索树。 有效 二叉搜索树定义如下： 节点的左子树只包含 严格小于 当前节点的数。 节点的右子树只包含 严格大于 当前节点的数。 所有左子树和右子树自身必须也是二叉搜索树。


--------
## [二叉搜索树中第 K 小的元素](https://leetcode.cn/problems/kth-smallest-element-in-a-bst/)

**标签：** `` `` `` ``
给定一个二叉搜索树的根节点 root ，和一个整数 k ，请你设计一个算法查找其中第 k 小的元素（k 从 1 开始计数）。


--------
## [二叉树的右视图](https://leetcode.cn/problems/binary-tree-right-side-view/)

**标签：** `` `` `` ``
给定一个二叉树的 根节点 root，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。


--------
## [二叉树展开为链表](https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/)

**标签：** `` `` `` `` ``
给你二叉树的根结点 root ，请你将它展开为一个单链表： 展开后的单链表应该同样使用 TreeNode ，其中 right 子指针指向链表中下一个结点，而左子指针始终为 null 。 展开后的单链表应该与二叉树 先序遍历 顺序相同。


--------
## [从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

**标签：** `` `` `` `` ``
给定两个整数数组 preorder 和 inorder ，其中 preorder 是二叉树的先序遍历， inorder 是同一棵树的中序遍历，请构造二叉树并返回其根节点。


--------
## [路径总和 III](https://leetcode.cn/problems/path-sum-iii/)

**标签：** `` `` ``
给定一个二叉树的根节点 root ，和一个整数 targetSum ，求该二叉树里节点值之和等于 targetSum 的 路径 的数目。 路径 不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）。


--------
## [二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)

**标签：** `` `` ``
给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。 百度百科中最近公共祖先的定义为：“对于有根树 T 的两个节点 p、q，最近公共祖先表示为一个节点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。”


--------
## [二叉树中的最大路径和](https://leetcode.cn/problems/binary-tree-maximum-path-sum/)

**标签：** `` `` `` ``
二叉树中的 路径 被定义为一条节点序列，序列中每对相邻节点之间都存在一条边。同一个节点在一条路径序列中 至多出现一次 。该路径 至少包含一个 节点，且不一定经过根节点。 路径和 是路径中各节点值的总和。 给你一个二叉树的根节点 root ，返回其 最大路径和 。


--------
## [岛屿数量](https://leetcode.cn/problems/number-of-islands/)

**标签：** `` `` `` `` ``
给你一个由 '1'（陆地）和 '0'（水）组成的的二维网格，请你计算网格中岛屿的数量。 岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。 此外，你可以假设该网格的四条边均被水包围。


--------
## [腐烂的橘子](https://leetcode.cn/problems/rotting-oranges/)

**标签：** `` `` ``
在给定的 m x n 网格 grid 中，每个单元格可以有以下三个值之一： 值 0 代表空单元格； 值 1 代表新鲜橘子； 值 2 代表腐烂的橘子。 每分钟，腐烂的橘子 周围 4 个方向上相邻 的新鲜橘子都会腐烂。 返回 直到单元格中没有新鲜橘子为止所必须经过的最小分钟数。如果不可能，返回 -1 。


--------
## [课程表](https://leetcode.cn/problems/course-schedule/)

**标签：** `` `` `` ``
你这个学期必须选修 numCourses 门课程，记为 0 到 numCourses - 1 。 在选修某些课程之前需要一些先修课程。 先修课程按数组 prerequisites 给出，其中 prerequisites[i] = [ai, bi] ，表示如果要学习课程 ai 则 必须 先学习课程 bi 。 例如，先修课程对 [0, 1] 表示：想要学习课程 0 ，你需要先完成课程 1 。 请你判断是否可能完成所有课程的学习？如果可以，返回 true ；否则，返回 false 。


--------
## [实现 Trie (前缀树)](https://leetcode.cn/problems/implement-trie-prefix-tree/)

**标签：** `` `` `` ``
Trie（发音类似 "try"）或者说 前缀树 是一种树形数据结构，用于高效地存储和检索字符串数据集中的键。这一数据结构有相当多的应用情景，例如自动补全和拼写检查。 请你实现 Trie 类： Trie() 初始化前缀树对象。 void insert(String word) 向前缀树中插入字符串 word 。 boolean search(String word) 如果字符串 word 在前缀树中，返回 true（即，在检索之前已经插入）；否则，返回 false 。 boolean startsWith(String prefix) 如果之前已经插入的字符串 word 的前缀之一为 prefix ，返回 true ；否则，返回 false 。


--------
## [全排列](https://leetcode.cn/problems/permutations/)

**标签：** `` ``
给定一个不含重复数字的数组 nums ，返回其 所有可能的全排列 。你可以 按任意顺序 返回答案。


--------
## [子集](https://leetcode.cn/problems/subsets/)

**标签：** `` `` ``
给你一个整数数组 nums ，数组中的元素 互不相同 。返回该数组所有可能的子集（幂集）。 解集 不能 包含重复的子集。你可以按 任意顺序 返回解集。


--------
## [电话号码的字母组合](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/)

**标签：** `` `` ``
给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。 给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。


--------
## [组合总和](https://leetcode.cn/problems/combination-sum/)

**标签：** `` ``
给你一个 无重复元素 的整数数组 candidates 和一个目标整数 target ，找出 candidates 中可以使数字和为目标数 target 的 所有 不同组合 ，并以列表形式返回。你可以按 任意顺序 返回这些组合。 candidates 中的 同一个 数字可以 无限制重复被选取 。如果至少一个数字的被选数量不同，则两种组合是不同的。 对于给定的输入，保证和为 target 的不同组合数少于 150 个。


--------
## [括号生成](https://leetcode.cn/problems/generate-parentheses/)

**标签：** `` `` ``
数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。


--------
## [单词搜索](https://leetcode.cn/problems/word-search/)

**标签：** `` `` `` `` ``
给定一个 m x n 二维字符网格 board 和一个字符串单词 word 。如果 word 存在于网格中，返回 true ；否则，返回 false 。 单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。


--------
## [分割回文串](https://leetcode.cn/problems/palindrome-partitioning/)

**标签：** `` `` ``
给你一个字符串 s，请你将 s 分割成一些 子串，使每个子串都是 回文串 。返回 s 所有可能的分割方案。


--------
## [N 皇后](https://leetcode.cn/problems/n-queens/)

**标签：** `` ``
按照国际象棋的规则，皇后可以攻击与之处在同一行或同一列或同一斜线上的棋子。 n 皇后问题 研究的是如何将 n 个皇后放置在 n×n 的棋盘上，并且使皇后彼此之间不能相互攻击。 给你一个整数 n ，返回所有不同的 n 皇后问题 的解决方案。 每一种解法包含一个不同的 n 皇后问题 的棋子放置方案，该方案中 'Q' 和 '.' 分别代表了皇后和空位。


--------
## [搜索插入位置](https://leetcode.cn/problems/search-insert-position/)

**标签：** `` ``
给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。 请必须使用时间复杂度为 O(log n) 的算法。


--------
## [搜索二维矩阵](https://leetcode.cn/problems/search-a-2d-matrix/)

**标签：** `` `` ``
给你一个满足下述两条属性的 m x n 整数矩阵： 每行中的整数从左到右按非严格递增顺序排列。 每行的第一个整数大于前一行的最后一个整数。 给你一个整数 target ，如果 target 在矩阵中，返回 true ；否则，返回 false 。


--------
## [在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/)

**标签：** `` ``
给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target。请你找出给定目标值在数组中的开始位置和结束位置。 如果数组中不存在目标值 target，返回 [-1, -1]。 你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题。


--------
## [搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array/)

**标签：** `` ``
整数数组 nums 按升序排列，数组中的值 互不相同 。 在传递给函数之前，nums 在预先未知的某个下标 k（0 &lt;= k &lt; nums.length）上进行了 向左旋转，使数组变为 [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]（下标 从 0 开始 计数）。例如， [0,1,2,4,5,6,7] 下标 3 上向左旋转后可能变为 [4,5,6,7,0,1,2] 。 给你 旋转后 的数组 nums 和一个整数 target ，如果 nums 中存在这个目标值 target ，则返回它的下标，否则返回 -1 。 你必须设计一个时间复杂度为 O(log n) 的算法解决此问题。


--------
## [寻找旋转排序数组中的最小值](https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/)

**标签：** `` ``
已知一个长度为 n 的数组，预先按照升序排列，经由 1 到 n 次 旋转 后，得到输入数组。例如，原数组 nums = [0,1,2,4,5,6,7] 在变化后可能得到： 若旋转 4 次，则可以得到 [4,5,6,7,0,1,2] 若旋转 7 次，则可以得到 [0,1,2,4,5,6,7] 注意，数组 [a[0], a[1], a[2], ..., a[n-1]] 旋转一次 的结果为数组 [a[n-1], a[0], a[1], a[2], ..., a[n-2]] 。 给你一个元素值 互不相同 的数组 nums ，它原来是一个升序排列的数组，并按上述情形进行了多次旋转。请你找出并返回数组中的 最小元素 。 你必须设计一个时间复杂度为 O(log n) 的算法解决此问题。


--------
## [寻找两个正序数组的中位数](https://leetcode.cn/problems/median-of-two-sorted-arrays/)

**标签：** `` `` ``
给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 中位数 。 算法的时间复杂度应该为 O(log (m+n)) 。


--------
## [有效的括号](https://leetcode.cn/problems/valid-parentheses/)

**标签：** `` ``
给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。 有效字符串需满足： 左括号必须用相同类型的右括号闭合。 左括号必须以正确的顺序闭合。 每个右括号都有一个对应的相同类型的左括号。


--------
## [最小栈](https://leetcode.cn/problems/min-stack/)

**标签：** `` ``
设计一个支持 push ，pop ，top 操作，并能在常数时间内检索到最小元素的栈。 实现 MinStack 类: MinStack() 初始化堆栈对象。 void push(int val) 将元素val推入堆栈。 void pop() 删除堆栈顶部的元素。 int top() 获取堆栈顶部的元素。 int getMin() 获取堆栈中的最小元素。


--------
## [字符串解码](https://leetcode.cn/problems/decode-string/)

**标签：** `` `` ``
给定一个经过编码的字符串，返回它解码后的字符串。 编码规则为: k[encoded_string]，表示其中方括号内部的 encoded_string 正好重复 k 次。注意 k 保证为正整数。 你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。 此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 k ，例如不会出现像 3a 或 2[4] 的输入。 测试用例保证输出的长度不会超过 105。


--------
## [每日温度](https://leetcode.cn/problems/daily-temperatures/)

**标签：** `` `` ``
给定一个整数数组 temperatures ，表示每天的温度，返回一个数组 answer ，其中 answer[i] 是指对于第 i 天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 0 来代替。


--------
## [柱状图中最大的矩形](https://leetcode.cn/problems/largest-rectangle-in-histogram/)

**标签：** `` `` ``
给定 n 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1 。 求在该柱状图中，能够勾勒出来的矩形的最大面积。


--------
## [数组中的第K个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array/)

**标签：** `` `` `` `` ``
给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。 请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。 你必须设计并实现时间复杂度为 O(n) 的算法解决此问题。


--------
## [前 K 个高频元素](https://leetcode.cn/problems/top-k-frequent-elements/)

**标签：** `` `` `` `` `` `` `` ``
给你一个整数数组 nums 和一个整数 k ，请你返回其中出现频率前 k 高的元素。你可以按 任意顺序 返回答案。


--------
## [数据流的中位数](https://leetcode.cn/problems/find-median-from-data-stream/)

**标签：** `` `` `` `` ``
中位数是有序整数列表中的中间值。如果列表的大小是偶数，则没有中间值，中位数是两个中间值的平均值。 例如 arr = [2,3,4] 的中位数是 3 。 例如 arr = [2,3] 的中位数是 (2 + 3) / 2 = 2.5 。 实现 MedianFinder 类: MedianFinder() 初始化 MedianFinder 对象。 void addNum(int num) 将数据流中的整数 num 添加到数据结构中。 double findMedian() 返回到目前为止所有元素的中位数。与实际答案相差 10-5 以内的答案将被接受。


--------
## [买卖股票的最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/)

**标签：** `` ``
给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。 你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润。 返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。


--------
## [跳跃游戏](https://leetcode.cn/problems/jump-game/)

**标签：** `` `` ``
给你一个非负整数数组 nums ，你最初位于数组的 第一个下标 。数组中的每个元素代表你在该位置可以跳跃的最大长度。 判断你是否能够到达最后一个下标，如果可以，返回 true ；否则，返回 false 。


--------
## [跳跃游戏 II](https://leetcode.cn/problems/jump-game-ii/)

**标签：** `` `` ``
给定一个长度为 n 的 0 索引整数数组 nums。初始位置在下标 0。 每个元素 nums[i] 表示从索引 i 向后跳转的最大长度。换句话说，如果你在索引 i 处，你可以跳转到任意 (i + j) 处： 0 &lt;= j &lt;= nums[i] 且 i + j &lt; n 返回到达 n - 1 的最小跳跃次数。测试用例保证可以到达 n - 1。


--------
## [划分字母区间](https://leetcode.cn/problems/partition-labels/)

**标签：** `` `` `` ``
给你一个字符串 s 。我们要把这个字符串划分为尽可能多的片段，同一字母最多出现在一个片段中。例如，字符串 "ababcc" 能够被分为 ["abab", "cc"]，但类似 ["aba", "bcc"] 或 ["ab", "ab", "cc"] 的划分是非法的。 注意，划分结果需要满足：将所有划分结果按顺序连接，得到的字符串仍然是 s 。 返回一个表示每个字符串片段的长度的列表。


--------
## [爬楼梯](https://leetcode.cn/problems/climbing-stairs/)

**标签：** `` `` ``
假设你正在爬楼梯。需要 n 阶你才能到达楼顶。 每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？


--------
## [杨辉三角](https://leetcode.cn/problems/pascals-triangle/)

**标签：** `` ``
给定一个非负整数 numRows，生成「杨辉三角」的前 numRows 行。 在「杨辉三角」中，每个数是它左上方和右上方的数的和。


--------
## [打家劫舍](https://leetcode.cn/problems/house-robber/)

**标签：** `` ``
你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。 给定一个代表每个房屋存放金额的非负整数数组，计算你 不触动警报装置的情况下 ，一夜之内能够偷窃到的最高金额。


--------
## [完全平方数](https://leetcode.cn/problems/perfect-squares/)

**标签：** `` `` ``
给你一个整数 n ，返回 和为 n 的完全平方数的最少数量 。 完全平方数 是一个整数，其值等于另一个整数的平方；换句话说，其值等于一个整数自乘的积。例如，1、4、9 和 16 都是完全平方数，而 3 和 11 不是。


--------
## [零钱兑换](https://leetcode.cn/problems/coin-change/)

**标签：** `` `` ``
给你一个整数数组 coins ，表示不同面额的硬币；以及一个整数 amount ，表示总金额。 计算并返回可以凑成总金额所需的 最少的硬币个数 。如果没有任何一种硬币组合能组成总金额，返回 -1 。 你可以认为每种硬币的数量是无限的。


--------
## [单词拆分](https://leetcode.cn/problems/word-break/)

**标签：** `` `` `` `` `` ``
给你一个字符串 s 和一个字符串列表 wordDict 作为字典。如果可以利用字典中出现的一个或多个单词拼接出 s 则返回 true。 注意：不要求字典中出现的单词全部都使用，并且字典中的单词可以重复使用。


--------
## [最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)

**标签：** `` `` ``
给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。 子序列 是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，[3,6,2,7] 是数组 [0,3,1,6,2,2,7] 的子序列。


--------
## [乘积最大子数组](https://leetcode.cn/problems/maximum-product-subarray/)

**标签：** `` ``
给你一个整数数组 nums ，请你找出数组中乘积最大的非空连续 子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。 测试用例的答案是一个 32-位 整数。 请注意，一个只包含一个元素的数组的乘积是这个元素的值。


--------
## [分割等和子集](https://leetcode.cn/problems/partition-equal-subset-sum/)

**标签：** `` ``
给你一个 只包含正整数 的 非空 数组 nums 。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。


--------
## [最长有效括号](https://leetcode.cn/problems/longest-valid-parentheses/)

**标签：** `` `` ``
给你一个只包含 '(' 和 ')' 的字符串，找出最长有效（格式正确且连续）括号 子串 的长度。 左右括号匹配，即每个左括号都有对应的右括号将其闭合的字符串是格式正确的，比如 "(()())"。


--------
## [不同路径](https://leetcode.cn/problems/unique-paths/)

**标签：** `` `` ``
一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 “Start” ）。 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。 问总共有多少条不同的路径？


--------
## [最小路径和](https://leetcode.cn/problems/minimum-path-sum/)

**标签：** `` `` ``
给定一个包含非负整数的 m x n 网格 grid ，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。 说明：每次只能向下或者向右移动一步。


--------
## [最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/)

**标签：** `` `` ``
给你一个字符串 s，找到 s 中最长的 回文 子串。


--------
## [最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/)

**标签：** `` ``
给定两个字符串 text1 和 text2，返回这两个字符串的最长 公共子序列 的长度。如果不存在 公共子序列 ，返回 0 。 一个字符串的 子序列 是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。 例如，"ace" 是 "abcde" 的子序列，但 "aec" 不是 "abcde" 的子序列。 两个字符串的 公共子序列 是这两个字符串所共同拥有的子序列。


--------
## [编辑距离](https://leetcode.cn/problems/edit-distance/)

**标签：** `` ``
给你两个单词 word1 和 word2， 请返回将 word1 转换成 word2 所使用的最少操作数 。 你可以对一个单词进行如下三种操作： 插入一个字符 删除一个字符 替换一个字符


--------
## [只出现一次的数字](https://leetcode.cn/problems/single-number/)

**标签：** `` ``
给你一个 非空 整数数组 nums ，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。 你必须设计并实现线性时间复杂度的算法来解决此问题，且该算法只使用常量额外空间。


--------
## [多数元素](https://leetcode.cn/problems/majority-element/)

**标签：** `` `` `` `` ``
给定一个大小为 n 的数组 nums ，返回其中的多数元素。多数元素是指在数组中出现次数 大于 ⌊ n/2 ⌋ 的元素。 你可以假设数组是非空的，并且给定的数组总是存在多数元素。


--------
## [颜色分类](https://leetcode.cn/problems/sort-colors/)

**标签：** `` `` ``
给定一个包含红色、白色和蓝色、共 n 个元素的数组 nums ，原地 对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。 我们使用整数 0、 1 和 2 分别表示红色、白色和蓝色。 必须在不使用库内置的 sort 函数的情况下解决这个问题。


--------
## [下一个排列](https://leetcode.cn/problems/next-permutation/)

**标签：** `` ``
整数数组的一个 排列 就是将其所有成员以序列或线性顺序排列。 例如，arr = [1,2,3] ，以下这些都可以视作 arr 的排列：[1,2,3]、[1,3,2]、[3,1,2]、[2,3,1] 。 整数数组的 下一个排列 是指其整数的下一个字典序更大的排列。更正式地，如果数组的所有排列根据其字典顺序从小到大排列在一个容器中，那么数组的 下一个排列 就是在这个有序容器中排在它后面的那个排列。如果不存在下一个更大的排列，那么这个数组必须重排为字典序最小的排列（即，其元素按升序排列）。 例如，arr = [1,2,3] 的下一个排列是 [1,3,2] 。 类似地，arr = [2,3,1] 的下一个排列是 [3,1,2] 。 而 arr = [3,2,1] 的下一个排列是 [1,2,3] ，因为 [3,2,1] 不存在一个字典序更大的排列。 给你一个整数数组 nums ，找出 nums 的下一个排列。 必须 原地 修改，只允许使用额外常数空间。


--------
## [寻找重复数](https://leetcode.cn/problems/find-the-duplicate-number/)

**标签：** `` `` `` ``
给定一个包含 n + 1 个整数的数组 nums ，其数字都在 [1, n] 范围内（包括 1 和 n），可知至少存在一个重复的整数。 假设 nums 只有 一个重复的整数 ，返回 这个重复的数 。 你设计的解决方案必须 不修改 数组 nums 且只用常量级 O(1) 的额外空间。