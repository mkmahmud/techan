import axios from 'axios'

import { clearFrontendSessionCookie } from '@/modules/auth/utils/session-cookie'
import { useAuthStore } from '@/store/auth.store'

let isAutoLoggingOut = false

function shouldAutoLogout(status?: number, requestUrl?: string) {
    if (status !== 401) return false
    if (!requestUrl) return true

    // Login failures are valid 401 responses and should not trigger global logout.
    return !requestUrl.includes('/auth/login')
}

function autoLogoutOnUnauthorized() {
    if (typeof window === 'undefined' || isAutoLoggingOut) return

    isAutoLoggingOut = true

    clearFrontendSessionCookie()
    useAuthStore.getState().clearAuth()

    const currentPath = window.location.pathname
    if (!currentPath.startsWith('/auth/login')) {
        const redirect = encodeURIComponent(currentPath || '/dashboard')
        window.location.href = `/auth/login?redirect=${redirect}`
        return
    }

    isAutoLoggingOut = false
}

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api',
    withCredentials: true,
    timeout: 15000,
})

api.interceptors.response.use(
    response => response,
    error => {
        const status = error?.response?.status as number | undefined
        const requestUrl = error?.config?.url as string | undefined
        const message =
            (error?.response?.data?.message as string | undefined) ??
            (error?.message as string | undefined) ??
            'Unexpected error occurred'

        if (shouldAutoLogout(status, requestUrl)) {
            autoLogoutOnUnauthorized()
        }

        return Promise.reject({
            status,
            message,
            data: error?.response?.data,
        })
    },
)
