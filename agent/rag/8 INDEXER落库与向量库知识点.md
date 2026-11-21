# 8. INDEXER 在做什么（给不熟向量库的人）

> 代码：`indexer.node.ts`、`rag/vector/`、`embedding/`  
> 建表：`backend/src/migrations/pgvector-ai_vector_embedding.sql`  
> 部署：[`1`](./1%20PGVector部署.md) · TypeORM 双库：[`2`](./2%20typyorm集成pgvector.md) · 整条摄取链：[`7`](./7%20RAG离线摄取Pipeline端到端流程.md)

前面 PARSER / CHUNKER / ENRICHER 只是在内存里准备好「一段段文本」。**INDEXER 负责存盘**：一份给人看、改、追溯，一份给机器「按意思找」。

---

## 1. 先搞懂：为什么要两套库

普通搜索是「关键词对上了才算」。RAG 希望用户问「怎么请假」，也能找到写着「调休申请流程」的段落——字面不一样，意思接近。

做法是：把每段文字交给 **Embedding 模型**，模型吐出一长串数字（本仓库是 **1536 个小数**）。这串数字叫 **向量（embedding）**。意思接近的两段文字，数字也接近。检索时把用户问题也变成一串同样长度的数字，再在库里找「数字最像」的几段。

MySQL **存不了、也比不了** 这种 1536 维数组，所以：

| 库 | 存什么 | 类比 |
| --- | --- | --- |
| **MySQL** | 文档、切好的原文、章节路径 | 图书馆的卡片目录 + 原文复印件 |
| **Postgres + pgvector** | 同一段原文对应的那串数字 | 按「意思远近」排的索引柜 |

**pgvector** 不是另一个产品，只是给 Postgres 加的插件：多了一种列类型 `vector`，可以用 SQL 算「两串数字有多像」。

用户提问时走的是 Postgres 这张表。MySQL 那份用来展示来源、删除文档、看切分结果。两边靠 `chunk_id`（MySQL 行的自增 id）对上。

---

## 2. INDEXER 一步步做什么

没有可配项。知识库创建时生成的 `collectionName`（一串 id，用来区分不同知识库）由 Engine 放进上下文，INDEXER 原样带上。

```text
内存里的 chunks
    │
    ├─ 如果一段都没有 → 直接成功返回，但文档不会变成「已完成」
    │                    （可能一直停在 processing）
    │
    └─ 有内容 → 开 MySQL 事务：
         ① 删掉这篇文档以前的 MySQL chunk 行（重跑时覆盖旧切分）
         ② 插入新 chunk（先标「还没做成向量」）
         ③ 按 document_id 删掉 Postgres 里该文档的旧向量
         ④ 把每段 content 送给 Embedding 模型 → 得到向量
         ⑤ 写进 Postgres 向量表
         ⑥ 把 chunk 标成「已经做成向量」
         ⑦ 文档改成 completed，记下 chunk 数量和大纲
```

```mermaid
flowchart LR
  A[内存 chunks] --> B[MySQL 存原文]
  B --> C[按文档清旧向量]
  C --> D[Embedding 模型]
  D --> E[Postgres 存新向量]
  E --> F[文档标完成]
```

调用链可以记成：INDEXER → 一层包装（写完向量后本想同步 Elasticsearch 关键词，**现在只打日志**）→ 真正写 Postgres 的服务 → Embedding 路由（选供应商、一批一批请求、失败换下一个）。

---

## 3. 两张表各写了什么

### MySQL `ai_document_chunk`（给人看的）

每段切分结果一行。重要的是 **`content`：只有这一列会拿去算向量**。章节名、大纲路径、意图 id 等放在旁边的字段 / JSON 里，方便展示和过滤，**不参与「意思像不像」的计算**。

`is_embedded` 先写成否、成功后再改成是。注释里想用来「失败了下次跳过已做好的」——**当前代码并没有这么用**，每次都是整篇删光再插。

### Postgres `ai_vector_embedding`（给机器找的）

每一行对应上面一个 chunk：

- `embedding`：那 1536 个小数  
- `content`：原文再存一份（检索命中后直接返回，少查一次 MySQL）  
- `chunk_id` / `document_id` / `knowledge_base_id`：对回业务库  
- `collection_name`：这个知识库的代号  
- `metadata`：章节、块类型、**意图 id** 等 JSON  

意图检索过滤的是 **Postgres 这一份 JSON**，不是只写在 MySQL。ENRICHER 打在 chunk 上的 `intentNodeId`，这里必须拷过来，在线问答才能「只搜某个意图下的段落」。

向量写入用原生 SQL：`'[0.1,0.2,...]'::vector`。TypeORM 不认 `vector` 这种列类型，所以不用 Entity.save。

---

## 4. 几个检索相关的词（只记会碰到的）

**余弦距离 `<=>`**  
pgvector 用它表示「两串数字差多远」。0 很像，数字越大越不像。代码里的分数是 `1 - 距离`，所以分数越高越像，再和阈值比较。

**HNSW**  
向量很多时，不能每次把全表扫一遍。HNSW 是一种「近似查找」索引：先在一张近邻图上走，很快找出「大概最像」的前 K 条。可能漏掉极个别更像的，但够快。本仓库全库 **共用一个** 这种索引。

**`ef_search = 200`**  
查的时候多看一些候选，更不容易漏，也更慢一点。

**为什么不是一个知识库一张向量表？**  
小知识库向量很少，单独建图效果差。大家挤在同一张表、同一个索引上，查的时候加一句 `WHERE collection_name = 这个知识库`，既隔离、图又够大。删整个知识库就是按这个名字 DELETE。

**维度必须一致**  
列写死 `vector(1536)`，对应 `text-embedding-3-small` 这类模型。换了 1024 维的模型，插入会报错，而且不能和旧向量混在一列里，只能改列并全部重做。一批文本也必须由 **同一个** Embedding 供应商做完，避免维数混用。

---

## 5. 两库仍不能当一次事务，但垃圾向量会清掉

MySQL 和 Postgres 是两台库，没有「一起提交、一起撤销」。Postgres 在「写向量」这个函数 **里面就提交了**，然后才回到 MySQL 事务。注释里如果写「失败就全部回滚」，那只对 MySQL 成立。

INDEXER 用两步把两边对齐到「这篇文档要么能搜到新内容，要么暂时搜不到、等重试」：

1. **写新向量前**按 `document_id` 删掉该文档在 Postgres 里的旧行（和用户点「删除文档」是同一句 SQL）。同一文档再跑一遍 INDEXER 不会把过时段落留在检索里。
2. **一旦已经改过 Postgres**（旧向量已删，或新向量已写入），后面 MySQL 失败时再按 `document_id` 补偿删除。MySQL 回滚后不会留下「对着已不存在的 chunk_id」的新向量。

补偿本身失败只打错误日志，原错误仍会抛出，文档变成 failed，需要重试或手工核对两库。进程在清旧向量之后、补偿之前被杀掉，这篇会暂时搜不到，重跑 INDEXER 会再写一遍。

用户点「删除文档」仍是先按 `document_id` 清 Postgres，再删 MySQL。重建整个知识库仍按 `collection_name` 清空向量。

包装层约定：Postgres 必须成功；后面那个关键词索引失败只打日志（现在根本没接上）。

---

## 6. 和删除、重建比一眼

| 你做的事 | MySQL 原文 | Postgres 向量 |
| --- | --- | --- |
| 这篇文档再跑一遍 INDEXER | 删旧 chunk，再插入 | 先按 document_id 删旧，再插入新的 |
| 删除这篇文档 | 删 chunk 和文档 | 按 document_id 删掉 |
| 重建整个知识库 | 清空 chunk，文档重新排队 | 按知识库名字整表清空 |
| INDEXER 已改 Postgres 后 MySQL 失败 | 事务回滚，旧 chunk 还在 | 补偿删除该文档全部向量，等重试再写 |

---

## 7. 出问题先看这

| 现象 | 先怀疑 |
| --- | --- |
| 显示完成但搜不到 | 检索有没有带对的知识库 `collection_name`；是不是被意图过滤挡掉了 |
| 搜到重复或过时段落 | 旧版 INDEXER 重跑过且没清向量；当前会先按 document_id 删除 |
| 插入报维度错误 | 当前 Embedding 模型不是 1536 维 |
| 文档 failed、库里没有该文档向量 | 可能是补偿删除已执行，等队列重试即可 |
| 日志出现「补偿删除向量失败」 | 两库对一下该 document_id；可能需手工 DELETE 或再跑摄取 |
| 很慢 | Embedding 接口限流，或一条条 INSERT 还要维护 HNSW 图 |
| 意图通道没结果 | 向量行的 JSON 里有没有 `intentNodeId`（ENRICHER 可能整批跳过了） |

表：MySQL `ai_document`、`ai_document_chunk`；Postgres `ai_vector_embedding`。

---

## 8. 相关文件

```text
ingestion/nodes/indexer.node.ts              本节点
rag/vector/pg-vector-store.service.ts        算向量 + 写入/检索 SQL
rag/vector/keyword-syncing-vector-store.ts   写完后的附加动作（目前空）
rag/vector/vector-store.module.ts            包装关系
core/infra-ai/embedding/embedding.provider.ts
migrations/pgvector-ai_vector_embedding.sql
knowledge/knowledge.service.ts               删文档、重建时清向量
```

---

INDEXER = MySQL 存原文卡片 + Postgres 存「意思指纹」。检索比的是指纹像不像；知识库靠名字隔开。两库不能当一次事务：写新指纹前先按文档清旧的，MySQL 失败再补偿删掉刚写的。
