import { DataTypes, Model, Sequelize } from "sequelize";

import { SequelizeModel } from "../sequelize";

interface ScheduletAttributes {
  id: number;
  day: string;
  week_day: number;
  shift_id: number;
  is_weekend: boolean;
  start_time: string;
  end_time: string;
}

type ScheduleCreationAttributes = Partial<ScheduletAttributes>;

class ShiftSchedule extends Model<ScheduletAttributes, ScheduleCreationAttributes> {
  public id!: number;
  public day!: string;
  public week_day!: number;
  public shift_id!: number;
  public start_time!: string;
  public end_time!: string;
  public is_weekend!: boolean;

  static associate(models: { [key: string]: SequelizeModel }) {
    ShiftSchedule.belongsTo(models.Shift, {
      as: "shift",
      foreignKey: "shift_id",
    });

    ShiftSchedule.belongsToMany(models.User, {
      as: "employees_schedules",
      through: models.UserShiftSchedule,
      foreignKey: "schedule_id",
      otherKey: "user_id",
    });

    ShiftSchedule.hasOne(models.Assistance, { foreignKey: "schedule_id" });
  }

  static initModel(sequelize: Sequelize) {
    ShiftSchedule.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        day: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        week_day: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        is_weekend: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        start_time: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        end_time: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        shift_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "shifts",
            key: "id",
          },
          onDelete: "CASCADE",
        },
      },
      { modelName: "ShiftSchedule", paranoid: false, sequelize }
    );
  }
}

export default ShiftSchedule;
