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

使用node pdf-parse库加载和解析PDF文档。

生产环境可以使用python的`unstructured`库，如果node中要使用`unstructured-client`库调用API实现解析。

```ts
const buffer = typeof content === 'string' ? Buffer.from(content) : content
// pdf-parse v2 使用 PDFParse 类，data 接受 Uint8Array
const parser = new PDFParse({ data: new Uint8Array(buffer) })
```

##### 加密 / 禁止复制 / 水印 PDF

密码 PDF：`PyPDF2` / `pdfplumber` 传入密码解密后提取。
禁止复制：放弃文本提取，PDF 转高清图片走 OCR 路线绕过权限。
水印：解析后正则过滤重复水印字符。

注意：仅对企业自有文档解密，不破解版权文件。`pdfplumber` 对比 `PyPDF2` 对受限 PDF 兼容性更强。

##### 扫描件 PDF、拍照、手写文稿（OCR 链路）

必须前置图像预处理：灰度、去噪、倾斜矫正、裁剪，直接影响识别准确率。

离线私有部署：PaddleOCR / EasyOCR
商用高精度：阿里云 / 腾讯云 OCR（表格、公文优化好）
手写：使用手写专项 OCR 模型

流程：PDF 拆页 → 图片预处理 → OCR 识别 → 修正断行语序。

#### Excel

不要直接读原始表格符号；保留表头-行-列业务关系，转为自然语言段落。工具：`openpyxl`。

#### PPT

区分标题 / 正文 / 演讲备注；剔除纯配图无效页；合并同主题连续页面。工具：`python-pptx`。

#### Markdown

使用node marked库加载Markdown文档

```ts
const text = typeof content === 'string' ? content : content.toString('utf8')
const tokens = marked.lexer(text)
```

#### 竖排、繁体、多语种

竖排：语序转正，还原阅读顺序。
繁简统一：全部转为简体。
编码自动探测：UTF-8 / GBK / GB2312，解决乱码。
多语种文档建议分独立知识库，避免语义混杂。

#### 噪声过滤：页眉页脚、页码、空白页、广告

落地规则：
1. 坐标位置特征剔除页眉、页脚、页码
2. 按字符阈值丢弃空白页
3. 黑名单匹配广告、版权声明

减少无效文本，节省向量库空间，消除检索噪声。

#### 图文混排、流程图、思维导图

提取图片周边配套说明文字做关联。
流程图内文字走 OCR 识别。
纯示意图只做标记，不强解，避免编造错误信息。

#### 代码 / 配置 / 技术手册

禁止随意清理换行、缩进、特殊符号；完整保留注释；章节拆分保证案例与解释不分离。

#### 企业级流水线

标准化顺序不可随意调换：

```
原始文件
→ 格式判别
→ 权限解密 / 格式修复
→【扫描件走图像预处理】
→ 定向结构化提取
→ 转码修复乱码
→ 噪声过滤（页眉页脚 / 水印 / 广告）
→ 繁简统一、语序规整
→ 输出干净标准化文本
→ 进入分块预处理
```

#### rag处理流水线pipeline

```
Fetcher→Parser→Enhancer→Chunker→Enricher→Indexer 
```

- Fetcher: 如果是url，请求对应资源
- Parser：根据mimeType选择对应的parser解析文档，提取文档的文本以block[]的结构输出。
- Enhancer
