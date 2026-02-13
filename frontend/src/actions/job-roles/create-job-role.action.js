"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";

export async function createJobRole(data) {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    if (!session.store) {
      return { redirectTo: "/" };
    }

    data.store_id = session.store.id;

    const res = await fetchApi("/job-role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      return {
        error: { message: "Ocurrió un error al crear el rol de trabajo. Intenta nuevamente." },
      };
    }

    revalidatePath("/store/activities");
    return { message: "Rol de trabajo creado exitosamente." };
  } catch (error) {
    return {
      error: { message: "Ocurrió un error al crear el rol de trabajo. Intenta nuevamente." },
    };
  }
}
