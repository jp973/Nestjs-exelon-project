// src/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

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
    console.log('=== JWT VALIDATION ===');
    console.log('Payload received:', payload);
    console.log('Payload sub:', payload.sub);
    console.log('Payload email:', payload.email);
    console.log('Payload role:', payload.role);
    console.log('Payload name:', payload.name);
    console.log('======================');

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      name: payload.name
    };
  }

}