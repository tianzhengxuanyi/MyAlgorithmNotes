namespace Hanota {
  const A = [2, 1, 0],
    B = [],
    C = [];
  const hanota = function (A, B, C) {
    process(A, C, B, A.length);
    return C;
  };

  function process(from, to, other, i) {
    if (i === 1) {
      // base case 只剩最后一个直接移动
      to.push(from.pop());
      return;
    }
    // 将 1 到 i-1 个圆盘移动到 other
    process(from, other, to, i - 1);
    // 将第 i 个圆盘移动到 to
    to.push(from.pop());
    // 将 1 到 i-1 个圆盘移动到 to
    process(other, to, from, i - 1);
  }

  console.log("🚀 ~ hanota ~ hanota:", hanota(A, B, C));
}

namespace PrintAllSubsequence {
  function printAllSubsequence(str) {
    function process(subsequence, i) {
      if (i === str.length) {
        return result.push(subsequence);
      }
      // 前1-i子序列不加上第i个字符
      process(subsequence, i + 1);
      subsequence += str[i];
      // 前1-i子序列加上第i个字符
      process(subsequence, i + 1);
    }
    let result: any = [];
    let subsequence = "";
    process(subsequence, 0);
    return result;
  }

  console.log("🚀 ~ printAllSubsequence ~ printAllSubsequence:", printAllSubsequence("abc"));
}
