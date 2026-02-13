import { GetActivitieUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetActivitieController implements Controller {
  constructor(private getActivitieUseCase: GetActivitieUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const activitie = await this.getActivitieUseCase.execute(httpRequest);

      return {
        statusCode: 200,
        message: "Actividad obtenida exitosamente",
        body: activitie,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
