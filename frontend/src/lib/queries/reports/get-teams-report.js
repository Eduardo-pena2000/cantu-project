export async function getTeamsReport({
  page = 1,
  limit = 10,
  startDate,
  endDate,
  store,
  area,
  status,
  order,
}) {
  const queries = new URLSearchParams([
    ["page", page],
    ["limit", limit],
    ["start_date", startDate],
    ["end_date", endDate],
    ["store_id", store],
    ["order", order],
  ]);

  if (area) queries.set("area_id", area);
  if (status) queries.set("status", status);

  const res = await fetch(`/api/reports/teams?${queries.toString()}`, {
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
    data: { teamsReport },
  } = await res.json();

  return { data: teamsReport };
}
