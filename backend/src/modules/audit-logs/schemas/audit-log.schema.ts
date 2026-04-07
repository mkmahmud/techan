import { AuditAction } from '@prisma/client'
import { z } from 'zod'

export const createAuditLogSchema = z.object({
    action: z.nativeEnum(AuditAction),
    entity: z
        .string()
        .trim()
        .min(1, 'Entity is required')
        .max(50, 'Entity is too long')
        .transform(value => value.toUpperCase()),
    entityId: z
        .string()
        .trim()
        .min(1, 'Entity ID is required')
        .max(100, 'Entity ID is too long'),
    taskId: z.string().trim().uuid('taskId must be a valid UUID').optional(),
    summary: z.string().trim().max(500, 'Summary is too long').optional(),
    before: z.unknown().optional(),
    after: z.unknown().optional(),
})

export const listAuditLogsSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    action: z.nativeEnum(AuditAction).optional(),
    entity: z.string().trim().min(1).max(50).optional(),
    entityId: z.string().trim().min(1).max(100).optional(),
    actorId: z.string().trim().uuid('actorId must be a valid UUID').optional(),
    taskId: z.string().trim().uuid('taskId must be a valid UUID').optional(),
})

export type CreateAuditLogDto = z.infer<typeof createAuditLogSchema>
export type ListAuditLogsQuery = z.infer<typeof listAuditLogsSchema>
