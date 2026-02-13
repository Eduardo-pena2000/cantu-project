import { GetActivitiesByAreaUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetActivitiesByAreaController implements Controller {
  constructor(private getActivitiesByAreaUseCase: GetActivitiesByAreaUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const activities = await this.getActivitiesByAreaUseCase.execute(httpRequest);

      return {
        statusCode: 200,
        message: "Actividades obtenida exitosamente",
        body: activities,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
