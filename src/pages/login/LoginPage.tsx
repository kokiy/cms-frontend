import { Form, Input, Button, Card, Typography } from 'antd'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authControllerLogin } from '@/services'
import { notification } from 'antd'
import { storeSelector } from '@/stores'

const { Link } = Typography

export function LoginPage() {
  const intl = useIntl()
  const navigate = useNavigate()
  const setToken = storeSelector.use.setToken()
  const setUser = storeSelector.use.setUser()

  const loginMutation = useMutation({
    mutationFn: async (values: { username: string; password: string }) => {
      const response = await authControllerLogin({
        body: values,
        throwOnError: true,
      })
      setToken(response.data.data.access_token)
      setUser({ username: response.data.data.username, id: 'a' })
    },
    onSuccess: () => {
      notification.success({
        title: intl.formatMessage({ id: 'login.success' }),
      })
      setTimeout(() => {
        navigate('/posts')
      }, 500)
    },
    onError: (error) => {
      notification.error({
        title: intl.formatMessage({ id: 'login.failed' }),
        description: error instanceof Error ? error.message : undefined,
      })
    },
  })

  const onFinish = (values: { username: string; password: string }) => {
    loginMutation.mutate(values)
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
            label={intl.formatMessage({ id: 'login.username' })}
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
            label={intl.formatMessage({ id: 'login.password' })}
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
            <Button type="primary" htmlType="submit" block loading={loginMutation.isPending}>
              {intl.formatMessage({ id: 'login.submit' })}
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Link onClick={() => navigate('/register')}>
              {intl.formatMessage({ id: 'login.toRegister' })}
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}
