import { GetActiveShiftUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetActiveScheduleController implements Controller {
  constructor(private getActiveShiftUseCase: GetActiveShiftUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const { id } = httpRequest.user!;

      const { store } = httpRequest.query;

      const data = await this.getActiveShiftUseCase.execute(+store, id);

      return {
        statusCode: 200,
        message: "Turno obtenido exitosamente",
        body: data,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
