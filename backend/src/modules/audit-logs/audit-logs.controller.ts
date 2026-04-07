import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'

import type { JwtPayload } from '@/common/decorators/current-user.decorator'
import { CurrentUser, CurrentUserId } from '@/common/decorators/current-user.decorator'
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe'
import { AuditLogsService } from './audit-logs.service'
import {
    createAuditLogSchema,
    listAuditLogsSchema,
    type CreateAuditLogDto,
    type ListAuditLogsQuery,
} from './schemas/audit-log.schema'

@Controller('audit-logs')
export class AuditLogsController {
    constructor(private readonly auditLogsService: AuditLogsService) { }

    @Post()
    async createLog(
        @Body(new ZodValidationPipe(createAuditLogSchema)) body: CreateAuditLogDto,
        @CurrentUserId() actorId: string,
    ) {
        return this.auditLogsService.createLog(body, actorId)
    }

    @Get()
    async listLogs(
        @Query(new ZodValidationPipe(listAuditLogsSchema)) query: ListAuditLogsQuery,
        @CurrentUser('role') currentUserRole: JwtPayload['role'],
    ) {
        return this.auditLogsService.listLogs(currentUserRole, query)
    }

    @Get('entity/:entity/:entityId')
    async listByEntity(
        @Param('entity') entity: string,
        @Param('entityId') entityId: string,
        @CurrentUser('role') currentUserRole: JwtPayload['role'],
    ) {
        return this.auditLogsService.listByEntity(currentUserRole, entity, entityId)
    }
}
