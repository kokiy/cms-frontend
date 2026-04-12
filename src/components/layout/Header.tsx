import { Layout, Dropdown, type MenuProps, Button, Breadcrumb, Space } from 'antd'
import { UserOutlined, GlobalOutlined, LogoutOutlined } from '@ant-design/icons'
import { useIntl } from 'react-intl'
import { useNavigate, useLocation } from 'react-router-dom'
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

  const breadcrumbMap: Record<string, string> = {
    '/posts': intl.formatMessage({ id: 'common.posts' }),
    '/tags': intl.formatMessage({ id: 'common.tags' }),
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
        clearAuth()
        navigate('/login')
      },
    },
  ]

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
      <Breadcrumb items={[{ title: breadcrumbMap[location.pathname] }]} />
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
    </AntHeader>
  )
}
