import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

const { Content } = Layout

export function MainLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Header />
        <Content
          style={{
            margin: '24px',
            padding: '24px',
            minHeight: 280,
            background: '#f5f5f5',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
