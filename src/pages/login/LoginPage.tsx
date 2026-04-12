import { useState } from 'react'
import { Form, Input, Button, Card, notification } from 'antd'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { storeSelector } from '../../stores'
import { authService } from '../../services/authService'

export function LoginPage() {
  const intl = useIntl()
  const navigate = useNavigate()
  const setToken = storeSelector.use.setToken()
  const setUser = storeSelector.use.setUser()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true)
    try {
      const response = await authService.login(values)
      setToken(response.token)
      setUser(response.user)
      notification.success({
        message: intl.formatMessage({ id: 'login.success' }),
      })
      setTimeout(() => {
        navigate('/posts')
      }, 500)
    } catch (error) {
      notification.error({
        message: intl.formatMessage({ id: 'login.failed' }),
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f0f2f5',
      }}
    >
      <Card title={intl.formatMessage({ id: 'login.title' })} style={{ width: 400 }}>
        <Form name="login" onFinish={onFinish} autoComplete="off" size="large">
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'login.username.required' }),
              },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: 'login.username.placeholder' })} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'login.password.required' }),
              },
            ]}
          >
            <Input.Password
              placeholder={intl.formatMessage({ id: 'login.password.placeholder' })}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {intl.formatMessage({ id: 'login.submit' })}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
