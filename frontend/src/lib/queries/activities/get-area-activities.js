export async function getAreaActivities({ areaId, page = 1, limit = 10, q = "" }) {
  const queries = new URLSearchParams([
    ["page", page],
    ["limit", limit],
  ]);

  if (q) queries.set("name", q);

  const res = await fetch(`/api/activities/area/${areaId}?${queries.toString()}`, {
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
    data: { activities, pagination },
  } = await res.json();

  return { data: activities, pagination };
}
