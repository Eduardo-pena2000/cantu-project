"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";

export async function createTeam(data) {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    if (!session.store) {
      return { redirectTo: "/" };
    }

    data.store_id = session.store.id;

    const res = await fetchApi("/team", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const json = await res.json();
      if (json.message === "Ya existe un equipo activo con este turno activo.") {
        return {
          error: {
            message:
              "Ya existe un equipo de trabajo activo con este turno de trabajo. Selecciona otro turno de trabajo.",
          },
        };
      }
      return {
        error: { message: "Ocurrió un error al crear el equipo de trabajo. Intenta nuevamente." },
      };
    }

    revalidatePath("/store/work-teams");
    return { message: "Equipo de trabajo creado exitosamente." };
  } catch (error) {
    return {
      error: { message: "Ocurrió un error al crear el equipo de trabajo. Intenta nuevamente." },
    };
  }
}
