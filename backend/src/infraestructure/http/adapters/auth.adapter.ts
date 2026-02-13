import { UserDatasourceImpl } from "../../datasources";
import { UserRepositoryImpl } from "../../repositories";

import { AuthHandler } from "../middlewares";

export class AuthAdapter {
  private authHandler: AuthHandler;

  constructor() {
    const userDataSource = new UserDatasourceImpl();
    const userRepository = new UserRepositoryImpl(userDataSource);

    this.authHandler = new AuthHandler(userRepository);
  }

  getHandler(): AuthHandler {
    return this.authHandler;
  }
}
