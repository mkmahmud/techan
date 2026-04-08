export type Role = 'ADMIN' | 'USER'

export type AuthUser = {
    id: string
    name: string
    email: string
    role: Role
}

export type LoginRequest = {
    email: string
    password: string
}

export type LoginResponse = {
    success: boolean
    data: {
        user: AuthUser
        session: {
            authenticated: boolean
        }
    }
}

export type LogoutResponse = {
    success: boolean
    data: {
        session: {
            authenticated: false
        }
    }
}
