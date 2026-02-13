"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";

export async function deleteStoreById(id) {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    const res = await fetchApi(`/store/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!res.ok) {
      return { error: { message: "Ocurrió un error al eliminar la tienda. Intenta nuevamente." } };
    }

    revalidatePath("/stores");
    return { message: "Tienda eliminada exitosamente." };
  } catch (error) {
    return { error: { message: "Ocurrió un error al eliminar la tienda. Intenta nuevamente." } };
  }
}
