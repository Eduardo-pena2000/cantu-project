import { GetAreaUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetAreaController implements Controller {
  constructor(private getAreaUseCase: GetAreaUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const area = await this.getAreaUseCase.execute(httpRequest);

      return {
        statusCode: 200,
        message: "Area obtenida exitosamente",
        body: area,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
