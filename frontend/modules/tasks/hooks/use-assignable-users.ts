import { useQuery } from '@tanstack/react-query'

import { getAssignableUsers } from '../services/tasks.api'

export function useAssignableUsers(enabled: boolean) {
    return useQuery({
        queryKey: ['assignable-users'],
        queryFn: getAssignableUsers,
        enabled,
    })
}
