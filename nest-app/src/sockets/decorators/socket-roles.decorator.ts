// src/sockets/decorators/socket-roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const SocketRoles = (...roles: string[]) => SetMetadata('roles', roles);