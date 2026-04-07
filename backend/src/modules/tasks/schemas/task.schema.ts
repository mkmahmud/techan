import { TaskStatus } from '@prisma/client'
import { z } from 'zod'

export const createTaskSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, 'Title must be at least 3 characters')
        .max(150, 'Title is too long'),
    description: z
        .string()
        .trim()
        .min(3, 'Description must be at least 3 characters')
        .max(2000, 'Description is too long'),
    assignedToId: z.string().trim().uuid('assignedToId must be a valid UUID').optional(),
})

export const assignTaskSchema = z.object({
    assignedToId: z.string().trim().uuid('assignedToId must be a valid UUID'),
})

export const updateTaskStatusSchema = z.object({
    status: z.nativeEnum(TaskStatus),
})

export const listTasksSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: z.nativeEnum(TaskStatus).optional(),
    assignedToId: z.string().trim().uuid('assignedToId must be a valid UUID').optional(),
    assignedById: z.string().trim().uuid('assignedById must be a valid UUID').optional(),
})

export const taskIdParamSchema = z.object({
    taskId: z.string().trim().uuid('taskId must be a valid UUID'),
})

export type CreateTaskDto = z.infer<typeof createTaskSchema>
export type AssignTaskDto = z.infer<typeof assignTaskSchema>
export type UpdateTaskStatusDto = z.infer<typeof updateTaskStatusSchema>
export type ListTasksQuery = z.infer<typeof listTasksSchema>
export type TaskIdParam = z.infer<typeof taskIdParamSchema>
