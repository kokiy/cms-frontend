# 任务进度

## Phase 1: 项目初始化与基础设施 ✅

- [x] 使用 Vite 创建 React + TypeScript 项目
- [x] 安装核心依赖
- [x] 配置工程化工具（Oxlint、Stylelint、Prettier、Husky）

## Phase 2: 基础架构与状态管理 ✅

- [x] 配置路由（react-router-dom）
- [x] 配置国际化（react-intl）
- [x] 配置 TanStack Query
- [x] 配置 Zustand Stores
- [x] API 请求层

## Phase 3: 全局布局 ✅

- [x] 侧边栏组件（支持折叠/展开，状态持久化）
- [x] 顶栏组件（面包屑、用户菜单、语言切换、退出登录）
- [x] 内容区布局
- [x] 响应式适配

## Phase 4: 登录页 (`/login`) ✅

- [x] 登录表单与验证
- [x] 登录逻辑
- [x] 验收检查（L01-L04）

## Phase 4.5: 注册页 (`/register`) ✅

- [x] 注册表单与验证
- [x] 注册逻辑
- [x] 验收检查（R01-R05）

## Phase 5: 文章管理 (`/posts`) ⚠️

- [x] 文章列表页（搜索、筛选、分页）
- [x] 发布配置 Drawer（标签多选）
- [x] 数据操作 Hooks（usePostList、usePostCreate 等）
- [x] 验收检查（P01-P02, P04-P05）
- [ ] Markdown 编辑器与预览
- [ ] 分类选择
- [ ] 发布开关
- [x] 未保存变更检测（P03）

## Phase 6: 标签管理 (`/tags`) ⚠️

- [x] 标签列表与关联文章计数
- [x] 新增/编辑/删除标签
- [x] 数据操作 Hooks
- [x] 验收检查（T01, T03-T04）
- [ ] 标签名称重复错误处理（T02）

## Phase 7: 国际化与体验优化 ✅

- [x] 顶栏语言切换
- [x] 所有文案迁移到 react-intl
- [x] 无硬编码文本
- [ ] 骨架屏
- [ ] 优化 TTI
