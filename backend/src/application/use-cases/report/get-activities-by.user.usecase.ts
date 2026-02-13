import { ReportRepository, IGetUsersReportRequest, ActivitieAssignmentEntity } from "../../../domain";
import { ensureDateRangeBoundaries, normalizeCompletationStatus, PaginatedResponse } from "../../../shared";

export class GetActivitiesByUserReportUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(request: IGetUsersReportRequest): Promise<PaginatedResponse<ActivitieAssignmentEntity>> {
    let {
      params: { id: user_id },
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

    const stores = await this.reportRepository.findDetailsActivitiesByUser({
      end_date: endDate,
      start_date: startDate,
      store_id,
      area_id,
      is_completed,
      is_late,
      limit,
      page,
      user_id,
      order,
    });

    return stores;
  }
}
