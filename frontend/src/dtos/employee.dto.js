import { getUserFullName, getUserShortFullName } from "@/utils";

export function employeeDto({
  id,
  avatar_url,
  names,
  last_names,
  username,
  email,
  phone,
  last_login,
  is_active,
  store,
  roles,
  areas,
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
    phone,
    lastLogin: last_login
      ? new Date(last_login).toLocaleDateString("es-MX", {
          weekday: "short",
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : null,
    isActive: is_active,
    store: store ? { id: store.id, name: store.name, code: store.code } : null,
    roles: roles.map((role) => ({ id: role.id, name: role.name })),
    areas: areas.map((area) => ({ id: area.id, name: area.name, code: area.code })),
  };
}
