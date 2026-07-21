"use client";

import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { SocketContext } from "@/context/SocketProvider";

export function RealtimeRefresh({ storeId }) {
  const { socket } = useContext(SocketContext) || {};
  const router = useRouter();

  useEffect(() => {
    if (!socket) return;
    
    const handleUpdate = (data) => {
      // Refresh the page if the update is for our store, or if no specific store was provided (global)
      if (!data.store_id || String(data.store_id) === String(storeId)) {
        router.refresh();
      }
    };

    socket.on("dashboard-updated", handleUpdate);
    return () => socket.off("dashboard-updated", handleUpdate);
  }, [socket, router, storeId]);

  return null;
}
