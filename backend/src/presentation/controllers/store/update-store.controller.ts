import { UpdateStoreUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class UpdateStoreController implements Controller {
  constructor(private updateStoreUseCase: UpdateStoreUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      await this.updateStoreUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Tienda actualizada exitosamente",
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
