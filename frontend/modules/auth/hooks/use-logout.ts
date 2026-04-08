import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useAuthStore } from '@/store/auth.store'
import { logout } from '../services/auth.api'
import { clearFrontendSessionCookie } from '../utils/session-cookie'

type ApiError = {
    status?: number
    message?: string
    data?: {
        code?: string
        message?: string
    }
}

export function useLogout() {
    const clearAuth = useAuthStore(state => state.clearAuth)
    const router = useRouter()

    return useMutation({
        mutationFn: async () => {
            await logout()
            clearFrontendSessionCookie()
            clearAuth()
            return true
        },
        onSuccess: () => {
            toast.success('Logged out')
            router.replace('/auth/login')
            router.refresh()
        },
        onError: (error: ApiError) => {
            toast.error('Logout failed', {
                description:
                    error?.data?.message ?? error?.message ?? 'Please try again',
            })
        },
    })
}
