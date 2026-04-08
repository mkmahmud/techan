import { api } from '@/lib/api'

import type {
    LoginRequest,
    LoginResponse,
    LogoutResponse,
} from '../types/auth.types'

export async function login(payload: LoginRequest) {
    const { data } = await api.post<LoginResponse>('/auth/login', payload)
    return data
}

export async function logout() {
    const { data } = await api.post<LogoutResponse>('/auth/logout')
    return data
}
