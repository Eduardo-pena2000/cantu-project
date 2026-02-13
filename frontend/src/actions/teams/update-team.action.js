"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";
import { safeUrlEncode } from "@/utils";

export async function updateTeamById(id, data) {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    if (!session.store) {
      return { redirectTo: "/" };
    }

    const res = await fetchApi(`/team/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      return {
        error: {
          message: "Ocurrió un error al actualizar el equipo de trabajo. Intenta nuevamente.",
        },
      };
    }

    revalidatePath("/store/work-teams");
    revalidatePath(`/store/work-teams/${safeUrlEncode(id)}`);
    return { message: "Equipo de trabajo actualizado exitosamente." };
  } catch (error) {
    return {
      error: {
        message: "Ocurrió un error al actualizar el equipo de trabajo. Intenta nuevamente.",
      },
    };
  }
}
