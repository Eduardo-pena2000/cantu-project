import { NextResponse } from "next/server";

import { auth } from "@/auth";

export const POST = auth(async function POST(request) {
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

    const res = await fetch(`${process.env.API_URL}/activitie/assignment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${request.auth.accessToken}`,
      },
      body: JSON.stringify(await request.json()),
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
              "Hubo un error al asignar la actividad al empleado. Por favor, intenta nuevamente.",
          },
        }),
        { status: res.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: {
          message:
            "Hubo un error al asignar la actividad al empleado. Por favor, intenta nuevamente.",
        },
      }),
      { status: 500 }
    );
  }
});
