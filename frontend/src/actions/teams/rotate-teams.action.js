"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";

export async function rotateTeams() {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    if (!session.store) {
      return { redirectTo: "/" };
    }

    const res = await fetchApi("/team/rotate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        store_id: session.store.id,
      }),
    });

    if (!res.ok) {
      return {
        error: {
          message:
            "Ocurrió un error al realizar la rotación de los equipos de trabajo. Intenta nuevamente.",
        },
      };
    }

    revalidatePath("/store/work-teams");
    return { message: "Rotación exitosa de los equipos de trabajo." };
  } catch (error) {
    return {
      error: {
        message:
          "Ocurrió un error al realizar la rotación de los equipos de trabajo. Intenta nuevamente.",
      },
    };
  }
}
