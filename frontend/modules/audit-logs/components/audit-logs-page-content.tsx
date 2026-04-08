'use client'

import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'
import { useAuditLogsUiStore } from '@/store/audit-logs'
import { useAuditLogs } from '../hooks/use-audit-logs'
import { AuditLogDetailsSheet } from './audit-log-details-sheet'
import { AuditLogRowSkeleton } from './ui/audit-log-row-skeleton'

export function AuditLogsPageContent() {
    const user = useAuthStore(state => state.user)
    const isAdmin = user?.role === 'ADMIN'

    const page = useAuditLogsUiStore(state => state.page)
    const limit = useAuditLogsUiStore(state => state.limit)
    const selectedLogId = useAuditLogsUiStore(state => state.selectedLogId)
    const isDetailsOpen = useAuditLogsUiStore(state => state.isDetailsOpen)
    const setPage = useAuditLogsUiStore(state => state.setPage)
    const closeDetails = useAuditLogsUiStore(state => state.closeDetails)
    const openDetails = useAuditLogsUiStore(state => state.openDetails)

    const logsQuery = useAuditLogs(page, limit, isAdmin)

    const logs = logsQuery.data?.items ?? []
    const pagination = logsQuery.data?.pagination

    const selectedLog = useMemo(
        () => logs.find(log => log.id === selectedLogId) ?? null,
        [logs, selectedLogId],
    )

    const canGoPrev = Boolean(pagination && pagination.page > 1)
    const canGoNext = Boolean(pagination && pagination.page < pagination.totalPages)

    if (!isAdmin) {
        return (
            <section className="rounded-xl border border-border bg-card p-6">
                <h1 className="text-xl font-semibold">Audit Logs</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Only admins can access audit logs.
                </p>
            </section>
        )
    }

    return (
        <section className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold">Audit Logs</h1>
                    <p className="text-sm text-muted-foreground">
                        Review system activity and inspect detailed change payloads.
                    </p>
                </div>
            </div>

            <div className="w-full min-w-0 overflow-hidden rounded-xl border border-border bg-card">
                <div className="w-full max-w-full overflow-x-auto md:overflow-x-visible">
                    <table className="min-w-[940px] text-left text-sm md:min-w-full">
                        <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3">Action</th>
                                <th className="px-4 py-3">Entity</th>
                                <th className="px-4 py-3">Actor</th>
                                <th className="px-4 py-3">Task</th>
                                <th className="px-4 py-3">Created</th>
                                <th className="px-4 py-3">Summary</th>
                                <th className="px-4 py-3">View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logsQuery.isLoading ? (
                                Array.from({ length: 6 }).map((_, i) => <AuditLogRowSkeleton key={i} />)
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                                        No audit logs found.
                                    </td>
                                </tr>
                            ) : (
                                logs.map(log => (
                                    <tr key={log.id} className="border-b border-border/70 align-top">
                                        <td className="px-4 py-4 font-medium">{log.action}</td>
                                        <td className="px-4 py-4 text-xs text-muted-foreground">
                                            <p className="font-medium text-foreground">{log.entity}</p>
                                        </td>
                                        <td className="px-4 py-4 text-xs text-muted-foreground">
                                            <p className="font-medium text-foreground">{log.actor?.name ?? '-'}</p>
                                            <p className="mt-1 break-all">{log.actor?.email ?? '-'}</p>
                                        </td>
                                        <td className="px-4 py-4 text-xs text-muted-foreground">
                                            <p className="font-medium text-foreground">{log.task?.title ?? '-'}</p>
                                        </td>
                                        <td className="px-4 py-4 text-xs text-muted-foreground">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-4 text-xs text-muted-foreground">
                                            <p className="max-w-xs truncate" title={log.summary ?? undefined}>
                                                {log.summary ?? '-'}
                                            </p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <Button   size="sm" onClick={() => openDetails(log.id)}>
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm">
                    <p className="text-muted-foreground">
                        Page {pagination?.page ?? page} of {pagination?.totalPages ?? 1}
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={!canGoPrev}>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={!canGoNext}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            <AuditLogDetailsSheet
                open={isDetailsOpen}
                onOpenChange={open => {
                    if (!open) closeDetails()
                }}
                log={selectedLog}
            />
        </section>
    )
}
