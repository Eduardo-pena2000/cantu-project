export async function getStoreAreas({ store, page = 1, limit = 10, q = "" }) {
  const queries = new URLSearchParams([
    ["page", page],
    ["limit", limit],
    ["store", store],
  ]);

  if (q) queries.set("name", q);

  const res = await fetch(`/api/areas/store?${queries.toString()}`, {
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
    data: { areas, pagination },
  } = await res.json();

  return { data: areas, pagination };
}
