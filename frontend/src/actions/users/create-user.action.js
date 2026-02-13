"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";

export async function createUser(data) {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    const res = await fetchApi("/user/create", {
      method: "POST",
      headers: { Authorization: `Bearer ${session.accessToken}` },
      body: data,
    });

    if (!res.ok) {
      return { error: { message: "Ocurrió un error al crear el usuario. Intenta nuevamente." } };
    }

    revalidatePath("/users");
    return { message: "Usuario creado exitosamente." };
  } catch (error) {
    return { error: { message: "Ocurrió un error al crear el usuario. Intenta nuevamente." } };
  }
}
