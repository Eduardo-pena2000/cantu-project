import { DataTypes, Model, Sequelize } from "sequelize";

import { SequelizeModel } from "../sequelize";

interface UserAttributes {
  id: number;
  username: string;
  names: string;
  last_names: string;
  phone: string;
  email: string;
  avatar_url: string | null;
  avatar_name: string | null;
  password: string;
  is_active: boolean;
  last_login: Date | null;
  store_id: number;
}

type UserCreationAttributes = Partial<UserAttributes>;

class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: number;
  public email!: string;
  public password!: string;
  public username!: string;
  public names!: string;
  public last_names!: string;
  public avatar_name!: string | null;
  public avatar_url!: string | null;
  public phone!: string;
  public last_login!: Date | null;
  public is_active!: boolean;
  public store_id!: number | null;

  static associate(models: { [key: string]: SequelizeModel }) {
    User.belongsTo(models.Store, { as: "store", foreignKey: "store_id" });

    User.belongsToMany(models.Role, {
      as: "roles",
      through: models.UserRole,
      foreignKey: "user_id",
      otherKey: "role_id",
    });

    User.belongsToMany(models.Team, {
      as: "manager_teams",
      through: models.TeamManager,
      foreignKey: "user_id",
      otherKey: "team_id",
    });

    User.belongsToMany(models.Team, {
      as: "teams",
      through: models.TeamUser,
      foreignKey: "user_id",
      otherKey: "team_id",
    });

    User.belongsToMany(models.Area, {
      as: "areas",
      through: models.UserArea,
      foreignKey: "user_id",
      otherKey: "area_id",
    });

    User.belongsToMany(models.ShiftSchedule, {
      as: "schedules",
      through: models.UserShiftSchedule,
      foreignKey: "user_id",
      otherKey: "schedule_id",
    });

    User.hasOne(models.Assistance, { as: "assistance", foreignKey: "employee_id" });

    User.hasOne(models.Area, { as: "area_manager", foreignKey: "manager_id" });

    User.hasOne(models.Assistance, {
      as: "assistances_taken",
      foreignKey: "taken_by_employee_id",
    });

    User.hasMany(models.UserDevice, { as: "devices_tokens", foreignKey: "user_id" });

    User.hasMany(models.Notification, { as: "notifications", foreignKey: "user_id" });
  }

  static initModel(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        email: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        names: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        last_names: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        last_login: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        avatar_url: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        avatar_name: {
          type: DataTypes.STRING,
          allowNull: true,
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
      { modelName: "User", paranoid: true, sequelize }
    );
  }
}

export default User;
