import { CreateJobRoleDto } from "./create-job-role.dto";

export interface IUpdateJobRoleRequest {
  body: Partial<CreateJobRoleDto>;
  params: { id: number };
}
