import { DataTypes, Model, Sequelize } from "sequelize";

import { SequelizeModel } from "../sequelize";
import StoreHooks from "../hooks/store.hook";

interface StoreAttributes {
  id: number;
  name: string;
  address: string;
  code: string;
  address_detail: string;
  suburb_name: string;
  zip_code: string;
  municipality: string;
  avatar_url: string | null;
  avatar_name: string | null;
}

type StoreCreationAttributes = Partial<StoreAttributes>;

class Store extends Model<StoreAttributes, StoreCreationAttributes> {
  public id!: number;
  public name!: string;
  public address!: string;
  public code!: string;
  public address_detail!: string;
  public suburb_name!: string;
  public zip_code!: string;
  public municipality!: string;
  public avatar_url!: string | null;
  public avatar_name!: string | null;

  static associate(models: { [key: string]: SequelizeModel }) {
    Store.hasMany(models.User, { as: "users", foreignKey: "store_id" });

    Store.hasMany(models.Area, { as: "areas", foreignKey: "store_id" });

    Store.hasMany(models.Shift, { as: "shifts", foreignKey: "store_id" });

    Store.hasMany(models.Team, { as: "teams", foreignKey: "store_id" });

    Store.hasMany(models.JobRole, { as: "job_roles", foreignKey: "store_id" });

    Store.hasMany(models.Assistance, { as: "assistances", foreignKey: "store_id" });

    Store.hasMany(models.Incident, { as: "incidents", foreignKey: "store_id" });
  }

  static initModel(sequelize: Sequelize) {
    Store.init(
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
        address: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        code: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        address_detail: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        suburb_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        zip_code: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        municipality: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        avatar_url: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        avatar_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      { modelName: "Store", paranoid: true, sequelize }
    );

    StoreHooks.register();
  }
}

export default Store;
