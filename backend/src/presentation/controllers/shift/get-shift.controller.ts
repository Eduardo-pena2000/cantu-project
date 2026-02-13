import { GetShiftUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetShiftController implements Controller {
  constructor(private getShiftUseCase: GetShiftUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const data = await this.getShiftUseCase.execute(httpRequest);

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
