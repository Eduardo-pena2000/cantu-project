import { getUserFullName, getUserShortFullName } from "@/utils";

export function areaDto({ id, name, code, manager }) {
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
  };
}
