import {
  CreateManagersDto,
  createSchedulesDto,
  CreateShiftDto,
  IGetShiftsParams,
  ShiftDatasource,
  ShiftEntity,
  ShiftRepository,
  ShiftScheduleEntity,
} from "../../domain";
import { PaginatedResponse } from "../../shared";

export class ShiftRepositoryImpl implements ShiftRepository {
  constructor(private readonly datasource: ShiftDatasource) {}

  async assignScheduleToUser(user_id: number, schedule_id: number, team_id: number): Promise<void> {
    return await this.datasource.assignScheduleToUser(user_id, schedule_id, team_id);
  }

  async assignScheduleToUsersBulk(data: { user_id: number; schedule_id: number; team_id: number }[]): Promise<void> {
    return await this.datasource.assignScheduleToUsersBulk(data);
  }

  async create(data: CreateShiftDto): Promise<ShiftEntity> {
    return await this.datasource.create(data);
  }

  async createSchedule(data: createSchedulesDto): Promise<void> {
    return await this.datasource.createSchedule(data);
  }

  async delete(id: number): Promise<void> {
    return await this.datasource.delete(id);
  }

  async deleteUserSchedule(user_id: number): Promise<void> {
    return await this.datasource.deleteUserSchedule(user_id);
  }

  async deleteShiftSchedules(): Promise<void> {
    return await this.datasource.deleteShiftSchedules();
  }

  async deleteUserSchedulesByTeam(user_id: number, schedule_id: number, team_id: number): Promise<void> {
    return await this.datasource.deleteUserSchedulesByTeam(user_id, schedule_id, team_id);
  }

  async deleteSchedule(id: number): Promise<void> {
    return await this.datasource.deleteSchedule(id);
  }

  async findAll(params: IGetShiftsParams): Promise<PaginatedResponse<ShiftEntity>> {
    return await this.datasource.findAll(params);
  }

  async findAllSchedules(store_id: number): Promise<ShiftScheduleEntity[]> {
    return await this.datasource.findAllSchedules(store_id);
  }

  async findById(id: number): Promise<ShiftEntity | null> {
    return await this.datasource.findById(id);
  }

  async findUserSchedules(user_id: number): Promise<any[]> {
    return await this.datasource.findUserSchedules(user_id);
  }

  async update(id: number, data: Partial<CreateShiftDto>): Promise<void> {
    return await this.datasource.update(id, data);
  }

  async updateSchedule(id: number, data: Partial<createSchedulesDto>): Promise<void> {
    return await this.datasource.updateSchedule(id, data);
  }
}
