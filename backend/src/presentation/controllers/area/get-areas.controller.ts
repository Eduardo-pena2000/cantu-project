import { GetAreasUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetAreasController implements Controller {
  constructor(private getAreasUseCase: GetAreasUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const stores = await this.getAreasUseCase.execute(httpRequest);

      return {
        statusCode: 200,
        message: "Areas obtenidas exitosamente",
        body: stores,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
