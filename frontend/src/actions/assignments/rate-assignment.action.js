"use server";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";

export async function rateAssignment(formData) {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    if (!session.store) {
      return { redirectTo: "/" };
    }

    const res = await fetchApi("/activitie/qualify", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: formData,
    });

    if (!res.ok) {
      return {
        error: { message: "Ocurrió un error al calificar la actividad. Intenta nuevamente." },
      };
    }

    return { message: "Actividad calificada exitosamente." };
  } catch (error) {
    return {
      error: { message: "Ocurrió un error al calificar la actividad. Intenta nuevamente." },
    };
  }
}
