import { AssignUsersToTeamUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class AssignUsersToTeamController implements Controller {
  constructor(private assignUsersToTeamUseCase: AssignUsersToTeamUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      await this.assignUsersToTeamUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Usuarios asignados exitosamente",
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
