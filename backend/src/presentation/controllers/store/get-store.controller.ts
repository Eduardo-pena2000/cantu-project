import { GetStoreUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetStoreController implements Controller {
  constructor(private getStoreUseCase: GetStoreUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const store = await this.getStoreUseCase.execute(httpRequest);

      return {
        statusCode: 200,
        message: "Tienda obtenida exitosamente",
        body: store,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
