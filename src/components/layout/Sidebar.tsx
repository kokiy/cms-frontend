import { Menu, Layout } from 'antd'
import { BookOutlined, TagsOutlined, FolderOutlined } from '@ant-design/icons'
import { useIntl } from 'react-intl'
import { useNavigate, useLocation } from 'react-router-dom'
import { storeSelector } from '../../stores'

const { Sider } = Layout

export function Sidebar() {
  const intl = useIntl()
  const navigate = useNavigate()
  const location = useLocation()
  const sidebarCollapsed = storeSelector.use.sidebarCollapsed()
  const setSidebarCollapsed = storeSelector.use.setSidebarCollapsed()

  const menuItems = [
    {
      key: '/posts',
      icon: <BookOutlined />,
      label: intl.formatMessage({ id: 'common.posts' }),
    },
    {
      key: '/tags',
      icon: <TagsOutlined />,
      label: intl.formatMessage({ id: 'common.tags' }),
    },
    {
      key: '/categories',
      icon: <FolderOutlined />,
      label: intl.formatMessage({ id: 'common.categories' }),
    },
  ]

  return (
    <Sider
      collapsible
      collapsed={sidebarCollapsed}
      onCollapse={(collapsed) => setSidebarCollapsed(collapsed)}
      width={240}
      theme="light"
    >
      <div style={{ height: 64, display: 'flex', alignItems: 'center', paddingLeft: 24 }}>
        <h3 style={{ margin: 0, whiteSpace: 'nowrap' }}>CMS</h3>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  )
}
