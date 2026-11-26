# 3. 知识库摄取 Pipeline 节点梳理

> 对应代码：`backend/src/modules/ai/ingestion/nodes/`  
> 编排引擎：`ingestion-engine.ts`  
> 端到端总览（上传校验 → 入队 → 六节点 → 向量）：[`7 RAG离线摄取Pipeline端到端流程`](./7%20RAG离线摄取Pipeline端到端流程.md)  
> 设计文档：`.agent/001-ai-agent-rag/guides/M2-知识库与摄取/T2.4-实现Pipeline节点编排.md`  
> 说明：这里的 Pipeline 是**文档摄取**链路（上传 → 解析 → 切分 → 向量化），不是对话侧的 `StreamChatPipeline`。本节偏节点实现细节；MIME/Parser 现状以笔记 5、7 为准（FETCHER 已用 file-type + ZIP peek）。

---

## 1. 总体流程

默认链路（`seed-default-pipeline.ts`）：

```text
FETCHER → PARSER → ENHANCER → CHUNKER → ENRICHER → INDEXER
```

```mermaid
flowchart LR
  F[FETCHER<br/>读文件] --> P[PARSER<br/>→ Block[]]
  P --> E[ENHANCER<br/>清洗]
  E --> C[CHUNKER<br/>→ Chunk[]]
  C --> R[ENRICHER<br/>关键词+意图]
  R --> I[INDEXER<br/>落库+向量]
```

| 角色 | 文件 | 职责 |
| --- | --- | --- |
| 编排引擎 | `ingestion-engine.ts` | 按 `nextNodeId` 链式执行，条件跳过，记 Task/TaskNode |
| 节点接口 | `ingestion-node.interface.ts` | `getNodeType()` + `execute(ctx, config) → boolean` |
| 注册表 | `ingestion-node.registry.ts` | `INGESTION_NODE` 多实现注入，按 type 索引 |
| 共享上下文 | `ingestion-context.ts` | 节点间传递 `fileBuffer / blocks / chunks / metadata` |
| 条件求值 | `condition-evaluator.ts` | 执行前 `conditionJson` 决定是否 skip |
| CRUD | `ingestion-pipeline.service.ts` | Pipeline/节点配置管理（6 种合法 `nodeType`） |

### 1.1 Context 数据流

| 阶段 | 写入 | 读取 |
| --- | --- | --- |
| Engine 启动 | `documentId`、`knowledgeBaseId`、`collectionName`、`metadata.filePath` | — |
| FETCHER | `fileBuffer`、`filePath`、`mimeType` | `metadata.filePath` |
| PARSER | `blocks`、`metadata.parser` | `fileBuffer`、`mimeType` |
| ENHANCER | 清洗后的 `blocks`、可选 `metadata.author/source` | `blocks` |
| CHUNKER | `chunks`、`outlinePath` | `blocks` |
| ENRICHER | `keywords`、`metadata.keywords`、`metadata.intentTag`；chunk 上意图元数据 | `chunks` |
| INDEXER | DB chunks + PGVector + 文档 `indexStatus` | `chunks`、`outlinePath`、`collectionName` |

### 1.2 Engine 执行要点

1. 加载 Document / KnowledgeBase / Pipeline（`doc.pipelineId` 或默认第一条）  
2. 创建 `IngestionTask`（status=running）  
3. 从 `startNodeId` 沿 `nextNodeId` 前进，最多 100 次防死循环  
4. 每个节点：写 `IngestionTaskNode` → 条件求值 → `registry.get(type).execute` → 记成功/跳过/失败  
5. 节点返回 `false` 可提前终止整条链；抛错则 Task + Document 标记 failed  

触发入口：BullMQ Worker（T2.6）调用 `IngestionEngine.execute(documentId)`。

---

## 2. 六类节点实现

### 2.1 FETCHER — 读文件

**文件**：`nodes/fetcher.node.ts`

| 项 | 说明 |
| --- | --- |
| 输入 | `ctx.metadata.filePath`（Engine 从 `DocumentEntity.filePath` 写入） |
| 输出 | `ctx.filePath`、`ctx.mimeType`、`ctx.set('fileBuffer', Buffer)` |
| config | 当前未使用 |
| 返回 | 恒 `true` |

**实现要点**：

- `fs.readFile(filePath)` 读本地盘（注释写明生产可换 OSS/S3/Minio）  
- **当前 MIME 判定**：仅按扩展名映射（`.md` / `.pdf` / `.docx` / `.xlsx` / `.txt` / `.html` 等）→ `inferMimeType(filePath)`  

**失败**：缺少 `filePath` 直接抛错。

#### 2.1.1 伪造后缀时如何确认 mimeType（风险与改进）

**现状风险**：只信文件名后缀；客户端上传的 `part.mimetype` 同样可伪造。MIME 错了，PARSER（`DocumentParserSelector.select`）会选错实现或直接 `No parser found`。

**原则：以文件内容（魔数 Magic Bytes）为准，后缀 / 声明 MIME 仅作提示。**

| 格式 | 典型签名（文件头） | 说明 |
| --- | --- | --- |
| PDF | `%PDF` | 很稳 |
| DOCX / XLSX | `PK\x03\x04`（ZIP） | 再 peek 包内是否有 `word/`、`xl/` 才能区分 |
| PNG | `\x89PNG` | 二进制稳 |
| JPEG | `\xFF\xD8\xFF` | 二进制稳 |
| HTML / MD / TXT | **几乎无可靠魔数** | 只能启发式（合法 UTF-8、是否含 `#` / `<html` 等） |

**推荐判定顺序**（应落在 FETCHER 读完 `fileBuffer` 之后，或抽成独立 `MimeSniffer`）：

```text
1. sniff(buffer) / file-type 库     → contentMime
2. 扩展名 / 上传声明                 → claimedMime
3. 策略：
   - contentMime 有结果 → 用 contentMime
     · 与 claimedMime 不一致 → 告警或直接拒收
   - 魔数识别不出（多为文本）→ 文本启发式，再才信后缀
   - 都不行 → application/octet-stream，PARSER 失败
```

伪代码示意：

```ts
import { fileTypeFromBuffer } from 'file-type'

const detected = await fileTypeFromBuffer(buffer)
const byExt = this.inferMimeType(filePath)

if (detected?.mime) {
  if (byExt !== 'application/octet-stream' && !mimeCompatible(detected.mime, byExt)) {
    throw new Error(`后缀与内容不符: claimed=${byExt} actual=${detected.mime}`)
  }
  // OOXML：file-type 常只报 application/zip，需再 peek ZIP 内路径映射到 docx/xlsx mime
  ctx.mimeType = mapToParserMime(detected.mime)
} else {
  ctx.mimeType = sniffTextMime(buffer) ?? byExt
}
```

**注意**：

- 项目当前**未**安装 `file-type` 等魔数库，上述为改进方案，尚未落地。  
- DOCX/XLSX 必须做 ZIP 二次识别，否则无法对上 Parser 注册的具体 MIME。  
- Markdown / 纯文本无法 100% 靠魔数；高安全场景可对「魔数可证」格式强制校验，文本类仅接受受信来源。  
- 上传入库的 `DocumentEntity.fileType`（`knowledge.service` 按 `ext`）同样可伪造；预览 / 二次解析也应逐步改为「内容优先」，与摄取一致。

---

### 2.2 PARSER — 文档 → Block[]

**文件**：`nodes/parser.node.ts`  
**依赖**：`DocumentParserSelector`（`modules/ai/core/parser/`）  
**详述**：见 [`5 知识库文档解析逻辑与知识点.md`](./5%20知识库文档解析逻辑与知识点.md)（各格式实现 + 不足 + 解析知识点）

| 项 | 说明 |
| --- | --- |
| 输入 | `ctx.get('fileBuffer')`、`ctx.mimeType` |
| 输出 | `ctx.blocks`、`ctx.metadata.parser` |
| config | 透传给 `parserSelector.parse(buffer, mimeType, config)` |
| 返回 | 恒 `true` |

**实现要点**：

- 按 MIME 选具体 Parser（Markdown / PDF / Word / …），产出结构化 `Block[]`（heading / paragraph / table / code 等）  
- 这是后续「结构感知切分」的前提  

**失败**：缺 buffer 或 mimeType 抛错。

---

### 2.3 ENHANCER — 清洗 + 元数据

**文件**：`nodes/enhancer.node.ts`

| 项 | 说明 |
| --- | --- |
| 输入 | `ctx.blocks` |
| 输出 | 清洗后的 `blocks`；可选 `metadata.author` / `metadata.source` |
| config | `author?`、`source?` |
| 返回 | 恒 `true` |

**实现步骤**：

1. 统一 `\r\n` → `\n`，压缩连续空行（≥3 → 2），`trim`  
2. 从 config 写入作者/来源到 `ctx.metadata`  
3. 过滤掉 `content.length === 0` 的 Block  

纯同步文本处理，无外部依赖。

#### 2.3.1 生产级文档清洗（Boilerplate / Dedup / Normalization）

当前实现只是**最基础的空行/换行归一**。企业级语料进入向量库前，通常还要做以下几类清洗，按重要性排序：

**① 去样板（Boilerplate Removal）—— 最重要**

爬虫/PDF/Word 转换出的文档常夹带大量非正文：

| 类型 | 例子 | 处理方式 |
| --- | --- | --- |
| 页眉页脚 | 每页重复的公司名、页码、“内部资料 注意保密” | 按行/块频率统计：跨页重复率 > 阈值（如 60%）且长度 < N 的块删除 |
| 导航/面包屑 | “首页 > 产品 > 详情” | 正则 + 位置规则（出现在文档前 k 行） |
| 水印/扫码 | “仅限内部使用”“扫码关注” | 关键词黑名单 |
| 目录 TOC | 大量 “……1”“……23” 结尾行 | 点线/页码正则 `\.{3,}\s*\d+$` |

| 方案 | 原理 | 优点 | 缺点 | 适用场景 |
| --- | --- | --- | --- | --- |
| 正则表达式过滤 | 写正则匹配页码、固定格式页眉页脚文本 | 实现简单，代码量少 | 只能处理格式非常规整的；无法处理文字不固定的页眉页脚，误杀风险高 | 简单 PDF，页码「第 X 页 共 Y 页」这类固定模板 |
| 解析器原生提取页眉页脚（优先） | python-docx、PyMuPDF(fitz) 可直接读取文档对象层面的页眉、页脚域，而非文本匹配 | 从文档结构直接剥离，不会误杀正文，不需要用户输入任何信息 | 部分扫描版 PDF 无效；部分生成式 PDF 页眉和正文混在同一文本块 | 数字原生 PDF、docx，RAG 首选 |
| 启发式算法 / 统计过滤（兜底） | 统计高频重复文本块、位置（每页顶部、底部文本），判定为页眉页脚 | 适配没有结构信息的 PDF，不需要用户配置 | 有小概率误判大段正文，需要阈值调参 | 扫描件 OCR 之后、劣质导出 PDF |

效果：显著降低 embedding 噪声，提升召回相关性。**这是投入产出比最高的一步。**

**② 重复与近重复去除（Dedup / Near-Dedup）**

同一文档被多次上传、或大文档内部复制粘贴段落，会导致：

- 向量库膨胀、检索 Top-K 被重复内容占满
- 训练/微调数据污染

常用方法：

| 粒度 | 算法 | 说明 |
| --- | --- | --- |
| 文档级 | SimHash / MinHash | 海明距离 ≤3 判重，适合整篇去重 |
| 段落/Chunk 级 | MD5/SHA1 of normalized text | 精确去重（本项目已用 `fileHash` 做文件级） |
| 段落/Chunk 级 | MinHash + LSH | 近似去重（90% 相似即合并），适合大语料 |

工程上建议在 **CHUNKER 之后、ENRICHER 之前** 加一道 chunk 级 dedup，避免同义 chunk 反复进向量库。

**③ 文本归一化（Normalization）—— 高频**

| 项 | 说明 | 例子 |
| --- | --- | --- |
| Unicode NFKC | 全角→半角、兼容字符合并 | `ＡＢＣ` → `ABC`、`①` → `1` |
| 大小写折叠 | 英文统一小写（中文无影响） | `NASA` → `nasa`（视业务决定是否保留专有名词） |
| 标点标准化 | 中英文标点统一、去除零宽字符 | `“”` → `"`、`\u200b` 删除 |
| 空白折叠 | 多空格/Tab → 单空格 | 比单纯压空行更细粒度 |
| 数字/日期归一 | 可选，便于检索 | `二〇二四年` → `2024年`、`1,000` → `1000` |

**④ 结构噪声清理**

- **断字/断行修复**：PDF 抽取常把单词拆行（`infor-\nmation`），需连字符合并
- **乱码过滤**：``（U+FFFD）、控制字符（除 `\n\t`）
- **HTML 残留**：`&nbsp;`、`<div>` 标签、style/script 块（爬虫来源）
- **多余页码/行号**：纯数字行且出现频率高

**⑤ OCR 后处理（扫描件/PDF 图片）**

OCR 结果错误率高，清洗包括：

- 常见混淆纠正：`0/O`、`1/l/I`、`5/S`（按词典/语言模型打分）
- 删除孤立短行（< 3 字且高频出现的噪声）
- 表格线符 `|` `+` `-` 的归一或删除

**⑥ 语言与编码**

- **编码探测**：`chardet` 兜底非 UTF-8 源（GBK/Big5）
- **语种识别**：`fasttext lid` / `langdetect`，按语种路由不同清洗规则与 embedding 模型
- **混合语种**：主语种 < 阈值（如 70%）告警，避免小语种噪声污染主库

**⑦ PII / 敏感信息脱敏**

进入向量库前按合规要求打码：

| 类型 | 正则/模型 | 替换 |
| --- | --- | --- |
| 手机号 | `1[3-9]\d{9}` | `138****0000` |
| 身份证 | 18 位 + 校验位 | 掩码 |
| 邮箱/银行卡 | 标准正则 | 掩码 |
| 人名/地址 | NER 模型 | 泛化为 `[姓名]` |

注意：脱敏后文本仍可用于检索，但不可逆；如需还原需另存映射（加密存储）。

**⑧ 可选：LLM 语义清洗**

对高价值文档，用 LLM 做：

- 口语化转书面语
- 纠错与补全（OCR 错字）
- 抽取 FAQ/结构化要点

成本高，一般只对「种子知识库」或「高频问答文档」启用，可做成独立的 `LLM_CLEANER` 节点。

#### 2.3.2 清洗规则的配置化建议

生产环境不建议把规则写死在 `enhancer.node.ts`，应做成**可插拔规则链**：

```ts
// config 示例（存 pipeline node.config）
{
  rules: [
    { type: 'boilerplate', freqThreshold: 0.6, maxLen: 30 },
    { type: 'unicode', form: 'NFKC' },
    { type: 'dedup', level: 'chunk', algo: 'minhash', threshold: 0.9 },
    { type: 'pii', kinds: ['phone', 'idcard'] },
    { type: 'regex', pattern: '\\.{3,}\\s*\\d+$', flags: 'gm', action: 'remove' }
  ]
}
```

收益：

- 不同知识库（制度文件 vs 爬虫 FAQ）走不同规则组合
- 规则可灰度、可 A/B，不重启服务
- 每条规则的命中率可落 `metadata.cleanStats`，便于评估清洗效果

---

### 2.4 CHUNKER — Block[] → Chunk[]

**文件**：`nodes/chunker.node.ts`  
**依赖**：`BlockAwareChunker`、`FixedSizeTextChunker`（`modules/ai/core/chunk/`）  
**详述**：见 [`4 知识库Chunk分块策略与实现.md`](./4%20知识库Chunk分块策略与实现.md)（策略实现 + 业界常见分块补充）

| 项 | 说明 |
| --- | --- |
| 输入 | `ctx.blocks` |
| 输出 | `ctx.chunks`、`ctx.outlinePath`（所有 heading 文本） |
| config | 见下表 |
| 返回 | 恒 `true` |

**config（默认种子）**：

| 字段 | 默认 | 含义 |
| --- | --- | --- |
| `strategy` | `structure_aware`（非 `fixed_size` 时） | 结构感知 vs 定长字符切分 |
| `maxChars` | `1000` | 块最大字符数 |
| `overlapChars` | `200` | 定长策略 overlap |
| `blockLevelOverlap` | `true` | 是否块级 overlap |
| `overlapBlockCount` | `1` | overlap 块数 |

**策略选择**：

```text
config.strategy === 'fixed_size'  → FixedSizeTextChunker
否则（默认）                       → BlockAwareChunker（贪心合并 + 原子保留）
```

---

### 2.5 ENRICHER — 关键词 + 意图打标

**文件**：`nodes/enricher.node.ts`  
**依赖**：`ChunkIntentTagger`（`modules/ai/intent/chunk-intent-tagger`）

| 项 | 说明 |
| --- | --- |
| 输入 | `ctx.chunks` |
| 输出 | `ctx.keywords`（Top10）、`metadata.keywords`；可选 `metadata.intentTag` |
| config | 见下表 |
| 返回 | 恒 `true` |

**config（默认种子）**：

| 字段 | 默认 | 含义 |
| --- | --- | --- |
| `tagIntent` | `true`（`!== false` 即开启） | 是否给 chunk 打 `intentNodeId` |
| `intentMinScore` | `2` | 意图匹配最低分 |

**实现步骤**：

1. **关键词**：按空白/标点分词，长度 > 2，全局词频，取 Top 10  
2. **意图打标**：`chunkIntentTagger.tagChunks(chunks, { kinds: [KB], minScore })`，供后续 IntentDirected 检索过滤  

日志示例：`doc=… intent 打标 tagged=m/n`。

---

### 2.6 INDEXER — 落库 + 向量化

**文件**：`nodes/indexer.node.ts`  
**依赖**：`DocumentChunkEntity` / `DocumentEntity`、`VECTOR_STORE_SERVICE`

| 项 | 说明 |
| --- | --- |
| 输入 | `ctx.chunks`、`documentId`、`knowledgeBaseId`、`collectionName`、`outlinePath` |
| 输出 | PG 业务表 chunks + PGVector；文档 `indexStatus=completed` |
| config | 当前未使用 |
| 返回 | `chunks.length === 0` 也返回 `true`（空文档放行） |

**落库步骤**：

1. 删除该 `documentId` 旧 chunks  
2. 写入新 chunks（`isEmbedded=false`），带上 section / outline / blockType / offset / tokenCount / metadata  
3. `vectorStore.deleteDocumentVectors(documentId)` 清掉该文档旧向量  
4. `vectorStore.indexDocumentChunks(saved, collectionName)` 写入新向量  
5. 批量 `isEmbedded=true`  
6. 更新 Document：`indexStatus=completed`、`chunkCount`、`outlinePath`  

MySQL 失败会回滚 chunk。Postgres 单独提交：一旦执行过第 3 步，失败时再按 `document_id` 补偿删除，避免孤儿向量。细节见笔记 8。

---

## 3. 条件执行（可选）

节点表字段 `conditionJson`，Engine 在 `execute` 前调用 `ConditionEvaluator`：

| 形式 | 含义 |
| --- | --- |
| `null` / 缺省 | 执行 |
| `boolean` | 直接 true/false |
| `{ field, op, value }` | `eq` / `ne` / `in` / `contains`；`field` 支持点分路径如 `mimeType`、`metadata.author` |
| `{ all: [...] }` | AND |
| `{ any: [...] }` | OR |
| `{ not: ... }` | 取反 |

不满足条件 → TaskNode 记 `skipped`，仍沿 `nextNodeId` 前进。

示例（仅 PDF 走某增强节点）：

```json
{ "field": "mimeType", "op": "eq", "value": "application/pdf" }
```

---

## 4. 默认 Pipeline 种子配置

来源：`seed-default-pipeline.ts`

| order | nodeId | nodeType | next | config |
| --- | --- | --- | --- | --- |
| 1 | fetcher | FETCHER | parser | `{}` |
| 2 | parser | PARSER | enhancer | `{}` |
| 3 | enhancer | ENHANCER | chunker | `{}` |
| 4 | chunker | CHUNKER | enricher | `strategy: structure_aware, maxChars: 1000, overlapBlockCount: 1` |
| 5 | enricher | ENRICHER | indexer | `tagIntent: true, intentMinScore: 2` |
| 6 | indexer | INDEXER | null | `{}` |

`startNodeId = fetcher`。

---

## 5. Nest 装配关系（便于对照学习）

```text
IngestionModule
  providers: Fetcher/Parser/Enhancer/Chunker/Enricher/Indexer
  multi-provide: INGESTION_NODE → 上述 6 个
  IngestionNodeRegistry(@Inject(INGESTION_NODE) nodes[])
  IngestionEngine(registry + repos + ConditionEvaluator)
```

模式与 RAG 侧 `SEARCH_CHANNELS` / MCP 侧 `MCP_PARAMETER_EXTRACTOR` 同构：**接口 + Token 多实现 + Registry**。

---

## 6. 和「对话 RAG」的边界

| | 摄取 Pipeline（本文） | 对话 StreamChatPipeline |
| --- | --- | --- |
| 时机 | 文档上传后异步 | 用户发消息实时 |
| 产物 | Chunk + 向量索引 | LLM 流式回答 |
| 入口 | BullMQ → `IngestionEngine` | `POST /ai/chat` → `ChatService` |
| 目录 | `modules/ai/ingestion/` | `modules/ai/chat/pipeline/` |

检索时读的是 INDEXER 写好的向量与 chunk；对话链路在 `MultiChannelRetrievalEngine` 等处消费。

---

## 7. 调试速查

| 现象 | 优先看 |
| --- | --- |
| 读文件失败 | Document.filePath、FETCHER 日志 |
| 解析为空 / 选错 Parser | **mimeType 是否仅来自后缀**（见 §2.1.1）；魔数与扩展名是否一致 |
| 切分过碎/过大 | CHUNKER config `maxChars` / `strategy` |
| 意图检索不准 | ENRICHER `tagIntent`、`intentMinScore` |
| 向量有库无标 / 半成功 | INDEXER 补偿删除与 `isEmbedded`；TaskNode errorMessage |
| 某节点被跳过 | `conditionJson` + TaskNode status=`skipped` |
| 死循环 | `nextNodeId` 成环；Engine `maxIterations=100` |

Task 表：`t_ingestion_task` / `t_ingestion_task_node`（以实体为准）。
