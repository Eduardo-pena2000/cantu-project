"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";
import { safeUrlEncode } from "@/utils";

export async function updateJobRoleById(id, data) {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    if (!session.store) {
      return { redirectTo: "/" };
    }

    const res = await fetchApi(`/job-role/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      return {
        error: { message: "Ocurrió un error al actualizar el rol de trabajo. Intenta nuevamente." },
      };
    }

    revalidatePath("/store/activities");
    revalidatePath(`/store/activities/job-roles/${safeUrlEncode(id)}`);
    return { message: "Rol de trabajo actualizado exitosamente." };
  } catch (error) {
    return {
      error: { message: "Ocurrió un error al actualizar el rol de trabajo. Intenta nuevamente." },
    };
  }
}
