import { FindOptions } from "sequelize";

export interface PaginatedResponse<T> {
  last_page: number;
  total_records: number;
  current_page: number;
  has_more_pages: boolean;
  total_active_teams?: number;
  data: T[];
}

export interface paginateOptions<T> {
  page?: number;
  limit?: number;
  options: FindOptions;
}
