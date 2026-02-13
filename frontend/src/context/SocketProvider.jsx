"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import useSocket from "@/hooks/use-socket";

export const SocketContext = React.createContext(null);

export default function SocketProvider({ children }) {
  const { status, data: session } = useSession();
  const { socket, connectSocket, disconnectSocket } = useSocket({
    url: process.env.NEXT_PUBLIC_WS_API_URL,
    token: session?.accessToken ?? "",
  });

  React.useEffect(() => {
    if (status === "authenticated") {
      connectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [status, connectSocket]);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      disconnectSocket();
    }
  }, [status, disconnectSocket]);

  return (
    <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
}
