import { NextResponse } from "next/server";

import { auth } from "@/auth";

export const DELETE = auth(async function DELETE(request, { params }) {
  try {
    if (!request.auth) {
      return new NextResponse(
        JSON.stringify({
          status: 401,
          error: { message: "No autenticado" },
        }),
        {
          status: 401,
        }
      );
    }

    if (!request.auth.store) {
      return new NextResponse(
        JSON.stringify({
          status: 403,
          error: { message: "No autorizado" },
        }),
        {
          status: 403,
        }
      );
    }

    const { id, employeeId } = await params;

    const res = await fetch(`${process.env.API_URL}/team/${id}/user/${employeeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${request.auth.accessToken}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        return new NextResponse(
          JSON.stringify({
            status: 401,
            error: { message: "No autenticado" },
          }),
          {
            status: 401,
          }
        );
      }

      return new NextResponse(
        JSON.stringify({
          status: res.status,
          error: {
            message:
              "Hubo un error al intentar remover el empleado del equipo de trabajo. Por favor, intenta nuevamente.",
          },
        }),
        { status: res.status }
      );
    }

    return new NextResponse(JSON.stringify({ status: res.status }), { status: res.status });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: {
          message:
            "Hubo un error al intentar remover el empleado del equipo de trabajo. Por favor, intenta nuevamente.",
        },
      }),
      { status: 500 }
    );
  }
});
