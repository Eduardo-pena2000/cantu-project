import { DataTypes, Model, Sequelize } from "sequelize";

import { SequelizeModel } from "../sequelize";

interface ShiftAttributes {
  id: number;
  name: string;
  store_id: number;
}

type ShiftCreationAttributes = Partial<ShiftAttributes>;

class Shift extends Model<ShiftAttributes, ShiftCreationAttributes> {
  public id!: number;
  public name!: string;
  public store_id!: number;

  static associate(models: { [key: string]: SequelizeModel }) {
    Shift.hasMany(models.ShiftSchedule, {
      as: "schedules",
      foreignKey: "shift_id",
    });

    Shift.belongsTo(models.Store, { as: "store", foreignKey: "store_id" });

    Shift.hasMany(models.Team, { as: "teams", foreignKey: "shift_id" });
  }

  static initModel(sequelize: Sequelize) {
    Shift.init(
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
        store_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "stores",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
      },
      { modelName: "Shift", paranoid: false, sequelize }
    );
  }
}

export default Shift;
