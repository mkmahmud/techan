export type Pagination = {
    page: number
    limit: number
    total: number
    totalPages: number
}

export type UserRole = 'USER'

export type UserListItem = {
    id: string
    name: string
    email: string
    role: UserRole
    createdAt: string
    updatedAt: string
}

export type ListUsersRequest = {
    page: number
    limit: number
}

export type ListUsersResponse = {
    success: true
    data: {
        items: UserListItem[]
        pagination: Pagination
    }
}

export type CreateUserRequest = {
    name: string
    email: string
    password: string
}

export type CreateUserResponse = {
    success: true
    data: UserListItem
}
