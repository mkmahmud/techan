import { api } from '@/lib/api'

import type {
    CreateUserRequest,
    CreateUserResponse,
    ListUsersRequest,
    ListUsersResponse,
} from '../types/user.types'

export async function getUsers(params: ListUsersRequest) {
    const { data } = await api.get<ListUsersResponse>('/users', { params })
    return data.data
}

export async function createUser(payload: CreateUserRequest) {
    const { data } = await api.post<CreateUserResponse>('/users', payload)
    return data.data
}
