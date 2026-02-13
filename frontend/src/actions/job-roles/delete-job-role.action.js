"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";

export async function deleteJobRoleById(id) {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    if (!session.store) {
      return { redirectTo: "/" };
    }

    const res = await fetchApi(`/job-role/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!res.ok) {
      return {
        error: { message: "Ocurrió un error al eliminar el rol de trabajo. Intenta nuevamente." },
      };
    }

    revalidatePath("/store/activities");
    return { message: "Rol de trabajo eliminado exitosamente." };
  } catch (error) {
    return {
      error: { message: "Ocurrió un error al eliminar el rol de trabajo. Intenta nuevamente." },
    };
  }
}
