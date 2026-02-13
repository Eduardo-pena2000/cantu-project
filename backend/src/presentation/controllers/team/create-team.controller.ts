import { CreateTeamUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class CreateTeamController implements Controller {
  constructor(private createTeamUseCase: CreateTeamUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const team = await this.createTeamUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Equipos creado exitosamente",
        body: team,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
