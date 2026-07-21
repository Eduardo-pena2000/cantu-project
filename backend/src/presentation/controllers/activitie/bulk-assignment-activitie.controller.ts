import { BulkAssignmentActivitieUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class BulkAssignmentActivitieController implements Controller {
  constructor(private bulkAssignmentUseCase: BulkAssignmentActivitieUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const assignments = await this.bulkAssignmentUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: `${assignments.length} actividad(es) asignada(s) exitosamente`,
        body: assignments,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
