"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";

export async function deleteUserById(id) {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    const res = await fetchApi(`/user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!res.ok) {
      return { error: { message: "Ocurrió un error al eliminar el usuario. Intenta nuevamente." } };
    }

    revalidatePath("/users");
    return { message: "Usuario eliminado exitosamente." };
  } catch (error) {
    return { error: { message: "Ocurrió un error al eliminar el usuario. Intenta nuevamente." } };
  }
}
