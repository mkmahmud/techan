'use client'

export default function GlobalError() {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
          <div className="max-w-md rounded-xl border border-border bg-card p-6 text-center">
            <h2 className="text-xl font-semibold">Application error</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A critical error occurred while rendering the application.
            </p>
          </div>
        </main>
      </body>
    </html>
  )
}
