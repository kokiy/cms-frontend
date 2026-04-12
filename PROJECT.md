# cms-frontend 项目文档

## 项目概述

**项目名称**：博客 CMS 前端管理系统  
**版本**：v1.0  
**状态**：开发中

这是一个现代化的博客内容管理系统前端项目，采用当前主流的 React 技术栈构建。项目主要功能包括用户登录、文章管理、标签管理，并支持国际化（中英文切换）。

---

## 技术栈

### 核心框架与库

- **React**: ^19.2.4
- **TypeScript**: ~5.9.3
- **Vite**: ^8.0.1
- **Ant Design**: ^6.3.4
- **React Router DOM**: ^7.13.2

### 状态管理与数据获取

- **Zustand**: ^5.0.12 (客户端状态)
- **TanStack React Query**: ^5.95.2 (服务端状态)

### 国际化

- **react-intl**: ^10.1.1

### 工具与工程化

- **Oxlint**: ^1.57.0
- **ESLint**: ^9.39.4
- **Stylelint**: ^17.6.0
- **Prettier**: ^3.8.1
- **Husky**: ^9.1.7 + lint-staged: ^16.4.0
- **@hey-api/openapi-ts**: ^0.94.5

---

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 代码检查与格式化

```bash
npm run lint          # ESLint 检查
npm run lint:oxlint   # Oxlint 检查
npm run lint:style    # Stylelint 检查
npm run format        # 格式化代码
```

---

## 项目架构

### 整体架构图

```
┌─────────────────────────────────────────┐
│           页面层 (Pages)                 │
│  LoginPage, PostsPage, TagsPage         │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│        组件层 (Components)               │
│     Layout, UI Components                │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│    路由与状态管理层                       │
│  (Router, Providers, Stores)            │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      服务层 (Services)                   │
│  API Client, Authentication              │
└─────────────────────────────────────────┘
```

### 核心设计理念

1. **状态分层**：服务端状态由 TanStack Query 管理，客户端状态由 Zustand 管理
2. **模块化设计**：代码按功能和类型清晰组织
3. **类型安全**：全程使用 TypeScript

---

## 目录结构

```
src/
├── assets/              # 静态资源
├── components/          # 组件目录
│   └── layout/          # 布局组件
├── hooks/               # 自定义 Hooks
├── locales/             # 国际化文件
│   ├── zh-CN/
│   └── en-US/
├── pages/               # 页面组件
│   ├── login/
│   ├── posts/
│   └── tags/
├── providers/           # React Context Providers
├── router/              # 路由配置
├── services/            # API 服务层
├── stores/              # Zustand 状态管理
│   └── slices/
├── types/               # TypeScript 类型定义
├── utils/               # 工具函数
├── App.tsx              # 应用根组件
└── main.tsx             # 应用入口
```

---

## 路由配置

### 路由结构

| 路径     | 页面              | 权限   |
| -------- | ----------------- | ------ |
| `/login` | 登录页            | 公开   |
| `/`      | 重定向到 `/posts` | 需登录 |
| `/posts` | 文章管理          | 需登录 |
| `/tags`  | 标签管理          | 需登录 |

### 路由守卫

- `ProtectedRoute` 组件检查用户登录状态
- 未登录用户访问受保护路由会跳转至 `/login`

---

## 状态管理

### Zustand Store 结构

#### Auth Store (`stores/slices/auth.ts`)

- `token` - 用户 Token
- `user` - 用户信息
- `isAuthenticated` - 登录状态
- 方法：`setToken()`, `setUser()`, `clearAuth()`

#### Global Store (`stores/slices/global.ts`)

- `sidebarCollapsed` - 侧边栏折叠状态
- `locale` - 语言偏好（持久化到 sessionStorage）
- 方法：`setSidebarCollapsed()`, `setLocale()`

#### Post Store (`stores/slices/post.ts`)

- `draftId` - 文章草稿 ID
- `hasUnsavedChanges` - 是否有未保存变更

#### Tag Store (`stores/slices/tag.ts`)

- `editingTagId` - 编辑中的标签 ID

### 使用方式

```typescript
import { storeSelector } from '@/stores';

function Component() {
  const token = storeSelector.use.token();
  const setLocale = storeSelector.use.setLocale();

  return <div>...</div>;
}
```

---

## 国际化

### 支持语言

- `zh-CN` - 简体中文（默认）
- `en-US` - 英文

### 翻译文件

- `common.ts` - 通用文案
- `login.ts` - 登录页
- `posts.ts` - 文章管理
- `tags.ts` - 标签管理

### 使用方式

```tsx
import { useIntl, FormattedMessage } from 'react-intl'

function Component() {
  const intl = useIntl()
  return (
    <>
      {intl.formatMessage({ id: 'common.posts' })}
      <FormattedMessage id="common.posts" />
    </>
  )
}
```

---

## API 服务层

### 基础配置

- API 基础 URL：`VITE_API_BASE_URL` 环境变量，默认 `/api`
- 自动注入 Token：`Authorization: Bearer ${token}`

### 错误处理

- 401：清除认证状态并跳转登录页
- 403：显示权限不足提示
- 5xx：显示服务异常提示

### 可用方法

```typescript
import { client } from '@/services/client'

client.get('/endpoint')
client.post('/endpoint', data)
client.put('/endpoint', data)
client.delete('/endpoint')
```

---

## 开发规范

### Git 提交规范

项目使用 Commitlint 校验提交信息，格式如下：

```
<type>(<scope>): <subject>
```

Type 可选值：

- `feat` - 新功能
- `fix` - 修复
- `docs` - 文档
- `style` - 格式
- `refactor` - 重构
- `test` - 测试
- `chore` - 构建/工具

### 代码规范

- 使用 TypeScript 严格模式
- 组件使用函数组件 + Hooks
- 样式使用 CSS Modules 或 Ant Design 主题
- 遵循 Prettier 格式化规则

---

## 项目进度

### ✅ 已完成

- 项目初始化与基础设施
- 基础架构与状态管理
- 路由配置
- 国际化配置
- Zustand Stores 配置
- API 请求层框架
- 全局布局组件
- 登录页面基础框架

### 🔄 进行中/待完成

- 文章管理功能
- 标签管理功能
- 响应式适配
- 完整的冒烟测试
- 性能优化

---

## 相关文档

- 开发计划：[doc/v1.md](./doc/v1.md)
- 任务清单：[doc/task.md](./doc/task.md)
