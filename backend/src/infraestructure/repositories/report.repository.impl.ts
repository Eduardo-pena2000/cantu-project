import {
  ActivitieAssignmentEntity,
  ActivityReportQueryFilter,
  ReportDatasource,
  ReportRepository,
  TeamEntity,
  UserEntity,
} from "../../domain";
import { PaginatedResponse } from "../../shared";

export class ReportRepositoryImpl implements ReportRepository {
  constructor(private readonly datasource: ReportDatasource) {}

  async findUsersByTeam(filters: ActivityReportQueryFilter): Promise<PaginatedResponse<UserEntity>> {
    return this.datasource.findUsersByTeam(filters);
  }

  async findTeams(filters: ActivityReportQueryFilter): Promise<TeamEntity[]> {
    return this.datasource.findTeams(filters);
  }

  async findDetailsActivitiesByUser(
    filters: ActivityReportQueryFilter
  ): Promise<PaginatedResponse<ActivitieAssignmentEntity>> {
    return this.datasource.findDetailsActivitiesByUser(filters);
  }
}
