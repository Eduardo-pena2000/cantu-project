import { DeleteAreaUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class DeleteAreaController implements Controller {
  constructor(private deleteAreaUseCase: DeleteAreaUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      await this.deleteAreaUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Area eliminada exitosamente",
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
