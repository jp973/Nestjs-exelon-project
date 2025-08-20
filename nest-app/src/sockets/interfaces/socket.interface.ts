import { Socket } from "socket.io";

// src/sockets/interfaces/socket.interface.ts
export interface AuthenticatedSocket extends Socket {
  handshake: any;
  user: {
    userId: string;
    email: string;
    role: string;
    name: string;
  };
}

export interface SocketResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error?: string;
}

export interface SocketEvent {
  event: string;
  data: any;
}