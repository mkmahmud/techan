'use client'

import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'
import { useTasksUiStore } from '@/store/tasks'
import { CreateTaskModal } from './create-task-modal'
import { TaskStatusBadge } from './task-status-badge'
import { useAssignableUsers } from '../hooks/use-assignable-users'
import { useAssignTask } from '../hooks/use-assign-task'
import { useTasks } from '../hooks/use-tasks'
import { useUpdateTaskStatus } from '../hooks/use-update-task-status'
import type { TaskStatus } from '../types/task.types'
import { TaskRowSkeleton } from './ui/taskRowSkeleton'

const statuses: TaskStatus[] = ['PENDING', 'PROCESSING', 'DONE']

export function TasksPageContent() {
    const user = useAuthStore(state => state.user)
    const role = user?.role ?? 'USER'
    const isAdmin = role === 'ADMIN'

    const page = useTasksUiStore(state => state.page)
    const limit = useTasksUiStore(state => state.limit)
    const setPage = useTasksUiStore(state => state.setPage)
    const isCreateModalOpen = useTasksUiStore(state => state.isCreateModalOpen)
    const openCreateModal = useTasksUiStore(state => state.openCreateModal)
    const closeCreateModal = useTasksUiStore(state => state.closeCreateModal)

    const [assignSelection, setAssignSelection] = useState<Record<string, string>>({})

    const tasksQuery = useTasks(page, limit)
    const usersQuery = useAssignableUsers(isAdmin)
    const assignTaskMutation = useAssignTask()
    const updateStatusMutation = useUpdateTaskStatus()

    const tasks = tasksQuery.data?.items ?? []
    const pagination = tasksQuery.data?.pagination
    const assignableUsers = useMemo(() => usersQuery.data ?? [], [usersQuery.data])

    const handleAssign = async (taskId: string) => {
        const assignedToId = assignSelection[taskId]
        if (!assignedToId) return
        await assignTaskMutation.mutateAsync({ taskId, assignedToId })
    }

    const canGoPrev = Boolean(pagination && pagination.page > 1)
    const canGoNext = Boolean(pagination && pagination.page < pagination.totalPages)

    return (
        <section className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold">Tasks</h1>
                    <p className="text-sm text-muted-foreground">
                        {isAdmin
                            ? 'Create, assign and monitor all tasks.'
                            : 'View your tasks and update status.'}
                    </p>
                </div>

                {isAdmin ? (
                    <Button onClick={openCreateModal}>Create Task</Button>
                ) : null}
            </div>

            <CreateTaskModal
                open={isCreateModalOpen}
                onOpenChange={open => (open ? openCreateModal() : closeCreateModal())}
                users={assignableUsers}
            />

            <div className="w-full min-w-0 overflow-hidden rounded-xl border border-border bg-card">
                <div className="w-full max-w-full overflow-x-auto md:overflow-x-visible">
                    <table className="min-w-[860px] text-left text-sm md:min-w-full">
                        <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Assigned To</th>
                                <th className="px-4 py-3">Created</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasksQuery.isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TaskRowSkeleton key={i} />
                                ))
                            ) : tasks.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                                        No tasks found.
                                    </td>
                                </tr>
                            ) : (
                                tasks.map(task => (
                                    <tr key={task.id} className="border-b border-border/70 align-top">
                                        <td className="px-4 py-4">
                                            <p className="font-medium">{task.title}</p>
                                            <p className="mt-1 max-w-md text-xs text-muted-foreground">{task.description}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <TaskStatusBadge status={task.status} />
                                        </td>
                                        <td className="px-4 py-4 text-xs text-muted-foreground">
                                            {task.assignedTo?.name ? `${task.assignedTo.name} (${task.assignedTo.email})` : 'Unassigned'}
                                        </td>
                                        <td className="px-4 py-4 text-xs text-muted-foreground">
                                            {new Date(task.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex min-w-[220px] flex-col gap-2">
                                                <select
                                                    className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                                                    value={task.status}
                                                    onChange={event =>
                                                        updateStatusMutation.mutate({
                                                            taskId: task.id,
                                                            status: event.target.value as TaskStatus,
                                                        })
                                                    }
                                                    disabled={updateStatusMutation.isPending}
                                                >
                                                    {statuses.map(status => (
                                                        <option key={status} value={status}>
                                                            {status}
                                                        </option>
                                                    ))}
                                                </select>
                                                {/* Admin Assignment to user */}
                                                {isAdmin ? (
                                                    <div className="flex gap-2">
                                                        <select
                                                            className="h-9 flex-1 rounded-md border border-input bg-background px-2 text-xs"
                                                            value={assignSelection[task.id] ?? task.assignedToId ?? ''}
                                                            onChange={event =>
                                                                setAssignSelection(prev => ({
                                                                    ...prev,
                                                                    [task.id]: event.target.value,
                                                                }))
                                                            }
                                                        >
                                                            <option value="">Select user</option>
                                                            {assignableUsers.map(listUser => (
                                                                <option key={listUser.id} value={listUser.id}>
                                                                    {listUser.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <Button
                                                            onClick={() => handleAssign(task.id)}
                                                            disabled={assignTaskMutation.isPending}
                                                        >
                                                            Assign
                                                        </Button>
                                                    </div>
                                                ) : null}
                                            </div>
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
        </section>
    )
}
