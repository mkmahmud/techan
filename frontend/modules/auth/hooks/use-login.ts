import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useAuthStore } from '@/store/auth.store'

import { login } from '../services/auth.api'
import type { LoginRequest } from '../types/auth.types'
import { setFrontendSessionCookie } from '../utils/session-cookie'

type ApiError = {
    status?: number
    message?: string
    data?: {
        code?: string
        message?: string
    }
}

export function useLogin() {
    const setAuth = useAuthStore(state => state.setAuth)

    return useMutation({
        mutationFn: (payload: LoginRequest) => login(payload),
        onSuccess: response => {
            setAuth(response.data.user)
            setFrontendSessionCookie()
            toast.success('Login successful', {
                description: `Welcome ${response.data.user.name}`,
            })
        },
        onError: (error: ApiError) => {
            const message =
                error?.data?.message ?? error?.message ?? 'Unable to login right now'
            toast.error('Login failed', {
                description: message,
            })
        },
    })
}
