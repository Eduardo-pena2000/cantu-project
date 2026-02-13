import { StatusActivity } from "./team-report.dto";

export interface GetActivityReportRequestDto {
  store_id: number;
  area_id?: number;
  status?: StatusActivity;
  start_date: Date;
  end_date: Date;
  team_id?: number;
  page?: number;
  limit?: number;
  is_late?: boolean;
  order?: string;
}

export interface ActivityReportQueryFilter {
  store_id?: number;
  area_id?: number;
  is_completed?: boolean;
  is_late?: boolean;
  start_date: Date;
  end_date: Date;
  team_id?: number;
  user_id?: number;
  page?: number;
  limit?: number;
  order: string;
}
