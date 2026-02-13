import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { teamReportDto } from "@/dtos";

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

    const queries = new URLSearchParams(request.nextUrl.searchParams);

    const res = await fetch(`${process.env.API_URL}/reports/teams?${queries.toString()}`, {
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
              "Hubo un error al intentar obtener el reporte de los equipos de trabajo. Por favor, intenta nuevamente.",
          },
        }),
        { status: res.status }
      );
    }

    const json = await res.json();

    const { body } = json;
    const teamsReport = body.map((teamReport) => teamReportDto(teamReport));

    return new NextResponse(
      JSON.stringify({
        status: res.status,
        data: { teamsReport },
      }),
      { status: res.status }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: {
          message:
            "Hubo un error al intentar obtener el reporte de los equipos de trabajo. Por favor, intenta nuevamente.",
        },
      }),
      { status: 500 }
    );
  }
});
