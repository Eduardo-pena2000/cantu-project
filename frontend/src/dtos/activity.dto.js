import { areaDto } from "./area.dto";

export function activityDto({ id, name, description, area, job_role, created_at }) {
  return {
    id,
    name,
    description,
    jobRole: job_role ? { id: job_role.id, name: job_role.name, code: job_role.code } : undefined,
    area: area ? areaDto(area) : null,
    createdAt: created_at,
  };
}

export function areaActivityDto({ id, name, description }) {
  return {
    id,
    name,
    description,
  };
}
