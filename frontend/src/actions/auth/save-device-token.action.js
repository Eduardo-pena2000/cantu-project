"use server";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";

export async function saveDeviceToken(token) {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    const res = await fetchApi("/user/device", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) {
      return {
        error: {
          message: "Ocurrió un error al registrar los permisos del usuario. Intenta nuevamente.",
        },
      };
    }

    return { message: "Se han guardado los permisos exitosamente." };
  } catch (error) {
    return {
      error: {
        message: "Ocurrió un error al registrar los permisos del usuario. Intenta nuevamente.",
      },
    };
  }
}
