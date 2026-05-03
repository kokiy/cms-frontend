import { Layout, Typography, Space, Button } from 'antd'
import { Outlet, Link } from 'react-router-dom'
import { HomeOutlined, ReadOutlined } from '@ant-design/icons'

const { Header, Content, Footer } = Layout
const { Title } = Typography

export function FrontendLayout() {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header
        style={{
          background: '#fff',
          padding: '0 50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
            <ReadOutlined style={{ marginRight: 8 }} />
            My Blog
          </Title>
        </Link>
        <Space>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button type="text" icon={<HomeOutlined />}>
              首页
            </Button>
          </Link>
          <Link to="/admin" style={{ textDecoration: 'none' }}>
            <Button type="text">后台管理</Button>
          </Link>
        </Space>
      </Header>
      <Content style={{ padding: '24px 50px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center', background: '#fff', marginTop: 48 }}>
        My Blog ©{new Date().getFullYear()} Created with React & Ant Design
      </Footer>
    </Layout>
  )
}
