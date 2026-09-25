# Xingyu Dang's Personal Website

个人学术主页：[dangxingyu.github.io](https://dangxingyu.github.io/)。
使用 React 18、TypeScript、Vite 6、React Router 6 和 Tailwind CSS 3，构建为静态文件后部署到 GitHub Pages。

## 本地开发

CI 使用 Node.js 22；本地使用 Node.js 22.13+，以及 `package.json` 中固定的 pnpm 版本（当前为 `11.20.0`）。

```bash
pnpm install
pnpm run dev
```

开发服务器配置在端口 `3000`，终端会显示实际访问地址。

| 命令 | 用途 |
| --- | --- |
| `pnpm run dev` | 启动 Vite 开发服务器 |
| `pnpm run lint` | 运行 ESLint |
| `pnpm run build` | TypeScript 检查并构建到 `dist/`；与当前 CI 一致 |
| `pnpm run build:prod` | 同上，并通过 `BUILD_MODE=prod` 禁用源码定位插件 |
| `pnpm run preview` | 本地预览已有的 `dist/` 构建 |

这些命令不会自动安装依赖。依赖管理和 CI 使用 `pnpm-lock.yaml`；仓库中的 `package-lock.json` 不参与当前部署。

## 页面与内容

| 入口 | 实现与维护位置 |
| --- | --- |
| `/` | `src/pages/IntroPage.tsx`：简介、研究兴趣、Selected Publications、Talks 和页脚 |
| `/blog` | `src/pages/BlogPage.tsx`：按发布日期倒序展示博客列表 |
| `/blog/<slug>.html` | `public/blog/` 中的独立 HTML 正文，直接访问，不经过 React Router |
| 个人资料、论文、报告 | `src/data/content.ts` 中的 `personalInfo`、`publications`、`talks` |
| 主页区块开关 | `src/config/siteConfig.ts`；页脚始终显示，空的 Talks 列表不显示 |
| 博客元数据 | `src/lib/blogLoader.ts` 中的 `blogPostsData` |
| 内容类型 | `src/types/index.ts` |

论文和报告按数据数组中的顺序显示，维护时将新条目放在前面。新增博客需要同时添加 HTML 正文、列表元数据和 `public/sitemap.xml` 中的 URL。

`src/components/layout/` 提供共用布局和固定导航。`RichText.tsx` 只处理简介中的段落与 `[label](href)` 链接，不是完整 Markdown 渲染器。

## 样式与交互

- `tailwind.config.js` 定义暖纸色背景、墨色文字、锈红强调色及排版尺寸；`src/index.css` 定义纸张纹理、CSS 入场动画和摘要条样式。
- 标题使用 Fraunces Variable 的完整可变轴字体，正文使用 Instrument Sans Variable；字体通过 Fontsource 随应用打包。
- CSS 负责名字入场和区块滚动揭示；Motion 负责标题光泽与论文侧边轨迹等效果；GSAP ScrollTrigger 负责简介末段逐词揭示；OGL/WebGL 绘制首屏线条背景。
- 名字的字体变化、头像倾斜和列表聚光由独立组件处理。修改动效时，应保留动画未运行时可读的内容状态。

独立博客文章自行维护样式与脚本，不继承 React 应用的字体或布局；现有文章通过 CDN 加载 KaTeX。

## 部署与维护

推送 `master` 或手动运行 `Deploy to GitHub Pages` 工作流，会构建并通过 Pages artifact 部署 `dist/`。当前工作流运行 `pnpm run build`，未运行 lint，也未使用 `build:prod`。

- [部署说明](DEPLOYMENT.md)：工作流、站点路径、发布验证和故障定位。
- [代码维护说明](CLAUDE.md)：组件行为、内容约定和动效维护要求。
