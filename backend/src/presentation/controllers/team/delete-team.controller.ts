import { DeleteTeamUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class DeleteTeamController implements Controller {
  constructor(private deleteTeamUseCase: DeleteTeamUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      await this.deleteTeamUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Equipo eliminado exitosamente",
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
