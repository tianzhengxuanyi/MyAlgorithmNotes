import { defineConfig } from "vitepress";
import fs from "fs";
import path from "path";

const srcDir = "./";
const absoluteSrcDir = path.resolve(srcDir);
/**
 * 生成sidebar路由配置
 * @param basePath 基础路径
 * @param targetPath 目标路径（相对于basePath）
 * @returns sidebar配置数组
 */
function generateSidebarRoutes(basePath: string, targetPath: string): any[] {
    const fullPath = path.join(basePath, targetPath);
    const items: any[] = [];

    // 读取目录内容
    const entries = fs.readdirSync(fullPath, { withFileTypes: true });

    // 先处理目录，再处理文件，保持顺序
    const directories = entries.filter((entry) => entry.isDirectory());
    const files = entries.filter(
        (entry) => entry.isFile() && entry.name.endsWith(".md"),
    );

    // 处理目录（递归）
    for (const dir of directories) {
        const dirPath = path.join(targetPath, dir.name);
        const childItems = generateSidebarRoutes(basePath, dirPath);

        if (childItems.length > 0) {
            items.push({
                text: dir.name.replace(/^\d+\s*/, ""), // 移除开头的数字和空格
                collapsed: true,
                items: childItems,
            });
        }
    }

    // 处理md文件
    for (const file of files) {
        if (file.name === "index.md") continue; // 跳过index.md文件

        const fileName = file.name.replace(/\.md$/, "");
        // 修正link路径：从basePath开始计算相对路径
        // const relativePath = path.join(basePath, targetPath, file.name);
        const relativePath = path.relative(
            absoluteSrcDir,
            path.join(basePath, targetPath, file.name),
        );
        const linkPath = `/${relativePath.replace(/\\/g, "/")}`;

        items.push({
            text: fileName.replace(/^\d+\.\d+\s*/, "").replace(/^\d+\s*/, ""), // 移除开头的数字和点号
            link: linkPath,
        });
    }

    return items;
}

// 生成算法目录的sidebar配置
const algorithmSidebar = generateSidebarRoutes(
    path.join(process.cwd(), "algorithm/category"),
    ".",
);

const dailySidebar = generateSidebarRoutes(
    path.join(process.cwd(), "algorithm/每日提交"),
    ".",
);

const templateSidebar = generateSidebarRoutes(
    path.join(process.cwd(), "algorithm/模板"),
    ".",
);

const architectureSidebar = generateSidebarRoutes(
    path.join(process.cwd(), "architecture"),
    ".",
);

const designPatternsSidebar = generateSidebarRoutes(
    path.join(process.cwd(), "design-patterns"),
    ".",
);

// https://vitepress.dev/reference/site-config
export default defineConfig({
    base: "/Notes/",
    title: "My Notes",
    description: "My Notes",
    srcDir,
    ignoreDeadLinks: true,
    // 核心：MD 解析配置
    markdown: {
        // 忽略无效的内部链接（相对路径/锚点不存在）
        // 进阶模式：精细控制（比如只忽略锚点错误，不忽略文件不存在）
        // ignoreDeadLinks: {
        //   text: true,    // 忽略文本链接错误
        //   image: false,  // 不忽略图片链接错误（仍报错）
        //   link: false,   // 不忽略文件链接错误（仍报错）
        //   anchor: true   // 忽略锚点错误（如 #不存在的标题）
        // }
    },
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: "Home", link: "/" },
            { text: "算法", link: "/algorithm/" },
            { text: "前端架构", link: "/architecture/" },
            { text: "设计模式", link: "/design-patterns/" },
        ],

        sidebar: {
            "/algorithm/": [
                {
                    text: "算法",
                    link: "/algorithm/index.md",
                    items: [
                        // { text: "Markdown Examples", link: "/markdown-examples" },
                        // { text: "题单", link: "/algorithm/index.md" },
                        {
                            text: "分类",
                            collapsed: true,
                            items: algorithmSidebar,
                        },
                        {
                            text: "每日提交",
                            collapsed: true,
                            items: dailySidebar,
                        },
                        {
                            text: "模板",
                            collapsed: true,
                            items: templateSidebar,
                        },
                    ],
                }
            ],
            "/architecture/": [
                {
                    text: "架构",
                    link: "/architecture/index.md",
                    items: architectureSidebar
                }
            ],
            "/design-patterns/": [
                {
                    text: "设计模式",
                    link: "/design-patterns/index.md",
                    items: designPatternsSidebar
                }
            ],
        },

        socialLinks: [
            { icon: "github", link: "https://github.com/vuejs/vitepress" },
        ],
    },
});
