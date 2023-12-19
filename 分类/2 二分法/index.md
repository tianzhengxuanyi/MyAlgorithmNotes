问题一：如何在一个有序数组中找某个是否存在？

**思路：** 遍历，时间复杂度O(N) , 二分法

经典二分：

![](../../image/day1-2.jpg)

```js
function BSexist(arr, num) {
    let L = 0;
    let R = arr.length - 1;
    let mid = 0;
    while(L <= R) {
        mid = L + (L - R) / 2;
        if (arr[mid] == num) {
            return true;
        } else if (arr[mid] < num) {
            L = mid + 1;
        } else {
            R = mid - 1;
        }
	}
    return arr[L] == num;
}
```



问题二：在有序数组中找大于等于某个数最左侧的位置

![](../../image/day1-3.jpeg)

```js
function BSfindLeftMax(arr, num) {
    let L = 0;
    let R = arr.length - 1;
    let mid = 0;
    let leftMaxIndex = -1;
    while (L < R) {
		mid = L + (L - R) / 2;
        if (arr[mid] >= num) {
            leftMaxIndex = mid;
            R = mid - 1;
        } else {
            L = mid + 1;
        }
    }
    return leftMaxIndex;
}
```

 

问题三：局部最小值，在一个无序数组中，任意两个相邻的元素不相等，定义一个局部最小

![](../../image/day1-4.jpg)

```js
function BSFindMin(arr) {
    // 无序数组中寻找到任意一个局部最小值
    if (arr.length < 1 || arr === null) return;
    let L = 0;
    let R = arr.length - 1;
    let mid = 0;
    if (arr[L] < arr[L + 1]) {
        return arr[L];
    } else if (arr[R] < arr[R - 1]) {
        return arr[R];
    }
    while (L <= R) {
        mid = L + ((R - L) >> 1);

        if (arr[mid - 1] > arr[mid] && arr[mid + 1] > arr[mid]) {
            return mid;
        } else if (arr[mid - 1] < arr[mid]) {
            R = mid - 1;
        } else if (arr[mid + 1] < arr[mid]) {
            L = mid + 1;
        }
    }
    return arr[L];
}
```

问题四：

珂珂喜欢吃香蕉。这里有 n 堆香蕉，第 i 堆中有 piles[i] 根香蕉。警卫已经离开了，将在 h 小时后回来。

珂珂可以决定她吃香蕉的速度 k （单位：根/小时）。每个小时，她将会选择一堆香蕉，从中吃掉 k 根。如果这堆香蕉少于 k 根，她将吃掉这堆的所有香蕉，然后这一小时内不会再吃更多的香蕉。  

珂珂喜欢慢慢吃，但仍然想在警卫回来前吃掉所有的香蕉。

返回她可以在 h 小时内吃掉所有香蕉的最小速度 k（k 为整数）。

```js
/**
 * @param {number[]} piles
 * @param {number} h
 * @return {number}
 */
var minEatingSpeed = function(piles, h) {
    let ans = Infinity;
    let right = - Infinity;
    for (let i of piles) {
        right = Math.max(i, right);
    }
    let left = 1;
    while (left <= right) {
        let k = left + ((right - left) >> 1);
        let time = 0;
        for (let i = 0; i < piles.length; i++) {
            time += Math.ceil(piles[i] / k)
        }
        if (time > h) {
            // 在h内完成不了，k小了
            left = k + 1;
        } else if (time <= h){
            // 在h内能完成，k大于等于最小速度
            right = k - 1;
            ans = Math.min(k, ans);
        }
    }
    return ans;
}; 
```
### [二分法题单](https://leetcode.cn/problems/find-a-peak-element-ii/solutions/1/tu-jie-li-yong-xing-zui-da-zhi-pan-duan-r4e0n/)
二分答案
275. H 指数 II
1283. 使结果不超过阈值的最小除数 1542
2187. 完成旅途的最少时间 1641
2226. 每个小孩最多能分到多少糖果 1646
1870. 准时到达的列车最小时速 1676
1011. 在 D 天内送达包裹的能力 1725
875. 爱吃香蕉的珂珂 1766
1898. 可移除字符的最大数目 1913
1482. 制作 m 束花所需的最少天数 1946
1642. 可以到达的最远建筑 1962
2861. 最大合金数 1981
2258. 逃离火灾 2347
最小化最大值
2064. 分配给商店的最多商品的最小值 1886
1760. 袋子里最少数目的球 1940
2439. 最小化数组中的最大值 1965
2560. 打家劫舍 IV 2081
778. 水位上升的泳池中游泳 2097
2616. 最小化数对的最大差值 2155
2513. 最小化两个数组中的最大值 2302
最大化最小值
1552. 两球之间的磁力 1920
2861. 最大合金数 1981
2517. 礼盒的最大甜蜜度 2021
2812. 找出最安全路径 2154
2528. 最大化城市的最小供电站数目 2236

作者：灵茶山艾府
链接：https://leetcode.cn/problems/find-a-peak-element-ii/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
