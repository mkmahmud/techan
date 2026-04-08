export type Pagination = {
    page: number
    limit: number
    total: number
    totalPages: number
}

export type AuditAction =
    | 'CREATE_TASK'
    | 'UPDATE_TASK'
    | 'DELETE_TASK'
    | 'ASSIGN_TASK'
    | 'CHANGE_STATUS'

export type AuditLogItem = {
    id: string
    actorId: string
    actor: {
        id: string
        email: string
        name: string
    }
    action: AuditAction
    entity: string
    entityId: string
    taskId: string | null
    task: {
        id: string
        title: string
    } | null
    summary: string | null
    before: unknown | null
    after: unknown | null
    createdAt: string
}

export type ListAuditLogsRequest = {
    page: number
    limit: number
    action?: AuditAction
    entity?: string
    entityId?: string
    actorId?: string
    taskId?: string
}

export type ListAuditLogsResponse = {
    success: true
    data: {
        items: AuditLogItem[]
        pagination: Pagination
    }
}

export type ListAuditLogsByEntityResponse = {
    success: true
    data: AuditLogItem[]
}
