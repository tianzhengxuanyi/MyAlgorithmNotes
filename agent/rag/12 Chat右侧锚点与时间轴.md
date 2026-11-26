# 12. Chat 右侧锚点与时间轴（需求 + 技术方案）

> 对照 DeepSeek Chat 右侧导航：长会话里用「用户问题」当目录，悬停预览、点击跳转。  
> 相关代码：`ChatPage.vue`、`MessageList.vue`、`MessageItem.vue`、`MarkdownRenderer.vue`、`stores/ai/chatStore.ts`。  
> **P0 纯前端**，不改 SSE / 消息表。

---

## 1. DeepSeek 在做什么

截图里右侧不是文章 TOC，而是 **当前会话的时间轴**。

正文是某一轮很长的 assistant 回答（Vue computed 面试稿）。右边一条细轨：短横线是历史轮次，蓝色竖条是当前视口。鼠标移上去后：

1. 轨左侧弹出目录，每一行是一句 **用户问题** 的截断（「你是一个资深的前端面试官…」「Vue 如何让对象新增属性…」）。
2. 当前落在视口里的那一轮高亮（蓝字 + 蓝短横）。
3. 再悬停某一行，弹出深色气泡，预览该轮内容（常是对应 assistant 正文前几行，带一点 Markdown）。
4. 点击该行，消息列表滚到那一轮。
5. 离开右侧后目录收起，只留细轨。

所以产品上是两层：

| 名称 | 实际含义 |
| --- | --- |
| 时间轴 | 右侧细轨 + 滚动位置，按会话轮次排列 |
| 锚点 | 每一轮用户问题（及 P1 的标题）是可点击的跳转点 |

左侧会话列表是「换对话」；右侧时间轴是「在本对话里跳转」。两者不要做成同一份数据的两个拷贝。

---

## 2. 现状

| 环节 | 实际行为 |
| --- | --- |
| 滚动容器 | `MessageList` 自己 `overflow-y: auto`，不是 window |
| 消息 | `chatStore.messages`，`role` + `content` + `id` |
| DOM | `MessageItem` 没有稳定 `id` / `data-message-id`，无法 `scrollIntoView` |
| 流式 | 内容变长会自动滚到底；用户上翻超过 80px 则停 |
| 空态 | `WelcomeScreen`，无消息，不应出现时间轴 |
| 布局 | 正文 `max-width: 1000px` 居中；右侧目前是空白边距 |
| 后端 | `ConversationMessageDto` 已有 `id / role / content / createdAt`，够用 |

长会话（多轮面试、连续追问）只能靠手搓滚动条，看不到「问过什么」。单条超长回答也没有标题跳转。

---

## 3. 需求

### 3.1 P0：会话时间轴（对齐截图）

- 有消息且内容超出一屏（或用户轮次 ≥ 2）时，在消息区右侧显示细轨。
- 每个 **user** 消息一个刻度；标签 = 该条 `content` 首行，去掉换行，截断约 22～28 字。
- 默认只显示刻度 + 视口指示条；鼠标进入右侧热区（约 28px）后展开目录。
- 展开项：用户问题截断文本；当前视口对应项高亮。
- 悬停某一项：Tooltip 预览 **紧随其后的 assistant** 正文（去掉代码块后约 120 字）；还在流式、没有回答时预览用户问题本身。
- 点击：`MessageList` 平滑滚到该 user 气泡顶部（留出约 12px 内边距）。
- 滚动消息列表时，高亮项和指示条跟着变。
- 新一轮发出后，时间轴多一个刻度；切会话 / 新对话立刻换数据。
- 欢迎页、消息为空：不渲染。
- 宽度 &lt; 768：不展示（避免挡正文）；不在移动端做简化版（P2）。

### 3.2 P1：长回答内标题锚点

同一条轨上，给 **当前视口里的 assistant** 增加二级锚点：Markdown `h2` / `h3`。

悬停当前轮时，目录在该用户问题下缩进列出标题（「4. 缺少 computed 嵌套…」「5. Vue3.4+ dirty…」）。点击滚到对应标题。标题过少（&lt; 3 个）或回答很短则不展开。

流式生成中：标题列表按已输出内容增量更新，不要每个 token 全量重扫 DOM。

### 3.3 P2（不做，除非另开需求）

- 长回答底部折叠 / 「继续阅读」按钮（截图里圆形下箭头更像这个，与时间轴无关）。
- 时间轴刻度按消息真实高度比例排布（真正 minimap）。
- 键盘上下切换锚点、URL hash `#msg=`。
- 把时间轴条目存后端。

### 3.4 明确不做什么

- **不**改后端、SSE、消息表。
- **不**用左侧 `ChatSidebar` 会话列表冒充时间轴。
- **不**把 assistant 全文当目录行（目录必须短，预览才可以稍长）。
- **不**在时间轴上做删除 / 点赞 / 引用。
- **不**让时间轴挤占 1000px 正文栏；放在栏外右边距，展开时浮层盖住边距，尽量少挡字。

---

## 4. 方案对比

### 方案 A：浏览器原生 scrollbar + 自绘 overlay（不推荐）

自己画一条假滚动条，和系统滚动条叠两层。DeepSeek 看起来像「刻度 + 视口条」，但我们已有系统滚动条，再仿一条容易打架。

### 方案 B：会话目录浮层，刻度均分（推荐 P0）

刻度在轨上 **均分**（与 DeepSeek 截图一致：目录行距均匀，不跟消息实际高度成正比）。另用一根短指示条表示 `scrollTop / (scrollHeight - clientHeight)`。

优点：实现简单，长回答不会把后面的刻度挤出屏幕。  
代价：刻度位置 ≠ 内容位置，指示条才表示滚动进度。需要在文档和交互上接受这一点。

### 方案 C：按 offsetTop 比例排刻度（P2）

真正的 minimap。超长回答会占掉大半条轨，后面的问题挤在底部，反而不好点。

**P0 用方案 B。** P1 标题锚点只出现在「当前轮」的展开目录里，不跟均分刻度抢位置。

---

## 5. 数据怎么来（前端推导，不落库）

一轮 = 一条 `user` + 其后连续 `assistant`（思考中 / 流式也算）。

```ts
type TimelineTurn = {
  userMessageId: string
  label: string          // 用户问题截断
  preview: string        // 对应回答预览；没有则用问题
  headings?: Array<{     // P1
    id: string           // DOM id
    level: 2 | 3
    text: string
  }>
}
```

`label` / `preview` 规则：

1. 去掉开头的 Markdown 标记（`#`、`*`、`>`）。
2. 预览再去掉 fenced code（``` … ```），避免 tooltip 里一大段代码。
3. 空白、system / tool 消息不进时间轴。
4. 临时 id（流式尚未 finish）也要能跳：`MessageItem` 用 `msg.id || 'local-' + index`。

P1 标题：对 assistant `content` 用与 `MarkdownRenderer` 一致的规则抽 `^#{2,3} `，slug 用 `msg-{id}-h-{index}`，不要用中文标题当 id。

---

## 6. 前端结构

### 6.1 组件

| 文件 | 职责 |
| --- | --- |
| `components/ai/chat/ChatTimeline.vue` | 细轨、刻度、展开目录、预览 tooltip、视口条 |
| `composables/ai/useChatTimeline.ts` | 从 `messages` 算 `TimelineTurn[]`；根据滚动算 `activeUserMessageId` + `scrollRatio` |
| `utils/chatTimeline.ts` | `truncateLabel` / `previewPlain` / `extractMarkdownHeadings`（纯函数，可单测） |
| `MessageList.vue` | 挂时间轴；给每条消息 DOM 锚点；把 `scrollRef` 交给 composable |
| `MessageItem.vue` | 根节点 `id="chat-msg-{id}"`、`data-role`、`data-message-id` |
| `MarkdownRenderer.vue`（P1） | `heading_open` 写入 `id`，与抽大纲用同一套 index |

`ChatPage` / `ChatLayout` / store **不必**为 P0 加字段。时间轴是 `MessageList` 的附属 UI。

### 6.2 布局

```text
.chat-page__body
  └── .message-list-wrap          position: relative; height: 100%
        ├── .message-list         overflow-y: auto   （现有滚动容器）
        │     └── .message-list__inner  max-width: 1000px
        └── .chat-timeline        position: absolute; right: 8px;
                                  top: 24px; bottom: 24px;
                                  width: 12px; z-index: 5
              └── 展开时 width ~ 240px，向左长，不改变 message-list 宽度
```

热区用伪元素或透明加宽（`:hover` 宽度 28px），避免必须精准点到 4px 的横线。

视口指示条：绝对定位在轨上，`top: scrollRatio * (trackHeight - thumbHeight)`。`thumbHeight` 可按 `clientHeight / scrollHeight` 限制在 24～48px。

### 6.3 滚动与激活

监听 `MessageList` 的 `scroll`（可 `rAF` 节流）：

1. `scrollRatio = scrollTop / max(1, scrollHeight - clientHeight)`
2. 激活项：从上到下找最后一个 `offsetTop <= scrollTop + 48` 的 user 消息（48 为顶部留白）。不要用 `IntersectionObserver` 对每个 heading 建观察器作为 P0（消息数量通常几十，`getBoundingClientRect` 扫描即可）。
3. 点击跳转时设 `userScrolledUp = true`，避免跳完又被流式 `scrollToBottom` 拽走。
4. `prefers-reduced-motion: reduce` 时 `behavior: 'auto'`。

跳转：

```ts
function scrollToMessage(messageId: string) {
  const root = scrollRef.value
  const el = root?.querySelector<HTMLElement>(`#chat-msg-${CSS.escape(messageId)}`)
  if (!root || !el) return
  root.scrollTo({ top: el.offsetTop - 12, behavior: 'smooth' })
}
```

`offsetTop` 相对 `message-list__inner`；若以后 `inner` 不是 offsetParent，改用 `el.offsetTop - inner.offsetTop` 或 `getBoundingClientRect` 差值。

### 6.4 展开 / 收起

- `mouseenter` 热区 → `expanded = true`；`mouseleave` 整块（含目录 + tooltip）→ 200ms 后再收，避免移向 tooltip 时闪关。
- 点击空白不需要关；移出即关。
- 不提供「钉住展开」按钮（DeepSeek 也没有）。

### 6.5 与现有自动滚动的关系

`MessageList` 已有 `userScrolledUp`。时间轴点击 = 用户主动离开底部，必须置位。流式结束若用户仍停在历史轮，不要强制回底。

---

## 7. P1 标题锚点（补在同一条轴上）

1. `MarkdownRenderer` 给 `h2`/`h3` 加 `id="chat-msg-{messageId}-h-{n}"`（n 为该消息内出现顺序）。
2. `extractMarkdownHeadings(content)` 与渲染顺序一致；流式用 200～300ms debounce。
3. 目录结构：

```text
▾ vue计算属性computed原理…     ← user 锚点（P0）
    4. 缺少 computed 嵌套…     ← h2（仅 active 轮或 hover 该轮时显示）
    5. Vue3.4+ 的 dirty…
```

4. 非当前轮不展开标题，避免 20 轮 × 10 个标题把目录撑爆。
5. 点击标题：滚到 heading，同样设置 `userScrolledUp`。

---

## 8. 样式要点

对齐现有 Chat：白底、`#0d0d0d` 标题、`#b0b0b0` 次要文字。

| 元素 | 建议 |
| --- | --- |
| 刻度 | 宽 8～10px、高 2px、`#d0d0d0`；active `#4F6EF7`（或项目主色） |
| 视口条 | 宽 3px、圆角、`#4F6EF7`，透明度 0.85 |
| 展开面板 | 白底、圆角 12px、`box-shadow: 0 8px 24px rgba(0,0,0,.08)`，字号 13px |
| Tooltip | 深底 `#1f1f1f`、白字、最大宽 280px、最多 4～5 行 ellipsis |
| 当前项 | 蓝色字 + 蓝色刻度，不要整行大色块 |

正文与轨之间至少 16px，展开目录最多盖住正文右侧 40px。

---

## 9. 测试与验收

### P0

- 1 轮短问答且未超出一屏：无时间轴。
- ≥ 2 轮或超出一屏：右侧出现细轨，刻度数 = user 消息数。
- 悬停展开：目录文案来自用户问题，不是 assistant 全文。
- 悬停单项：出现预览；流式未完成时预览不为空。
- 点击第 1 / 中间 / 最后一轮：滚到对应 user 气泡，流式进行中也不会被拽回底部。
- 手搓滚动：高亮和指示条更新；滚到最底高亮最后一轮。
- 切会话、新对话：刻度换成新数据 / 消失。
- 窄屏 &lt; 768：无时间轴。
- 欢迎页：无时间轴。

### P1

- 当前长回答 ≥ 3 个 h2/h3：展开该轮能看到标题；点击到达对应标题。
- 流式输出过程中标题逐渐出现，无闪烁抖动（允许 debounce）。
- 短回答无二级标题。

---

## 10. 工作量切分

1. `MessageItem` 锚点 id + `MessageList` 右侧槽位。
2. `utils/chatTimeline.ts` + `useChatTimeline.ts`（turns / active / ratio / jump）。
3. `ChatTimeline.vue` 细轨 + 展开目录 + tooltip + 视口条。
4. 与 `userScrolledUp`、流式、切会话联调。
5. （P1）Markdown heading id + 二级目录。

预估 P0 约 1 个前端点；P1 约 0.5。无迁移、无 API。

---

## 11. 风险

- **offsetParent 算错**：跳转会偏一截。验收时看 user 气泡是否贴滚动容器顶。
- **流式抢滚动**：跳转后必须写 `userScrolledUp`。
- **id 含特殊字符**：`querySelector` 必须 `CSS.escape`。
- **消息很多（上百轮）**：均分刻度仍可用；目录用自身 `overflow-y: auto`，不要撑出屏幕。
- **预览 XSS**：tooltip 用纯文本或已转义的 Markdown，不要 `v-html` 原始模型输出。
