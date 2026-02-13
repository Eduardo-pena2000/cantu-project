import { GetUsersByTeamReportUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetUsersByTeamReportController implements Controller {
  constructor(private getUsersByTeamReportUseCase: GetUsersByTeamReportUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const teams = await this.getUsersByTeamReportUseCase.execute(httpRequest);

      return {
        statusCode: 200,
        message: "Usuarios obtenidos exitosamente",
        body: teams,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
