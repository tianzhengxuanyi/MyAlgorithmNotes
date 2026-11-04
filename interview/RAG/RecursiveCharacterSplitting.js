// ---------- 工具：转义正则特殊字符 ----------
function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ---------- 工具：切分并保留分隔符（对应 _split_text_with_regex） ----------
// LangChain 默认 keep_separator=True：分隔符留在片段末尾，
// 这样后续 join 时能还原原始文本边界。
function splitKeepSeparator(text, separator) {
    // 空字符串分隔符：兜底为单字符，保证片段长度恒为 1，递归必然终止
    if (separator === "") return Array.from(text);

    // 用捕获组把分隔符保留在 split 结果中
    const parts = text.split(new RegExp(`(${escapeRegExp(separator)})`));
    const result = [];
    // 偶数位是内容，奇数位是分隔符；把分隔符附着到前一个内容末尾
    for (let i = 0; i < parts.length; i += 2) {
        const merged = (parts[i] ?? "") + (parts[i + 1] ?? "");
        if (merged) result.push(merged);
    }
    return result;
}

// ---------- 核心 1：贪心合并 + 回退式 overlap（对应 _merge_splits） ----------
function mergeSplits(splits, separator, chunkSize, chunkOverlap) {
    const docs = [];
    let currentDoc = []; // 当前正在构建的块（片段数组）
    let total = 0; // 当前块的总长度（含分隔符）
    const sepLen = separator.length;

    for (const d of splits) {
        const dLen = d.length;
        // 判断：加入 d 后是否超过 chunkSize
        if (total + dLen + (currentDoc.length > 0 ? sepLen : 0) > chunkSize) {
            if (currentDoc.length > 0) {
                // 封口：当前块先输出
                const doc = currentDoc.join(separator);
                if (doc) docs.push(doc);

                // 关键：不是清空，而是从头部回退片段，
                // 直到剩余长度 <= chunkOverlap（或空），
                // 剩下的尾部片段自然成为新块的开头 → 这就是 overlap
                while (
                    total > chunkOverlap ||
                    (total + dLen + (currentDoc.length > 0 ? sepLen : 0) >
                        chunkSize &&
                        total > 0)
                ) {
                    const removed = currentDoc.shift();
                    total -=
                        removed.length + (currentDoc.length > 0 ? sepLen : 0);
                }
            }
        }
        // 把 d 加入当前块
        currentDoc.push(d);
        total += dLen + (currentDoc.length > 1 ? sepLen : 0);
    }

    // 最后一块
    const doc = currentDoc.join(separator);
    if (doc) docs.push(doc);
    return docs;
}

// ---------- 核心 2：递归降级（对应 _split_text） ----------
function recursiveCharacterSplit(
    text,
    chunkSize = 500,
    chunkOverlap = 50,
    separators = ["\n\n", "\n", ". ", " ", ""],
) {
    if (!text) return [];
    if (text.length <= chunkSize) return [text];

    const finalChunks = [];

    // 1. 选分隔符：找文本中实际存在的第一个分隔符；
    //    它后面的分隔符作为下一级备用（newSeparators）
    let separator = separators[separators.length - 1];
    let newSeparators = [];
    for (let i = 0; i < separators.length; i++) {
        if (separators[i] === "") {
            separator = "";
            break;
        }
        if (text.includes(separators[i])) {
            separator = separators[i];
            newSeparators = separators.slice(i + 1);
            break;
        }
    }

    // 2. 按分隔符切分，保留分隔符
    const splits = splitKeepSeparator(text, separator);

    // 3. 遍历片段：短片段暂存，"好段"攒够后合并；超长片段先 flush 再递归
    let goodSplits = [];
    for (const s of splits) {
        if (s.length < chunkSize) {
            // 好段：暂存，等待贪心合并
            goodSplits.push(s);
        } else {
            // 超长片段：先把暂存的好段合并输出（顺序不能乱）
            if (goodSplits.length > 0) {
                finalChunks.push(
                    ...mergeSplits(
                        goodSplits,
                        separator,
                        chunkSize,
                        chunkOverlap,
                    ),
                );
                goodSplits = [];
            }
            // 还有更细的分隔符 → 递归降级；没有 → 直接放入（兜底）
            if (newSeparators.length === 0) {
                finalChunks.push(s);
            } else {
                finalChunks.push(
                    ...recursiveCharacterSplit(
                        s,
                        chunkSize,
                        chunkOverlap,
                        newSeparators,
                    ),
                );
            }
        }
    }

    // 收尾：处理剩余的暂存好段
    if (goodSplits.length > 0) {
        finalChunks.push(
            ...mergeSplits(goodSplits, separator, chunkSize, chunkOverlap),
        );
    }

    return finalChunks;
}
