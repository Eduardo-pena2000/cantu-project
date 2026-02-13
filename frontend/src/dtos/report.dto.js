import { getUserFullName, getUserShortFullName } from "@/utils";

export function teamReportDto({ id, name, code, is_active }) {
  return {
    id,
    name,
    code,
    isActive: is_active,
  };
}

export function usersTeamReportDto({
  id,
  avatar_url,
  names,
  last_names,
  username,
  email,
  assigned_activities,
  completed_activities,
  incomplete_activities,
  late_activities,
  avg_note,
}) {
  return {
    id,
    image: avatar_url ?? null,
    names,
    lastNames: last_names,
    fullName: getUserFullName(names, last_names),
    shortFullName: getUserShortFullName(names, last_names),
    username,
    email,
    assignedActivities: assigned_activities,
    completedActivities: completed_activities,
    incompleteActivities: incomplete_activities,
    lateActivities: late_activities,
    score: avg_note,
  };
}

export function userActivitiesReportDto({
  id,
  deadline,
  is_completed,
  activity,
  is_late,
  manager_note,
  shift_manager_note,
  note,
  manager_comments,
  shift_manager_comments,
  date_completed,
  assistance,
}) {
  return {
    id,
    deadline,
    isCompleted: is_completed,
    activity: {
      id: activity.id,
      name: activity.name,
      description: activity.description,
    },
    isLate: is_late,
    managerNote: manager_note,
    shiftManagerNote: shift_manager_note,
    note,
    managerComments: manager_comments,
    shiftManagerComments: shift_manager_comments,
    dateCompleted: date_completed,
    assistance: {
      id: assistance.id,
      status: assistance.status,
      dateAssistance: assistance.date_assistance,
      takenEmployee: {
        id: assistance.taken_employee.id,
        image: assistance.taken_employee.avatar_url ?? null,
        names: assistance.taken_employee.names,
        lastNames: assistance.taken_employee.last_names,
        fullName: getUserFullName(
          assistance.taken_employee.names,
          assistance.taken_employee.last_names
        ),
        shortFullName: getUserShortFullName(
          assistance.taken_employee.names,
          assistance.taken_employee.last_names
        ),
        username: assistance.taken_employee.username,
        email: assistance.taken_employee.email,
      },
      employee: {
        id: assistance.employee.id,
        image: assistance.employee.avatar_url ?? null,
        names: assistance.employee.names,
        lastNames: assistance.employee.last_names,
        fullName: getUserFullName(assistance.employee.names, assistance.employee.last_names),
        shortFullName: getUserShortFullName(
          assistance.employee.names,
          assistance.employee.last_names
        ),
        username: assistance.employee.username,
        email: assistance.employee.email,
      },
    },
  };
}
