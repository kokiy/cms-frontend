import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

const { Content } = Layout

export function MainLayout() {
  return (
    <Layout style={{ height: '100vh' }}>
      <Sidebar />
      <Layout style={{ overflow: 'hidden' }}>
        <Header />
        <Content
          style={{
            margin: '24px',
            padding: '24px',
            background: '#f5f5f5',
            overflow: 'auto',
            flex: 1,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
