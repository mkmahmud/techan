'use client'

import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { useLogin } from '../hooks/use-login'
import type { LoginRequest } from '../types/auth.types'
import { Input } from '@/components/ui/input'
import { Loader } from 'lucide-react'

type LoginFormProps = {
    onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginRequest>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onSubmit',
    })

    const loginMutation = useLogin()

    // Handle Submit
    const onSubmit = handleSubmit(async values => {
        await loginMutation.mutateAsync(values)
        onSuccess?.()
    })

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium">
                    Email
                </label>
                <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder='Enter Your Email'
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: 'Enter a valid email',
                        },
                    })}
                />
                {errors.email ? (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                ) : null}
            </div>

            <div className="space-y-1">
                <label htmlFor="password" className="text-sm font-medium">
                    Password
                </label>
                <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder='Enter Password'
                    {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters',
                        },
                    })}
                />
                {errors.password ? (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                ) : null}
            </div>

            <Button type="submit" className="h-10 w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? (
                    <span className="inline-flex items-center">
                        Signing in
                        <Loader className="ml-2 h-4 w-4 animate-spin" />
                    </span>
                ) : (
                    'Sign in'
                )}
            </Button>
        </form>
    )
}
