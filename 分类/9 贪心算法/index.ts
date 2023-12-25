namespace BestArrange {
  class Program {
    start: number;
    end: number;

    constructor(start: number, end: number) {
      this.start = start;
      this.end = end;
    }
  }

  function bestArrange(program: Program[]) {
    program.sort((a, b) => a.end - b.end);
    let lastEnd = program[0].end;
    let result = 1;
    for (let i = 1; i < program.length; i++) {
      if (program[i].start >= lastEnd) {
        result++;
        lastEnd = program[i].end;
      }
    }
    return result;
  }

  const time = [
    [3, 6],
    [1, 4],
    [5, 7],
    [2, 5],
    [5, 9],
    [3, 8],
    [8, 11],
    [6, 10],
    [8, 12],
    [12, 14],
  ];
  const program: Program[] = time.map((item) => {
    return new Program(item[0], item[1]);
  });
  console.log(
    "🚀 ~ file: index.ts:32 ~ bestArrange(program):",
    bestArrange(program)
  );
}
