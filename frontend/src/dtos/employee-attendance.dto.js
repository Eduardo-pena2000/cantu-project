import { getUserFullName, getUserShortFullName } from "@/utils";

export function employeeAttendanceDto({
  id,
  avatar_url,
  names,
  last_names,
  username,
  email,
  areas,
  assistance,
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
    areas: areas.map((area) => ({ id: area.id, name: area.name, code: area.code })),
    attendance: {
      id: assistance.id,
      status: assistance.status,
      date: assistance.date_assistance,
      activities: assistance.activities_asigments,
    },
  };
}
