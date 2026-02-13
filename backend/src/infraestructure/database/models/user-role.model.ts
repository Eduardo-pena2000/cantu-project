import { DataTypes, Model, Sequelize } from "sequelize";

interface UserRoleAttributes {
  id: number;
  role_id: number;
  user_id: number;
}

type UserRoleCreationAttributes = Partial<UserRoleAttributes>;

class UserRole extends Model<UserRoleAttributes, UserRoleCreationAttributes> {
  public role_id!: number;
  public user_id!: number;

  static initModel(sequelize: Sequelize) {
    UserRole.init(
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
        role_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "roles",
            key: "id",
          },
          onDelete: "CASCADE",
        },
      },
      { modelName: "UserRole", tableName: "user_roles", sequelize, timestamps: false }
    );
  }
}

export default UserRole;
