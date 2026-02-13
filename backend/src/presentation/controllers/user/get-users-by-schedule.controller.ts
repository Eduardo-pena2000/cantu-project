import { GetUsersByScheduleUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetUsersByScheduleController implements Controller {
  constructor(private getUsersByScheduleUseCase: GetUsersByScheduleUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const users = await this.getUsersByScheduleUseCase.execute(httpRequest);

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
