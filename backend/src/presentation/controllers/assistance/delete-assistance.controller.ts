import { DeleteAssistanceUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class DeleteAssistanceController implements Controller {
  constructor(private deleteAssistanceUseCase: DeleteAssistanceUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const { id } = httpRequest.params;

      await this.deleteAssistanceUseCase.execute({ id });

      return {
        statusCode: 201,
        message: "Asistencia eliminada exitosamente",
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
