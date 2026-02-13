import { getUserFullName, getUserShortFullName } from "@/utils";

export function employeeAssignmentDto({
  id,
  avatar_url,
  email,
  names,
  username,
  last_names,
  assistance,
}) {
  const assignments = [];
  let completedAssigments = 0;
  let pendingAssigments = 0;
  let lateAssigments = 0;
  let scoreSum = 0;

  for (let i = 0; i < assistance.activities_asigments.length; i++) {
    const { id, deadline, is_completed, note, is_late, activity } =
      assistance.activities_asigments[i];

    if (!is_completed && !is_late) {
      pendingAssigments++;
    } else if (is_late) {
      lateAssigments++;
    } else {
      completedAssigments++;
    }

    if (note !== null) {
      scoreSum += note;
    }

    assignments.push({
      id,
      deadline,
      isComplete: is_completed,
      score: note,
      isLate: is_late,
      activity: {
        id: activity.id,
        name: activity.name,
        description: activity.description,
      },
    });
  }

  return {
    id: id,
    image: avatar_url ?? null,
    email: email,
    names: names,
    username: username,
    lastNames: last_names,
    fullName: getUserFullName(names, last_names),
    shortFullName: getUserShortFullName(names, last_names),
    attendance: {
      id: assistance.id,
      date: assistance.date_assistance,
      completed: completedAssigments,
      pending: pendingAssigments,
      late: lateAssigments,
      score: assignments.length ? scoreSum / assignments.length : null,
      assignments,
    },
  };
}
