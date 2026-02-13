import { getUserFullName, getUserShortFullName } from "@/utils";

export function scheduleEmployeeDto({ id, avatar_url, names, last_names, username, email }) {
  return {
    id,
    image: avatar_url ?? null,
    names,
    lastNames: last_names,
    fullName: getUserFullName(names, last_names),
    shortFullName: getUserShortFullName(names, last_names),
    username,
    email,
  };
}
