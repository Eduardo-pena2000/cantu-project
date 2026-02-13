import { AssignmentActivitieUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class AssignmentActivitieController implements Controller {
  constructor(private assignmentActivitieUseCase: AssignmentActivitieUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const activitie = await this.assignmentActivitieUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Actividad asignada exitosamente",
        body: activitie,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
