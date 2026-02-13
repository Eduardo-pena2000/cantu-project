export interface CreateShiftDto {
  name: string;
  store_id: number;
  schedules?: createSchedulesDto[];
}

export interface createSchedulesDto {
  id?: number;
  day: string;
  week_day: number;
  is_weekend: boolean;
  start_time: string;
  end_time: string;
  shift_id: number;
}

export interface ICreateShiftRequest {
  body: CreateShiftDto;
}
