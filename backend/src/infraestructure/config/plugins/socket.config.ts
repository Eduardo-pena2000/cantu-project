import { Socket, Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

import { AppError } from "../../../shared";

import { SocketHandler } from "../../services";

export class SocketConfig {
  private static io: SocketIOServer;

  static socketHandler: SocketHandler;

  constructor(private readonly socketHandler: SocketHandler) { }

  public initializeServer(httpServer: HttpServer): void {
    if (!SocketConfig.io) {
      SocketConfig.io = new SocketIOServer(httpServer, {
        cors: {
          origin: [
            /^(http:\/\/)?localhost:[0-9]{1,5}$/,
            "https://stores-project-frontend.vercel.app",
          ],
          methods: ["GET", "POST"],
          credentials: true,
        },
      });

      SocketConfig.io.on("connection", (socket: Socket) => this.socketHandler.handleConnection(socket));

      console.log("Socket initialized");
    }
  }

  public static getInstance(): SocketIOServer {
    if (!SocketConfig.io) {
      throw AppError.internalServer("SocketConfig no está inicializado");
    }

    return SocketConfig.io;
  }
}
