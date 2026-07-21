export async function getJobRoles({ page = 1, limit = 50, q = "" } = {}) {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    q,
  });

  const res = await fetch(`/api/job-roles?${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw error;
  }

  const { body } = await res.json();
  return body;
}
