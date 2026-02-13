export async function getTeams({ page = 1, limit = 10, q = "", isActive = undefined }) {
  const queries = new URLSearchParams([
    ["page", page],
    ["limit", limit],
  ]);

  if (q) queries.set("name", q);
  if (isActive !== undefined) {
    queries.set("is_active", isActive);
  }

  const res = await fetch(`/api/teams?${queries.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw error;
  }

  const {
    data: { teams, pagination },
  } = await res.json();

  return { data: teams, pagination };
}
