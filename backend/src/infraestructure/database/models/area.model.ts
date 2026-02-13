import { DataTypes, Model, Sequelize } from "sequelize";

import { SequelizeModel } from "../sequelize";
import AreaHooks from "../hooks/area.hooks";

interface AreaAttributes {
  id: number;
  name: string;
  code: string | null;
  store_id: number;
  manager_id: number;
}

type AreaCreationAttributes = Partial<AreaAttributes>;

class Area extends Model<AreaAttributes, AreaCreationAttributes> {
  public id!: number;
  public name!: string;
  public code!: string;
  public store_id!: number;

  static associate(models: { [key: string]: SequelizeModel }) {
    Area.belongsTo(models.Store, { as: "store", foreignKey: "store_id" });

    Area.belongsTo(models.User, { as: "manager", foreignKey: "manager_id" });

    Area.belongsToMany(models.User, {
      as: "users",
      through: models.UserArea,
      foreignKey: "area_id",
      otherKey: "user_id",
    });

    Area.hasMany(models.Activitie, {
      as: "activities",
      foreignKey: "area_id",
      onDelete: "CASCADE",
    });
  }

  static initModel(sequelize: Sequelize) {
    Area.init(
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
        manager_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
      },
      { modelName: "Area", paranoid: true, sequelize }
    );

    AreaHooks.register();
  }
}

export default Area;
