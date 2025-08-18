# GitHub Pages 部署指南

本指南将帮助您将 Tech Homepage 网站部署到 GitHub Pages。

## 🚀 部署方式

### 方式一：GitHub Actions 自动部署（推荐）

#### 1. 准备仓库

1. 在 GitHub 上创建新仓库
2. 将代码推送到仓库

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

#### 2. 创建 GitHub Actions 工作流

在项目根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Setup pnpm
      uses: pnpm/action-setup@v4
      with:
        version: 8
        
    - name: Install dependencies
      run: pnpm install
      
    - name: Build
      run: pnpm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v4
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

#### 3. 配置 GitHub Pages

1. 进入仓库设置 (Settings)
2. 滚动到 "Pages" 部分
3. 在 "Source" 下选择 "Deploy from a branch"
4. 选择 `gh-pages` 分支和 `/ (root)` 文件夹
5. 点击 "Save"

#### 4. 更新 Vite 配置

修改 `vite.config.ts`，设置正确的 base 路径：

```typescript
export default defineConfig({
  // ... 其他配置
  base: '/your-repo-name/', // 替换为你的仓库名
})
```

### 方式二：手动部署

#### 1. 构建项目

```bash
pnpm run build
```

#### 2. 部署到 gh-pages 分支

安装 gh-pages 工具：

```bash
pnpm add -D gh-pages
```

在 `package.json` 添加部署脚本：

```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

执行部署：

```bash
pnpm run deploy
```

## 🔧 配置选项

### 自定义域名

1. 在 `public` 文件夹创建 `CNAME` 文件
2. 在文件中写入你的域名：

```
yourdomain.com
```

3. 在 GitHub Pages 设置中配置自定义域名

### 路由配置

由于 GitHub Pages 是静态托管，需要处理 SPA 路由：

在 `public` 文件夹创建 `404.html`：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Tech Homepage</title>
    <script type="text/javascript">
      // GitHub Pages SPA 重定向
      var pathSegmentsToKeep = 1;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + 
        '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
  </body>
</html>
```

在 `public/index.html` 的 `<head>` 中添加：

```html
<script type="text/javascript">
  (function(l) {
    if (l.search[1] === '/' ) {
      var decoded = l.search.slice(1).split('&').map(function(s) { 
        return s.replace(/~and~/g, '&')
      }).join('?');
      window.history.replaceState(null, null,
          l.pathname.slice(0, -1) + decoded + l.hash
      );
    }
  }(window.location))
</script>
```

## 📊 性能优化

### 资源压缩

Vite 已自动启用：
- JavaScript/CSS 压缩
- 资源哈希命名
- Tree shaking

### 代码分割

当前配置已实现最佳的代码分割：

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        router: ['react-router-dom'],
        framer: ['framer-motion'],
        markdown: ['react-markdown', 'remark-math', 'rehype-katex'],
        syntax: ['react-syntax-highlighter']
      }
    }
  }
}
```

### 缓存策略

- 静态资源使用长期缓存
- HTML 文件使用短期缓存
- 服务端启用 gzip 压缩

## 🔍 故障排除

### 常见问题

#### 1. 页面显示 404

**原因**：路由配置问题或 base 路径错误

**解决方案**：
- 检查 `vite.config.ts` 中的 `base` 设置
- 确保 `404.html` 正确配置
- 验证 GitHub Pages 设置

#### 2. 静态资源加载失败

**原因**：资源路径错误

**解决方案**：
- 使用相对路径 `base: './'
- 或设置完整路径 `base: '/repo-name/'`

#### 3. CSS 样式丢失

**原因**：CSS 文件路径错误或未正确导入

**解决方案**：
- 检查 CSS 导入路径
- 确保 Tailwind CSS 配置正确
- 验证 PostCSS 配置

#### 4. GitHub Actions 构建失败

**原因**：依赖安装失败或构建错误

**解决方案**：
- 检查 Node.js 版本兼容性
- 验证 package.json 依赖
- 查看 Actions 日志详细错误

### 调试步骤

1. **本地验证**
   ```bash
   pnpm run build
   pnpm run preview
   ```

2. **检查构建输出**
   ```bash
   ls -la dist/
   ```

3. **验证资源路径**
   检查 `dist/index.html` 中的资源引用路径

4. **测试路由**
   确保所有页面路由正常工作

## 📱 多平台支持

### 移动端优化

- 响应式设计已实现
- 触摸友好的交互
- 优化的加载性能

### PWA 支持 (可选)

如需添加 PWA 功能：

1. 安装 Vite PWA 插件
2. 配置 Service Worker
3. 添加 Web App Manifest

## 🚀 持续集成

### 自动化流程

当前 GitHub Actions 工作流包括：

1. **代码检查**：ESLint + TypeScript
2. **构建测试**：确保项目可正常构建
3. **自动部署**：推送到 gh-pages 分支
4. **缓存优化**：依赖和构建缓存

### 扩展功能

可添加的 CI/CD 功能：

- 单元测试
- E2E 测试
- 性能检测
- 安全扫描
- 代码覆盖率

---

部署完成后，您的网站将在 `https://yourusername.github.io/your-repo-name/` 可访问。