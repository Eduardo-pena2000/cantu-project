import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { teamWithUsersDto } from "@/dtos";

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

    const id = (await params).id;

    const res = await fetch(`${process.env.API_URL}/team/${id}`, {
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
              "Hubo un error al intentar obtener el equipo de trabajo. Por favor, intenta nuevamente.",
          },
        }),
        { status: res.status }
      );
    }

    const json = await res.json();

    const { body } = json;
    const team = teamWithUsersDto(body);

    return new NextResponse(
      JSON.stringify({
        status: res.status,
        data: { team },
      }),
      { status: res.status }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: {
          message:
            "Hubo un error al intentar obtener el equipo de trabajo. Por favor, intenta nuevamente.",
        },
      }),
      { status: 500 }
    );
  }
});
