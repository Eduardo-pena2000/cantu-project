export async function getTeamById(id) {
  const res = await fetch(`/api/teams/${id}`, {
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
    data: { team },
  } = await res.json();

  return { data: team };
}
