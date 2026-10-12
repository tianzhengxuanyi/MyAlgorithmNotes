# prettier

## 常见配置项

```ts
declare namespace PrettierConfig {
  export interface Override {
    files: string;
    options: Config;
  }

  export interface Config {
    /**
     * @description 一行显示的最大字符数，包含缩进用的空格
     * @default 80
     */
    printWidth?: number;
    /**
     * @description 指定每个缩进级别的空格数
     * @default 2
     */
    tabWidth?: number;
    /**
     * @description 是否使用 tab 作为缩进
     * * true: 使用 tab 缩进
     * * false: 使用空格缩进
     * @default false
     */
    useTabs?: boolean;
    /**
     * @description 是否在每行的末尾使用分号
     * * true: 在每一行的末尾使用分号
     * * false: 仅在关键的位置使用分号
     * @default true
     */
    semi?: boolean;
    /**
     * @description 是否在需要使用引号的地方使用单引号。JSX 属性除外
     * * true: 在所有地方使用单引号 (JSX 属性除外)
     * * false: 在所有地方使用双引号 (JSX 属性除外)
     * @default true
     */
    singleQuote?: boolean;
    /**
     * @description 当一个对象的属性需要使用引号时，如何处理这些属性的引号
     * * as-needed: 只给需要使用引号的属性添加引号
     * * consistent: 只要有一个属性需要使用引号，就给这个对象的所有属性都加上引号
     * * preserve: 按照 developer 的个人键入使用引号 (对于非必要添加引号的属性，developer 使用引号时，就保留引号；不使用引号时，也不添加引号)
     * @default "as-needed"
     */
    quoteProps?: "as-needed" | "consistent" | "preserve";
    /**
     * @description 对于 JSX 属性，是否统一使用单引号
     * * true: 统一使用单引号
     * * false: 统一使用双引号
     * @default false
     */
    jsxSingleQuote?: boolean;
    /**
     * @description 指定尾随逗号的设置条件
     * * "none": 任何情况都不设置尾随逗号
     * * "es5": 仅在 ES5 中的部分条件下设置尾随逗号，如换行的对象属性设置、换行的数组元素设置等
     * * "all": 在任何允许的情况下都设置尾随逗号，如对象属性设置、数组元素设置、换行解构、换行的函数参数列表等
     * @deprecated @default "none" 2.0.0 以前的版本默认值
     * @default "es5" 2.0.0 及以后的版本默认值
     */
    trailingComma?: "none" | "es5" | "all";
    /**
     * @description 是否在一行代码定义的对象字面量的大括号与内容之间使用空格隔开
     * @example
     * * true: { prop: "value" };
     * * false: {prop: "value"}
     * @default true
     */
    bracketSpacing?: boolean;
    /**
     * @description 是否将换行的 HTML 开始标签的结尾尖括号 `>` 放到最后一个属性的同一行
     * * 这个属性对自闭合标签不生效
     * @example
     * * true: 
          <button
            className="prettier-class"
            id="prettier-id"
            onClick={this.handleClick}><!- 开始标签的结尾尖括号放到了这里 -->
            Click Here
          </button>
     * * false: 
          <button
            className="prettier-class"
            id="prettier-id"
            onClick={this.handleClick}
          ><!- 开始标签的结尾尖括号放到了这里 -->
            Click Here
          </button>
     * @default false
     */
    bracketSameLine?: boolean;
    /**
     * @description 这个属性的配置效果与 bracketSameLine 的配置效果类似，只不过针对的是 JSX 元素
     * @deprecated 这个属性在 v2.4.0 之后的版本就废弃了
     * @default false
     */
    jsxBracketSameLine?: boolean;
    /**
     * @description 当箭头函数只有一个参数时，是否使用括号包裹这个参数
     * * 这个属性在 v1.9.0 版本引入
     * @example
     * * always: (x) => x;
     * * avoid: x => x;
     * @deprecated @default "avoid" v2.0.0 之前的版本的默认值
     * @default "always" v2.0.0 及之后的默认值
     */
    arrowParens?: "always" | "avoid";
    /**
     * @description 对于一个需要检测的文件，设置检测的开始行
     * @default 0
     */
    rangeStart?: number;
    /**
     * @description 对于一个需要检测的文件，设置检测的结束行
     * @default Infinity
     */
    rangeEnd?: number;
    /**
     * @description 用于指定 Prettier 的解析器
     * * Prettier 会自动从输入文件路径推断解析器，因此通常不必更改此设置
     * @see https://prettier.io/docs/en/options.html#parser 具体的可配置项可以参考这里的文档
     */
    parser?: string;
    /**
     * @description 指定用于推断要使用的 parser 的文件名
     */
    filepath?: string;
    /**
     * @description 是否将 Prettier 限制为仅格式化文件顶部包含特殊注释 (pragma) 的文件
     * * 这个属性在 v1.7.0 版本引入
     * * 如果将这个属性设置为 true, 那么 Prettier 将只检测文件顶部包含以下注释的文件
           /**
            * @prettier
            *\/
           /**
            * @format
            *\/
     * @default false
     */
    requirePragma?: boolean;
    /**
     * @description 是否将被 Prettier 格式化后的文件的顶部插入特定的注释
     * * 这些注释与 requirePragma 属性配置的注释格式相同
     * * 这个属性在 v1.8.0 版本引入
     * @default false
     */
    insertPragma?: boolean;
    /**
     * @description 用于控制 Markdown 文本中的换行
     *  * 这个属性在 v1.8.2 版本引入
     * * "always": 总是按照上文配置的 printWidth 来控制 Markdown 文本中每行的最长字符数
     * * "never": 强制让 Markdown 的每一块文本在一行内显示，并让编辑器自动换行
     * * "preserve": 根据 developer 键入的方式来换行，这个属性在 v1.9.0 版本启用的
     * @default "preserve"
     */
    proseWrap?: "always" | "never" | "preserve";
    /**
     * @description 指定在 HTML, Vue, Angular, Handlebars 文件中的空格敏感度
     * * 这个属性在 v1.15.0 版本引入，在 v2.3.0 版本开始支持 Handlebars
     * * "css": 遵从 css 属性的默认展示方式
     * * "strict": 认为所有 tag 周围的空格都是有意义的
     * * "ignore": 认为所有 tag 周围的空格都是没有意义的
     * @see https://prettier.io/blog/2018/11/07/1.15.0.html#whitespace-sensitive-formatting
     * @default "css"
     */
    htmlWhitespaceSensitivity?: "css" | "strict" | "ignore";
    /**
     * @description 是否给 Vue 文件中 <script> 和 <style> 标记内的第一层代码提供一个单位的缩进
     * @default false
     */
    vueIndentScriptAndStyle?: boolean;
    /**
     * @description 指定文件的换行符
     * * 通常情况下，在 Windows 系统中，文本文件的换行符是 crlf；在 macOS 和 Linux 中，文本文件的换行符是 lf
     * * 在 Windows 系统中其实也是支持以 lf 换行的
     * * 为了保持更好的兼容性，推荐文本文件都以 lf 换行
     * @default "lf"
     */
    endOfLine?: "lf" | "crlf" | "cr" | "auto";
    /**
     * @description 控制 Prettier 是否格式化文件中嵌入的引用代码，比如 Markdown 中嵌入的各类语言的代码
     * * 这个属性在 v2.1.0 版本引入
     * * "auto": 如果是 Prettier 支持格式化的代码，则执行对应的格式化
     * * "off": 不自动格式化任何嵌入的代码
     * @default "auto"
     */
    embeddedLanguageFormatting?: "auto" | "off";
    /**
     * @description 在 HTML, Vue, JSX 中，强制一行只显示一个属性
     * @default false
     */
    singleAttributePerLine?: boolean;
    /**
     * @description 用于为指定类型的文件设置独立的规则
     */
    overrides?: Override[];
    /**
     * @description 指定继承的配置，和 ESLint 的同名配置项作用相同
     */
    extends?: string[];
  }
}
```