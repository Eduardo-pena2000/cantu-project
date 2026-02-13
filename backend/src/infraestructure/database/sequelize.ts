import path from "path";
import fs from "fs";
import { Model, ModelStatic, Sequelize } from "sequelize";

import { AppError } from "../../shared";
import { envs } from "../config";

interface Options {
  database: string;
  username: string;
  password: string;
  host: string;
  port: number;
}

export interface SequelizeModel extends ModelStatic<Model> {
  associate?: (models: { [key: string]: SequelizeModel }) => void;
  initModel?: (sequelize: Sequelize) => void;
}

export class SequelizeDatabase {
  private static sequelize: Sequelize;

  static async connect(options: Options) {
    const { database, password, username, host, port } = options;

    try {
      this.sequelize = new Sequelize(database, username, password, {
        host,
        port,
        dialect: "postgres",
        define: {
          underscored: true,
          timestamps: true,
        },
        logging: false,
      });

      this.initModels();

      if (envs.NODE_ENV !== "production") {
        await this.sequelize.sync({ alter: true });
      }

      console.log("Connection to the database has been established successfully.");
    } catch (error) {
      console.log("Error al conectar con la base de datos:", error);
    }
  }

  private static initModels() {
    const modelsPath = path.resolve(__dirname, "models");

    fs.readdirSync(modelsPath).forEach((file) => {
      if (file.endsWith(".ts") || file.endsWith(".js")) {
        const model: SequelizeModel = require(path.join(modelsPath, file)).default;

        if (typeof model.initModel === "function") {
          model.initModel(this.sequelize);
        }

        if (!this.sequelize.models[model.name]) {
          this.sequelize.models[model.name] = model;
        }
      }
    });

    Object.keys(this.sequelize.models).forEach((modelName) => {
      const model = this.sequelize.models[modelName] as SequelizeModel;

      if (model.associate) {
        model.associate(this.sequelize.models);
      }
    });
  }

  static getSequelizeInstance(): Sequelize {
    if (!this.sequelize) {
      throw AppError.internalServer("Sequelize no ha sido inicializado. Llama a SequelizeDatabase.connect() primero.");
    }

    return this.sequelize;
  }
}
