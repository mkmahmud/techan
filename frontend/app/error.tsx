'use client'

import { useEffect } from 'react'

type ErrorProps = {
    error: Error & { digest?: string }
    reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex w-full flex-1 items-center justify-center">
            <div className="max-w-md rounded-xl border border-border bg-card p-6 text-center">
                <h2 className="text-xl font-semibold">Something went wrong</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Please try again. If the issue continues, contact support.
                </p>
                <button
                    type="button"
                    onClick={reset}
                    className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                    Try again
                </button>
            </div>
        </div>
    )
}
