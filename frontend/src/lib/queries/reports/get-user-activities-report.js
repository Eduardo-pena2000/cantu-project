export async function getUserActivitiesReport({
  page = 1,
  limit = 10,
  user,
  startDate,
  endDate,
  store,
  area,
  team,
  status,
  order,
}) {
  const queries = new URLSearchParams([
    ["page", page],
    ["limit", limit],
    ["start_date", startDate],
    ["end_date", endDate],
    ["store_id", store],
    ["team_id", team],
    ["order", order],
  ]);

  if (area) queries.set("area_id", area);
  if (status) queries.set("status", status);

  const res = await fetch(`/api/reports/activities/${user}?${queries.toString()}`, {
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
    data: { userActivitiesReport, pagination },
  } = await res.json();

  return { data: userActivitiesReport, pagination };
}
