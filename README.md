# Tech Homepage - Personal Website

一个现代化的个人主页网站，采用未来科技感的深色主题设计，支持博客和数学公式渲染。

## 🚀 特性

- **现代设计**：深色主题 + 霓虹点缀，极简主义美学
- **响应式布局**：完美适配桌面、平板和移动设备
- **动画效果**：基于 Framer Motion 的流畅动画和过渡效果
- **博客系统**：支持 Markdown 和 LaTeX 数学公式渲染
- **技术栈展示**：研究兴趣、出版物、项目展示
- **高性能**：优化的代码分割和静态资源加载

## 🛠 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite 6
- **样式系统**：Tailwind CSS
- **动画库**：Framer Motion
- **路由**：React Router v6
- **Markdown**：react-markdown + KaTeX
- **代码高亮**：react-syntax-highlighter
- **图标**：Lucide React

## 📁 项目结构

```
src/
├── components/
│   ├── layout/           # 布局组件
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   ├── ui/               # UI 组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Tag.tsx
│   │   └── Section.tsx
│   └── MarkdownRenderer.tsx
├── pages/                # 页面组件
│   ├── IntroPage.tsx
│   ├── BlogPage.tsx
│   └── BlogPostPage.tsx
├── data/                 # 数据文件
│   └── content.ts
├── types/                # 类型定义
│   └── index.ts
├── lib/                  # 工具函数
│   └── utils.ts
└── hooks/                # 自定义 Hooks
```

## 🎨 设计系统

### 色彩方案
- **主背景**：深空蓝 (#0A0E1A)
- **次背景**：暗夜灰 (#1A1E29)
- **主点缀色**：赛博青 (#00F0FF)
- **次点缀色**：激光紫 (#D900FF)
- **主文本**：星尘白 (#E0E0E0)
- **次文本**：中性灰 (#A0A2A8)

### 字体
- **界面字体**：Inter
- **代码字体**：Fira Code

### 动画
- 页面切换：平滑淡入淡出
- 组件悬停：轻微缩放和发光效果
- 滚动动画：从下往上淡入
- 背景元素：旋转和脉冲动画

## 🚀 快速开始

### 安装依赖
```bash
pnpm install
```

### 开发服务器
```bash
pnpm run dev
```
访问 http://localhost:3000

### 构建生产版本
```bash
pnpm run build
```

### 预览构建结果
```bash
pnpm run preview
```

## 📝 内容管理

### 个人信息
编辑 `src/data/content.ts` 中的 `personalInfo` 对象：

```typescript
export const personalInfo: PersonalInfo = {
  name: "你的姓名",
  title: "你的职位",
  bio: "个人简介",
  email: "your.email@example.com",
  social: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    // ...
  },
  researchInterests: ["AI", "机器学习", "..."],
};
```

### 出版物
在 `publications` 数组中添加新的出版物：

```typescript
{
  id: "unique-id",
  title: "论文标题",
  authors: ["作者1", "作者2"],
  venue: "会议或期刊名称",
  year: 2024,
  type: "conference", // "journal" | "preprint"
  doi: "10.1000/xxx",
  abstract: "摘要内容"
}
```

### 项目
在 `projects` 数组中添加新项目：

```typescript
{
  id: "unique-id",
  title: "项目名称",
  description: "项目描述",
  technologies: ["React", "Python", "..."],
  githubUrl: "https://github.com/user/repo",
  demoUrl: "https://demo.example.com",
  featured: true // 是否为精选项目
}
```

### 博客文章
在 `blogPosts` 数组中添加新文章：

```typescript
{
  id: "unique-id",
  title: "文章标题",
  slug: "article-slug",
  excerpt: "文章摘要",
  content: `# 标题\n\n文章内容...`,
  publishedAt: "2024-08-18",
  tags: ["AI", "技术"],
  readingTime: 5 // 预计阅读时间（分钟）
}
```

## 🔧 自定义配置

### 主题颜色
在 `src/index.css` 中修改 CSS 变量：

```css
:root {
  --bg-primary: #0A0E1A;
  --bg-secondary: #1A1E29;
  --accent-cyan: #00F0FF;
  --accent-magenta: #D900FF;
  /* ... */
}
```

### 动画设置
在组件中修改 Framer Motion 配置：

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
```

## 📱 响应式设计

网站采用移动优先的响应式设计：

- **Mobile** (< 768px)：单列布局，折叠导航
- **Tablet** (768px - 1024px)：双列布局
- **Desktop** (> 1024px)：完整网格布局

## 🧪 数学公式支持

使用 KaTeX 渲染 LaTeX 数学公式：

**行内公式**：`$E = mc^2$`

**块级公式**：
```
$$
\frac{\partial f}{\partial x} = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
$$
```

## 📦 部署指南

详细的 GitHub Pages 部署说明请参考 `DEPLOYMENT.md`。

## 🐛 故障排除

### 常见问题

1. **数学公式不渲染**
   - 确保 KaTeX CSS 已正确导入
   - 检查公式语法是否正确

2. **动画性能问题**
   - 减少同时播放的动画数量
   - 使用 `transform` 和 `opacity` 而非其他属性

3. **构建失败**
   - 清除 node_modules 重新安装
   - 检查 TypeScript 类型错误

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**在线演示**：[https://n4j8zbz1k4l7.space.minimax.io](https://n4j8zbz1k4l7.space.minimax.io)