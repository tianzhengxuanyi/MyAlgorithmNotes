# eslint

## eslint 配置

eslint v9后使用defineConfig函数配置，导出一个配置对象数组，按顺序组合，用 defineConfig 获得类型安全，用 globalIgnores 处理全局忽略。

```js
// eslint.config.js (ESLint 9+)
import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
  // 1. 全局忽略
  globalIgnores(["dist/", "build/", "node_modules/"]),

  // 2. 基础 JS 推荐规则
  js.configs.recommended,

  // 3. TypeScript 推荐规则 (针对 ts 文件)
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    // 定义代码运行环境与语法特性
    languageOptions: {
        // 指定用于解析代码的解析器
      parser: tseslint.parser,
      parserOptions: {
        projectService: true, // 推荐开启，用于类型感知的 linting
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // 在这里覆盖或添加 TS 特定规则
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },

  // 4. 关闭与 Prettier 冲突的规则 (必须放在最后)
  prettierConfig,
]);
```

## vue文件eslint

使用 `eslint-plugin-vue` `vue-eslint-parser` 插件来解析 Vue 文件。

```js
// eslint.config.js
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import tsParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,          // 基础 JS 推荐规则
  ...pluginVue.configs['flat/recommended'], // Vue 3 推荐规则
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser, // 嵌套的 TS 解析器
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
  },
];
```



## 迁移

使用 @eslint/migrate-config 工具来迁移旧的 .eslintrc 文件，该命令会转化生成一个 eslint.config.mjs 文件

```bash
npx @eslint/migrate-config .eslintrc.json
```

## prettier 和 eslint 冲突

`eslint-config-prettier` 是一个专门用于关闭与 Prettier 冲突的规则的配置。

```js
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
  // ... 其他配置
  prettierConfig, // 必须放在最后，以关闭所有与 Prettier 冲突的格式规则
]);
```