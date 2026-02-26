import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const PATCH = auth(async function PATCH(request, { params }) {
    try {
        const { id } = await params;

        if (!request.auth) {
            return new NextResponse(
                JSON.stringify({
                    status: 401,
                    error: { message: "No autenticado" },
                }),
                { status: 401 }
            );
        }

        const payload = await request.json();

        const res = await fetch(`${process.env.API_URL}/api/incidents/${id}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${request.auth.accessToken}`,
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            if (res.status === 401) {
                return new NextResponse(
                    JSON.stringify({
                        status: 401,
                        error: { message: "No autenticado con el servidor interno." },
                    }),
                    { status: 401 }
                );
            }
            return new NextResponse(
                JSON.stringify({
                    status: res.status,
                    error: {
                        message: errorData.error || "Hubo un error al intentar actualizar la incidencia.",
                    },
                }),
                { status: res.status }
            );
        }

        const json = await res.json();

        return new NextResponse(
            JSON.stringify({
                status: res.status,
                body: json.body || json,
            }),
            { status: res.status }
        );
    } catch (error) {
        return new NextResponse(
            JSON.stringify({
                error: {
                    message: "Hubo un error interno al intentar actualizar la incidencia en el servidor.",
                },
            }),
            { status: 500 }
        );
    }
});
