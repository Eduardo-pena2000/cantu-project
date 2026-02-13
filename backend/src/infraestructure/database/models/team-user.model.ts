import { DataTypes, Model, Sequelize } from "sequelize";
import { SequelizeModel } from "../sequelize";

interface TeamUserAttributes {
  id: number;
  team_id: number;
  user_id: number;
  is_active: boolean;
}

type TeamUserCreationAttributes = Partial<TeamUserAttributes>;

class TeamUser extends Model<TeamUserAttributes, TeamUserCreationAttributes> {
  public team_id!: number;
  public user_id!: number;

  static associate(models: { [key: string]: SequelizeModel }) {
    TeamUser.belongsTo(models.Team, { foreignKey: "team_id", as: "team" });
  }

  static initModel(sequelize: Sequelize) {
    TeamUser.init(
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
        team_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "teams",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        },
      },
      { modelName: "TeamUser", tableName: "team_users", sequelize, paranoid: false }
    );
  }
}

export default TeamUser;
