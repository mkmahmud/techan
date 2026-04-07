import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type { Request } from 'express'

import type { JwtPayload } from '@/common/decorators/current-user.decorator'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.extractTokenFromRequest,
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
        })
    }

    private static extractTokenFromRequest(req: Request): string | null {
        const signedCookieToken = req.signedCookies?.auth_token
        if (typeof signedCookieToken === 'string' && signedCookieToken.length > 0) {
            return signedCookieToken
        }

        const cookieToken = req.cookies?.auth_token
        if (typeof cookieToken === 'string' && cookieToken.length > 0) {
            return cookieToken
        }

        const authHeader = req.headers.authorization
        if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
            return authHeader.slice(7)
        }

        return null
    }

    validate(payload: JwtPayload): JwtPayload {
        return payload
    }
}
