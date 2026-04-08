import { api } from '@/lib/api'

import type {
    AssignTaskRequest,
    CreateTaskRequest,
    CreateTaskResponse,
    TasksListRequest,
    TasksListResponse,
    UpdateTaskResponse,
    UpdateTaskStatusRequest,
    UsersListResponse,
} from '../types/task.types'

export async function getTasks(params: TasksListRequest) {
    const { data } = await api.get<TasksListResponse>('/tasks', { params })
    return data.data
}

export async function createTask(payload: CreateTaskRequest) {
    const { data } = await api.post<CreateTaskResponse>('/tasks', payload)
    return data.data
}

export async function assignTask(taskId: string, payload: AssignTaskRequest) {
    const { data } = await api.patch<UpdateTaskResponse>(`/tasks/${taskId}/assign`, payload)
    return data.data
}

export async function updateTaskStatus(taskId: string, payload: UpdateTaskStatusRequest) {
    const { data } = await api.patch<UpdateTaskResponse>(`/tasks/${taskId}/status`, payload)
    return data.data
}

export async function getAssignableUsers() {
    const { data } = await api.get<UsersListResponse>('/users')
    return data.data
}
