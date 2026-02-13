export interface CreateActivitieDto {
  name: string;
  description: string;
  area_id: number;
  job_role_id: number;
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
