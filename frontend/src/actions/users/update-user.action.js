"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";
import { safeUrlEncode } from "@/utils";

export async function updateUserById(id, data) {
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
        error: { message: "Ocurrió un error al actualizar el usuario. Intenta nuevamente." },
      };
    }

    revalidatePath("/users");
    revalidatePath(`/users/${safeUrlEncode(id)}`);
    return { message: "Usuario actualizado exitosamente." };
  } catch (error) {
    return { error: { message: "Ocurrió un error al actualizar el usuario. Intenta nuevamente." } };
  }
}
