import { defineConfig } from "vitepress";
import fs from "fs";
import path from "path";

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
    const directories = entries.filter(entry => entry.isDirectory());
    const files = entries.filter(entry => entry.isFile() && entry.name.endsWith('.md'));
    
    // 处理目录（递归）
    for (const dir of directories) {
        const dirPath = path.join(targetPath, dir.name);
        const childItems = generateSidebarRoutes(basePath, dirPath);
        
        if (childItems.length > 0) {
            items.push({
                text: dir.name.replace(/^\d+\s*/, ''), // 移除开头的数字和空格
                collapsed: true,
                items: childItems
            });
        }
    }
    
    // 处理md文件
    for (const file of files) {
        if (file.name === 'index.md') continue; // 跳过index.md文件
        
        const fileName = file.name.replace(/\.md$/, '');
        // 修正link路径：从basePath开始计算相对路径
        const relativePath = path.relative(process.cwd(), path.join(basePath, targetPath, file.name));
        const linkPath = `/${relativePath.replace(/\\/g, '/')}`;
        
        items.push({
            text: fileName.replace(/^\d+\.\d+\s*/, '').replace(/^\d+\s*/, ''), // 移除开头的数字和点号
            link: linkPath
        });
    }
    
    return items;
}

// 生成算法目录的sidebar配置
const algorithmSidebar = generateSidebarRoutes(
    path.join(process.cwd(), 'algorithm/category'), 
    '.'
);

const dailySidebar = generateSidebarRoutes(
    path.join(process.cwd(), 'algorithm/每日提交'), 
    '.'
);
// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "My Notes",
    description: "My Notes",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: "Home", link: "/" },
            { text: "Examples", link: "/markdown-examples" },
        ],

        sidebar: [
            {
                text: "Examples",
                items: [
                    { text: "Markdown Examples", link: "/markdown-examples" },
                    { text: "Runtime API Examples", link: "/api-examples" },
                    {
                        text: "算法",
                        collapsed: true,
                        items: algorithmSidebar
                    },
                    {
                        text: "算法-每日提交",
                        collapsed: true,
                        items: dailySidebar
                    },
                ],
            },
        ],

        socialLinks: [
            { icon: "github", link: "https://github.com/vuejs/vitepress" },
        ],
    },
});
