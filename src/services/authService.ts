import { client } from './client'
import type { User } from '../stores/slices/auth'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return client.post<LoginResponse>('/auth/login', data, { skipAuth: true })
  },
}
