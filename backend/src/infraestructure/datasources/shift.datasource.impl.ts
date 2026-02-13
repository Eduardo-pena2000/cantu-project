import { FindOptions, Sequelize } from "sequelize";

import {
  createSchedulesDto,
  CreateShiftDto,
  IGetShiftsParams,
  ShiftDatasource,
  ShiftEntity,
  ShiftScheduleEntity,
} from "../../domain";
import { PaginatedResponse, Paginator } from "../../shared";

import ShiftSchedule from "../database/models/shift-schedule.model";
import Shift from "../database/models/shift.model";
import UserShiftSchedule from "../database/models/user-shift-schedule.model";

export class ShiftDatasourceImpl implements ShiftDatasource {
  private paginator: Paginator<Shift>;

  constructor() {
    this.paginator = new Paginator(Shift);
  }

  async assignScheduleToUser(user_id: number, schedule_id: number, team_id: number): Promise<void> {
    await UserShiftSchedule.create({ user_id, schedule_id, team_id });
  }

  async assignScheduleToUsersBulk(data: { user_id: number; schedule_id: number; team_id: number }[]): Promise<void> {
    await UserShiftSchedule.bulkCreate(data);
  }

  async create(data: CreateShiftDto): Promise<ShiftEntity> {
    const shift = await Shift.create(data);

    return ShiftEntity.fromObject(shift);
  }

  async createSchedule(data: createSchedulesDto): Promise<void> {
    await ShiftSchedule.create(data);
  }

  async delete(id: number): Promise<void> {
    await Shift.destroy({ where: { id } });
  }

  async deleteUserSchedule(user_id: number): Promise<void> {
    await UserShiftSchedule.destroy({ where: { user_id } });
  }

  async deleteShiftSchedules(): Promise<void> {
    await UserShiftSchedule.destroy({ where: {} });
  }

  async deleteUserSchedulesByTeam(user_id: number, schedule_id: number, team_id: number): Promise<void> {
    await UserShiftSchedule.destroy({ where: { user_id, schedule_id, team_id } });
  }

  async deleteSchedule(id: number): Promise<void> {
    await ShiftSchedule.destroy({ where: { id } });
  }

  async findAll({ limit = 10, page = 1, where }: IGetShiftsParams): Promise<PaginatedResponse<ShiftEntity>> {
    const optionsQuery: FindOptions = {
      attributes: ["id", "name"],
      include: [
        {
          as: "schedules",
          attributes: ["id", "day", "week_day", "is_weekend", "start_time", "end_time"],
          model: ShiftSchedule,
        },
      ],
      order: [["id", "DESC"]],
      where,
    };

    const paginatedResult = await this.paginator.paginate({
      options: optionsQuery,
      page,
      limit,
    });

    const data = paginatedResult.data.map(ShiftEntity.fromObject);

    return {
      ...paginatedResult,
      data,
    };
  }

  async findAllSchedules(store_id: number): Promise<ShiftScheduleEntity[]> {
    const schedules = await ShiftSchedule.findAll({
      attributes: ["id", "day", "week_day", "is_weekend", "start_time", "end_time"],
      include: [
        {
          as: "shift",
          attributes: [
            "id",
            "name",
            [
              Sequelize.literal(`(
                SELECT json_build_object(
                  'id', "t"."id",
                  'name', "t"."name"
                )
                FROM "teams" AS "t"
                WHERE "t"."shift_id" = "shift"."id"
                  AND "t"."is_active" = true
                LIMIT 1
              )`),
              "team",
            ],
          ],
          model: Shift,
          where: { store_id },
        },
      ],
    });

    return schedules.map(ShiftScheduleEntity.fromObject);
  }

  async findById(id: number): Promise<ShiftEntity | null> {
    const shift = await Shift.findOne({
      attributes: ["id", "name"],
      include: [
        {
          as: "schedules",
          attributes: ["id", "day", "week_day", "is_weekend", "start_time", "end_time"],
          model: ShiftSchedule,
        },
      ],
      where: { id },
    });

    return shift ? ShiftEntity.fromObject(shift) : null;
  }

  async findUserSchedules(user_id: number): Promise<any[]> {
    const schedules = await UserShiftSchedule.findAll({
      attributes: ["schedule_id"],
      where: { user_id },
    });

    return schedules;
  }

  async update(id: number, data: Partial<CreateShiftDto>): Promise<void> {
    await Shift.update(data, { where: { id } });
  }

  async updateSchedule(id: number, data: Partial<createSchedulesDto>): Promise<void> {
    await ShiftSchedule.update(data, { where: { id } });
  }
}
