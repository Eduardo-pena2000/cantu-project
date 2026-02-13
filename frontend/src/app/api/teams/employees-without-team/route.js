import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getUserFullName, getUserShortFullName } from "@/utils";
import { paginationDto } from "@/dtos";

function employeeDto({ id, avatar_url, names, last_names, username, email }) {
  return {
    id,
    image: avatar_url ?? null,
    names,
    lastNames: last_names,
    fullName: getUserFullName(names, last_names),
    shortFullName: getUserShortFullName(names, last_names),
    username,
    email: email,
  };
}

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

    const res = await fetch(
      `${process.env.API_URL}/user/without-team/store/${request.auth.store.id}?${queries.toString()}`,
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
              "Hubo un error al intentar obtener los empleados. Por favor, intenta nuevamente.",
          },
        }),
        { status: res.status }
      );
    }

    const json = await res.json();

    const { body } = json;
    const employees = body.map((employee) => employeeDto(employee));
    const pagination = paginationDto({
      last_page: 1,
      total_records: employees.length,
      current_page: 1,
      has_more_pages: false,
    });

    return new NextResponse(
      JSON.stringify({
        status: res.status,
        data: { employees, pagination },
      }),
      { status: res.status }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: {
          message:
            "Hubo un error al intentar obtener los empleados. Por favor, intenta nuevamente.",
        },
      }),
      { status: 500 }
    );
  }
});
