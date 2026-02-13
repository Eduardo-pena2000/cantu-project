export async function assignEmployeeToTeam({ teamId, employeeId, workingDays }) {
  const res = await fetch(`/api/teams/assign-employee`, {
    method: "POST",
    body: JSON.stringify({
      team_id: teamId,
      user_id: employeeId,
      working_days: workingDays,
    }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw error;
  }
}
