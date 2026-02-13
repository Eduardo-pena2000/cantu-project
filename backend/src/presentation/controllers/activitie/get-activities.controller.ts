import { GetActivitiesUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetActivitiesController implements Controller {
  constructor(private getActivitiesUseCase: GetActivitiesUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const activities = await this.getActivitiesUseCase.execute(httpRequest);

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
