import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { paginationDto, usersTeamReportDto } from "@/dtos";

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

    const team_id = (await params).team_id;
    const queries = new URLSearchParams(request.nextUrl.searchParams);

    const res = await fetch(
      `${process.env.API_URL}/reports/teams/${team_id}/users?${queries.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${request.auth.accessToken}`,
        },
      }
    );

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
              "Hubo un error al intentar obtener el reporte de los usuarios del equipo de trabajo. Por favor, intenta nuevamente.",
          },
        }),
        { status: res.status }
      );
    }

    const json = await res.json();

    const {
      body: { last_page, total_records, current_page, has_more_pages, data },
    } = json;
    const usersTeamReport = data.map((userTeamReport) => usersTeamReportDto(userTeamReport));
    const pagination = paginationDto({
      last_page,
      total_records,
      current_page,
      has_more_pages,
    });

    return new NextResponse(
      JSON.stringify({
        status: res.status,
        data: { usersTeamReport, pagination },
      }),
      { status: res.status }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: {
          message:
            "Hubo un error al intentar obtener el reporte de los usuarios del equipo de trabajo. Por favor, intenta nuevamente.",
        },
      }),
      { status: 500 }
    );
  }
});
