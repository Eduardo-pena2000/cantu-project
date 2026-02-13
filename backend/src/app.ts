import { AppRoutes } from "./presentation";

import { Server } from "./server";

import { envs, initializeCronServer, SequelizeDatabase } from "./infraestructure";
import { makeSocketConfig } from "./application";

const main = async () => {
  const database = envs.DB_NAME;
  const username = envs.DB_USER;
  const password = envs.DB_PASSWORD;
  const host = envs.DB_HOST;
  const port = envs.DB_PORT;

  await SequelizeDatabase.connect({ database, password, username, host, port });

  const server = new Server({ port: envs.APP_PORT || 4568, routes: AppRoutes.routes });

  initializeCronServer();

  server.start();

  makeSocketConfig().initializeServer(server.server);
};

main();
