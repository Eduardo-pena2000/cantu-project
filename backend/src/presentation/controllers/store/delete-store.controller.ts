import { DeleteStoreUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class DeleteStoreController implements Controller {
  constructor(private deleteStoreUseCase: DeleteStoreUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      await this.deleteStoreUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Tienda eliminada exitosamente",
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
