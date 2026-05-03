# AGENTS.md

## 项目概览

这是一个 CMS 前台 + 后台管理系统，使用 React + TypeScript + Vite + Ant Design。

## 关键命令

| 命令                  | 说明                              |
| --------------------- | --------------------------------- |
| `npm run dev`         | 启动开发服务器                    |
| `npm run build`       | 生产构建 (先运行 TypeScript 检查) |
| `npm run lint`        | 运行 ESLint                       |
| `npm run lint:oxlint` | 运行 oxlint (更快的 lint)         |
| `npm run format`      | 运行 Prettier 格式化              |
| `npm run gen:api`     | 从 OpenAPI 生成服务代码           |

## 架构要点

### 路由结构

- `/` - 前台首页 (博客)
- `/post/:id` - 前台文章详情
- `/login` / `/register` - 登录/注册
- `/admin/*` - 后台管理 (需要认证)
  - `/admin/posts` - 文章管理
  - `/admin/tags` - 标签管理
  - `/admin/categories` - 分类管理

### 目录结构

- `src/components/layout/` - 布局组件
  - `FrontendLayout` - 前台布局
  - `MainLayout` - 后台管理布局
- `src/pages/` - 页面组件
  - `home/` - 前台首页
  - `post/` - 文章详情页
  - `posts/`, `tags/`, `categories/` - 后台管理页
- `src/services/` - API 服务 (自动生成)
- `src/stores/` - Zustand 状态管理
- `src/locales/` - i18n 国际化文件

### 代码生成

- API 客户端通过 `@hey-api/openapi-ts` 从 OpenAPI 生成
- 输入源: `http://localhost:3000/api-docs-json`
- 输出: `src/services/`
- 使用 `npm run gen:api` 重新生成

### Git 工作流

- Husky + lint-staged 在 pre-commit 时运行:
  - `*.{ts,tsx}`: oxlint + prettier --write
  - `*.{css,scss,less}`: stylelint --fix + prettier --write
  - `*.{json,md,yml,yaml}`: prettier --write
- Commitlint 要求符合 conventional commits 规范

## 开发约定

### 路径别名

使用 `@/` 作为 `src/` 目录的别名，例如 `import { ... } from '@/services'`

### 验证顺序

修改代码后运行: `npm run build` 来确保 TypeScript 和构建检查通过
