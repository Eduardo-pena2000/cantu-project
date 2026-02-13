export async function getAssignmentDetail(id) {
  const res = await fetch(`/api/reports/activities/assignment/${id}`, {
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
    data: { assignment },
  } = await res.json();

  return { data: assignment };
}
