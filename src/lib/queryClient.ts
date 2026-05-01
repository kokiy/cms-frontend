import { QueryClient } from '@tanstack/react-query'
import { notification } from 'antd'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Response && error.status >= 400 && error.status < 500) {
          return false
        }
        return failureCount < 2
      },
    },
    mutations: {
      onError: (error: { message?: string }) => {
        const message = error.message || 'An error occurred'
        notification.error({
          message: 'Error',
          description: message,
        })
      },
    },
  },
})
