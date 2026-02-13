export interface CreateJobRoleDto {
  name: string;
  store_id: number;
}

export interface ICreateJobRoleRequest {
  body: CreateJobRoleDto;
}
