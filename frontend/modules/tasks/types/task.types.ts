import type { AuthUser } from '@/modules/auth/types/auth.types'

export type TaskStatus = 'PENDING' | 'PROCESSING' | 'DONE'

export type Task = {
    id: string
    title: string
    description: string
    status: TaskStatus
    assignedToId: string | null
    assignedTo?: Pick<AuthUser, 'id' | 'name' | 'email'> | null
    assignedById: string
    assignedBy?: Pick<AuthUser, 'id' | 'name' | 'email'> | null
    createdAt: string
    updatedAt: string
}

export type Pagination = {
    page: number
    limit: number
    total: number
    totalPages: number
}

export type TasksListRequest = {
    page: number
    limit: number
}

export type TasksListResponse = {
    success: true
    data: {
        items: Task[]
        pagination: Pagination
    }
}

export type CreateTaskRequest = {
    title: string
    description: string
    assignedToId?: string
}

export type AssignTaskRequest = {
    assignedToId: string
}

export type UpdateTaskStatusRequest = {
    status: TaskStatus
}

export type CreateTaskResponse = {
    success: true
    data: Task
}

export type UpdateTaskResponse = {
    success: true
    data: Task
}

export type UserListItem = {
    id: string
    name: string
    email: string
    role: 'USER'
}

export type UsersListResponse = {
    success: true
    data: {
        items: UserListItem[]
        pagination: Pagination
    }
}
