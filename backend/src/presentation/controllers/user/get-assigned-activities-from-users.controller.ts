import { GetAssignedActivitiesFromUsersUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetAssignedActivitiesFromUsersController implements Controller {
  constructor(
    private getAssignedActivitiesFromUsersUseCase: GetAssignedActivitiesFromUsersUseCase
  ) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const users = await this.getAssignedActivitiesFromUsersUseCase.execute(httpRequest);

      return {
        statusCode: 200,
        message: "Usuarios obtenidos exitosamente",
        body: users,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
