// src/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { logger } from 'src/utils/logger';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'defaultSecret',
    });
  }

  // In your simplified JwtStrategy, add this:
  async validate(payload: any) {
    logger.info('=== JWT VALIDATION ===');
    logger.info('Payload received:', payload);
    logger.info('Payload sub:', payload.sub);
    logger.info('Payload email:', payload.email);
    logger.info('Payload role:', payload.role);
    logger.info('Payload name:', payload.name);
    logger.info('======================');

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      name: payload.name
    };
  }

}