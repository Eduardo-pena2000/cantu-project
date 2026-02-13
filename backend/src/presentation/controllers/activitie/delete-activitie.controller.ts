import { DeleteActivitieUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class DeleteActivitieController implements Controller {
  constructor(private deleteActivitieUseCase: DeleteActivitieUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      await this.deleteActivitieUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Actividad eliminada exitosamente",
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
