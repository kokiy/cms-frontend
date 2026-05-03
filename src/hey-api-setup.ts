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
        title: 'Session expired',
        description: 'Please login again',
      })
    }
    return response
  })

  client.interceptors.error.use(async (error) => {
    let errorMessage = 'An error occurred while making the request'

    // 尝试从错误响应中获取更详细的错误信息
    if (error && typeof error === 'object') {
      // @ts-ignore - 检查是否有 response 数据
      if (error.response) {
        // @ts-ignore
        const responseData = error.response.data
        if (responseData && responseData.message) {
          errorMessage = responseData.message
        } else if (responseData && typeof responseData === 'string') {
          errorMessage = responseData
        }
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message
      }
    }

    notification.error({
      title: 'Error',
      description: errorMessage,
    })
    return error
  })

  return client
}

export { client as apiClient }
