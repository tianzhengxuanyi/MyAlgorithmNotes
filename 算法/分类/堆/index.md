### **取中位数** （堆）

一个数据流中，随时可以取得中位数

先给一个数字，放入大根堆的堆顶；第二个数字cur是否小于等于大根堆顶，是，cur入大根堆，不是，入小根堆；接着看大根堆和小根堆的size，如果size差距大于等于2，则较大的那个堆顶弹出进另外一个。

```js
class Heap {
    constructor(cmp = (x,y) => x > y) {
        this.heap = []
        this.cmp = cmp
    }
    insert(data) {
        const {heap, cmp, swap} = this
        heap.push(data)
        let index = this.size() - 1
        while (index) {
            let parentIndex = (index-1)>>1
            if (!cmp(heap[index], heap[parentIndex])) return 
            swap(heap, index, parentIndex)
            index = parentIndex
        } 
    }
    pop() {
        const {heap, swap} = this
        if (!this.size()) {
            return null;
        }
        swap(heap, 0, this.size() - 1)
        let res = heap.pop();

        let len = this.size()
        // 有可能没有右孩子但是又左孩子，所以以左孩子进行判断
        let index = 0, left = index * 2 + 1

        while (left < len) {
            let largestIndex = left + 1 < len && this.cmp(heap[left+1], heap[left]) ? left + 1 : left
            if (this.cmp(heap[index], heap[largestIndex])) {
                break 
            }
            swap(heap, index, largestIndex)
            index = largestIndex
            left = index * 2 + 1
        }


        return res
    }
    swap(arr, i, j) {
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    size() {
        return this.heap.length
    }
    peak() {
        return this.heap[0]
    }
    isEmpty() {
        return !this.heap.length
    }
}

/**
 * initialize your data structure here.
 */
var MedianFinder = function() {
     this.minHeap = new Heap((x,y) => x < y)
     this.maxHeap = new Heap()
};


/** 
 * @param {number} num
 * @return {void}
 */
MedianFinder.prototype.addNum = function(num) {
    if (this.maxHeap.size() === 0 || num <= this.maxHeap.peak()) {
        this.maxHeap.insert(num)
    } else {
       this.minHeap.insert(num)
    }
    if (this.minHeap.size() === this.maxHeap.size() + 2) {
        this.maxHeap.insert(this.minHeap.pop())
    }
    if (this.maxHeap.size() === this.minHeap.size() + 2) {
        this.minHeap.insert(this.maxHeap.pop())
    }
};

/**
 * @return {number}
 */
MedianFinder.prototype.findMedian = function() {
    let minHeapSize = this.minHeap.size()
    let maxHeapSize = this.maxHeap.size()
    let minHeapHead = this.minHeap.peak()
    let maxHeapHead = this.maxHeap.peak()
    console.log(this.minHeap, this.maxHeap)
    let len = minHeapSize + maxHeapSize
    if (len === 0) return null
    if (len % 2 !== 0) {
        return maxHeapSize > minHeapSize ? maxHeapHead : minHeapHead;
    } else {
        // console.log(this.maxHeap.pop(), this.minHeap.pop())
        return (minHeapHead + maxHeapHead) / 2
    }
};

/**
 * Your MedianFinder object will be instantiated and called as such:
 * var obj = new MedianFinder()
 * obj.addNum(num)
 * var param_2 = obj.findMedian()
 */
```

