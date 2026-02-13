import { IGetTeamsReportRequest, TeamEntity, ReportRepository } from "../../../domain";
import { ensureDateRangeBoundaries, normalizeCompletationStatus } from "../../../shared";

export class GetTeamsReportUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(request: IGetTeamsReportRequest): Promise<TeamEntity[]> {
    let {
      query: { end_date: endDate, start_date: startDate, store_id, area_id, status, order = "desc" },
    } = request;

    const { end_date, start_date } = ensureDateRangeBoundaries(startDate, endDate);

    startDate = start_date;
    endDate = end_date;

    const { is_completed } = normalizeCompletationStatus(status);

    const stores = await this.reportRepository.findTeams({
      end_date: endDate,
      start_date: startDate,
      store_id,
      area_id,
      is_completed,
      order,
    });

    return stores;
  }
}
