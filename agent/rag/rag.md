## RAG流程

RAG标准流程为离线和在线两个阶段。

离线阶段（向量化文档存入向量数据库，构建索引）：
1. 加载文档：读取PDF、Word、Markdown等文档
2. 内容抽取
3. 清洗文档：移除噪声、特殊字符、HTML标签等，保留有效信息
4. 文档切片：按照不同策略切分文档
5. metadata标注
6. Embedding：使用Embedding模型将文档切片转换为向量表示
7. 入库构建索引: 将切片向量存储到向量数据库中，构建索引

在线阶段（用户查询）：
1. query预处理：用模型改写、拆解、补全用户提问
2. 检索：向量召回 + 关键词召回
3. 过滤
4. 重排(reRank): 用 Cross-Encoder 重新打分排序
5. 拼接提示词：将用户查询、召回文档（Top-K）拼接为提示词
6. 生成：LLM输出回答（带引用）


## 离线阶段

### 加载文档

#### PDF

使用node pdf-parse库加载PDF文档

```ts
const buffer = typeof content === 'string' ? Buffer.from(content) : content
// pdf-parse v2 使用 PDFParse 类，data 接受 Uint8Array
const parser = new PDFParse({ data: new Uint8Array(buffer) })
```

#### Markdown

使用node marked库加载Markdown文档

```ts
const text = typeof content === 'string' ? content : content.toString('utf8')
const tokens = marked.lexer(text)
```
