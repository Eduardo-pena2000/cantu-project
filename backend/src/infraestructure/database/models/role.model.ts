import { DataTypes, Model, Sequelize } from "sequelize";

import { SequelizeModel } from "../sequelize";

interface RoleAttributes {
  id: number;
  name: string;
  slug: string;
}

type RoleCreationAttributes = Partial<RoleAttributes>;

class Role extends Model<RoleAttributes, RoleCreationAttributes> {
  public id!: number;
  public name!: string;
  public slug!: string;

  static associate(models: { [key: string]: SequelizeModel }) {
    Role.belongsToMany(models.User, {
      as: "users",
      through: models.UserRole,
      foreignKey: "role_id",
      otherKey: "user_id",
    });
  }

  static initModel(sequelize: Sequelize) {
    Role.init(
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
        slug: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      { modelName: "Role", paranoid: true, sequelize }
    );
  }
}

export default Role;
