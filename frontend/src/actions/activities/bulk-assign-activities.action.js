"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";

/**
 * Bulk-assigns all template activities for an employee's job role
 * to their attendance record.
 *
 * @param {Object} params
 * @param {number} params.assistanceId  - The attendance/assistance record ID
 * @param {Array}  params.assignments   - Array of { activitie_id, deadline }
 */
export async function bulkAssignActivities({ assistanceId, assignments }) {
  try {
    const session = await auth();

    if (!session) {
      return { redirectTo: "/login" };
    }

    if (!session.store) {
      return { redirectTo: "/" };
    }

    if (!assignments || assignments.length === 0) {
      return { error: { message: "No hay actividades para asignar." } };
    }

    const res = await fetchApi("/activitie/assignment/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        assistance_id: assistanceId,
        assignments,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        error: {
          message:
            body?.message ??
            "Ocurrió un error al asignar las actividades. Intenta nuevamente.",
        },
      };
    }

    revalidatePath("/store/attendance/recorded-attendance");
    return { message: "Actividades asignadas exitosamente." };
  } catch (error) {
    return {
      error: { message: "Ocurrió un error al asignar las actividades. Intenta nuevamente." },
    };
  }
}
