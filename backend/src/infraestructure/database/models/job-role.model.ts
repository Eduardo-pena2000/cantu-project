import { DataTypes, Model, Sequelize } from "sequelize";

import { SequelizeModel } from "../sequelize";

import JobRoleHooks from "../hooks/job-role.hooks";

interface JobRoleAttributes {
  id: number;
  name: string;
  code: string;
  store_id: number;
}

type JobRoleCreationAttributes = Partial<JobRoleAttributes>;

class JobRole extends Model<JobRoleAttributes, JobRoleCreationAttributes> {
  public id!: number;
  public name!: string;
  public code!: string;
  public store_id!: number;

  static associate(models: { [key: string]: SequelizeModel }) {
    JobRole.belongsTo(models.Store, { as: "store", foreignKey: "store_id" });

    JobRole.hasMany(models.Activitie, { as: "activities", foreignKey: "job_role_id" });
  }

  static initModel(sequelize: Sequelize) {
    JobRole.init(
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
        code: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        store_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "stores",
            key: "id",
          },
          onDelete: "CASCADE",
        },
      },
      { modelName: "JobRole", paranoid: true, sequelize }
    );

    JobRoleHooks.register();
  }
}

export default JobRole;
