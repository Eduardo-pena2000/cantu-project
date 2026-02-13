import { CreateTeamDto } from "./create-team.dto";

export interface IUpdateTeamRequest {
  body: Partial<CreateTeamDto>;
  params: { id: number };
}

export interface IRotateTeamsRequest {
  body: { store_id: number };
}
