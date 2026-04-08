import { api } from '@/lib/api'

import type {
    ListAuditLogsByEntityResponse,
    ListAuditLogsRequest,
    ListAuditLogsResponse,
} from '../types/audit-log.types'

export async function getAuditLogs(params: ListAuditLogsRequest) {
    const { data } = await api.get<ListAuditLogsResponse>('/audit-logs', { params })
    return data.data
}

export async function getAuditLogsByEntity(entity: string, entityId: string) {
    const { data } = await api.get<ListAuditLogsByEntityResponse>(
        `/audit-logs/entity/${encodeURIComponent(entity)}/${encodeURIComponent(entityId)}`,
    )
    return data.data
}
