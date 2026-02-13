import {
  CreateManagersDto,
  CreateTeamDto,
  IGetTeamsParams,
  TeamDatasource,
  TeamEntity,
  TeamRepository,
  TeamUserEntity,
} from "../../domain";
import { PaginatedResponse } from "../../shared";

export class TeamRepositoryImpl implements TeamRepository {
  constructor(private readonly datasource: TeamDatasource) {}

  async assignManager(data: CreateManagersDto): Promise<void> {
    return await this.datasource.assignManager(data);
  }

  async assignUser(team_id: number, user_id: number): Promise<void> {
    return await this.datasource.assignUser(team_id, user_id);
  }

  async assignUsersBulk(data: { team_id: number; user_id: number }[]): Promise<TeamUserEntity[]> {
    return this.datasource.assignUsersBulk(data);
  }

  async create(data: CreateTeamDto): Promise<TeamEntity> {
    return await this.datasource.create(data);
  }

  async delete(id: number): Promise<void> {
    return await this.datasource.delete(id);
  }

  async deleteManager(team_id: number, user_id: number): Promise<void> {
    return await this.datasource.deleteManager(team_id, user_id);
  }

  async deleteUser(team_id: number, user_id: number): Promise<void> {
    return await this.datasource.deleteUser(team_id, user_id);
  }

  async findAll(params: IGetTeamsParams): Promise<PaginatedResponse<TeamEntity>> {
    return await this.datasource.findAll(params);
  }

  async findAllActivesByStore(is_active: boolean, store_id: number): Promise<TeamEntity[]> {
    return await this.datasource.findAllActivesByStore(is_active, store_id);
  }

  async findByCode(code: string): Promise<TeamEntity | null> {
    return await this.datasource.findByCode(code);
  }

  async findById(id: number): Promise<TeamEntity | null> {
    return await this.datasource.findById(id);
  }

  async findByActiveShift(shift_id: number): Promise<TeamEntity | null> {
    return await this.datasource.findByActiveShift(shift_id);
  }

  async findUserTeam(user_id: number): Promise<TeamUserEntity | null> {
    return await this.datasource.findUserTeam(user_id);
  }

  async update(id: number, data: Partial<CreateTeamDto>): Promise<void> {
    return await this.datasource.update(id, data);
  }

  async updateManager(user_id: number, data: Partial<CreateManagersDto>): Promise<void> {
    return await this.datasource.updateManager(user_id, data);
  }

  async unassignUser(user_id: number, team_id: number): Promise<void> {
    return await this.datasource.unassignUser(user_id, team_id);
  }

  async userHasActiveTeam(user_id: number, team_id: number): Promise<boolean> {
    return await this.datasource.userHasActiveTeam(user_id, team_id);
  }
}
