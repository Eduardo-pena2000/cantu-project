"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";

export async function createArea(data) {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    if (!session.store) {
      return { redirectTo: "/" };
    }

    data.store_id = session.store.id;

    const res = await fetchApi("/area", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      return { error: { message: "Ocurrió un error al crear el área. Intenta nuevamente." } };
    }

    revalidatePath("/store/areas");
    return { message: "Área creada exitosamente." };
  } catch (error) {
    return { error: { message: "Ocurrió un error al crear el área. Intenta nuevamente." } };
  }
}
