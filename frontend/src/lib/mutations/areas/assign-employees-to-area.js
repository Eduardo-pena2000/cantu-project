export async function assignEmployeesToArea({ area, addedEmployees, removedEmployees }) {
  const res = await fetch(`/api/areas/employees`, {
    method: "POST",
    body: JSON.stringify({
      area_id: area,
      added_users: addedEmployees,
      deleted_users: removedEmployees,
    }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw error;
  }
}
