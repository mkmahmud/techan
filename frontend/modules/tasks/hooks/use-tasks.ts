import { useQuery } from '@tanstack/react-query'

import { getTasks } from '../services/tasks.api'

export function useTasks(page: number, limit: number) {
    return useQuery({
        queryKey: ['tasks', page, limit],
        queryFn: () => getTasks({ page, limit }),
    })
}
