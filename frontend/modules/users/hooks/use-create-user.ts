import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createUser } from '../services/users.api'
import type { CreateUserRequest } from '../types/user.types'

type ApiError = {
    message?: string
    data?: {
        message?: string
    }
}

export function useCreateUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: CreateUserRequest) => createUser(payload),
        onSuccess: () => {
            toast.success('User created successfully')
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
        onError: (error: ApiError) => {
            toast.error('Failed to create user', {
                description: error?.data?.message ?? error?.message ?? 'Please try again',
            })
        },
    })
}
