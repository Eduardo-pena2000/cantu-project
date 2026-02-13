import { literal, Op } from "sequelize";

import { AssistanceDatasource, AssistanceEntity, CreateAssistanceDto } from "../../domain";

import Assistance from "../database/models/assistence.model";

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
}
