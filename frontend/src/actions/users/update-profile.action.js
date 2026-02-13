"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";

export async function updateProfileById(id, data) {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    const res = await fetchApi(`/user/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${session.accessToken}` },
      body: data,
    });

    if (!res.ok) {
      return {
        error: { message: "Ocurrió un error al actualizar el perfil. Intenta nuevamente." },
      };
    }

    revalidatePath("/profile");
    return { message: "Perfil actualizado exitosamente." };
  } catch (error) {
    return { error: { message: "Ocurrió un error al actualizar el perfil. Intenta nuevamente." } };
  }
}
