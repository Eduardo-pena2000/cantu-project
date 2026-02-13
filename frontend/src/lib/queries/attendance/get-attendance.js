export async function getAttendanceByScheduleId({ scheduleId }) {
  const res = await fetch(`/api/attendance/schedule/${scheduleId}`, {
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
    data: { attendance },
  } = await res.json();

  return { data: attendance };
}
