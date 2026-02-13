"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";
import { safeUrlEncode } from "@/utils";

export async function updateAreaById(id, data) {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    if (!session.store) {
      return { redirectTo: "/" };
    }

    data.store_id = session.store.id;

    const res = await fetchApi(`/area/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      return { error: { message: "Ocurrió un error al actualizar el área. Intenta nuevamente." } };
    }

    revalidatePath("/store/areas");
    revalidatePath(`/store/areas/${safeUrlEncode(id)}`);
    return { message: "Área actualizada exitosamente." };
  } catch (error) {
    return { error: { message: "Ocurrió un error al actualizar el área. Intenta nuevamente." } };
  }
}
