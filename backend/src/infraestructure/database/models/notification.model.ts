import { DataTypes, Model, Sequelize } from "sequelize";

import { SequelizeModel } from "../sequelize";

interface NotificationAttributes {
  id: number;
  title: string;
  description: string;
  type: string;
  is_read: boolean;
  user_id: number;
  date: Date;
  metadata: object;
}

type NotificationCreationAttributes = Partial<NotificationAttributes>;

class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> {
  public id!: number;
  public title!: string;
  public description!: string;
  public type!: string;
  public is_read!: boolean;
  public user_id!: number;
  public date!: Date;
  public metadata!: object;

  static associate(models: { [key: string]: SequelizeModel }) {
    Notification.belongsTo(models.User, { as: "user", foreignKey: "user_id" });
  }

  static initModel(sequelize: Sequelize) {
    Notification.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        is_read: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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
        date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        metadata: {
          type: DataTypes.JSON,
          allowNull: true,
        },
      },
      { modelName: "Notification", paranoid: false, sequelize }
    );
  }
}

export default Notification;
