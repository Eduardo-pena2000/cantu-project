export async function getEmployeesByScheduleId({ scheduleId, page = 1, limit = 10, q = "" }) {
  const queries = new URLSearchParams([
    ["page", page],
    ["limit", limit],
  ]);

  if (q) queries.set("name", q);

  const res = await fetch(`/api/employees/schedule/${scheduleId}?${queries.toString()}`, {
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
