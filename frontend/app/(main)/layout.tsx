'use client'

import { Header } from '@/components/dashboard/header'
import { Sidebar } from '@/components/dashboard/sidebar'
import { useAuthStore } from '@/store/auth.store'
import type { PropsWithChildren } from 'react'

export default function MainLayout({ children }: PropsWithChildren) {
    const user = useAuthStore(state => state.user)
    const role = user?.role ?? 'USER'

    return (
        <div className="relative flex min-h-screen overflow-x-hidden bg-background">
            <aside className="fixed inset-y-0 hidden w-48 border-r border-border bg-card md:flex">
                <Sidebar role={role} />
            </aside>

            <div className="flex min-w-0 flex-1 flex-col md:pl-48">
                <Header role={role} userName={user?.name} />
                <main className="min-w-0 flex-1 bg-muted/20 p-6 md:p-8">
                    <div className="mx-auto min-w-0 w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}