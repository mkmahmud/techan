import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { PrismaService } from '@/prisma/prisma.service'
import type { LoginDto } from './schemas/auth.schema'
import type { JwtPayload } from '@/common/decorators/current-user.decorator'
import { comparePassword, getDummyPasswordHash } from '@/common/utils/password.util'

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async login(input: LoginDto) {
        const rounds = this.configService.get<number>('BCRYPT_ROUNDS') ?? 12

        const user = await this.prisma.user.findUnique({
            where: { email: input.email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                role: true,
            },
        })

        if (!user) {
            const dummyHash = await getDummyPasswordHash(rounds)
            await comparePassword(input.password, dummyHash)
            throw this.invalidCredentials()
        }

        const isPasswordValid = await comparePassword(input.password, user.password)
        if (!isPasswordValid) {
            throw this.invalidCredentials()
        }

        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        }

        const token = await this.jwtService.signAsync(payload, {
            secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '1h',
        })

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        }
    }

    getCookieOptions() {
        const isSecure = this.configService.get<string>('COOKIE_SECURE') === 'true'
        const sameSite =
            (this.configService.get<string>('COOKIE_SAME_SITE') as
                | 'strict'
                | 'lax'
                | 'none') ?? 'lax'

        return {
            httpOnly: true,
            secure: isSecure,
            sameSite,
            signed: true,
            path: '/',
        } as const
    }

    private invalidCredentials() {
        return new UnauthorizedException({
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
        })
    }
}
