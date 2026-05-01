# 已知问题与改进建议

## 8.1 高优先级问题

### 问题 1: Router 在组件内创建

**文件**：`src/router/router.tsx`

**问题描述**：

- 在 hook 内调用 `createBrowserRouter` 会导致每次状态变化时重新创建整个 router
- 可能造成性能问题和状态丢失
- 会破坏 React Router 的内部状态管理

**建议方案**：
使用静态路由 + loader/action 处理认证，避免在组件内创建 router。

### 问题 2: QueryClient 模块级单例

**文件**：`src/providers/QueryProvider.tsx`

**问题描述**：

- 在服务端渲染或测试环境中可能导致状态污染
- 不利于测试时的隔离

**建议方案**：
在组件内使用 `useState` 创建 QueryClient 实例。

## 8.2 中优先级问题

### 问题 3: 缺少 Error Boundary

**建议**：添加 React Error Boundary 处理组件错误，避免未捕获的错误导致整个应用白屏。

### 问题 4: React Query 的 retry 逻辑可能有 bug

**文件**：`src/providers/QueryProvider.tsx`

**建议**：根据 Hey API 的实际错误类型调整 retry 逻辑。

### 问题 5: 大组件需要拆分

**文件**：`src/pages/posts/PostsPage.tsx`

**建议**：拆分为 PostTable、PostFormDrawer、PostSearchBar 等小组件，并将逻辑抽取到 usePosts hook。

## 8.3 低优先级改进

- 添加测试配置（Vitest + Testing Library）
- Vite build 优化（manualChunks）
- 环境变量类型安全

## 8.4 总体评价

| 维度     | 评分       | 说明                              |
| :------- | :--------- | :-------------------------------- |
| 项目架构 | ⭐⭐⭐⭐   | 整体架构清晰，分层合理            |
| 代码质量 | ⭐⭐⭐⭐   | TypeScript 使用规范，代码风格统一 |
| 工具链   | ⭐⭐⭐⭐⭐ | 配置完善，lint/format 齐全        |
| 性能     | ⭐⭐⭐     | 有 router 重建问题需要修复        |
| 可维护性 | ⭐⭐⭐     | 部分组件过大，需要拆分            |
| 测试     | ⭐         | 有基础设施但无实际测试            |
