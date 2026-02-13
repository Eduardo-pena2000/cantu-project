import { GetUsersUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetUsersController implements Controller {
  constructor(private getUserUseCase: GetUsersUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const users = await this.getUserUseCase.execute(httpRequest);

      return {
        statusCode: 200,
        message: "Usuarios obtenidos exitosamente",
        body: users,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
