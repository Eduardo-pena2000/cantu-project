export interface SocketPort {
  broadcast(socketId: string, event: string, data: any, room?: string): void;
  emitGlobal(event: string, data: any): void;
  emitToRoom(room: string, event: string, data: any): void;
  emitToRooms(rooms: string[], event: string, data: any): void;
  emitToUser(userId: number, event: string, data: any): void;
  emitToRole(role: string, event: string, data: any): void;
  emitToRoles(roles: string[], event: string, data: any): void;
}
