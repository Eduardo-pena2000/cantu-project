import { DataTypes, Model, Sequelize } from "sequelize";

import { SequelizeModel } from "../sequelize";
import ActivitieHooks from "../hooks/activitie.hooks";

interface ActivityAssignmentAttributes {
  id: number;
  is_completed: boolean;
  is_late: boolean;
  deadline: string;
  date_completed: string | null;
  manager_comments: string | null;
  shift_manager_comments: string | null;
  manager_note: number | null;
  shift_manager_note: number | null;
  note: number | null;
  activitie_id: number;
  assistance_id: number;
  activitie_image_name: string | null;
  activitie_image_url: string | null;
}

type ActivityAssignmentCreationAttributes = Partial<ActivityAssignmentAttributes>;

class ActivityAssignment extends Model<ActivityAssignmentAttributes, ActivityAssignmentCreationAttributes> {
  public id!: number;
  public is_completed!: boolean;
  public is_late!: boolean;
  public deadline!: string;
  public date_completed!: string | null;
  public date_comcommentspleted!: string | null;
  public manager_note!: number | null;
  public shift_manager_note!: number | null;
  public note!: number | null;
  public activitie_id!: number;
  public assistance_id!: number;
  public activitie_image_name!: string | null;
  public activitie_image_url!: string | null;

  static associate(models: { [key: string]: SequelizeModel }) {
    ActivityAssignment.belongsTo(models.Assistance, {
      as: "assistance",
      foreignKey: "assistance_id",
    });

    ActivityAssignment.belongsTo(models.Activitie, {
      as: "activity",
      foreignKey: "activitie_id",
    });
  }

  static initModel(sequelize: Sequelize) {
    ActivityAssignment.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        is_completed: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        is_late: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        deadline: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        date_completed: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        manager_comments: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        shift_manager_comments: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        manager_note: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        shift_manager_note: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        note: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        activitie_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "activities",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        assistance_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "assistance",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        activitie_image_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        activitie_image_url: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        modelName: "ActivityAssignment",
        sequelize,
        timestamps: true,
        paranoid: false,
      }
    );

    ActivitieHooks.register();
  }
}

export default ActivityAssignment;
