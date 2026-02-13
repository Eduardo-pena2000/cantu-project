import { Socket } from "socket.io";

import { TokenService } from "./token.service";

import { NotificationRepository, UserEntity, UserRepository } from "../../domain";

export class SocketHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly notificationRepository: NotificationRepository
  ) {}

  async handleConnection(socket: Socket) {
    const user = await this.authenticateSocket(socket);

    if (!user) {
      socket.emit("error", { message: "Autenticación fallida" });

      socket.disconnect();

      return;
    }

    socket.data.user = user;

    this.joinRoom(socket, `user-${user.id}`);

    user.roles.forEach((role) => {
      this.joinRoom(socket, `role-${role.slug}`);
    });

    this.registerEventHandlers(socket);

    await this.sendNotifictionsToTheUser(socket);
  }

  joinRoom(socket: Socket, room: string) {
    socket.join(room);
  }

  private async authenticateSocket(socket: Socket): Promise<UserEntity | null> {
    try {
      let token = null;

      if (socket.handshake.headers.token || socket.handshake.auth.token) {
        token = socket.handshake.headers.token || socket.handshake.auth.token;
      }

      if (!token) return null;

      const decodedToken = TokenService.verifyToken(token);

      const user = await this.userRepository.findById(decodedToken.id);

      if (!user) return null;

      return user;
    } catch (error) {
      return null;
    }
  }

  private registerEventHandlers(socket: Socket): void {
    socket.on("read-notification", async (payload) => {
      await this.notificationRepository.update(payload.id, { is_read: true });

      const user_id = socket.data.user.id;

      const notifications = await this.notificationRepository.findAllByUser(user_id);

      socket.emit("notifications", notifications);
    });
  }

  private async sendNotifictionsToTheUser(socket: Socket): Promise<void> {
    const user_id = socket.data.user.id;

    const notifications = await this.notificationRepository.findAllByUser(user_id);

    socket.emit("notifications", notifications);
  }
}
