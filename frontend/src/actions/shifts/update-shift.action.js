"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";
import { safeUrlEncode } from "@/utils";

export async function updateShiftById(id, data) {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    if (!session.store) {
      return { redirectTo: "/" };
    }

    const res = await fetchApi(`/shift/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      return { error: { message: "Ocurrió un error al actualizar el turno. Intenta nuevamente." } };
    }

    revalidatePath("/store/shifts");
    revalidatePath(`/store/shift/${safeUrlEncode(id)}`);
    return { message: "Turno actualizado exitosamente." };
  } catch (error) {
    return { error: { message: "Ocurrió un error al actualizar el turno. Intenta nuevamente." } };
  }
}
