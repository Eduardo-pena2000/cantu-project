import { GetShiftsUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetShiftsController implements Controller {
  constructor(private getShifstUseCase: GetShiftsUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const data = await this.getShifstUseCase.execute(httpRequest);

      return {
        statusCode: 200,
        message: "Turnos obtenidos exitosamente",
        body: data,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
