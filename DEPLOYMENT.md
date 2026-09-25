# GitHub Pages 部署指南

本仓库对应用户站点 [dangxingyu.github.io](https://dangxingyu.github.io/)。部署配置以 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)、[`package.json`](package.json) 和 [`vite.config.ts`](vite.config.ts) 为准。

## 当前工作流

`Deploy to GitHub Pages` 在推送 `master` 时自动触发，也支持在 GitHub Actions 页面通过 `workflow_dispatch` 手动运行。当前没有 pull request 触发器。

构建任务依次执行：

1. 使用 `actions/checkout@v4` 检出代码。
2. 使用 `pnpm/action-setup@v4` 读取 `package.json` 的 `packageManager`，安装固定版本的 pnpm（当前为 `11.20.0`）。
3. 使用 `actions/setup-node@v4` 配置 Node.js 22 和 pnpm 缓存。
4. 执行 `pnpm install`。
5. 执行 `pnpm run build`，完成 TypeScript 检查和 Vite 构建。
6. 使用 `actions/configure-pages@v4` 和 `actions/upload-pages-artifact@v3`，将 `dist/` 上传为 Pages artifact。

部署任务依赖构建任务，使用 `actions/deploy-pages@v4` 发布到 `github-pages` environment。工作流声明了 `contents: read`、`pages: write`、`id-token: write` 权限，并通过 `pages` concurrency group 串行处理部署，不取消正在执行的任务。

仓库 **Settings → Pages → Build and deployment → Source** 应配置为 **GitHub Actions**。此流程直接发布 artifact，不需要 `gh-pages` 分支或本地 `deploy` 脚本。

## 本地构建与发布

使用 Node.js 22.13+，并与 `package.json` 中固定的 pnpm 版本保持一致。当前 CI 使用 Node.js 22；升级 pnpm 时需要一起核对 Node.js 要求。

```bash
pnpm install
pnpm run lint
pnpm run build
pnpm run preview
```

`pnpm-workspace.yaml` 已通过 `allowBuilds.esbuild: true` 允许 esbuild 的安装脚本。安装和构建分开执行；不要把自动安装依赖重新写入构建脚本。

检查预览后，将准备发布的更改提交并推送到 `master`。也可以在 GitHub 的 **Actions → Deploy to GitHub Pages → Run workflow** 中选择 `master`，重新部署该分支。构建产物 `dist/` 已被 Git 忽略，不需要提交。

### 两个构建命令的区别

| 命令 | 行为 |
| --- | --- |
| `pnpm run build` | `tsc -b && vite build`；当前 CI 使用此命令，源码定位插件保持启用 |
| `pnpm run build:prod` | `tsc -b && BUILD_MODE=prod vite build`；禁用 `vite-plugin-source-info`，不生成该插件的 `data-matrix-*` 属性 |

两者都生成 Vite 生产构建。`BUILD_MODE` 是本项目单独读取的环境变量；普通 `vite build` 不会自动将它设为 `prod`。若希望线上禁用源码定位插件，需要修改工作流中的构建命令。

当前 CI 包含 TypeScript 检查，但没有 ESLint 或浏览器测试步骤；`pnpm run lint` 需在本地单独执行。

## 站点路径与路由

这是部署在域名根目录的用户站点，相关设置须保持一致：

- `vite.config.ts`：`base: '/'`。
- `public/404.html`：`pathSegmentsToKeep = 0`。
- 根目录 `index.html`：包含解码 `/?/path` 并恢复浏览器路径的内联脚本。

直接打开 `/blog` 时，GitHub Pages 的 404 页面会先跳转到 `/?/blog`，入口脚本恢复路径后由 React Router 显示博客列表。其他未匹配的应用路由跳转到 `/`。

文章 `/blog/<slug>.html` 是真实静态文件，由 Pages 直接提供。新增文章需要更新 `src/lib/blogLoader.ts` 的元数据，以及 `public/sitemap.xml`。简介和博客列表依赖 React 客户端渲染；文章正文是独立 HTML。

`public/` 中的头像、文章、404 页面、robots 和 sitemap 在构建时复制到 `dist/`。JS/CSS 资源位于 `dist/assets/`；Vite 配置显式拆分了 React 的 `vendor` 和 React Router 的 `router` chunk。

主页的 canonical、Open Graph、Twitter card 和 Person 结构化数据位于根目录 `index.html`。独立文章不会继承这些元数据。若迁移域名或站点路径，需要一并检查这些 URL、robots、sitemap 和内容中的绝对路径。

## 发布验证

1. 在 GitHub Actions 中确认本次提交的 **build** 和 **deploy** 两个任务都成功；本地构建成功不代表线上已更新。
2. 打开线上 `/`、直接访问并刷新 `/blog`，再打开 `/blog/rlvr-ttlm.html`，检查头像、字体、文章公式和返回链接。
3. 检查移动端布局以及本次修改涉及的内容或动效。页脚的 `Last updated` 是构建时注入的日期，不是 Git 提交日期或部署成功凭证。

## 常见问题

| 现象 | 检查位置 |
| --- | --- |
| pnpm 无法启动或依赖安装失败 | 检查 Node.js 与固定的 pnpm 版本、`pnpm-lock.yaml`、`pnpm-workspace.yaml` 和 Actions 安装日志 |
| 构建成功但发布失败 | 检查 Pages Source 是否为 GitHub Actions、工作流权限、`github-pages` environment 和 deploy 日志 |
| 直接访问 `/blog` 失败 | 确认产物包含 `404.html`，`pathSegmentsToKeep` 为 `0`，根目录 `index.html` 保留解码脚本 |
| 头像或脚本、样式返回 404 | 检查产物路径和 `base: '/'`，不要套用项目子目录站点的 base 配置 |
| 新文章未出现在列表中 | HTML 文件与 `blogPostsData` 是分别维护的，检查 slug 与文件名是否一致 |
| 博客公式未渲染 | 检查文章自身的 KaTeX CDN 请求和脚本；该页面不使用 React 应用的依赖包 |
| 动画未运行时文字模糊或不可见 | 检查组件的初始样式、后台标签页行为和 reduced-motion 分支，参考 `CLAUDE.md` |
