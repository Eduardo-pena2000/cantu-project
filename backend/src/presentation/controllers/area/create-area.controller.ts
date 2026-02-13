import { CreateAreaUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class CreateAreaController implements Controller {
  constructor(private createAreaUseCase: CreateAreaUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const data = await this.createAreaUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Area creada exitosamente",
        body: data,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
