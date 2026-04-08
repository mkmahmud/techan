import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common'
import { Prisma, Role } from '@prisma/client'

import { PrismaService } from '@/prisma/prisma.service'
import type {
    CreateAuditLogDto,
    ListAuditLogsQuery,
} from './schemas/audit-log.schema'

@Injectable()
export class AuditLogsService {
    constructor(private readonly prisma: PrismaService) { }

    async createLog(input: CreateAuditLogDto, actorId: string) {
        try {
            return await this.prisma.auditLog.create({
                data: {
                    actorId,
                    action: input.action,
                    entity: input.entity,
                    entityId: input.entityId,
                    taskId: input.taskId,
                    summary: input.summary,
                    before: input.before as Prisma.InputJsonValue | undefined,
                    after: input.after as Prisma.InputJsonValue | undefined,
                },
                select: {
                    id: true,
                    actorId: true,
                    action: true,
                    entity: true,
                    entityId: true,
                    taskId: true,
                    summary: true,
                    before: true,
                    after: true,
                    createdAt: true,
                },
            })
        } catch {
            throw new InternalServerErrorException({
                code: 'AUDIT_LOG_CREATE_FAILED',
                message: 'Failed to create audit log',
            })
        }
    }

    async listLogs(requesterRole: string, query: ListAuditLogsQuery) {
        this.ensureAdmin(requesterRole)

        const where: Prisma.AuditLogWhereInput = {
            action: query.action,
            entity: query.entity,
            entityId: query.entityId,
            actorId: query.actorId,
            taskId: query.taskId,
        }

        const skip = (query.page - 1) * query.limit

        const [items, total] = await this.prisma.$transaction([
            this.prisma.auditLog.findMany({
                where,
                skip,
                take: query.limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    actorId: true,
                    actor: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                        },
                    },
                    action: true,
                    entity: true,
                    entityId: true,
                    taskId: true,
                    task: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                    summary: true,
                    before: true,
                    after: true,
                    createdAt: true,
                },
            }),
            this.prisma.auditLog.count({ where }),
        ])

        return {
            items,
            pagination: {
                page: query.page,
                limit: query.limit,
                total,
                totalPages: Math.ceil(total / query.limit),
            },
        }
    }

    async listByEntity(requesterRole: string, entity: string, entityId: string) {
        this.ensureAdmin(requesterRole)

        return this.prisma.auditLog.findMany({
            where: {
                entity: entity.toUpperCase(),
                entityId,
            },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                actorId: true,
                actor: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                action: true,
                entity: true,
                entityId: true,
                taskId: true,
                task: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                summary: true,
                before: true,
                after: true,
                createdAt: true,
            },
        })
    }

    private ensureAdmin(requesterRole: string) {
        if (requesterRole.toUpperCase() !== Role.ADMIN) {
            throw new ForbiddenException({
                code: 'FORBIDDEN',
                message: 'Only admins can access audit logs',
            })
        }
    }
}
