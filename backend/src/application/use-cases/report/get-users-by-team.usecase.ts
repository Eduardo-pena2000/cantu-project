import { ReportRepository, IGetUsersReportRequest, UserEntity } from "../../../domain";
import { ensureDateRangeBoundaries, normalizeCompletationStatus, PaginatedResponse } from "../../../shared";

export class GetUsersByTeamReportUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(request: IGetUsersReportRequest): Promise<PaginatedResponse<UserEntity>> {
    let {
      params: { id: team_id },
      query: {
        end_date: endDate,
        start_date: startDate,
        store_id,
        area_id,
        status,
        limit = 10,
        page = 1,
        order = "desc",
      },
    } = request;

    const { end_date, start_date } = ensureDateRangeBoundaries(startDate, endDate);

    startDate = start_date;
    endDate = end_date;

    const { is_completed, is_late } = normalizeCompletationStatus(status);

    const stores = await this.reportRepository.findUsersByTeam({
      end_date: endDate,
      start_date: startDate,
      store_id,
      area_id,
      is_completed,
      is_late,
      limit,
      page,
      team_id,
      order,
    });

    stores.data = stores.data.sort((a: any, b: any) => {
      const getStateValue = (user: any) => {
        if (user.assigned_activities === 0) return 1;

        if (user.assigned_activities > 0 && user.avg_note === 0) return 2;

        return 3;
      };

      const aState = getStateValue(a);

      const bState = getStateValue(b);

      const compareMultiplier = order === "asc" ? 1 : -1;

      if (aState !== bState) {
        return (aState - bState) * compareMultiplier;
      }

      if (a.avg_note > 0 && b.avg_note > 0) {
        return (a.avg_note - b.avg_note) * compareMultiplier;
      }

      return (a.assigned_activities - b.assigned_activities) * compareMultiplier;
    });

    return stores;
  }
}
