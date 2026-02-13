export async function removeEmployeeFromTeam({ teamId, employeeId }) {
  const res = await fetch(`/api/teams/${teamId}/employees/${employeeId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw error;
  }
}
