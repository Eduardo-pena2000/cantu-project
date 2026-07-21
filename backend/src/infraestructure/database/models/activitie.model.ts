import { DataTypes, Model, Sequelize } from "sequelize";

import { SequelizeModel } from "../sequelize";

interface ActivitieAttributes {
  id: number;
  name: string;
  description: string;
  area_id: number;
  default_deadline: string | null;
}

type ActivitieCreationAttributes = Partial<ActivitieAttributes>;

class Activitie extends Model<ActivitieAttributes, ActivitieCreationAttributes> {
  public id!: number;
  public name!: string;
  public description!: string;
  public area_id!: number;
  public default_deadline!: string | null;

  static associate(models: { [key: string]: SequelizeModel }) {
    Activitie.belongsTo(models.Area, { as: "area", foreignKey: "area_id" });

    Activitie.belongsTo(models.JobRole, { as: "job_role", foreignKey: "job_role_id" });

    Activitie.hasMany(models.ActivityAssignment, {
      as: "activities_asigments",
      foreignKey: "activitie_id",
    });
  }

  static initModel(sequelize: Sequelize) {
    Activitie.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        area_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "areas",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        default_deadline: {
          type: DataTypes.TIME,
          allowNull: true,
          defaultValue: null,
        },
      },
      { modelName: "Activitie", paranoid: true, sequelize }
    );
  }
}

export default Activitie;
