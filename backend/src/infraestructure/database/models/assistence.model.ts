import { DataTypes, Model, Sequelize } from "sequelize";

import { SequelizeModel } from "../sequelize";

import User from "./user.model";

interface AssistanceAttributes {
  id: number;
  employee_id: number;
  taken_by_employee_id: number;
  schedule_id: number;
  status: string;
  date_assistance: Date;
  assistance_image_name: string | null;
  assistance_image_url: string | null;
  team_id: number | null;
  store_id: number | null;
}

type AssistanceCreationAttributes = Partial<AssistanceAttributes>;

class Assistance extends Model<AssistanceAttributes, AssistanceCreationAttributes> {
  public id!: number;
  public employee_id!: number;
  public taken_by_employee_id!: number;
  public schedule_id!: number;
  public status!: string;
  public employee!: User;
  public taken_employee!: User;
  public date_assistance!: Date;
  public assistance_image_name!: string | null;
  public assistance_image_url!: string | null;

  static associate(models: { [key: string]: SequelizeModel }) {
    Assistance.belongsTo(models.User, { as: "employee", foreignKey: "employee_id" });

    Assistance.belongsTo(models.User, { as: "taken_employee", foreignKey: "taken_by_employee_id" });

    Assistance.belongsTo(models.ShiftSchedule, { as: "schedule", foreignKey: "schedule_id" });

    Assistance.belongsTo(models.Team, { as: "team", foreignKey: "team_id" });

    Assistance.belongsTo(models.Store, { as: "store", foreignKey: "store_id" });

    Assistance.hasMany(models.ActivityAssignment, {
      as: "activities_asigments",
      foreignKey: "assistance_id",
      onDelete: "CASCADE",
      hooks: true,
    });
  }

  static initModel(sequelize: Sequelize) {
    Assistance.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        employee_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
        },
        taken_by_employee_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
        },
        schedule_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "shift_schedules",
            key: "id",
          },
        },
        team_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "teams",
            key: "id",
          },
        },
        store_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "stores",
            key: "id",
          },
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "pending",
        },
        date_assistance: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        assistance_image_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        assistance_image_url: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      { modelName: "Assistance", paranoid: false, sequelize }
    );
  }
}

export default Assistance;
