import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { updateTaskStatus } from '../services/tasks.api'
import type { TaskStatus } from '../types/task.types'

type ApiError = {
    message?: string
    data?: {
        message?: string
    }
}

export function useUpdateTaskStatus() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
            updateTaskStatus(taskId, { status }),
        onSuccess: () => {
            toast.success('Task status updated')
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
        onError: (error: ApiError) => {
            toast.error('Failed to update status', {
                description: error?.data?.message ?? error?.message ?? 'Please try again',
            })
        },
    })
}
