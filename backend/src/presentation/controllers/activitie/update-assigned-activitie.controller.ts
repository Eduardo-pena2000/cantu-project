import { UpdateAssignedActivitieUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class UpdateAssignedActivitieController implements Controller {
  constructor(private updateAssignedActivitieUseCase: UpdateAssignedActivitieUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const activitie = await this.updateAssignedActivitieUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Actividad asignada actualizada exitosamente",
        body: activitie,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
