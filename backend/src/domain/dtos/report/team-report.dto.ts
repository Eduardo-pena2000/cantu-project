import { GetActivityReportRequestDto } from "./filters-report-activities.dto";

export type StatusActivity = "completed" | "pending" | "delayed";

export interface IGetTeamsReportRequest {
  query: GetActivityReportRequestDto;
}
