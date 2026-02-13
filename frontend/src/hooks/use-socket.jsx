import * as React from "react";
import { io } from "socket.io-client";

export default function useSocket({ url, token }) {
  const [socket, setSocket] = React.useState(null);

  const socketIo = React.useMemo(
    () =>
      io(url, {
        transports: ["websocket"],
        autoConnect: false,
        path: "/socket.io",
        auth: {
          token,
        },
      }),
    [url, token]
  );

  const connectSocket = React.useCallback(() => {
    const socketTemp = socketIo.connect();

    setSocket(socketTemp);
  }, [socketIo]);

  const disconnectSocket = React.useCallback(() => {
    socket?.disconnect();
  }, [socketIo]);

  return {
    socket,
    connectSocket,
    disconnectSocket,
  };
}
