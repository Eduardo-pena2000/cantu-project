import { AssigmentActivitieDto, CreateActivitieDto } from "./create-activitie.dto";

export interface IUpdateActivitieRequest {
  body: Partial<CreateActivitieDto>;
  params: { id: number };
}

export interface IUpdateAssignedActivitieRequest {
  body: Partial<AssigmentActivitieDto>;
  params: { id: number };
}
