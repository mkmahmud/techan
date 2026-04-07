'use client'

import { useRouter } from 'next/navigation'

import { LoginForm } from '@/modules/auth'

export default function LoginPage() {
    const router = useRouter()

    return (
        <section className="rounded-lg max-w-sm border border-border bg-card p-6  ">
            <h1 className="mt-2 text-2xl font-bold text-center">Sign in</h1>
            <p className="mt-2 text-sm text-muted-foreground text-center">
                Use your account credentials to continue.
            </p>

            <div className="mt-5">
                <LoginForm onSuccess={() => router.push('/dashboard')} />
            </div>
        </section>
    )
}
