"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";
import { safeUrlEncode } from "@/utils";

export async function updateStoreById(id, data) {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    const res = await fetchApi(`/store/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: data,
    });

    if (!res.ok) {
      return {
        error: { message: "Ocurrió un error al actualizar la tienda. Intenta nuevamente." },
      };
    }

    revalidatePath("/stores");
    revalidatePath(`/stores/${safeUrlEncode(id)}`);
    return { message: "Tienda actualizada exitosamente." };
  } catch (error) {
    return { error: { message: "Ocurrió un error al actualizar la tienda. Intenta nuevamente." } };
  }
}
