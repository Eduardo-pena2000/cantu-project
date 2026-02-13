import { DataTypes, Model, Sequelize } from "sequelize";

interface TeamAttributes {
  id: number;
  team_id: number;
  user_id: number;
  is_main_manager: boolean;
  start_date: Date | null;
  end_date: Date | null;
}

type TeamCreationAttributes = Partial<TeamAttributes>;

class TeamManager extends Model<TeamAttributes, TeamCreationAttributes> {
  public id!: number;
  public team_id!: number;
  public user_id!: number;
  public is_main_manager!: boolean;
  public start_date!: Date | null;
  public end_date!: Date | null;

  static initModel(sequelize: Sequelize) {
    TeamManager.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
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
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        is_main_manager: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        start_date: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        end_date: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      { modelName: "TeamManager", tableName: "team_managers", paranoid: false, sequelize }
    );
  }
}

export default TeamManager;
