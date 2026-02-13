import { GetTeamUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetTeamController implements Controller {
  constructor(private getTeamUseCase: GetTeamUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const store = await this.getTeamUseCase.execute(httpRequest);

      return {
        statusCode: 200,
        message: "Equipo obtenido exitosamente",
        body: store,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
