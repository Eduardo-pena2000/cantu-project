import { GetStoresUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetStoresController implements Controller {
  constructor(private getStoresUseCase: GetStoresUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const stores = await this.getStoresUseCase.execute(httpRequest);

      return {
        statusCode: 200,
        message: "Tiendas obtenida exitosamente",
        body: stores,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
