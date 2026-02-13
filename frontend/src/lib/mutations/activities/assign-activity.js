export async function assignActivityToEmployee({ attendanceId, activityId, deadline }) {
  const res = await fetch(`/api/activities/assign`, {
    method: "POST",
    body: JSON.stringify({
      assistance_id: attendanceId,
      activitie_id: activityId,
      deadline,
    }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw error;
  }
}
