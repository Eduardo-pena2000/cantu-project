import { GetUserUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetUserController implements Controller {
  constructor(private getUserUseCase: GetUserUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const user = await this.getUserUseCase.execute(httpRequest);

      return {
        statusCode: 200,
        message: "Usuario obtenido exitosamente",
        body: user,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
