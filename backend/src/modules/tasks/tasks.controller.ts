import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'

import type { JwtPayload } from '@/common/decorators/current-user.decorator'
import { CurrentUser, CurrentUserId } from '@/common/decorators/current-user.decorator'
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe'
import {
    assignTaskSchema,
    createTaskSchema,
    listTasksSchema,
    taskIdParamSchema,
    updateTaskStatusSchema,
    type AssignTaskDto,
    type CreateTaskDto,
    type ListTasksQuery,
    type TaskIdParam,
    type UpdateTaskStatusDto,
} from './schemas/task.schema'
import { TasksService } from './tasks.service'

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post()
    async createTask(
        @Body(new ZodValidationPipe(createTaskSchema)) body: CreateTaskDto,
        @CurrentUserId() actorId: string,
        @CurrentUser('role') currentUserRole: JwtPayload['role'],
    ) {
        return this.tasksService.createTask(body, actorId, currentUserRole)
    }

    @Patch(':taskId/assign')
    async assignTask(
        @Param(new ZodValidationPipe(taskIdParamSchema)) params: TaskIdParam,
        @Body(new ZodValidationPipe(assignTaskSchema)) body: AssignTaskDto,
        @CurrentUserId() actorId: string,
        @CurrentUser('role') currentUserRole: JwtPayload['role'],
    ) {
        return this.tasksService.assignTask(params.taskId, body, actorId, currentUserRole)
    }

    @Patch(':taskId/status')
    async updateTaskStatus(
        @Param(new ZodValidationPipe(taskIdParamSchema)) params: TaskIdParam,
        @Body(new ZodValidationPipe(updateTaskStatusSchema)) body: UpdateTaskStatusDto,
        @CurrentUserId() actorId: string,
        @CurrentUser('role') currentUserRole: JwtPayload['role'],
    ) {
        return this.tasksService.updateTaskStatus(params.taskId, body, actorId, currentUserRole)
    }

    @Get()
    async listTasks(
        @Query(new ZodValidationPipe(listTasksSchema)) query: ListTasksQuery,
        @CurrentUserId() actorId: string,
        @CurrentUser('role') currentUserRole: JwtPayload['role'],
    ) {
        return this.tasksService.listTasks(query, actorId, currentUserRole)
    }

    @Get(':taskId')
    async getTaskById(
        @Param(new ZodValidationPipe(taskIdParamSchema)) params: TaskIdParam,
        @CurrentUserId() actorId: string,
        @CurrentUser('role') currentUserRole: JwtPayload['role'],
    ) {
        return this.tasksService.getTaskById(params.taskId, actorId, currentUserRole)
    }
}
