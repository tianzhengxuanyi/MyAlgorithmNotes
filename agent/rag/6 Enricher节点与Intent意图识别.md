# 6. ENRICHER 节点与 Intent 意图识别

> 对应代码：`backend/src/modules/ai/ingestion/nodes/enricher.node.ts`、`backend/src/modules/ai/intent/`
> 相关笔记：[3 知识库摄取Pipeline节点梳理](./3%20知识库摄取Pipeline节点梳理.md) §2.5
> 说明：意图体系分**两个方向**——摄取期（ENRICHER 给 chunk 打标，离线）与对话期（IntentResolver 给用户问题分类，在线）。两者通过 `intentNodeId` 这个元数据在检索时汇合。

---

## 1. 全局视图：意图数据如何流动

```text
【运营侧】意图树 CRUD（ai_intent_node 表，三级：DOMAIN/CATEGORY/TOPIC）
        │
        ▼  IntentTreeCacheService：整树 JSON 存 Redis（key=ragent:intent:tree，7天 TTL + 主动失效）
┌──────────────────┐                ┌──────────────────────┐
│ 摄取期（离线）     │                │ 对话期（在线）          │
│ ENRICHER 节点     │                │ StreamChatPipeline    │
│  └ ChunkIntentTagger             │  └ IntentResolver      │
│     关键词打分 →                  │     └ DefaultIntentClassifier
│     chunk.metadata.intentNodeId  │        LLM 打分 →       │
└────────┬─────────┘                │        NodeScore[]     │
         │ INDEXER 落库              └──────────┬───────────┘
         ▼ （ai_document_chunk.metadata）        ▼ （SearchContext.subIntents）
┌────────────────────────────────────────────────────────────┐
│ 检索汇合：IntentDirectedSearchChannel                        │
│   SQL: (metadata->>'intentNodeId')::int IN (命中的意图节点id) │
└────────────────────────────────────────────────────────────┘
```

核心思想：**写侧打标、读侧过滤**。摄取时把 chunk 归属的意图写进元数据，检索时用户问题被分类成意图节点，用节点 ID 反查只属于这些意图的 chunk，实现「意图定向检索」。

---

## 2. ENRICHER 节点（摄取期，离线打标）

**文件**：`ingestion/nodes/enricher.node.ts`，Pipeline 第 5 环（CHUNKER 之后、INDEXER 之前）。

### 2.1 两件事

| 职责 | 实现 | 产物 |
| --- | --- | --- |
| 关键词提取 | 按空白/标点分词 → 长度 > 2 → 全局词频 Top 10 | `ctx.keywords`、`metadata.keywords` |
| 意图打标 | `ChunkIntentTagger.tagChunks(chunks, { kinds: [KB], minScore })` | 每个 chunk 的 `metadata.intentNodeId / intentNodePath / intentTagScore` |

### 2.2 config（已在 `getConfig()` 中声明，供 Pipeline 管理界面渲染表单）

| 字段 | 默认 | 含义 |
| --- | --- | --- |
| `tagIntent` | `true` | 是否启用意图打标 |
| `intentMinScore` | `2` | 低于该分的匹配不写入 |

执行日志：`doc=… intent 打标 tagged=m/n`；结果统计落在 `ctx.metadata.intentTag = { tagged, skipped }`。

### 2.3 为什么是「离线」打标

- 摄取是 BullMQ 异步任务，**不在用户请求路径上**，打标慢一点无所谓；
- 用**纯关键词打分**而非 LLM：chunk 数量大（一个文档几十上百个），逐 chunk 调 LLM 成本不可接受；关键词方案零成本、可解释、可复现。

---

## 3. ChunkIntentTagger：打分规则详解

**文件**：`intent/chunk-intent-tagger.ts`

### 3.1 候选来源

`IntentTreeCacheService.getActiveLeaves()` → 过滤 `kind === KB`。只有 **TOPIC 叶子** 且 `status=1` 的节点参与（非叶子只是目录，SYSTEM/MCP 类不需要 chunk 打标）。无可用叶子时 warn 并整体跳过。

### 3.2 比对文本（haystack）

```text
chunk.content + chunk.section + chunk.outlinePath[]   → join('\n') → toLowerCase()
```

把章节标题和大纲路径也算进去——「1.2 数据安全规范」这种结构信息本身就有强意图信号。

### 3.3 打分表（top-1 胜出，低于 minScore 丢弃）

| 信号 | 规则 | 分值 |
| --- | --- | --- |
| 叶子名称 | haystack 完整包含 `name` | **+3** |
| 路径段 | `path` 按 `/` 切段，长度 ≥ 2 的段被包含 | 每段 **+1** |
| 示例问题 | haystack 完整包含某条 example | **+3** |
| 示例词级重叠 | example 分词后命中比例 ≥ 50% | **+2** |
| 描述 | description 分词取前 12 词，命中 ≥ 2 个 | **+1** |

### 3.4 写入内容

```ts
chunk.metadata = {
  ...chunk.metadata,
  intentNodeId: match.leaf.id,              // ← IntentDirected 通道的过滤依据
  intentNodePath: match.leaf.path ?? name,  // 可读路径，便于排查
  intentTagScore: match.score,              // 打标分数，便于评估阈值
}
```

随后 INDEXER 把 `metadata` 原样写入 `ai_document_chunk.metadata`，并向量表 `ai_vector_embedding.metadata` 透传（`{ section, blockType, outlinePath, ...chunk.metadata }`），检索侧才能用 SQL 过滤。

---

## 4. 对话期意图识别（在线分类）

**文件**：`intent/intent.resolver.ts` + `intent/default-intent.classifier.ts`，由 StreamChatPipeline 的 resolveIntents 阶段调用。

### 4.1 流程

```text
用户问题 → 改写/拆子问题（rewrite.subQuestions）
  → 每个子问题：
      取候选叶子（getActiveLeavesForUser，T4.8 权限过滤 MCP 叶子）
      → LLM 一次性对所有候选打 0~1 分（temperature=0.1 / topP=0.3 强确定性）
      → stripMarkdownCodeFence → JSON.parse → 防编造 id（nodeMap 校验）
      → 过滤 score < 0.35，截断 Top 3
  → ClassifyNodeScore 扁平化为 NodeScore { nodeId, nodePath, kind, score, toolId }
```

### 4.2 关键设计

| 设计 | 说明 |
| --- | --- |
| 一次调用打分全部候选 | vs 逐级分类 3 次 LLM 调用，省延迟 |
| 双角色合并 | `DefaultIntentClassifier` 同时是分类器和叶子注册表（两者强耦合） |
| 权限过滤在打分前 | 无权 MCP 叶子不进候选，LLM 根本看不到 |
| 失败降级 | 单个子问题分类失败 → 该子问题 intents 为空数组，不中断整体 |
| `isSystemOnly` | 全部命中 SYSTEM = 纯闲聊，跳过检索 |
| `mergeIntentGroup` | 按 KB / MCP / SYSTEM 分组，供 Prompt 构建和通道启用判断 |

### 4.3 NodeScore 与路由

| kind | 去向 |
| --- | --- |
| KB | RAG 检索（VectorGlobal / IntentDirected / Keyword 通道） |
| MCP | `MultiChannelRetrievalEngine` 按 `toolId` 从 `McpToolRegistry` 取执行器调工具 |
| SYSTEM | 纯 LLM 回复（闲聊/兜底） |

---

## 5. 检索汇合：IntentDirected 通道

**文件**：`rag/retrieve/channel/intent-directed.channel.ts`，priority=1（最精确通道）。

### 5.1 启用与执行

1. `isEnabled`：任一子问题存在 `kind=KB && score ≥ 0.35` 的意图
2. 收集这些意图的 `nodeId` → `intentNodeIds`
3. 向量召回 + SQL 过滤：

```sql
WHERE (metadata->>'intentNodeId')::int IN ($...)
```

### 5.2 空结果降级（短期兜底）

若带过滤结果为空（老数据没打标 / 意图树刚建），**自动去掉 intentNodeIds 再搜一次**，退化为普通向量检索，避免「高置信意图反而零召回」。日志：`intentNodeIds=[...] 过滤为空，降级为无意图过滤向量检索`。

### 5.3 已知边界

- **意图树变更后存量数据不会自动重打标**：新建/改名意图节点后，老 chunk 的 `intentNodeId` 仍旧，需重新摄取（或未来做独立的「重打标 Job」只更新 metadata 不重算向量）。降级机制保证过渡期检索可用。
- **关键词打标的精度上限**：同义词、隐式主题（如「请假流程」对应「OA 系统」叶子）打不中，需要意图节点的 `examples`/`description` 写得足够覆盖业务词汇，或后续升级为小模型/embedding 打标。

---

## 6. 调试速查

| 现象 | 优先看 |
| --- | --- |
| 意图过滤后零召回 | chunk `metadata.intentNodeId` 是否存在；是否触发了降级日志；意图树缓存是否过期（`refresh-cache`） |
| chunk 全部 skipped | KB 叶子是否为空；`intentMinScore` 是否过高；叶子 name/examples 是否与文档语言风格匹配 |
| 打标打错 | `intentTagScore` 与 `intentNodePath` 落库值；示例问题与 chunk 内容重叠度 |
| 分类结果为空 | LLM 输出 JSON 解析失败日志；`INTENT_MIN_SCORE=0.35` 阈值；候选叶子数量 |
| MCP 意图不出现 | 用户是否有该工具权限（T4.8 第二层过滤）；叶子 `toolId` 与注册工具名是否一致 |

涉及的表：`ai_intent_node`（意图树）、`ai_document_chunk.metadata`（打标结果）、`ai_vector_embedding.metadata`（检索过滤字段）；Redis key：`ragent:intent:tree`。
