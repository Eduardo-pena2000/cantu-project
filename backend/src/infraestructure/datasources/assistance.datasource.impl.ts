import { literal, Op } from "sequelize";

import {
  AssistanceDatasource,
  AssistanceEntity,
  CreateAssistanceDto,
  GetAssistanceHistoryDto,
} from "../../domain";
import { PaginatedResponse } from "../../shared";
import Assistance from "../database/models/assistence.model";
import User from "../database/models/user.model";
import ActivityAssignment from "../database/models/activity-assignment.model";
import Activitie from "../database/models/activitie.model";
import Role from "../database/models/role.model";
import Area from "../database/models/area.model";

export class AssistanceDatasourceImpl implements AssistanceDatasource {
  async create(dto: CreateAssistanceDto): Promise<AssistanceEntity> {
    const assistance = await Assistance.create(dto);

    return AssistanceEntity.fromObject(assistance);
  }

  async delete(id: number): Promise<void> {
    await Assistance.destroy({ where: { id }, individualHooks: true });
  }

  async findById(id: number): Promise<AssistanceEntity | null> {
    const assistance = await Assistance.findOne({
      attributes: ["id", "status", "date_assistance"],
      where: { id },
    });

    return assistance ? AssistanceEntity.fromObject(assistance) : null;
  }

  async findByUserOnCurrentDay(user_id: number, schedule_id: number): Promise<AssistanceEntity | null> {
    const assistance = await Assistance.findOne({
      where: {
        employee_id: user_id,
        schedule_id,
        [Op.and]: literal(`DATE(date_assistance) = CURRENT_DATE`),
      },
    });

    return assistance ? AssistanceEntity.fromObject(assistance) : null;
  }

  async getHistory(dto: GetAssistanceHistoryDto): Promise<PaginatedResponse<AssistanceEntity>> {
    const { limit, page, date, store_id, name, area_id, role_id } = dto;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (store_id) where.store_id = store_id;
    if (date) {
      where[Op.and] = literal(`DATE(date_assistance) = '${date}'`);
    }

    const userWhere: any = {};
    if (name) {
      userWhere[Op.or] = [
        { names: { [Op.like]: `%${name.trim()}%` } },
        { last_names: { [Op.like]: `%${name.trim()}%` } },
      ];
    }

    const roleInclude: any = { model: Role, as: "roles" };
    if (role_id) {
      roleInclude.where = { id: role_id };
    }

    const areaInclude: any = { model: Area, as: "areas" };
    if (area_id) {
      areaInclude.where = { id: area_id };
    }

    const { rows, count } = await Assistance.findAndCountAll({
      where,
      limit,
      offset,
      order: [["date_assistance", "DESC"]],
      include: [
        {
          model: User,
          as: "employee",
          where: Object.keys(userWhere).length ? userWhere : undefined,
          include: [roleInclude, areaInclude],
        },
        {
          model: ActivityAssignment,
          as: "activities_asigments",
          include: [
            {
              model: Activitie,
              as: "activity",
            },
          ],
        },
      ],
      distinct: true, // important when using findAndCountAll with joins
    });

    const last_page = Math.ceil(count / limit);
    return {
      data: rows.map((r) => AssistanceEntity.fromObject(r)),
      current_page: page,
      total_records: count,
      last_page,
      has_more_pages: page < last_page,
    };
  }
}
