import { DataTypes, Model, Sequelize } from "sequelize";

import { SequelizeModel } from "../sequelize";

import TeamHooks from "../hooks/team.hooks";

interface TeamAttributes {
  id: number;
  name: string;
  code: string;
  store_id: number;
  shift_id: number;
  is_active: boolean;
}

type TeamCreationAttributes = Partial<TeamAttributes>;

class Team extends Model<TeamAttributes, TeamCreationAttributes> {
  public id!: number;
  public name!: string;
  public code!: string;
  public store_id!: number;
  public shift_id!: number;
  public is_active!: boolean;

  static associate(models: { [key: string]: SequelizeModel }) {
    Team.belongsTo(models.Store, { as: "store", foreignKey: "store_id" });

    Team.belongsTo(models.Shift, { as: "shift", foreignKey: "shift_id" });

    Team.hasMany(models.UserShiftSchedule, { as: "assigned_shifts", foreignKey: "team_id" });

    Team.hasMany(models.Assistance, { as: "assistances", foreignKey: "team_id" });

    Team.belongsToMany(models.User, {
      as: "users",
      through: models.TeamUser,
      foreignKey: "team_id",
      otherKey: "user_id",
    });

    Team.belongsToMany(models.User, {
      as: "managers",
      through: models.TeamManager,
      foreignKey: "team_id",
      otherKey: "user_id",
    });
  }

  static initModel(sequelize: Sequelize) {
    Team.init(
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
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        shift_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "shifts",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
      },
      { modelName: "Team", paranoid: true, sequelize }
    );

    TeamHooks.register();
  }
}

export default Team;
