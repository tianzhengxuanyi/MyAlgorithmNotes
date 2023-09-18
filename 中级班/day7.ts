namespace day7 {
    function lightNums(light: string): number {
        const arr = light.split("");
        // 从i开始后续最少需要多少盏灯，0~i-1不会对i位置的安排产生印象；
        function process(arr: string[], i: number): number {
            if (i >= arr.length) {
                return 0;
            }
            let res = 0;
            if (arr[i] === "x") {
                res = process(arr, i+1);
            } else {
                if (arr[i+1] === ".") {
                    res = process(arr, i+3) + 1;
                } else {
                    res = process(arr, i+2) + 1;
                }
            }
            return res;
        }
        return process(arr, 0);
    }
    console.log("lightNums", lightNums("...x..."))
}