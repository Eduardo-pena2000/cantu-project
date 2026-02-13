"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";

export async function createStore(data) {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    const res = await fetchApi("/store", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: data,
    });

    if (!res.ok) {
      return { error: { message: "Ocurrió un error al crear la tienda. Intenta nuevamente." } };
    }

    revalidatePath("/stores");
    return { message: "Tienda creada exitosamente." };
  } catch (error) {
    return { error: { message: "Ocurrió un error al crear la tienda. Intenta nuevamente." } };
  }
}
