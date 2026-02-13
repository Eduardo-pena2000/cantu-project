import { CreateShiftUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class CreateShiftController implements Controller {
  constructor(private createShiftUseCase: CreateShiftUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const data = await this.createShiftUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Turno creado exitosamente",
        body: data,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
