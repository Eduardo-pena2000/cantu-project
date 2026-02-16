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
  // Helper for time calc
  const timeToMinutes = (time) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Initialize accumulators for overall attendance
  let completedAssigments = 0;
  let pendingAssigments = 0;
  let lateAssigments = 0;
  let scoreSum = 0; // Sum of final scores for assignments

  const assignments = [];

  for (let i = 0; i < assistance.activities_asigments.length; i++) {
    const { id, deadline, is_completed, note, is_late, activity, date_completed, manager_note, shift_manager_note } =
      assistance.activities_asigments[i];

    let status = 'PENDING'; // PENDING, EXCELLENT, WARNING, LATE

    // 1. Time-based Status (Baseline)
    const deadlineMinutes = timeToMinutes(deadline);

    if (is_late) {
      status = 'LATE';
      lateAssigments++;
    } else if (is_completed) {
      completedAssigments++;
      if (date_completed) {
        const completedMinutes = timeToMinutes(date_completed);
        const diff = deadlineMinutes - completedMinutes;
        if (diff >= 0 && diff <= 15) {
          status = 'WARNING';
        } else if (diff < 0) {
          status = 'LATE';
        } else {
          status = 'EXCELLENT';
        }
      } else {
        status = 'EXCELLENT';
      }
    } else {
      pendingAssigments++;
      const diff = deadlineMinutes - currentMinutes;
      if (diff < 0) {
        status = 'LATE';
      } else if (diff <= 30) {
        status = 'WARNING';
      }
    }

    // 2. Score Calculation (Manual Override)
    // Collect valid notes
    const validNotes = [];
    if (manager_note !== null) validNotes.push(manager_note);
    if (shift_manager_note !== null) validNotes.push(shift_manager_note);
    if (note !== null && validNotes.length === 0) validNotes.push(note); // Fallback to legacy note if no specific notes

    let finalScore = null;
    if (validNotes.length > 0) {
      const sum = validNotes.reduce((a, b) => a + b, 0);
      finalScore = sum / validNotes.length;
      scoreSum += finalScore;

      // Adjust Status based on Score
      if (finalScore >= 90) status = 'EXCELLENT';
      else if (finalScore < 60) status = 'LATE'; // Penalize bad quality even if on time
      else if (finalScore < 90) status = 'WARNING'; // Average quality
    }

    assignments.push({
      id,
      deadline,
      isComplete: is_completed,
      score: finalScore,
      isLate: is_late,
      dateCompleted: date_completed,
      status,
      activity: {
        id: activity.id,
        name: activity.name,
        description: activity.description,
      },
    });
  }

  // Calculate Overall Face/Status
  // Logic: Mixed approach. 
  // If Average Score exists for the whole day, use it.
  // Else use count of LATE/WARNING.

  const totalAssignments = assignments.length;
  const assignmentsWithScore = assignments.filter(a => a.score !== null).length;

  let overallStatus = 'EXCELLENT';

  if (assignmentsWithScore > 0 && totalAssignments > 0) {
    // Use Average Score of Day
    const averageDayScore = scoreSum / assignmentsWithScore; // scoreSum was summed with finalScores
    if (averageDayScore >= 90) overallStatus = 'EXCELLENT';
    else if (averageDayScore < 60) overallStatus = 'LATE';
    else overallStatus = 'WARNING';
  } else {
    // Fallback to Status Counts (Time based)
    const lateCount = assignments.filter(a => a.status === 'LATE').length;
    const warningCount = assignments.filter(a => a.status === 'WARNING').length;

    if (lateCount > 0) overallStatus = 'LATE';
    else if (warningCount > 0) overallStatus = 'WARNING';
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
      score: assignmentsWithScore ? (scoreSum / assignmentsWithScore).toFixed(1) : null,
      overallStatus,
      assignments,
    },
  };
}
