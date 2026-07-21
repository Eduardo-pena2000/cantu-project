export interface CreateActivitieDto {
  name: string;
  description: string;
  area_id: number;
  job_role_id: number;
  default_deadline?: string | null;
}

export interface ICreateActivitieRequest {
  body: CreateActivitieDto;
}

export interface AssigmentActivitieDto {
  assistance_id: number;
  activitie_id: number;
  deadline: string;
}

export interface IAssigmentActivitieRequest {
  body: AssigmentActivitieDto;
}

export interface BulkAssignmentItemDto {
  activitie_id: number;
  deadline: string;
}

export interface BulkAssignmentActivitieDto {
  assistance_id: number;
  assignments: BulkAssignmentItemDto[];
}

export interface IBulkAssignmentActivitieRequest {
  body: BulkAssignmentActivitieDto;
}
