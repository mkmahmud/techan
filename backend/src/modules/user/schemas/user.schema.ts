import { Role } from '@prisma/client'
import { z } from 'zod'

export const createUserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .max(80, 'Name is too long'),
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email('Invalid email format')
        .max(255, 'Email is too long'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(72, 'Password is too long')
        .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
        .regex(/[a-z]/, 'Password must include at least one lowercase letter')
        .regex(/[0-9]/, 'Password must include at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character'),
    role: z.nativeEnum(Role).optional().default(Role.USER),
})

export const listUsersSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
})

export type CreateUserDto = z.infer<typeof createUserSchema>
export type ListUsersQuery = z.infer<typeof listUsersSchema>
