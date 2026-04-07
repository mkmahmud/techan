'use client'

import { Button } from '@/components/ui/button'
import { useLogout } from '@/modules/auth'

export default function DashboardPage() {
  const logoutMutation = useLogout()

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <Button
          type="button"
          variant="outline"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
        </Button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Only authenticated users can access this page.
      </p>
    </div>
  )
}
