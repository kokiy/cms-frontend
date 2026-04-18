import { client } from './services/client.gen'
import { storeSelector } from './stores'
import { notification } from 'antd'

export const setupApiClient = () => {
  const isDev = import.meta.env.DEV
  client.setConfig({
    baseUrl: isDev ? '' : import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    auth: async () => {
      const token = storeSelector.getState().token
      return token as string | undefined
    },
  })

  client.interceptors.response.use(async (response) => {
    if (response.status === 401) {
      storeSelector.getState().clearAuth()
      window.location.href = '/login'
      notification.error({
        message: 'Session expired',
        description: 'Please login again',
      })
    }
    return response
  })

  client.interceptors.error.use(async (error) => {
    const message =
      error instanceof Error ? error.message : 'An error occurred while making the request'
    notification.error({
      message: 'Error',
      description: message,
    })
    return error
  })

  return client
}

export { client as apiClient }
