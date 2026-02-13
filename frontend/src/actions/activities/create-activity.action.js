"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";

export async function createActivity(data) {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    if (!session.store) {
      return { redirectTo: "/" };
    }

    const res = await fetchApi("/activitie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      return { error: { message: "Ocurrió un error al crear la actividad. Intenta nuevamente." } };
    }

    revalidatePath("/store/activities");
    return { message: "Actividad creada exitosamente." };
  } catch (error) {
    return { error: { message: "Ocurrió un error al crear la actividad. Intenta nuevamente." } };
  }
}
