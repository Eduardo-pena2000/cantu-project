import { DataTypes, Model, Sequelize } from "sequelize";

import { SequelizeModel } from "../sequelize";

interface UserDeviceAttributes {
  id: number;
  token: string;
  user_id: number;
}

type UserDeviceCreationAttributes = Partial<UserDeviceAttributes>;

class UserDevice extends Model<UserDeviceAttributes, UserDeviceCreationAttributes> {
  public id!: number;
  public token!: string;

  static associate(models: { [key: string]: SequelizeModel }) {
    UserDevice.belongsTo(models.Store, { as: "user", foreignKey: "user_id" });
  }

  static initModel(sequelize: Sequelize) {
    UserDevice.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        token: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
      },
      { modelName: "UserDevice", paranoid: true, sequelize }
    );
  }
}

export default UserDevice;
