import { FindOptions, Op } from "sequelize";

import {
  CreateManagersDto,
  CreateTeamDto,
  IGetStoresParams,
  TeamDatasource,
  TeamEntity,
  TeamUserEntity,
} from "../../domain";
import { PaginatedResponse, Paginator } from "../../shared";

import Team from "../database/models/team.model";
import User from "../database/models/user.model";
import Shift from "../database/models/shift.model";
import TeamUser from "../database/models/team-user.model";
import TeamManager from "../database/models/team-manager.model";
import ShiftSchedule from "../database/models/shift-schedule.model";
import UserShiftSchedule from "../database/models/user-shift-schedule.model";

export class TeamDatasourceImpl implements TeamDatasource {
  private paginator: Paginator<Team>;

  constructor() {
    this.paginator = new Paginator(Team);
  }

  async assignManager(data: CreateManagersDto): Promise<void> {
    await TeamManager.create(data);
  }

  async assignUser(team_id: number, user_id: number): Promise<void> {
    await TeamUser.create({ team_id, user_id });
  }

  async assignUsersBulk(data: { team_id: number; user_id: number }[]): Promise<TeamUserEntity[]> {
    const teamUsers = await TeamUser.bulkCreate(data, { returning: true });

    return teamUsers.map(TeamUserEntity.fromObject);
  }

  async create(data: CreateTeamDto): Promise<TeamEntity> {
    const team = await Team.create(data);

    return team;
  }

  async delete(id: number): Promise<void> {
    await Team.destroy({ where: { id } });
  }

  async deleteManager(team_id: number, user_id: number): Promise<void> {
    await TeamManager.destroy({ where: { team_id, user_id } });
  }

  async deleteUser(team_id: number, user_id: number): Promise<void> {
    await TeamUser.destroy({ where: { team_id, user_id } });
  }

  async findAll({ limit, page, where }: IGetStoresParams): Promise<PaginatedResponse<TeamEntity>> {
    const optionsQuery: FindOptions = {
      attributes: ["id", "code", "name", "is_active"],
      include: [
        {
          as: "shift",
          attributes: ["id", "name"],
          include: [
            {
              as: "schedules",
              attributes: ["id", "day", "start_time", "end_time"],
              order: [["week_day", "ASC"]],
              model: ShiftSchedule,
            },
          ],
          model: Shift,
        },
        {
          as: "managers",
          attributes: ["id", "names", "last_names", "email", "avatar_url"],
          through: {
            as: "manager_info",
            attributes: ["is_main_manager", "start_date", "end_date"],
          },
          model: User,
        },
        {
          as: "users",
          attributes: ["id", "names", "last_names", "email"],
          through: { as: "user_info", attributes: ["is_active"] },
          model: User,
        },
      ],
      order: [
        ["id", "DESC"],
        ["is_active", "DESC"],
      ],
      where,
    };

    const paginatedResult = await this.paginator.paginate({
      options: optionsQuery,
      page,
      limit,
    });

    const data = paginatedResult.data.map((t) => TeamEntity.fromObject(t.dataValues));

    const total_active_teams = data.filter((team) => team.is_active).length;

    return {
      ...paginatedResult,
      total_active_teams,
      data,
    };
  }

  async findAllActivesByStore(is_active: boolean, store_id: number): Promise<TeamEntity[]> {
    const teams = await Team.findAll({
      attributes: ["id", "code", "name", "is_active"],
      include: [
        {
          as: "shift",
          attributes: ["id", "name"],
          include: [
            {
              as: "schedules",
              attributes: ["id", "day", "start_time", "end_time", "week_day"],
              order: [["week_day", "ASC"]],
              model: ShiftSchedule,
            },
          ],
          model: Shift,
        },
        {
          as: "managers",
          attributes: ["id", "names", "last_names", "email", "avatar_url"],
          through: {
            as: "manager_info",
            attributes: ["is_main_manager", "start_date", "end_date"],
          },
          model: User,
        },
        {
          as: "users",
          attributes: ["id", "names", "last_names", "email", "avatar_url"],
          through: { attributes: [] },
          include: [
            {
              as: "schedules",
              attributes: ["id", "week_day"],
              through: { attributes: [] },
              model: ShiftSchedule,
            },
          ],
          model: User,
        },
      ],
      order: [["id", "DESC"]],
      where: { is_active, store_id },
    });

    return teams.map(TeamEntity.fromObject);
  }

  async findByCode(code: string): Promise<TeamEntity | null> {
    const team = await Team.findOne({
      attributes: ["id", "code", "name", "is_active"],
      include: [
        {
          as: "shift",
          attributes: ["id", "name"],
          include: [
            {
              as: "schedules",
              attributes: ["id", "day", "start_time", "end_time"],
              order: [["week_day", "ASC"]],
              model: ShiftSchedule,
            },
          ],
          model: Shift,
        },
        {
          as: "managers",
          attributes: ["id", "names", "last_names", "email", "avatar_url"],
          through: {
            as: "manager_info",
            attributes: ["is_main_manager", "start_date", "end_date"],
          },
          model: User,
        },
        {
          as: "users",
          attributes: ["id", "names", "last_names", "email", "avatar_url"],
          through: { attributes: [] },
          model: User,
        },
      ],
      where: { code },
    });

    return team ? TeamEntity.fromObject(team) : null;
  }

  async findById(id: number): Promise<TeamEntity | null> {
    const team = await Team.findOne({
      attributes: ["id", "code", "name", "is_active"],
      include: [
        {
          as: "shift",
          attributes: ["id", "name"],
          include: [
            {
              as: "schedules",
              attributes: ["id", "day", "start_time", "end_time", "week_day"],
              order: [["week_day", "ASC"]],
              model: ShiftSchedule,
            },
          ],
          model: Shift,
        },
        {
          as: "managers",
          attributes: ["id", "names", "last_names", "email", "avatar_url"],
          through: {
            as: "manager_info",
            attributes: ["is_main_manager", "start_date", "end_date"],
          },
          model: User,
        },
        {
          as: "users",
          attributes: ["id", "names", "last_names", "email", "avatar_url"],
          include: [
            {
              as: "schedules",
              attributes: ["id", "day", "start_time", "end_time", "week_day"],
              through: { attributes: [] },
              model: ShiftSchedule,
            },
          ],
          through: { attributes: [] },
          model: User,
        },
      ],
      where: { id },
    });

    return team ? TeamEntity.fromObject(team) : null;
  }

  async findByActiveShift(shift_id: number): Promise<TeamEntity | null> {
    const team = await Team.findOne({
      attributes: ["id", "code", "name", "is_active"],
      include: [
        {
          as: "shift",
          attributes: ["id", "name"],
          model: Shift,
        },
        {
          as: "users",
          attributes: ["id", "names", "last_names", "email"],
          through: { attributes: [] },
          model: User,
        },
        {
          as: "managers",
          attributes: ["id"],
          through: { attributes: [] },
          model: User,
        },
      ],
      where: { shift_id, is_active: true },
    });

    return team ? TeamEntity.fromObject(team) : null;
  }

  async findUserTeam(user_id: number): Promise<TeamUserEntity | null> {
    const userTeam = await TeamUser.findOne({
      attributes: ["team_id", "user_id", "is_active"],
      include: [{ as: "team", attributes: ["is_active"], model: Team }],
      where: { user_id },
    });

    return userTeam ? TeamUserEntity.fromObject(userTeam) : null;
  }

  async update(id: number, data: Partial<CreateTeamDto>): Promise<void> {
    await Team.update(data, { where: { id } });
  }

  async updateManager(user_id: number, data: Partial<CreateManagersDto>): Promise<void> {
    await TeamManager.update(data, { where: { user_id } });
  }

  async unassignUser(user_id: number, team_id: number): Promise<void> {
    await TeamUser.update({ is_active: false }, { where: { user_id, team_id } });
  }

  async userHasActiveTeam(user_id: number, team_id: number): Promise<boolean> {
    const team = await Team.findOne({
      include: [{ as: "assigned_shifts", model: UserShiftSchedule, where: { user_id } }],
      where: { is_active: true, id: { [Op.not]: team_id } },
    });

    return !!team;
  }
}
