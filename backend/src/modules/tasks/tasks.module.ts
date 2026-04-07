import { Module } from '@nestjs/common'

import { AuditLogsModule } from '@/modules/audit-logs/audit-logs.module'
import { PrismaModule } from '@/prisma/prisma.module'
import { TasksController } from './tasks.controller'
import { TasksService } from './tasks.service'

@Module({
    imports: [PrismaModule, AuditLogsModule],
    controllers: [TasksController],
    providers: [TasksService],
    exports: [TasksService],
})
export class TasksModule { }
