import { SocketPort } from "../../../domain/ports";

import { SocketConfig } from "../../config";

export class SocketAdapter implements SocketPort {
  emitGlobal(event: string, data: any): void {
    const io = SocketConfig.getInstance();

    io.emit(event, data);
  }

  emitToRoom(room: string, event: string, data: any): void {
    const io = SocketConfig.getInstance();

    io.to(room).emit(event, data);
  }

  emitToRooms(rooms: string[], event: string, data: any): void {
    const io = SocketConfig.getInstance();

    rooms.forEach((room) => {
      io.to(room).emit(event, data);
    });
  }

  emitToUser(userId: number, event: string, data: any): void {
    const io = SocketConfig.getInstance();

    io.to(`user-${userId}`).emit(event, data);
  }

  emitToRole(role: string, event: string, data: any): void {
    const io = SocketConfig.getInstance();

    const roomName = this.getRoomNameByRole(role);

    io.to(roomName).emit(event, data);
  }

  emitToRoles(roles: string[], event: string, data: any): void {
    const io = SocketConfig.getInstance();

    roles.forEach((role) => {
      const roomName = this.getRoomNameByRole(role);

      io.to(roomName).emit(event, data);
    });
  }

  broadcast(socketId: string, event: string, data: any, room?: string): void {
    const io = SocketConfig.getInstance();

    const socket = io.sockets.sockets.get(socketId);

    if (!socket) {
      console.warn(`Socket ${socketId} no encontrado para broadcast`);

      return;
    }

    if (room) {
      socket.to(room).emit(event, data);
    } else {
      socket.broadcast.emit(event, data);
    }
  }

  private getRoomNameByRole(role: string): string {
    const normalizedRole = role.toLowerCase();

    return `room-${normalizedRole}`;
  }
}
