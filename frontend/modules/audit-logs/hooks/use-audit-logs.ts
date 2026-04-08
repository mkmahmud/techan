import { useQuery } from '@tanstack/react-query'

import { getAuditLogs } from '../services/audit-logs.api'

export function useAuditLogs(page: number, limit: number, enabled = true) {
    return useQuery({
        queryKey: ['audit-logs', page, limit],
        queryFn: () => getAuditLogs({ page, limit }),
        enabled,
    })
}
