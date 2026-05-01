# 项目最佳实践审查报告

审查日期: 2026-04-19

## 项目概览

这是一个基于 Vite + React 19 + React Router v7 + TypeScript 的 CMS 前端项目，使用 Zustand 进行状态管理，TanStack Query 处理服务端状态，Ant Design 作为 UI 组件库。

---

## ✅ 做得好的方面

### 1. Vite 配置

- ✅ 正确使用 `@vitejs/plugin-react`
- ✅ 路径别名 `@` 配置合理 (`vite.config.ts:11-13`)
- ✅ 开发代理配置完善
- ✅ 环境变量加载正确

### 2. TypeScript

- ✅ 严格模式启用 (`tsconfig.app.json`)
- ✅ 路径别名配置一致
- ✅ 类型定义组织清晰 (`src/types/`)

### 3. React 生态

- ✅ 使用 React 19 最新版本
- ✅ `StrictMode` 已启用 (`main.tsx:9-13`)
- ✅ 组件函数式写法
- ✅ 正确使用 Hooks

### 4. React Router v7

- ✅ 使用 `createBrowserRouter` 数据路由器模式
- ✅ 路由保护实现合理 (`ProtectedRoute.tsx`)
- ✅ 嵌套路由结构清晰 (`router.tsx:23-44`)

### 5. 状态管理

- ✅ Zustand + 中间件架构优雅
- ✅ Slice 模式模块化 (`stores/slices/`)
- ✅ 持久化配置正确使用 sessionStorage
- ✅ Selector 工厂模式 (`create-selectors.ts`)

### 6. 数据获取

- ✅ TanStack Query 配置完善 (`QueryProvider.tsx`)
- ✅ 合理的 staleTime 和重试策略
- ✅ Query keys 设计正确

### 7. 开发工具链

- ✅ ESLint + Prettier + Stylelint + Oxlint 全套配置
- ✅ Husky + lint-staged 预提交检查
- ✅ Commitlint 规范提交信息
- ✅ OpenAPI 驱动的 API 代码生成 (Hey API)

---

## ⚠️ 需要改进的问题

### 🔴 高优先级

#### 1. Router 在组件内创建

**文件**: `src/router/router.tsx:10-46`

**问题代码**:

```tsx
export function useAppRouter() {
  const token = storeSelector.use.token()
  const isAuthenticated = !!token
  return createBrowserRouter([...])  // ❌ 每次渲染都创建新 router
}
```

**问题描述**:

- 在 hook 内调用 `createBrowserRouter` 会导致每次状态变化时重新创建整个 router
- 可能造成性能问题和状态丢失
- 会破坏 React Router 的内部状态管理

**建议方案**:

**方案 A: 静态路由 + 路由守卫**

```tsx
// router.tsx
const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    loader: () => {
      const token = getToken()
      if (token) return redirect('/posts')
      return null
    },
  },
  // ...
])
```

**方案 B: 使用 lazy loader**

```tsx
// 保持 router 静态，在 loader/action 中处理认证
```

#### 2. QueryClient 在组件外部创建

**文件**: `src/providers/QueryProvider.tsx:4-27`

**问题代码**:

```tsx
export const queryClient = new QueryClient({...})  // ❌ 模块级单例
```

**问题描述**:

- 在服务端渲染或测试环境中可能导致状态污染
- 不利于测试时的隔离

**建议方案**:

```tsx
export function createQueryClient() {
  return new QueryClient({...})
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => createQueryClient())
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
```

---

### 🟡 中优先级

#### 3. 缺少 Error Boundary

**问题描述**:

- 没有 React Error Boundary 处理组件错误
- 未捕获的组件错误会导致整个应用白屏

**建议方案**:

```bash
pnpm add react-error-boundary
```

```tsx
// src/providers/ErrorBoundaryProvider.tsx
import { ErrorBoundary } from 'react-error-boundary'

function Fallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

export function ErrorBoundaryProvider({ children }) {
  return <ErrorBoundary FallbackComponent={Fallback}>{children}</ErrorBoundary>
}
```

#### 4. React Query 的 retry 逻辑可能有 bug

**文件**: `src/providers/QueryProvider.tsx:11`

**问题代码**:

```tsx
if (error instanceof Response && error.status >= 400 && error.status < 500)
```

**问题描述**:

- Hey API 返回的错误可能不是 `Response` 类型
- 需要检查实际错误结构

**建议方案**:

```tsx
retry: (failureCount, error) => {
  // 根据 Hey API 的实际错误类型调整
  const status = (error as any)?.status || (error as any)?.response?.status
  if (status && status >= 400 && status < 500) {
    return false
  }
  return failureCount < 2
},
```

#### 5. 大组件需要拆分

**文件**: `src/pages/posts/PostsPage.tsx` (323 行)

**问题描述**:

- 组件包含太多逻辑，违反单一职责原则
- 难以测试和维护

**建议拆分方案**:

```
src/pages/posts/
├── PostsPage.tsx           # 主容器
├── components/
│   ├── PostTable.tsx       # 表格组件
│   ├── PostFormDrawer.tsx  # 表单抽屉
│   └── PostSearchBar.tsx   # 搜索栏
└── hooks/
    └── usePosts.ts         # posts 逻辑 hook
```

**usePosts.ts 示例**:

```tsx
export function usePosts() {
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)

  const postListQuery = useQuery({...})
  const tagListQuery = useQuery({...})

  const createMutation = useMutation({...})
  const updateMutation = useMutation({...})
  const deleteMutation = useMutation({...})
  const publishMutation = useMutation({...})

  return {
    keyword, setKeyword,
    page, setPage,
    postListQuery,
    tagListQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    publishMutation,
  }
}
```

---

### 🟢 低优先级

#### 6. 缺少测试

**问题描述**:

- 虽然有完整的工具链，但没有实际测试文件

**建议方案**:

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom
```

添加 `vitest.config.ts`:

```tsx
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

#### 7. Vite build 优化

**文件**: `vite.config.ts`

**建议添加**:

```tsx
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    // 新增: build 优化
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'antd-vendor': ['antd'],
            'router-vendor': ['react-router-dom'],
          },
        },
      },
    },
  }
})
```

#### 8. 环境变量类型安全

**建议添加**: `src/vite-env.d.ts`

```tsx
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

---

## 📊 优先级改进清单

| 优先级 | 问题                   | 文件                              | 预计工作量 |
| ------ | ---------------------- | --------------------------------- | ---------- |
| 🔴 高  | Router 在组件内创建    | `src/router/router.tsx`           | 2-3 小时   |
| 🔴 高  | QueryClient 模块级单例 | `src/providers/QueryProvider.tsx` | 30 分钟    |
| 🟡 中  | 添加 Error Boundary    | 新建                              | 1 小时     |
| 🟡 中  | 修复 retry 逻辑        | `src/providers/QueryProvider.tsx` | 30 分钟    |
| 🟡 中  | 拆分 PostsPage 组件    | `src/pages/posts/`                | 3-4 小时   |
| 🟢 低  | 添加测试配置           | 新建                              | 1-2 小时   |
| 🟢 低  | Vite build 优化        | `vite.config.ts`                  | 30 分钟    |
| 🟢 低  | 环境变量类型           | `src/vite-env.d.ts`               | 15 分钟    |

---

## 📈 总体评价

| 维度     | 评分       | 说明                              |
| -------- | ---------- | --------------------------------- |
| 项目架构 | ⭐⭐⭐⭐   | 整体架构清晰，分层合理            |
| 代码质量 | ⭐⭐⭐⭐   | TypeScript 使用规范，代码风格统一 |
| 工具链   | ⭐⭐⭐⭐⭐ | 配置完善，lint/format 齐全        |
| 性能     | ⭐⭐⭐     | 有 router 重建问题需要修复        |
| 可维护性 | ⭐⭐⭐     | 部分组件过大，需要拆分            |
| 测试     | ⭐         | 有基础设施但无实际测试            |

### 总结

这是一个**架构良好、工具链完善**的项目，采用了现代 React 技术栈的最佳实践。核心问题是 router 创建方式需要修复，这是影响性能和稳定性的关键问题。其他问题大多是可维护性和优化方面的改进建议。

建议优先解决高优先级问题，然后逐步推进中低优先级的改进。
