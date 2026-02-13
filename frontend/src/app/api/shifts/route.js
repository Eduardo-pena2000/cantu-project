import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { paginationDto, shiftDto } from "@/dtos";

export const GET = auth(async function GET(request) {
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

    const queries = new URLSearchParams(request.nextUrl.searchParams);
    queries.set("store", request.auth.store.id);

    const res = await fetch(`${process.env.API_URL}/shift?${queries.toString()}`, {
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
              "Hubo un error al intentar obtener los turnos de trabajo. Por favor, intenta nuevamente.",
          },
        }),
        { status: res.status }
      );
    }

    const json = await res.json();

    const {
      body: { last_page, total_records, current_page, has_more_pages, data },
    } = json;
    const shifts = data.map((shift) => shiftDto(shift));
    const pagination = paginationDto({
      last_page,
      total_records,
      current_page,
      has_more_pages,
    });

    return new NextResponse(
      JSON.stringify({
        status: res.status,
        data: { shifts, pagination },
      }),
      { status: res.status }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: {
          message:
            "Hubo un error al intentar obtener los turnos de trabajo. Por favor, intenta nuevamente.",
        },
      }),
      { status: 500 }
    );
  }
});
