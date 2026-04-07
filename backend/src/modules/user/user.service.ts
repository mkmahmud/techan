import {
    ConflictException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Prisma, Role } from '@prisma/client'

import { hashPassword } from '@/common/utils/password.util'
import { PrismaService } from '@/prisma/prisma.service'
import type { CreateUserDto } from './schemas/user.schema'

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
    ) { }

    async createUser(input: CreateUserDto, requesterRole: string) {
        if (requesterRole.toUpperCase() !== Role.ADMIN) {
            throw new ForbiddenException({
                code: 'FORBIDDEN',
                message: 'Only admins can create users',
            })
        }

        const existingUser = await this.prisma.user.findUnique({
            where: { email: input.email },
            select: { id: true },
        })

        if (existingUser) {
            throw new ConflictException({
                code: 'EMAIL_ALREADY_EXISTS',
                message: 'A user with this email already exists',
            })
        }

        const rounds = this.configService.get<number>('BCRYPT_ROUNDS') ?? 12
        const hashedPassword = await hashPassword(input.password, rounds)

        try {
            return await this.prisma.user.create({
                data: {
                    name: input.name,
                    email: input.email,
                    password: hashedPassword,
                    role: input.role,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                },
            })
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new ConflictException({
                    code: 'EMAIL_ALREADY_EXISTS',
                    message: 'A user with this email already exists',
                })
            }

            throw new InternalServerErrorException({
                code: 'USER_CREATE_FAILED',
                message: 'Failed to create user',
            })
        }
    }
}
