import { notification } from 'antd'
import { storeSelector } from '../stores'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

interface RequestOptions extends RequestInit {
  skipAuth?: boolean
}

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth = false, ...init } = options

  const headers = new Headers()
  headers.set('Content-Type', 'application/json')

  // Merge in incoming headers
  if (init.headers) {
    if (init.headers instanceof Headers) {
      init.headers.forEach((value, key) => {
        headers.set(key, value)
      })
    } else if (Array.isArray(init.headers)) {
      init.headers.forEach(([key, value]) => {
        headers.set(key, value)
      })
    } else {
      Object.entries(init.headers).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          headers.set(key, String(value))
        }
      })
    }
  }

  if (!skipAuth) {
    const token = storeSelector.getState().token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...init,
    headers,
  })

  // Handle 401
  if (response.status === 401) {
    storeSelector.getState().clearAuth()
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  // Handle 403
  if (response.status === 403) {
    notification.error({
      message: 'Permission Denied',
      description: 'You do not have permission to perform this action',
    })
    throw new Error('Forbidden')
  }

  // Handle 5xx errors
  if (response.status >= 500) {
    notification.error({
      message: 'Server Error',
      description: 'Service unavailable, please try again later',
    })
    throw new Error('Server Error')
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || 'Request failed')
  }

  return response.json()
}

export const client = {
  get: <T>(url: string, options?: RequestOptions) => request<T>(url, { ...options, method: 'GET' }),
  post: <T>(url: string, data?: unknown, options?: RequestOptions) =>
    request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  put: <T>(url: string, data?: unknown, options?: RequestOptions) =>
    request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  delete: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'DELETE' }),
}
