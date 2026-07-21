import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { fetchApi } from "@/lib";

export async function GET(request) {
  try {
    const session = await auth();

    if (!session || !session.store) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "50";
    const page = searchParams.get("page") || "1";
    const search = searchParams.get("q") || "";

    const res = await fetchApi(
      `/job-role?limit=${limit}&page=${page}&q=${search}&store=${session.store.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: { message: error?.message ?? "Error fetching job roles" } },
        { status: res.status }
      );
    }

    const body = await res.json();
    return NextResponse.json(body);
  } catch (error) {
    return NextResponse.json({ error: { message: "Internal server error" } }, { status: 500 });
  }
}
