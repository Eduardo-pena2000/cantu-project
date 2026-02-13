export async function editAssignedActivityToEmployee({ assignedActivityId, deadline }) {
  const res = await fetch(`/api/activities/assign/${assignedActivityId}`, {
    method: "PATCH",
    body: JSON.stringify({
      deadline,
    }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw error;
  }
}
