# 博客 CMS 前端 v1.0 开发任务清单

> **基于文档**：doc/v1.md
> **创建日期**：2026-03-28

---

## Phase 1: 项目初始化与基础设施

- [x] **1.1 初始化项目**
  - [x] 使用 Vite 创建 React + TypeScript 项目
  - [x] 配置项目基础目录结构

- [x] **1.2 安装核心依赖**
  - [x] React 18+
  - [x] Ant Design v6
  - [x] react-intl
  - [x] @tanstack/react-query
  - [x] zustand
  - [x] @hey-api/openapi-ts
  - [x] react-router-dom

- [x] **1.3 配置工程化工具**
  - [x] 配置 Oxlint (oxlint:recommended + react-hooks/recommended)
  - [x] 配置 Stylelint (stylelint-config-standard + stylelint-order)
  - [x] 配置 Prettier (semi: true, singleQuote: true, printWidth: 100, trailingComma: all)
  - [x] 配置 TypeScript
  - [x] 配置 Husky + lint-staged
    - [x] pre-commit hook: oxlint + stylelint + prettier
    - [x] commit-msg hook: 校验 commit message 格式

---

## Phase 2: 基础架构与状态管理 ✅

- [x] **2.1 配置路由**
  - [x] 安装 react-router-dom
  - [x] 配置路由表：`/login`, `/posts`, `/tags`, `/register`
  - [x] 实现路由守卫（未登录跳转到 `/login`）

- [x] **2.2 配置国际化 (react-intl)**
  - [x] 创建 `src/locales/` 目录结构
  - [x] 创建 `zh-CN` 和 `en-US` 翻译文件
    - [x] common.ts（通用文案）
    - [x] login.ts（登录页和注册页）
    - [x] posts.ts（文章管理）
    - [x] tags.ts（标签管理）
  - [x] 配置 IntlProvider
  - [x] 实现语言切换逻辑

- [x] **2.3 配置 TanStack Query**
  - [x] 创建 QueryClient 并配置
  - [x] 配置全局错误处理
  - [x] 创建 `src/hooks/` 目录

- [x] **2.4 配置 Zustand Stores**
  - [x] `useAuthStore`（Token、用户信息、登录态恢复，支持持久化）
  - [x] `useGlobalStore`（侧边栏折叠、语言偏好、全局 UI 偏好，支持持久化）
  - [x] `usePostStore`（文章编辑草稿态）
  - [x] `useTagStore`（标签编辑临时态）

- [x] **2.5 API 请求层**
  - [x] 配置 `@hey-api/openapi-ts` 生成脚本 `npm run gen:api`
  - [x] 创建 `src/services/` 目录
  - [x] 实现统一请求入口
    - [x] Token 注入
    - [x] 401 清理状态与跳转登录
    - [x] 错误消息标准化（notification.error）

---

## Phase 3: 全局布局 ✅

- [x] **3.1 布局组件**
  - [x] 侧边栏组件（支持折叠/展开，状态持久化）
  - [x] 顶栏组件（面包屑、用户菜单、语言切换、退出登录）
  - [x] 内容区布局（统一 padding: 24px，背景使用 token.colorBgLayout）
  - [x] 响应式适配（1366x768 与移动端竖屏）

---

## Phase 4: 登录页 (`/login`) ✅

- [x] **4.1 登录表单**
  - [x] 账号输入框
  - [x] 密码输入框
  - [x] 提交按钮（loading 状态）
  - [x] 表单验证（账号/密码为空时提示）

- [x] **4.2 登录逻辑**
  - [x] 调用登录 API
  - [x] 保存 Token 与用户信息到 auth store
  - [x] 登录成功后跳转 `/posts`
  - [x] 已登录用户访问 `/login` 时直接跳转 `/posts`
  - [x] 错误处理（展示错误消息，不清空账号）
  - [x] 添加跳转到注册页的链接

- [x] **4.3 验收检查**
  - [x] L01: 账号或密码为空时阻止提交并提示
  - [x] L02: 提交后按钮 loading，不可重复提交
  - [x] L03: 登录成功后 1 秒内跳转
  - [x] L04: 失败时展示错误，保留账号输入

---

## Phase 4.5: 注册页 (`/register`) ✅

- [x] **4.5.1 注册表单**
  - [x] 账号输入框
  - [x] 密码输入框
  - [x] 确认密码输入框
  - [x] 提交按钮（loading 状态）
  - [x] 表单验证（账号/密码/确认密码为空时提示，密码与确认密码一致时提示）

- [x] **4.5.2 注册逻辑**
  - [x] 调用 API（当前模拟为登录，实际项目中替换为注册接口）
  - [x] 注册成功后跳转登录页或自动登录并跳转 `/posts`
  - [x] 已登录用户访问 `/register` 时直接跳转 `/posts`
  - [x] 错误处理（展示错误消息，不清空账号）
  - [x] 添加跳转到登录页的链接

- [x] **4.5.3 验收检查**
  - [x] R01: 账号或密码或确认密码为空时阻止提交并提示
  - [x] R02: 密码与确认密码不一致时阻止提交并提示
  - [x] R03: 提交后按钮 loading，不可重复提交
  - [x] R04: 注册成功后跳转
  - [x] R05: 失败时展示错误，保留账号输入

---

## Phase 5: 文章管理 (`/posts`) ✅

- [x] **5.1 文章列表页**
  - [x] 关键字搜索输入框
  - [x] 状态筛选（草稿/已发布）
  - [x] 文章列表展示
  - [x] 分页组件
  - [x] 使用 `usePostList` Hook 封装查询
  - [x] 筛选条件变化时重置到第 1 页
  - [x] 分页切换保留筛选条件

- [ ] **5.2 文章编辑器**
  - [ ] Markdown 编辑器
  - [ ] Markdown 预览
  - [ ] 未保存变更检测

- [x] **5.3 发布配置**
  - [x] 右侧 Drawer 组件
  - [x] 标签多选
  - [ ] 分类选择
  - [ ] 发布开关

- [x] **5.4 数据操作 Hooks**
  - [x] `usePostList`（文章列表查询）
  - [x] `usePostDetail`（文章详情查询）
  - [x] `usePostCreate`（创建文章）
  - [x] `usePostUpdate`（更新文章）
  - [x] `usePostPublish`（发布文章）
  - [x] `usePostDelete`（删除文章）

- [x] **5.5 验收检查**
  - [x] P01: 筛选条件变化后自动重置第 1 页
  - [x] P02: 分页切换保留筛选条件
  - [ ] P03: 未保存变更时离开页面二次确认
  - [x] P04: 发布成功后列表状态一致更新
  - [x] P05: 接口错误时页面保持可操作

---

## Phase 6: 标签管理 (`/tags`) ✅

- [x] **6.1 标签列表**
  - [x] 标签列表展示
  - [x] 关联文章计数展示

- [x] **6.2 标签操作**
  - [x] 新增标签（Modal/Form）
  - [x] 编辑标签（Modal/Form）
  - [x] 删除标签（二次确认）
  - [x] 表单验证（标签名称为空时禁止提交）

- [x] **6.3 数据操作 Hooks**
  - [x] `useTagList`（标签列表查询）
  - [x] `useTagCreate`（新增标签）
  - [x] `useTagUpdate`（更新标签）
  - [x] `useTagDelete`（删除标签）

- [x] **6.4 验收检查**
  - [x] T01: 标签名称为空时禁止提交
  - [ ] T02: 名称重复时展示错误并保留输入
  - [x] T03: 删除前二次确认
  - [x] T04: 删除成功后列表即时更新

---

## Phase 7: 国际化与体验优化 ✅

- [x] **7.1 国际化落地**
  - [x] 顶栏添加语言切换下拉菜单
  - [x] 所有文案迁移到 react-intl
  - [x] 无硬编码文本

- [x] **7.2 体验优化**
  - [x] 所有提交按钮 loading 状态
  - [ ] 骨架屏（加载超过 300ms）
  - [ ] 优化 TTI（首屏可交互时间 < 2s）
  - [ ] 操作反馈时间 < 1s

- [x] **7.3 验收检查**
  - [x] I01: 顶栏语言切换菜单
  - [x] I02: 切换语言无刷新，文案即时更新
  - [x] I03: 刷新后保留语言偏好
  - [x] I04: 无硬编码文本

---

## Phase 8: 全局布局验收 ✅

- [x] G01: 刷新页面后保留侧边栏折叠状态
- [x] G02: 退出登录后清空状态并跳转 `/login`
- [x] G03: 1366x768 与移动端竖屏无结构性溢出

---

## Phase 9: 冒烟测试与发布准备

- [ ] **9.1 冒烟测试**
  - [ ] 登录流程测试
  - [ ] 文章查询测试
  - [ ] 标签新增测试

- [ ] **9.2 发布阻断项检查**
  - [x] 登录后可访问 `/posts`
  - [x] 401 可正确回到 `/login`
  - [x] 文章发布后列表状态一致
  - [x] 标签新增/删除无数据错乱
  - [x] 所有质量门禁通过

- [ ] **9.3 构建与发布**
  - [x] 构建产物验证
  - [ ] 发布

---

## 附录：技术栈快速索引

| 类别       | 技术选型            |
| :--------- | :------------------ |
| 框架       | React 18+ (Hooks)   |
| 构建       | Vite                |
| UI         | Ant Design v6       |
| 路由       | react-router-dom    |
| 国际化     | react-intl          |
| 服务端状态 | TanStack Query      |
| 客户端状态 | Zustand             |
| API 生成   | @hey-api/openapi-ts |
| Git Hooks  | Husky + lint-staged |
| Linter     | Oxlint, Stylelint   |
| Formatter  | Prettier            |
