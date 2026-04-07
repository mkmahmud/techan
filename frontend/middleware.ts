import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_COOKIE_KEY = 'auth_token'
const FRONTEND_SESSION_COOKIE_KEY = 'techan_session'

function hasAuthCookie(request: NextRequest) {
    const token = request.cookies.get(AUTH_COOKIE_KEY)?.value
    return typeof token === 'string' && token.length > 0
}

function hasFrontendSessionCookie(request: NextRequest) {
    const value = request.cookies.get(FRONTEND_SESSION_COOKIE_KEY)?.value
    return value === '1'
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const isAuthenticated =
        hasAuthCookie(request) && hasFrontendSessionCookie(request)
    const isProtectedRoute = pathname === '/' || pathname.startsWith('/dashboard')

    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    if (pathname.startsWith('/auth/login') && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/dashboard/:path*', '/auth/login'],
}
