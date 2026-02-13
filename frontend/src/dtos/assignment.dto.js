import { getUserFullName, getUserShortFullName } from "@/utils";

export function assignmentDto({
  id,
  deadline,
  is_completed,
  activitie_image_name,
  activitie_image_url,
  activity,
  is_late,
  manager_note,
  manager_comments,
  shift_manager_note,
  shift_manager_comments,
  note,
  date_completed,
  assistance,
}) {
  return {
    id,
    deadline,
    isCompleted: is_completed,
    imageName: activitie_image_name,
    imageUrl: activitie_image_url,
    activity: {
      id: activity.id,
      name: activity.name,
      description: activity.description,
    },
    isLate: is_late,
    managerScore: manager_note,
    managerComment: manager_comments,
    shiftManagerScore: shift_manager_note,
    shiftManagerComment: shift_manager_comments,
    score: note,
    date: date_completed,
    attendance: {
      id: assistance.id,
      status: assistance.status,
      date: assistance.date_assistance,
      imageName: assistance.assistance_image_name,
      imageUrl: assistance.assistance_image_url,
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
        email: assistance.taken_employee.email,
        username: assistance.taken_employee.username,
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
        email: assistance.employee.email,
        username: assistance.employee.username,
      },
    },
  };
}
