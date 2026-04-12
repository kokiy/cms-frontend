import { RouterProvider } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'
import { storeSelector } from './stores'
import { I18nProvider, QueryProvider } from './providers'
import { useAppRouter } from './router'

function AppContent() {
  const locale = storeSelector.use.locale()
  const router = useAppRouter()
  const antdLocale = locale === 'zh-CN' ? zhCN : enUS

  return (
    <ConfigProvider locale={antdLocale}>
      <RouterProvider router={router} />
    </ConfigProvider>
  )
}

function App() {
  return (
    <I18nProvider>
      <QueryProvider>
        <AppContent />
      </QueryProvider>
    </I18nProvider>
  )
}

export default App
