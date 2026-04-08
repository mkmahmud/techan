'use client'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'
import { useUsersUiStore } from '@/store/users'
import { useUsers } from '../hooks/use-users'
import { CreateUserModal } from './create-user-modal'
import { UserRowSkeleton } from './ui/user-row-skeleton'

export function UsersPageContent() {
    const user = useAuthStore(state => state.user)
    const isAdmin = user?.role === 'ADMIN'

    const page = useUsersUiStore(state => state.page)
    const limit = useUsersUiStore(state => state.limit)
    const setPage = useUsersUiStore(state => state.setPage)
    const isCreateModalOpen = useUsersUiStore(state => state.isCreateModalOpen)
    const openCreateModal = useUsersUiStore(state => state.openCreateModal)
    const closeCreateModal = useUsersUiStore(state => state.closeCreateModal)

    const usersQuery = useUsers(page, limit, isAdmin)

    const users = usersQuery.data?.items ?? []
    const pagination = usersQuery.data?.pagination

    const canGoPrev = Boolean(pagination && pagination.page > 1)
    const canGoNext = Boolean(pagination && pagination.page < pagination.totalPages)

    if (!isAdmin) {
        return (
            <section className="rounded-xl border border-border bg-card p-6">
                <h1 className="text-xl font-semibold">Manage Users</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Only admins can view and create users.
                </p>
            </section>
        )
    }

    return (
        <section className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold">Manage Users</h1>
                    <p className="text-sm text-muted-foreground">
                        Create users and review all registered user accounts.
                    </p>
                </div>

                <Button onClick={openCreateModal}>Create User</Button>
            </div>

            <CreateUserModal
                open={isCreateModalOpen}
                onOpenChange={open => (open ? openCreateModal() : closeCreateModal())}
            />

            <div className="w-full min-w-0 overflow-hidden rounded-xl border border-border bg-card">
                <div className="w-full max-w-full overflow-x-auto md:overflow-x-visible">
                    <table className="min-w-[760px] text-left text-sm md:min-w-full">
                        <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersQuery.isLoading ? (
                                Array.from({ length: 6 }).map((_, i) => <UserRowSkeleton key={i} />)
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map(item => (
                                    <tr key={item.id} className="border-b border-border/70 align-top">
                                        <td className="px-4 py-4 font-medium">{item.name}</td>
                                        <td className="px-4 py-4 text-xs text-muted-foreground">{item.email}</td>
                                        <td className="px-4 py-4 text-xs text-muted-foreground">{item.role}</td>
                                        <td className="px-4 py-4 text-xs text-muted-foreground">
                                            {new Date(item.createdAt).toLocaleString()}
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
