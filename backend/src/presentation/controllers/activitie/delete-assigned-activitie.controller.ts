import { DeleteAssignedActivitieUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class DeleteAssignedActivitieController implements Controller {
  constructor(private deleteAssignedActivitieUseCase: DeleteAssignedActivitieUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      await this.deleteAssignedActivitieUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Actividad eliminada exitosamente",
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
