'use client'

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
import { useCreateUser } from '../hooks/use-create-user'
import type { CreateUserRequest } from '../types/user.types'

type CreateUserModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateUserModal({ open, onOpenChange }: CreateUserModalProps) {
    const createUserMutation = useCreateUser()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateUserRequest>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    })

    const onSubmit = handleSubmit(async values => {
        await createUserMutation.mutateAsync(values)
        reset()
        onOpenChange(false)
    })

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full p-0 sm:max-w-lg">
                <SheetHeader className="border-b border-border">
                    <SheetTitle>Create User</SheetTitle>
                    <SheetDescription>Only admins can create users.</SheetDescription>
                </SheetHeader>

                <form onSubmit={onSubmit} className="space-y-4 p-4">
                    <div className="space-y-1">
                        <label htmlFor="name" className="text-sm font-medium">Name</label>
                        <Input
                            id="name"
                            placeholder="John Admin"
                            {...register('name', {
                                required: 'Name is required',
                                minLength: { value: 2, message: 'Name must be at least 2 characters' },
                            })}
                        />
                        {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="john.admin@example.com"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: 'Invalid email format',
                                },
                            })}
                        />
                        {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="password" className="text-sm font-medium">Password</label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                            })}
                        />
                        {errors.password ? <p className="text-xs text-destructive">{errors.password.message}</p> : null}
                        <p className="text-xs text-muted-foreground">
                            Must include uppercase, lowercase, number, and special character.
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createUserMutation.isPending}>
                            {createUserMutation.isPending ? 'Creating...' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    )
}
