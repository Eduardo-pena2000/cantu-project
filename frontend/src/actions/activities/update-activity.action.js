"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";
import { safeUrlEncode } from "@/utils";

export async function updateActivityById(id, data) {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    if (!session.store) {
      return { redirectTo: "/" };
    }

    const res = await fetchApi(`/activitie/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      return {
        error: { message: "Ocurrió un error al actualizar la actividad. Intenta nuevamente." },
      };
    }

    revalidatePath("/store/activities");
    revalidatePath(`/store/activities/${safeUrlEncode(id)}`);
    return { message: "Actividad actualizada exitosamente." };
  } catch (error) {
    return {
      error: { message: "Ocurrió un error al actualizar la actividad. Intenta nuevamente." },
    };
  }
}
