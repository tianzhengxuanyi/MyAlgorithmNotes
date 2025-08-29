var longestPalindrome = function (s) {
    if (s.length === 1) {
        return 1
    }

    const charArr = manacherString(s);
    let longest = 1;

    for (let i = 0; i < charArr.length; i++) {
        let left = i - 1;
        let right = i + 1;
        while (left >= 0 && right < charArr.length && charArr[left] === charArr[right]) {
            left--;
            right++;
        }

        left++;
        right--;
        longest = longest < ((right - left) / 2) ?  ((right - left) / 2) : longest;
    }

    return longest;
};

var manacherString = function (s) {
    const arr = s.split('');
    const res = new Array(s.length * 2 + 1);

    for (let i = 0; i < res.length; i++) {
        if (i % 2 === 0) {
            res[i] = '#';
        } else {
            res[i] = arr[(i - 1) / 2]
        }
    }

    return res;
}

console.log(longestPalindrome('abacabattbac'))


function maxLcpsLength(s) {
    if (s.length === 1) {
        return 1
    }

    const charArr = manacherString(s);
    const pArr = new Array(charArr.length).fill(0)
    let R = -1;
    let C = -1;
    let max = -Infinity;
    for (let i = 0; i < charArr.length; i++) {
        pArr[i] = R > i ? Math.min(pArr[2*C - i], R - i) : 1;
        while (i +  pArr[i] < charArr.length && i -  pArr[i] > -1) {
            if (charArr[i +  pArr[i]] === charArr[i - pArr[i]]) {
                pArr[i] = pArr[i] + 1
            } else {
                break;
            }
        }
        if (i + pArr[i] > R) {
            R = i + pArr[i]
            C = i
        }
        max = Math.max(max, pArr[i])
    }
    return max - 1
}

console.log(maxLcpsLength('abacabattbac'))