import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { AuditAction, Role, TaskStatus } from '@prisma/client'

import { AuditLogsService } from '@/modules/audit-logs/audit-logs.service'
import { PrismaService } from '@/prisma/prisma.service'
import type {
    AssignTaskDto,
    CreateTaskDto,
    ListTasksQuery,
    UpdateTaskStatusDto,
} from './schemas/task.schema'

@Injectable()
export class TasksService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly auditLogsService: AuditLogsService,
    ) { }

    async createTask(input: CreateTaskDto, actorId: string, requesterRole: string) {
        this.ensureAdmin(requesterRole, 'Only admins can create tasks')

        if (input.assignedToId) {
            await this.ensureUserExists(input.assignedToId)
        }

        const createdTask = await this.prisma.task.create({
            data: {
                title: input.title,
                description: input.description,
                assignedToId: input.assignedToId,
                assignedById: actorId,
                status: TaskStatus.PENDING,
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                assignedToId: true,
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                assignedById: true,
                assignedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },

                createdAt: true,
                updatedAt: true,
            },
        })

        await this.auditLogsService.createLog(
            {
                action: AuditAction.CREATE_TASK,
                entity: 'TASK',
                entityId: createdTask.id,
                taskId: createdTask.id,
                summary: `Task created: ${createdTask.title}`,
                after: createdTask,
            },
            actorId,
        )

        return createdTask
    }

    async assignTask(
        taskId: string,
        input: AssignTaskDto,
        actorId: string,
        requesterRole: string,
    ) {
        this.ensureAdmin(requesterRole, 'Only admins can assign tasks')

        const existingTask = await this.prisma.task.findUnique({
            where: { id: taskId },
            select: {
                id: true,
                title: true,
                assignedToId: true,
                assignedById: true,
                status: true,
            },
        })

        if (!existingTask) {
            throw new NotFoundException({
                code: 'TASK_NOT_FOUND',
                message: 'Task not found',
            })
        }

        await this.ensureUserExists(input.assignedToId)

        const updatedTask = await this.prisma.task.update({
            where: { id: taskId },
            data: {
                assignedToId: input.assignedToId,
                assignedById: actorId,
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                assignedToId: true,
                assignedById: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        await this.auditLogsService.createLog(
            {
                action: AuditAction.ASSIGN_TASK,
                entity: 'TASK',
                entityId: taskId,
                taskId,
                summary: 'Task assigned to user',
                before: existingTask,
                after: updatedTask,
            },
            actorId,
        )

        return updatedTask
    }

    async updateTaskStatus(
        taskId: string,
        input: UpdateTaskStatusDto,
        actorId: string,
        requesterRole: string,
    ) {
        const existingTask = await this.prisma.task.findUnique({
            where: { id: taskId },
            select: {
                id: true,
                title: true,
                status: true,
                assignedToId: true,
                assignedById: true,
            },
        })

        if (!existingTask) {
            throw new NotFoundException({
                code: 'TASK_NOT_FOUND',
                message: 'Task not found',
            })
        }

        const isAdmin = requesterRole.toUpperCase() === Role.ADMIN
        const isAssignedUser = existingTask.assignedToId === actorId

        if (!isAdmin && !isAssignedUser) {
            throw new ForbiddenException({
                code: 'FORBIDDEN',
                message: 'You can only update status of your assigned tasks',
            })
        }

        const updatedTask = await this.prisma.task.update({
            where: { id: taskId },
            data: { status: input.status },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                assignedToId: true,
                assignedById: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        await this.auditLogsService.createLog(
            {
                action: AuditAction.CHANGE_STATUS,
                entity: 'TASK',
                entityId: taskId,
                taskId,
                summary: `Task status changed to ${input.status}`,
                before: { status: existingTask.status },
                after: { status: updatedTask.status },
            },
            actorId,
        )

        return updatedTask
    }

    async listTasks(query: ListTasksQuery, actorId: string, requesterRole: string) {
        const isAdmin = requesterRole.toUpperCase() === Role.ADMIN
        const skip = (query.page - 1) * query.limit

        const where = isAdmin
            ? {
                status: query.status,
                assignedById: actorId,
            }
            : {
                status: query.status,
                assignedToId: actorId,
            }

        const [items, total] = await this.prisma.$transaction([
            this.prisma.task.findMany({
                where,
                skip,
                take: query.limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                    assignedToId: true,
                    assignedTo: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    assignedById: true,
                    assignedBy: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            this.prisma.task.count({ where }),
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

    async getTaskById(taskId: string, actorId: string, requesterRole: string) {
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                assignedToId: true,
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                assignedById: true,
                assignedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                createdAt: true,
                updatedAt: true,
            },
        })

        if (!task) {
            throw new NotFoundException({
                code: 'TASK_NOT_FOUND',
                message: 'Task not found',
            })
        }

        const isAdmin = requesterRole.toUpperCase() === Role.ADMIN
        const canAccess = isAdmin
            ? task.assignedById === actorId
            : task.assignedToId === actorId

        if (!canAccess) {
            throw new ForbiddenException({
                code: 'FORBIDDEN',
                message: 'You can only access your own tasks',
            })
        }

        return task
    }

    private ensureAdmin(requesterRole: string, message: string) {
        if (requesterRole.toUpperCase() !== Role.ADMIN) {
            throw new ForbiddenException({
                code: 'FORBIDDEN',
                message,
            })
        }
    }

    private async ensureUserExists(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true },
        })

        if (!user) {
            throw new NotFoundException({
                code: 'USER_NOT_FOUND',
                message: 'Assigned user not found',
            })
        }
    }
}
