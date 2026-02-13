import { GetActivitiesByUserReportUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetActivitiesByUserReportController implements Controller {
  constructor(private getActivitiesByUserReportUseCase: GetActivitiesByUserReportUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const teams = await this.getActivitiesByUserReportUseCase.execute(httpRequest);

      return {
        statusCode: 200,
        message: "Actividades obtenidos exitosamente",
        body: teams,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
