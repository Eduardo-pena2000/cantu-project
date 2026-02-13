import { PaginatedResponse } from "../../shared";

import { CreateManagersDto, CreateTeamDto, IGetTeamsParams } from "../dtos";
import { TeamEntity, TeamUserEntity } from "../entities";

export abstract class TeamDatasource {
  abstract assignManager(data: CreateManagersDto): Promise<void>;
  abstract assignUser(team_id: number, user_id: number): Promise<void>;
  abstract assignUsersBulk(data: { team_id: number; user_id: number }[]): Promise<TeamUserEntity[]>;
  abstract create(data: CreateTeamDto): Promise<TeamEntity>;
  abstract delete(id: number): Promise<void>;
  abstract deleteManager(team_id: number, user_id: number): Promise<void>;
  abstract deleteUser(team_id: number, user_id: number): Promise<void>;
  abstract findAll(params: IGetTeamsParams): Promise<PaginatedResponse<TeamEntity>>;
  abstract findAllActivesByStore(is_active: boolean, store_id: number): Promise<TeamEntity[]>;
  abstract findByCode(code: string): Promise<TeamEntity | null>;
  abstract findById(id: number): Promise<TeamEntity | null>;
  abstract findByActiveShift(shift_id: number): Promise<TeamEntity | null>;
  abstract findUserTeam(user_id: number): Promise<TeamUserEntity | null>;
  abstract update(id: number, data: Partial<CreateTeamDto>): Promise<void>;
  abstract updateManager(user_id: number, data: Partial<CreateManagersDto>): Promise<void>;
  abstract unassignUser(user_id: number, team_id: number): Promise<void>;
  abstract userHasActiveTeam(user_id: number, team_id: number): Promise<boolean>;
}
