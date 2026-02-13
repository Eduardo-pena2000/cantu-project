export async function getEmployeesWithoutTeam(teamId) {
  const queries = new URLSearchParams([]);

  if (teamId) {
    queries.set("teamId", teamId);
  }

  const res = await fetch(`/api/teams/employees-without-team?${queries.toString()}`, {
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
    data: { employees, pagination },
  } = await res.json();

  return { data: employees, pagination };
}
