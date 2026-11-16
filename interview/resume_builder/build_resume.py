# -*- coding: utf-8 -*-
"""
按「个人简历」版式规格生成 docx（复刻 resume_final.pdf 的版式）

用法：
    python build_resume.py content.json 输出文件.docx
    python build_resume.py content.json 输出文件.docx --photo 自定义照片.png

版式来源：resume_final.pdf（615.1x870pt 图纸，A4 等比放大 1.0333），
本脚本按 A4（595.3x841.9pt）还原，所有尺寸已除以 1.0333 换算。
"""
import json
import os
import sys

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_BREAK, WD_LINE_SPACING, WD_TAB_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

# ---------------------------------------------------------------- 版式常量
PAGE_W, PAGE_H = 595.3, 841.9          # A4 pt
MARGIN_L, MARGIN_R = 18.4, 21.9        # 左右页边距
MARGIN_T, MARGIN_B = 9.0, 22.0         # 上下页边距
CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R  # 555pt

C_PRIMARY = "4E7282"   # 主色：深青蓝
C_GOLD = "C19F67"      # 辅色：金铜
C_TEXT_H = "333333"    # 标题/条目标题
C_TEXT_B = "555555"    # 正文
C_WHITE = "FFFFFF"

FONT_EA = "微软雅黑"
FONT_ASCII = "Arial"

SZ_TITLE = 27.5        # 个人简历
SZ_SECTION = 12.0      # 板块标题
SZ_ENTRY = 10.5        # 条目头（单位/项目名/岗位）
SZ_BODY = 9.5          # 正文

IND_BODY = 25.9        # 正文左缩进
IND_BULLET = 40.1      # 项目符号续行缩进
IND_BULLET_HANG = 8.8  # 项目符号悬挂
LINE_BODY = 16.0       # 正文固定行距
LINE_ENTRY = 18.9      # 条目头行距
SEC_GAP_BEFORE = 14.0  # 板块标题前的间距
SEC_GAP_AFTER = 13.7   # 板块标题后的间距

TAB_CENTER = 277.0     # 条目头中栏
BAR_SLATE_W = 360.0    # 标题下方深色粗条宽度
BAR_GAP_W = 8.0        # 粗细条之间的留白
BAR_H = 17.0           # 深色粗条高度
BAR_GOLD_TOP = 4.0     # 金色条顶部内缩（顶部 4pt 留白，用白色上边框实现）
ENTRY_GAP_EDU = 8.0    # 教育背景条目之间的额外间距

HDR_BOX_W = 101.6      # 板块标题色块宽
HDR_BOX_H = 17.4

INFO_ROW_H = 18.6
INFO_COLS = [55.6, 158.5, 53.0, 188.0, 66.6]   # 标签1/值1/标签2/值2/照片
INFO_IND = 25.9        # 基本信息表格整体左缩进


# ---------------------------------------------------------------- 基础工具
TBLPR_ORDER = ("w:tblStyle", "w:tblpPr", "w:tblOverlap", "w:bidiVisual", "w:tblStyleRowBandSize",
               "w:tblStyleColBandSize", "w:tblW", "w:jc", "w:tblCellSpacing", "w:tblInd",
               "w:tblBorders", "w:shd", "w:tblLayout", "w:tblCellMar", "w:tblLook",
               "w:tblCaption", "w:tblDescription")
TRPR_ORDER = ("w:cnfStyle", "w:divId", "w:gridBefore", "w:gridAfter", "w:wBefore", "w:wAfter",
              "w:cantSplit", "w:trHeight", "w:tblHeader", "w:tblCellSpacing", "w:jc", "w:hidden")


def _el(tag, **attrs):
    e = OxmlElement(tag)
    for k, v in attrs.items():
        e.set(qn(k), str(v))
    return e


def _put(parent, el, order):
    """按 OOXML 规定顺序插入（同标签已存在则替换），避免重复与乱序导致 Word 忽略属性。"""
    tag = el.tag
    for old in parent.findall(tag):
        parent.remove(old)
    idx = order.index(_short(tag)) if _short(tag) in order else len(order)
    for child in list(parent):
        c = _short(child.tag)
        if c in order and order.index(c) > idx:
            child.addprevious(el)
            return el
    parent.append(el)
    return el


def _short(tag):
    return tag.replace("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}", "w:")


def shade(cell, color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = _el("w:shd", **{"w:val": "clear", "w:color": "auto", "w:fill": color})
    for old in tcPr.findall(qn("w:shd")):
        tcPr.remove(old)
    # shd 在 tcPr 中位于 tcBorders 之后、noWrap 之前
    tcPr.append(shd)


def table_no_borders(table):
    borders = _el("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        borders.append(_el("w:" + edge, **{"w:val": "none", "w:sz": "0", "w:space": "0", "w:color": "auto"}))
    _put(table._tbl.tblPr, borders, TBLPR_ORDER)


def table_cell_margins(table, left=0, right=0, top=0, bottom=0):
    mar = _el("w:tblCellMar")
    for name, val in (("top", top), ("left", left), ("bottom", bottom), ("right", right)):
        mar.append(_el("w:" + name, **{"w:w": int(val * 20), "w:type": "dxa"}))
    _put(table._tbl.tblPr, mar, TBLPR_ORDER)


def table_layout_fixed(table, total_w, indent=0):
    tblPr = table._tbl.tblPr
    _put(tblPr, _el("w:tblLayout", **{"w:type": "fixed"}), TBLPR_ORDER)
    _put(tblPr, _el("w:tblW", **{"w:w": int(total_w * 20), "w:type": "dxa"}), TBLPR_ORDER)
    if indent:
        _put(tblPr, _el("w:tblInd", **{"w:w": int(indent * 20), "w:type": "dxa"}), TBLPR_ORDER)


def set_col_widths(table, widths):
    grid = table._tbl.find(qn("w:tblGrid"))
    if grid is not None:
        for gc, w in zip(grid.findall(qn("w:gridCol")), widths):
            gc.set(qn("w:w"), str(int(w * 20)))
    for row in table.rows:
        for cell, w in zip(row.cells, widths):
            cell.width = Pt(w)


def row_height(row, h, exact=True):
    trPr = row._tr.get_or_add_trPr()
    _put(trPr, _el("w:trHeight", **{"w:val": int(h * 20), "w:hRule": "exact" if exact else "atLeast"}), TRPR_ORDER)


def cell_border(cell, edge, color, sz=6):
    tcPr = cell._tc.get_or_add_tcPr()
    borders = tcPr.find(qn("w:tcBorders"))
    if borders is None:
        borders = _el("w:tcBorders")
        # tcBorders 位于 tcW 之后、shd 之前
        tcW = tcPr.find(qn("w:tcW"))
        if tcW is not None:
            tcW.addnext(borders)
        else:
            tcPr.insert(0, borders)
    for old in borders.findall(qn("w:" + edge)):
        borders.remove(old)
    borders.append(_el("w:" + edge, **{"w:val": "single", "w:sz": str(sz), "w:space": "0", "w:color": color}))


def style_run(run, size, color, bold=False, ea=FONT_EA, ascii_font=FONT_ASCII):
    run.font.size = Pt(size)
    run.font.color.rgb = RGBColor.from_string(color)
    run.font.bold = bold
    run.font.name = ascii_font
    rPr = run._element.get_or_add_rPr()
    rFonts = rPr.find(qn("w:rFonts"))
    if rFonts is None:
        rFonts = _el("w:rFonts")
        rPr.append(rFonts)
    rFonts.set(qn("w:ascii"), ascii_font)
    rFonts.set(qn("w:hAnsi"), ascii_font)
    rFonts.set(qn("w:eastAsia"), ea)
    rFonts.set(qn("w:cs"), ascii_font)
    return run


def para(container, line=LINE_BODY, indent=0, hang=0, before=0, after=0, align=None):
    p = container.add_paragraph()
    pf = p.paragraph_format
    pf.space_before = Pt(before)
    pf.space_after = Pt(after)
    pf.line_spacing_rule = WD_LINE_SPACING.EXACTLY
    pf.line_spacing = Pt(line)
    if indent:
        pf.left_indent = Pt(indent)
    if hang:
        pf.first_line_indent = Pt(-hang)
    if align is not None:
        p.alignment = align
    return p


def spacer(doc, height):
    p = para(doc, line=height)
    style_run(p.add_run(" "), 1, C_WHITE)
    return p


def add_page_left_rule(section, color=C_PRIMARY, space=30.5):
    """页面左侧竖线（贴页边，贯穿整页）"""
    sectPr = section._sectPr
    pgBorders = _el("w:pgBorders", **{"w:offsetFrom": "page"})
    pgBorders.append(_el("w:left", **{"w:val": "single", "w:sz": "6", "w:space": str(space), "w:color": color}))
    sectPr.append(pgBorders)


# ---------------------------------------------------------------- 各版块
def build_title(doc, data, base_dir):
    icons = [os.path.join(base_dir, p) for p in data.get("icons", []) if os.path.exists(os.path.join(base_dir, p))]
    p = para(doc, line=30.0, before=6.0)
    p.paragraph_format.tab_stops.add_tab_stop(Pt(CONTENT_W), WD_TAB_ALIGNMENT.RIGHT)
    style_run(p.add_run(data.get("title", "个人简历")), SZ_TITLE, C_PRIMARY)
    if icons:
        style_run(p.add_run("\t"), SZ_TITLE, C_PRIMARY)
        for i, ic in enumerate(icons):
            if i:
                style_run(p.add_run(" "), 8, C_WHITE)
            p.add_run().add_picture(ic, width=Pt(29))
    # 标题下：深色粗条 + 留白 + 金色细条（出血到页面两侧，金色条底部与粗条底部对齐）
    spacer(doc, 10.4)
    bar = doc.add_table(rows=1, cols=3)
    bar.alignment = WD_TABLE_ALIGNMENT.LEFT
    table_no_borders(bar)
    table_cell_margins(bar)
    table_layout_fixed(bar, PAGE_W, indent=-MARGIN_L)
    row_height(bar.rows[0], BAR_H)
    set_col_widths(bar, [BAR_SLATE_W, BAR_GAP_W, PAGE_W - BAR_SLATE_W - BAR_GAP_W])
    shade(bar.cell(0, 0), C_PRIMARY)
    shade(bar.cell(0, 2), C_GOLD)
    cell_border(bar.cell(0, 2), "top", C_WHITE, sz=int(BAR_GOLD_TOP * 8))
    for c in (0, 1, 2):
        cp = bar.cell(0, c).paragraphs[0]
        cp.paragraph_format.space_before = Pt(0)
        cp.paragraph_format.space_after = Pt(0)
        cp.paragraph_format.line_spacing_rule = WD_LINE_SPACING.EXACTLY
        cp.paragraph_format.line_spacing = Pt(1)
        style_run(cp.add_run(""), 1, C_WHITE)


def page_break(doc):
    """插入分页符，用 1pt 行高包裹，避免在新页顶部多出空行"""
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.space_before = Pt(0)
    pf.space_after = Pt(0)
    pf.line_spacing_rule = WD_LINE_SPACING.EXACTLY
    pf.line_spacing = Pt(1)
    p.add_run().add_break(WD_BREAK.PAGE)


def build_section_header(doc, title):
    t = doc.add_table(rows=1, cols=2)
    table_no_borders(t)
    table_cell_margins(t, left=0, right=0)
    table_layout_fixed(t, CONTENT_W)
    row_height(t.rows[0], HDR_BOX_H)
    set_col_widths(t, [HDR_BOX_W, CONTENT_W - HDR_BOX_W])
    box = t.cell(0, 0)
    shade(box, C_PRIMARY)
    p = box.paragraphs[0]
    p.paragraph_format.left_indent = Pt(17.9)
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.EXACTLY
    p.paragraph_format.line_spacing = Pt(HDR_BOX_H)
    style_run(p.add_run(title), SZ_SECTION, C_WHITE, bold=False)
    # 右侧细线：贴在色块底边
    line_cell = t.cell(0, 1)
    cell_border(line_cell, "bottom", C_PRIMARY, sz=8)
    lp = line_cell.paragraphs[0]
    lp.paragraph_format.space_before = Pt(0)
    lp.paragraph_format.space_after = Pt(0)
    lp.paragraph_format.line_spacing_rule = WD_LINE_SPACING.EXACTLY
    lp.paragraph_format.line_spacing = Pt(1)
    style_run(lp.add_run(""), 1, C_WHITE)


def build_basic(doc, data, base_dir, photo=None):
    rows = data["rows"]
    t = doc.add_table(rows=len(rows), cols=5)
    table_no_borders(t)
    table_cell_margins(t, left=0, right=0)
    table_layout_fixed(t, sum(INFO_COLS), indent=INFO_IND)
    set_col_widths(t, INFO_COLS)
    for i, row in enumerate(rows):
        row_height(t.rows[i], INFO_ROW_H)
        for j, (label, value) in enumerate(row):
            lc, vc = t.cell(i, j * 2), t.cell(i, j * 2 + 1)
            for cell, text, color, bold in ((lc, label + "：" if label else "", C_TEXT_H, False), (vc, value, C_TEXT_H, False)):
                p = cell.paragraphs[0]
                p.paragraph_format.space_before = Pt(0)
                p.paragraph_format.space_after = Pt(0)
                p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.EXACTLY
                p.paragraph_format.line_spacing = Pt(INFO_ROW_H)
                if text:
                    style_run(p.add_run(text), SZ_BODY, color, bold=bold)
    if photo:
        photo_path = os.path.join(base_dir, photo)
        if os.path.exists(photo_path):
            pc = t.cell(0, 4)
            pc.merge(t.cell(len(rows) - 1, 4))
            pc.vertical_alignment = 1  # center
            p = pc.add_paragraph()
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.SINGLE
            p.alignment = 1
            p.add_run().add_picture(photo_path, width=Cm(2.35), height=Cm(3.04))


def entry_header(doc, date, org, detail, after=2.0):
    p = para(doc, line=LINE_ENTRY, indent=IND_BODY, after=after)
    ts = p.paragraph_format.tab_stops
    ts.add_tab_stop(Pt(TAB_CENTER), WD_TAB_ALIGNMENT.CENTER)
    ts.add_tab_stop(Pt(CONTENT_W), WD_TAB_ALIGNMENT.RIGHT)
    style_run(p.add_run(date), SZ_ENTRY, C_TEXT_H)
    style_run(p.add_run("\t"), SZ_ENTRY, C_TEXT_H)
    style_run(p.add_run(org), SZ_ENTRY, C_TEXT_H, bold=True)
    if detail:
        style_run(p.add_run("\t"), SZ_ENTRY, C_TEXT_H)
        style_run(p.add_run(detail), SZ_ENTRY, C_TEXT_H, bold=True)
    p.paragraph_format.keep_with_next = True
    return p


def bullet(doc, text, bold_head=None):
    p = para(doc, indent=IND_BULLET, hang=IND_BULLET_HANG)
    p.paragraph_format.tab_stops.add_tab_stop(Pt(IND_BULLET), WD_TAB_ALIGNMENT.LEFT)
    style_run(p.add_run("•"), SZ_BODY, C_TEXT_B)
    style_run(p.add_run("\t"), SZ_BODY, C_TEXT_B)
    if bold_head:
        style_run(p.add_run(bold_head), SZ_BODY, C_TEXT_B, bold=True)
    style_run(p.add_run(text), SZ_BODY, C_TEXT_B)
    return p


def label_para(doc, label, text, keep_next=False):
    p = para(doc, indent=IND_BODY)
    style_run(p.add_run(label + "："), SZ_BODY, C_TEXT_B, bold=True)
    style_run(p.add_run(text), SZ_BODY, C_TEXT_B)
    p.paragraph_format.keep_with_next = keep_next
    return p


# ---------------------------------------------------------------- 主流程
def build(content_path, out_path, photo_override=None):
    base_dir = os.path.dirname(os.path.abspath(content_path))
    data = json.load(open(content_path, encoding="utf-8"))
    if photo_override:
        data["photo"] = photo_override

    doc = Document()
    # 默认样式
    normal = doc.styles["Normal"]
    normal.font.name = FONT_ASCII
    normal.font.size = Pt(SZ_BODY)
    normal.element.rPr.rFonts.set(qn("w:eastAsia"), FONT_EA)
    normal.paragraph_format.space_before = Pt(0)
    normal.paragraph_format.space_after = Pt(0)

    sec = doc.sections[0]
    sec.page_width, sec.page_height = Pt(PAGE_W), Pt(PAGE_H)
    sec.left_margin, sec.right_margin = Pt(MARGIN_L), Pt(MARGIN_R)
    sec.top_margin, sec.bottom_margin = Pt(MARGIN_T), Pt(MARGIN_B)
    sec.header_distance = Pt(4)
    sec.footer_distance = Pt(4)
    add_page_left_rule(sec)

    build_title(doc, data, base_dir)

    # 基本信息
    spacer(doc, 4.9)
    build_section_header(doc, data["basic"]["section"])
    spacer(doc, SEC_GAP_AFTER)
    build_basic(doc, data["basic"], base_dir, photo=data.get("photo"))

    for block in data["sections"]:
        if block.get("pageBreak"):
            page_break(doc)
            spacer(doc, 4.0)
        else:
            spacer(doc, SEC_GAP_BEFORE)
        build_section_header(doc, block["title"])
        spacer(doc, SEC_GAP_AFTER)
        if block["type"] == "entries":
            items = block["items"]
            for idx, it in enumerate(items):
                has_bullets = bool(it.get("bullets"))
                is_last = idx == len(items) - 1
                if has_bullets:
                    after = 2.0
                else:
                    after = 0.0 if is_last else ENTRY_GAP_EDU
                entry_header(doc, it["date"], it["org"], it.get("detail", ""), after=after)
                for b in it.get("bullets", []):
                    bullet(doc, b)
        elif block["type"] == "skills":
            for label, text in block["items"]:
                label_para(doc, label, text)
        elif block["type"] == "projects":
            for it in block["items"]:
                entry_header(doc, it["date"], it["org"], it.get("detail", ""))
                for label, text in it.get("meta", []):
                    label_para(doc, label, text)
                if it.get("bulletsTitle"):
                    p = para(doc, indent=IND_BODY)
                    style_run(p.add_run(it["bulletsTitle"] + "："), SZ_BODY, C_TEXT_B)
                    p.paragraph_format.keep_with_next = True
                for b in it.get("bullets", []):
                    bullet(doc, b)

    doc.save(out_path)
    print("saved:", out_path)


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    photo = None
    for a in sys.argv[1:]:
        if a.startswith("--photo="):
            photo = a.split("=", 1)[1]
    if len(args) < 2:
        print(__doc__)
        sys.exit(1)
    build(args[0], args[1], photo)
