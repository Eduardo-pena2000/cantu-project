import { GetTeamsUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetTeamsController implements Controller {
  constructor(private getTeamsUseCase: GetTeamsUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const teams = await this.getTeamsUseCase.execute(httpRequest);

      return {
        statusCode: 200,
        message: "Equipos obtenidos exitosamente",
        body: teams,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
