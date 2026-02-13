import { FindOptions, Op, Sequelize } from "sequelize";

import {
  ActivitieAssignmentEntity,
  ActivityReportQueryFilter,
  ReportDatasource,
  TeamEntity,
  UserEntity,
} from "../../domain";
import { PaginatedResponse, Paginator } from "../../shared";

import Assistance from "../database/models/assistence.model";
import Team from "../database/models/team.model";
import User from "../database/models/user.model";
import ActivityAssignment from "../database/models/activity-assignment.model";
import Activitie from "../database/models/activitie.model";

export class ReportDatasourceImpl implements ReportDatasource {
  private user_pagination: Paginator<User>;
  private activity_assigment_pagination: Paginator<ActivityAssignment>;

  constructor() {
    this.user_pagination = new Paginator(User);
    this.activity_assigment_pagination = new Paginator(ActivityAssignment);
  }

  async findUsersByTeam(filters: ActivityReportQueryFilter): Promise<PaginatedResponse<UserEntity>> {
    const { store_id, area_id, start_date, end_date, is_completed, team_id, limit, page, is_late, order } = filters;

    const optionsQuery: FindOptions = {
      attributes: [
        "id",
        "names",
        "last_names",
        "email",
        "username",
        "avatar_url",
        [
          Sequelize.literal(`
            CAST((
                SELECT COUNT(*)
                FROM "activity_assignments" AS "aa"
                INNER JOIN "assistance" AS "a" ON "a"."id" = "aa"."assistance_id"
                WHERE "a"."employee_id" = "User"."id"
                AND "aa"."is_completed" = true
                AND "a"."team_id" = ${team_id}
            ) AS INTEGER)
          `),
          "completed_activities",
        ],
        [
          Sequelize.literal(`
            CAST((
                SELECT COUNT(*)
                FROM "activity_assignments" AS "aa"
                INNER JOIN "assistance" AS "a" ON "a"."id" = "aa"."assistance_id"
                WHERE "a"."employee_id" = "User"."id" 
                AND "aa"."is_completed" = false
                AND "a"."team_id" = ${team_id}
            ) AS INTEGER)
          `),
          "incomplete_activities",
        ],
        [
          Sequelize.literal(`
            CAST((
                SELECT COUNT(*)
                FROM "activity_assignments" AS "aa"
                INNER JOIN "assistance" AS "a" ON "a"."id" = "aa"."assistance_id"
                WHERE "a"."employee_id" = "User"."id"
                AND "a"."team_id" = ${team_id}
            ) AS INTEGER)
          `),
          "assigned_activities",
        ],
        [
          Sequelize.literal(`
            CAST((
                SELECT COUNT(*)
                FROM "activity_assignments" AS "aa"
                INNER JOIN "assistance" AS "a" ON "a"."id" = "aa"."assistance_id"
                WHERE "a"."employee_id" = "User"."id" 
                AND "aa"."is_completed" = true
                AND "aa"."is_late" = true
                AND "a"."team_id" = ${team_id}
            ) AS INTEGER)
          `),
          "late_activities",
        ],
        [
          Sequelize.literal(`
            CAST((
              SELECT COALESCE(AVG(COALESCE("aa"."note", 0)), 0)
              FROM "activity_assignments" AS "aa"
              INNER JOIN "assistance" AS "a" ON "a"."id" = "aa"."assistance_id"
              WHERE "a"."employee_id" = "User"."id"
              AND "a"."team_id" = ${team_id}
            ) AS FLOAT)
          `),
          "avg_note",
        ],
      ],
      include: [
        {
          as: "assistance",
          attributes: ["id"],
          include: [
            {
              as: "activities_asigments",
              attributes: [],
              include: [
                {
                  as: "activity",
                  attributes: [],
                  model: Activitie,
                  ...(area_id && { where: { id: +area_id }, required: true }),
                },
              ],
              model: ActivityAssignment,
              where: is_completed !== undefined ? { is_completed } : is_late !== undefined ? { is_late } : {},
              required: !!is_completed || !!is_late,
            },
          ],
          model: Assistance,
          where: {
            ...(team_id && { team_id }),
            date_assistance: {
              [Op.gte]: start_date,
              [Op.lte]: end_date,
            },
          },
          required: true,
        },
      ],
      order: [
        [
          { model: Assistance, as: "assistance" },
          { model: ActivityAssignment, as: "activities_asigments" },
          "note",
          order.toUpperCase(),
        ],
      ],
      ...(store_id && { where: { store_id }, required: true }),
    };

    const paginatedResult = await this.user_pagination.paginate({
      options: optionsQuery,
      page,
      limit,
    });

    const data = paginatedResult.data.map((d) => UserEntity.fromObject(d.dataValues));

    return {
      ...paginatedResult,
      data,
    };
  }

  async findTeams(filters: ActivityReportQueryFilter): Promise<TeamEntity[]> {
    const { store_id, area_id, start_date, end_date, is_completed, is_late } = filters;

    const teams = await Team.findAll({
      attributes: ["id", "name", "code", "is_active"],
      include: [
        {
          as: "users",
          attributes: [],
          through: { attributes: [] },
          required: true,
          include: [
            {
              as: "assistance",
              attributes: [],
              include: [
                {
                  as: "activities_asigments",
                  attributes: [],
                  include: [
                    {
                      as: "activity",
                      attributes: [],
                      model: Activitie,
                      ...(area_id && { where: { id: +area_id }, required: true }),
                    },
                  ],
                  model: ActivityAssignment,
                  where: is_completed !== undefined ? { is_completed } : is_late !== undefined ? { is_late } : {},
                  required: !!is_completed || !!is_late,
                },
              ],
              model: Assistance,
              where: {
                date_assistance: {
                  [Op.gte]: start_date,
                  [Op.lte]: end_date,
                },
              },
              required: true,
            },
          ],
          model: User,
        },
      ],
      ...(store_id && { where: { store_id }, required: true }),
      order: [["is_active", "DESC"]],
    });

    return teams.map(TeamEntity.fromObject);
  }

  async findDetailsActivitiesByUser(
    filters: ActivityReportQueryFilter
  ): Promise<PaginatedResponse<ActivitieAssignmentEntity>> {
    const { store_id, area_id, start_date, end_date, is_completed, page, limit, user_id, is_late, order, team_id } =
      filters;

    const optionsQuery: FindOptions = {
      attributes: [
        "id",
        "deadline",
        "manager_note",
        "shift_manager_note",
        "date_completed",
        "is_completed",
        [Sequelize.fn("COALESCE", Sequelize.col("note"), 0), "note"],
        "manager_comments",
        "shift_manager_comments",
        "is_late",
      ],
      include: [
        {
          as: "activity",
          attributes: ["id", "name", "description"],
          model: Activitie,
          ...(area_id && { where: { id: +area_id }, required: true }),
        },
        {
          as: "assistance",
          attributes: ["id", "status", "date_assistance", "taken_by_employee_id"],
          include: [
            {
              as: "taken_employee",
              attributes: ["id", "names", "last_names", "email", "username", "avatar_url"],
              model: User,
            },
            {
              as: "employee",
              attributes: ["id", "names", "last_names", "email", "username", "avatar_url"],
              model: User,
              where: user_id ? { id: +user_id } : store_id ? { store_id } : {},
              required: !!user_id || !!store_id,
            },
          ],
          model: Assistance,
          where: {
            ...(team_id && { team_id }),
            date_assistance: {
              [Op.gte]: start_date,
              [Op.lte]: end_date,
            },
          },
          required: true,
        },
      ],
      order: [["note", order.toUpperCase()]],
      where: is_completed !== undefined ? { is_completed } : is_late !== undefined ? { is_late } : {},
    };

    const paginatedResult = await this.activity_assigment_pagination.paginate({
      options: optionsQuery,
      page,
      limit,
    });

    const data = paginatedResult.data.map((d) => ActivitieAssignmentEntity.fromObject(d.dataValues));

    return {
      ...paginatedResult,
      data,
    };
  }
}
