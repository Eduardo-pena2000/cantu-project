import { DeleteShiftUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class DeleteShiftController implements Controller {
  constructor(private deleteShifstUseCase: DeleteShiftUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      await this.deleteShifstUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Turno eliminado exitosamente",
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
