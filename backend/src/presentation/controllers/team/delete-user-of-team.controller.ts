import { DeleteUserOfTeamUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class DeleteUserOfTeamController implements Controller {
  constructor(private deleteUserOfTeamUseCase: DeleteUserOfTeamUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      await this.deleteUserOfTeamUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Usuario eliminado del equipo exitosamente",
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
