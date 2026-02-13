import { FindOptions, literal, Op, Sequelize, WhereAttributeHash } from "sequelize";

import {
  UserDatasource,
  UserEntity,
  CreateUserDto,
  IGetUsersParams,
  IUpdateUserDto,
  UserDeviceEntity,
} from "../../domain";
import { PaginatedResponse, Paginator, StatusActivities } from "../../shared";

import Area from "../database/models/area.model";
import Role from "../database/models/role.model";
import Store from "../database/models/store.model";
import User from "../database/models/user.model";
import ShiftSchedule from "../database/models/shift-schedule.model";
import UserShiftSchedule from "../database/models/user-shift-schedule.model";
import Assistance from "../database/models/assistence.model";
import ActivityAssignment from "../database/models/activity-assignment.model";
import Activitie from "../database/models/activitie.model";
import Team from "../database/models/team.model";
import UserDevice from "../database/models/user-device.model";

export class UserDatasourceImpl implements UserDatasource {
  private paginator: Paginator<User>;

  constructor() {
    this.paginator = new Paginator(User);
  }

  async create(data: CreateUserDto): Promise<UserEntity> {
    const user = await User.create(data);

    return UserEntity.fromObject(user);
  }

  async createDevice(user_id: number, token: string): Promise<UserDeviceEntity> {
    const device = await UserDevice.create({ user_id, token });

    return UserDeviceEntity.fromObject(device);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);

    await User.destroy({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await User.findOne({
      attributes: [
        "id",
        "names",
        "last_names",
        "email",
        "username",
        "phone",
        "last_login",
        "is_active",
        "password",
        "avatar_url",
        "avatar_name",
        [
          Sequelize.literal(`(
            SELECT CASE
              WHEN COUNT(*) > 0 THEN TRUE
              ELSE FALSE
            END
            FROM "user_devices" AS ud
            WHERE ud."user_id" = "User"."id"
              AND ud."token" IS NOT NULL
          )`),
          "has_device_token",
        ],
      ],
      include: [
        {
          as: "store",
          attributes: ["id", "address", "address_detail", "code", "municipality", "name", "suburb_name", "zip_code"],
          model: Store,
        },
        {
          as: "roles",
          attributes: ["id", "name", "slug"],
          through: { attributes: [] },
          model: Role,
        },
        {
          as: "areas",
          attributes: ["id", "name", "code"],
          through: { attributes: [] },
          model: Area,
        },
        {
          as: "teams",
          attributes: ["id", "name", "code"],
          through: { attributes: [] },
          model: Team,
        },
      ],
      where: { email },
    });

    return user ? UserEntity.fromObject(user.dataValues) : null;
  }

  async findAll({ limit, page, where }: IGetUsersParams): Promise<PaginatedResponse<UserEntity>> {
    const mainWhere = { ...where };

    const roleFilter = mainWhere["$roles.id$"];
    const areaFilter = mainWhere["$areas.id$"];

    delete mainWhere["$roles.id$"];
    delete mainWhere["$areas.id$"];

    const optionsQuery: FindOptions = {
      attributes: [
        "id",
        "names",
        "last_names",
        "email",
        "username",
        "phone",
        "last_login",
        "is_active",
        "avatar_url",
        "avatar_name",
      ],
      include: [
        {
          as: "store",
          attributes: ["id", "address", "address_detail", "code", "municipality", "name", "suburb_name", "zip_code"],
          model: Store,
        },
        {
          as: "roles",
          attributes: ["id", "name", "slug"],
          through: { attributes: [] },
          model: Role,
          ...(roleFilter && { where: { id: roleFilter } }),
          required: !!roleFilter,
        },
        {
          as: "areas",
          attributes: ["id", "name", "code"],
          through: { attributes: [] },
          model: Area,
          ...(areaFilter && { where: { id: areaFilter } }),
          required: !!areaFilter,
        },
        {
          as: "teams",
          attributes: ["id", "name", "code"],
          through: { attributes: [] },
          model: Team,
        },
      ],
      order: [["id", "DESC"]],
      where: mainWhere,
    };

    const paginatedResult = await this.paginator.paginate({
      options: optionsQuery,
      page,
      limit,
    });

    const data = paginatedResult.data.map(UserEntity.fromObject);

    return {
      ...paginatedResult,
      data,
    };
  }

  async findActivitiesForCurrentDay(store_id: number, schedule_id: number): Promise<UserEntity[]> {
    const users = await User.findAll({
      attributes: ["id", "names", "last_names", "email", "username", "avatar_url", "avatar_name"],
      include: [
        {
          as: "assistance",
          attributes: ["id", "date_assistance"],
          include: [
            {
              as: "activities_asigments",
              attributes: ["id", "deadline", "is_completed", "note", "is_late"],
              include: [
                {
                  as: "activity",
                  model: Activitie,
                  attributes: ["id", "name", "description"],
                },
              ],
              model: ActivityAssignment,
            },
          ],
          model: Assistance,
          where: {
            schedule_id,
            [Op.and]: literal(`DATE("assistance"."date_assistance") = CURRENT_DATE`),
            status: StatusActivities.PRESENT,
          },
        },
      ],
      group: [
        "User.id",
        "assistance.id",
        "assistance->activities_asigments.id",
        "assistance->activities_asigments->activity.id",
      ],
      where: { store_id },
    });

    return users.map((user) => UserEntity.fromObject(user.dataValues));
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await User.findOne({
      attributes: [
        "id",
        "names",
        "last_names",
        "email",
        "username",
        "phone",
        "last_login",
        "is_active",
        "avatar_url",
        "avatar_name",
      ],
      include: [
        {
          as: "store",
          attributes: ["id", "address", "address_detail", "code", "municipality", "name", "suburb_name", "zip_code"],
          model: Store,
        },
        {
          as: "roles",
          attributes: ["id", "name", "slug"],
          through: { attributes: [] },
          model: Role,
        },
        {
          as: "areas",
          attributes: ["id", "name", "code"],
          through: { attributes: [] },
          model: Area,
        },
        {
          as: "teams",
          attributes: ["id", "name", "code"],
          through: { attributes: [] },
          model: Team,
        },
        { as: "devices_tokens", attributes: ["id", "token"], model: UserDevice },
      ],
      where: { id },
    });

    return user ? UserEntity.fromObject(user.dataValues) : null;
  }

  async findBySchedule({ limit, page, where }: IGetUsersParams): Promise<PaginatedResponse<UserEntity>> {
    const userScheduleRows = await UserShiftSchedule.findAll({
      attributes: ["user_id"],
      where,
      raw: true,
    });

    const userIds = userScheduleRows.map((row) => row.user_id);

    const optionsQuery: FindOptions = {
      attributes: ["id", "names", "last_names", "email", "username", "avatar_url", "avatar_name"],
      include: [
        {
          as: "schedules",
          attributes: [],
          through: { attributes: [] },
          model: ShiftSchedule,
        },
      ],
      where: { id: { [Op.in]: userIds } },
    };

    const paginatedResult = await this.paginator.paginate({
      options: optionsQuery,
      page,
      limit,
    });

    const data = paginatedResult.data.map(UserEntity.fromObject);

    return {
      ...paginatedResult,
      data,
    };
  }

  async findByScheduleForCurrentDay(schedule_id: number): Promise<UserEntity[]> {
    const users = await User.findAll({
      attributes: ["id", "names", "last_names", "email", "username", "avatar_url", "avatar_name"],
      include: [
        {
          as: "assistance",
          attributes: ["id", "status", "date_assistance"],
          include: [
            {
              as: "activities_asigments",
              attributes: ["id", "deadline"],
              include: [{ as: "activity", attributes: ["id", "name", "description"], model: Activitie }],
              model: ActivityAssignment,
            },
          ],
          model: Assistance,
          where: {
            schedule_id,
            [Op.and]: literal(`DATE("assistance"."date_assistance") = CURRENT_DATE`),
          },
        },
        {
          as: "areas",
          attributes: ["id", "name", "code"],
          through: { attributes: [] },
          model: Area,
        },
      ],
    });

    return users.map(UserEntity.fromObject);
  }

  async findWithoutTeam(store_id: number, team_id: number): Promise<UserEntity[]> {
    const filterIdQuery: WhereAttributeHash = {};

    if (team_id) {
      Object.assign(filterIdQuery, {
        [Op.or]: [
          Sequelize.literal(`id IN (SELECT user_id FROM team_users WHERE team_id = ${team_id})`),
          Sequelize.literal(`id NOT IN (SELECT user_id FROM team_users)`),
        ],
        [Op.notIn]: Sequelize.literal(`(SELECT user_id FROM team_managers)`),
      });
    } else {
      Object.assign(filterIdQuery, {
        [Op.and]: [
          {
            [Op.notIn]: Sequelize.literal(`(
              SELECT tm.user_id 
              FROM team_managers tm
              INNER JOIN teams t ON t.id = tm.team_id
              WHERE t.is_active = true
            )`),
          },
          {
            [Op.notIn]: Sequelize.literal(`(
              SELECT tu.user_id 
              FROM team_users tu
              INNER JOIN teams t ON t.id = tu.team_id
              WHERE t.is_active = true
            )`),
          },
        ],
      });
    }

    const users = await User.findAll({
      attributes: ["id", "names", "last_names", "email", "username", "avatar_url", "avatar_name"],
      where: {
        store_id,
        id: filterIdQuery,
      },
    });

    return users.map(UserEntity.fromObject);
  }

  async update(id: number, data: IUpdateUserDto): Promise<void> {
    await this.findById(id);

    await User.update(data, { where: { id } });
  }
}
