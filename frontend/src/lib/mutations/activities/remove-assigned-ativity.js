export async function removeAssignedActivityToEmployee({ assignedActivityId }) {
  const res = await fetch(`/api/activities/assign/${assignedActivityId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw error;
  }
}
