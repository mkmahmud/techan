'use client'

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import type { AuditLogItem } from '../types/audit-log.types'

type AuditLogDetailsSheetProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    log: AuditLogItem | null
}

function JsonValueView({ value }: { value: unknown }) {
    if (value === null || value === undefined) {
        return <span className="text-muted-foreground">null</span>
    }

    if (typeof value === 'string') {
        return <span className="break-all text-foreground">{value}</span>
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
        return <span className="text-foreground">{String(value)}</span>
    }

    if (Array.isArray(value)) {
        if (value.length === 0) {
            return <span className="text-muted-foreground">[]</span>
        }

        return (
            <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2">
                {value.map((item, index) => (
                    <div key={index} className="rounded border border-border/60 bg-background p-2">
                        <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">Item {index + 1}</p>
                        <JsonValueView value={item} />
                    </div>
                ))}
            </div>
        )
    }

    if (typeof value === 'object') {
        const entries = Object.entries(value as Record<string, unknown>)

        if (entries.length === 0) {
            return <span className="text-muted-foreground">{'{}'}</span>
        }

        return (
            <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-2">
                {entries.map(([key, nestedValue]) => (
                    <div key={key} className="rounded border border-border/60 bg-background p-2">
                        <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">{key}</p>
                        <JsonValueView value={nestedValue} />
                    </div>
                ))}
            </div>
        )
    }

    return <span className="text-muted-foreground">Unsupported value</span>
}

export function AuditLogDetailsSheet({ open, onOpenChange, log }: AuditLogDetailsSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full p-0 sm:max-w-2xl">
                <SheetHeader className="border-b border-border">
                    <SheetTitle>Audit Log Details</SheetTitle>
                    <SheetDescription>{log ? 'Detailed activity payload' : 'No log selected'}</SheetDescription>
                </SheetHeader>

                <div className="space-y-4 overflow-y-auto p-4 text-sm">
                    {log ? (
                        <>
                            <div className="grid grid-cols-1 gap-3 rounded-lg border border-border p-3 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs uppercase text-muted-foreground">Action</p>
                                    <p className="font-medium">{log.action}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase text-muted-foreground">Entity</p>
                                    <p className="font-medium">{log.entity}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase text-muted-foreground">Actor</p>
                                    <p className="font-medium">{log.actor?.name ?? '-'}</p>
                                    <p className="text-xs text-muted-foreground">{log.actor?.email ?? '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase text-muted-foreground">Task</p>
                                    <p className="font-medium">{log.task?.title ?? '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase text-muted-foreground">Summary</p>
                                    <p className="font-medium">{log.summary ?? '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase text-muted-foreground">Created At</p>
                                    <p className="font-medium">{new Date(log.createdAt).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="rounded-lg border border-border p-3">
                                <p className="text-xs uppercase text-muted-foreground">Before</p>
                                <div className="mt-2 max-h-72 overflow-auto text-xs">
                                    <JsonValueView value={log.before} />
                                </div>
                            </div>

                            <div className="rounded-lg border border-border p-3">
                                <p className="text-xs uppercase text-muted-foreground">After</p>
                                <div className="mt-2 max-h-72 overflow-auto text-xs">
                                    <JsonValueView value={log.after} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-muted-foreground">Select a log record to view details.</p>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
