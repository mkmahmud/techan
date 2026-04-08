import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createTask } from '../services/tasks.api'
import type { CreateTaskRequest } from '../types/task.types'

type ApiError = {
    message?: string
    data?: {
        message?: string
    }
}

export function useCreateTask() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: CreateTaskRequest) => createTask(payload),
        onSuccess: () => {
            toast.success('Task created successfully')
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
        onError: (error: ApiError) => {
            toast.error('Failed to create task', {
                description: error?.data?.message ?? error?.message ?? 'Please try again',
            })
        },
    })
}
