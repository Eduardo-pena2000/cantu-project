import { DataTypes, Model, Sequelize } from "sequelize";

interface UserAreaAttributes {
  id: number;
  area_id: number;
  user_id: number;
}

type UserAreaCreationAttributes = Partial<UserAreaAttributes>;

class UserArea extends Model<UserAreaAttributes, UserAreaCreationAttributes> {
  public area_id!: number;
  public user_id!: number;

  static initModel(sequelize: Sequelize) {
    UserArea.init(
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
        area_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "areas",
            key: "id",
          },
          onDelete: "CASCADE",
        },
      },
      { modelName: "UserArea", tableName: "user_areas", sequelize, timestamps: false }
    );
  }
}

export default UserArea;
