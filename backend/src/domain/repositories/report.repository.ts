import { PaginatedResponse } from "../../shared";
import { ActivityReportQueryFilter } from "../dtos";
import { ActivitieAssignmentEntity, TeamEntity, UserEntity } from "../entities";

export abstract class ReportRepository {
  abstract findTeams(filters: ActivityReportQueryFilter): Promise<TeamEntity[]>;
  abstract findUsersByTeam(filters: ActivityReportQueryFilter): Promise<PaginatedResponse<UserEntity>>;
  abstract findDetailsActivitiesByUser(
    filters: ActivityReportQueryFilter
  ): Promise<PaginatedResponse<ActivitieAssignmentEntity>>;
}
