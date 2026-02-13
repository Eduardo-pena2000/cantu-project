"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";

export async function deleteTeamById(id) {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    if (!session.store) {
      return { redirectTo: "/" };
    }

    const res = await fetchApi(`/team/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!res.ok) {
      return {
        error: {
          message: "Ocurrió un error al eliminar el equipo de trabajo. Intenta nuevamente.",
        },
      };
    }

    revalidatePath("/store/work-teams");
    return { message: "Equipo de trabajo eliminado exitosamente." };
  } catch (error) {
    return {
      error: { message: "Ocurrió un error al eliminar el equipo de trabajo. Intenta nuevamente." },
    };
  }
}
