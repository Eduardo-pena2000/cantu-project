import { TakeAssistanceUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class TakeAssistanceController implements Controller {
  constructor(private takeAssistanceUseCase: TakeAssistanceUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const { id } = httpRequest.user!;

      const data = await this.takeAssistanceUseCase.execute({
        body: { ...httpRequest.body, taken_by_employee_id: +id },
        file: httpRequest.file,
      });

      return {
        statusCode: 201,
        message: "Asistencia tomada exitosamente",
        body: data,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
