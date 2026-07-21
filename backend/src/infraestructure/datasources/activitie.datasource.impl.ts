import { FindOptions, Op, Sequelize } from "sequelize";

import {
  ActivitieAssignmentEntity,
  ActivitieDatasource,
  ActivitieEntity,
  AssigmentActivitieDto,
  BulkAssignmentActivitieDto,
  CreateActivitieDto,
  IGetActivitiesParams,
  QualifyActivitieDto,
} from "../../domain";
import { PaginatedResponse, Paginator } from "../../shared";

import { SequelizeDatabase } from "../database/sequelize";
import Activitie from "../database/models/activitie.model";
import Area from "../database/models/area.model";
import User from "../database/models/user.model";
import JobRole from "../database/models/job-role.model";
import ActivityAssignment from "../database/models/activity-assignment.model";
import Assistance from "../database/models/assistence.model";
import UserDevice from "../database/models/user-device.model";

export class ActivitieDatasourceImpl implements ActivitieDatasource {
  private paginator: Paginator<Activitie>;

  constructor() {
    this.paginator = new Paginator(Activitie);
  }

  async assignment(data: AssigmentActivitieDto): Promise<ActivitieAssignmentEntity> {
    const assignment = await ActivityAssignment.create(data);

    return ActivitieAssignmentEntity.fromObject(assignment);
  }

  async bulkAssignment(data: BulkAssignmentActivitieDto): Promise<ActivitieAssignmentEntity[]> {
    const { assistance_id, assignments } = data;
    const sequelize = SequelizeDatabase.getSequelizeInstance();

    const activityIds = assignments.map((a) => a.activitie_id);

    // Find already-assigned activity ids for this assistance today to avoid duplicates
    const existing = await ActivityAssignment.findAll({
      attributes: ["activitie_id"],
      where: {
        assistance_id,
        activitie_id: { [Op.in]: activityIds },
      },
    });

    const existingIds = new Set(existing.map((e) => (e as any).activitie_id));
    const newAssignments = assignments.filter((a) => !existingIds.has(a.activitie_id));

    const createdIds: number[] = [];

    if (newAssignments.length > 0) {
      await sequelize.transaction(async (t) => {
        const records = newAssignments.map((a) => ({
          assistance_id,
          activitie_id: a.activitie_id,
          deadline: a.deadline,
          is_completed: false,
        }));

        const created = await ActivityAssignment.bulkCreate(records, { transaction: t });
        created.forEach((c) => createdIds.push((c as any).id));
      });
    }

    // Fetch full entities for all newly created assignments
    const results: ActivitieAssignmentEntity[] = [];
    for (const id of createdIds) {
      const found = await this.findAssignedActivitieById(id);
      if (found) results.push(found);
    }

    return results;
  }

  async create(data: CreateActivitieDto): Promise<ActivitieEntity> {
    const activitie = await Activitie.create(data);

    return ActivitieEntity.fromObject(activitie);
  }

  async delete(id: number): Promise<void> {
    await Activitie.destroy({ where: { id } });
  }

  async deleteAssignedActivity(id: number): Promise<void> {
    await ActivityAssignment.destroy({ where: { id } });
  }

  async findAll({ limit, page, where }: IGetActivitiesParams): Promise<PaginatedResponse<ActivitieEntity>> {
    const optionsQuery: FindOptions = {
      attributes: ["id", "name", "description", "createdAt"],
      include: [
        {
          as: "area",
          attributes: ["id", "name", "code"],
          model: Area,
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

    const data = paginatedResult.data.map(ActivitieEntity.fromObject);

    return {
      ...paginatedResult,
      data,
    };
  }

  async findAllByArea({ limit, page, where }: IGetActivitiesParams): Promise<PaginatedResponse<ActivitieEntity>> {
    const optionsQuery: FindOptions = {
      attributes: ["id", "name", "description"],
      where,
    };

    const paginatedResult = await this.paginator.paginate({
      options: optionsQuery,
      page,
      limit,
    });

    const data = paginatedResult.data.map(ActivitieEntity.fromObject);

    return {
      ...paginatedResult,
      data,
    };
  }

  async findById(id: number): Promise<ActivitieEntity | null> {
    const activitie = await Activitie.findOne({
      attributes: ["id", "name", "description", "createdAt"],
      include: [
        {
          as: "job_role",
          attributes: ["id", "name", "code"],
          model: JobRole,
        },
        {
          as: "area",
          attributes: ["id", "name", "code"],
          model: Area,
          include: [
            {
              as: "manager",
              attributes: ["id", "names", "last_names", "email", "username", "avatar_url"],
              model: User,
            },
          ],
        },
      ],
      where: { id },
    });

    return activitie ? ActivitieEntity.fromObject(activitie) : null;
  }

  async findAssignedActivitieById(id: number): Promise<ActivitieAssignmentEntity | null> {
    const assignment = await ActivityAssignment.findOne({
      attributes: [
        "id",
        "deadline",
        "manager_note",
        "shift_manager_note",
        "date_completed",
        "is_completed",
        "note",
        "manager_comments",
        "shift_manager_comments",
        "is_late",
        "activitie_image_name",
        "activitie_image_url",
      ],
      include: [
        { as: "activity", attributes: ["id", "name", "description"], model: Activitie },
        {
          as: "assistance",
          attributes: ["id", "status", "date_assistance", "assistance_image_name", "assistance_image_url"],
          include: [
            {
              as: "taken_employee",
              attributes: ["id", "names", "last_names", "email", "username", "avatar_url"],
              include: [{ as: "devices_tokens", attributes: ["token"], model: UserDevice }],
              model: User,
            },
            {
              as: "employee",
              attributes: ["id", "names", "last_names", "email", "username", "avatar_url"],
              model: User,
            },
          ],
          model: Assistance,
        },
      ],
      where: { id },
    });

    return assignment ? ActivitieAssignmentEntity.fromObject(assignment.dataValues) : null;
  }

  async qualify(data: QualifyActivitieDto): Promise<void> {
    await ActivityAssignment.update(data, { where: { id: data.assignment_activitie_id }, individualHooks: true });
  }

  async update(id: number, data: Partial<CreateActivitieDto>): Promise<void> {
    await Activitie.update(data, { where: { id } });
  }

  async updateAssignedActivitie(id: number, data: Partial<AssigmentActivitieDto>): Promise<ActivitieAssignmentEntity> {
    const [_, [updatedAssignment]] = await ActivityAssignment.update(data, {
      returning: true,
      where: { id },
    });

    return ActivitieAssignmentEntity.fromObject(updatedAssignment);
  }
}
