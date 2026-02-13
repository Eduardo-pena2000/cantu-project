import { UpdateTeamUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class UpdateTeamController implements Controller {
  constructor(private updateTeamUseCase: UpdateTeamUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      await this.updateTeamUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Equipo actualizado exitosamente",
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
