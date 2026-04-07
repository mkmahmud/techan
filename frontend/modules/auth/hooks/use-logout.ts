import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useAuthStore } from '@/store/auth.store'
import { clearFrontendSessionCookie } from '../utils/session-cookie'

export function useLogout() {
    const clearAuth = useAuthStore(state => state.clearAuth)
    const router = useRouter()

    return useMutation({
        mutationFn: async () => {
            clearFrontendSessionCookie()
            clearAuth()
            return true
        },
        onSuccess: () => {
            toast.success('Logged out')
            router.replace('/auth/login')
            router.refresh()
        },
    })
}
