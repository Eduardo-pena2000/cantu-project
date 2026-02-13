import { GetUsersByAssistanceCurrentDayUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetUsersByAssistanceCurrentDayController implements Controller {
  constructor(private getUsersByAssistanceCurrentDayUseCase: GetUsersByAssistanceCurrentDayUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const users = await this.getUsersByAssistanceCurrentDayUseCase.execute(httpRequest);

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
