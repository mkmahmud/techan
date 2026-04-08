'use client'

import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { useCreateTask } from '../hooks/use-create-task'
import type { CreateTaskRequest, UserListItem } from '../types/task.types'

type CreateTaskModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    users: UserListItem[]
}

export function CreateTaskModal({ open, onOpenChange, users }: CreateTaskModalProps) {
    const createTaskMutation = useCreateTask()
    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateTaskRequest>({
        defaultValues: {
            title: '',
            description: '',
            assignedToId: '',
        },
    })

    const assignedUsers = useMemo(() => users ?? [], [users])

    const onSubmit = handleSubmit(async values => {
        const payload: CreateTaskRequest = {
            title: values.title,
            description: values.description,
            ...(values.assignedToId ? { assignedToId: values.assignedToId } : {}),
        }

        await createTaskMutation.mutateAsync(payload)
        reset()
        onOpenChange(false)
    })

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full p-0 sm:max-w-lg">
                <SheetHeader className="border-b border-border">
                    <SheetTitle>Create Task</SheetTitle>

                </SheetHeader>

                <form onSubmit={onSubmit} className="space-y-4 p-4">
                    <div className="space-y-1">
                        <label htmlFor="title" className="text-sm font-medium">Title</label>
                        <Input
                            id="title"
                            placeholder="John Admin"
                            {...register('title', { required: 'Title is required' })}
                        />
                        {errors.title ? <p className="text-xs text-destructive">{errors.title.message}</p> : null}
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="description" className="text-sm font-medium">Description</label>
                        <textarea
                            id="description"
                            placeholder="This is the description"
                            className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-ring"
                            {...register('description', { required: 'Description is required' })}
                        />
                        {errors.description ? <p className="text-xs text-destructive">{errors.description.message}</p> : null}
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="assignedToId" className="text-sm font-medium">Assign To </label>
                        <select
                            id="assignedToId"
                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-ring"
                            {...register('assignedToId')}
                        >
                            <option value="">Select User</option>
                            {assignedUsers.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createTaskMutation.isPending}>
                            {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    )
}
