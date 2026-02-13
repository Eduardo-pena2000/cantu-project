import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { assignmentDto } from "@/dtos";

export const GET = auth(async function GET(request, { params }) {
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

    const id = (await params).id;

    const res = await fetch(`${process.env.API_URL}/activitie/assigned/${id}`, {
      method: "GET",
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
              "Hubo un error al intentar obtener el detalle de cumplimiento de la actividad. Por favor, intenta nuevamente.",
          },
        }),
        { status: res.status }
      );
    }

    const json = await res.json();

    const { body } = json;
    const assignment = assignmentDto(body);

    return new NextResponse(
      JSON.stringify({
        status: res.status,
        data: { assignment },
      }),
      { status: res.status }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: {
          message:
            "Hubo un error al intentar obtener el detalle de cumplimiento de la actividad. Por favor, intenta nuevamente.",
        },
      }),
      { status: 500 }
    );
  }
});
