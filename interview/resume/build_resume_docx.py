# -*- coding: utf-8 -*-
"""不依赖 python-docx，用标准库直接构建 docx（复刻 skill 模板视觉规格）。"""
import os
import zipfile
from xml.sax.saxutils import escape

ACCENT = "1A535C"
TEXT = "222222"
MUTED = "5A5A5A"
LATIN = "Aptos"
CJK = "微软雅黑"
TAB_RIGHT = 9639  # twips, 正文宽度约 17cm


def run(text, sz=20, bold=False, color=TEXT, italic=False):
    rpr = ['<w:rFonts w:ascii="%s" w:hAnsi="%s" w:eastAsia="%s"/>' % (LATIN, LATIN, CJK)]
    if bold:
        rpr.append("<w:b/>")
    if italic:
        rpr.append("<w:i/>")
    rpr.append('<w:color w:val="%s"/>' % color)
    rpr.append('<w:sz w:val="%d"/><w:szCs w:val="%d"/>' % (sz, sz))
    return '<w:r><w:rPr>%s</w:rPr><w:t xml:space="preserve">%s</w:t></w:r>' % ("".join(rpr), escape(text))


def para(runs, jc=None, before=0, after=0, indent=0, border=False, tab=False, line=252):
    ppr = ['<w:spacing w:before="%d" w:after="%d" w:line="%d" w:lineRule="auto"/>' % (before, after, line)]
    if indent:
        ppr.append('<w:ind w:left="%d"/>' % indent)
    if jc:
        ppr.append('<w:jc w:val="%s"/>' % jc)
    if tab:
        ppr.append('<w:tabs><w:tab w:val="right" w:pos="%d"/></w:tabs>' % TAB_RIGHT)
    if border:
        ppr.append(
            '<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="2" w:color="%s"/></w:pBdr>' % ACCENT
        )
    return "<w:p><w:pPr>%s</w:pPr>%s</w:p>" % ("".join(ppr), "".join(runs))


def section_title(title):
    return para([run(title, sz=24, bold=True, color=ACCENT)], before=200, after=60, border=True)


def entry(title, meta="", subtitle="", bullets=()):
    out = []
    if meta:
        out.append(
            para(
                [run(title, sz=20, bold=True), run("\t" + meta, sz=20, color=MUTED)],
                before=80, after=20, tab=True,
            )
        )
    else:
        out.append(para([run(title, sz=20, bold=True)], before=80, after=20))
    if subtitle:
        out.append(para([run(subtitle, sz=20, color=MUTED, italic=True)], after=20))
    for b in bullets:
        out.append(para([run("• " + b, sz=20)], indent=284, after=20))
    return "".join(out)


def skill_line(cat, content):
    return para([run(cat + "：", sz=20, bold=True), run(content, sz=20)], after=20)


def build_body(with_photo):
    parts = []
    parts.append(para([run("谢飞", sz=36, bold=True, color=ACCENT)], jc="center", before=0, after=40))
    parts.append(
        para(
            [run("男 ｜ 27岁 ｜ 3年经验 ｜ 18355362032 ｜ 1145986889@qq.com ｜ 安徽芜湖", sz=20, color=MUTED)],
            jc="center", after=120,
        )
    )
    parts.append(
        para(
            [
                run("求职意向：", sz=20, bold=True, color=ACCENT),
                run(
                    "前端开发工程师（合肥）｜ 期望薪资 14-16K ｜ 3 年企业级中后台前端开发经验，"
                    "深耕 Vue3/TS 技术栈与前端工程化体系，具备万级数据表格、首屏性能专项与 SSE 实时交互落地经验，"
                    "期望在储能、物联网监控平台方向长期深耕。",
                    sz=20,
                ),
            ],
            after=120,
        )
    )

    parts.append(section_title("教育背景"))
    parts.append(entry("南京信息工程大学", "2020.09-2023.06", "硕士研究生 ｜ 管理科学与工程"))
    parts.append(entry("安徽财经大学", "2016.09-2020.06", "本科 ｜ 管理科学与工程"))

    parts.append(section_title("工作经历"))
    parts.append(
        entry(
            "江苏金恒信息科技股份有限公司",
            "2023.07-至今",
            "前端开发工程师 ｜ 南京",
            [
                "负责企业级业务平台前端底座建设、低代码组件库开发与全平台前端性能专项治理，主导 Module Federation 微前端架构改造落地。",
            ],
        )
    )

    parts.append(section_title("项目经历"))
    parts.append(
        entry(
            "JH4J 企业业务平台前端底座",
            "2023.07-至今",
            "技术栈：Vue3、TypeScript、Pinia、Vue Router、Element Plus、TanStack Table、Module Federation、Vite",
            [
                "微前端架构改造：主导基于 Module Federation 的主应用/多业务子应用架构拆分，实现子应用独立开发、独立部署与运行时动态加载远程模块；针对多应用共存场景设计共享依赖抽取与版本协商策略，规避跨子应用依赖版本冲突；实现开发环境「本地 Monorepo 源码优先、远程联邦兜底」的联调方案，显著提升多应用联调效率。",
                "工程化体系建设：采用 pnpm workspace 搭建 Monorepo，完成多包依赖隔离与版本统一管控；开发自定义 Vite 插件，修复 unplugin-vue-components 自动导入 Element Plus 引发的模块联邦共享 scope 失效问题；落地 husky + lint-staged + commitlint，统一代码校验与 Git 提交规范。",
                "低代码组件库建设：负责 AdvanceTable、UserPicker 等核心组件开发与性能优化，参与 JSON Schema 声明式渲染与可视化编排迭代。AdvanceTable 基于 TanStack Table 二次封装，采用 Engine + Feature 插件架构扩展单元格编辑、行列合并能力，集成行列双维度虚拟滚动支撑万级数据渲染与编辑，封装 DataSource 统一请求、分页、排序、筛选与树形转换；UserPicker 通过 Chrome Performance 定位万级数据选中卡顿，以 Map 哈希查找替代数组遍历，整体复杂度 O(n²)→O(n)。",
                "首屏性能专项治理：主导平台首屏加载性能专项——基于 Module Federation 将组件拆分为独立远程模块按需懒加载、首页图片统一转 WebP 压缩、编写脚本扫描源码提取中文字符集并配合 subset-font 生成字体子集（未收录字符回退全量字体，首屏加载完成后 link prefetch 异步加载）；首屏资源体积 23.1MB→3.5MB，LCP 10.8s→2.3s，Lighthouse 性能评分 52→98。",
            ],
        )
    )
    parts.append(
        entry(
            "RAG 智能问答",
            "2026.05-至今",
            "技术栈：NestJS 11 + Fastify + TypeORM + PostgreSQL(pgvector) + Redis + BullMQ + MCP ｜ Vue3 + Ant Design Vue + Vite",
            [
                "摄取编排引擎：设计 DB 驱动的六类节点注册表编排引擎，节点以 nextNodeId 链式编排并支持条件跳过；Task/TaskNode 双表记录执行链路，单节点失败可定位、可重试，重试按幂等设计避免重复写入。",
                "结构感知分块：自研 Parser 将文档解析为 Block 模型（heading/paragraph/table/code/list），Chunker 按块语义贪心合并、表格与代码块原子保留，并通过 HeadingBlock 累积 outlinePath 形成章节层级路径，保留检索所需的语义结构。",
                "意图树 + 多通道检索：三级意图树缓存于 Redis，对话侧单次 LLM 调用完成候选打分，JSON 输出 + ID 校验防幻觉，校验失败自动 fallback；检索侧意图定向 / 全局向量 / 关键词三通道并行召回、按优先级融合，意图定向空结果自动降级，兼顾准确率与召回率。",
                "MCP 工具调用：独立 mcp-server 提供工具，后端启动自动发现注册；LLM 从口语化问题提取结构化参数并做参数校验；工具发现、意图分类、运行时执行三层权限校验，无权工具对 LLM 不可见。",
                "LLM 网关与流式问答：统一封装多模型接入，实现模型路由 + 三态熔断 + 降级链；基于 SSE 实现流式输出，支持首包超时、Redis 广播取消与上游请求真正终止。",
            ],
        )
    )

    parts.append(section_title("技能"))
    parts.append(skill_line("语言基础", "HTML5/CSS3/JavaScript（ES6+）；TypeScript，掌握泛型与高级类型的工程应用"))
    parts.append(skill_line("框架生态", "Vue3 全家桶（Vue Router、Pinia、Element Plus、VueUse），理解响应式原理与编译时优化"))
    parts.append(skill_line("工程化", "Vite/Webpack 构建配置与优化、自定义 Vite 插件；pnpm workspace Monorepo；ESLint/Prettier/Husky/Lint-Staged 规范体系"))
    parts.append(skill_line("架构与性能", "Module Federation 微前端架构落地；虚拟滚动、Tree Shaking、Code Splitting；首屏 LCP/FCP 专项治理"))
    parts.append(skill_line("实时交互", "熟悉 SSE 流式数据交互，具备流式推送、连接取消与状态同步的开发经验"))
    parts.append(skill_line("服务端", "了解 Node.js + NestJS，实践过完整后端项目（企业知识库 RAG 问答系统）；熟悉常用数据结构与算法"))

    sect = (
        '<w:sectPr><w:headerReference w:type="default" r:id="rId2"/>'
        '<w:pgSz w:w="11906" w:h="16838"/>'
        '<w:pgMar w:top="850" w:right="1077" w:bottom="850" w:left="1077" '
        'w:header="340" w:footer="340" w:gutter="0"/></w:sectPr>'
    )
    return "".join(parts) + sect


NS = (
    'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" '
    'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
    'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" '
    'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
    'xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"'
)

DOC_HEAD = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document %s><w:body>' % NS
DOC_TAIL = "</w:body></w:document>"

HEADER_EMPTY = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:hdr %s><w:p/></w:hdr>' % NS
)

# 3.0cm x 3.52cm（原图 3:4，底部裁掉 12% 去掉水印区）
CX = 1080000
CY = 1267000
HEADER_PHOTO = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:hdr %s>'
    '<w:p><w:pPr><w:jc w:val="right"/><w:spacing w:after="0"/></w:pPr><w:r><w:drawing>'
    '<wp:inline distT="0" distB="0" distL="0" distR="0">'
    '<wp:extent cx="%d" cy="%d"/><wp:docPr id="1" name="photo"/>'
    '<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">'
    '<pic:pic><pic:nvPicPr><pic:cNvPr id="1" name="photo.jpg"/><pic:cNvPicPr/></pic:nvPicPr>'
    '<pic:blipFill><a:blip r:embed="rId1"/><a:srcRect b="12000"/>'
    '<a:stretch><a:fillRect/></a:stretch></pic:blipFill>'
    '<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="%d" cy="%d"/></a:xfrm>'
    '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>'
    '</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p></w:hdr>'
) % (NS, CX, CY, CX, CY)

STYLES = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
    '<w:styles %s><w:docDefaults><w:rPrDefault><w:rPr>'
    '<w:rFonts w:ascii="%s" w:hAnsi="%s" w:eastAsia="%s"/>'
    '<w:sz w:val="20"/><w:szCs w:val="20"/><w:color w:val="%s"/>'
    "</w:rPr></w:rPrDefault><w:pPrDefault><w:pPr>"
    '<w:spacing w:after="0" w:line="252" w:lineRule="auto"/>'
    "</w:pPr></w:pPrDefault></w:docDefaults>"
    '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>'
    "</w:styles>"
) % (NS, LATIN, LATIN, CJK, TEXT)

CONTENT_TYPES = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
    '<Default Extension="xml" ContentType="application/xml"/>'
    '<Default Extension="jpg" ContentType="image/jpeg"/>'
    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
    '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>'
    '<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>'
    "</Types>"
)

ROOT_RELS = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>'
    "</Relationships>"
)

DOC_RELS = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
    '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>'
    "</Relationships>"
)

HEADER_RELS = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/photo.jpg"/>'
    "</Relationships>"
)


def build(out_path, photo_path=None):
    with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", CONTENT_TYPES)
        z.writestr("_rels/.rels", ROOT_RELS)
        z.writestr("word/document.xml", DOC_HEAD + build_body(bool(photo_path)) + DOC_TAIL)
        z.writestr("word/styles.xml", STYLES)
        z.writestr("word/_rels/document.xml.rels", DOC_RELS)
        z.writestr("word/header1.xml", HEADER_PHOTO if photo_path else HEADER_EMPTY)
        z.writestr(
            "word/_rels/header1.xml.rels",
            HEADER_RELS
            if photo_path
            else (
                '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
                '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>'
            ),
        )
        if photo_path:
            with open(photo_path, "rb") as f:
                z.writestr("word/media/photo.jpg", f.read())
    return out_path


if __name__ == "__main__":
    base = os.path.dirname(os.path.abspath(__file__))
    photo = r"C:\Users\11459\xwechat_files\wxid_byk6wfhody0j12_205e\temp\RWTemp\2026-11\9e20f478899dc29eb19741386f9343c8\68bff46eb85989b85b2d7ee96ee02134.jpg"
    p1 = build(os.path.join(base, "谢飞_华致能源_Web前端.docx"), photo if os.path.exists(photo) else None)
    p2 = build(os.path.join(base, "谢飞_华致能源_Web前端_无照片.docx"), None)
    print("generated:", p1)
    print("generated:", p2)
