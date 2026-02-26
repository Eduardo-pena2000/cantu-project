import { DataTypes, Model, Sequelize } from "sequelize";

import { SequelizeModel } from "../sequelize";

interface UserScheduleAttributes {
  id: number;
  user_id: number;
  schedule_id: number;
  team_id: number;
}

type UserScheduleCreationAttributes = Partial<UserScheduleAttributes>;

class UserShiftSchedule extends Model<UserScheduleAttributes, UserScheduleCreationAttributes> {
  public id!: number;
  public schedule_id!: number;
  public user_id!: number;
  public team_id!: number;

  static associate(models: { [key: string]: SequelizeModel }) {
    UserShiftSchedule.belongsTo(models.Team, { foreignKey: "team_id" });
  }

  static initModel(sequelize: Sequelize) {
    UserShiftSchedule.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        schedule_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "shift_schedules",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        team_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "teams",
            key: "id",
          },
          onDelete: "CASCADE",
        },
      },
      {
        modelName: "UserShiftSchedule",
        tableName: "user_shifts_schedules",
        sequelize,
      }
    );
  }
}

export default UserShiftSchedule;
