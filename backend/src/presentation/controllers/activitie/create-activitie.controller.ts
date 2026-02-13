import { CreateActivitieUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class CreateActivitieController implements Controller {
  constructor(private createActivitieUseCase: CreateActivitieUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const activitie = await this.createActivitieUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Actividad creada exitosamente",
        body: activitie,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
