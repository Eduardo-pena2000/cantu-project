import { toast } from "sonner";

import { fetchToken } from "@/config/firebase.config";

export async function getNotificationPermissionAndToken() {
  // Check if Notifications are supported in the browser
  if (!"Notification" in window) {
    toast.warning("Este navegador no soporta el servicio de notificaciones.", {
      id: "browser-notifications",
    });
    return null;
  }

  // Check if permission is already granted
  if (Notification.permission === "granted") {
    return await fetchToken();
  }

  // If permission is not denied, request persmission from the user
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      return await fetchToken();
    }
  }

  if (Notification.permission === "denied") {
    toast.warning("El permiso de notificaciones está denegado por el usuario.", {
      id: "browser-notifications",
    });
    return null;
  }
}
