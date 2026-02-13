import { QualifyActivitieUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class QualifyActivitieController implements Controller {
  constructor(private qualifyActivitieUseCase: QualifyActivitieUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const activitie = await this.qualifyActivitieUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Actividad calificada exitosamente",
        body: activitie,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
