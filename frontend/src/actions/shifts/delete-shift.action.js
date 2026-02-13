"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";

export async function deleteShiftById(id) {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    if (!session.store) {
      return { redirectTo: "/" };
    }

    const res = await fetchApi(`/shift/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!res.ok) {
      return { error: { message: "Ocurrió un error al eliminar el turno. Intenta nuevamente." } };
    }

    revalidatePath("/store/shifts");
    return { message: "Turno eliminado exitosamente." };
  } catch (error) {
    return { error: { message: "Ocurrió un error al eliminar el turno. Intenta nuevamente." } };
  }
}
