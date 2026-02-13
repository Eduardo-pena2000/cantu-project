import express, { Router } from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";

import { ErrorMiddleware } from "./shared";

import { corsAppConfig, envs } from "./infraestructure";

interface Options {
  port: number;
  routes: Router;
}

export class Server {
  private app = express();
  private port: number;
  private routes: Router;

  public readonly server: http.Server;

  constructor(options: Options) {
    const { port, routes } = options;

    this.port = port;
    this.routes = routes;

    this.server = http.createServer(this.app);
  }

  middlewares() {
    this.app.use(express.json());

    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(morgan(`${envs.NODE_ENV !== "production" && "dev"}`));

    this.app.use(cors(corsAppConfig));

    this.app.use(this.routes);
  }

  logErrors() {
    this.app.use(ErrorMiddleware.handleError);
  }

  start() {
    this.listen();

    this.middlewares();

    this.logErrors();
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}
