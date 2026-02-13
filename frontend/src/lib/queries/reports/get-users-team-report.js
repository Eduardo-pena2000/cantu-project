export async function getUsersTeamReport({
  page = 1,
  limit = 10,
  team,
  startDate,
  endDate,
  area,
  status,
  order,
}) {
  const queries = new URLSearchParams([
    ["page", page],
    ["limit", limit],
    ["start_date", startDate],
    ["end_date", endDate],
    ["order", order],
  ]);

  if (area) queries.set("area_id", area);
  if (status) queries.set("status", status);

  const res = await fetch(`/api/reports/users/${team}?${queries.toString()}`, {
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
    data: { usersTeamReport, pagination },
  } = await res.json();

  return { data: usersTeamReport, pagination };
}
