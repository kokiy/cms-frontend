import { Form, Input, Button, Card, notification, Typography } from 'antd'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authControllerRegister, type CreateUserDto } from '@/services'
import { storeSelector } from '@/stores'

const { Link } = Typography

export function RegisterPage() {
  const intl = useIntl()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const setToken = storeSelector.use.setToken()
  const setUser = storeSelector.use.setUser()

  const registerMutation = useMutation({
    mutationFn: async (values: { username: string; password: string }) => {
      const response = await authControllerRegister({
        body: values,
        throwOnError: true,
      })
      if (response.data.data?.access_token) {
        setToken(response.data.data.access_token)
        setUser({ username: response.data.data.username, id: 'a' })
      }
    },
    onSuccess: () => {
      notification.success({
        message: intl.formatMessage({ id: 'register.success' }),
      })
      setTimeout(() => {
        navigate('/posts')
      }, 500)
    },
    onError: (error) => {
      notification.error({
        message: intl.formatMessage({ id: 'register.failed' }),
        description: error instanceof Error ? error.message : undefined,
      })
    },
  })

  const onFinish = (
    values: CreateUserDto & {
      confirmPassword: string
    },
  ) => {
    registerMutation.mutate({ username: values.username, password: values.password })
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
      <Card title={intl.formatMessage({ id: 'register.title' })} style={{ width: 400 }}>
        <Form form={form} name="register" onFinish={onFinish} autoComplete="off" size="large">
          <Form.Item
            name="username"
            label={intl.formatMessage({ id: 'register.username' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'register.username.required' }),
              },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: 'register.username.placeholder' })} />
          </Form.Item>

          <Form.Item
            name="password"
            label={intl.formatMessage({ id: 'register.password' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'register.password.required' }),
              },
            ]}
          >
            <Input.Password
              placeholder={intl.formatMessage({ id: 'register.password.placeholder' })}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={intl.formatMessage({ id: 'register.confirmPassword' })}
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'register.confirmPassword.required' }),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    new Error(intl.formatMessage({ id: 'register.confirmPassword.match' })),
                  )
                },
              }),
            ]}
          >
            <Input.Password
              placeholder={intl.formatMessage({ id: 'register.confirmPassword.placeholder' })}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={registerMutation.isPending}>
              {intl.formatMessage({ id: 'register.submit' })}
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Link onClick={() => navigate('/login')}>
              {intl.formatMessage({ id: 'register.toLogin' })}
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}
