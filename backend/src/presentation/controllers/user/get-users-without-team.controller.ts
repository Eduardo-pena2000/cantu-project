import { GetUsersWithoutTeamUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetUsersWithoutTeamController implements Controller {
  constructor(private getUsersWithoutTeamUseCase: GetUsersWithoutTeamUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const users = await this.getUsersWithoutTeamUseCase.execute(httpRequest);

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
