import { CreateStoreUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class CreateStoreController implements Controller {
  constructor(private createStoreUseCase: CreateStoreUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const store = await this.createStoreUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Tienda creada exitosamente",
        body: store,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
