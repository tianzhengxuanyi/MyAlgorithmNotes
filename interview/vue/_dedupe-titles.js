const fs = require("fs");
const path = require("path");

const titles = require("./type1-titles.json");

// 1) exact unique, preserve order
const seen = new Set();
const unique = [];
for (const t of titles) {
  const key = t.trim().replace(/\s+/g, " ");
  if (seen.has(key)) continue;
  seen.add(key);
  unique.push(key);
}

/**
 * 语义合并规则：命中同一组的题目保留 keep（若存在），否则保留组内首次出现
 * match 返回 true 表示属于该主题
 */
const groups = [
  {
    keep: "Vue 中 nextTick 的实现原理及其与异步更新队列的关系",
    match: (t) =>
      /nextTick/i.test(t) || /数据频繁变化为什么通常只触发一次视图更新/.test(t),
  },
  {
    keep: "Vue3.0性能提升主要是通过哪几方面体现的？",
    match: (t) => /性能提升主要是通过哪几方面/.test(t),
  },
  {
    keep: "Vue 3 新增了哪些重要能力并进行了哪些优化",
    match: (t) =>
      /Vue\s*3.*新增.*优化|Vue3的设计目标|Vue3\.0的设计目标|Vue3\.0 的设计目标/.test(
        t,
      ),
  },
  {
    keep: "Vue3.0里为什么要用 Proxy API 替代 defineProperty API？",
    match: (t) =>
      /Proxy.*替代.*defineProperty|Proxy 相比于 defineProperty|为什么要用 Proxy/.test(
        t,
      ),
    pick: (hits) =>
      hits.find((t) => !t.includes("面试官") && /替代 defineProperty/.test(t)) ||
      hits[0],
  },
  {
    keep: "Vue3.0 所采用的 Composition Api 与 Vue2.x 使用的 Options Api 有什么不同？",
    match: (t) => /Composition\s*Api|Options\s*Api/i.test(t),
  },
  {
    keep: "Vue 2 与 Vue 3 的响应式原理有什么区别",
    match: (t) =>
      /Vue\s*2.*Vue\s*3.*响应式|Vue 2 与 Vue 3 的响应式及双向绑定|vue3有了解过|Vue3有了解过|跟vue2的区别|跟Vue2的区别/i.test(
        t,
      ),
  },
  {
    keep: "Vue Router 的哈希模式与历史模式有什么区别",
    match: (t) =>
      /哈希模式|history模式|HashRouter|HistoryRouter|路由实现：hash|hash模式.*history|监听HistoryRouter/i.test(
        t,
      ),
  },
  {
    keep: "Vue 的 computed 和 watch 的区别",
    match: (t) =>
      /computed和watch|computed 和 watch|watch与computed|watch与computed|computed和watch区别/i.test(
        t,
      ),
  },
  {
    keep: "Vue 计算属性的实现原理是什么",
    match: (t) =>
      /计算属性|Vue computed 实现|computed 实现/.test(t) &&
      !/watch/i.test(t),
  },
  {
    keep: "Vue 如何让对象新增属性具备响应式能力",
    match: (t) => /对象新增属性|给对象添加新属性|界面不刷新/.test(t),
  },
  {
    keep: "Vue 的虚拟节点差异比较算法如何工作",
    match: (t) => /虚拟节点差异|diff算法|diff 算法|渲染器的diff/i.test(t),
  },
  {
    keep: "什么是虚拟 DOM，它解决了哪些问题",
    match: (t) =>
      /虚拟\s*DOM|虚拟Dom|虚拟DOM一定更快/i.test(t) && !/diff|key/i.test(t),
  },
  {
    keep: "谈谈你对MVVM的理解？",
    match: (t) => /MVVM/i.test(t),
  },
  {
    keep: "Vue中如何检测数组变化？",
    match: (t) =>
      /检测数组|监测数组|改变数组触发|修改数组元素.*视图更新|Vue 改变数组|delete和Vue\.delete/.test(
        t,
      ),
  },
  {
    keep: "Vue2.x 响应式数据原理？",
    match: (t) =>
      (/Vue2\.x\s*响应式|你是如何理解Vue的响应式系统|如何实现基于依赖收集的 reactive/.test(
        t,
      ) ||
        /^Vue2\.x 响应式原理$/.test(t)) &&
      !/Vue\s*2\s*与\s*Vue\s*3|vue3有了解|Vue3有了解|跟vue2|跟Vue2|虚拟DOM进行diff/i.test(
        t,
      ),
  },
  {
    keep: "谈谈你对SPA单页面的理解？",
    match: (t) => /SPA|单页面/.test(t) && !/优化加载速度|性能优化/.test(t),
  },
  {
    keep: "Vue项目中如何解决跨域问题？",
    match: (t) => /跨域/.test(t),
  },
  {
    keep: "Vue项目如何进行部署？是否有遇到部署服务器后刷新404问题？",
    match: (t) => /404|部署到服务器|如何进行部署/.test(t),
  },
  {
    keep: "大型项目中，Vue项目怎么划分结构和划分组件比较合理呢？",
    match: (t) => /目录结构|划分结构|划分组件/.test(t),
  },
  {
    keep: "SSR是什么？Vue中怎么实现？",
    match: (t) => /SSR/.test(t),
  },
  {
    keep: "Vue项目中有封装过axios吗？怎么封装的？",
    match: (t) => /axios/i.test(t),
  },
  {
    keep: "说说vue中，key的原理",
    match: (t) =>
      /key的原理|列表为什么加 key|key到底有什么用|Vue中的key到底/.test(t) ||
      (/key属性的作用/.test(t) && !/虚拟Dom|虚拟DOM/.test(t)),
  },
  {
    keep: "Vue.observable是什么？",
    match: (t) => /observable/i.test(t),
  },
  {
    keep: "Vue和React对比",
    match: (t) => /Vue和React|Vue与Angular以及React/.test(t),
  },
  {
    keep: "谈谈对Vue中双向绑定的理解",
    match: (t) =>
      /双向绑定|v-model|数据绑定机制|如何设计一个基础的双向数据绑定/.test(t),
  },
  {
    keep: "Vue中的 v-show 和 v-if 有什么区别",
    match: (t) => /v-show|v-if 和 v-show|v-if\s*和\s*v-show/.test(t) && !/v-for/.test(t),
  },
  {
    keep: "说说你对Vue生命周期的理解",
    match: (t) =>
      /生命周期|new Vue 以后|实例挂载|mouted|mounted|create里实现|简述每个周期|DOM 渲染在哪个周期|请详细说下你对vue生命周期/.test(
        t,
      ) && !/shouldComponentUpdate/.test(t),
  },
  {
    keep: "Vue组件间通信方式都有哪些?",
    match: (t) =>
      /组件传值|组件间传值|组件间通信|参数传递|attrs和listeners|事件总线/.test(t),
  },
  {
    keep: "vuex是什么？怎么使用？哪种功能场景使用它？",
    match: (t) => /vuex|Vuex|mutation和action/i.test(t),
  },
  {
    keep: "vue-router守卫",
    match: (t) => /路由守卫|导航守卫|vue-router守卫|路由的钩子|判断登录/.test(t),
  },
  {
    keep: "你都做过哪些Vue的性能优化",
    match: (t) =>
      /性能优化|首屏|白屏|优化加载速度|怎么快速定位哪个组件出现性能|系统优化前端首屏/.test(
        t,
      ) && !/性能提升主要是通过哪几方面/.test(t),
  },
  {
    keep: "从单文件组件到页面渲染，Vue 完成了哪些工作",
    match: (t) => /单文件组件到页面渲染/.test(t),
  },
  {
    keep: "如何设计可配置的动态表格组件",
    match: (t) => /动态表格|动态查询表格/.test(t),
  },
  {
    keep: "为什么Vue中的data属性是一个函数而不是一个对象？",
    match: (t) => /data.*函数|组件 data 为什么必须是函数/.test(t),
  },
  {
    keep: "谈谈你对Vue中keep-alive的理解",
    match: (t) => /keep-alive/.test(t),
  },
  {
    keep: "为什么Vue中的v-if和v-for不建议一起用?",
    match: (t) => /v-if和v-for|v-if.*v-for/.test(t),
  },
  {
    keep: "Vue模版编译原理知道吗，能简单说一下吗？",
    match: (t) => /模版编译|模板编译/.test(t),
  },
  {
    keep: "$route和$router的区别",
    match: (t) => /\$route|\$router/.test(t),
  },
  {
    keep: "ref的作用",
    match: (t) => /^ref的作用$/.test(t),
  },
];

const used = new Set();
const merged = [];
const report = [];

for (const g of groups) {
  const hits = unique.filter((t) => !used.has(t) && g.match(t));
  if (hits.length === 0) continue;
  const canonical = g.pick
    ? g.pick(hits)
    : hits.includes(g.keep)
      ? g.keep
      : hits[0];
  hits.forEach((t) => used.add(t));
  merged.push(canonical);
  if (hits.length > 1) {
    report.push({
      keep: canonical,
      mergedFrom: hits.filter((x) => x !== canonical),
    });
  }
}

for (const t of unique) {
  if (!used.has(t)) merged.push(t);
}

const outPath = path.join(__dirname, "type1-titles-deduped.json");
fs.writeFileSync(outPath, JSON.stringify(merged, null, 2), "utf8");

console.log(
  JSON.stringify(
    {
      before: titles.length,
      exactUnique: unique.length,
      afterMerge: merged.length,
      mergeGroups: report.length,
      report,
      out: outPath,
    },
    null,
    2,
  ),
);
