import { UpdateShiftUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class UpdateShiftController implements Controller {
  constructor(private updateShiftUseCase: UpdateShiftUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const data = await this.updateShiftUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Turno actualizado exitosamente",
        body: data,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
