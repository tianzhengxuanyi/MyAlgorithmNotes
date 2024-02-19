namespace DigitDP {
  function digitDP(start: number, finish: number): number {
    let high = String(finish);
    let low = String(start);
    const n = high.length;
    low = "0".repeat(n - low.length) + low;
    function dfs(i: number, limit_low: boolean, limit_high: boolean): number {
      if (i == n) {
        return 1;
      }

      let lo = limit_low ? +low[i] : 0;
      let hi = limit_high ? +high[i] : 9;

      let res = 0;
      for (let d = lo; d <= hi; d++) {
        res += dfs(i + 1, limit_low && d == lo, limit_high && d == hi);
      }

      return res;
    }

    return dfs(0, true, true);
  }
}
