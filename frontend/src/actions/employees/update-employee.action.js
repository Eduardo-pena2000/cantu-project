"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";
import { safeUrlEncode } from "@/utils";

export async function updateEmployeeById(id, data) {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    if (!session.store) {
      return { redirectTo: "/" };
    }

    data.append("store_id", session.store.id);

    const res = await fetchApi(`/user/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${session.accessToken}` },
      body: data,
    });

    if (!res.ok) {
      return {
        error: { message: "Ocurrió un error al actualizar el empleado. Intenta nuevamente." },
      };
    }

    revalidatePath("/store/employees");
    revalidatePath(`/store/employees/${safeUrlEncode(id)}`);
    return { message: "Empleado actualizado exitosamente." };
  } catch (error) {
    return {
      error: { message: "Ocurrió un error al actualizar el empleado. Intenta nuevamente." },
    };
  }
}
