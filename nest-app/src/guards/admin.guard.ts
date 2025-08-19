// src/guards/admin.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) {
      throw new UnauthorizedException('No authentication information found');
    }

    if (user.role !== 'admin') {
      throw new UnauthorizedException('Administrator privileges required');
    }

    return true;
  }
}