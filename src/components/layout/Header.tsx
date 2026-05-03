import { Layout, Dropdown, type MenuProps, Button, Breadcrumb, Space, Modal } from 'antd'
import { UserOutlined, GlobalOutlined, LogoutOutlined } from '@ant-design/icons'
import { useIntl } from 'react-intl'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { storeSelector } from '../../stores'

const { Header: AntHeader } = Layout

export function Header() {
  const intl = useIntl()
  const navigate = useNavigate()
  const location = useLocation()
  const locale = storeSelector.use.locale()
  const setLocale = storeSelector.use.setLocale()
  const user = storeSelector.use.user()
  const clearAuth = storeSelector.use.clearAuth()
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)

  const breadcrumbMap: Record<string, string> = {
    '/admin': '后台管理',
    '/admin/posts': intl.formatMessage({ id: 'common.posts' }),
    '/admin/tags': intl.formatMessage({ id: 'common.tags' }),
    '/admin/categories': intl.formatMessage({ id: 'common.categories' }),
  }

  const languageItems: MenuProps['items'] = [
    {
      key: 'zh-CN',
      label: intl.formatMessage({ id: 'common.chinese' }),
      onClick: () => setLocale('zh-CN'),
    },
    {
      key: 'en-US',
      label: intl.formatMessage({ id: 'common.english' }),
      onClick: () => setLocale('en-US'),
    },
  ]

  const userItems: MenuProps['items'] = [
    {
      key: 'logout',
      label: (
        <Space>
          <LogoutOutlined />
          {intl.formatMessage({ id: 'common.logout' })}
        </Space>
      ),
      onClick: () => {
        setIsLogoutConfirmOpen(true)
      },
    },
  ]

  const handleLogoutConfirm = () => {
    clearAuth()
    navigate('/login')
    setIsLogoutConfirmOpen(false)
  }

  const handleLogoutCancel = () => {
    setIsLogoutConfirmOpen(false)
  }

  return (
    <AntHeader
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <Breadcrumb items={[{ title: breadcrumbMap[location.pathname] || '后台管理' }]} />
      <Space>
        <Dropdown menu={{ items: languageItems, selectedKeys: [locale] }}>
          <Button icon={<GlobalOutlined />} type="text">
            {locale === 'zh-CN'
              ? intl.formatMessage({ id: 'common.chinese' })
              : intl.formatMessage({ id: 'common.english' })}
          </Button>
        </Dropdown>
        <Dropdown menu={{ items: userItems }}>
          <Button icon={<UserOutlined />} type="text">
            {user?.username || intl.formatMessage({ id: 'common.user' })}
          </Button>
        </Dropdown>
      </Space>

      <Modal
        title={intl.formatMessage({ id: 'common.confirm' })}
        open={isLogoutConfirmOpen}
        onOk={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        okText={intl.formatMessage({ id: 'common.confirm' })}
        cancelText={intl.formatMessage({ id: 'common.cancel' })}
      >
        <p>{intl.formatMessage({ id: 'common.logout.confirm' })}</p>
      </Modal>
    </AntHeader>
  )
}
