import { UpdateAreaUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class UpdateAreaController implements Controller {
  constructor(private updateAreaUseCase: UpdateAreaUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const data = await this.updateAreaUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Area actualizada exitosamente",
        body: data,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
