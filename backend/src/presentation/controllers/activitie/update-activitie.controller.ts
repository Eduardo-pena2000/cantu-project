import { UpdateActivitieUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class UpdateActivitieController implements Controller {
  constructor(private updateActivitieUseCase: UpdateActivitieUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      await this.updateActivitieUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Actividad actualizada exitosamente",
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
