# 技术栈

## 2.1 核心框架与库

| 维度           | 选型配置            | 核心价值                                     |
| :------------- | :------------------ | :------------------------------------------- |
| **核心框架**   | React 19 (Hooks)    | 组件化与成熟生态，支持高性能渲染             |
| **构建工具**   | Vite                | 极速 HMR 与原生 ESM 支持，秒级启动           |
| **UI 组件库**  | Ant Design v6       | 工业级 UI 规范、Design Token 驱动样式定制    |
| **路由**       | React Router v7     | 声明式路由、数据加载、嵌套路由               |
| **国际化**     | react-intl          | React 官方推荐，完善的 ICU 消息格式支持      |
| **服务端状态** | TanStack Query      | 声明式数据获取、自动缓存与重试、乐观更新支持 |
| **客户端状态** | Zustand             | 轻量级、无模板代码、原生支持持久化           |
| **API 生成**   | @hey-api/openapi-ts | 基于 Swagger 的全链路类型安全请求层          |

## 2.2 开发工具链

| 工具                    | 用途                                       |
| :---------------------- | :----------------------------------------- |
| **Oxlint**              | Rust 驱动的 Linter，比 ESLint 快 50-100 倍 |
| **ESLint**              | JavaScript/TypeScript 代码检查             |
| **Stylelint**           | CSS/SCSS 样式检查                          |
| **Prettier**            | 代码格式化                                 |
| **Husky + lint-staged** | Commit 前自动 lint 暂存文件                |
| **Commitlint**          | 校验 Commit Message 格式                   |

## 2.3 依赖版本

```json
{
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "react-router-dom": "^7.13.2",
  "@tanstack/react-query": "^5.95.2",
  "zustand": "^5.0.12",
  "antd": "^6.3.4",
  "react-intl": "^10.1.1",
  "typescript": "~5.9.3",
  "vite": "^8.0.1"
}
```
