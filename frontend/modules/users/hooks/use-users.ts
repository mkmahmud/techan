import { useQuery } from '@tanstack/react-query'

import { getUsers } from '../services/users.api'

export function useUsers(page: number, limit: number, enabled = true) {
    return useQuery({
        queryKey: ['users', page, limit],
        queryFn: () => getUsers({ page, limit }),
        enabled,
    })
}
