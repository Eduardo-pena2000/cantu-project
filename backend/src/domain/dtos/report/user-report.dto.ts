import { GetActivityReportRequestDto } from "./filters-report-activities.dto";

export interface IGetUsersReportRequest {
  params: { id: number };
  query: GetActivityReportRequestDto;
}
