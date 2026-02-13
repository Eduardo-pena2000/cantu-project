export async function takeEmployeeAttendance(formData) {
  const res = await fetch("/api/attendance", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw error;
  }
}
