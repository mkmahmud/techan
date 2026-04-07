import { Body, Controller, Post } from '@nestjs/common'

import type { JwtPayload } from '@/common/decorators/current-user.decorator'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe'
import { createUserSchema, type CreateUserDto } from './schemas/user.schema'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    async createUser(
        @Body(new ZodValidationPipe(createUserSchema)) body: CreateUserDto,
        @CurrentUser('role') currentUserRole: JwtPayload['role'],
    ) {
        return this.userService.createUser(body, currentUserRole)
    }
}
