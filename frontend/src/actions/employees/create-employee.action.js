"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";

export async function createEmployee(data) {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    if (!session.store) {
      return { redirectTo: "/" };
    }

    data.append("store_id", session.store.id);

    const res = await fetchApi("/user/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: data,
    });

    if (!res.ok) {
      return { error: { message: "Ocurrió un error al crear el empleado. Intenta nuevamente." } };
    }

    revalidatePath("/store/employees");
    return { message: "Empleado creado exitosamente." };
  } catch (error) {
    return { error: { message: "Ocurrió un error al crear el empleado. Intenta nuevamente." } };
  }
}
