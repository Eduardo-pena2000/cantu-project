import { getUserFullName, getUserShortFullName } from "@/utils";

export function areaDto({ id, name, code, manager, users }) {
  return {
    id,
    name,
    code,
    manager: manager
      ? {
        id: manager.id,
        image: manager.avatar_url ?? null,
        names: manager.names,
        last_names: manager.last_names,
        fullName: getUserFullName(manager.names, manager.last_names),
        shortFullName: getUserShortFullName(manager.names, manager.last_names),
        email: manager.email,
        username: manager.username,
      }
      : null,
    employees: Array.isArray(users)
      ? users.map((user) => ({
        id: user.id,
        image: user.avatar_url ?? null,
        names: user.names,
        last_names: user.last_names,
        fullName: getUserFullName(user.names, user.last_names),
        shortFullName: getUserShortFullName(user.names, user.last_names),
        email: user.email,
        username: user.username,
      }))
      : [],
  };
}
