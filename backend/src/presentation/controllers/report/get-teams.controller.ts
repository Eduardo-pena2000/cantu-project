import { GetTeamsReportUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetTeamsReportController implements Controller {
  constructor(private getTeamsReportUseCase: GetTeamsReportUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const teams = await this.getTeamsReportUseCase.execute(httpRequest);

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
