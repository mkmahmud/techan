import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common'
import type { Response } from 'express'

import { Public } from '@/common/decorators/auth.decorators'
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe'
import { AuthService } from './auth.service'
import { loginSchema, type LoginDto } from './schemas/auth.schema'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('login')
    @UsePipes(new ZodValidationPipe(loginSchema))
    async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
        const { token, user } = await this.authService.login(body)
        res.cookie('auth_token', token, this.authService.getCookieOptions())

        return {
            user,
            session: {
                authenticated: true,
            },
        }
    }
}
