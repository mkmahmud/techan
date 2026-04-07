const FRONTEND_SESSION_COOKIE = 'techan_session'

function getSecureFlag() {
    if (typeof window === 'undefined') return ''
    return window.location.protocol === 'https:' ? '; Secure' : ''
}

export function setFrontendSessionCookie() {
    document.cookie = `${FRONTEND_SESSION_COOKIE}=1; Path=/; Max-Age=604800; SameSite=Lax${getSecureFlag()}`
}

export function clearFrontendSessionCookie() {
    document.cookie = `${FRONTEND_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${getSecureFlag()}`
}

export { FRONTEND_SESSION_COOKIE }
