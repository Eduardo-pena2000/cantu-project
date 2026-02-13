import { GetAssignedActivitieUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetAssignedActivitieController implements Controller {
  constructor(private getAssignedActivitieUseCase: GetAssignedActivitieUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const activitie = await this.getAssignedActivitieUseCase.execute(httpRequest);

      return {
        statusCode: 200,
        message: "Actividad asignada obtenida exitosamente",
        body: activitie,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
