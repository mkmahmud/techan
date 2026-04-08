import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { assignTask } from '../services/tasks.api'

type ApiError = {
    message?: string
    data?: {
        message?: string
    }
}

export function useAssignTask() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ taskId, assignedToId }: { taskId: string; assignedToId: string }) =>
            assignTask(taskId, { assignedToId }),
        onSuccess: () => {
            toast.success('Task assigned successfully')
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
        onError: (error: ApiError) => {
            toast.error('Failed to assign task', {
                description: error?.data?.message ?? error?.message ?? 'Please try again',
            })
        },
    })
}
