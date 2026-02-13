export function jobRoleDto({ id, name, code, created_at }) {
  return {
    id,
    name,
    code,
    createdAt: created_at,
  };
}
