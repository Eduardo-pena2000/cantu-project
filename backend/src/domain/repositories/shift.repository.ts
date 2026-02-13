import { PaginatedResponse } from "../../shared";

import { createSchedulesDto, CreateShiftDto, IGetShiftsParams } from "../dtos";
import { ShiftEntity, ShiftScheduleEntity } from "../entities";

export abstract class ShiftRepository {
  abstract assignScheduleToUser(user_id: number, schedule_id: number, team_id: number): Promise<void>;
  abstract assignScheduleToUsersBulk(data: { user_id: number; schedule_id: number; team_id: number }[]): Promise<void>;
  abstract create(data: CreateShiftDto): Promise<ShiftEntity>;
  abstract createSchedule(data: createSchedulesDto): Promise<void>;
  abstract delete(id: number): Promise<void>;
  abstract deleteSchedule(id: number): Promise<void>;
  abstract deleteUserSchedule(user_id: number): Promise<void>;
  abstract deleteShiftSchedules(): Promise<void>;
  abstract deleteUserSchedulesByTeam(user_id: number, schedule_id: number, team_id: number): Promise<void>;
  abstract findAll(params: IGetShiftsParams): Promise<PaginatedResponse<ShiftEntity>>;
  abstract findAllSchedules(store_id: number): Promise<ShiftScheduleEntity[]>;
  abstract findById(id: number): Promise<ShiftEntity | null>;
  abstract findUserSchedules(user_id: number): Promise<any[]>;
  abstract update(id: number, data: Partial<CreateShiftDto>): Promise<void>;
  abstract updateSchedule(id: number, data: Partial<createSchedulesDto>): Promise<void>;
}
