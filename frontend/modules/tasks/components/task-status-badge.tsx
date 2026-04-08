import type { TaskStatus } from '../types/task.types'

const statusClasses: Record<TaskStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
  DONE: 'bg-emerald-100 text-emerald-800 border-emerald-200',
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses[status]}`}>
      {status}
    </span>
  )
}
